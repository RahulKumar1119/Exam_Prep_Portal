"""
Security Service for JAIIB-CAIIB Exam Prep Portal

Handles:
- KMS key management (key rotation scheduling, re-encryption)
- Secure data deletion (overwrite with random data)
- Encrypted data export with presigned S3 URLs (24-hour expiry)
- TLS configuration helpers
- Security headers middleware
- Request signing/validation utilities

Requirements: 13.1, 13.2, 13.7, 13.8, 13.9
"""

import json
import os
import uuid
import base64
import hashlib
import hmac
import secrets
import time
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List

import boto3
from botocore.exceptions import ClientError

# AWS clients
kms_client = boto3.client('kms')
s3_client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')

# Environment variables
KMS_KEY_ID = os.environ.get('KMS_KEY_ID', 'alias/jaiib-caiib-key')
EXPORT_BUCKET = os.environ.get('EXPORT_BUCKET', 'jaiib-caiib-exports')
FRONTEND_DOMAIN = os.environ.get('FRONTEND_DOMAIN', 'https://jaiib-caiib.example.com')

# Sensitive DynamoDB tables that require re-encryption on key rotation
SENSITIVE_TABLES = [
    os.environ.get('USERS_TABLE', 'jaiib-users'),
    os.environ.get('AUDIT_LOGS_TABLE', 'jaiib-audit-logs'),
    os.environ.get('PRACTICE_SESSIONS_TABLE', 'jaiib-practice-sessions'),
]

# Security headers for all API responses
SECURITY_HEADERS = {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Content-Security-Policy': (
        "default-src 'self'; "
        "script-src 'self'; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data:; "
        "connect-src 'self'"
    ),
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
}

# CORS configuration
CORS_HEADERS = {
    'Access-Control-Allow-Origin': FRONTEND_DOMAIN,
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': (
        'Content-Type,Authorization,X-Amz-Date,X-Api-Key,'
        'X-Amz-Security-Token,X-Request-Signature'
    ),
    'Access-Control-Max-Age': '86400',
}


class KMSKeyManager:
    """Manages KMS key rotation and data re-encryption."""

    @staticmethod
    def get_key_metadata(key_id: str = KMS_KEY_ID) -> Dict[str, Any]:
        """Retrieve KMS key metadata including rotation status."""
        try:
            key_response = kms_client.describe_key(KeyId=key_id)
            rotation_response = kms_client.get_key_rotation_status(KeyId=key_id)
            return {
                'status': 'success',
                'key_id': key_response['KeyMetadata']['KeyId'],
                'key_arn': key_response['KeyMetadata']['Arn'],
                'rotation_enabled': rotation_response['KeyRotationEnabled'],
                'key_state': key_response['KeyMetadata']['KeyState'],
            }
        except ClientError as e:
            return {'status': 'error', 'message': str(e)}

    @staticmethod
    def enable_key_rotation(key_id: str = KMS_KEY_ID) -> Dict[str, Any]:
        """Enable automatic key rotation for the specified KMS key."""
        try:
            kms_client.enable_key_rotation(KeyId=key_id)
            return {'status': 'success', 'key_id': key_id, 'rotation_enabled': True}
        except ClientError as e:
            return {'status': 'error', 'message': str(e)}

    @staticmethod
    def encrypt_data(plaintext: str, key_id: str = KMS_KEY_ID) -> Optional[str]:
        """Encrypt data using KMS. Returns base64-encoded ciphertext."""
        try:
            response = kms_client.encrypt(
                KeyId=key_id,
                Plaintext=plaintext.encode('utf-8'),
            )
            return base64.b64encode(response['CiphertextBlob']).decode('utf-8')
        except ClientError as e:
            print(f"KMS encryption error: {e}")
            return None

    @staticmethod
    def decrypt_data(ciphertext_b64: str) -> Optional[str]:
        """Decrypt KMS-encrypted base64-encoded ciphertext."""
        try:
            ciphertext = base64.b64decode(ciphertext_b64.encode('utf-8'))
            response = kms_client.decrypt(CiphertextBlob=ciphertext)
            return response['Plaintext'].decode('utf-8')
        except ClientError as e:
            print(f"KMS decryption error: {e}")
            return None

    @staticmethod
    def reencrypt_data(ciphertext_b64: str, destination_key_id: str = KMS_KEY_ID) -> Optional[str]:
        """Re-encrypt data with a new KMS key (used after key rotation)."""
        try:
            ciphertext = base64.b64decode(ciphertext_b64.encode('utf-8'))
            response = kms_client.re_encrypt(
                CiphertextBlob=ciphertext,
                DestinationKeyId=destination_key_id,
            )
            return base64.b64encode(response['CiphertextBlob']).decode('utf-8')
        except ClientError as e:
            print(f"KMS re-encryption error: {e}")
            return None

    @staticmethod
    def reencrypt_table_field(
        table_name: str,
        pk_name: str,
        pk_value: str,
        field_name: str,
        destination_key_id: str = KMS_KEY_ID,
    ) -> Dict[str, Any]:
        """Re-encrypt a specific encrypted field in a DynamoDB item."""
        try:
            table = dynamodb.Table(table_name)
            response = table.get_item(Key={pk_name: pk_value})
            item = response.get('Item')
            if not item or field_name not in item:
                return {'status': 'skipped', 'reason': 'field not found'}

            new_ciphertext = KMSKeyManager.reencrypt_data(item[field_name], destination_key_id)
            if new_ciphertext is None:
                return {'status': 'error', 'reason': 're-encryption failed'}

            table.update_item(
                Key={pk_name: pk_value},
                UpdateExpression='SET #f = :v',
                ExpressionAttributeNames={'#f': field_name},
                ExpressionAttributeValues={':v': new_ciphertext},
            )
            return {'status': 'success', 'field': field_name}
        except ClientError as e:
            return {'status': 'error', 'message': str(e)}


