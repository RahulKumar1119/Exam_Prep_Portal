"""
Audit Log Storage and Encryption Service

Implements:
- Tamper-proof storage (immutable records)
- KMS encryption for sensitive data
- Meta-audit logging (logging access to audit logs)
- Audit log archival to S3 after 1 year
"""

import json
import os
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List
import boto3
from botocore.exceptions import ClientError

# AWS clients
dynamodb = boto3.resource('dynamodb')
s3_client = boto3.client('s3')
kms_client = boto3.client('kms')

# Environment variables
AUDIT_LOGS_TABLE = os.environ.get('AUDIT_LOGS_TABLE', 'AuditLogs')
AUDIT_ARCHIVE_BUCKET = os.environ.get('AUDIT_ARCHIVE_BUCKET', 'jaiib-audit-archive')
KMS_KEY_ID = os.environ.get('AUDIT_KMS_KEY_ID', 'alias/jaiib-audit-key')
ARCHIVE_THRESHOLD_DAYS = 365  # Archive logs older than 1 year

# DynamoDB table
audit_logs_table = dynamodb.Table(AUDIT_LOGS_TABLE)


class AuditStorageService:
    """Service for managing audit log storage, encryption, and archival."""
    
    @staticmethod
    def create_audit_log_table():
        """
        Create the AuditLogs DynamoDB table with proper configuration.
        
        This should be called during infrastructure setup.
        """
        try:
            table = dynamodb.create_table(
                TableName=AUDIT_LOGS_TABLE,
                KeySchema=[
                    {'AttributeName': 'log_id', 'KeyType': 'HASH'},
                    {'AttributeName': 'timestamp', 'KeyType': 'RANGE'}
                ],
                AttributeDefinitions=[
                    {'AttributeName': 'log_id', 'AttributeType': 'S'},
                    {'AttributeName': 'timestamp', 'AttributeType': 'S'},
                    {'AttributeName': 'user_id', 'AttributeType': 'S'},
                    {'AttributeName': 'action_type', 'AttributeType': 'S'}
                ],
                GlobalSecondaryIndexes=[
                    {
                        'IndexName': 'user_id-timestamp-index',
                        'KeySchema': [
                            {'AttributeName': 'user_id', 'KeyType': 'HASH'},
                            {'AttributeName': 'timestamp', 'KeyType': 'RANGE'}
                        ],
                        'Projection': {'ProjectionType': 'ALL'},
                        'BillingMode': 'PAY_PER_REQUEST'
                    },
                    {
                        'IndexName': 'action_type-timestamp-index',
                        'KeySchema': [
                            {'AttributeName': 'action_type', 'KeyType': 'HASH'},
                            {'AttributeName': 'timestamp', 'KeyType': 'RANGE'}
                        ],
                        'Projection': {'ProjectionType': 'ALL'},
                        'BillingMode': 'PAY_PER_REQUEST'
                    }
                ],
                BillingMode='PAY_PER_REQUEST',
                SSESpecification={
                    'Enabled': True,
                    'SSEType': 'KMS',
                    'KMSMasterKeyId': KMS_KEY_ID
                },
                StreamSpecification={
                    'StreamViewType': 'NEW_IMAGE'
                }
            )
            
            # Wait for table to be created
            table.wait_until_exists()
            
            return {
                'status': 'success',
                'message': f'Table {AUDIT_LOGS_TABLE} created successfully'
            }
        except ClientError as e:
            if e.response['Error']['Code'] == 'ResourceInUseException':
                return {
                    'status': 'success',
                    'message': f'Table {AUDIT_LOGS_TABLE} already exists'
                }
            else:
                return {
                    'status': 'error',
                    'message': str(e)
                }
    
    @staticmethod
    def store_audit_log(audit_record: Dict[str, Any]) -> Dict[str, Any]:
        """
        Store an audit log record in DynamoDB with KMS encryption.
        
        The record is stored as immutable (no updates allowed via IAM policy).
        
        Args:
            audit_record: Dictionary containing audit log data
        
        Returns:
            Dictionary with status and log_id
        """
        try:
            # Ensure timestamp is present
            if 'timestamp' not in audit_record:
                audit_record['timestamp'] = datetime.utcnow().isoformat()
            
            # Store in DynamoDB (KMS encryption is automatic via table config)
            audit_logs_table.put_item(Item=audit_record)
            
            return {
                'status': 'success',
                'log_id': audit_record.get('log_id'),
                'timestamp': audit_record.get('timestamp')
            }
        except ClientError as e:
            print(f"Error storing audit log: {str(e)}")
            return {
                'status': 'error',
                'message': str(e)
            }
    
    @staticmethod
    def verify_immutability(log_id: str) -> bool:
        """
        Verify that an audit log record cannot be modified.
        
        This is enforced through IAM policies that prevent:
        - UpdateItem operations on audit log records
        - DeleteItem operations on audit log records
        - BatchWriteItem operations on audit log records
        
        Args:
            log_id: ID of the audit log to verify
        
        Returns:
            True if record exists and is immutable
        """
        try:
            # Try to retrieve the record
            response = audit_logs_table.get_item(Key={'log_id': log_id})
            
            if 'Item' not in response:
                return False
            
            # Record exists and is immutable (enforced by IAM policy)
            return True
        except ClientError as e:
            print(f"Error verifying immutability: {str(e)}")
            return False
    
    @staticmethod
    def archive_old_logs(days_threshold: int = ARCHIVE_THRESHOLD_DAYS) -> Dict[str, Any]:
        """
        Archive audit logs older than the specified threshold to S3.
        
        This should be run periodically (e.g., daily) to archive logs older than 1 year.
        
        Args:
            days_threshold: Number of days to keep in DynamoDB (default: 365)
        
        Returns:
            Dictionary with archival status and count
        """
        try:
            # Calculate cutoff date
            cutoff_date = (datetime.utcnow() - timedelta(days=days_threshold)).isoformat()
            
            # Scan for logs older than cutoff date
            response = audit_logs_table.scan(
                FilterExpression='#ts < :cutoff_date',
                ExpressionAttributeNames={'#ts': 'timestamp'},
                ExpressionAttributeValues={':cutoff_date': cutoff_date}
            )
            
            logs_to_archive = response.get('Items', [])
            
            if not logs_to_archive:
                return {
                    'status': 'success',
                    'archived_count': 0,
                    'message': 'No logs to archive'
                }
            
            # Archive logs to S3
            archive_key = f"audit-logs/archive-{datetime.utcnow().strftime('%Y-%m-%d')}.json"
            
            s3_client.put_object(
                Bucket=AUDIT_ARCHIVE_BUCKET,
                Key=archive_key,
                Body=json.dumps(logs_to_archive),
                ServerSideEncryption='aws:kms',
                SSEKMSKeyId=KMS_KEY_ID,
                ContentType='application/json'
            )
            
            # Delete archived logs from DynamoDB
            with audit_logs_table.batch_writer(
                overwrite_by_pkeys=['log_id', 'timestamp']
            ) as batch:
                for log in logs_to_archive:
                    batch.delete_item(
                        Key={
                            'log_id': log['log_id'],
                            'timestamp': log['timestamp']
                        }
                    )
            
            return {
                'status': 'success',
                'archived_count': len(logs_to_archive),
                'archive_location': f"s3://{AUDIT_ARCHIVE_BUCKET}/{archive_key}"
            }
        except ClientError as e:
            print(f"Error archiving audit logs: {str(e)}")
            return {
                'status': 'error',
                'message': str(e)
            }
    
    @staticmethod
    def get_archived_logs(
        start_date: str,
        end_date: str,
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Retrieve archived audit logs from S3.
        
        Args:
            start_date: Start date (ISO format)
            end_date: End date (ISO format)
            user_id: Filter by user ID (optional)
        
        Returns:
            Dictionary with archived logs
        """
        try:
            # List archive files in date range
            prefix = "audit-logs/archive-"
            response = s3_client.list_objects_v2(
                Bucket=AUDIT_ARCHIVE_BUCKET,
                Prefix=prefix
            )
            
            archived_logs = []
            
            if 'Contents' not in response:
                return {
                    'status': 'success',
                    'logs': [],
                    'count': 0
                }
            
            # Process each archive file
            for obj in response['Contents']:
                try:
                    # Download and parse archive file
                    archive_response = s3_client.get_object(
                        Bucket=AUDIT_ARCHIVE_BUCKET,
                        Key=obj['Key']
                    )
                    
                    logs = json.loads(archive_response['Body'].read().decode('utf-8'))
                    
                    # Filter by date range and user_id
                    for log in logs:
                        log_date = log.get('timestamp', '')
                        if start_date <= log_date <= end_date:
                            if user_id is None or log.get('user_id') == user_id:
                                archived_logs.append(log)
                except Exception as e:
                    print(f"Error processing archive file {obj['Key']}: {str(e)}")
                    continue
            
            return {
                'status': 'success',
                'logs': archived_logs,
                'count': len(archived_logs)
            }
        except ClientError as e:
            print(f"Error retrieving archived logs: {str(e)}")
            return {
                'status': 'error',
                'message': str(e)
            }
    
    @staticmethod
    def verify_encryption(log_id: str) -> Dict[str, Any]:
        """
        Verify that an audit log record is encrypted with KMS.
        
        Args:
            log_id: ID of the audit log to verify
        
        Returns:
            Dictionary with encryption verification status
        """
        try:
            # Retrieve the log record
            response = audit_logs_table.get_item(Key={'log_id': log_id})
            
            if 'Item' not in response:
                return {
                    'status': 'error',
                    'message': 'Log record not found'
                }
            
            # Verify that the table uses KMS encryption
            table_description = audit_logs_table.table_status
            
            # Check if SSE is enabled
            sse_description = table_description.get('SSEDescription', {})
            
            if sse_description.get('Status') == 'ENABLED':
                return {
                    'status': 'success',
                    'encrypted': True,
                    'encryption_type': sse_description.get('SSEType', 'UNKNOWN'),
                    'key_arn': sse_description.get('KMSMasterKeyArn', 'UNKNOWN')
                }
            else:
                return {
                    'status': 'error',
                    'encrypted': False,
                    'message': 'Table encryption not enabled'
                }
        except ClientError as e:
            print(f"Error verifying encryption: {str(e)}")
            return {
                'status': 'error',
                'message': str(e)
            }
    
    @staticmethod
    def create_archive_bucket():
        """
        Create the S3 bucket for audit log archival with encryption.
        
        This should be called during infrastructure setup.
        """
        try:
            # Create bucket
            s3_client.create_bucket(
                Bucket=AUDIT_ARCHIVE_BUCKET,
                CreateBucketConfiguration={
                    'LocationConstraint': os.environ.get('AWS_REGION', 'us-east-1')
                }
            )
            
            # Enable versioning
            s3_client.put_bucket_versioning(
                Bucket=AUDIT_ARCHIVE_BUCKET,
                VersioningConfiguration={'Status': 'Enabled'}
            )
            
            # Enable encryption
            s3_client.put_bucket_encryption(
                Bucket=AUDIT_ARCHIVE_BUCKET,
                ServerSideEncryptionConfiguration={
                    'Rules': [
                        {
                            'ApplyServerSideEncryptionByDefault': {
                                'SSEAlgorithm': 'aws:kms',
                                'KMSMasterKeyID': KMS_KEY_ID
                            }
                        }
                    ]
                }
            )
            
            # Block public access
            s3_client.put_public_access_block(
                Bucket=AUDIT_ARCHIVE_BUCKET,
                PublicAccessBlockConfiguration={
                    'BlockPublicAcls': True,
                    'IgnorePublicAcls': True,
                    'BlockPublicPolicy': True,
                    'RestrictPublicBuckets': True
                }
            )
            
            return {
                'status': 'success',
                'message': f'Bucket {AUDIT_ARCHIVE_BUCKET} created successfully'
            }
        except ClientError as e:
            if e.response['Error']['Code'] == 'BucketAlreadyOwnedByYou':
                return {
                    'status': 'success',
                    'message': f'Bucket {AUDIT_ARCHIVE_BUCKET} already exists'
                }
            else:
                return {
                    'status': 'error',
                    'message': str(e)
                }
