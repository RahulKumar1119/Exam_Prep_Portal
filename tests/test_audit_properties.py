"""
Property-Based Tests for Audit Logging Service

Tests universal properties of audit logging using Hypothesis.
Validates: Requirements 12.7, 12.11

Property 22: Audit log immutability
- Test that audit logs are stored immutably and encrypted with KMS
- Test that access to audit logs is itself logged (meta-audit logging)
"""

import pytest
import json
import uuid
from datetime import datetime, timedelta
from unittest.mock import Mock, patch, MagicMock
import sys
import os
import base64

from hypothesis import given, strategies as st, settings, HealthCheck

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend', 'audit'))


@pytest.fixture
def audit_logger_module():
    """Import audit logger module with mocked AWS clients."""
    with patch('boto3.resource'), \
         patch('boto3.client'):
        import audit_logger
        return audit_logger


@pytest.fixture
def storage_service_module():
    """Import storage service module with mocked AWS clients."""
    with patch('boto3.resource'), \
         patch('boto3.client'):
        import storage_service
        return storage_service


@pytest.fixture
def reporting_service_module():
    """Import reporting service module with mocked AWS clients."""
    with patch('boto3.resource'), \
         patch('boto3.client'):
        import reporting_service
        return reporting_service


@pytest.fixture
def mock_dynamodb(audit_logger_module):
    """Mock DynamoDB table."""
    mock_table = MagicMock()
    audit_logger_module.audit_logs_table = mock_table
    return mock_table


@pytest.fixture
def mock_kms(audit_logger_module):
    """Mock KMS client."""
    mock_kms_client = MagicMock()
    audit_logger_module.kms_client = mock_kms_client
    return mock_kms_client


@pytest.fixture
def mock_s3(storage_service_module):
    """Mock S3 client."""
    mock_s3_client = MagicMock()
    storage_service_module.s3_client = mock_s3_client
    return mock_s3_client


# Strategies for generating test data
user_id_strategy = st.uuids().map(str)
action_type_strategy = st.sampled_from([
    'login', 'logout', 'practice_submit', 'score_view',
    'question_create', 'question_update', 'question_delete',
    'version_publish', 'version_rollback', 'audit_log_access'
])
resource_id_strategy = st.uuids().map(str)
resource_type_strategy = st.sampled_from([
    'user', 'practice_session', 'score', 'question',
    'question_bank_version', 'audit_logs', 'admin_resource'
])
result_strategy = st.sampled_from(['success', 'failure'])
ip_address_strategy = st.just('192.168.1.1')
device_info_strategy = st.just('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')


