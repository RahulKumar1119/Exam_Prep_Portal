"""
Unit tests for Practice Session Manager Lambda Function

Tests cover:
- Session retrieval and display
- Session state management
- Answer updates
- Session expiration handling
- Session resumption
"""

import pytest
import json
import uuid
import time
from unittest.mock import patch, MagicMock
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend', 'practice'))

from session_manager import (
    retrieve_session,
    update_session_answers,
    check_session_expiry,
    resume_session,
    SESSION_TIMEOUT
)


class TestSessionRetrieval:
    """Test session retrieval functionality"""
    
    @patch('session_manager.sessions_table')
    @patch('session_manager.get_questions_by_ids')
    def test_retrieve_session_returns_session_data(self, mock_get_q, mock_sessions):
        """Test retrieving an active session"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        current_time = int(time.time())
        
        mock_sessions.get_item.return_value = {
            'Item': {
                'session_id': session_id,
                'user_id': user_id,
                'paper_name': 'IE & IFS',
                'question_ids': ['q1', 'q2', 'q3', 'q4'],
                'user_answers': {'q1': 'A'},
                'status': 'in_progress',
                'created_at': current_time,
                'expires_at': current_time + 600
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
        
        result = retrieve_session(session_id, user_id)
        
        assert result['statusCode'] == 200
        body = json.loads(result['body'])
        assert body['session_id'] == session_id
        assert len(body['questions']) == 4
        assert body['status'] == 'in_progress'
        assert body['remaining_time'] > 0
    
    @patch('session_manager.sessions_table')
    def test_retrieve_session_returns_404_for_missing_session(self, mock_sessions):
        """Test that missing sessions return 404"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        
        mock_sessions.get_item.return_value = {}
        
        result = retrieve_session(session_id, user_id)
        
        assert result['statusCode'] == 404
        body = json.loads(result['body'])
        assert 'Session not found' in body['error']
    
    @patch('session_manager.sessions_table')
    def test_retrieve_session_marks_expired_session(self, mock_sessions):
        """Test that expired sessions are marked as expired"""
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
                'created_at': current_time - 700,
                'expires_at': current_time - 100  # Expired 100 seconds ago
            }
        }
        
        result = retrieve_session(session_id, user_id)
        
        assert result['statusCode'] == 410
        body = json.loads(result['body'])
        assert 'Session has expired' in body['error']
        
        # Verify update was called
        mock_sessions.update_item.assert_called_once()


