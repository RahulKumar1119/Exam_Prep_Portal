"""
Tests for Question Bank Rollback Lambda Endpoints

Tests the Lambda function handlers for rollback operations:
- initiate_rollback endpoint
- confirm_rollback endpoint
"""

import pytest
import json
from unittest.mock import patch, MagicMock
import sys

sys.path.insert(0, 'backend/question_bank')

from lambda_function import handler, validate_request


class TestRollbackValidation:
    """Test request validation for rollback endpoints"""
    
    def test_validate_initiate_rollback_requires_target_version(self):
        """initiate_rollback action requires target_version"""
        event = {'action': 'initiate_rollback'}
        is_valid, error = validate_request(event)
        
        assert is_valid is False
        assert 'target_version' in error
    
    def test_validate_initiate_rollback_with_target_version(self):
        """initiate_rollback action is valid with target_version"""
        event = {
            'action': 'initiate_rollback',
            'target_version': 'v1.0'
        }
        is_valid, error = validate_request(event)
        
        assert is_valid is True
    
    def test_validate_confirm_rollback_requires_all_fields(self):
        """confirm_rollback action requires all required fields"""
        event = {'action': 'confirm_rollback'}
        is_valid, error = validate_request(event)
        
        assert is_valid is False
        assert 'target_version' in error
    
    def test_validate_confirm_rollback_requires_initiator(self):
        """confirm_rollback action requires initiator_user_id"""
        event = {
            'action': 'confirm_rollback',
            'target_version': 'v1.0'
        }
        is_valid, error = validate_request(event)
        
        assert is_valid is False
        assert 'initiator_user_id' in error
    
    def test_validate_confirm_rollback_requires_reason(self):
        """confirm_rollback action requires rollback_reason"""
        event = {
            'action': 'confirm_rollback',
            'target_version': 'v1.0',
            'initiator_user_id': 'admin1'
        }
        is_valid, error = validate_request(event)
        
        assert is_valid is False
        assert 'rollback_reason' in error
    
    def test_validate_confirm_rollback_with_all_fields(self):
        """confirm_rollback action is valid with all required fields"""
        event = {
            'action': 'confirm_rollback',
            'target_version': 'v1.0',
            'initiator_user_id': 'admin1',
            'rollback_reason': 'Test rollback'
        }
        is_valid, error = validate_request(event)
        
        assert is_valid is True


class TestInitiateRollbackEndpoint:
    """Test initiate_rollback Lambda endpoint"""
    
    @patch('lambda_function.initiate_rollback')
    def test_initiate_rollback_success(self, mock_initiate):
        """initiate_rollback endpoint should return confirmation details"""
        mock_initiate.return_value = {
            'success': True,
            'requires_confirmation': True,
            'target_version': 'v1.0',
            'target_version_details': {
                'version_number': 'v1.0',
                'question_count': 100
            }
        }
        
        event = {
            'action': 'initiate_rollback',
            'target_version': 'v1.0'
        }
        
        response = handler(event, None)
        
        assert response['statusCode'] == 200
        body = json.loads(response['body'])
        assert body['success'] is True
        assert body['requires_confirmation'] is True
    
    @patch('lambda_function.initiate_rollback')
    def test_initiate_rollback_version_not_found(self, mock_initiate):
        """initiate_rollback endpoint should return 404 if version not found"""
        mock_initiate.return_value = {
            'success': False,
            'error': 'Version v99.0 not found'
        }
        
        event = {
            'action': 'initiate_rollback',
            'target_version': 'v99.0'
        }
        
        response = handler(event, None)
        
        assert response['statusCode'] == 404
        body = json.loads(response['body'])
        assert body['success'] is False


