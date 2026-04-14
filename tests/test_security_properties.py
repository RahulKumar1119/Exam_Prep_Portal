"""
Property-Based Tests for Security Service

Property 24: Data encryption coverage
  - All sensitive data is encrypted with AWS KMS
  **Validates: Requirements 13.1, 13.3**

Property 25: TLS encryption for data in transit
  - All data transmission uses TLS 1.2 or higher
  **Validates: Requirements 13.2**
"""

import json
import base64
import time
import sys
import os
import pytest
from unittest.mock import MagicMock, patch

from hypothesis import given, strategies as st, settings, HealthCheck

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
# Strategies
# ---------------------------------------------------------------------------

sensitive_field_strategy = st.text(min_size=1, max_size=200)

sensitive_data_strategy = st.fixed_dictionaries({
    'user_id': st.uuids().map(str),
    'email': st.emails(),
    'full_name': st.text(min_size=1, max_size=50),
    'score': st.floats(min_value=0.0, max_value=100.0, allow_nan=False),
})

tls_version_strategy = st.sampled_from([
    'TLSv1.0', 'TLSv1.1', 'TLSv1.2', 'TLSv1.3', 'SSLv3', 'TLSv1.4'
])

url_strategy = st.one_of(
    st.just('https://api.jaiib-caiib.example.com/practice'),
    st.just('http://api.jaiib-caiib.example.com/practice'),
    st.just('https://jaiib-caiib.example.com/dashboard'),
    st.just('ftp://jaiib-caiib.example.com/data'),
)


# ---------------------------------------------------------------------------
# Property 24: Data encryption coverage
# ---------------------------------------------------------------------------

