"""
Unit Tests for MCQ Scoring Engine

Tests verify:
- Score calculation accuracy: (correct_answers / 4) × 100
- Score storage in DynamoDB
- Score retrieval
- Topic-wise accuracy calculation
- Pass/fail badge logic
- Results display with correct/incorrect indicators
"""

import pytest
import json
import uuid
from unittest.mock import patch, MagicMock, call
from decimal import Decimal
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend', 'practice'))

from scoring_service import (
    submit_practice_set,
    get_results,
    get_questions_by_ids,
    PASS_THRESHOLD,
    QUESTIONS_PER_SET
)


class TestScoreCalculation:
    """Test score calculation accuracy"""
    
    @patch('scoring_service.sessions_table')
    @patch('scoring_service.scores_table')
    @patch('scoring_service.questions_table')
    def test_score_calculation_all_correct(self, mock_questions, mock_scores, mock_sessions):
        """Test score calculation when all answers are correct (100%)"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        
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
        
        # Mock questions
        questions = [
            {'question_id': 'q1', 'correct_answer': 'A', 'topic': 'Banking'},
            {'question_id': 'q2', 'correct_answer': 'B', 'topic': 'Finance'},
            {'question_id': 'q3', 'correct_answer': 'C', 'topic': 'Banking'},
            {'question_id': 'q4', 'correct_answer': 'D', 'topic': 'Regulation'}
        ]
        mock_questions.query.side_effect = lambda **kwargs: {'Items': [q] if q['question_id'] in kwargs.get('ExpressionAttributeValues', {}).values() else []}
        
        # Mock get_questions_by_ids to return all questions
        with patch('scoring_service.get_questions_by_ids', return_value=questions):
            event = {
                'action': 'submit',
                'session_id': session_id,
                'user_id': user_id,
                'answers': {
                    'q1': 'A',
                    'q2': 'B',
                    'q3': 'C',
                    'q4': 'D'
                }
            }
            
            result = submit_practice_set(event)
            
            assert result['statusCode'] == 200
            body = json.loads(result['body'])
            assert body['score'] == 100.0
            assert body['questions_correct'] == 4
            assert body['passed'] is True
    
    @patch('scoring_service.sessions_table')
    @patch('scoring_service.scores_table')
    @patch('scoring_service.questions_table')
    def test_score_calculation_no_correct(self, mock_questions, mock_scores, mock_sessions):
        """Test score calculation when no answers are correct (0%)"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        
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
        
        questions = [
            {'question_id': 'q1', 'correct_answer': 'A', 'topic': 'Banking'},
            {'question_id': 'q2', 'correct_answer': 'B', 'topic': 'Finance'},
            {'question_id': 'q3', 'correct_answer': 'C', 'topic': 'Banking'},
            {'question_id': 'q4', 'correct_answer': 'D', 'topic': 'Regulation'}
        ]
        
        with patch('scoring_service.get_questions_by_ids', return_value=questions):
            event = {
                'action': 'submit',
                'session_id': session_id,
                'user_id': user_id,
                'answers': {
                    'q1': 'B',
                    'q2': 'C',
                    'q3': 'D',
                    'q4': 'A'
                }
            }
            
            result = submit_practice_set(event)
            
            assert result['statusCode'] == 200
            body = json.loads(result['body'])
            assert body['score'] == 0.0
            assert body['questions_correct'] == 0
            assert body['passed'] is False
    
    @patch('scoring_service.sessions_table')
    @patch('scoring_service.scores_table')
    @patch('scoring_service.questions_table')
    def test_score_calculation_partial_correct(self, mock_questions, mock_scores, mock_sessions):
        """Test score calculation with partial correct answers (50%)"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        
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
        
        questions = [
            {'question_id': 'q1', 'correct_answer': 'A', 'topic': 'Banking'},
            {'question_id': 'q2', 'correct_answer': 'B', 'topic': 'Finance'},
            {'question_id': 'q3', 'correct_answer': 'C', 'topic': 'Banking'},
            {'question_id': 'q4', 'correct_answer': 'D', 'topic': 'Regulation'}
        ]
        
        with patch('scoring_service.get_questions_by_ids', return_value=questions):
            event = {
                'action': 'submit',
                'session_id': session_id,
                'user_id': user_id,
                'answers': {
                    'q1': 'A',
                    'q2': 'B',
                    'q3': 'D',
                    'q4': 'A'
                }
            }
            
            result = submit_practice_set(event)
            
            assert result['statusCode'] == 200
            body = json.loads(result['body'])
            assert body['score'] == 50.0
            assert body['questions_correct'] == 2
            assert body['passed'] is False
    
    @patch('scoring_service.sessions_table')
    @patch('scoring_service.scores_table')
    @patch('scoring_service.questions_table')
    def test_score_calculation_75_percent(self, mock_questions, mock_scores, mock_sessions):
        """Test score calculation at pass threshold (75%)"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        
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
        
        questions = [
            {'question_id': 'q1', 'correct_answer': 'A', 'topic': 'Banking'},
            {'question_id': 'q2', 'correct_answer': 'B', 'topic': 'Finance'},
            {'question_id': 'q3', 'correct_answer': 'C', 'topic': 'Banking'},
            {'question_id': 'q4', 'correct_answer': 'D', 'topic': 'Regulation'}
        ]
        
        with patch('scoring_service.get_questions_by_ids', return_value=questions):
            event = {
                'action': 'submit',
                'session_id': session_id,
                'user_id': user_id,
                'answers': {
                    'q1': 'A',
                    'q2': 'B',
                    'q3': 'C',
                    'q4': 'A'
                }
            }
            
            result = submit_practice_set(event)
            
            assert result['statusCode'] == 200
            body = json.loads(result['body'])
            assert body['score'] == 75.0
            assert body['questions_correct'] == 3
            assert body['passed'] is True


