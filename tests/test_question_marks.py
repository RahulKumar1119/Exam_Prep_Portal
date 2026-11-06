"""
Tests for per-question marks (issue #87): 0.5 / 1 / 2 marks, snapshot-based scoring,
dynamic maximum marks, no negative marking, decimal scores.
"""
import importlib.util
import os
import sys
from decimal import Decimal
from unittest.mock import patch

import pytest

ROOT = os.path.join(os.path.dirname(__file__), '..', 'backend')


def _load(name, rel):
    path = os.path.join(ROOT, rel)
    sys.path.insert(0, os.path.dirname(path))
    sys.path.insert(0, ROOT)
    with patch('boto3.resource'), patch('boto3.client'):
        spec = importlib.util.spec_from_file_location(name, path)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
    return mod


practice = _load('practice_lambda_marks', 'practice/lambda_function.py')
crud = _load('question_bank_crud_marks', 'question_bank/crud_service.py')


def q(qid, marks=None, difficulty='medium', answer='A', **extra):
    item = {'question_id': qid, 'question_text': f'Q {qid}', 'options': {'A': 'a', 'B': 'b', 'C': 'c', 'D': 'd'},
            'correct_answer': answer, 'difficulty': difficulty, **extra}
    if marks is not None:
        item['marks'] = Decimal(str(marks))
    return item


# ── Marks resolution / validation ─────────────────────────────────────────────

class TestResolveMarks:
    @pytest.mark.parametrize('value,expected', [(0.5, '0.5'), ('0.5', '0.5'), (1, '1'), ('1.0', '1'),
                                                (2, '2'), (Decimal('2.0'), '2')])
    def test_explicit_marks_respected(self, value, expected):
        assert practice._resolve_marks({'marks': value, 'difficulty': 'hard'}) == Decimal(expected)

    @pytest.mark.parametrize('difficulty,expected', [('easy', '0.5'), ('medium', '1'), ('hard', '2'), ('weird', '1')])
    def test_default_from_difficulty(self, difficulty, expected):
        assert practice._resolve_marks({'difficulty': difficulty}) == Decimal(expected)

    @pytest.mark.parametrize('bad', [3, 0, -1, 1.5, 'abc', 0.25])
    def test_invalid_marks_fall_back_to_difficulty(self, bad):
        assert practice._resolve_marks({'marks': bad, 'difficulty': 'easy'}) == Decimal('0.5')


class TestCrudMarksValidation:
    @pytest.mark.parametrize('value,expected', [(0.5, Decimal('0.5')), ('1', Decimal('1')), (2, Decimal('2')),
                                                (None, None), ('', None)])
    def test_valid(self, value, expected):
        ok, d, err = crud.parse_marks(value)
        assert ok and d == expected and err == ''

    @pytest.mark.parametrize('bad', [3, 0, -0.5, 1.5, 'two', True, 0.25])
    def test_rejected(self, bad):
        ok, d, err = crud.parse_marks(bad)
        assert not ok and d is None and '0.5, 1 or 2' in err


# ── Scoring ───────────────────────────────────────────────────────────────────