class TestSessionAnswerUpdates:
    """Test session answer update functionality"""
    
    @patch('session_manager.sessions_table')
    def test_update_session_answers_saves_answers(self, mock_sessions):
        """Test updating session answers"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        current_time = int(time.time())
        
        mock_sessions.get_item.return_value = {
            'Item': {
                'session_id': session_id,
                'user_id': user_id,
                'status': 'in_progress',
                'expires_at': current_time + 600
            }
        }
        
        user_answers = {'q1': 'A', 'q2': 'B', 'q3': 'C'}
        
        result = update_session_answers(session_id, user_id, user_answers)
        
        assert result['statusCode'] == 200
        body = json.loads(result['body'])
        assert body['message'] == 'Answers updated'
        assert body['answers_count'] == 3
    
    @patch('session_manager.sessions_table')
    def test_update_session_answers_rejects_expired_session(self, mock_sessions):
        """Test that expired sessions cannot be updated"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        current_time = int(time.time())
        
        mock_sessions.get_item.return_value = {
            'Item': {
                'session_id': session_id,
                'user_id': user_id,
                'status': 'in_progress',
                'expires_at': current_time - 100  # Expired
            }
        }
        
        user_answers = {'q1': 'A'}
        
        result = update_session_answers(session_id, user_id, user_answers)
        
        assert result['statusCode'] == 410
        body = json.loads(result['body'])
        assert 'Session has expired' in body['error']
    
    @patch('session_manager.sessions_table')
    def test_update_session_answers_rejects_completed_session(self, mock_sessions):
        """Test that completed sessions cannot be updated"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        
        mock_sessions.get_item.return_value = {
            'Item': {
                'session_id': session_id,
                'user_id': user_id,
                'status': 'completed'
            }
        }
        
        user_answers = {'q1': 'A'}
        
        result = update_session_answers(session_id, user_id, user_answers)
        
        assert result['statusCode'] == 400
        body = json.loads(result['body'])
        assert 'Cannot update answers' in body['error']


class TestSessionExpiry:
    """Test session expiry checking"""
    
    @patch('session_manager.sessions_table')
    def test_check_session_expiry_returns_remaining_time(self, mock_sessions):
        """Test checking session expiry"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        current_time = int(time.time())
        expires_at = current_time + 300
        
        mock_sessions.get_item.return_value = {
            'Item': {
                'session_id': session_id,
                'user_id': user_id,
                'status': 'in_progress',
                'expires_at': expires_at
            }
        }
        
        result = check_session_expiry(session_id, user_id)
        
        assert result['statusCode'] == 200
        body = json.loads(result['body'])
        assert body['is_expired'] == False
        assert body['remaining_time'] > 0
        assert body['remaining_time'] <= 300
    
    @patch('session_manager.sessions_table')
    def test_check_session_expiry_detects_expired_session(self, mock_sessions):
        """Test detecting expired session"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        current_time = int(time.time())
        
        mock_sessions.get_item.return_value = {
            'Item': {
                'session_id': session_id,
                'user_id': user_id,
                'status': 'in_progress',
                'expires_at': current_time - 100  # Expired
            }
        }
        
        result = check_session_expiry(session_id, user_id)
        
        assert result['statusCode'] == 200
        body = json.loads(result['body'])
        assert body['is_expired'] == True
        assert body['remaining_time'] == 0


class TestSessionResumption:
    """Test session resumption functionality"""
    
    @patch('session_manager.sessions_table')
    @patch('session_manager.get_questions_by_ids')
    def test_resume_incomplete_session(self, mock_get_q, mock_sessions):
        """Test resuming an incomplete session"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        current_time = int(time.time())
        
        mock_sessions.get_item.return_value = {
            'Item': {
                'session_id': session_id,
                'user_id': user_id,
                'paper_name': 'PPB',
                'question_ids': ['q1', 'q2', 'q3', 'q4'],
                'user_answers': {'q1': 'A', 'q2': 'B'},
                'status': 'incomplete',
                'created_at': current_time - 1000
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
        
        result = resume_session(session_id, user_id)
        
        assert result['statusCode'] == 200
        body = json.loads(result['body'])
        assert body['status'] == 'in_progress'
        assert body['message'] == 'Session resumed'
        assert body['remaining_time'] == SESSION_TIMEOUT
        assert len(body['questions']) == 4
        assert body['user_answers'] == {'q1': 'A', 'q2': 'B'}
    
    @patch('session_manager.sessions_table')
    def test_resume_completed_session_fails(self, mock_sessions):
        """Test that completed sessions cannot be resumed"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        
        mock_sessions.get_item.return_value = {
            'Item': {
                'session_id': session_id,
                'user_id': user_id,
                'status': 'completed'
            }
        }
        
        result = resume_session(session_id, user_id)
        
        assert result['statusCode'] == 400
        body = json.loads(result['body'])
        assert 'Cannot resume session' in body['error']
    
    @patch('session_manager.sessions_table')
    def test_resume_session_extends_timeout(self, mock_sessions):
        """Test that resuming a session extends the timeout"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        current_time = int(time.time())
        
        mock_sessions.get_item.return_value = {
            'Item': {
                'session_id': session_id,
                'user_id': user_id,
                'paper_name': 'AFB',
                'question_ids': ['q1', 'q2', 'q3', 'q4'],
                'user_answers': {},
                'status': 'incomplete',
                'created_at': current_time - 1000
            }
        }
        
        with patch('session_manager.get_questions_by_ids') as mock_get_q:
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
            
            result = resume_session(session_id, user_id)
            
            assert result['statusCode'] == 200
            body = json.loads(result['body'])
            
            # Verify update was called with new expires_at
            mock_sessions.update_item.assert_called_once()
            call_args = mock_sessions.update_item.call_args
            assert ':expires_at' in call_args[1]['ExpressionAttributeValues']


class TestErrorHandling:
    """Test error handling"""
    
    @patch('session_manager.sessions_table')
    def test_retrieve_session_handles_missing_session(self, mock_sessions):
        """Test handling of missing session"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        
        mock_sessions.get_item.return_value = {}
        
        result = retrieve_session(session_id, user_id)
        
        assert result['statusCode'] == 404
    
    @patch('session_manager.sessions_table')
    def test_update_session_handles_missing_session(self, mock_sessions):
        """Test handling of missing session during update"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        
        mock_sessions.get_item.return_value = {}
        
        result = update_session_answers(session_id, user_id, {})
        
        assert result['statusCode'] == 404