class TestDataEncryptionCoverage:
    """
    Property 24: Data encryption coverage

    For any sensitive data (passwords, tokens, personal information) stored in
    DynamoDB, the data should be encrypted using AWS KMS with a customer-managed key.

    **Validates: Requirements 13.1, 13.3**
    """

    @given(plaintext=sensitive_field_strategy)
    @settings(
        max_examples=50,
        suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture],
    )
    def test_all_sensitive_data_encrypted_with_kms(
        self, security_module, mock_kms, plaintext
    ):
        """
        Property: For any sensitive plaintext value, encrypting it via KMS
        should produce a non-empty ciphertext that differs from the original.

        **Validates: Requirements 13.1**
        """
        # Arrange: KMS returns a deterministic ciphertext blob
        fake_cipher = base64.b64encode(plaintext.encode('utf-8') + b'_encrypted')
        mock_kms.encrypt.return_value = {'CiphertextBlob': fake_cipher}

        # Act
        ciphertext = security_module.KMSKeyManager.encrypt_data(plaintext)

        # Assert: encryption was called and result is non-empty and differs from plaintext
        mock_kms.encrypt.assert_called()
        assert ciphertext is not None
        assert len(ciphertext) > 0
        assert ciphertext != plaintext

    @given(data=sensitive_data_strategy)
    @settings(
        max_examples=30,
        suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture],
    )
    def test_sensitive_data_export_always_encrypted(
        self, security_module, mock_kms, mock_s3, data
    ):
        """
        Property: For any user data export request, the exported data should
        be encrypted with KMS before being stored in S3.

        **Validates: Requirements 13.1, 13.8**
        """
        # Arrange
        fake_cipher = base64.b64encode(json.dumps(data).encode('utf-8'))
        mock_kms.encrypt.return_value = {'CiphertextBlob': fake_cipher}
        mock_s3.put_object.return_value = {}
        mock_s3.generate_presigned_url.return_value = 'https://s3.example.com/export?sig=x'

        # Act
        result = security_module.SecureDataManager.create_encrypted_export(data=data)

        # Assert: KMS encryption was invoked before S3 upload
        assert result['status'] == 'success'
        mock_kms.encrypt.assert_called()
        mock_s3.put_object.assert_called()

        # Verify S3 upload uses server-side KMS encryption
        put_call_kwargs = mock_s3.put_object.call_args[1]
        assert put_call_kwargs.get('ServerSideEncryption') == 'aws:kms'

    @given(plaintext=sensitive_field_strategy)
    @settings(
        max_examples=30,
        suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture],
    )
    def test_encrypt_decrypt_roundtrip_preserves_data(
        self, security_module, mock_kms, plaintext
    ):
        """
        Property: For any plaintext, encrypting then decrypting should return
        the original value (encryption is reversible).

        **Validates: Requirements 13.1**
        """
        # Arrange: simulate KMS encrypt/decrypt roundtrip
        fake_cipher = base64.b64encode(plaintext.encode('utf-8'))
        mock_kms.encrypt.return_value = {'CiphertextBlob': fake_cipher}
        mock_kms.decrypt.return_value = {'Plaintext': plaintext.encode('utf-8')}

        # Act
        ciphertext = security_module.KMSKeyManager.encrypt_data(plaintext)
        assert ciphertext is not None
        decrypted = security_module.KMSKeyManager.decrypt_data(ciphertext)

        # Assert: roundtrip preserves original value
        assert decrypted == plaintext

    @given(data=sensitive_data_strategy)
    @settings(
        max_examples=30,
        suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture],
    )
    def test_secure_delete_overwrites_before_removal(
        self, security_module, mock_dynamodb, data
    ):
        """
        Property: For any item deletion, sensitive fields should be overwritten
        with random data before the item is removed from DynamoDB.

        **Validates: Requirements 13.6**
        """
        # Arrange
        mock_table = MagicMock()
        mock_dynamodb.Table.return_value = mock_table
        mock_table.get_item.return_value = {'Item': {**data}}
        mock_table.update_item.return_value = {}
        mock_table.delete_item.return_value = {}

        key = {'user_id': data['user_id']}

        # Act
        result = security_module.SecureDataManager.secure_delete_item('jaiib-users', key)

        # Assert: update (overwrite) happens before delete
        assert result['status'] == 'success'
        assert result['deleted'] is True

        # update_item must be called before delete_item
        update_call_order = mock_table.method_calls.index(
            next(c for c in mock_table.method_calls if c[0] == 'update_item')
        )
        delete_call_order = mock_table.method_calls.index(
            next(c for c in mock_table.method_calls if c[0] == 'delete_item')
        )
        assert update_call_order < delete_call_order

    @given(expiry_hours=st.integers(min_value=1, max_value=24))
    @settings(
        max_examples=20,
        suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture],
    )
    def test_export_download_link_valid_for_24_hours(
        self, security_module, mock_kms, mock_s3, expiry_hours
    ):
        """
        Property: For any data export, the download link should be valid for
        at most 24 hours (Requirement 13.8).

        **Validates: Requirements 13.8**
        """
        mock_kms.encrypt.return_value = {'CiphertextBlob': b'cipher'}
        mock_s3.put_object.return_value = {}
        mock_s3.generate_presigned_url.return_value = 'https://s3.example.com/export?sig=x'

        result = security_module.SecureDataManager.create_encrypted_export(
            data={'test': 'data'},
            expiry_hours=expiry_hours,
        )

        assert result['status'] == 'success'
        assert result['expiry_hours'] == expiry_hours
        assert result['expiry_hours'] <= 24

        # Verify presigned URL expiry matches requested hours
        presign_call = mock_s3.generate_presigned_url.call_args
        assert presign_call[1]['ExpiresIn'] == expiry_hours * 3600


# ---------------------------------------------------------------------------
# Property 25: TLS encryption for data in transit
# ---------------------------------------------------------------------------

