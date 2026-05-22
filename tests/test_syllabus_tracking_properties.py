"""
Property-Based Tests for Syllabus Tracking Fix

Tests verify correctness properties:
- Property 1: Bug Condition - Weak/strong areas should be granular syllabus topics, not paper names
- Property 2: Preservation - Overall metrics, paper performance, and trend data remain unchanged

This file contains the bug condition exploration test (Task 1).
The test is EXPECTED TO FAIL on unfixed code, confirming the bug exists.
"""

import pytest
from hypothesis import given, strategies as st, settings, HealthCheck, assume
import json
import uuid
from unittest.mock import patch, MagicMock
from decimal import Decimal
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend', 'dashboard'))


# ── Syllabus reference for validation ────────────────────────────────────────
# These are the canonical IE & IFS syllabus topics that weak/strong areas should contain
IE_IFS_SYLLABUS_TOPICS = [
    # Module A - Indian Economic Architecture
    'Indian Economy overview', 'GDP and National Income', 'Economic planning',
    'Agriculture sector', 'Industrial sector', 'Service sector',
    'Inflation and price indices', 'Fiscal policy', 'Union Budget',
    'International trade', 'Economic reforms',
    # Module B - Economic Concepts Related to Banking
    'Money supply and monetary policy', 'RBI functions and role',
    'Credit creation', 'Interest rates', 'Foreign exchange',
    'Balance of payments', 'Capital account convertibility',
    # Module C - Indian Financial Architecture
    'Banking Regulation Act 1949', 'RBI Act 1934', 'SEBI', 'IRDAI',
    'PFRDA', 'Financial markets', 'Money market instruments',
    'Capital market', 'Debt market', 'Forex market', 'NABARD', 'SIDBI',
    # Module D - Financial Products and Services
    'Retail banking products', 'Corporate banking', 'Priority sector lending',
    'Financial inclusion', 'Digital banking', 'Payment systems',
    'NEFT RTGS IMPS UPI', 'Insurance products', 'Mutual funds',
    'Pension funds', 'Derivatives', 'Securitization', 'Factoring',
    'Venture capital', 'Leasing and hire purchase', 'Credit rating agencies',
]

# Paper names that should NOT appear in granular weak/strong areas
PAPER_NAMES = ['IE & IFS', 'PPB', 'AFB', 'AFM', 'RBWM']


# ── Hypothesis strategies ─────────────────────────────────────────────────────

@st.composite
def topic_performance_strategy(draw):
    """Generate a set of topics with varied performance scores.
    
    Returns a list of (topic, accuracy) tuples simulating question-level results.
    """
    # Pick 3-8 topics from the syllabus
    num_topics = draw(st.integers(min_value=3, max_value=8))
    topics = draw(st.lists(
        st.sampled_from(IE_IFS_SYLLABUS_TOPICS),
        min_size=num_topics,
        max_size=num_topics,
        unique=True
    ))
    
    # Assign accuracy to each topic (some weak < 50%, some strong >= 70%)
    topic_performance = []
    for topic in topics:
        # Ensure we have at least one weak and one strong topic
        accuracy = draw(st.floats(min_value=0.0, max_value=100.0))
        num_questions = draw(st.integers(min_value=2, max_value=10))
        topic_performance.append((topic, accuracy, num_questions))
    
    return topic_performance


@st.composite
def completed_sessions_strategy(draw):
    """Generate completed sessions with question-level topic data for IE & IFS paper.
    
    Creates realistic session data that would be returned by DynamoDB query.
    """
    topic_perf = draw(topic_performance_strategy())
    
    # Build questions list with topic data and user answers
    sessions = []
    session_id = str(uuid.uuid4())
    user_id = 'test-user-' + str(uuid.uuid4())[:8]
    
    questions = []
    user_answers = {}
    
    for topic, accuracy, num_questions in topic_perf:
        num_correct = int(num_questions * accuracy / 100)
        
        for i in range(num_questions):
            qid = str(uuid.uuid4())
            correct_answer = 'A'
            
            # Simulate correct/incorrect based on accuracy
            if i < num_correct:
                user_answer = 'A'  # correct
            else:
                user_answer = 'B'  # incorrect
            
            questions.append({
                'question_id': qid,
                'question_text': f'Question about {topic}',
                'options': {'A': 'Option A', 'B': 'Option B', 'C': 'Option C', 'D': 'Option D'},
                'correct_answer': correct_answer,
                'topic': topic,
                'difficulty': 'medium',
            })
            user_answers[qid] = user_answer
    
    session = {
        'session_id': session_id,
        'user_id': user_id,
        'paper_name': 'IE & IFS',
        'status': 'completed',
        'score': Decimal('65'),
        'time_taken': 300,
        'submitted_at': '2024-01-15T10:00:00',
        'questions': questions,
        'user_answers': user_answers,
    }
    
    return user_id, [session], topic_perf


