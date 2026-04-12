"""
Notification Lambda Function

Handles notification creation, delivery, and management
"""

import json
from typing import Dict, Any
from notification_service import NotificationService


def handler(event, context):
    """
    Main Lambda handler for notification operations
    
    Event structure:
    {
        "action": "create" | "get_notifications" | "mark_read" | "check_milestones" | "check_mastery" | "check_reminders" | "send_update",
        "user_id": "uuid",
        "notification_type": "milestone" | "mastery" | "reminder" | "update" (for create),
        "title": "string" (for create),
        "message": "string" (for create),
        "action_url": "string" (optional, for create),
        "paper_name": "string" (for check_mastery),
        "user_ids": ["uuid"] (for send_update),
        "notification_id": "uuid" (for mark_read),
        "limit": int (for get_notifications)
    }
    """
    try:
        # Handle CORS preflight requests
        http_method = event.get('httpMethod', 'POST')
        if http_method == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
                },
                'body': json.dumps({})
            }
        
        # Parse body if it's a string (from API Gateway)
        body = event.get('body', {})
        if isinstance(body, str):
            body = json.loads(body) if body else {}
        
        action = body.get('action', 'create')
        user_id = body.get('user_id')
        
        if action == 'create':
            return create_notification(body)
        elif action == 'get_notifications':
            return get_notifications(body)
        elif action == 'mark_read':
            return mark_notification_as_read(body)
        elif action == 'check_milestones':
            return check_milestone_notifications(body)
        elif action == 'check_mastery':
            return check_mastery_notifications(body)
        elif action == 'check_reminders':
            return check_reminder_notifications(body)
        elif action == 'send_update':
            return send_question_bank_update(body)
        else:
            return error_response(400, f"Unknown action: {action}")
            
    except Exception as e:
        print(f"Error in handler: {str(e)}")
        return error_response(500, "Internal server error")


def create_notification(event: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new notification"""
    user_id = event.get('user_id')
    notification_type = event.get('notification_type')
    title = event.get('title')
    message = event.get('message')
    action_url = event.get('action_url')
    
    if not all([user_id, notification_type, title, message]):
        return error_response(400, "Missing required fields: user_id, notification_type, title, message")
    
    result = NotificationService.create_notification(
        user_id=user_id,
        notification_type=notification_type,
        title=title,
        message=message,
        action_url=action_url
    )
    
    if result['success']:
        return success_response(result)
    else:
        return error_response(500, result.get('error', 'Failed to create notification'))


def get_notifications(event: Dict[str, Any]) -> Dict[str, Any]:
    """Get user's notifications"""
    user_id = event.get('user_id')
    limit = event.get('limit', 50)
    start_key = event.get('start_key')
    
    if not user_id:
        return error_response(400, "user_id is required")
    
    result = NotificationService.get_user_notifications(
        user_id=user_id,
        limit=limit,
        start_key=start_key
    )
    
    if result['success']:
        return success_response(result)
    else:
        return error_response(500, result.get('error', 'Failed to get notifications'))


def mark_notification_as_read(event: Dict[str, Any]) -> Dict[str, Any]:
    """Mark a notification as read"""
    user_id = event.get('user_id')
    notification_id = event.get('notification_id')
    
    if not all([user_id, notification_id]):
        return error_response(400, "user_id and notification_id are required")
    
    result = NotificationService.mark_notification_as_read(
        user_id=user_id,
        notification_id=notification_id
    )
    
    if result['success']:
        return success_response(result)
    else:
        return error_response(500, result.get('error', 'Failed to mark notification as read'))


def check_milestone_notifications(event: Dict[str, Any]) -> Dict[str, Any]:
    """Check and create milestone notifications"""
    user_id = event.get('user_id')
    
    if not user_id:
        return error_response(400, "user_id is required")
    
    notifications = NotificationService.check_milestone_notifications(user_id)
    
    return success_response({
        'notifications_created': len(notifications),
        'notifications': notifications
    })


def check_mastery_notifications(event: Dict[str, Any]) -> Dict[str, Any]:
    """Check and create mastery notifications"""
    user_id = event.get('user_id')
    paper_name = event.get('paper_name')
    
    if not all([user_id, paper_name]):
        return error_response(400, "user_id and paper_name are required")
    
    notifications = NotificationService.check_mastery_notifications(
        user_id=user_id,
        paper_name=paper_name
    )
    
    return success_response({
        'notifications_created': len(notifications),
        'notifications': notifications
    })


def check_reminder_notifications(event: Dict[str, Any]) -> Dict[str, Any]:
    """Check and create reminder notifications"""
    user_id = event.get('user_id')
    
    if not user_id:
        return error_response(400, "user_id is required")
    
    notifications = NotificationService.check_reminder_notifications(user_id)
    
    return success_response({
        'notifications_created': len(notifications),
        'notifications': notifications
    })


def send_question_bank_update(event: Dict[str, Any]) -> Dict[str, Any]:
    """Send question bank update notification to all users"""
    user_ids = event.get('user_ids', [])
    
    if not user_ids:
        return error_response(400, "user_ids is required")
    
    result = NotificationService.send_question_bank_update_notification(user_ids)
    
    return success_response(result)


def success_response(data: Dict[str, Any]) -> Dict[str, Any]:
    """Format success response"""
    return {
        'statusCode': 200,
        'body': json.dumps({
            'success': True,
            'data': data
        }),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }


def error_response(status_code: int, message: str) -> Dict[str, Any]:
    """Format error response"""
    return {
        'statusCode': status_code,
        'body': json.dumps({
            'success': False,
            'error': message
        }),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }
