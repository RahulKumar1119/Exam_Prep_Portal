"""
Unit tests for Question Bank Version Manager

Tests version creation, history retrieval, and version management functionality.
"""

import pytest
import json
from datetime import datetime
from unittest.mock import Mock, patch, MagicMock
from decimal import Decimal

# Mock boto3 before importing version_manager
import sys
from unittest.mock import MagicMock

sys.modules['boto3'] = MagicMock()

# Now we can import the module
import sys
sys.path.insert(0, 'backend/question_bank')

from version_manager import (
    generate_version_number,
    create_version,
    get_version_history,
    get_version_details,
    get_latest_version
)


class TestGenerateVersionNumber:
    """Test version number generation logic"""
    
    def test_first_version_is_v1_0(self):
        """Test that first version is v1.0"""
        result = generate_version_number([])
        assert result == "v1.0"
    
    def test_increment_minor_version(self):
        """Test incrementing minor version"""
        result = generate_version_number(["v1.0"])
        assert result == "v1.1"
    
    def test_increment_from_multiple_versions(self):
        """Test incrementing from multiple existing versions"""
        result = generate_version_number(["v1.0", "v1.1", "v1.2"])
        assert result == "v1.3"
    
    def test_handles_major_version_changes(self):
        """Test handling of major version changes"""
        result = generate_version_number(["v1.0", "v1.1", "v2.0"])
        assert result == "v2.1"
    
    def test_ignores_invalid_versions(self):
        """Test that invalid version strings are ignored"""
        result = generate_version_number(["invalid", "v1.0", "bad"])
        assert result == "v1.1"
    
    def test_handles_empty_invalid_list(self):
        """Test handling of list with only invalid versions"""
        result = generate_version_number(["invalid", "bad"])
        assert result == "v1.0"


class TestVersionCreation:
    """Test version creation functionality"""
    
    @patch('version_manager.get_version_history_table')
    @patch('version_manager.get_question_bank_table')
    @patch('version_manager.cloudwatch')
    def test_create_version_with_questions(self, mock_cw, mock_qb_table, mock_vh_table):
        """Test creating a version with provided questions"""
        # Setup mocks
        mock_vh_instance = MagicMock()
        mock_qb_instance = MagicMock()
        mock_vh_table.return_value = mock_vh_instance
        mock_qb_table.return_value = mock_qb_instance
        
        # Mock scan response for existing versions
        mock_vh_instance.scan.return_value = {'Items': []}
        
        # Test data
        questions = [
            {
                'question_id': 'q1',
                'question_text': 'What is RBI?',
                'options': ['A', 'B', 'C', 'D'],
                'correct_answer': 'A',
                'topic': 'Banking',
                'difficulty': 'easy'
            }
        ]
        
        result = create_version(
            publisher_user_id='user123',
            change_summary='Initial version',
            questions_data=questions
        )
        
        assert result['success'] is True
        assert result['version_number'] == 'v1.0'
        assert result['question_count'] == 1
        assert 'version_id' in result
        assert 'publication_timestamp' in result
    
    @patch('version_manager.get_version_history_table')
    @patch('version_manager.get_question_bank_table')
    @patch('version_manager.cloudwatch')
    def test_create_version_increments_version_number(self, mock_cw, mock_qb_table, mock_vh_table):
        """Test that version numbers increment correctly"""
        mock_vh_instance = MagicMock()
        mock_qb_instance = MagicMock()
        mock_vh_table.return_value = mock_vh_instance
        mock_qb_table.return_value = mock_qb_instance
        
        # Mock existing versions
        mock_vh_instance.scan.return_value = {
            'Items': [
                {'version_number': 'v1.0'},
                {'version_number': 'v1.1'}
            ]
        }
        
        result = create_version(
            publisher_user_id='user123',
            change_summary='Updated questions',
            questions_data=[]
        )
        
        assert result['version_number'] == 'v1.2'
    
    @patch('version_manager.get_version_history_table')
    @patch('version_manager.get_question_bank_table')
    @patch('version_manager.cloudwatch')
    def test_create_version_records_metadata(self, mock_cw, mock_qb_table, mock_vh_table):
        """Test that version metadata is recorded correctly"""
        mock_vh_instance = MagicMock()
        mock_qb_instance = MagicMock()
        mock_vh_table.return_value = mock_vh_instance
        mock_qb_table.return_value = mock_qb_instance
        
        mock_vh_instance.scan.return_value = {'Items': []}
        
        publisher_id = 'trainer123'
        change_summary = 'Added new questions on RBI regulations'
        
        result = create_version(
            publisher_user_id=publisher_id,
            change_summary=change_summary,
            questions_data=[]
        )
        
        # Verify put_item was called with correct data
        call_args = mock_vh_instance.put_item.call_args
        assert call_args is not None
        
        item = call_args[1]['Item']
        assert item['publisher_user_id'] == publisher_id
        assert item['change_summary'] == change_summary
        assert 'publication_timestamp' in item
        assert 'version_id' in item