# ── Bug Condition Exploration Tests ───────────────────────────────────────────

class TestProperty1BugConditionExploration:
    """
    Property 1: Bug Condition - Paper-Level Weak/Strong Areas Instead of Granular Topics
    
    CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists.
    DO NOT attempt to fix the test or the code when it fails.
    
    The bug: get_dashboard_data() returns weak_areas/strong_areas containing paper names
    (e.g., "IE & IFS") instead of granular syllabus topics (e.g., "SEBI", "Money supply").
    
    Validates: Requirements 1.1, 1.2, 1.3, 1.4
    """

    @given(completed_sessions_strategy())
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow], deadline=None)
    def test_weak_areas_contain_syllabus_topics_not_paper_names(self, session_data):
        """
        Property: For any user with completed sessions containing varied topic performance,
        weak_areas should contain syllabus-aligned topic names, NOT paper names like "IE & IFS".
        Additionally, recommended_areas must be present.
        
        EXPECTED TO FAIL on unfixed code (demonstrates the bug).
        """
        user_id, sessions, topic_perf = session_data
        
        # Ensure we have at least one weak topic (accuracy < 50%)
        has_weak = any(acc < 50 for _, acc, _ in topic_perf)
        assume(has_weak)
        
        with patch('lambda_function.sessions_table') as mock_sessions:
            mock_sessions.query.return_value = {'Items': sessions}
            
            from lambda_function import get_dashboard_data
            result = get_dashboard_data(user_id)
        
        weak_areas = result.get('weak_areas', [])
        
        # The bug: weak_areas contains paper names instead of topic names
        # After fix: weak_areas should contain syllabus-aligned topics
        if weak_areas:
            # None of the weak areas should be a paper name
            for area in weak_areas:
                area_name = area if isinstance(area, str) else area.get('topic', area)
                assert area_name not in PAPER_NAMES, (
                    f"Bug confirmed: weak_areas contains paper name '{area_name}' "
                    f"instead of granular syllabus topics"
                )
            
            # All weak areas should be valid syllabus topics
            for area in weak_areas:
                area_name = area if isinstance(area, str) else area.get('topic', area)
                assert area_name in IE_IFS_SYLLABUS_TOPICS, (
                    f"weak_areas contains '{area_name}' which is not a valid "
                    f"syllabus topic from IE & IFS"
                )
        
        # recommended_areas must exist in the response
        assert 'recommended_areas' in result, (
            "Bug confirmed: 'recommended_areas' key is missing from dashboard response. "
            "The system provides no guidance on which topics to practice next."
        )

    @given(completed_sessions_strategy())
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow], deadline=None)
    def test_strong_areas_contain_syllabus_topics_not_paper_names(self, session_data):
        """
        Property: For any user with completed sessions containing high-performing topics,
        strong_areas should contain syllabus-aligned topic names, NOT paper names.
        
        EXPECTED TO FAIL on unfixed code (demonstrates the bug).
        """
        user_id, sessions, topic_perf = session_data
        
        # Ensure we have at least one strong topic (accuracy >= 70%)
        has_strong = any(acc >= 70 for _, acc, _ in topic_perf)
        assume(has_strong)
        
        with patch('lambda_function.sessions_table') as mock_sessions:
            mock_sessions.query.return_value = {'Items': sessions}
            
            from lambda_function import get_dashboard_data
            result = get_dashboard_data(user_id)
        
        strong_areas = result.get('strong_areas', [])
        
        # After fix: strong_areas should contain syllabus-aligned topics
        if strong_areas:
            for area in strong_areas:
                area_name = area if isinstance(area, str) else area.get('topic', area)
                assert area_name not in PAPER_NAMES, (
                    f"Bug confirmed: strong_areas contains paper name '{area_name}' "
                    f"instead of granular syllabus topics"
                )
            
            for area in strong_areas:
                area_name = area if isinstance(area, str) else area.get('topic', area)
                assert area_name in IE_IFS_SYLLABUS_TOPICS, (
                    f"strong_areas contains '{area_name}' which is not a valid "
                    f"syllabus topic from IE & IFS"
                )

    @given(completed_sessions_strategy())
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow], deadline=None)
    def test_recommended_areas_present_when_coverage_gaps_exist(self, session_data):
        """
        Property: For any user with completed sessions that don't cover all syllabus topics,
        the dashboard should return a non-empty 'recommended_areas' list.
        
        EXPECTED TO FAIL on unfixed code (recommended_areas doesn't exist).
        """
        user_id, sessions, topic_perf = session_data
        
        # The user hasn't attempted all topics (topic_perf has 3-8 topics out of 46+)
        # So there are always coverage gaps
        attempted_topics = {t for t, _, _ in topic_perf}
        coverage_gaps = set(IE_IFS_SYLLABUS_TOPICS) - attempted_topics
        assume(len(coverage_gaps) > 0)
        
        with patch('lambda_function.sessions_table') as mock_sessions:
            mock_sessions.query.return_value = {'Items': sessions}
            
            from lambda_function import get_dashboard_data
            result = get_dashboard_data(user_id)
        
        # The bug: recommended_areas key doesn't exist at all
        assert 'recommended_areas' in result, (
            "Bug confirmed: 'recommended_areas' key is missing from dashboard response. "
            "The system provides no guidance on which topics to practice next."
        )
        
        recommended = result.get('recommended_areas', [])
        assert len(recommended) > 0, (
            f"Bug confirmed: recommended_areas is empty despite {len(coverage_gaps)} "
            f"syllabus topics not yet attempted by the user."
        )

    def test_concrete_example_paper_level_weak_areas(self):
        """
        Concrete test case: User has varied topic performance within IE & IFS,
        but weak_areas returns "IE & IFS" instead of specific weak topics.
        
        This is a deterministic test that clearly demonstrates the bug.
        EXPECTED TO FAIL on unfixed code.
        """
        user_id = 'test-user-concrete'
        
        # Session with questions from multiple topics, varied performance
        questions = [
            # SEBI questions - user gets 0/3 correct (weak topic)
            {'question_id': 'q1', 'question_text': 'Q1', 'options': {'A': 'a', 'B': 'b', 'C': 'c', 'D': 'd'},
             'correct_answer': 'A', 'topic': 'SEBI', 'difficulty': 'medium'},
            {'question_id': 'q2', 'question_text': 'Q2', 'options': {'A': 'a', 'B': 'b', 'C': 'c', 'D': 'd'},
             'correct_answer': 'A', 'topic': 'SEBI', 'difficulty': 'medium'},
            {'question_id': 'q3', 'question_text': 'Q3', 'options': {'A': 'a', 'B': 'b', 'C': 'c', 'D': 'd'},
             'correct_answer': 'A', 'topic': 'SEBI', 'difficulty': 'medium'},
            # Banking Regulation Act 1949 - user gets 3/3 correct (strong topic)
            {'question_id': 'q4', 'question_text': 'Q4', 'options': {'A': 'a', 'B': 'b', 'C': 'c', 'D': 'd'},
             'correct_answer': 'B', 'topic': 'Banking Regulation Act 1949', 'difficulty': 'medium'},
            {'question_id': 'q5', 'question_text': 'Q5', 'options': {'A': 'a', 'B': 'b', 'C': 'c', 'D': 'd'},
             'correct_answer': 'B', 'topic': 'Banking Regulation Act 1949', 'difficulty': 'medium'},
            {'question_id': 'q6', 'question_text': 'Q6', 'options': {'A': 'a', 'B': 'b', 'C': 'c', 'D': 'd'},
             'correct_answer': 'B', 'topic': 'Banking Regulation Act 1949', 'difficulty': 'medium'},
            # Money supply and monetary policy - user gets 1/3 correct (weak topic)
            {'question_id': 'q7', 'question_text': 'Q7', 'options': {'A': 'a', 'B': 'b', 'C': 'c', 'D': 'd'},
             'correct_answer': 'C', 'topic': 'Money supply and monetary policy', 'difficulty': 'medium'},
            {'question_id': 'q8', 'question_text': 'Q8', 'options': {'A': 'a', 'B': 'b', 'C': 'c', 'D': 'd'},
             'correct_answer': 'C', 'topic': 'Money supply and monetary policy', 'difficulty': 'medium'},
            {'question_id': 'q9', 'question_text': 'Q9', 'options': {'A': 'a', 'B': 'b', 'C': 'c', 'D': 'd'},
             'correct_answer': 'C', 'topic': 'Money supply and monetary policy', 'difficulty': 'medium'},
        ]
        
        user_answers = {
            'q1': 'B', 'q2': 'C', 'q3': 'D',  # All wrong for SEBI
            'q4': 'B', 'q5': 'B', 'q6': 'B',  # All correct for Banking Regulation
            'q7': 'C', 'q8': 'A', 'q9': 'D',  # 1 correct for Money supply
        }
        
        session = {
            'session_id': 'session-concrete-1',
            'user_id': user_id,
            'paper_name': 'IE & IFS',
            'status': 'completed',
            'score': Decimal('44'),
            'time_taken': 600,
            'submitted_at': '2024-01-15T10:00:00',
            'questions': questions,
            'user_answers': user_answers,
        }
        
        with patch('lambda_function.sessions_table') as mock_sessions:
            mock_sessions.query.return_value = {'Items': [session]}
            
            from lambda_function import get_dashboard_data
            result = get_dashboard_data(user_id)
        
        weak_areas = result.get('weak_areas', [])
        strong_areas = result.get('strong_areas', [])
        
        # Bug assertion: weak_areas should contain specific topics, not paper names
        # On unfixed code, this will fail because weak_areas contains "IE & IFS" or
        # the topics won't be validated against the syllabus
        assert len(weak_areas) > 0, "Expected weak areas to be identified"
        
        for area in weak_areas:
            area_name = area if isinstance(area, str) else area.get('topic', area)
            assert area_name not in PAPER_NAMES, (
                f"Bug confirmed: weak_areas contains paper name '{area_name}'. "
                f"Expected granular topics like 'SEBI' or 'Money supply and monetary policy'."
            )
            assert area_name in IE_IFS_SYLLABUS_TOPICS, (
                f"weak_areas contains '{area_name}' which is not in the canonical "
                f"IE & IFS syllabus. Topics should be normalized to syllabus entries."
            )
        
        # Verify recommended_areas exists
        assert 'recommended_areas' in result, (
            "Bug confirmed: 'recommended_areas' key is missing from dashboard response."
        )


