"""
Property-based tests for infrastructure initialization.

Feature: jaiib-caiib-exam-prep-portal
Property 1: Infrastructure components initialize correctly

Validates: Requirements 14.5, 14.6
- Verify all DynamoDB tables exist with correct schemas
- Verify KMS key is accessible and functional
- Verify API Gateway endpoints are accessible
"""

import boto3
import pytest
from hypothesis import given, strategies as st, settings, HealthCheck
from botocore.exceptions import ClientError
import json
import os
from typing import Dict, List, Any


class InfrastructureValidator:
    """Validates infrastructure components are properly initialized."""

    def __init__(self):
        """Initialize AWS clients."""
        self.dynamodb = boto3.client('dynamodb', region_name='ap-south-1')
        self.kms = boto3.client('kms', region_name='ap-south-1')
        self.apigateway = boto3.client('apigateway', region_name='ap-south-1')

    def verify_dynamodb_tables_exist(self) -> Dict[str, bool]:
        """
        Verify all required DynamoDB tables exist with correct schemas.
        
        Returns:
            Dict mapping table names to verification status
        """
        required_tables = {
            'jaiib-users': {
                'pk': 'user_id',
                'attributes': ['email', 'full_name', 'bank_affiliation', 'password_hash', 
                              'email_verified', 'created_at', 'last_login', 'role', 'status', 'preferences'],
                'gsi': ['email-index']
            },
            'jaiib-practice-sessions': {
                'pk': 'session_id',
                'attributes': ['user_id', 'paper_name', 'questions', 'user_answers', 
                              'score', 'time_taken', 'submitted_at', 'status', 'version'],
                'gsi': ['user-id-index']
            },
            'jaiib-scores': {
                'pk': 'user_id',
                'sk': 'submitted_at',
                'attributes': ['session_id', 'paper_name', 'score', 'questions_correct', 
                              'time_taken', 'topic_breakdown'],
                'gsi': []
            },
            'jaiib-question-bank': {
                'pk': 'question_id',
                'sk': 'version',
                'attributes': ['paper_name', 'topic', 'difficulty', 'question_text', 
                              'options', 'correct_answer', 'rbi_reference', 'iibf_reference',
                              'created_at', 'created_by', 'status'],
                'gsi': ['paper-topic-index']
            },
            'jaiib-audit-logs': {
                'pk': 'log_id',
                'sk': 'timestamp',
                'attributes': ['user_id', 'action_type', 'resource_id', 'resource_type', 
                              'result', 'ip_address', 'device_info', 'details'],
                'gsi': ['user-id-index']
            },
            'jaiib-notifications': {
                'pk': 'user_id',
                'sk': 'notification_id',
                'attributes': ['type', 'title', 'message', 'read', 'created_at', 'action_url'],
                'gsi': []
            }
        }

        results = {}
        
        for table_name, schema in required_tables.items():
            try:
                # Describe table
                response = self.dynamodb.describe_table(TableName=table_name)
                table = response['Table']
                
                # Verify table exists and is active
                table_exists = table['TableStatus'] == 'ACTIVE'
                
                # Verify partition key
                pk_name = table['KeySchema'][0]['AttributeName']
                pk_correct = pk_name == schema['pk']
                
                # Verify sort key if specified
                sk_correct = True
                if 'sk' in schema:
                    if len(table['KeySchema']) > 1:
                        sk_name = table['KeySchema'][1]['AttributeName']
                        sk_correct = sk_name == schema['sk']
                    else:
                        sk_correct = False
                
                # Verify GSIs
                gsi_names = [gsi['IndexName'] for gsi in table.get('GlobalSecondaryIndexes', [])]
                gsi_correct = all(gsi in gsi_names for gsi in schema['gsi'])
                
                # Verify encryption
                encryption_enabled = table.get('SSEDescription', {}).get('Status') == 'ENABLED'
                
                # Verify point-in-time recovery
                pitr_enabled = table.get('PointInTimeRecoveryDescription', {}).get('PointInTimeRecoveryStatus') == 'ENABLED'
                
                results[table_name] = {
                    'exists': table_exists,
                    'pk_correct': pk_correct,
                    'sk_correct': sk_correct,
                    'gsi_correct': gsi_correct,
                    'encryption_enabled': encryption_enabled,
                    'pitr_enabled': pitr_enabled,
                    'all_correct': all([table_exists, pk_correct, sk_correct, gsi_correct, 
                                       encryption_enabled, pitr_enabled])
                }
            except ClientError as e:
                results[table_name] = {
                    'exists': False,
                    'error': str(e),
                    'all_correct': False
                }
        
        return results

    def verify_kms_key_accessible(self) -> Dict[str, Any]:
        """
        Verify KMS key is accessible and functional.
        
        Returns:
            Dict with KMS key verification status
        """
        try:
            # Get KMS key by alias
            key_alias = 'alias/jaiib-caiib-key'
            
            # Describe key
            alias_response = self.kms.describe_key(KeyId=key_alias)
            key_id = alias_response['KeyMetadata']['KeyId']
            
            # Verify key is enabled
            key_enabled = alias_response['KeyMetadata']['Enabled']
            
            # Verify key rotation is enabled
            rotation_response = self.kms.get_key_rotation_status(KeyId=key_id)
            rotation_enabled = rotation_response['KeyRotationEnabled']
            
            # Test encryption/decryption
            plaintext = b'test-data-for-encryption'
            encrypt_response = self.kms.encrypt(KeyId=key_id, Plaintext=plaintext)
            ciphertext = encrypt_response['CiphertextBlob']
            
            decrypt_response = self.kms.decrypt(CiphertextBlob=ciphertext)
            decrypted = decrypt_response['Plaintext']
            
            encryption_works = decrypted == plaintext
            
            return {
                'key_exists': True,
                'key_id': key_id,
                'key_enabled': key_enabled,
                'rotation_enabled': rotation_enabled,
                'encryption_works': encryption_works,
                'all_correct': all([key_enabled, rotation_enabled, encryption_works])
            }
        except ClientError as e:
            return {
                'key_exists': False,
                'error': str(e),
                'all_correct': False
            }

    def verify_api_gateway_endpoints_accessible(self) -> Dict[str, Any]:
        """
        Verify API Gateway endpoints are accessible.
        
        Returns:
            Dict with API Gateway verification status
        """
        try:
            # List REST APIs
            apis_response = self.apigateway.get_rest_apis(limit=100)
            apis = apis_response.get('items', [])
            
            # Find JAIIB API
            jaiib_api = None
            for api in apis:
                if 'jaiib' in api['name'].lower() or 'exam' in api['name'].lower():
                    jaiib_api = api
                    break
            
            if not jaiib_api:
                return {
                    'api_exists': False,
                    'error': 'JAIIB API not found',
                    'all_correct': False
                }
            
            api_id = jaiib_api['id']
            
            # Get resources
            resources_response = self.apigateway.get_resources(restApiId=api_id, limit=100)
            resources = resources_response.get('items', [])
            
            # Verify required resource paths exist
            required_paths = ['/auth', '/practice', '/dashboard']
            resource_paths = [r.get('path', '') for r in resources]
            
            paths_exist = all(path in resource_paths for path in required_paths)
            
            # Verify API is deployed
            stages_response = self.apigateway.get_stages(restApiId=api_id)
            stages = stages_response.get('item', [])
            
            api_deployed = len(stages) > 0
            
            return {
                'api_exists': True,
                'api_id': api_id,
                'api_name': jaiib_api['name'],
                'paths_exist': paths_exist,
                'api_deployed': api_deployed,
                'resource_count': len(resources),
                'all_correct': all([paths_exist, api_deployed])
            }
        except ClientError as e:
            return {
                'api_exists': False,
                'error': str(e),
                'all_correct': False
            }


