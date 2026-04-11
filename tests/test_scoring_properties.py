"""
Property-Based Tests for MCQ Scoring Engine

Tests verify correctness properties:
- Property 11: Score calculation accuracy
- Property 12: Score display reflects submission
- Property 13: Pass/fail badge displays correctly
"""

import pytest
from hypothesis import given, strategies as st, settings, HealthCheck
import json
import uuid
from unittest.mock import patch, MagicMock
from decimal import Decimal
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend', 'practice'))

from scoring_service import (
    submit_practice_set,
    get_results,
    PASS_THRESHOLD,
    QUESTIONS_PER_SET
)


# Hypothesis strategies
@st.composite
def answer_combinations_strategy(draw):
    """Generate all possible answer combinations for 4 questions"""
    # Generate number of correct answers (0-4)
    correct_count = draw(st.integers(min_value=0, max_value=4))
    
    # Create answer list with correct and incorrect answers
    answers = []
    for i in range(4):
        if i < correct_count:
            answers.append(chr(65 + i))  # A, B, C, D
        else:
            # Wrong answer
            wrong_options = [chr(65 + j) for j in range(4) if j != i]
            answers.append(draw(st.sampled_from(wrong_options)))
    
    # Shuffle to randomize positions
    import random
    random.shuffle(answers)
    
    return answers


@st.composite
def question_set_strategy(draw):
    """Generate a set of 4 questions with topics"""
    topics = ['Banking', 'Finance', 'Regulation', 'Economics']
    questions = []
    
    for i in range(4):
        topic = draw(st.sampled_from(topics))
        questions.append({
            'question_id': f'q{i+1}',
            'correct_answer': chr(65 + i),  # A, B, C, D
            'topic': topic,
            'question_text': f'Question {i+1}',
            'options': ['A', 'B', 'C', 'D'],
            'difficulty': draw(st.sampled_from(['easy', 'medium', 'hard']))
        })
    
    return questions


class TestProperty11ScoreCalculationAccuracy:
    """
    Property 11: Score calculation accuracy
    
    For any submitted practice set, the score should be calculated as 
    (correct_answers / 4) × 100 and stored in the database with 100% accuracy.
    
    Validates: Requirements 4.1, 4.4
    """
    
    @given(answer_combinations_strategy())
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow])
    def test_score_equals_correct_divided_by_four_times_100(self, answers):
        """
        Property: For any answer combination, score should equal (correct/4)*100
        
        This property verifies that the scoring formula is applied correctly
        for all possible answer combinations.
        """
        with patch('scoring_service.sessions_table') as mock_sessions, \
             patch('scoring_service.scores_table') as mock_scores, \
             patch('scoring_service.questions_table') as mock_questions:
            
            session_id = str(uuid.uuid4())
            user_id = str(uuid.uuid4())
            
            # Create questions with known correct answers
            questions = [
                {'question_id': 'q1', 'correct_answer': 'A', 'topic': 'Banking'},
                {'question_id': 'q2', 'correct_answer': 'B', 'topic': 'Finance'},
                {'question_id': 'q3', 'correct_answer': 'C', 'topic': 'Banking'},
                {'question_id': 'q4', 'correct_answer': 'D', 'topic': 'Regulation'}
            ]
            
            # Mock session
            mock_sessions.get_item.return_value = {
                'Item': {
                    'session_id': session_id,
                    'user_id': user_id,
                    'question_ids': ['q1', 'q2', 'q3', 'q4'],
                    'paper_name': 'IE & IFS',
                    'created_at': 1000,
                    'user_answers': {}
                }
            }
            
            # Create user answers from the generated answers
            user_answers = {
                'q1': answers[0],
                'q2': answers[1],
                'q3': answers[2],
                'q4': answers[3]
            }
            
            # Calculate expected correct count
            expected_correct = sum(
                1 for i, answer in enumerate(answers)
                if answer == questions[i]['correct_answer']
            )
            expected_score = (expected_correct / 4) * 100
            
            with patch('scoring_service.get_questions_by_ids', return_value=questions):
                event = {
                    'action': 'submit',
                    'session_id': session_id,
                    'user_id': user_id,
                    'answers': user_answers
                }
                
                result = submit_practice_set(event)
                
                assert result['statusCode'] == 200
                body = json.loads(result['body'])
                
                # Verify score calculation
                assert body['score'] == expected_score, \
                    f"Expected score {expected_score}, got {body['score']} for answers {answers}"
                assert body['questions_correct'] == expected_correct, \
                    f"Expected {expected_correct} correct, got {body['questions_correct']}"