class TestTLSEncryptionForDataInTransit:
    """
    Property 25: TLS encryption for data in transit

    For any data transmitted between frontend and backend, the transmission
    should use TLS 1.2 or higher encryption.

    **Validates: Requirements 13.2**
    """

    @given(tls_version=tls_version_strategy)
    @settings(
        max_examples=50,
        suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture],
    )
    def test_only_tls_12_and_above_accepted(self, security_module, tls_version):
        """
        Property: For any TLS version, only TLSv1.2 and TLSv1.3 should be
        accepted; all older versions should be rejected.

        **Validates: Requirements 13.2**
        """
        result = security_module.TLSSecurityHelper.is_tls_version_compliant(tls_version)
        if tls_version in ('TLSv1.2', 'TLSv1.3'):
            assert result is True, f"Expected {tls_version} to be compliant"
        else:
            assert result is False, f"Expected {tls_version} to be non-compliant"

    @given(url=url_strategy)
    @settings(
        max_examples=20,
        suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture],
    )
    def test_only_https_urls_accepted(self, security_module, url):
        """
        Property: For any URL, only HTTPS URLs should be accepted as valid
        for data transmission.

        **Validates: Requirements 13.2**
        """
        result = security_module.TLSSecurityHelper.validate_https_url(url)
        if url.startswith('https://'):
            assert result is True
        else:
            assert result is False

    @given(
        status_code=st.integers(min_value=200, max_value=599),
        body=st.dictionaries(
            keys=st.text(min_size=1, max_size=10),
            values=st.text(max_size=20),
            max_size=5,
        ),
    )
    @settings(
        max_examples=30,
        suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture],
    )
    def test_all_api_responses_include_hsts_header(
        self, security_module, status_code, body
    ):
        """
        Property: For any API response, the HSTS header should always be
        present to enforce TLS for future connections.

        **Validates: Requirements 13.2**
        """
        response = security_module.SecurityHeadersMiddleware.build_response(status_code, body)

        assert 'Strict-Transport-Security' in response['headers']
        hsts = response['headers']['Strict-Transport-Security']
        assert 'max-age=' in hsts
        # max-age must be at least 1 year (31536000 seconds)
        max_age_value = int(hsts.split('max-age=')[1].split(';')[0].strip())
        assert max_age_value >= 31536000

    @given(
        status_code=st.integers(min_value=200, max_value=599),
        body=st.dictionaries(
            keys=st.text(min_size=1, max_size=10),
            values=st.text(max_size=20),
            max_size=5,
        ),
    )
    @settings(
        max_examples=30,
        suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture],
    )
    def test_all_api_responses_include_security_headers(
        self, security_module, status_code, body
    ):
        """
        Property: For any API response, all required security headers should
        be present (HSTS, CSP, X-Frame-Options).

        **Validates: Requirements 13.2, 13.9**
        """
        response = security_module.SecurityHeadersMiddleware.build_response(status_code, body)
        headers = response['headers']

        required_headers = [
            'Strict-Transport-Security',
            'Content-Security-Policy',
            'X-Frame-Options',
            'X-Content-Type-Options',
        ]
        for header in required_headers:
            assert header in headers, f"Missing security header: {header}"

    @given(
        payload=st.text(min_size=1, max_size=500),
        secret=st.text(min_size=8, max_size=64),
    )
    @settings(
        max_examples=50,
        suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture],
    )
    def test_request_signature_validates_integrity(
        self, security_module, payload, secret
    ):
        """
        Property: For any payload and secret, signing and then validating
        the signature should always succeed (integrity preserved).

        **Validates: Requirements 13.9**
        """
        signature = security_module.RequestValidator.sign_request(payload, secret)
        assert security_module.RequestValidator.validate_request_signature(
            payload, signature, secret
        ) is True

    @given(
        payload=st.text(min_size=1, max_size=200),
        secret=st.text(min_size=8, max_size=64),
        tampered_payload=st.text(min_size=1, max_size=200),
    )
    @settings(
        max_examples=30,
        suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture],
    )
    def test_tampered_request_signature_rejected(
        self, security_module, payload, secret, tampered_payload
    ):
        """
        Property: For any tampered payload (different from the signed payload),
        signature validation should fail.

        **Validates: Requirements 13.9**
        """
        signature = security_module.RequestValidator.sign_request(payload, secret)
        if tampered_payload != payload:
            assert security_module.RequestValidator.validate_request_signature(
                tampered_payload, signature, secret
            ) is False

    @given(drift_seconds=st.integers(min_value=0, max_value=299))
    @settings(
        max_examples=20,
        suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture],
    )
    def test_recent_timestamps_accepted(self, security_module, drift_seconds):
        """
        Property: For any timestamp within the 5-minute window, validation
        should succeed (prevents replay attacks while allowing clock drift).

        **Validates: Requirements 13.9**
        """
        ts = str(time.time() - drift_seconds)
        assert security_module.RequestValidator.validate_request_timestamp(ts) is True

    @given(drift_seconds=st.integers(min_value=301, max_value=3600))
    @settings(
        max_examples=20,
        suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture],
    )
    def test_old_timestamps_rejected(self, security_module, drift_seconds):
        """
        Property: For any timestamp older than 5 minutes, validation should
        fail to prevent replay attacks.

        **Validates: Requirements 13.9**
        """
        old_ts = str(time.time() - drift_seconds)
        assert security_module.RequestValidator.validate_request_timestamp(old_ts) is False
