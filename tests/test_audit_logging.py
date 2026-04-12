"""
Unit Tests for Audit Logging Service

Tests the audit logging functionality with mocked AWS services.
"""

import pytest
import json
import uuid
from datetime import datetime
from unittest.mock import Mock, patch, MagicMock, call
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend', 'audit'))


@pytest.fixture
def mock_aws():
    """Mock AWS clients."""
    with patch('audit_logger.dynamodb') as mock_dynamodb, \
         patch('audit_logger.kms_client') as mock_kms:
        
        # Setup DynamoDB mock
        mock_table = MagicMock()
        mock_dynamodb.Table.return_value = mock_table
        
        # Setup KMS mock
        mock_kms.encrypt.return_value = {
            'CiphertextBlob': b'encrypted_data'
        }
        mock_kms.decrypt.return_value = {
            'Plaintext': b'{"key": "value"}'
        }
        
        yield {
            'dynamodb': mock_dynamodb,
            'table': mock_table,
            'kms': mock_kms
        }


class TestAuditLoggerBasic:
    """Basic tests for audit logger functionality."""
    
    def test_log_action_creates_record(self, mock_aws):
        """Test that log_action creates an audit record."""
        import audit_logger
        from audit_logger import AuditLogger
        
        # Setup
        audit_logger.audit_logs_table = mock_aws['table']
        audit_logger.kms_client = mock_aws['kms']
        mock_aws['table'].put_item.return_value = {}
        
        # Execute
        user_id = str(uuid.uuid4())
        result = AuditLogger.log_action(
            user_id=user_id,
            action_type='login',
            ip_address='192.168.1.1',
            device_info='Mozilla/5.0'
        )
        
        # Assert
        assert result['status'] == 'success'
        assert 'log_id' in result
        assert 'timestamp' in result
        mock_aws['table'].put_item.assert_called_once()
    
    def test_log_login_records_ip_and_device(self, mock_aws):
        """Test that log_login records IP address and device info."""
        from audit_logger import AuditLogger
        
        # Setup
        mock_table = mock_aws['table']
        mock_table.put_item.return_value = {}
        
        # Execute
        user_id = str(uuid.uuid4())
        ip_address = '192.168.1.1'
        device_info = 'Mozilla/5.0'
        
        result = AuditLogger.log_login(
            user_id=user_id,
            ip_address=ip_address,
            device_info=device_info
        )
        
        # Assert
        assert result['status'] == 'success'
        
        # Verify the stored record
        call_args = mock_table.put_item.call_args
        stored_item = call_args[1]['Item']
        
        assert stored_item['user_id'] == user_id
        assert stored_item['action_type'] == 'login'
        assert stored_item['ip_address'] == ip_address
        assert stored_item['device_info'] == device_info
    
    def test_log_practice_submit_records_session_data(self, mock_aws):
        """Test that log_practice_submit records session data."""
        from audit_logger import AuditLogger
        
        # Setup
        mock_table = mock_aws['table']
        mock_table.put_item.return_value = {}
        
        # Execute
        user_id = str(uuid.uuid4())
        session_id = str(uuid.uuid4())
        questions = [str(uuid.uuid4()) for _ in range(4)]
        answers = {q: 'A' for q in questions}
        score = 85.0
        
        result = AuditLogger.log_practice_submit(
            user_id=user_id,
            session_id=session_id,
            questions=questions,
            answers=answers,
            score=score
        )
        
        # Assert
        assert result['status'] == 'success'
        
        # Verify the stored record
        call_args = mock_table.put_item.call_args
        stored_item = call_args[1]['Item']
        
        assert stored_item['user_id'] == user_id
        assert stored_item['action_type'] == 'practice_submit'
        assert stored_item['resource_id'] == session_id
        assert stored_item['resource_type'] == 'practice_session'
    
    def test_log_question_modification_records_change(self, mock_aws):
        """Test that log_question_modification records change details."""
        from audit_logger import AuditLogger
        
        # Setup
        mock_table = mock_aws['table']
        mock_table.put_item.return_value = {}
        
        # Execute
        modifier_id = str(uuid.uuid4())
        question_id = str(uuid.uuid4())
        change_description = 'Updated question text'
        
        result = AuditLogger.log_question_modification(
            modifier_id=modifier_id,
            action_type='question_update',
            question_id=question_id,
            change_description=change_description
        )
        
        # Assert
        assert result['status'] == 'success'
        
        # Verify the stored record
        call_args = mock_table.put_item.call_args
        stored_item = call_args[1]['Item']
        
        assert stored_item['user_id'] == modifier_id
        assert stored_item['action_type'] == 'question_update'
        assert stored_item['resource_id'] == question_id
        assert stored_item['resource_type'] == 'question'
    
    def test_log_audit_log_access_creates_meta_audit(self, mock_aws):
        """Test that log_audit_log_access creates a meta-audit log."""
        from audit_logger import AuditLogger
        
        # Setup
        mock_table = mock_aws['table']
        mock_table.put_item.return_value = {}
        
        # Execute
        accessor_id = str(uuid.uuid4())
        date_range = {'start_date': '2024-01-01', 'end_date': '2024-01-31'}
        filters = {'user_id': 'test_user', 'action_type': 'login'}
        
        result = AuditLogger.log_audit_log_access(
            accessor_id=accessor_id,
            date_range=date_range,
            filters=filters
        )
        
        # Assert
        assert result['status'] == 'success'
        
        # Verify the stored record
        call_args = mock_table.put_item.call_args
        stored_item = call_args[1]['Item']
        
        assert stored_item['user_id'] == accessor_id
        assert stored_item['action_type'] == 'audit_log_access'
        assert stored_item['resource_type'] == 'audit_logs'
    
    def test_verify_immutability_returns_true_for_existing_record(self, mock_aws):
        """Test that verify_immutability returns True for existing records."""
        from audit_logger import AuditLogger
        
        # Setup
        mock_table = mock_aws['table']
        log_id = str(uuid.uuid4())
        
        mock_table.get_item.return_value = {
            'Item': {
                'log_id': log_id,
                'timestamp': datetime.utcnow().isoformat(),
                'user_id': 'test_user'
            }
        }
        
        # Execute
        result = AuditLogger.verify_immutability(log_id)
        
        # Assert
        assert result is True
    
    def test_verify_immutability_returns_false_for_missing_record(self, mock_aws):
        """Test that verify_immutability returns False for missing records."""
        from audit_logger import AuditLogger
        
        # Setup
        mock_table = mock_aws['table']
        log_id = str(uuid.uuid4())
        
        mock_table.get_item.return_value = {}
        
        # Execute
        result = AuditLogger.verify_immutability(log_id)
        
        # Assert
        assert result is False
    
    def test_get_audit_logs_retrieves_with_filters(self, mock_aws):
        """Test that get_audit_logs retrieves logs with filtering."""
        from audit_logger import AuditLogger
        
        # Setup
        mock_table = mock_aws['table']
        
        mock_logs = [
            {
                'log_id': str(uuid.uuid4()),
                'timestamp': '2024-01-15T10:00:00',
                'user_id': 'user1',
                'action_type': 'login'
            },
            {
                'log_id': str(uuid.uuid4()),
                'timestamp': '2024-01-20T15:30:00',
                'user_id': 'user2',
                'action_type': 'logout'
            }
        ]
        
        mock_table.scan.return_value = {
            'Items': mock_logs,
            'Count': len(mock_logs)
        }
        
        # Execute
        result = AuditLogger.get_audit_logs(
            start_date='2024-01-01T00:00:00',
            end_date='2024-01-31T23:59:59',
            user_id='user1',
            action_type='login'
        )
        
        # Assert
        assert result['status'] == 'success'
        assert result['count'] == len(mock_logs)
        assert len(result['logs']) == len(mock_logs)
        mock_table.scan.assert_called_once()