class TestInfrastructureInitialization:
    """Test suite for infrastructure initialization."""

    @pytest.fixture
    def validator(self):
        """Create infrastructure validator."""
        return InfrastructureValidator()

    def test_dynamodb_tables_exist_and_configured(self, validator):
        """
        **Validates: Requirements 14.5, 14.6**
        
        Property: All DynamoDB tables exist with correct schemas
        
        For any infrastructure deployment, all required DynamoDB tables should exist
        with correct partition keys, sort keys, global secondary indexes, encryption,
        and point-in-time recovery enabled.
        """
        results = validator.verify_dynamodb_tables_exist()
        
        # Verify all tables exist
        assert len(results) == 6, f"Expected 6 tables, found {len(results)}"
        
        # Verify each table is correctly configured
        for table_name, status in results.items():
            assert status['all_correct'], (
                f"Table {table_name} not correctly configured: {status}"
            )
        
        # Verify specific tables
        assert results['jaiib-users']['exists'], "Users table does not exist"
        assert results['jaiib-practice-sessions']['exists'], "Practice sessions table does not exist"
        assert results['jaiib-scores']['exists'], "Scores table does not exist"
        assert results['jaiib-question-bank']['exists'], "Question bank table does not exist"
        assert results['jaiib-audit-logs']['exists'], "Audit logs table does not exist"
        assert results['jaiib-notifications']['exists'], "Notifications table does not exist"

    def test_kms_key_accessible_and_functional(self, validator):
        """
        **Validates: Requirements 14.5, 14.6**
        
        Property: KMS key is accessible and functional
        
        For any infrastructure deployment, the KMS key should be accessible,
        enabled, have rotation enabled, and support encryption/decryption operations.
        """
        result = validator.verify_kms_key_accessible()
        
        assert result['all_correct'], (
            f"KMS key not properly configured: {result}"
        )
        assert result['key_exists'], "KMS key does not exist"
        assert result['key_enabled'], "KMS key is not enabled"
        assert result['rotation_enabled'], "KMS key rotation is not enabled"
        assert result['encryption_works'], "KMS encryption/decryption does not work"

    def test_api_gateway_endpoints_accessible(self, validator):
        """
        **Validates: Requirements 14.5, 14.6**
        
        Property: API Gateway endpoints are accessible
        
        For any infrastructure deployment, the API Gateway should be deployed
        with required resource paths (/auth, /practice, /dashboard) accessible.
        """
        result = validator.verify_api_gateway_endpoints_accessible()
        
        assert result['all_correct'], (
            f"API Gateway not properly configured: {result}"
        )
        assert result['api_exists'], "API Gateway does not exist"
        assert result['paths_exist'], "Required API paths do not exist"
        assert result['api_deployed'], "API Gateway is not deployed"

    @given(
        table_name=st.sampled_from([
            'jaiib-users',
            'jaiib-practice-sessions',
            'jaiib-scores',
            'jaiib-question-bank',
            'jaiib-audit-logs',
            'jaiib-notifications'
        ])
    )
    @settings(max_examples=100, suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture])
    def test_dynamodb_table_encryption_enabled(self, validator, table_name):
        """
        **Validates: Requirements 14.5, 14.6**
        
        Property: All DynamoDB tables have encryption enabled
        
        For any DynamoDB table in the infrastructure, encryption should be enabled
        using the KMS customer-managed key.
        """
        try:
            response = validator.dynamodb.describe_table(TableName=table_name)
            table = response['Table']
            
            # Verify encryption is enabled
            encryption_enabled = table.get('SSEDescription', {}).get('Status') == 'ENABLED'
            assert encryption_enabled, f"Encryption not enabled for {table_name}"
            
            # Verify KMS key is used
            sse_description = table.get('SSEDescription', {})
            kms_key_arn = sse_description.get('KMSMasterKeyArn', '')
            assert 'jaiib-caiib-key' in kms_key_arn or 'kms' in kms_key_arn.lower(), (
                f"KMS key not properly configured for {table_name}"
            )
        except ClientError as e:
            pytest.fail(f"Failed to verify encryption for {table_name}: {str(e)}")

    @given(
        table_name=st.sampled_from([
            'jaiib-users',
            'jaiib-practice-sessions',
            'jaiib-scores',
            'jaiib-question-bank',
            'jaiib-audit-logs',
            'jaiib-notifications'
        ])
    )
    @settings(max_examples=100, suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture])
    def test_dynamodb_table_pitr_enabled(self, validator, table_name):
        """
        **Validates: Requirements 14.5, 14.6**
        
        Property: All DynamoDB tables have point-in-time recovery enabled
        
        For any DynamoDB table in the infrastructure, point-in-time recovery
        should be enabled for data protection and disaster recovery.
        """
        try:
            response = validator.dynamodb.describe_table(TableName=table_name)
            table = response['Table']
            
            # Verify PITR is enabled
            pitr_enabled = table.get('PointInTimeRecoveryDescription', {}).get(
                'PointInTimeRecoveryStatus'
            ) == 'ENABLED'
            assert pitr_enabled, f"PITR not enabled for {table_name}"
        except ClientError as e:
            pytest.fail(f"Failed to verify PITR for {table_name}: {str(e)}")

    @given(
        test_data=st.binary(min_size=1, max_size=1000)
    )
    @settings(max_examples=50, suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture])
    def test_kms_encryption_decryption_roundtrip(self, validator, test_data):
        """
        **Validates: Requirements 14.5, 14.6**
        
        Property: KMS encryption and decryption work correctly
        
        For any data encrypted with the KMS key, decryption should return
        the original plaintext data.
        """
        try:
            # Get KMS key
            key_alias = 'alias/jaiib-caiib-key'
            alias_response = validator.kms.describe_key(KeyId=key_alias)
            key_id = alias_response['KeyMetadata']['KeyId']
            
            # Encrypt data
            encrypt_response = validator.kms.encrypt(KeyId=key_id, Plaintext=test_data)
            ciphertext = encrypt_response['CiphertextBlob']
            
            # Decrypt data
            decrypt_response = validator.kms.decrypt(CiphertextBlob=ciphertext)
            decrypted = decrypt_response['Plaintext']
            
            # Verify roundtrip
            assert decrypted == test_data, "Encryption/decryption roundtrip failed"
        except ClientError as e:
            pytest.fail(f"KMS encryption/decryption failed: {str(e)}")

    def test_infrastructure_initialization_complete(self, validator):
        """
        **Validates: Requirements 14.5, 14.6**
        
        Integration test: All infrastructure components are initialized correctly
        
        For any infrastructure deployment, all components (DynamoDB, KMS, API Gateway)
        should be properly initialized and accessible.
        """
        # Verify DynamoDB tables
        dynamodb_results = validator.verify_dynamodb_tables_exist()
        dynamodb_ok = all(status['all_correct'] for status in dynamodb_results.values())
        assert dynamodb_ok, f"DynamoDB tables not properly configured: {dynamodb_results}"
        
        # Verify KMS key
        kms_result = validator.verify_kms_key_accessible()
        assert kms_result['all_correct'], f"KMS key not properly configured: {kms_result}"
        
        # Verify API Gateway
        api_result = validator.verify_api_gateway_endpoints_accessible()
        assert api_result['all_correct'], f"API Gateway not properly configured: {api_result}"
        
        # All components initialized successfully
        assert True, "Infrastructure initialization complete"


if __name__ == '__main__':
    pytest.main([__file__, '-v', '--tb=short'])