# ── Preservation Property Tests (Task 2) ─────────────────────────────────────
# These tests capture the CURRENT behavior of get_dashboard_data() that must be
# preserved after the bugfix. They should PASS on unfixed code.

# ── Hypothesis strategies for preservation tests ──────────────────────────────

VALID_PAPERS = ['IE & IFS', 'PPB', 'AFB', 'RBWM']


@st.composite
def session_config_strategy(draw):
    """Generate a configuration of completed sessions with varied papers and scores.
    
    Returns (user_id, sessions_list) where sessions have no question-level data
    (simulating the preservation domain: metrics, paper_performance, trend_data).
    """
    user_id = 'preservation-user-' + draw(st.text(
        alphabet=st.characters(whitelist_categories=('Ll', 'Nd')),
        min_size=4, max_size=8
    ))
    
    num_sessions = draw(st.integers(min_value=1, max_value=15))
    sessions = []
    
    for i in range(num_sessions):
        paper = draw(st.sampled_from(VALID_PAPERS))
        score = draw(st.integers(min_value=0, max_value=100))
        time_taken = draw(st.integers(min_value=0, max_value=3600))
        # Generate dates that sort lexicographically (ISO format)
        day = draw(st.integers(min_value=1, max_value=28))
        month = draw(st.integers(min_value=1, max_value=12))
        year = draw(st.sampled_from([2024, 2025]))
        hour = draw(st.integers(min_value=0, max_value=23))
        minute = draw(st.integers(min_value=0, max_value=59))
        submitted_at = f'{year}-{month:02d}-{day:02d}T{hour:02d}:{minute:02d}:00'
        
        sessions.append({
            'session_id': f'session-{i}',
            'user_id': user_id,
            'paper_name': paper,
            'status': 'completed',
            'score': Decimal(str(score)),
            'time_taken': time_taken,
            'submitted_at': submitted_at,
            'questions': [],
            'user_answers': {},
        })
    
    return user_id, sessions


