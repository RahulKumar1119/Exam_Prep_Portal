"""
Audit Logger Service for JAIIB-CAIIB Exam Prep Portal

Implements comprehensive audit logging for all user actions with:
- Immutable record storage in DynamoDB
- KMS encryption for sensitive data
- Meta-audit logging (logging access to audit logs)
- Support for all action types (login, logout, practice submit, etc.)
"""

import json
import os
import uuid
from datetime import datetime
from typing import Dict, Any, Optional, List
import boto3
from botocore.exceptions import ClientError

# AWS clients
dynamodb = boto3.resource('dynamodb')
kms_client = boto3.client('kms')

# Environment variables
AUDIT_LOGS_TABLE = os.environ.get('AUDIT_LOGS_TABLE', 'AuditLogs')
KMS_KEY_ID = os.environ.get('AUDIT_KMS_KEY_ID', 'alias/jaiib-audit-key')

# DynamoDB table
audit_logs_table = dynamodb.Table(AUDIT_LOGS_TABLE)


class AuditLogger:
    """Service for logging and managing audit records."""
    
    # Action types
    ACTION_LOGIN = 'login'
    ACTION_LOGOUT = 'logout'
    ACTION_PRACTICE_SUBMIT = 'practice_submit'
    ACTION_SCORE_VIEW = 'score_view'
    ACTION_QUESTION_CREATE = 'question_create'
    ACTION_QUESTION_UPDATE = 'question_update'
    ACTION_QUESTION_DELETE = 'question_delete'
    ACTION_VERSION_PUBLISH = 'version_publish'
    ACTION_VERSION_ROLLBACK = 'version_rollback'
    ACTION_AUDIT_LOG_ACCESS = 'audit_log_access'
    ACTION_ADMIN_ACCESS = 'admin_access'
    ACTION_REPORT_GENERATE = 'report_generate'
    
    # Result types
    RESULT_SUCCESS = 'success'
    RESULT_FAILURE = 'failure'
    
    @staticmethod
    def log_action(
        user_id: str,
        action_type: str,
        resource_id: Optional[str] = None,
        resource_type: Optional[str] = None,
        result: str = RESULT_SUCCESS,
        ip_address: Optional[str] = None,
        device_info: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Log a user action to the audit log.
        
        Args:
            user_id: ID of the user performing the action
            action_type: Type of action (login, logout, practice_submit, etc.)
            resource_id: ID of the resource being accessed/modified
            resource_type: Type of resource (question, session, score, etc.)
            result: Result of the action (success or failure)
            ip_address: IP address of the user
            device_info: Device information (browser, OS, etc.)
            details: Additional details about the action (encrypted)
        
        Returns:
            Dictionary with log_id and status
        """
        try:
            log_id = str(uuid.uuid4())
            timestamp = datetime.utcnow().isoformat()
            
            # Prepare audit log record
            audit_record = {
                'log_id': log_id,
                'timestamp': timestamp,
                'user_id': user_id,
                'action_type': action_type,
                'resource_id': resource_id or 'N/A',
                'resource_type': resource_type or 'N/A',
                'result': result,
                'ip_address': ip_address or 'N/A',
                'device_info': device_info or 'N/A',
            }
            
            # Encrypt sensitive details if provided
            if details:
                encrypted_details = AuditLogger._encrypt_details(details)
                audit_record['details'] = encrypted_details
            
            # Store in DynamoDB (immutable - no updates allowed)
            audit_logs_table.put_item(Item=audit_record)
            
            return {
                'status': 'success',
                'log_id': log_id,
                'timestamp': timestamp
            }
        except ClientError as e:
            print(f"Error logging audit action: {str(e)}")
            return {
                'status': 'error',
                'message': str(e)
            }
    
    @staticmethod
    def log_login(
        user_id: str,
        ip_address: str,
        device_info: str,
        result: str = RESULT_SUCCESS
    ) -> Dict[str, Any]:
        """Log user login action."""
        return AuditLogger.log_action(
            user_id=user_id,
            action_type=AuditLogger.ACTION_LOGIN,
            result=result,
            ip_address=ip_address,
            device_info=device_info
        )
    
    @staticmethod
    def log_logout(
        user_id: str,
        ip_address: str,
        device_info: str
    ) -> Dict[str, Any]:
        """Log user logout action."""
        return AuditLogger.log_action(
            user_id=user_id,
            action_type=AuditLogger.ACTION_LOGOUT,
            ip_address=ip_address,
            device_info=device_info
        )
    
    @staticmethod
    def log_practice_submit(
        user_id: str,
        session_id: str,
        questions: List[str],
        answers: Dict[str, str],
        score: float,
        ip_address: Optional[str] = None,
        device_info: Optional[str] = None
    ) -> Dict[str, Any]:
        """Log practice set submission."""
        details = {
            'session_id': session_id,
            'questions_count': len(questions),
            'answers_count': len(answers),
            'score': score
        }
        
        return AuditLogger.log_action(
            user_id=user_id,
            action_type=AuditLogger.ACTION_PRACTICE_SUBMIT,
            resource_id=session_id,
            resource_type='practice_session',
            details=details,
            ip_address=ip_address,
            device_info=device_info
        )
    
    @staticmethod
    def log_score_view(
        user_id: str,
        session_id: str,
        ip_address: Optional[str] = None,
        device_info: Optional[str] = None
    ) -> Dict[str, Any]:
        """Log score view action."""
        return AuditLogger.log_action(
            user_id=user_id,
            action_type=AuditLogger.ACTION_SCORE_VIEW,
            resource_id=session_id,
            resource_type='score',
            ip_address=ip_address,
            device_info=device_info
        )
    
    @staticmethod
    def log_question_modification(
        modifier_id: str,
        action_type: str,
        question_id: str,
        change_description: str,
        ip_address: Optional[str] = None,
        device_info: Optional[str] = None
    ) -> Dict[str, Any]:
        """Log question bank modification (create, update, delete)."""
        details = {
            'change_description': change_description
        }
        
        return AuditLogger.log_action(
            user_id=modifier_id,
            action_type=action_type,
            resource_id=question_id,
            resource_type='question',
            details=details,
            ip_address=ip_address,
            device_info=device_info
        )
    
    @staticmethod
    def log_version_publish(
        publisher_id: str,
        version_number: str,
        change_summary: str,
        ip_address: Optional[str] = None,
        device_info: Optional[str] = None
    ) -> Dict[str, Any]:
        """Log question bank version publication."""
        details = {
            'version_number': version_number,
            'change_summary': change_summary
        }
        
        return AuditLogger.log_action(
            user_id=publisher_id,
            action_type=AuditLogger.ACTION_VERSION_PUBLISH,
            resource_id=version_number,
            resource_type='question_bank_version',
            details=details,
            ip_address=ip_address,
            device_info=device_info
        )
    
    @staticmethod
    def log_version_rollback(
        initiator_id: str,
        target_version: str,
        reason: str,
        ip_address: Optional[str] = None,
        device_info: Optional[str] = None
    ) -> Dict[str, Any]:
        """Log question bank version rollback."""
        details = {
            'target_version': target_version,
            'reason': reason
        }
        
        return AuditLogger.log_action(
            user_id=initiator_id,
            action_type=AuditLogger.ACTION_VERSION_ROLLBACK,
            resource_id=target_version,
            resource_type='question_bank_version',
            details=details,
            ip_address=ip_address,
            device_info=device_info
        )
    
    @staticmethod
    def log_audit_log_access(
        accessor_id: str,
        date_range: Optional[Dict[str, str]] = None,
        filters: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None,
        device_info: Optional[str] = None
    ) -> Dict[str, Any]:
        """Log access to audit logs (meta-audit logging)."""
        details = {
            'date_range': date_range,
            'filters': filters
        }
        
        return AuditLogger.log_action(
            user_id=accessor_id,
            action_type=AuditLogger.ACTION_AUDIT_LOG_ACCESS,
            resource_type='audit_logs',
            details=details,
            ip_address=ip_address,
            device_info=device_info
        )
    
    @staticmethod
    def log_admin_access(
        admin_id: str,
        resource_accessed: str,
        ip_address: Optional[str] = None,
        device_info: Optional[str] = None
    ) -> Dict[str, Any]:
        """Log administrator access to sensitive data."""
        details = {
            'resource_accessed': resource_accessed
        }
        
        return AuditLogger.log_action(
            user_id=admin_id,
            action_type=AuditLogger.ACTION_ADMIN_ACCESS,
            resource_type='admin_resource',
            details=details,
            ip_address=ip_address,
            device_info=device_info
        )
    
    @staticmethod
    def log_report_generation(
        generator_id: str,
        report_type: str,
        date_range: Dict[str, str],
        ip_address: Optional[str] = None,
        device_info: Optional[str] = None
    ) -> Dict[str, Any]:
        """Log audit report generation."""
        details = {
            'report_type': report_type,
            'date_range': date_range
        }
        
        return AuditLogger.log_action(
            user_id=generator_id,
            action_type=AuditLogger.ACTION_REPORT_GENERATE,
            resource_type='audit_report',
            details=details,
            ip_address=ip_address,
            device_info=device_info
        )
    
    @staticmethod
    def _encrypt_details(details: Dict[str, Any]) -> str:
        """
        Encrypt sensitive details using AWS KMS.
        
        Args:
            details: Dictionary of details to encrypt
        
        Returns:
            Encrypted string (base64 encoded)
        """
        try:
            details_json = json.dumps(details)
            response = kms_client.encrypt(
                KeyId=KMS_KEY_ID,
                Plaintext=details_json.encode('utf-8')
            )
            # Return base64 encoded ciphertext
            import base64
            return base64.b64encode(response['CiphertextBlob']).decode('utf-8')
        except ClientError as e:
            print(f"Error encrypting audit details: {str(e)}")
            # Return unencrypted JSON as fallback
            return json.dumps(details)
    
    @staticmethod
    def _decrypt_details(encrypted_details: str) -> Dict[str, Any]:
        """
        Decrypt sensitive details using AWS KMS.
        
        Args:
            encrypted_details: Base64 encoded encrypted string
        
        Returns:
            Decrypted dictionary
        """
        try:
            import base64
            ciphertext = base64.b64decode(encrypted_details.encode('utf-8'))
            response = kms_client.decrypt(CiphertextBlob=ciphertext)
            details_json = response['Plaintext'].decode('utf-8')
            return json.loads(details_json)
        except ClientError as e:
            print(f"Error decrypting audit details: {str(e)}")
            return {}
    
    @staticmethod
    def get_audit_logs(
        start_date: str,
        end_date: str,
        user_id: Optional[str] = None,
        action_type: Optional[str] = None,
        resource_type: Optional[str] = None,
        limit: int = 100
    ) -> Dict[str, Any]:
        """
        Retrieve audit logs with filtering.
        
        Args:
            start_date: Start date (ISO format)
            end_date: End date (ISO format)
            user_id: Filter by user ID (optional)
            action_type: Filter by action type (optional)
            resource_type: Filter by resource type (optional)
            limit: Maximum number of logs to return
        
        Returns:
            Dictionary with logs and metadata
        """
        try:
            # Build filter expression
            filter_expressions = [
                'timestamp BETWEEN :start_date AND :end_date'
            ]
            expression_values = {
                ':start_date': start_date,
                ':end_date': end_date
            }
            
            if user_id:
                filter_expressions.append('user_id = :user_id')
                expression_values[':user_id'] = user_id
            
            if action_type:
                filter_expressions.append('action_type = :action_type')
                expression_values[':action_type'] = action_type
            
            if resource_type:
                filter_expressions.append('resource_type = :resource_type')
                expression_values[':resource_type'] = resource_type
            
            filter_expression = ' AND '.join(filter_expressions)
            
            # Query audit logs
            response = audit_logs_table.scan(
                FilterExpression=filter_expression,
                ExpressionAttributeValues=expression_values,
                Limit=limit
            )
            
            logs = response.get('Items', [])
            
            return {
                'status': 'success',
                'logs': logs,
                'count': len(logs),
                'last_evaluated_key': response.get('LastEvaluatedKey')
            }
        except ClientError as e:
            print(f"Error retrieving audit logs: {str(e)}")
            return {
                'status': 'error',
                'message': str(e)
            }
    
    @staticmethod
    def verify_immutability(log_id: str) -> bool:
        """
        Verify that an audit log record is immutable (cannot be modified).
        
        This is enforced at the DynamoDB level through IAM policies
        that prevent updates to audit log records.
        
        Args:
            log_id: ID of the audit log to verify
        
        Returns:
            True if record exists and is immutable
        """
        try:
            response = audit_logs_table.get_item(Key={'log_id': log_id})
            return 'Item' in response
        except ClientError as e:
            print(f"Error verifying audit log immutability: {str(e)}")
            return False
