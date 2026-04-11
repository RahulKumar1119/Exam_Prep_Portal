"""
Unit tests for Practice Set Generator Lambda Function

Tests cover:
- Random question selection for new users
- Adaptive question selection for experienced users
- Session management and state tracking
- Error handling and edge cases
"""

import pytest
import json
import uuid
import time
from datetime import datetime
from unittest.mock import Mock, patch, MagicMock
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend', 'practice'))

from lambda_function import (
    generate_practice_set,
    select_random_questions,
    select_adaptive_questions,
    identify_weak_areas,
    get_user_performance,
    QUESTIONS_PER_SET,
    WEAK_AREA_THRESHOLD,
    ADAPTIVE_SELECTION_THRESHOLD
)


class TestQuestionSelection:
    """Test question selection logic"""
    
    def test_select_random_questions_returns_correct_count(self):
        """Test that random selection returns exactly 4 questions"""
        mock_questions = [
            {
                'question_id': f'q{i}',
                'question_text': f'Question {i}',
                'options': ['A', 'B', 'C', 'D'],
                'topic': 'Banking'
            }
            for i in range(10)
        ]
        
        with patch('lambda_function.questions_table') as mock_table:
            mock_table.query.return_value = {'Items': mock_questions}
            
            result = select_random_questions('IE & IFS', QUESTIONS_PER_SET)
            
            assert len(result) == QUESTIONS_PER_SET
            assert all('question_id' in q for q in result)
    
    def test_select_random_questions_returns_unique_questions(self):
        """Test that random selection returns unique questions"""
        mock_questions = [
            {
                'question_id': f'q{i}',
                'question_text': f'Question {i}',
                'options': ['A', 'B', 'C', 'D'],
                'topic': 'Banking'
            }
            for i in range(10)
        ]
        
        with patch('lambda_function.questions_table') as mock_table:
            mock_table.query.return_value = {'Items': mock_questions}
            
            result = select_random_questions('IE & IFS', QUESTIONS_PER_SET)
            question_ids = [q['question_id'] for q in result]
            
            assert len(question_ids) == len(set(question_ids))
    
    def test_select_random_questions_handles_insufficient_questions(self):
        """Test handling when fewer questions available than requested"""
        mock_questions = [
            {
                'question_id': f'q{i}',
                'question_text': f'Question {i}',
                'options': ['A', 'B', 'C', 'D'],
                'topic': 'Banking'
            }
            for i in range(2)
        ]
        
        with patch('lambda_function.questions_table') as mock_table:
            mock_table.query.return_value = {'Items': mock_questions}
            
            result = select_random_questions('IE & IFS', QUESTIONS_PER_SET)
            
            assert len(result) == 2
    
    def test_select_adaptive_questions_weights_weak_areas(self):
        """Test that adaptive selection weights toward weak areas"""
        mock_questions = [
            {
                'question_id': f'q{i}',
                'question_text': f'Question {i}',
                'options': ['A', 'B', 'C', 'D'],
                'topic': 'Banking' if i < 5 else 'Finance'
            }
            for i in range(10)
        ]
        
        weak_areas = ['Banking']
        
        with patch('lambda_function.questions_table') as mock_table:
            mock_table.query.return_value = {'Items': mock_questions}
            
            result = select_adaptive_questions('IE & IFS', weak_areas, QUESTIONS_PER_SET)
            
            # Should have questions from weak areas
            weak_area_questions = [q for q in result if q['topic'] in weak_areas]
            assert len(weak_area_questions) >= 2  # At least 70% of 4 = 2.8, so at least 2