class TestTopicAccuracy:
    """Test topic-wise accuracy calculation"""
    
    @patch('scoring_service.sessions_table')
    @patch('scoring_service.scores_table')
    @patch('scoring_service.questions_table')
    def test_topic_breakdown_calculation(self, mock_questions, mock_scores, mock_sessions):
        """Test that topic-wise accuracy is calculated correctly"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        
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
        
        questions = [
            {'question_id': 'q1', 'correct_answer': 'A', 'topic': 'Banking'},
            {'question_id': 'q2', 'correct_answer': 'B', 'topic': 'Banking'},
            {'question_id': 'q3', 'correct_answer': 'C', 'topic': 'Finance'},
            {'question_id': 'q4', 'correct_answer': 'D', 'topic': 'Finance'}
        ]
        
        with patch('scoring_service.get_questions_by_ids', return_value=questions):
            event = {
                'action': 'submit',
                'session_id': session_id,
                'user_id': user_id,
                'answers': {
                    'q1': 'A',  # Correct - Banking
                    'q2': 'C',  # Incorrect - Banking
                    'q3': 'C',  # Correct - Finance
                    'q4': 'A'   # Incorrect - Finance
                }
            }
            
            result = submit_practice_set(event)
            
            assert result['statusCode'] == 200
            body = json.loads(result['body'])
            
            # Banking: 1/2 = 50%
            # Finance: 1/2 = 50%
            assert body['topic_breakdown']['Banking'] == 50.0
            assert body['topic_breakdown']['Finance'] == 50.0


class TestPassFailBadge:
    """Test pass/fail badge logic"""
    
    @patch('scoring_service.sessions_table')
    @patch('scoring_service.scores_table')
    @patch('scoring_service.questions_table')
    def test_passed_badge_for_75_percent(self, mock_questions, mock_scores, mock_sessions):
        """Test that 75% score shows 'Passed' badge"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        
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
        
        questions = [
            {'question_id': 'q1', 'correct_answer': 'A', 'topic': 'Banking'},
            {'question_id': 'q2', 'correct_answer': 'B', 'topic': 'Finance'},
            {'question_id': 'q3', 'correct_answer': 'C', 'topic': 'Banking'},
            {'question_id': 'q4', 'correct_answer': 'D', 'topic': 'Regulation'}
        ]
        
        with patch('scoring_service.get_questions_by_ids', return_value=questions):
            event = {
                'action': 'submit',
                'session_id': session_id,
                'user_id': user_id,
                'answers': {
                    'q1': 'A',
                    'q2': 'B',
                    'q3': 'C',
                    'q4': 'A'
                }
            }
            
            result = submit_practice_set(event)
            body = json.loads(result['body'])
            
            assert body['passed'] is True
    
    @patch('scoring_service.sessions_table')
    @patch('scoring_service.scores_table')
    @patch('scoring_service.questions_table')
    def test_review_needed_for_below_75_percent(self, mock_questions, mock_scores, mock_sessions):
        """Test that <75% score shows 'Review Needed' message"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        
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
        
        questions = [
            {'question_id': 'q1', 'correct_answer': 'A', 'topic': 'Banking'},
            {'question_id': 'q2', 'correct_answer': 'B', 'topic': 'Finance'},
            {'question_id': 'q3', 'correct_answer': 'C', 'topic': 'Banking'},
            {'question_id': 'q4', 'correct_answer': 'D', 'topic': 'Regulation'}
        ]
        
        with patch('scoring_service.get_questions_by_ids', return_value=questions):
            event = {
                'action': 'submit',
                'session_id': session_id,
                'user_id': user_id,
                'answers': {
                    'q1': 'A',
                    'q2': 'B',
                    'q3': 'D',
                    'q4': 'A'
                }
            }
            
            result = submit_practice_set(event)
            body = json.loads(result['body'])
            
            assert body['passed'] is False


class TestResultsDisplay:
    """Test results display with correct/incorrect indicators"""
    
    @patch('scoring_service.sessions_table')
    @patch('scoring_service.scores_table')
    @patch('scoring_service.questions_table')
    def test_results_show_correct_incorrect_indicators(self, mock_questions, mock_scores, mock_sessions):
        """Test that results display correct/incorrect indicators for each question"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        
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
        
        questions = [
            {'question_id': 'q1', 'correct_answer': 'A', 'topic': 'Banking'},
            {'question_id': 'q2', 'correct_answer': 'B', 'topic': 'Finance'},
            {'question_id': 'q3', 'correct_answer': 'C', 'topic': 'Banking'},
            {'question_id': 'q4', 'correct_answer': 'D', 'topic': 'Regulation'}
        ]
        
        with patch('scoring_service.get_questions_by_ids', return_value=questions):
            event = {
                'action': 'submit',
                'session_id': session_id,
                'user_id': user_id,
                'answers': {
                    'q1': 'A',  # Correct
                    'q2': 'C',  # Incorrect
                    'q3': 'C',  # Correct
                    'q4': 'A'   # Incorrect
                }
            }
            
            result = submit_practice_set(event)
            body = json.loads(result['body'])
            
            results = body['results']
            assert len(results) == 4
            
            # Check correct/incorrect indicators
            assert results[0]['correct'] is True
            assert results[0]['user_answer'] == 'A'
            assert results[0]['correct_answer'] == 'A'
            
            assert results[1]['correct'] is False
            assert results[1]['user_answer'] == 'C'
            assert results[1]['correct_answer'] == 'B'
            
            assert results[2]['correct'] is True
            assert results[2]['user_answer'] == 'C'
            assert results[2]['correct_answer'] == 'C'
            
            assert results[3]['correct'] is False
            assert results[3]['user_answer'] == 'A'
            assert results[3]['correct_answer'] == 'D'


