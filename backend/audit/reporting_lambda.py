"""
Audit Log Reporting Lambda Function

Handles audit log retrieval and report generation for compliance officers.
"""

import json
from typing import Dict, Any
from reporting_service import AuditReportingService


def success_response(status_code: int, data: Dict[str, Any]) -> Dict[str, Any]:
    """Return successful response."""
    return {
        'statusCode': status_code,
        'body': json.dumps(data, default=str),
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


def retrieve_logs(event: Dict[str, Any]) -> Dict[str, Any]:
    """
    Retrieve audit logs with filtering.
    
    Event structure:
    {
        "start_date": "ISO format date",
        "end_date": "ISO format date",
        "user_id": "uuid" (optional),
        "action_type": "string" (optional),
        "resource_type": "string" (optional),
        "limit": 1000 (optional)
    }
    """
    try:
        start_date = event.get('start_date')
        end_date = event.get('end_date')
        
        if not start_date or not end_date:
            return error_response(400, "start_date and end_date are required")
        
        result = AuditReportingService.retrieve_audit_logs(
            start_date=start_date,
            end_date=end_date,
            user_id=event.get('user_id'),
            action_type=event.get('action_type'),
            resource_type=event.get('resource_type'),
            limit=event.get('limit', 1000)
        )
        
        if result.get('status') == 'success':
            return success_response(200, result)
        else:
            return error_response(500, result.get('message', 'Failed to retrieve audit logs'))
    except Exception as e:
        return error_response(500, str(e))


def generate_report(event: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate an audit report in CSV or PDF format.
    
    Event structure:
    {
        "start_date": "ISO format date",
        "end_date": "ISO format date",
        "format": "csv" or "pdf" (optional, default: csv),
        "save_to_s3": true or false (optional, default: true)
    }
    """
    try:
        start_date = event.get('start_date')
        end_date = event.get('end_date')
        
        if not start_date or not end_date:
            return error_response(400, "start_date and end_date are required")
        
        report_format = event.get('format', 'csv')
        save_to_s3 = event.get('save_to_s3', True)
        
        if report_format not in ['csv', 'pdf']:
            return error_response(400, "format must be 'csv' or 'pdf'")
        
        result = AuditReportingService.generate_compliance_report(
            start_date=start_date,
            end_date=end_date,
            report_format=report_format,
            save_to_s3=save_to_s3
        )
        
        if result.get('status') == 'success':
            return success_response(200, result)
        else:
            return error_response(500, result.get('message', 'Failed to generate report'))
    except Exception as e:
        return error_response(500, str(e))


def get_statistics(event: Dict[str, Any]) -> Dict[str, Any]:
    """
    Get audit statistics for a date range.
    
    Event structure:
    {
        "start_date": "ISO format date",
        "end_date": "ISO format date"
    }
    """
    try:
        start_date = event.get('start_date')
        end_date = event.get('end_date')
        
        if not start_date or not end_date:
            return error_response(400, "start_date and end_date are required")
        
        result = AuditReportingService.get_audit_statistics(
            start_date=start_date,
            end_date=end_date
        )
        
        if result.get('status') == 'success':
            return success_response(200, result)
        else:
            return error_response(500, result.get('message', 'Failed to get statistics'))
    except Exception as e:
        return error_response(500, str(e))


def handler(event, context):
    """
    Main Lambda handler for audit reporting operations.
    
    Event structure:
    {
        "action": "retrieve_logs|generate_report|get_statistics",
        ... (action-specific parameters)
    }
    """
    try:
        action = event.get('action', 'retrieve_logs')
        
        if action == 'retrieve_logs':
            return retrieve_logs(event)
        elif action == 'generate_report':
            return generate_report(event)
        elif action == 'get_statistics':
            return get_statistics(event)
        else:
            return error_response(400, f"Unknown action: {action}")
    except Exception as e:
        return error_response(500, str(e))