class SecureDataManager:
    """Handles secure data deletion and encrypted data export."""

    @staticmethod
    def secure_delete_item(table_name: str, key: Dict[str, Any]) -> Dict[str, Any]:
        """
        Securely delete a DynamoDB item by overwriting sensitive fields with
        random data before deletion (Requirement 13.6).
        """
        try:
            table = dynamodb.Table(table_name)
            response = table.get_item(Key=key)
            item = response.get('Item')
            if not item:
                return {'status': 'not_found'}

            # Overwrite all string fields with random data
            overwrite_expr_parts = []
            expr_names: Dict[str, str] = {}
            expr_values: Dict[str, Any] = {}

            for idx, (field, value) in enumerate(item.items()):
                if field in key:
                    continue  # skip primary key fields
                placeholder_name = f'#f{idx}'
                placeholder_value = f':v{idx}'
                expr_names[placeholder_name] = field
                if isinstance(value, str):
                    expr_values[placeholder_value] = secrets.token_hex(len(value) or 16)
                elif isinstance(value, (int, float)):
                    expr_values[placeholder_value] = 0
                else:
                    expr_values[placeholder_value] = None
                overwrite_expr_parts.append(f'{placeholder_name} = {placeholder_value}')

            if overwrite_expr_parts:
                table.update_item(
                    Key=key,
                    UpdateExpression='SET ' + ', '.join(overwrite_expr_parts),
                    ExpressionAttributeNames=expr_names,
                    ExpressionAttributeValues=expr_values,
                )

            # Now delete the item
            table.delete_item(Key=key)
            return {'status': 'success', 'deleted': True}
        except ClientError as e:
            return {'status': 'error', 'message': str(e)}

    @staticmethod
    def create_encrypted_export(
        data: Dict[str, Any],
        export_id: Optional[str] = None,
        expiry_hours: int = 24,
    ) -> Dict[str, Any]:
        """
        Create an encrypted data export and upload to S3 with a presigned URL
        valid for 24 hours (Requirement 13.8).
        """
        try:
            if export_id is None:
                export_id = str(uuid.uuid4())

            # Encrypt the data with KMS
            plaintext = json.dumps(data)
            encrypted = KMSKeyManager.encrypt_data(plaintext)
            if encrypted is None:
                return {'status': 'error', 'message': 'Encryption failed'}

            # Upload to S3
            s3_key = f'exports/{export_id}.enc'
            s3_client.put_object(
                Bucket=EXPORT_BUCKET,
                Key=s3_key,
                Body=encrypted.encode('utf-8'),
                ContentType='application/octet-stream',
                ServerSideEncryption='aws:kms',
                SSEKMSKeyId=KMS_KEY_ID,
            )

            # Generate presigned URL valid for 24 hours
            expiry_seconds = expiry_hours * 3600
            presigned_url = s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': EXPORT_BUCKET, 'Key': s3_key},
                ExpiresIn=expiry_seconds,
            )

            expires_at = (datetime.utcnow() + timedelta(hours=expiry_hours)).isoformat()
            return {
                'status': 'success',
                'export_id': export_id,
                'download_url': presigned_url,
                'expires_at': expires_at,
                'expiry_hours': expiry_hours,
            }
        except ClientError as e:
            return {'status': 'error', 'message': str(e)}