class TestWeakAreaIdentification:
    """Test weak area identification logic"""
    
    def test_identify_weak_areas_returns_topics_below_threshold(self):
        """Test that weak areas are correctly identified"""
        user_performance = {
            'completed_sessions': [],
            'topic_accuracy': {
                'Banking': {'percentage': 0.60},  # Below 70%
                'Finance': {'percentage': 0.80},  # Above 70%
                'Regulations': {'percentage': 0.65}  # Below 70%
            }
        }
        
        weak_areas = identify_weak_areas(user_performance)
        
        assert 'Banking' in weak_areas
        assert 'Regulations' in weak_areas
        assert 'Finance' not in weak_areas
    
    def test_identify_weak_areas_returns_empty_for_strong_performance(self):
        """Test that no weak areas are identified for strong performance"""
        user_performance = {
            'completed_sessions': [],
            'topic_accuracy': {
                'Banking': {'percentage': 0.85},
                'Finance': {'percentage': 0.90},
                'Regulations': {'percentage': 0.75}
            }
        }
        
        weak_areas = identify_weak_areas(user_performance)
        
        assert len(weak_areas) == 0
    
    def test_identify_weak_areas_handles_empty_performance(self):
        """Test handling of empty performance data"""
        user_performance = {
            'completed_sessions': [],
            'topic_accuracy': {}
        }
        
        weak_areas = identify_weak_areas(user_performance)
        
        assert weak_areas == []


class TestSessionGeneration:
    """Test practice set generation"""
    
    @patch('lambda_function.sessions_table')
    @patch('lambda_function.select_random_questions')
    @patch('lambda_function.save_incomplete_session_for_user')
    @patch('lambda_function.get_user_performance')
    def test_generate_practice_set_for_new_user(
        self, mock_perf, mock_save, mock_select, mock_sessions
    ):
        """Test practice set generation for new user (random selection)"""
        user_id = str(uuid.uuid4())
        paper_name = 'IE & IFS'
        
        mock_perf.return_value = {
            'completed_sessions': [],
            'topic_accuracy': {}
        }
        
        mock_questions = [
            {
                'question_id': f'q{i}',
                'question_text': f'Question {i}',
                'options': ['A', 'B', 'C', 'D'],
                'topic': 'Banking',
                'difficulty': 'medium'
            }
            for i in range(4)
        ]
        
        mock_select.return_value = mock_questions
        
        event = {
            'action': 'generate',
            'user_id': user_id,
            'paper_name': paper_name
        }
        
        result = generate_practice_set(event)
        
        assert result['statusCode'] == 200
        body = json.loads(result['body'])
        assert 'session_id' in body
        assert len(body['questions']) == QUESTIONS_PER_SET
        assert body['timer_duration'] == 600
        assert body['paper_name'] == paper_name
    
    @patch('lambda_function.sessions_table')
    @patch('lambda_function.select_adaptive_questions')
    @patch('lambda_function.save_incomplete_session_for_user')
    @patch('lambda_function.get_user_performance')
    def test_generate_practice_set_for_experienced_user(
        self, mock_perf, mock_save, mock_select, mock_sessions
    ):
        """Test practice set generation for experienced user (adaptive selection)"""
        user_id = str(uuid.uuid4())
        paper_name = 'PPB'
        
        # Simulate user with 15 completed sessions
        mock_perf.return_value = {
            'completed_sessions': [{'score': 60} for _ in range(15)],
            'topic_accuracy': {
                'Banking': {'percentage': 0.60},
                'Finance': {'percentage': 0.85}
            }
        }
        
        mock_questions = [
            {
                'question_id': f'q{i}',
                'question_text': f'Question {i}',
                'options': ['A', 'B', 'C', 'D'],
                'topic': 'Banking',
                'difficulty': 'medium'
            }
            for i in range(4)
        ]
        
        mock_select.return_value = mock_questions
        
        event = {
            'action': 'generate',
            'user_id': user_id,
            'paper_name': paper_name
        }
        
        result = generate_practice_set(event)
        
        assert result['statusCode'] == 200
        body = json.loads(result['body'])
        assert 'session_id' in body
        assert len(body['questions']) == QUESTIONS_PER_SET
    
    def test_generate_practice_set_validates_paper_name(self):
        """Test that invalid paper names are rejected"""
        user_id = str(uuid.uuid4())
        
        event = {
            'action': 'generate',
            'user_id': user_id,
            'paper_name': 'Invalid Paper'
        }
        
        result = generate_practice_set(event)
        
        assert result['statusCode'] == 400
        body = json.loads(result['body'])
        assert 'Invalid paper_name' in body['error']
    
    def test_generate_practice_set_requires_paper_name(self):
        """Test that paper_name is required"""
        user_id = str(uuid.uuid4())
        
        event = {
            'action': 'generate',
            'user_id': user_id
        }
        
        result = generate_practice_set(event)
        
        assert result['statusCode'] == 400
        body = json.loads(result['body'])
        assert 'paper_name is required' in body['error']