class TestScoreStorage:
    """Test score storage in DynamoDB"""
    
    @patch('scoring_service.sessions_table')
    @patch('scoring_service.scores_table')
    @patch('scoring_service.questions_table')
    def test_score_stored_with_required_fields(self, mock_questions, mock_scores, mock_sessions):
        """Test that score is stored with all required fields"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        
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
        
        questions = [
            {'question_id': 'q1', 'correct_answer': 'A', 'topic': 'Banking'},
            {'question_id': 'q2', 'correct_answer': 'B', 'topic': 'Finance'},
            {'question_id': 'q3', 'correct_answer': 'C', 'topic': 'Banking'},
            {'question_id': 'q4', 'correct_answer': 'D', 'topic': 'Regulation'}
        ]
        
        with patch('scoring_service.get_questions_by_ids', return_value=questions):
            event = {
                'action': 'submit',
                'session_id': session_id,
                'user_id': user_id,
                'answers': {
                    'q1': 'A',
                    'q2': 'B',
                    'q3': 'C',
                    'q4': 'D'
                }
            }
            
            result = submit_practice_set(event)
            
            # Verify put_item was called
            assert mock_scores.put_item.called
            
            # Get the call arguments
            call_args = mock_scores.put_item.call_args
            item = call_args[1]['Item']
            
            # Verify required fields
            assert item['user_id'] == user_id
            assert item['session_id'] == session_id
            assert item['paper_name'] == 'IE & IFS'
            assert item['score'] == Decimal('100.00')
            assert item['questions_correct'] == 4
            assert 'submitted_at' in item
            assert 'time_taken' in item
            assert 'topic_breakdown' in item


class TestErrorHandling:
    """Test error handling"""
    
    @patch('scoring_service.sessions_table')
    def test_missing_session_id(self, mock_sessions):
        """Test error when session_id is missing"""
        event = {
            'action': 'submit',
            'user_id': str(uuid.uuid4())
        }
        
        result = submit_practice_set(event)
        
        assert result['statusCode'] == 400
        body = json.loads(result['body'])
        assert 'error' in body
    
    @patch('scoring_service.sessions_table')
    def test_session_not_found(self, mock_sessions):
        """Test error when session is not found"""
        mock_sessions.get_item.return_value = {}
        
        event = {
            'action': 'submit',
            'session_id': str(uuid.uuid4()),
            'user_id': str(uuid.uuid4()),
            'answers': {}
        }
        
        result = submit_practice_set(event)
        
        assert result['statusCode'] == 404
        body = json.loads(result['body'])
        assert 'error' in body


class TestGetResults:
    """Test results retrieval"""
    
    @patch('scoring_service.sessions_table')
    @patch('scoring_service.scores_table')
    @patch('scoring_service.questions_table')
    def test_get_results_returns_complete_data(self, mock_questions, mock_scores, mock_sessions):
        """Test that get_results returns all required data"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        submitted_at = 2000
        
        mock_sessions.get_item.return_value = {
            'Item': {
                'session_id': session_id,
                'user_id': user_id,
                'question_ids': ['q1', 'q2', 'q3', 'q4'],
                'paper_name': 'IE & IFS',
                'status': 'completed',
                'submitted_at': submitted_at,
                'user_answers': {
                    'q1': 'A',
                    'q2': 'B',
                    'q3': 'C',
                    'q4': 'D'
                }
            }
        }
        
        mock_scores.get_item.return_value = {
            'Item': {
                'user_id': user_id,
                'submitted_at': submitted_at,
                'score': Decimal('100.00'),
                'questions_correct': 4,
                'time_taken': 300,
                'paper_name': 'IE & IFS',
                'topic_breakdown': {'Banking': 100.0, 'Finance': 100.0, 'Regulation': 100.0}
            }
        }
        
        questions = [
            {'question_id': 'q1', 'correct_answer': 'A', 'topic': 'Banking', 'question_text': 'Q1', 'options': ['A', 'B', 'C', 'D']},
            {'question_id': 'q2', 'correct_answer': 'B', 'topic': 'Finance', 'question_text': 'Q2', 'options': ['A', 'B', 'C', 'D']},
            {'question_id': 'q3', 'correct_answer': 'C', 'topic': 'Banking', 'question_text': 'Q3', 'options': ['A', 'B', 'C', 'D']},
            {'question_id': 'q4', 'correct_answer': 'D', 'topic': 'Regulation', 'question_text': 'Q4', 'options': ['A', 'B', 'C', 'D']}
        ]
        
        with patch('scoring_service.get_questions_by_ids', return_value=questions):
            result = get_results(session_id, user_id)
            
            assert result['statusCode'] == 200
            body = json.loads(result['body'])
            
            assert body['score'] == 100.0
            assert body['passed'] is True
            assert body['badge'] == 'Passed'
            assert body['badge_color'] == 'green'
            assert body['questions_correct'] == 4
            assert len(body['results']) == 4
