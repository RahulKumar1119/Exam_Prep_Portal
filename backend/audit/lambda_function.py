"""
Audit Logging Lambda Function for JAIIB-CAIIB Exam Prep Portal

Handles audit log creation, retrieval, and reporting for compliance tracking.
"""

import json
import os
from typing import Dict, Any
from audit_logger import AuditLogger


def success_response(status_code: int, data: Dict[str, Any]) -> Dict[str, Any]:
    """Return successful response."""
    return {
        'statusCode': status_code,
        'body': json.dumps(data),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }


def error_response(status_code: int, message: str) -> Dict[str, Any]:
    """Return error response."""
    return {
        'statusCode': status_code,
        'body': json.dumps({'error': message}),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }


def log_action(event: Dict[str, Any]) -> Dict[str, Any]:
    """
    Log a user action.
    
    Event structure:
    {
        "user_id": "uuid",
        "action_type": "login|logout|practice_submit|...",
        "resource_id": "uuid" (optional),
        "resource_type": "string" (optional),
        "result": "success|failure" (optional),
        "ip_address": "string" (optional),
        "device_info": "string" (optional),
        "details": {} (optional)
    }
    """
    try:
        user_id = event.get('user_id')
        action_type = event.get('action_type')
        
        if not user_id or not action_type:
            return error_response(400, "user_id and action_type are required")
        
        result = AuditLogger.log_action(
            user_id=user_id,
            action_type=action_type,
            resource_id=event.get('resource_id'),
            resource_type=event.get('resource_type'),
            result=event.get('result', AuditLogger.RESULT_SUCCESS),
            ip_address=event.get('ip_address'),
            device_info=event.get('device_info'),
            details=event.get('details')
        )
        
        if result.get('status') == 'success':
            return success_response(201, result)
        else:
            return error_response(500, result.get('message', 'Failed to log action'))
    except Exception as e:
        return error_response(500, str(e))


def get_audit_logs(event: Dict[str, Any]) -> Dict[str, Any]:
    """
    Retrieve audit logs with filtering.
    
    Event structure:
    {
        "start_date": "ISO format date",
        "end_date": "ISO format date",
        "user_id": "uuid" (optional),
        "action_type": "string" (optional),
        "resource_type": "string" (optional),
        "limit": 100 (optional)
    }
    """
    try:
        start_date = event.get('start_date')
        end_date = event.get('end_date')
        
        if not start_date or not end_date:
            return error_response(400, "start_date and end_date are required")
        
        # Log the access to audit logs (meta-audit logging)
        accessor_id = event.get('accessor_id', 'system')
        AuditLogger.log_audit_log_access(
            accessor_id=accessor_id,
            date_range={'start_date': start_date, 'end_date': end_date},
            filters={
                'user_id': event.get('user_id'),
                'action_type': event.get('action_type'),
                'resource_type': event.get('resource_type')
            },
            ip_address=event.get('ip_address'),
            device_info=event.get('device_info')
        )
        
        result = AuditLogger.get_audit_logs(
            start_date=start_date,
            end_date=end_date,
            user_id=event.get('user_id'),
            action_type=event.get('action_type'),
            resource_type=event.get('resource_type'),
            limit=event.get('limit', 100)
        )
        
        if result.get('status') == 'success':
            return success_response(200, result)
        else:
            return error_response(500, result.get('message', 'Failed to retrieve audit logs'))
    except Exception as e:
        return error_response(500, str(e))


def handler(event, context):
    """
    Main Lambda handler for audit logging operations.
    
    Event structure:
    {
        "action": "log_action|get_logs",
        ... (action-specific parameters)
    }
    """
    try:
        action = event.get('action', 'log_action')
        
        if action == 'log_action':
            return log_action(event)
        elif action == 'get_logs':
            return get_audit_logs(event)
        else:
            return error_response(400, f"Unknown action: {action}")
    except Exception as e:
        return error_response(500, str(e))