class TestAuditLoggerEncryption:
    """Tests for audit log encryption."""
    
    def test_encrypt_details_calls_kms(self, mock_aws):
        """Test that _encrypt_details calls KMS."""
        from audit_logger import AuditLogger
        
        # Setup
        mock_kms = mock_aws['kms']
        mock_kms.encrypt.return_value = {
            'CiphertextBlob': b'encrypted_data'
        }
        
        # Execute
        details = {'key': 'value', 'number': 42}
        result = AuditLogger._encrypt_details(details)
        
        # Assert
        assert result is not None
        mock_kms.encrypt.assert_called_once()
        
        # Verify KMS was called with correct parameters
        call_args = mock_kms.encrypt.call_args
        assert call_args[1]['KeyId'] == 'alias/jaiib-audit-key'
        assert json.loads(call_args[1]['Plaintext'].decode('utf-8')) == details
    
    def test_decrypt_details_calls_kms(self, mock_aws):
        """Test that _decrypt_details calls KMS."""
        from audit_logger import AuditLogger
        import base64
        
        # Setup
        mock_kms = mock_aws['kms']
        details = {'key': 'value', 'number': 42}
        details_json = json.dumps(details)
        
        mock_kms.decrypt.return_value = {
            'Plaintext': details_json.encode('utf-8')
        }
        
        # Execute
        encrypted = base64.b64encode(details_json.encode('utf-8')).decode('utf-8')
        result = AuditLogger._decrypt_details(encrypted)
        
        # Assert
        assert result == details
        mock_kms.decrypt.assert_called_once()


class TestAuditLoggerAllRequiredFields:
    """Tests for audit log completeness."""
    
    def test_audit_log_has_all_required_fields(self, mock_aws):
        """Test that audit logs include all required fields."""
        from audit_logger import AuditLogger
        
        # Setup
        mock_table = mock_aws['table']
        mock_table.put_item.return_value = {}
        
        # Execute
        user_id = str(uuid.uuid4())
        result = AuditLogger.log_action(
            user_id=user_id,
            action_type='login'
        )
        
        # Assert
        assert result['status'] == 'success'
        
        # Verify all required fields are present
        call_args = mock_table.put_item.call_args
        stored_item = call_args[1]['Item']
        
        required_fields = [
            'log_id', 'timestamp', 'user_id', 'action_type',
            'resource_id', 'resource_type', 'result',
            'ip_address', 'device_info'
        ]
        
        for field in required_fields:
            assert field in stored_item
            assert stored_item[field] is not None