class TLSSecurityHelper:
    """Helpers for TLS configuration and validation."""

    # Minimum TLS version required (Requirement 13.2)
    MIN_TLS_VERSION = 'TLSv1.2'
    SUPPORTED_TLS_VERSIONS = {'TLSv1.2', 'TLSv1.3'}

    @staticmethod
    def is_tls_version_compliant(tls_version: str) -> bool:
        """Check if the given TLS version meets the minimum requirement."""
        return tls_version in TLSSecurityHelper.SUPPORTED_TLS_VERSIONS

    @staticmethod
    def validate_https_url(url: str) -> bool:
        """Validate that a URL uses HTTPS (TLS)."""
        return url.startswith('https://')

    @staticmethod
    def get_tls_policy() -> Dict[str, Any]:
        """Return the TLS policy configuration for API Gateway."""
        return {
            'minimum_tls_version': TLSSecurityHelper.MIN_TLS_VERSION,
            'supported_versions': list(TLSSecurityHelper.SUPPORTED_TLS_VERSIONS),
            'enforce_https': True,
        }


class SecurityHeadersMiddleware:
    """Middleware for adding security headers to API responses."""

    @staticmethod
    def add_security_headers(response: Dict[str, Any]) -> Dict[str, Any]:
        """Add security headers to an API Gateway response dict."""
        headers = response.get('headers', {})
        headers.update(SECURITY_HEADERS)
        headers.update(CORS_HEADERS)
        response['headers'] = headers
        return response

    @staticmethod
    def build_response(
        status_code: int,
        body: Any,
        extra_headers: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """Build a Lambda/API Gateway response with security headers."""
        headers = dict(SECURITY_HEADERS)
        headers.update(CORS_HEADERS)
        if extra_headers:
            headers.update(extra_headers)
        return {
            'statusCode': status_code,
            'headers': headers,
            'body': json.dumps(body) if not isinstance(body, str) else body,
        }


class RequestValidator:
    """Request signing and validation utilities."""

    SIGNATURE_HEADER = 'X-Request-Signature'
    TIMESTAMP_HEADER = 'X-Request-Timestamp'
    MAX_TIMESTAMP_DRIFT_SECONDS = 300  # 5 minutes

    @staticmethod
    def sign_request(payload: str, secret_key: str) -> str:
        """Generate HMAC-SHA256 signature for a request payload."""
        signature = hmac.new(
            secret_key.encode('utf-8'),
            payload.encode('utf-8'),
            hashlib.sha256,
        ).hexdigest()
        return signature

    @staticmethod
    def validate_request_signature(
        payload: str,
        signature: str,
        secret_key: str,
    ) -> bool:
        """Validate HMAC-SHA256 request signature."""
        expected = hmac.new(
            secret_key.encode('utf-8'),
            payload.encode('utf-8'),
            hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(expected, signature)

    @staticmethod
    def validate_request_timestamp(timestamp_str: str) -> bool:
        """
        Validate that the request timestamp is within the allowed drift window.
        Prevents replay attacks.
        """
        try:
            request_time = float(timestamp_str)
            current_time = time.time()
            drift = abs(current_time - request_time)
            return drift <= RequestValidator.MAX_TIMESTAMP_DRIFT_SECONDS
        except (ValueError, TypeError):
            return False

    @staticmethod
    def validate_api_key(api_key: str, valid_keys: List[str]) -> bool:
        """Validate that the provided API key is in the list of valid keys."""
        return api_key in valid_keys
