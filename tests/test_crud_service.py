"""
Unit tests for Question Bank CRUD Service

Tests MCQ creation, retrieval, update, deletion, and search operations.
"""

import pytest
import sys
import os
from datetime import datetime
from unittest.mock import Mock, patch, MagicMock

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend', 'question_bank'))

from crud_service import (
    validate_mcq_fields,
    create_mcq,
    get_mcq,
    update_mcq,
    delete_mcq,
    search_mcqs,
    get_mcq_versions,
    VALID_PAPERS,
    VALID_DIFFICULTIES
)


class TestValidateMCQFields:
    """Test MCQ field validation"""
    
    def test_valid_mcq_fields(self):
        """Test validation passes for valid MCQ fields"""
        is_valid, error = validate_mcq_fields(
            question_text="What is the primary function of the RBI?",
            options=["Monetary policy", "Fiscal policy", "Trade policy", "Tax collection"],
            correct_answer="A",
            topic="RBI Functions",
            difficulty="medium",
            references={
                "rbi_reference": "RBI Act, 1934",
                "iibf_reference": "JAIIB Module 1"
            },
            paper="IE & IFS"
        )
        assert is_valid is True
        assert error == ""
    
    def test_invalid_question_text_empty(self):
        """Test validation fails for empty question text"""
        is_valid, error = validate_mcq_fields(
            question_text="",
            options=["A", "B", "C", "D"],
            correct_answer="A",
            topic="Topic",
            difficulty="easy",
            references={"rbi_reference": "ref", "iibf_reference": "ref"},
            paper="IE & IFS"
        )
        assert is_valid is False
        assert "Question text is required" in error
    
    def test_invalid_question_text_too_short(self):
        """Test validation fails for question text < 10 chars"""
        is_valid, error = validate_mcq_fields(
            question_text="Short",
            options=["A", "B", "C", "D"],
            correct_answer="A",
            topic="Topic",
            difficulty="easy",
            references={"rbi_reference": "ref", "iibf_reference": "ref"},
            paper="IE & IFS"
        )
        assert is_valid is False
        assert "at least 10 characters" in error
    
    def test_invalid_options_count(self):
        """Test validation fails for wrong number of options"""
        is_valid, error = validate_mcq_fields(
            question_text="What is the correct answer?",
            options=["A", "B", "C"],  # Only 3 options
            correct_answer="A",
            topic="Topic",
            difficulty="easy",
            references={"rbi_reference": "ref", "iibf_reference": "ref"},
            paper="IE & IFS"
        )
        assert is_valid is False
        assert "exactly 4 options" in error
    
    def test_invalid_correct_answer(self):
        """Test validation fails for invalid correct answer"""
        is_valid, error = validate_mcq_fields(
            question_text="What is the correct answer?",
            options=["Option A", "Option B", "Option C", "Option D"],
            correct_answer="E",  # Invalid
            topic="Topic",
            difficulty="easy",
            references={"rbi_reference": "ref", "iibf_reference": "ref"},
            paper="IE & IFS"
        )
        assert is_valid is False
        assert "A, B, C, or D" in error
    
    def test_invalid_difficulty(self):
        """Test validation fails for invalid difficulty"""
        is_valid, error = validate_mcq_fields(
            question_text="What is the correct answer?",
            options=["Option A", "Option B", "Option C", "Option D"],
            correct_answer="A",
            topic="Topic",
            difficulty="impossible",  # Invalid
            references={"rbi_reference": "ref", "iibf_reference": "ref"},
            paper="IE & IFS"
        )
        assert is_valid is False
        assert "easy, medium, hard" in error
    
    def test_invalid_paper(self):
        """Test validation fails for invalid paper"""
        is_valid, error = validate_mcq_fields(
            question_text="What is the correct answer?",
            options=["Option A", "Option B", "Option C", "Option D"],
            correct_answer="A",
            topic="Topic",
            difficulty="easy",
            references={"rbi_reference": "ref", "iibf_reference": "ref"},
            paper="Invalid Paper"
        )
        assert is_valid is False
        assert "IE & IFS, PPB, AFB, RBWM" in error
    
    def test_missing_rbi_reference(self):
        """Test validation fails for missing RBI reference"""
        is_valid, error = validate_mcq_fields(
            question_text="What is the correct answer?",
            options=["Option A", "Option B", "Option C", "Option D"],
            correct_answer="A",
            topic="Topic",
            difficulty="easy",
            references={"iibf_reference": "ref"},  # Missing RBI reference
            paper="IE & IFS"
        )
        assert is_valid is False
        assert "RBI reference is required" in error
    
    def test_missing_iibf_reference(self):
        """Test validation fails for missing IIBF reference"""
        is_valid, error = validate_mcq_fields(
            question_text="What is the correct answer?",
            options=["Option A", "Option B", "Option C", "Option D"],
            correct_answer="A",
            topic="Topic",
            difficulty="easy",
            references={"rbi_reference": "ref"},  # Missing IIBF reference
            paper="IE & IFS"
        )
        assert is_valid is False
        assert "IIBF reference is required" in error