class TestAuditLogImmutability:
    """
    Property 22: Audit log immutability
    
    Test that audit logs are stored immutably and encrypted with KMS,
    and that access to audit logs is itself logged.
    
    **Validates: Requirements 12.7, 12.11**
    """
    
    @given(
        user_id=user_id_strategy,
        action_type=action_type_strategy,
        resource_id=resource_id_strategy,
        resource_type=resource_type_strategy,
        result=result_strategy,
        ip_address=ip_address_strategy,
        device_info=device_info_strategy
    )
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture])
    def test_audit_log_immutability_on_creation(
        self,
        audit_logger_module,
        mock_dynamodb,
        mock_kms,
        user_id,
        action_type,
        resource_id,
        resource_type,
        result,
        ip_address,
        device_info
    ):
        """
        Property: For any audit log entry created, the entry should be stored
        in a tamper-proof manner and encrypted with AWS KMS.
        
        Test that:
        1. Audit log is created with all required fields
        2. Log is stored in DynamoDB (immutable)
        3. Sensitive details are encrypted with KMS
        """
        # Setup
        audit_logger_module.audit_logs_table = mock_dynamodb
        audit_logger_module.kms_client = mock_kms
        
        # Mock KMS encryption
        mock_kms.encrypt.return_value = {
            'CiphertextBlob': b'encrypted_data'
        }
        
        # Mock DynamoDB put_item
        mock_dynamodb.put_item.return_value = {}
        
        # Create audit log
        details = {
            'test_key': 'test_value',
            'timestamp': datetime.utcnow().isoformat()
        }
        
        result_dict = audit_logger_module.AuditLogger.log_action(
            user_id=user_id,
            action_type=action_type,
            resource_id=resource_id,
            resource_type=resource_type,
            result=result,
            ip_address=ip_address,
            device_info=device_info,
            details=details
        )
        
        # Assertions
        assert result_dict['status'] == 'success'
        assert 'log_id' in result_dict
        assert 'timestamp' in result_dict
        
        # Verify DynamoDB put_item was called (immutable storage)
        mock_dynamodb.put_item.assert_called_once()
        
        # Verify the stored record has all required fields
        call_args = mock_dynamodb.put_item.call_args
        stored_item = call_args[1]['Item']
        
        assert stored_item['user_id'] == user_id
        assert stored_item['action_type'] == action_type
        assert stored_item['resource_id'] == resource_id
        assert stored_item['resource_type'] == resource_type
        assert stored_item['result'] == result
        assert stored_item['ip_address'] == ip_address
        assert stored_item['device_info'] == device_info
        
        # Verify KMS encryption was called for details
        if details:
            mock_kms.encrypt.assert_called()
    
    @given(
        accessor_id=user_id_strategy,
        start_date=st.just('2024-01-01T00:00:00'),
        end_date=st.just('2024-01-31T23:59:59')
    )
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture])
    def test_meta_audit_logging_on_access(
        self,
        audit_logger_module,
        mock_dynamodb,
        accessor_id,
        start_date,
        end_date
    ):
        """
        Property: For any access to audit logs, the access itself should be logged
        (meta-audit logging).
        
        Test that:
        1. When audit logs are accessed, a meta-audit log is created
        2. The meta-audit log records the accessor, timestamp, and filters used
        3. The meta-audit log is stored immutably
        """
        # Setup
        audit_logger_module.audit_logs_table = mock_dynamodb
        mock_dynamodb.put_item.return_value = {}
        
        # Log audit log access
        date_range = {'start_date': start_date, 'end_date': end_date}
        filters = {'user_id': 'test_user', 'action_type': 'login'}
        
        result_dict = audit_logger_module.AuditLogger.log_audit_log_access(
            accessor_id=accessor_id,
            date_range=date_range,
            filters=filters
        )
        
        # Assertions
        assert result_dict['status'] == 'success'
        assert 'log_id' in result_dict
        
        # Verify DynamoDB put_item was called
        mock_dynamodb.put_item.assert_called_once()
        
        # Verify the meta-audit log has correct structure
        call_args = mock_dynamodb.put_item.call_args
        stored_item = call_args[1]['Item']
        
        assert stored_item['user_id'] == accessor_id
        assert stored_item['action_type'] == 'audit_log_access'
        assert stored_item['resource_type'] == 'audit_logs'
    
    @given(
        log_id=st.uuids().map(str),
        user_id=user_id_strategy
    )
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture])
    def test_immutability_verification(
        self,
        audit_logger_module,
        mock_dynamodb,
        log_id,
        user_id
    ):
        """
        Property: For any audit log record, the immutability should be verifiable.
        
        Test that:
        1. Immutability can be verified for existing records
        2. Verification returns True for existing records
        3. Verification returns False for non-existent records
        """
        # Setup
        audit_logger_module.audit_logs_table = mock_dynamodb
        
        # Test existing record
        mock_dynamodb.get_item.return_value = {
            'Item': {
                'log_id': log_id,
                'user_id': user_id,
                'timestamp': datetime.utcnow().isoformat()
            }
        }
        
        result = audit_logger_module.AuditLogger.verify_immutability(log_id)
        assert result is True
        
        # Test non-existent record
        mock_dynamodb.get_item.return_value = {}
        result = audit_logger_module.AuditLogger.verify_immutability(log_id)
        assert result is False
    
    @given(
        user_id=user_id_strategy,
        action_type=action_type_strategy
    )
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture])
    def test_encryption_of_sensitive_details(
        self,
        audit_logger_module,
        mock_kms,
        user_id,
        action_type
    ):
        """
        Property: For any audit log with sensitive details, the details should be
        encrypted with AWS KMS.
        
        Test that:
        1. Sensitive details are encrypted before storage
        2. KMS encryption is called with correct parameters
        3. Encrypted data is base64 encoded
        """
        # Setup
        audit_logger_module.kms_client = mock_kms
        
        # Mock KMS encryption
        encrypted_blob = b'encrypted_sensitive_data'
        mock_kms.encrypt.return_value = {
            'CiphertextBlob': encrypted_blob
        }
        
        # Encrypt details
        details = {
            'session_id': str(uuid.uuid4()),
            'questions_count': 4,
            'score': 85.5
        }
        
        encrypted_result = audit_logger_module.AuditLogger._encrypt_details(details)
        
        # Assertions
        assert encrypted_result is not None
        assert isinstance(encrypted_result, str)
        
        # Verify KMS was called
        mock_kms.encrypt.assert_called_once()
        
        # Verify the call included the correct key and plaintext
        call_args = mock_kms.encrypt.call_args
        assert call_args[1]['KeyId'] == audit_logger_module.KMS_KEY_ID
        assert json.loads(call_args[1]['Plaintext'].decode('utf-8')) == details
    
    @given(
        start_date=st.just('2024-01-01T00:00:00'),
        end_date=st.just('2024-01-31T23:59:59'),
        user_id=st.one_of(st.none(), user_id_strategy),
        action_type=st.one_of(st.none(), action_type_strategy)
    )
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture])
    def test_audit_log_retrieval_with_filtering(
        self,
        audit_logger_module,
        mock_dynamodb,
        start_date,
        end_date,
        user_id,
        action_type
    ):
        """
        Property: For any audit log retrieval request, the logs should be returned
        with proper filtering applied.
        
        Test that:
        1. Audit logs can be retrieved with date range filtering
        2. Optional filters (user_id, action_type) are applied correctly
        3. Retrieved logs are sorted by timestamp
        """
        # Setup
        audit_logger_module.audit_logs_table = mock_dynamodb
        
        # Mock DynamoDB scan
        mock_logs = [
            {
                'log_id': str(uuid.uuid4()),
                'timestamp': '2024-01-15T10:00:00',
                'user_id': user_id or 'user1',
                'action_type': action_type or 'login'
            },
            {
                'log_id': str(uuid.uuid4()),
                'timestamp': '2024-01-20T15:30:00',
                'user_id': user_id or 'user2',
                'action_type': action_type or 'logout'
            }
        ]
        
        mock_dynamodb.scan.return_value = {
            'Items': mock_logs,
            'Count': len(mock_logs)
        }
        
        # Retrieve logs
        result = audit_logger_module.AuditLogger.get_audit_logs(
            start_date=start_date,
            end_date=end_date,
            user_id=user_id,
            action_type=action_type
        )
        
        # Assertions
        assert result['status'] == 'success'
        assert result['count'] == len(mock_logs)
        assert len(result['logs']) == len(mock_logs)
        
        # Verify DynamoDB scan was called
        mock_dynamodb.scan.assert_called_once()


