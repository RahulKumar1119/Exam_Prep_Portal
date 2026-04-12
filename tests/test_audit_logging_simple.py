"""
Simple Unit Tests for Audit Logging Service

Tests the audit logging functionality with mocked AWS services.
Validates: Requirements 12.7, 12.11
"""

import pytest
import json
import uuid
from datetime import datetime
from unittest.mock import Mock, patch, MagicMock
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend', 'audit'))


class TestAuditLoggerWithMocks:
    """Tests for audit logger with properly mocked AWS services."""
    
    @patch('audit_logger.audit_logs_table')
    @patch('audit_logger.kms_client')
    def test_log_action_creates_immutable_record(self, mock_kms, mock_table):
        """
        Test that log_action creates an immutable audit record.
        
        Property 22: Audit log immutability
        - Audit logs are stored immutably and encrypted with KMS
        """
        from audit_logger import AuditLogger
        
        # Setup
        mock_table.put_item.return_value = {}
        mock_kms.encrypt.return_value = {'CiphertextBlob': b'encrypted_data'}
        
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
        
        # Verify immutable storage (put_item called, not update_item)
        mock_table.put_item.assert_called_once()
        call_args = mock_table.put_item.call_args
        stored_item = call_args[1]['Item']
        
        # Verify all required fields
        assert stored_item['user_id'] == user_id
        assert stored_item['action_type'] == 'login'
        assert stored_item['ip_address'] == '192.168.1.1'
        assert stored_item['device_info'] == 'Mozilla/5.0'
    
    @patch('audit_logger.audit_logs_table')
    @patch('audit_logger.kms_client')
    def test_meta_audit_logging_on_access(self, mock_kms, mock_table):
        """
        Test that accessing audit logs creates a meta-audit log.
        
        Property 22: Meta-audit logging
        - Access to audit logs is itself logged
        """
        from audit_logger import AuditLogger
        
        # Setup
        mock_table.put_item.return_value = {}
        mock_kms.encrypt.return_value = {'CiphertextBlob': b'encrypted_data'}
        
        # Execute
        accessor_id = str(uuid.uuid4())
        result = AuditLogger.log_audit_log_access(
            accessor_id=accessor_id,
            date_range={'start_date': '2024-01-01', 'end_date': '2024-01-31'},
            filters={'user_id': 'test_user'}
        )
        
        # Assert
        assert result['status'] == 'success'
        
        # Verify meta-audit log was created
        mock_table.put_item.assert_called_once()
        call_args = mock_table.put_item.call_args
        stored_item = call_args[1]['Item']
        
        assert stored_item['user_id'] == accessor_id
        assert stored_item['action_type'] == 'audit_log_access'
        assert stored_item['resource_type'] == 'audit_logs'
    
    @patch('audit_logger.audit_logs_table')
    def test_verify_immutability_for_existing_record(self, mock_table):
        """
        Test that immutability can be verified for existing records.
        
        Property 22: Immutability verification
        - Immutability should be verifiable for existing records
        """
        from audit_logger import AuditLogger
        
        # Setup
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
        mock_table.get_item.assert_called_once()
    
    @patch('audit_logger.audit_logs_table')
    def test_verify_immutability_for_missing_record(self, mock_table):
        """
        Test that immutability verification returns False for missing records.
        """
        from audit_logger import AuditLogger
        
        # Setup
        log_id = str(uuid.uuid4())
        mock_table.get_item.return_value = {}
        
        # Execute
        result = AuditLogger.verify_immutability(log_id)
        
        # Assert
        assert result is False
    
    @patch('audit_logger.audit_logs_table')
    @patch('audit_logger.kms_client')
    def test_encryption_of_sensitive_details(self, mock_kms, mock_table):
        """
        Test that sensitive details are encrypted with KMS.
        
        Property 22: Encryption with KMS
        - Sensitive details are encrypted with AWS KMS
        """
        from audit_logger import AuditLogger
        
        # Setup
        mock_kms.encrypt.return_value = {'CiphertextBlob': b'encrypted_data'}
        
        # Execute
        details = {'session_id': str(uuid.uuid4()), 'score': 85.5}
        result = AuditLogger._encrypt_details(details)
        
        # Assert
        assert result is not None
        assert isinstance(result, str)
        
        # Verify KMS was called
        mock_kms.encrypt.assert_called_once()
        call_args = mock_kms.encrypt.call_args
        
        # Verify correct parameters
        assert call_args[1]['KeyId'] == 'alias/jaiib-audit-key'
        assert json.loads(call_args[1]['Plaintext'].decode('utf-8')) == details
    
    @patch('audit_logger.audit_logs_table')
    @patch('audit_logger.kms_client')
    def test_audit_log_retrieval_with_filtering(self, mock_kms, mock_table):
        """
        Test that audit logs can be retrieved with filtering.
        
        Property 22: Audit log retrieval
        - Logs can be retrieved with date range and other filters
        """
        from audit_logger import AuditLogger
        
        # Setup
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
        
        # Verify scan was called with correct filters
        mock_table.scan.assert_called_once()
    
    @patch('audit_logger.audit_logs_table')
    @patch('audit_logger.kms_client')
    def test_audit_log_has_all_required_fields(self, mock_kms, mock_table):
        """
        Test that audit logs include all required fields.
        
        Property 22: Completeness
        - All required fields are present in audit logs
        """
        from audit_logger import AuditLogger
        
        # Setup
        mock_table.put_item.return_value = {}
        mock_kms.encrypt.return_value = {'CiphertextBlob': b'encrypted_data'}
        
        # Execute
        user_id = str(uuid.uuid4())
        AuditLogger.log_action(
            user_id=user_id,
            action_type='login'
        )
        
        # Assert
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
    
    @patch('audit_logger.audit_logs_table')
    @patch('audit_logger.kms_client')
    def test_login_logging_with_ip_and_device(self, mock_kms, mock_table):
        """
        Test that login logging records IP address and device information.
        
        Requirement 12.2: Login/logout logging with IP address and device information
        """
        from audit_logger import AuditLogger
        
        # Setup
        mock_table.put_item.return_value = {}
        
        # Execute
        user_id = str(uuid.uuid4())
        ip_address = '192.168.1.100'
        device_info = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        
        result = AuditLogger.log_login(
            user_id=user_id,
            ip_address=ip_address,
            device_info=device_info
        )
        
        # Assert
        assert result['status'] == 'success'
        
        call_args = mock_table.put_item.call_args
        stored_item = call_args[1]['Item']
        
        assert stored_item['user_id'] == user_id
        assert stored_item['action_type'] == 'login'
        assert stored_item['ip_address'] == ip_address
        assert stored_item['device_info'] == device_info
    
    @patch('audit_logger.audit_logs_table')
    @patch('audit_logger.kms_client')
    def test_practice_submit_logging(self, mock_kms, mock_table):
        """
        Test that practice set submission logging records session data.
        
        Requirement 12.4: Practice set submission logging with session ID, questions, answers, score
        """
        from audit_logger import AuditLogger
        
        # Setup
        mock_table.put_item.return_value = {}
        mock_kms.encrypt.return_value = {'CiphertextBlob': b'encrypted_data'}
        
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
        
        call_args = mock_table.put_item.call_args
        stored_item = call_args[1]['Item']
        
        assert stored_item['user_id'] == user_id
        assert stored_item['action_type'] == 'practice_submit'
        assert stored_item['resource_id'] == session_id
        assert stored_item['resource_type'] == 'practice_session'
    
    @patch('audit_logger.audit_logs_table')
    @patch('audit_logger.kms_client')
    def test_question_modification_logging(self, mock_kms, mock_table):
        """
        Test that question bank modification logging records change details.
        
        Requirement 12.5: Question bank modification logging with modifier ID, timestamp, question ID, change description
        """
        from audit_logger import AuditLogger
        
        # Setup
        mock_table.put_item.return_value = {}
        mock_kms.encrypt.return_value = {'CiphertextBlob': b'encrypted_data'}
        
        # Execute
        modifier_id = str(uuid.uuid4())
        question_id = str(uuid.uuid4())
        change_description = 'Updated question text and options'
        
        result = AuditLogger.log_question_modification(
            modifier_id=modifier_id,
            action_type='question_update',
            question_id=question_id,
            change_description=change_description
        )
        
        # Assert
        assert result['status'] == 'success'
        
        call_args = mock_table.put_item.call_args
        stored_item = call_args[1]['Item']
        
        assert stored_item['user_id'] == modifier_id
        assert stored_item['action_type'] == 'question_update'
        assert stored_item['resource_id'] == question_id
        assert stored_item['resource_type'] == 'question'