class TestCreateMCQ:
    """Test MCQ creation"""
    
    @patch('crud_service.get_question_bank_table')
    @patch('crud_service.cloudwatch')
    def test_create_mcq_success(self, mock_cw, mock_table):
        """Test successful MCQ creation"""
        mock_db_table = MagicMock()
        mock_table.return_value = mock_db_table
        
        result = create_mcq(
            question_text="What is the primary function of the RBI?",
            options=["Monetary policy", "Fiscal policy", "Trade policy", "Tax collection"],
            correct_answer="A",
            topic="RBI Functions",
            difficulty="medium",
            references={
                "rbi_reference": "RBI Act, 1934",
                "iibf_reference": "JAIIB Module 1"
            },
            paper="IE & IFS",
            creator_user_id="user123"
        )
        
        assert result['success'] is True
        assert 'question_id' in result
        assert result['version'] == 'v1.0'
        assert 'created_at' in result
        mock_db_table.put_item.assert_called_once()
    
    @patch('crud_service.get_question_bank_table')
    def test_create_mcq_validation_failure(self, mock_table):
        """Test MCQ creation fails with invalid data"""
        result = create_mcq(
            question_text="Short",  # Too short
            options=["A", "B", "C", "D"],
            correct_answer="A",
            topic="Topic",
            difficulty="easy",
            references={"rbi_reference": "ref", "iibf_reference": "ref"},
            paper="IE & IFS",
            creator_user_id="user123"
        )
        
        assert result['success'] is False
        assert 'error' in result


class TestGetMCQ:
    """Test MCQ retrieval"""
    
    @patch('crud_service.get_question_bank_table')
    def test_get_mcq_specific_version(self, mock_table):
        """Test retrieving specific MCQ version"""
        mock_db_table = MagicMock()
        mock_table.return_value = mock_db_table
        
        mock_item = {
            'question_id': 'q123',
            'version': 'v1.0',
            'question_text': 'Test question',
            'correct_answer': 'A'
        }
        mock_db_table.get_item.return_value = {'Item': mock_item}
        
        result = get_mcq('q123', 'v1.0')
        
        assert result['success'] is True
        assert result['question'] == mock_item
    
    @patch('crud_service.get_question_bank_table')
    def test_get_mcq_latest_version(self, mock_table):
        """Test retrieving latest MCQ version"""
        mock_db_table = MagicMock()
        mock_table.return_value = mock_db_table
        
        mock_items = [
            {'question_id': 'q123', 'version': 'v1.0'},
            {'question_id': 'q123', 'version': 'v1.1'},
            {'question_id': 'q123', 'version': 'v1.2'}
        ]
        mock_db_table.query.return_value = {'Items': mock_items}
        
        result = get_mcq('q123')
        
        assert result['success'] is True
        assert result['question']['version'] == 'v1.2'
    
    @patch('crud_service.get_question_bank_table')
    def test_get_mcq_not_found(self, mock_table):
        """Test retrieving non-existent MCQ"""
        mock_db_table = MagicMock()
        mock_table.return_value = mock_db_table
        mock_db_table.get_item.return_value = {}
        mock_db_table.query.return_value = {'Items': []}
        
        result = get_mcq('nonexistent')
        
        assert result['success'] is False
        assert 'not found' in result['error']