class TestScoreAttempt:
    def test_mixed_marks_dynamic_max_and_decimal_score(self):
        questions = [q('a', 0.5), q('b', 1), q('c', 2), q('d', 0.5), q('e', 2)]
        answers = {'a': 'A', 'b': 'B', 'c': 'A', 'd': 'A'}       # a,c,d correct; b wrong; e unanswered
        s = practice.score_attempt(questions, answers, 'practice', 'AFM')
        assert s['total_marks'] == 6            # 0.5+1+2+0.5+2, not a fixed 100
        assert s['marks_earned'] == 3           # 0.5 + 2 + 0.5
        assert s['correct_count'] == 3
        assert s['incorrect_count'] == 1
        assert s['unanswered_count'] == 1
        assert s['marks_percentage'] == 50.0

    def test_decimal_marks_earned(self):
        questions = [q('a', 0.5), q('b', 1), q('c', 2)]
        s = practice.score_attempt(questions, {'a': 'A', 'b': 'A'}, 'practice', 'PPB')
        assert s['marks_earned'] == 1.5
        assert s['total_marks'] == 3.5
        assert s['marks_percentage'] == round(1.5 / 3.5 * 100, 2)

    def test_incorrect_and_unanswered_score_zero_no_negative(self):
        questions = [q('a', 2), q('b', 1), q('c', 0.5)]
        s = practice.score_attempt(questions, {'a': 'D', 'b': ''}, 'mock_test', 'AFM')
        assert s['marks_earned'] == 0
        assert all(r['marks'] == 0 for r in s['results'])
        assert s['incorrect_count'] == 1 and s['unanswered_count'] == 2
        assert s['score'] == 0

    def test_per_question_result_carries_marks(self):
        s = practice.score_attempt([q('a', 2), q('b', 0.5)], {'a': 'A', 'b': 'C'}, 'practice', 'ABM')
        ra, rb = s['results']
        assert (ra['marks'], ra['max_marks'], ra['correct']) == (2, 2, True)
        assert (rb['marks'], rb['max_marks'], rb['correct']) == (0, 0.5, False)

    def test_mock_test_pass_is_half_of_dynamic_max(self):
        questions = [q('a', 2), q('b', 2), q('c', 1), q('d', 1)]        # max 6, pass 3
        passed = practice.score_attempt(questions, {'a': 'A', 'c': 'A'}, 'mock_test', 'IE & IFS')
        assert passed['marks_earned'] == 3 and passed['pass_marks'] == 3 and passed['passed'] is True
        failed = practice.score_attempt(questions, {'a': 'A'}, 'mock_test', 'IE & IFS')
        assert failed['marks_earned'] == 2 and failed['passed'] is False
        assert passed['score'] == 50.0          # mock score is marks-based

    def test_snapshot_wins_over_difficulty(self):
        # Snapshot says 0.5 even though the question is "hard" — attempt must not change.
        s = practice.score_attempt([q('a', 0.5, difficulty='hard')], {'a': 'A'}, 'mock_test', 'AFM')
        assert s['marks_earned'] == 0.5 and s['total_marks'] == 0.5

    def test_legacy_mock_session_without_snapshot_uses_difficulty(self):
        questions = [q('a', difficulty='easy'), q('b', difficulty='hard')]
        s = practice.score_attempt(questions, {'a': 'A', 'b': 'A'}, 'mock_test', 'AFM')
        assert s['total_marks'] == 2.5 and s['marks_earned'] == 2.5

    def test_marks_breakdown_by_category(self):
        questions = [q('a', 0.5), q('b', 0.5), q('c', 1), q('d', 2)]
        s = practice.score_attempt(questions, {'a': 'A', 'b': 'B', 'd': 'A'}, 'practice', 'RBWM')
        bd = {b['marks']: b for b in s['marks_breakdown']}
        assert bd[0.5] == {'marks': 0.5, 'total': 2, 'correct': 1, 'incorrect': 1, 'unanswered': 0,
                           'marks_earned': 0.5, 'max_marks': 1}
        assert bd[1]['unanswered'] == 1 and bd[1]['marks_earned'] == 0
        assert bd[2]['marks_earned'] == 2

    def test_unanswered_shapes(self):
        questions = [q('a', 1), q('b', 1, question_type='multi_select', correct_answers=['A', 'B']),
                     q('c', 1, question_type='drag_drop', correct_mapping={'z1': 'i1'}),
                     q('d', 1, question_type='yes_no', correct_answers=['Yes', 'No'])]
        s = practice.score_attempt(questions, {'a': None, 'b': [], 'c': {}, 'd': ['', '']}, 'practice', 'AFM')
        assert s['unanswered_count'] == 4 and s['incorrect_count'] == 0

    def test_multi_select_correct(self):
        questions = [q('a', 2, question_type='multi_select', correct_answers=['A', 'C'])]
        s = practice.score_attempt(questions, {'a': ['C', 'A']}, 'practice', 'AFM')
        assert s['marks_earned'] == 2


class TestExistingPracticeUnaffected:
    def test_practice_headline_score_stays_percent_correct(self):
        # JAIIB practice: marks reported alongside, but `score` stays % correct.
        questions = [q('a', 2), q('b', 0.5), q('c', 0.5), q('d', 0.5)]
        s = practice.score_attempt(questions, {'a': 'A'}, 'practice', 'AFM')
        assert s['score'] == 25            # 1 of 4 correct
        assert s['marks_percentage'] == round(2 / 3.5 * 100, 2)
        assert s['passed'] is False        # pass rule unchanged (>= 60%)

    def test_non_jaiib_paper_has_no_marks_fields(self):
        s = practice.score_attempt([q('a'), q('b')], {'a': 'A'}, 'practice', 'AI-300')
        assert s['score'] == 50 and s['marks_mode'] is False
        assert 'marks_earned' not in s and 'marks_breakdown' not in s

    def test_quant_negative_marking_unchanged(self):
        s = practice.score_attempt([q('a'), q('b'), q('c'), q('d')], {'a': 'A', 'b': 'B', 'c': 'C'}, 'practice', 'QUANT')
        # +1 correct, -0.25 x 2 wrong, 1 skipped
        assert s['marks_earned'] == 0.5 and s['negative_marks'] == 0.5
        assert s['score'] == 12.5