class TestVersionHistory:
    """Test version history retrieval"""
    
    @patch('version_manager.get_version_history_table')
    def test_get_version_history_returns_sorted_versions(self, mock_vh_table):
        """Test that version history is returned sorted by timestamp"""
        mock_vh_instance = MagicMock()
        mock_vh_table.return_value = mock_vh_instance
        
        # Mock scan response with unsorted versions
        mock_vh_instance.scan.return_value = {
            'Items': [
                {
                    'version_number': 'v1.0',
                    'publication_timestamp': '2024-01-01T10:00:00',
                    'change_summary': 'Initial'
                },
                {
                    'version_number': 'v1.1',
                    'publication_timestamp': '2024-01-02T10:00:00',
                    'change_summary': 'Update 1'
                }
            ],
            'Count': 2
        }
        
        result = get_version_history(limit=50)
        
        assert result['success'] is True
        assert len(result['versions']) == 2
        # Should be sorted descending by timestamp
        assert result['versions'][0]['version_number'] == 'v1.1'
        assert result['versions'][1]['version_number'] == 'v1.0'
    
    @patch('version_manager.get_version_history_table')
    def test_get_version_history_with_pagination(self, mock_vh_table):
        """Test version history pagination"""
        mock_vh_instance = MagicMock()
        mock_vh_table.return_value = mock_vh_instance
        
        mock_vh_instance.scan.return_value = {
            'Items': [
                {
                    'version_number': 'v1.0',
                    'publication_timestamp': '2024-01-01T10:00:00'
                }
            ],
            'Count': 1,
            'LastEvaluatedKey': {'version_id': 'key123'}
        }
        
        result = get_version_history(limit=1)
        
        assert result['success'] is True
        assert 'next_token' in result
        assert result['next_token'] is not None


class TestVersionDetails:
    """Test version details retrieval"""
    
    @patch('version_manager.get_version_history_table')
    def test_get_version_details_returns_questions(self, mock_vh_table):
        """Test that version details include questions snapshot"""
        mock_vh_instance = MagicMock()
        mock_vh_table.return_value = mock_vh_instance
        
        questions = [
            {
                'question_id': 'q1',
                'question_text': 'Test question',
                'correct_answer': 'A'
            }
        ]
        
        mock_vh_instance.scan.return_value = {
            'Items': [
                {
                    'version_id': 'v123',
                    'version_number': 'v1.0',
                    'publisher_user_id': 'user123',
                    'publication_timestamp': '2024-01-01T10:00:00',
                    'change_summary': 'Initial',
                    'question_count': 1,
                    'questions_snapshot': json.dumps(questions)
                }
            ]
        }
        
        result = get_version_details('v1.0')
        
        assert result['success'] is True
        assert result['version_number'] == 'v1.0'
        assert len(result['questions']) == 1
        assert result['questions'][0]['question_id'] == 'q1'
    
    @patch('version_manager.get_version_history_table')
    def test_get_version_details_not_found(self, mock_vh_table):
        """Test handling of non-existent version"""
        mock_vh_instance = MagicMock()
        mock_vh_table.return_value = mock_vh_instance
        
        mock_vh_instance.scan.return_value = {'Items': []}
        
        result = get_version_details('v99.0')
        
        assert result['success'] is False
        assert 'not found' in result['error'].lower()


class TestLatestVersion:
    """Test latest version retrieval"""
    
    @patch('version_manager.get_version_history_table')
    def test_get_latest_version_returns_most_recent(self, mock_vh_table):
        """Test that latest version is correctly identified"""
        mock_vh_instance = MagicMock()
        mock_vh_table.return_value = mock_vh_instance
        
        mock_vh_instance.scan.return_value = {
            'Items': [
                {
                    'version_number': 'v1.0',
                    'publication_timestamp': '2024-01-01T10:00:00'
                },
                {
                    'version_number': 'v1.1',
                    'publication_timestamp': '2024-01-02T10:00:00'
                },
                {
                    'version_number': 'v1.2',
                    'publication_timestamp': '2024-01-03T10:00:00'
                }
            ]
        }
        
        result = get_latest_version()
        
        assert result == 'v1.2'
    
    @patch('version_manager.get_version_history_table')
    def test_get_latest_version_no_versions(self, mock_vh_table):
        """Test handling when no versions exist"""
        mock_vh_instance = MagicMock()
        mock_vh_table.return_value = mock_vh_instance
        
        mock_vh_instance.scan.return_value = {'Items': []}
        
        result = get_latest_version()
        
        assert result is None


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