class TestUpdateMCQ:
    """Test MCQ update"""
    
    @patch('crud_service.get_question_bank_table')
    @patch('crud_service.get_mcq')
    @patch('crud_service.cloudwatch')
    def test_update_mcq_success(self, mock_cw, mock_get, mock_table):
        """Test successful MCQ update"""
        mock_db_table = MagicMock()
        mock_table.return_value = mock_db_table
        
        mock_get.return_value = {
            'success': True,
            'question': {
                'question_id': 'q123',
                'version': 'v1.0',
                'question_text': 'Old question',
                'options': ['Option A', 'Option B', 'Option C', 'Option D'],
                'correct_answer': 'A',
                'topic': 'Topic',
                'difficulty': 'easy',
                'paper': 'IE & IFS',
                'rbi_reference': 'ref1',
                'iibf_reference': 'ref2',
                'created_at': '2024-01-01',
                'created_by': 'user1'
            }
        }
        
        result = update_mcq(
            question_id='q123',
            question_text='New question text that is long enough to pass validation',
            updater_user_id='user2'
        )
        
        assert result['success'] is True
        assert result['new_version'] == 'v1.1'
        assert result['previous_version'] == 'v1.0'
    
    @patch('crud_service.get_mcq')
    def test_update_mcq_not_found(self, mock_get):
        """Test update fails for non-existent MCQ"""
        mock_get.return_value = {
            'success': False,
            'error': 'Question not found'
        }
        
        result = update_mcq(
            question_id='nonexistent',
            question_text='New text',
            updater_user_id='user2'
        )
        
        assert result['success'] is False


class TestDeleteMCQ:
    """Test MCQ deletion"""
    
    @patch('crud_service.get_question_bank_table')
    @patch('crud_service.get_mcq')
    @patch('crud_service.cloudwatch')
    def test_delete_mcq_success(self, mock_cw, mock_get, mock_table):
        """Test successful MCQ deletion (soft delete)"""
        mock_db_table = MagicMock()
        mock_table.return_value = mock_db_table
        
        mock_get.return_value = {
            'success': True,
            'question': {
                'question_id': 'q123',
                'version': 'v1.0'
            }
        }
        
        result = delete_mcq('q123', 'user2')
        
        assert result['success'] is True
        assert 'marked as inactive' in result['message']
        mock_db_table.update_item.assert_called_once()
    
    @patch('crud_service.get_mcq')
    def test_delete_mcq_not_found(self, mock_get):
        """Test delete fails for non-existent MCQ"""
        mock_get.return_value = {
            'success': False,
            'error': 'Question not found'
        }
        
        result = delete_mcq('nonexistent', 'user2')
        
        assert result['success'] is False