@st.composite
def mixed_status_session_strategy(draw):
    """Generate sessions with mixed statuses (completed + in_progress).
    
    This tests that only completed sessions are counted in metrics.
    """
    user_id = 'mixed-user-' + draw(st.text(
        alphabet=st.characters(whitelist_categories=('Ll', 'Nd')),
        min_size=4, max_size=8
    ))
    
    num_completed = draw(st.integers(min_value=1, max_value=10))
    num_in_progress = draw(st.integers(min_value=0, max_value=5))
    sessions = []
    
    for i in range(num_completed):
        paper = draw(st.sampled_from(VALID_PAPERS))
        score = draw(st.integers(min_value=0, max_value=100))
        time_taken = draw(st.integers(min_value=0, max_value=3600))
        day = draw(st.integers(min_value=1, max_value=28))
        month = draw(st.integers(min_value=1, max_value=12))
        submitted_at = f'2024-{month:02d}-{day:02d}T10:00:00'
        
        sessions.append({
            'session_id': f'completed-{i}',
            'user_id': user_id,
            'paper_name': paper,
            'status': 'completed',
            'score': Decimal(str(score)),
            'time_taken': time_taken,
            'submitted_at': submitted_at,
            'questions': [],
            'user_answers': {},
        })
    
    for i in range(num_in_progress):
        paper = draw(st.sampled_from(VALID_PAPERS))
        time_taken = draw(st.integers(min_value=0, max_value=1800))
        
        sessions.append({
            'session_id': f'in-progress-{i}',
            'user_id': user_id,
            'paper_name': paper,
            'status': 'in_progress',
            'score': Decimal('0'),
            'time_taken': time_taken,
            'questions': [],
            'user_answers': {},
        })
    
    return user_id, sessions, num_completed