class TestConfirmRollbackEndpoint:
    """Test confirm_rollback Lambda endpoint"""
    
    @patch('lambda_function.publish_metric')
    @patch('lambda_function.confirm_and_execute_rollback')
    def test_confirm_rollback_success(self, mock_confirm, mock_metric):
        """confirm_rollback endpoint should execute rollback and return result"""
        mock_confirm.return_value = {
            'success': True,
            'rollback_id': 'rb123',
            'target_version': 'v1.0',
            'new_version': 'v2.1',
            'questions_restored': 100
        }
        
        event = {
            'action': 'confirm_rollback',
            'target_version': 'v1.0',
            'initiator_user_id': 'admin1',
            'rollback_reason': 'Test rollback'
        }
        
        response = handler(event, None)
        
        assert response['statusCode'] == 200
        body = json.loads(response['body'])
        assert body['success'] is True
        assert body['rollback_id'] == 'rb123'
        assert body['new_version'] == 'v2.1'
        
        # Verify metric was published
        mock_metric.assert_called_with('RollbackExecuted', 1)
    
    @patch('lambda_function.confirm_and_execute_rollback')
    def test_confirm_rollback_failure(self, mock_confirm):
        """confirm_rollback endpoint should return 400 on failure"""
        mock_confirm.return_value = {
            'success': False,
            'error': 'Target version not found'
        }
        
        event = {
            'action': 'confirm_rollback',
            'target_version': 'v99.0',
            'initiator_user_id': 'admin1',
            'rollback_reason': 'Test'
        }
        
        response = handler(event, None)
        
        assert response['statusCode'] == 400
        body = json.loads(response['body'])
        assert body['success'] is False


class TestRollbackEndpointIntegration:
    """Integration tests for rollback endpoints"""
    
    @patch('lambda_function.confirm_and_execute_rollback')
    @patch('lambda_function.initiate_rollback')
    def test_rollback_workflow_endpoints(self, mock_initiate, mock_confirm):
        """Test complete rollback workflow through endpoints"""
        # Step 1: Initiate rollback
        mock_initiate.return_value = {
            'success': True,
            'requires_confirmation': True,
            'target_version': 'v1.0',
            'target_version_details': {
                'version_number': 'v1.0',
                'question_count': 100
            }
        }
        
        initiate_event = {
            'action': 'initiate_rollback',
            'target_version': 'v1.0'
        }
        
        initiate_response = handler(initiate_event, None)
        assert initiate_response['statusCode'] == 200
        
        # Step 2: Confirm rollback
        mock_confirm.return_value = {
            'success': True,
            'rollback_id': 'rb123',
            'target_version': 'v1.0',
            'new_version': 'v2.1',
            'questions_restored': 100
        }
        
        confirm_event = {
            'action': 'confirm_rollback',
            'target_version': 'v1.0',
            'initiator_user_id': 'admin1',
            'rollback_reason': 'Test rollback'
        }
        
        confirm_response = handler(confirm_event, None)
        assert confirm_response['statusCode'] == 200
        body = json.loads(confirm_response['body'])
        assert body['success'] is True


class TestRollbackErrorHandling:
    """Test error handling in rollback endpoints"""
    
    def test_missing_action_parameter(self):
        """Handler should return 400 if action is missing"""
        event = {}
        response = handler(event, None)
        
        assert response['statusCode'] == 400
        body = json.loads(response['body'])
        assert 'action' in body['error']
    
    def test_unknown_action(self):
        """Handler should return 400 for unknown action"""
        event = {'action': 'unknown_action'}
        response = handler(event, None)
        
        assert response['statusCode'] == 400
        body = json.loads(response['body'])
        assert 'Unknown action' in body['error']
    
    @patch('lambda_function.initiate_rollback')
    def test_exception_handling(self, mock_initiate):
        """Handler should catch exceptions and return 500"""
        mock_initiate.side_effect = Exception('Database error')
        
        event = {
            'action': 'initiate_rollback',
            'target_version': 'v1.0'
        }
        
        response = handler(event, None)
        
        assert response['statusCode'] == 500
        body = json.loads(response['body'])
        assert body['success'] is False


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