class TestSearchMCQs:
    """Test MCQ search"""
    
    @patch('crud_service.get_question_bank_table')
    def test_search_mcqs_by_paper(self, mock_table):
        """Test searching MCQs by paper"""
        mock_db_table = MagicMock()
        mock_table.return_value = mock_db_table
        
        mock_items = [
            {'question_id': 'q1', 'version': 'v1.0', 'paper': 'IE & IFS'},
            {'question_id': 'q2', 'version': 'v1.0', 'paper': 'IE & IFS'}
        ]
        mock_db_table.scan.return_value = {'Items': mock_items, 'Count': 2}
        
        result = search_mcqs(paper='IE & IFS')
        
        assert result['success'] is True
        assert result['count'] == 2
    
    @patch('crud_service.get_question_bank_table')
    def test_search_mcqs_by_topic(self, mock_table):
        """Test searching MCQs by topic"""
        mock_db_table = MagicMock()
        mock_table.return_value = mock_db_table
        
        mock_items = [
            {'question_id': 'q1', 'version': 'v1.0', 'topic': 'RBI Functions'}
        ]
        mock_db_table.scan.return_value = {'Items': mock_items, 'Count': 1}
        
        result = search_mcqs(topic='RBI Functions')
        
        assert result['success'] is True
        assert result['count'] == 1
    
    @patch('crud_service.get_question_bank_table')
    def test_search_mcqs_by_difficulty(self, mock_table):
        """Test searching MCQs by difficulty"""
        mock_db_table = MagicMock()
        mock_table.return_value = mock_db_table
        
        mock_items = [
            {'question_id': 'q1', 'version': 'v1.0', 'difficulty': 'hard'}
        ]
        mock_db_table.scan.return_value = {'Items': mock_items, 'Count': 1}
        
        result = search_mcqs(difficulty='hard')
        
        assert result['success'] is True
        assert result['count'] == 1
    
    @patch('crud_service.get_question_bank_table')
    def test_search_mcqs_by_keyword(self, mock_table):
        """Test searching MCQs by keyword"""
        mock_db_table = MagicMock()
        mock_table.return_value = mock_db_table
        
        mock_items = [
            {'question_id': 'q1', 'version': 'v1.0', 'question_text': 'RBI policy'}
        ]
        mock_db_table.scan.return_value = {'Items': mock_items, 'Count': 1}
        
        result = search_mcqs(keyword='RBI')
        
        assert result['success'] is True
        assert result['count'] == 1
    
    @patch('crud_service.get_question_bank_table')
    def test_search_mcqs_multiple_filters(self, mock_table):
        """Test searching MCQs with multiple filters"""
        mock_db_table = MagicMock()
        mock_table.return_value = mock_db_table
        
        mock_items = [
            {'question_id': 'q1', 'version': 'v1.0', 'paper': 'IE & IFS', 'difficulty': 'medium'}
        ]
        mock_db_table.scan.return_value = {'Items': mock_items, 'Count': 1}
        
        result = search_mcqs(paper='IE & IFS', difficulty='medium')
        
        assert result['success'] is True
        assert result['count'] == 1


class TestGetMCQVersions:
    """Test MCQ version retrieval"""
    
    @patch('crud_service.get_question_bank_table')
    def test_get_mcq_versions_success(self, mock_table):
        """Test retrieving all versions of an MCQ"""
        mock_db_table = MagicMock()
        mock_table.return_value = mock_db_table
        
        mock_versions = [
            {'question_id': 'q123', 'version': 'v1.0'},
            {'question_id': 'q123', 'version': 'v1.1'},
            {'question_id': 'q123', 'version': 'v1.2'}
        ]
        mock_db_table.query.return_value = {'Items': mock_versions}
        
        result = get_mcq_versions('q123')
        
        assert result['success'] is True
        assert result['version_count'] == 3
        # Verify sorted in descending order
        assert result['versions'][0]['version'] == 'v1.2'
        assert result['versions'][1]['version'] == 'v1.1'
        assert result['versions'][2]['version'] == 'v1.0'
    
    @patch('crud_service.get_question_bank_table')
    def test_get_mcq_versions_empty(self, mock_table):
        """Test retrieving versions for non-existent MCQ"""
        mock_db_table = MagicMock()
        mock_table.return_value = mock_db_table
        mock_db_table.query.return_value = {'Items': []}
        
        result = get_mcq_versions('nonexistent')
        
        assert result['success'] is True
        assert result['version_count'] == 0