class TestSessionManagement:
    """Test session management operations"""
    
    @patch('lambda_function.sessions_table')
    @patch('lambda_function.get_questions_by_ids')
    def test_get_session_returns_session_data(self, mock_get_q, mock_sessions):
        """Test retrieving an existing session"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        current_time = int(time.time())
        
        mock_sessions.get_item.return_value = {
            'Item': {
                'session_id': session_id,
                'user_id': user_id,
                'paper_name': 'IE & IFS',
                'question_ids': ['q1', 'q2', 'q3', 'q4'],
                'user_answers': {},
                'status': 'in_progress',
                'created_at': current_time,
                'expires_at': current_time + 600  # 10 minutes in future
            }
        }
        
        mock_questions = [
            {
                'question_id': f'q{i}',
                'question_text': f'Question {i}',
                'options': ['A', 'B', 'C', 'D'],
                'topic': 'Banking',
                'difficulty': 'medium'
            }
            for i in range(4)
        ]
        
        mock_get_q.return_value = mock_questions
        
        from lambda_function import get_session
        
        event = {
            'session_id': session_id,
            'user_id': user_id
        }
        
        result = get_session(event)
        
        assert result['statusCode'] == 200
        body = json.loads(result['body'])
        assert body['session_id'] == session_id
        assert len(body['questions']) == 4
    
    @patch('lambda_function.sessions_table')
    def test_get_session_returns_404_for_missing_session(self, mock_sessions):
        """Test that missing sessions return 404"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        
        mock_sessions.get_item.return_value = {}
        
        from lambda_function import get_session
        
        event = {
            'session_id': session_id,
            'user_id': user_id
        }
        
        result = get_session(event)
        
        assert result['statusCode'] == 404
        body = json.loads(result['body'])
        assert 'Session not found' in body['error']


class TestErrorHandling:
    """Test error handling"""
    
    def test_generate_practice_set_requires_user_id(self):
        """Test that user_id is required"""
        event = {
            'action': 'generate',
            'paper_name': 'IE & IFS'
        }
        
        result = generate_practice_set(event)
        
        assert result['statusCode'] == 400
        body = json.loads(result['body'])
        assert 'user_id is required' in body['error']
    
    @patch('lambda_function.sessions_table')
    @patch('lambda_function.select_random_questions')
    @patch('lambda_function.save_incomplete_session_for_user')
    @patch('lambda_function.get_user_performance')
    def test_generate_practice_set_handles_insufficient_questions(
        self, mock_perf, mock_save, mock_select, mock_sessions
    ):
        """Test handling when insufficient questions are available"""
        user_id = str(uuid.uuid4())
        
        mock_perf.return_value = {
            'completed_sessions': [],
            'topic_accuracy': {}
        }
        
        mock_select.return_value = []  # No questions available
        
        event = {
            'action': 'generate',
            'user_id': user_id,
            'paper_name': 'IE & IFS'
        }
        
        result = generate_practice_set(event)
        
        assert result['statusCode'] == 500
        body = json.loads(result['body'])
        assert 'Insufficient questions' in body['error']