# ── Preservation Test Class ───────────────────────────────────────────────────

class TestProperty2Preservation:
    """
    Property 2: Preservation - Unchanged Metrics, Paper Performance, and Trend Data
    
    These tests verify that the existing behavior of get_dashboard_data() is preserved
    after the bugfix. They should PASS on UNFIXED code (confirming baseline behavior).
    
    Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6
    """

    # ── Property: Empty user returns default zeros/empty values ────────────────

    @given(st.text(
        alphabet=st.characters(whitelist_categories=('Ll', 'Nd')),
        min_size=4, max_size=20
    ))
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow], deadline=None)
    def test_no_sessions_returns_default_metrics(self, user_id_suffix):
        """
        Property: For all users with no completed sessions, metrics are all zero/None
        and lists are empty.
        
        Validates: Requirement 3.1
        """
        user_id = f'empty-{user_id_suffix}'
        
        with patch('lambda_function.sessions_table') as mock_sessions:
            mock_sessions.query.return_value = {'Items': []}
            
            from lambda_function import get_dashboard_data
            result = get_dashboard_data(user_id)
        
        metrics = result['metrics']
        
        # All metrics should be zero/None for empty user
        assert metrics['overall_score'] == 0, (
            f"Expected overall_score=0 for empty user, got {metrics['overall_score']}"
        )
        assert metrics['total_sessions'] == 0, (
            f"Expected total_sessions=0 for empty user, got {metrics['total_sessions']}"
        )
        assert metrics['average_score'] == 0, (
            f"Expected average_score=0 for empty user, got {metrics['average_score']}"
        )
        assert metrics['total_study_time'] == 0, (
            f"Expected total_study_time=0 for empty user, got {metrics['total_study_time']}"
        )
        assert metrics['last_session_date'] is None, (
            f"Expected last_session_date=None for empty user, got {metrics['last_session_date']}"
        )
        
        # Lists should be empty
        assert result['paper_performance'] == [], (
            f"Expected empty paper_performance for empty user, got {result['paper_performance']}"
        )
        assert result['trend_data'] == [], (
            f"Expected empty trend_data for empty user, got {result['trend_data']}"
        )

    # ── Property: overall_score = max, average_score = mean, total_sessions = count ──

    @given(session_config_strategy())
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow], deadline=None)
    def test_metrics_computation_correct(self, session_data):
        """
        Property: For all session configurations, overall_score equals the max score,
        average_score equals mean of scores, total_sessions equals count of completed sessions.
        
        Validates: Requirement 3.2
        """
        user_id, sessions = session_data
        
        with patch('lambda_function.sessions_table') as mock_sessions:
            mock_sessions.query.return_value = {'Items': sessions}
            
            from lambda_function import get_dashboard_data
            result = get_dashboard_data(user_id)
        
        metrics = result['metrics']
        completed = [s for s in sessions if s.get('status') == 'completed']
        
        # total_sessions = count of completed sessions
        assert metrics['total_sessions'] == len(completed), (
            f"Expected total_sessions={len(completed)}, got {metrics['total_sessions']}"
        )
        
        if completed:
            scores = [float(s['score']) for s in completed]
            expected_max = round(max(scores), 1)
            expected_avg = round(sum(scores) / len(scores), 1)
            
            # overall_score = max score (rounded to 1 decimal)
            assert metrics['overall_score'] == expected_max, (
                f"Expected overall_score={expected_max}, got {metrics['overall_score']}"
            )
            
            # average_score = mean of scores (rounded to 1 decimal)
            assert metrics['average_score'] == expected_avg, (
                f"Expected average_score={expected_avg}, got {metrics['average_score']}"
            )
            
            # total_study_time = sum of ALL sessions' time_taken (including in_progress)
            expected_time = sum(int(s.get('time_taken', 0)) for s in sessions)
            assert metrics['total_study_time'] == expected_time, (
                f"Expected total_study_time={expected_time}, got {metrics['total_study_time']}"
            )
            
            # last_session_date = max submitted_at among completed sessions
            expected_last_date = max(
                (s.get('submitted_at', '') for s in completed), default=None
            )
            assert metrics['last_session_date'] == expected_last_date, (
                f"Expected last_session_date={expected_last_date}, "
                f"got {metrics['last_session_date']}"
            )

    # ── Property: paper_performance groups correctly by paper_name ─────────────

    @given(session_config_strategy())
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow], deadline=None)
    def test_paper_performance_groups_correctly(self, session_data):
        """
        Property: For all session configurations, paper_performance groups correctly
        by paper_name with correct averages and session counts.
        
        Validates: Requirement 3.3
        """
        user_id, sessions = session_data
        
        with patch('lambda_function.sessions_table') as mock_sessions:
            mock_sessions.query.return_value = {'Items': sessions}
            
            from lambda_function import get_dashboard_data
            result = get_dashboard_data(user_id)
        
        paper_performance = result['paper_performance']
        completed = [s for s in sessions if s.get('status') == 'completed']
        
        # Compute expected paper stats
        expected_papers = {}
        for s in completed:
            paper = s.get('paper_name', 'Unknown')
            expected_papers.setdefault(paper, []).append(float(s['score']))
        
        # Same number of papers
        assert len(paper_performance) == len(expected_papers), (
            f"Expected {len(expected_papers)} papers in performance, "
            f"got {len(paper_performance)}"
        )
        
        # Verify each paper's data
        result_by_paper = {p['paper_name']: p for p in paper_performance}
        
        for paper, scores in expected_papers.items():
            assert paper in result_by_paper, (
                f"Paper '{paper}' missing from paper_performance"
            )
            
            pp = result_by_paper[paper]
            expected_avg = round(sum(scores) / len(scores), 1)
            expected_count = len(scores)
            
            assert pp['average_score'] == expected_avg, (
                f"Paper '{paper}': expected average_score={expected_avg}, "
                f"got {pp['average_score']}"
            )
            assert pp['sessions_completed'] == expected_count, (
                f"Paper '{paper}': expected sessions_completed={expected_count}, "
                f"got {pp['sessions_completed']}"
            )

    # ── Property: trend_data contains at most 10 entries sorted by submitted_at ──

    @given(session_config_strategy())
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow], deadline=None)
    def test_trend_data_at_most_10_sorted(self, session_data):
        """
        Property: For all session configurations, trend_data contains at most 10 entries
        sorted by submitted_at (ascending), representing the last 10 completed sessions.
        
        Validates: Requirement 3.4
        """
        user_id, sessions = session_data
        
        with patch('lambda_function.sessions_table') as mock_sessions:
            mock_sessions.query.return_value = {'Items': sessions}
            
            from lambda_function import get_dashboard_data
            result = get_dashboard_data(user_id)
        
        trend_data = result['trend_data']
        completed = [s for s in sessions if s.get('status') == 'completed']
        
        # At most 10 entries
        assert len(trend_data) <= 10, (
            f"Expected at most 10 trend entries, got {len(trend_data)}"
        )
        
        # Number of entries = min(len(completed), 10)
        expected_count = min(len(completed), 10)
        assert len(trend_data) == expected_count, (
            f"Expected {expected_count} trend entries, got {len(trend_data)}"
        )
        
        # Entries are sorted by date (ascending)
        dates = [entry['date'] for entry in trend_data]
        assert dates == sorted(dates), (
            f"Trend data not sorted by date. Got dates: {dates}"
        )
        
        # Each entry has 'date' and 'score' keys
        for entry in trend_data:
            assert 'date' in entry, "Trend entry missing 'date' key"
            assert 'score' in entry, "Trend entry missing 'score' key"
        
        # The entries correspond to the last 10 completed sessions by date
        sorted_completed = sorted(completed, key=lambda x: x.get('submitted_at', ''))
        expected_last_10 = sorted_completed[-10:]
        
        for i, entry in enumerate(trend_data):
            expected_session = expected_last_10[i]
            assert entry['date'] == expected_session.get('submitted_at', ''), (
                f"Trend entry {i}: expected date={expected_session.get('submitted_at')}, "
                f"got {entry['date']}"
            )
            assert entry['score'] == float(expected_session.get('score', 0)), (
                f"Trend entry {i}: expected score={float(expected_session.get('score', 0))}, "
                f"got {entry['score']}"
            )

    # ── Property: Mixed status sessions - only completed count in metrics ──────

    @given(mixed_status_session_strategy())
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow], deadline=None)
    def test_only_completed_sessions_in_metrics(self, session_data):
        """
        Property: For sessions with mixed statuses, only completed sessions are counted
        in total_sessions, average_score, overall_score, paper_performance, and trend_data.
        total_study_time includes ALL sessions (completed + in_progress).
        
        Validates: Requirements 3.2, 3.3, 3.4
        """
        user_id, sessions, num_completed = session_data
        
        with patch('lambda_function.sessions_table') as mock_sessions:
            mock_sessions.query.return_value = {'Items': sessions}
            
            from lambda_function import get_dashboard_data
            result = get_dashboard_data(user_id)
        
        metrics = result['metrics']
        
        # total_sessions counts only completed
        assert metrics['total_sessions'] == num_completed, (
            f"Expected total_sessions={num_completed} (completed only), "
            f"got {metrics['total_sessions']}"
        )
        
        # total_study_time includes ALL sessions
        expected_time = sum(int(s.get('time_taken', 0)) for s in sessions)
        assert metrics['total_study_time'] == expected_time, (
            f"Expected total_study_time={expected_time} (all sessions), "
            f"got {metrics['total_study_time']}"
        )
        
        # trend_data only includes completed sessions
        completed = [s for s in sessions if s.get('status') == 'completed']
        expected_trend_count = min(len(completed), 10)
        assert len(result['trend_data']) == expected_trend_count, (
            f"Expected {expected_trend_count} trend entries (completed only), "
            f"got {len(result['trend_data'])}"
        )
        
        # paper_performance only includes completed sessions
        total_pp_sessions = sum(
            p['sessions_completed'] for p in result['paper_performance']
        )
        assert total_pp_sessions == num_completed, (
            f"Expected paper_performance total sessions={num_completed}, "
            f"got {total_pp_sessions}"
        )

    # ── Concrete preservation test: verify exact output format ─────────────────

    def test_concrete_empty_user_defaults(self):
        """
        Concrete test: Verify exact default values for a user with no sessions.
        
        Validates: Requirement 3.1
        """
        with patch('lambda_function.sessions_table') as mock_sessions:
            mock_sessions.query.return_value = {'Items': []}
            
            from lambda_function import get_dashboard_data
            result = get_dashboard_data('no-sessions-user')
        
        # Exact expected structure
        assert result['metrics'] == {
            'overall_score': 0,
            'total_sessions': 0,
            'average_score': 0,
            'total_study_time': 0,
            'last_session_date': None,
        }
        assert result['paper_performance'] == []
        assert result['weak_areas'] == []
        assert result['strong_areas'] == []
        assert result['trend_data'] == []
        assert result['topic_accuracy'] == {}

    def test_concrete_multi_paper_performance(self):
        """
        Concrete test: Verify paper_performance with multiple papers.
        
        Validates: Requirements 3.2, 3.3, 3.4
        """
        sessions = [
            {'session_id': 's1', 'user_id': 'u1', 'paper_name': 'IE & IFS',
             'status': 'completed', 'score': Decimal('70'), 'time_taken': 300,
             'submitted_at': '2024-01-10T10:00:00', 'questions': [], 'user_answers': {}},
            {'session_id': 's2', 'user_id': 'u1', 'paper_name': 'IE & IFS',
             'status': 'completed', 'score': Decimal('80'), 'time_taken': 350,
             'submitted_at': '2024-01-11T10:00:00', 'questions': [], 'user_answers': {}},
            {'session_id': 's3', 'user_id': 'u1', 'paper_name': 'PPB',
             'status': 'completed', 'score': Decimal('60'), 'time_taken': 250,
             'submitted_at': '2024-01-12T10:00:00', 'questions': [], 'user_answers': {}},
            {'session_id': 's4', 'user_id': 'u1', 'paper_name': 'PPB',
             'status': 'completed', 'score': Decimal('90'), 'time_taken': 400,
             'submitted_at': '2024-01-13T10:00:00', 'questions': [], 'user_answers': {}},
            {'session_id': 's5', 'user_id': 'u1', 'paper_name': 'AFB',
             'status': 'completed', 'score': Decimal('55'), 'time_taken': 200,
             'submitted_at': '2024-01-14T10:00:00', 'questions': [], 'user_answers': {}},
        ]
        
        with patch('lambda_function.sessions_table') as mock_sessions:
            mock_sessions.query.return_value = {'Items': sessions}
            
            from lambda_function import get_dashboard_data
            result = get_dashboard_data('u1')
        
        metrics = result['metrics']
        
        # overall_score = max(70, 80, 60, 90, 55) = 90.0
        assert metrics['overall_score'] == 90.0
        # total_sessions = 5 completed
        assert metrics['total_sessions'] == 5
        # average_score = (70+80+60+90+55)/5 = 71.0
        assert metrics['average_score'] == 71.0
        # total_study_time = 300+350+250+400+200 = 1500
        assert metrics['total_study_time'] == 1500
        # last_session_date = max date
        assert metrics['last_session_date'] == '2024-01-14T10:00:00'
        
        # Paper performance
        pp_by_paper = {p['paper_name']: p for p in result['paper_performance']}
        
        assert 'IE & IFS' in pp_by_paper
        assert pp_by_paper['IE & IFS']['average_score'] == 75.0  # (70+80)/2
        assert pp_by_paper['IE & IFS']['sessions_completed'] == 2
        
        assert 'PPB' in pp_by_paper
        assert pp_by_paper['PPB']['average_score'] == 75.0  # (60+90)/2
        assert pp_by_paper['PPB']['sessions_completed'] == 2
        
        assert 'AFB' in pp_by_paper
        assert pp_by_paper['AFB']['average_score'] == 55.0
        assert pp_by_paper['AFB']['sessions_completed'] == 1
        
        # Trend data - all 5 sessions sorted by date
        assert len(result['trend_data']) == 5
        assert result['trend_data'][0] == {'date': '2024-01-10T10:00:00', 'score': 70.0}
        assert result['trend_data'][-1] == {'date': '2024-01-14T10:00:00', 'score': 55.0}

    def test_concrete_trend_data_capped_at_10(self):
        """
        Concrete test: Verify trend_data is capped at 10 entries (last 10 by date).
        
        Validates: Requirement 3.4
        """
        sessions = []
        for i in range(15):
            sessions.append({
                'session_id': f's{i}', 'user_id': 'u1', 'paper_name': 'IE & IFS',
                'status': 'completed', 'score': Decimal(str(50 + i * 3)),
                'time_taken': 100 + i * 10,
                'submitted_at': f'2024-01-{i+1:02d}T10:00:00',
                'questions': [], 'user_answers': {},
            })
        
        with patch('lambda_function.sessions_table') as mock_sessions:
            mock_sessions.query.return_value = {'Items': sessions}
            
            from lambda_function import get_dashboard_data
            result = get_dashboard_data('u1')
        
        trend_data = result['trend_data']
        
        # Capped at 10
        assert len(trend_data) == 10
        
        # Should be the LAST 10 sessions (sessions 5-14, dates Jan 6 - Jan 15)
        assert trend_data[0]['date'] == '2024-01-06T10:00:00'
        assert trend_data[-1]['date'] == '2024-01-15T10:00:00'
        
        # Scores match: session 5 has score 50+5*3=65, session 14 has 50+14*3=92
        assert trend_data[0]['score'] == 65.0
        assert trend_data[-1]['score'] == 92.0
        
        # Sorted ascending
        dates = [e['date'] for e in trend_data]
        assert dates == sorted(dates)
