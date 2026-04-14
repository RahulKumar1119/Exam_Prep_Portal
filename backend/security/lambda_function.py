"""
Security Lambda Function for JAIIB-CAIIB Exam Prep Portal

Handles security operations:
- Key rotation status checks
- Data re-encryption after key rotation
- Secure data deletion
- Encrypted data export with presigned URLs
- Security header injection

Requirements: 13.1, 13.2, 13.7, 13.8, 13.9
"""

import json
from security_service import (
    KMSKeyManager,
    SecureDataManager,
    SecurityHeadersMiddleware,
    RequestValidator,
    TLSSecurityHelper,
    KMS_KEY_ID,
)


def handler(event: dict, context) -> dict:
    """Main Lambda handler for security operations."""
    action = event.get('action') or (
        event.get('pathParameters', {}) or {}
    ).get('action', '')

    # Support both direct invocation and API Gateway proxy events
    if 'body' in event and isinstance(event['body'], str):
        try:
            body = json.loads(event['body'])
        except (json.JSONDecodeError, TypeError):
            body = {}
    else:
        body = event.get('body', event)

    if action == 'get_key_metadata':
        key_id = body.get('key_id', KMS_KEY_ID)
        result = KMSKeyManager.get_key_metadata(key_id)
        return SecurityHeadersMiddleware.build_response(200, result)

    elif action == 'enable_key_rotation':
        key_id = body.get('key_id', KMS_KEY_ID)
        result = KMSKeyManager.enable_key_rotation(key_id)
        return SecurityHeadersMiddleware.build_response(200, result)

    elif action == 'reencrypt_field':
        result = KMSKeyManager.reencrypt_table_field(
            table_name=body.get('table_name', ''),
            pk_name=body.get('pk_name', ''),
            pk_value=body.get('pk_value', ''),
            field_name=body.get('field_name', ''),
            destination_key_id=body.get('key_id', KMS_KEY_ID),
        )
        return SecurityHeadersMiddleware.build_response(200, result)

    elif action == 'secure_delete':
        result = SecureDataManager.secure_delete_item(
            table_name=body.get('table_name', ''),
            key=body.get('key', {}),
        )
        return SecurityHeadersMiddleware.build_response(200, result)

    elif action == 'create_export':
        result = SecureDataManager.create_encrypted_export(
            data=body.get('data', {}),
            export_id=body.get('export_id'),
            expiry_hours=body.get('expiry_hours', 24),
        )
        return SecurityHeadersMiddleware.build_response(200, result)

    elif action == 'get_tls_policy':
        result = TLSSecurityHelper.get_tls_policy()
        return SecurityHeadersMiddleware.build_response(200, result)

    else:
        return SecurityHeadersMiddleware.build_response(
            400, {'error': f'Unknown action: {action}'}
        )
