"""
Unit Tests for Question Bank Rollback Service

Tests the rollback functionality including:
- Rollback initiation with confirmation
- Rollback execution and version restoration
- Rollback action recording
- New version snapshot creation
"""

import pytest
import json
from datetime import datetime
from unittest.mock import patch, MagicMock, call
import sys

sys.path.insert(0, 'backend/question_bank')

from version_manager import (
    initiate_rollback,
    confirm_and_execute_rollback,
    get_incomplete_practice_sessions_for_version
)


class TestRollbackInitiation:
    """Test rollback initiation with confirmation requirement"""
    
    @patch('version_manager.get_version_history_table')
    def test_initiate_rollback_requires_confirmation(self, mock_vh_table):
        """Rollback initiation should return confirmation details"""
        mock_vh_instance = MagicMock()
        mock_vh_table.return_value = mock_vh_instance
        
        # Mock version exists
        mock_vh_instance.scan.return_value = {
            'Items': [
                {
                    'version_number': 'v1.0',
                    'publisher_user_id': 'user1',
                    'publication_timestamp': '2024-01-01T10:00:00',
                    'change_summary': 'Initial version',
                    'question_count': 100
                }
            ]
        }
        
        result = initiate_rollback('v1.0')
        
        assert result['success'] is True
        assert result['requires_confirmation'] is True
        assert result['target_version'] == 'v1.0'
        assert 'target_version_details' in result
        assert result['target_version_details']['question_count'] == 100
    
    @patch('version_manager.get_version_history_table')
    def test_initiate_rollback_version_not_found(self, mock_vh_table):
        """Rollback initiation should fail if version doesn't exist"""
        mock_vh_instance = MagicMock()
        mock_vh_table.return_value = mock_vh_instance
        
        # Mock version not found
        mock_vh_instance.scan.return_value = {'Items': []}
        
        result = initiate_rollback('v99.0')
        
        assert result['success'] is False
        assert 'not found' in result['error']
    
    @patch('version_manager.get_version_history_table')
    @patch('version_manager.get_latest_version')
    def test_initiate_rollback_includes_current_version(self, mock_latest, mock_vh_table):
        """Rollback initiation should include current version info"""
        mock_vh_instance = MagicMock()
        mock_vh_table.return_value = mock_vh_instance
        mock_latest.return_value = 'v2.0'
        
        mock_vh_instance.scan.return_value = {
            'Items': [
                {
                    'version_number': 'v1.0',
                    'publisher_user_id': 'user1',
                    'publication_timestamp': '2024-01-01T10:00:00',
                    'change_summary': 'Initial version',
                    'question_count': 100
                }
            ]
        }
        
        result = initiate_rollback('v1.0')
        
        assert result['current_version'] == 'v2.0'