class TestProperty12ScoreDisplayReflectsSubmission:
    """
    Property 12: Score display reflects submission
    
    For any submitted practice set, the results display should show the user's 
    selected answer and the correct answer for each question, with correct/incorrect 
    indicators.
    
    Validates: Requirements 4.3, 4.5, 4.6
    """
    
    @given(answer_combinations_strategy(), question_set_strategy())
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow])
    def test_results_show_user_and_correct_answers(self, answers, questions):
        """
        Property: For any submission, results should show user answers and correct answers
        
        This property verifies that the results display accurately reflects what the 
        user submitted and what the correct answers were.
        """
        with patch('scoring_service.sessions_table') as mock_sessions, \
             patch('scoring_service.scores_table') as mock_scores, \
             patch('scoring_service.questions_table') as mock_questions:
            
            session_id = str(uuid.uuid4())
            user_id = str(uuid.uuid4())
            
            # Ensure questions have the right structure
            for i, q in enumerate(questions):
                q['question_id'] = f'q{i+1}'
                q['correct_answer'] = chr(65 + i)  # A, B, C, D
            
            # Mock session
            mock_sessions.get_item.return_value = {
                'Item': {
                    'session_id': session_id,
                    'user_id': user_id,
                    'question_ids': [q['question_id'] for q in questions],
                    'paper_name': 'IE & IFS',
                    'created_at': 1000,
                    'user_answers': {}
                }
            }
            
            # Create user answers
            user_answers = {
                f'q{i+1}': answers[i] for i in range(len(answers))
            }
            
            with patch('scoring_service.get_questions_by_ids', return_value=questions):
                event = {
                    'action': 'submit',
                    'session_id': session_id,
                    'user_id': user_id,
                    'answers': user_answers
                }
                
                result = submit_practice_set(event)
                
                assert result['statusCode'] == 200
                body = json.loads(result['body'])
                
                results = body['results']
                
                # Verify each result shows user answer and correct answer
                for i, result_item in enumerate(results):
                    assert result_item['user_answer'] == answers[i], \
                        f"User answer mismatch at index {i}"
                    assert result_item['correct_answer'] == questions[i]['correct_answer'], \
                        f"Correct answer mismatch at index {i}"
                    
                    # Verify correct/incorrect indicator
                    is_correct = answers[i] == questions[i]['correct_answer']
                    assert result_item['correct'] == is_correct, \
                        f"Correct indicator mismatch at index {i}"


class TestProperty13PassFailBadgeDisplaysCorrectly:
    """
    Property 13: Pass/fail badge displays correctly
    
    For any submitted practice set, if the score is ≥75%, a "Passed" badge should 
    display; if <75%, a "Review Needed" message should display.
    
    Validates: Requirements 4.7, 4.8
    """
    
    @given(st.integers(min_value=0, max_value=4))
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow])
    def test_badge_displays_based_on_score_threshold(self, correct_count):
        """
        Property: For any score, badge should be "Passed" if ≥75%, "Review Needed" if <75%
        
        This property verifies that the pass/fail badge is displayed correctly based 
        on the score threshold.
        """
        with patch('scoring_service.sessions_table') as mock_sessions, \
             patch('scoring_service.scores_table') as mock_scores, \
             patch('scoring_service.questions_table') as mock_questions:
            
            session_id = str(uuid.uuid4())
            user_id = str(uuid.uuid4())
            
            # Create questions
            questions = [
                {'question_id': 'q1', 'correct_answer': 'A', 'topic': 'Banking'},
                {'question_id': 'q2', 'correct_answer': 'B', 'topic': 'Finance'},
                {'question_id': 'q3', 'correct_answer': 'C', 'topic': 'Banking'},
                {'question_id': 'q4', 'correct_answer': 'D', 'topic': 'Regulation'}
            ]
            
            # Mock session
            mock_sessions.get_item.return_value = {
                'Item': {
                    'session_id': session_id,
                    'user_id': user_id,
                    'question_ids': ['q1', 'q2', 'q3', 'q4'],
                    'paper_name': 'IE & IFS',
                    'created_at': 1000,
                    'user_answers': {}
                }
            }
            
            # Create answers with specified number of correct answers
            user_answers = {}
            for i in range(4):
                if i < correct_count:
                    user_answers[f'q{i+1}'] = questions[i]['correct_answer']
                else:
                    # Wrong answer
                    wrong_options = [chr(65 + j) for j in range(4) if j != i]
                    user_answers[f'q{i+1}'] = wrong_options[0]
            
            # Calculate expected score
            expected_score = (correct_count / 4) * 100
            expected_passed = expected_score >= PASS_THRESHOLD
            
            with patch('scoring_service.get_questions_by_ids', return_value=questions):
                event = {
                    'action': 'submit',
                    'session_id': session_id,
                    'user_id': user_id,
                    'answers': user_answers
                }
                
                result = submit_practice_set(event)
                
                assert result['statusCode'] == 200
                body = json.loads(result['body'])
                
                # Verify badge status
                assert body['passed'] == expected_passed, \
                    f"Expected passed={expected_passed} for score {expected_score}, got {body['passed']}"
                
                if expected_passed:
                    assert body['score'] >= PASS_THRESHOLD, \
                        f"Score {body['score']} should be >= {PASS_THRESHOLD} for passed badge"
                else:
                    assert body['score'] < PASS_THRESHOLD, \
                        f"Score {body['score']} should be < {PASS_THRESHOLD} for review needed"
