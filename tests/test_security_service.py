"""
Unit Tests for Security Service

Tests KMS key management, secure deletion, encrypted export,
TLS helpers, security headers, and request signing/validation.

Requirements: 13.1, 13.2, 13.7, 13.8, 13.9
"""

import json
import base64
import time
import pytest
import sys
import os
from unittest.mock import MagicMock, patch, call

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend', 'security'))


@pytest.fixture
def security_module():
    """Import security_service with mocked AWS clients."""
    with patch('boto3.client'), patch('boto3.resource'):
        import security_service
        return security_service


@pytest.fixture
def mock_kms(security_module):
    mock = MagicMock()
    security_module.kms_client = mock
    return mock


@pytest.fixture
def mock_s3(security_module):
    mock = MagicMock()
    security_module.s3_client = mock
    return mock


@pytest.fixture
def mock_dynamodb(security_module):
    mock = MagicMock()
    security_module.dynamodb = mock
    return mock


# ---------------------------------------------------------------------------
# KMSKeyManager tests
# ---------------------------------------------------------------------------

class TestKMSKeyManager:

    def test_get_key_metadata_success(self, security_module, mock_kms):
        mock_kms.describe_key.return_value = {
            'KeyMetadata': {'KeyId': 'key-123', 'Arn': 'arn:aws:kms:ap-south-1:123:key/key-123', 'KeyState': 'Enabled'}
        }
        mock_kms.get_key_rotation_status.return_value = {'KeyRotationEnabled': True}

        result = security_module.KMSKeyManager.get_key_metadata('key-123')

        assert result['status'] == 'success'
        assert result['rotation_enabled'] is True
        assert result['key_state'] == 'Enabled'

    def test_get_key_metadata_error(self, security_module, mock_kms):
        from botocore.exceptions import ClientError
        mock_kms.describe_key.side_effect = ClientError(
            {'Error': {'Code': 'NotFoundException', 'Message': 'not found'}}, 'DescribeKey'
        )
        result = security_module.KMSKeyManager.get_key_metadata('bad-key')
        assert result['status'] == 'error'

    def test_enable_key_rotation(self, security_module, mock_kms):
        mock_kms.enable_key_rotation.return_value = {}
        result = security_module.KMSKeyManager.enable_key_rotation('key-123')
        assert result['status'] == 'success'
        assert result['rotation_enabled'] is True
        mock_kms.enable_key_rotation.assert_called_once_with(KeyId='key-123')

    def test_encrypt_data_returns_base64(self, security_module, mock_kms):
        mock_kms.encrypt.return_value = {'CiphertextBlob': b'ciphertext'}
        result = security_module.KMSKeyManager.encrypt_data('hello')
        assert result == base64.b64encode(b'ciphertext').decode('utf-8')

    def test_encrypt_data_error_returns_none(self, security_module, mock_kms):
        from botocore.exceptions import ClientError
        mock_kms.encrypt.side_effect = ClientError(
            {'Error': {'Code': 'KMSInvalidStateException', 'Message': 'err'}}, 'Encrypt'
        )
        result = security_module.KMSKeyManager.encrypt_data('hello')
        assert result is None

    def test_decrypt_data_success(self, security_module, mock_kms):
        plaintext = b'hello world'
        ciphertext_b64 = base64.b64encode(b'ciphertext').decode('utf-8')
        mock_kms.decrypt.return_value = {'Plaintext': plaintext}
        result = security_module.KMSKeyManager.decrypt_data(ciphertext_b64)
        assert result == 'hello world'

    def test_decrypt_data_error_returns_none(self, security_module, mock_kms):
        from botocore.exceptions import ClientError
        mock_kms.decrypt.side_effect = ClientError(
            {'Error': {'Code': 'InvalidCiphertextException', 'Message': 'err'}}, 'Decrypt'
        )
        result = security_module.KMSKeyManager.decrypt_data(base64.b64encode(b'bad').decode())
        assert result is None

    def test_reencrypt_data_success(self, security_module, mock_kms):
        mock_kms.re_encrypt.return_value = {'CiphertextBlob': b'new_cipher'}
        ciphertext_b64 = base64.b64encode(b'old_cipher').decode('utf-8')
        result = security_module.KMSKeyManager.reencrypt_data(ciphertext_b64, 'new-key')
        assert result == base64.b64encode(b'new_cipher').decode('utf-8')


# ---------------------------------------------------------------------------
# SecureDataManager tests
# ---------------------------------------------------------------------------

class TestSecureDataManager:

    def test_secure_delete_overwrites_then_deletes(self, security_module, mock_dynamodb):
        mock_table = MagicMock()
        mock_dynamodb.Table.return_value = mock_table
        mock_table.get_item.return_value = {
            'Item': {'user_id': 'u1', 'email': 'test@example.com', 'score': 85}
        }
        mock_table.update_item.return_value = {}
        mock_table.delete_item.return_value = {}

        result = security_module.SecureDataManager.secure_delete_item(
            'jaiib-users', {'user_id': 'u1'}
        )

        assert result['status'] == 'success'
        assert result['deleted'] is True
        mock_table.update_item.assert_called_once()
        mock_table.delete_item.assert_called_once_with(Key={'user_id': 'u1'})

    def test_secure_delete_item_not_found(self, security_module, mock_dynamodb):
        mock_table = MagicMock()
        mock_dynamodb.Table.return_value = mock_table
        mock_table.get_item.return_value = {}

        result = security_module.SecureDataManager.secure_delete_item(
            'jaiib-users', {'user_id': 'missing'}
        )
        assert result['status'] == 'not_found'

    def test_create_encrypted_export_success(self, security_module, mock_kms, mock_s3):
        mock_kms.encrypt.return_value = {'CiphertextBlob': b'encrypted'}
        mock_s3.put_object.return_value = {}
        mock_s3.generate_presigned_url.return_value = 'https://s3.example.com/exports/abc.enc?sig=xyz'

        result = security_module.SecureDataManager.create_encrypted_export(
            data={'user_id': 'u1', 'scores': [80, 90]},
            export_id='test-export-id',
        )

        assert result['status'] == 'success'
        assert result['export_id'] == 'test-export-id'
        assert result['download_url'].startswith('https://')
        assert result['expiry_hours'] == 24
        mock_s3.put_object.assert_called_once()
        mock_s3.generate_presigned_url.assert_called_once()
        # Verify presigned URL expiry is 24 hours
        call_kwargs = mock_s3.generate_presigned_url.call_args
        assert call_kwargs[1]['ExpiresIn'] == 24 * 3600

    def test_create_encrypted_export_encryption_failure(self, security_module, mock_kms):
        mock_kms.encrypt.return_value = None
        # Make encrypt_data return None
        security_module.KMSKeyManager.encrypt_data = MagicMock(return_value=None)

        result = security_module.SecureDataManager.create_encrypted_export(data={'x': 1})
        assert result['status'] == 'error'