class TestRollbackExecution:
    """Test rollback execution and version restoration"""
    
    @patch('version_manager.cloudwatch')
    @patch('version_manager.get_question_bank_table')
    @patch('version_manager.get_version_history_table')
    def test_confirm_rollback_creates_new_version(self, mock_vh_table, mock_qb_table, mock_cw):
        """Rollback execution should create new version snapshot"""
        mock_vh_instance = MagicMock()
        mock_qb_instance = MagicMock()
        mock_vh_table.return_value = mock_vh_instance
        mock_qb_table.return_value = mock_qb_instance
        
        # Mock target version
        questions = [
            {
                'question_id': 'q1',
                'question_text': 'Question 1',
                'options': ['A', 'B', 'C', 'D'],
                'correct_answer': 'A'
            }
        ]
        
        mock_vh_instance.scan.side_effect = [
            # First call: find target version
            {
                'Items': [
                    {
                        'version_number': 'v1.0',
                        'publisher_user_id': 'user1',
                        'publication_timestamp': '2024-01-01T10:00:00',
                        'change_summary': 'Initial version',
                        'question_count': 1,
                        'questions_snapshot': json.dumps(questions)
                    }
                ]
            },
            # Second call: get existing versions for next version number
            {
                'Items': [
                    {'version_number': 'v1.0'},
                    {'version_number': 'v1.1'},
                    {'version_number': 'v2.0'}
                ]
            }
        ]
        
        result = confirm_and_execute_rollback(
            target_version='v1.0',
            initiator_user_id='admin1',
            rollback_reason='Incorrect questions detected'
        )
        
        assert result['success'] is True
        assert result['target_version'] == 'v1.0'
        assert 'new_version' in result
        assert result['questions_restored'] == 1
        assert 'rollback_id' in result
    
    @patch('version_manager.get_version_history_table')
    def test_confirm_rollback_target_version_not_found(self, mock_vh_table):
        """Rollback should fail if target version doesn't exist"""
        mock_vh_instance = MagicMock()
        mock_vh_table.return_value = mock_vh_instance
        
        mock_vh_instance.scan.return_value = {'Items': []}
        
        result = confirm_and_execute_rollback(
            target_version='v99.0',
            initiator_user_id='admin1',
            rollback_reason='Test'
        )
        
        assert result['success'] is False
        assert 'not found' in result['error']
    
    @patch('version_manager.cloudwatch')
    @patch('version_manager.get_question_bank_table')
    @patch('version_manager.get_version_history_table')
    def test_confirm_rollback_records_initiator(self, mock_vh_table, mock_qb_table, mock_cw):
        """Rollback should record initiator user ID"""
        mock_vh_instance = MagicMock()
        mock_qb_instance = MagicMock()
        mock_vh_table.return_value = mock_vh_instance
        mock_qb_table.return_value = mock_qb_instance
        
        questions = []
        mock_vh_instance.scan.side_effect = [
            {
                'Items': [
                    {
                        'version_number': 'v1.0',
                        'publisher_user_id': 'user1',
                        'publication_timestamp': '2024-01-01T10:00:00',
                        'change_summary': 'Initial version',
                        'question_count': 0,
                        'questions_snapshot': json.dumps(questions)
                    }
                ]
            },
            {
                'Items': [{'version_number': 'v1.0'}]
            }
        ]
        
        result = confirm_and_execute_rollback(
            target_version='v1.0',
            initiator_user_id='admin_user_123',
            rollback_reason='Test rollback'
        )
        
        assert result['success'] is True
        assert result['initiator_user_id'] == 'admin_user_123'
    
    @patch('version_manager.cloudwatch')
    @patch('version_manager.get_question_bank_table')
    @patch('version_manager.get_version_history_table')
    def test_confirm_rollback_records_reason(self, mock_vh_table, mock_qb_table, mock_cw):
        """Rollback should record the reason in change summary"""
        mock_vh_instance = MagicMock()
        mock_qb_instance = MagicMock()
        mock_vh_table.return_value = mock_vh_instance
        mock_qb_table.return_value = mock_qb_instance
        
        questions = []
        mock_vh_instance.scan.side_effect = [
            {
                'Items': [
                    {
                        'version_number': 'v1.0',
                        'publisher_user_id': 'user1',
                        'publication_timestamp': '2024-01-01T10:00:00',
                        'change_summary': 'Initial version',
                        'question_count': 0,
                        'questions_snapshot': json.dumps(questions)
                    }
                ]
            },
            {
                'Items': [{'version_number': 'v1.0'}]
            }
        ]
        
        rollback_reason = 'Detected data corruption in v2.0'
        result = confirm_and_execute_rollback(
            target_version='v1.0',
            initiator_user_id='admin1',
            rollback_reason=rollback_reason
        )
        
        assert result['success'] is True
        # Verify the reason is included in the change summary
        call_args = mock_vh_instance.put_item.call_args
        item = call_args[1]['Item']
        assert rollback_reason in item['change_summary']
    
    @patch('version_manager.cloudwatch')
    @patch('version_manager.get_question_bank_table')
    @patch('version_manager.get_version_history_table')
    def test_confirm_rollback_publishes_metric(self, mock_vh_table, mock_qb_table, mock_cw):
        """Rollback execution should publish CloudWatch metric"""
        mock_vh_instance = MagicMock()
        mock_qb_instance = MagicMock()
        mock_vh_table.return_value = mock_vh_instance
        mock_qb_table.return_value = mock_qb_instance
        
        questions = []
        mock_vh_instance.scan.side_effect = [
            {
                'Items': [
                    {
                        'version_number': 'v1.0',
                        'publisher_user_id': 'user1',
                        'publication_timestamp': '2024-01-01T10:00:00',
                        'change_summary': 'Initial version',
                        'question_count': 0,
                        'questions_snapshot': json.dumps(questions)
                    }
                ]
            },
            {
                'Items': [{'version_number': 'v1.0'}]
            }
        ]
        
        result = confirm_and_execute_rollback(
            target_version='v1.0',
            initiator_user_id='admin1',
            rollback_reason='Test'
        )
        
        assert result['success'] is True
        # Verify CloudWatch metric was published
        mock_cw.put_metric_data.assert_called()


class TestRollbackWithIncompleteSessions:
    """Test rollback behavior with incomplete practice sessions"""
    
    def test_get_incomplete_sessions_for_version(self):
        """Should retrieve incomplete sessions for a version"""
        # This is a placeholder test as practice sessions are in separate table
        result = get_incomplete_practice_sessions_for_version('v1.0')
        
        # Should return a list (empty for now)
        assert isinstance(result, list)


class TestRollbackIntegration:
    """Integration tests for rollback workflow"""
    
    @patch('version_manager.cloudwatch')
    @patch('version_manager.get_question_bank_table')
    @patch('version_manager.get_version_history_table')
    def test_rollback_workflow_initiate_then_confirm(self, mock_vh_table, mock_qb_table, mock_cw):
        """Test complete rollback workflow: initiate then confirm"""
        mock_vh_instance = MagicMock()
        mock_qb_instance = MagicMock()
        mock_vh_table.return_value = mock_vh_instance
        mock_qb_table.return_value = mock_qb_instance
        
        questions = [
            {
                'question_id': 'q1',
                'question_text': 'Question 1',
                'options': ['A', 'B', 'C', 'D'],
                'correct_answer': 'A'
            }
        ]
        
        # Step 1: Initiate rollback
        mock_vh_instance.scan.return_value = {
            'Items': [
                {
                    'version_number': 'v1.0',
                    'publisher_user_id': 'user1',
                    'publication_timestamp': '2024-01-01T10:00:00',
                    'change_summary': 'Initial version',
                    'question_count': 1,
                    'questions_snapshot': json.dumps(questions)
                }
            ]
        }
        
        initiate_result = initiate_rollback('v1.0')
        assert initiate_result['success'] is True
        assert initiate_result['requires_confirmation'] is True
        
        # Step 2: Confirm rollback
        mock_vh_instance.scan.side_effect = [
            {
                'Items': [
                    {
                        'version_number': 'v1.0',
                        'publisher_user_id': 'user1',
                        'publication_timestamp': '2024-01-01T10:00:00',
                        'change_summary': 'Initial version',
                        'question_count': 1,
                        'questions_snapshot': json.dumps(questions)
                    }
                ]
            },
            {
                'Items': [{'version_number': 'v1.0'}]
            }
        ]
        
        confirm_result = confirm_and_execute_rollback(
            target_version='v1.0',
            initiator_user_id='admin1',
            rollback_reason='Test rollback'
        )
        
        assert confirm_result['success'] is True
        assert confirm_result['target_version'] == 'v1.0'
        assert 'new_version' in confirm_result


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
