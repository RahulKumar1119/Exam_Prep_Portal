"""
Property-Based Tests for Practice Set Generation

Tests verify correctness properties:
- Property 7: Practice set contains unique questions
- Property 8: Adaptive selection favors weak areas
"""

import pytest
from hypothesis import given, strategies as st, settings, HealthCheck
import json
import uuid
from unittest.mock import patch, MagicMock
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend', 'practice'))

from lambda_function import (
    select_random_questions,
    select_adaptive_questions,
    identify_weak_areas,
    QUESTIONS_PER_SET,
    WEAK_AREA_THRESHOLD
)


# Hypothesis strategies
@st.composite
def mock_questions_strategy(draw):
    """Generate mock questions for testing"""
    count = draw(st.integers(min_value=4, max_value=20))
    topics = draw(st.lists(
        st.text(alphabet='abcdefghijklmnopqrstuvwxyz', min_size=3, max_size=10),
        min_size=1,
        max_size=5,
        unique=True
    ))
    
    questions = []
    for i in range(count):
        topic = draw(st.sampled_from(topics))
        questions.append({
            'question_id': f'q{i}',
            'question_text': f'Question {i}',
            'options': ['A', 'B', 'C', 'D'],
            'topic': topic,
            'difficulty': draw(st.sampled_from(['easy', 'medium', 'hard']))
        })
    
    return questions


@st.composite
def user_performance_strategy(draw):
    """Generate user performance data for testing"""
    topics = draw(st.lists(
        st.text(alphabet='abcdefghijklmnopqrstuvwxyz', min_size=3, max_size=10),
        min_size=1,
        max_size=5,
        unique=True
    ))
    
    topic_accuracy = {}
    for topic in topics:
        accuracy = draw(st.floats(min_value=0.0, max_value=1.0))
        topic_accuracy[topic] = {'percentage': accuracy}
    
    return {
        'completed_sessions': [],
        'topic_accuracy': topic_accuracy
    }