# ---------------------------------------------------------------------------
# TLSSecurityHelper tests
# ---------------------------------------------------------------------------

class TestTLSSecurityHelper:

    def test_tls_12_is_compliant(self, security_module):
        assert security_module.TLSSecurityHelper.is_tls_version_compliant('TLSv1.2') is True

    def test_tls_13_is_compliant(self, security_module):
        assert security_module.TLSSecurityHelper.is_tls_version_compliant('TLSv1.3') is True

    def test_tls_10_is_not_compliant(self, security_module):
        assert security_module.TLSSecurityHelper.is_tls_version_compliant('TLSv1.0') is False

    def test_tls_11_is_not_compliant(self, security_module):
        assert security_module.TLSSecurityHelper.is_tls_version_compliant('TLSv1.1') is False

    def test_validate_https_url(self, security_module):
        assert security_module.TLSSecurityHelper.validate_https_url('https://api.example.com') is True
        assert security_module.TLSSecurityHelper.validate_https_url('http://api.example.com') is False

    def test_get_tls_policy(self, security_module):
        policy = security_module.TLSSecurityHelper.get_tls_policy()
        assert policy['minimum_tls_version'] == 'TLSv1.2'
        assert policy['enforce_https'] is True


# ---------------------------------------------------------------------------
# SecurityHeadersMiddleware tests
# ---------------------------------------------------------------------------

class TestSecurityHeadersMiddleware:

    def test_build_response_includes_hsts(self, security_module):
        response = security_module.SecurityHeadersMiddleware.build_response(200, {'ok': True})
        assert 'Strict-Transport-Security' in response['headers']
        assert 'max-age=31536000' in response['headers']['Strict-Transport-Security']

    def test_build_response_includes_csp(self, security_module):
        response = security_module.SecurityHeadersMiddleware.build_response(200, {})
        assert 'Content-Security-Policy' in response['headers']

    def test_build_response_includes_x_frame_options(self, security_module):
        response = security_module.SecurityHeadersMiddleware.build_response(200, {})
        assert response['headers']['X-Frame-Options'] == 'DENY'

    def test_build_response_status_code(self, security_module):
        response = security_module.SecurityHeadersMiddleware.build_response(404, {'error': 'not found'})
        assert response['statusCode'] == 404

    def test_add_security_headers_to_existing_response(self, security_module):
        existing = {'statusCode': 200, 'headers': {'Content-Type': 'application/json'}, 'body': '{}'}
        updated = security_module.SecurityHeadersMiddleware.add_security_headers(existing)
        assert 'X-Frame-Options' in updated['headers']
        assert updated['headers']['Content-Type'] == 'application/json'


# ---------------------------------------------------------------------------
# RequestValidator tests
# ---------------------------------------------------------------------------

class TestRequestValidator:

    def test_sign_and_validate_request(self, security_module):
        payload = '{"user_id": "u1", "action": "login"}'
        secret = 'my-secret-key'
        signature = security_module.RequestValidator.sign_request(payload, secret)
        assert security_module.RequestValidator.validate_request_signature(payload, signature, secret) is True

    def test_invalid_signature_rejected(self, security_module):
        payload = '{"user_id": "u1"}'
        secret = 'my-secret-key'
        assert security_module.RequestValidator.validate_request_signature(payload, 'bad-sig', secret) is False

    def test_tampered_payload_rejected(self, security_module):
        payload = '{"user_id": "u1"}'
        secret = 'my-secret-key'
        signature = security_module.RequestValidator.sign_request(payload, secret)
        tampered = '{"user_id": "admin"}'
        assert security_module.RequestValidator.validate_request_signature(tampered, signature, secret) is False

    def test_valid_timestamp(self, security_module):
        ts = str(time.time())
        assert security_module.RequestValidator.validate_request_timestamp(ts) is True

    def test_expired_timestamp_rejected(self, security_module):
        old_ts = str(time.time() - 400)  # 400 seconds ago, beyond 300s window
        assert security_module.RequestValidator.validate_request_timestamp(old_ts) is False

    def test_invalid_timestamp_string_rejected(self, security_module):
        assert security_module.RequestValidator.validate_request_timestamp('not-a-number') is False

    def test_validate_api_key_success(self, security_module):
        valid_keys = ['key-abc', 'key-def']
        assert security_module.RequestValidator.validate_api_key('key-abc', valid_keys) is True

    def test_validate_api_key_failure(self, security_module):
        valid_keys = ['key-abc']
        assert security_module.RequestValidator.validate_api_key('key-xyz', valid_keys) is False