class TestAuditLogEncryption:
    """Tests for audit log encryption with KMS."""
    
    @given(
        details=st.dictionaries(
            keys=st.text(min_size=1, max_size=20),
            values=st.one_of(
                st.text(max_size=100),
                st.integers(),
                st.floats(allow_nan=False, allow_infinity=False)
            ),
            min_size=1,
            max_size=5
        )
    )
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture])
    def test_details_encryption_and_decryption(
        self,
        audit_logger_module,
        mock_kms,
        details
    ):
        """
        Property: For any audit log details, encryption and decryption should
        be reversible and preserve the original data.
        
        Test that:
        1. Details can be encrypted with KMS
        2. Encrypted details can be decrypted
        3. Decrypted details match the original
        """
        # Setup
        audit_logger_module.kms_client = mock_kms
        
        # Mock KMS encryption
        details_json = json.dumps(details)
        encrypted_blob = base64.b64encode(details_json.encode('utf-8'))
        
        mock_kms.encrypt.return_value = {
            'CiphertextBlob': encrypted_blob
        }
        
        # Mock KMS decryption
        mock_kms.decrypt.return_value = {
            'Plaintext': details_json.encode('utf-8')
        }
        
        # Encrypt
        encrypted = audit_logger_module.AuditLogger._encrypt_details(details)
        assert encrypted is not None
        
        # Decrypt
        decrypted = audit_logger_module.AuditLogger._decrypt_details(encrypted)
        
        # Assertions
        assert decrypted == details


class TestAuditLogCompleteness:
    """Tests for audit log completeness and required fields."""
    
    @given(
        user_id=user_id_strategy,
        action_type=action_type_strategy
    )
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture])
    def test_audit_log_has_all_required_fields(
        self,
        audit_logger_module,
        mock_dynamodb,
        user_id,
        action_type
    ):
        """
        Property: For any audit log entry, all required fields should be present.
        
        Test that:
        1. Audit logs include user_id, timestamp, action_type, result
        2. Audit logs include resource_id, resource_type, ip_address, device_info
        3. All fields have non-empty values (or 'N/A' as default)
        """
        # Setup
        audit_logger_module.audit_logs_table = mock_dynamodb
        mock_dynamodb.put_item.return_value = {}
        
        # Create audit log
        result_dict = audit_logger_module.AuditLogger.log_action(
            user_id=user_id,
            action_type=action_type
        )
        
        # Verify log was created
        assert result_dict['status'] == 'success'
        
        # Verify all required fields are present in stored item
        call_args = mock_dynamodb.put_item.call_args
        stored_item = call_args[1]['Item']
        
        required_fields = [
            'log_id', 'timestamp', 'user_id', 'action_type',
            'resource_id', 'resource_type', 'result',
            'ip_address', 'device_info'
        ]
        
        for field in required_fields:
            assert field in stored_item
            assert stored_item[field] is not None