class TestProperty7PracticeSetUniqueness:
    """
    Property 7: Practice set contains unique questions
    
    For any practice set generated for a user, the set should contain exactly 4 unique 
    questions from the selected paper's question bank with no duplicates.
    
    Validates: Requirements 2.2, 2.3
    """
    
    @given(mock_questions_strategy())
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow])
    def test_random_selection_returns_unique_questions(self, mock_questions):
        """
        Property: For any set of available questions, random selection should return 
        exactly 4 unique questions with no duplicates.
        """
        with patch('lambda_function.questions_table') as mock_table:
            mock_table.query.return_value = {'Items': mock_questions}
            
            result = select_random_questions('IE & IFS', QUESTIONS_PER_SET)
            
            # Verify exactly 4 questions returned
            assert len(result) == QUESTIONS_PER_SET, \
                f"Expected {QUESTIONS_PER_SET} questions, got {len(result)}"
            
            # Verify all questions are unique
            question_ids = [q['question_id'] for q in result]
            assert len(question_ids) == len(set(question_ids)), \
                f"Duplicate questions found: {question_ids}"
            
            # Verify all questions have required fields
            for q in result:
                assert 'question_id' in q
                assert 'question_text' in q
                assert 'options' in q
                assert len(q['options']) == 4
    
    @given(mock_questions_strategy())
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow])
    def test_adaptive_selection_returns_unique_questions(self, mock_questions):
        """
        Property: For any set of available questions and weak areas, adaptive selection 
        should return exactly 4 unique questions with no duplicates.
        """
        # Extract some topics as weak areas
        topics = list(set(q['topic'] for q in mock_questions))
        weak_areas = topics[:max(1, len(topics) // 2)]
        
        with patch('lambda_function.questions_table') as mock_table:
            mock_table.query.return_value = {'Items': mock_questions}
            
            result = select_adaptive_questions('IE & IFS', weak_areas, QUESTIONS_PER_SET)
            
            # Verify exactly 4 questions returned (or fewer if not enough available)
            expected_count = min(QUESTIONS_PER_SET, len(mock_questions))
            assert len(result) == expected_count, \
                f"Expected {expected_count} questions, got {len(result)}"
            
            # Verify all questions are unique
            question_ids = [q['question_id'] for q in result]
            assert len(question_ids) == len(set(question_ids)), \
                f"Duplicate questions found: {question_ids}"
    
    @given(st.integers(min_value=1, max_value=3))
    @settings(max_examples=5)
    def test_selection_handles_insufficient_questions(self, available_count):
        """
        Property: For any number of available questions less than 4, selection should 
        return all available questions without duplicates.
        """
        mock_questions = [
            {
                'question_id': f'q{i}',
                'question_text': f'Question {i}',
                'options': ['A', 'B', 'C', 'D'],
                'topic': 'Banking'
            }
            for i in range(available_count)
        ]
        
        with patch('lambda_function.questions_table') as mock_table:
            mock_table.query.return_value = {'Items': mock_questions}
            
            result = select_random_questions('IE & IFS', QUESTIONS_PER_SET)
            
            # Should return all available questions
            assert len(result) == available_count
            
            # All should be unique
            question_ids = [q['question_id'] for q in result]
            assert len(question_ids) == len(set(question_ids))


class TestProperty8AdaptiveSelection:
    """
    Property 8: Adaptive selection favors weak areas
    
    For any user who has completed 10 or more practice sets, the practice set generator 
    should weight question selection toward topics where the user has <70% accuracy.
    
    Validates: Requirements 2.6
    """
    
    @given(user_performance_strategy())
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow])
    def test_weak_areas_identified_correctly(self, user_performance):
        """
        Property: For any user performance data, weak areas (topics with <70% accuracy) 
        should be correctly identified.
        """
        weak_areas = identify_weak_areas(user_performance)
        
        # Verify all identified weak areas have <70% accuracy
        for weak_area in weak_areas:
            accuracy = user_performance['topic_accuracy'][weak_area]['percentage']
            assert accuracy < WEAK_AREA_THRESHOLD, \
                f"Topic {weak_area} has {accuracy*100}% accuracy but marked as weak"
        
        # Verify no strong areas are marked as weak
        for topic, data in user_performance['topic_accuracy'].items():
            accuracy = data['percentage']
            if accuracy >= WEAK_AREA_THRESHOLD:
                assert topic not in weak_areas, \
                    f"Topic {topic} has {accuracy*100}% accuracy but marked as weak"
    
    @given(mock_questions_strategy(), user_performance_strategy())
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow])
    def test_adaptive_selection_weights_weak_areas(self, mock_questions, user_performance):
        """
        Property: For any user with weak areas, adaptive selection should include 
        more questions from weak areas than from strong areas.
        """
        weak_areas = identify_weak_areas(user_performance)
        
        if not weak_areas:
            # Skip test if no weak areas
            pytest.skip("No weak areas in generated performance data")
        
        with patch('lambda_function.questions_table') as mock_table:
            mock_table.query.return_value = {'Items': mock_questions}
            
            result = select_adaptive_questions('IE & IFS', weak_areas, QUESTIONS_PER_SET)
            
            if len(result) > 0:
                # Count questions from weak areas
                weak_area_count = sum(1 for q in result if q['topic'] in weak_areas)
                strong_area_count = len(result) - weak_area_count
                
                # Weak areas should be weighted at ~70%
                if len(result) >= 4:
                    expected_weak_min = int(len(result) * 0.6)  # Allow some variance
                    assert weak_area_count >= expected_weak_min, \
                        f"Expected at least {expected_weak_min} weak area questions, got {weak_area_count}"
    
    @given(st.lists(
        st.floats(min_value=0.0, max_value=1.0),
        min_size=1,
        max_size=5,
        unique=False
    ))
    @settings(max_examples=5)
    def test_weak_area_threshold_consistency(self, accuracies):
        """
        Property: For any set of topic accuracies, the weak area threshold should be 
        consistently applied (topics with <70% are weak, >=70% are strong).
        """
        topics = [f'topic_{i}' for i in range(len(accuracies))]
        user_performance = {
            'completed_sessions': [],
            'topic_accuracy': {
                topic: {'percentage': acc}
                for topic, acc in zip(topics, accuracies)
            }
        }
        
        weak_areas = identify_weak_areas(user_performance)
        
        # Verify threshold is consistently applied
        for topic, acc in zip(topics, accuracies):
            if acc < WEAK_AREA_THRESHOLD:
                assert topic in weak_areas, \
                    f"Topic {topic} with {acc*100}% should be weak"
            else:
                assert topic not in weak_areas, \
                    f"Topic {topic} with {acc*100}% should not be weak"


class TestProperty7And8Integration:
    """Integration tests for Properties 7 and 8"""
    
    @given(mock_questions_strategy(), user_performance_strategy())
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow])
    def test_adaptive_selection_maintains_uniqueness_with_weak_areas(
        self, mock_questions, user_performance
    ):
        """
        Property: Adaptive selection should maintain uniqueness while weighting 
        toward weak areas.
        """
        weak_areas = identify_weak_areas(user_performance)
        
        with patch('lambda_function.questions_table') as mock_table:
            mock_table.query.return_value = {'Items': mock_questions}
            
            result = select_adaptive_questions('IE & IFS', weak_areas, QUESTIONS_PER_SET)
            
            # Verify uniqueness
            question_ids = [q['question_id'] for q in result]
            assert len(question_ids) == len(set(question_ids)), \
                "Adaptive selection returned duplicate questions"
            
            # Verify correct count
            expected_count = min(QUESTIONS_PER_SET, len(mock_questions))
            assert len(result) == expected_count, \
                f"Expected {expected_count} questions, got {len(result)}"
