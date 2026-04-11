"""
Timer Service Lambda Function

Implements session timer management:
- 10-minute countdown timer (600 seconds)
- Real-time timer updates every second
- Color changes: yellow at 5 minutes, red at 1 minute
- Auto-submission when timer reaches 0
- Timer pause/resume handling (5-min inactivity window)
"""

import json
import time
from typing import Dict, Any
import boto3

# AWS clients
dynamodb = boto3.resource('dynamodb')
sessions_table = dynamodb.Table('PracticeSessions')

# Constants
TOTAL_SESSION_TIME = 600  # 10 minutes in seconds
YELLOW_THRESHOLD = 300  # 5 minutes
RED_THRESHOLD = 60  # 1 minute
INACTIVITY_TIMEOUT = 300  # 5 minutes for pause/resume


def handler(event, context):
    """
    Main Lambda handler for timer management
    
    Event structure:
    {
        "action": "get_timer" | "update_timer" | "check_timeout" | "auto_submit",
        "session_id": "uuid",
        "user_id": "uuid",
        "current_time": timestamp (optional)
    }
    """
    try:
        action = event.get('action', 'get_timer')
        session_id = event.get('session_id')
        user_id = event.get('user_id')
        
        if not session_id or not user_id:
            return error_response(400, "session_id and user_id are required")
        
        if action == 'get_timer':
            return get_timer_status(session_id, user_id)
        elif action == 'update_timer':
            return update_timer_status(session_id, user_id, event.get('current_time'))
        elif action == 'check_timeout':
            return check_session_timeout(session_id, user_id)
        elif action == 'auto_submit':
            return prepare_auto_submit(session_id, user_id)
        else:
            return error_response(400, f"Unknown action: {action}")
            
    except Exception as e:
        print(f"Error in handler: {str(e)}")
        return error_response(500, "Internal server error")


def get_timer_status(session_id: str, user_id: str) -> Dict[str, Any]:
    """
    Get current timer status for a session
    
    Returns:
    - remaining_time: seconds remaining
    - total_time: total session time (600 seconds)
    - status: timer status (running, paused, expired)
    - color: timer color (green, yellow, red)
    - formatted_time: MM:SS format
    """
    try:
        response = sessions_table.get_item(
            Key={'session_id': session_id, 'user_id': user_id}
        )
        
        if 'Item' not in response:
            return error_response(404, "Session not found")
        
        session = response['Item']
        current_time = int(time.time())
        
        # Calculate remaining time
        expires_at = session.get('expires_at', current_time)
        remaining_time = max(0, expires_at - current_time)
        
        # Determine timer status
        if session['status'] != 'in_progress':
            timer_status = 'expired'
        elif remaining_time == 0:
            timer_status = 'expired'
        else:
            timer_status = 'running'
        
        # Determine color based on remaining time
        color = get_timer_color(remaining_time)
        
        # Format time as MM:SS
        formatted_time = format_time(remaining_time)
        
        # Check if warning should be shown
        show_warning = remaining_time <= RED_THRESHOLD
        
        return success_response({
            'session_id': session_id,
            'remaining_time': remaining_time,
            'total_time': TOTAL_SESSION_TIME,
            'status': timer_status,
            'color': color,
            'formatted_time': formatted_time,
            'show_warning': show_warning,
            'expires_at': expires_at,
            'current_time': current_time
        })
        
    except Exception as e:
        print(f"Error getting timer status: {str(e)}")
        return error_response(500, "Failed to get timer status")


def update_timer_status(session_id: str, user_id: str, current_time: int = None) -> Dict[str, Any]:
    """
    Update timer status (called every second from frontend)
    
    Returns updated timer information
    """
    try:
        if current_time is None:
            current_time = int(time.time())
        
        response = sessions_table.get_item(
            Key={'session_id': session_id, 'user_id': user_id}
        )
        
        if 'Item' not in response:
            return error_response(404, "Session not found")
        
        session = response['Item']
        
        # Check if session has expired
        expires_at = session.get('expires_at', current_time)
        remaining_time = max(0, expires_at - current_time)
        
        if remaining_time == 0 and session['status'] == 'in_progress':
            # Mark session as expired
            sessions_table.update_item(
                Key={'session_id': session_id, 'user_id': user_id},
                UpdateExpression='SET #status = :status, last_updated = :timestamp',
                ExpressionAttributeNames={'#status': 'status'},
                ExpressionAttributeValues={
                    ':status': 'expired',
                    ':timestamp': current_time
                }
            )
            
            return success_response({
                'session_id': session_id,
                'remaining_time': 0,
                'total_time': TOTAL_SESSION_TIME,
                'status': 'expired',
                'color': 'red',
                'formatted_time': '00:00',
                'show_warning': True,
                'should_auto_submit': True,
                'message': 'Time is up! Auto-submitting your practice set.'
            })
        
        # Get color and warning status
        color = get_timer_color(remaining_time)
        show_warning = remaining_time <= RED_THRESHOLD
        
        # Determine if warning message should be shown
        warning_message = None
        if remaining_time <= RED_THRESHOLD and remaining_time > 0:
            warning_message = f"Only {remaining_time} seconds remaining!"
        elif remaining_time <= YELLOW_THRESHOLD and remaining_time > RED_THRESHOLD:
            warning_message = f"5 minutes remaining"
        
        return success_response({
            'session_id': session_id,
            'remaining_time': remaining_time,
            'total_time': TOTAL_SESSION_TIME,
            'status': 'running' if remaining_time > 0 else 'expired',
            'color': color,
            'formatted_time': format_time(remaining_time),
            'show_warning': show_warning,
            'warning_message': warning_message,
            'should_auto_submit': remaining_time == 0,
            'expires_at': expires_at,
            'current_time': current_time
        })
        
    except Exception as e:
        print(f"Error updating timer status: {str(e)}")
        return error_response(500, "Failed to update timer status")


def check_session_timeout(session_id: str, user_id: str) -> Dict[str, Any]:
    """
    Check if session has timed out due to inactivity
    
    If user navigates away for >5 minutes, session expires
    """
    try:
        response = sessions_table.get_item(
            Key={'session_id': session_id, 'user_id': user_id}
        )
        
        if 'Item' not in response:
            return error_response(404, "Session not found")
        
        session = response['Item']
        current_time = int(time.time())
        
        # Check if session has expired
        expires_at = session.get('expires_at', current_time)
        remaining_time = max(0, expires_at - current_time)
        
        # Check for inactivity timeout
        last_updated = session.get('last_updated', session.get('created_at', current_time))
        inactivity_duration = current_time - last_updated
        
        is_inactive = inactivity_duration > INACTIVITY_TIMEOUT
        is_expired = remaining_time == 0
        
        if is_expired and session['status'] == 'in_progress':
            # Mark as expired
            sessions_table.update_item(
                Key={'session_id': session_id, 'user_id': user_id},
                UpdateExpression='SET #status = :status',
                ExpressionAttributeNames={'#status': 'status'},
                ExpressionAttributeValues={':status': 'expired'}
            )
        
        return success_response({
            'session_id': session_id,
            'remaining_time': remaining_time,
            'is_expired': is_expired,
            'is_inactive': is_inactive,
            'inactivity_duration': inactivity_duration,
            'status': session['status'],
            'message': 'Session Expired' if is_expired else ('Session Inactive' if is_inactive else 'Session Active')
        })
        
    except Exception as e:
        print(f"Error checking session timeout: {str(e)}")
        return error_response(500, "Failed to check session timeout")


def prepare_auto_submit(session_id: str, user_id: str) -> Dict[str, Any]:
    """
    Prepare session for auto-submission when timer reaches 0
    
    Marks session as ready for submission
    """
    try:
        response = sessions_table.get_item(
            Key={'session_id': session_id, 'user_id': user_id}
        )
        
        if 'Item' not in response:
            return error_response(404, "Session not found")
        
        session = response['Item']
        current_time = int(time.time())
        
        # Verify timer has reached 0
        expires_at = session.get('expires_at', current_time)
        remaining_time = max(0, expires_at - current_time)
        
        if remaining_time > 0:
            return error_response(400, "Timer has not reached 0 yet")
        
        # Mark session as ready for auto-submission
        sessions_table.update_item(
            Key={'session_id': session_id, 'user_id': user_id},
            UpdateExpression='SET #status = :status, auto_submitted = :auto_submitted, auto_submit_time = :timestamp',
            ExpressionAttributeNames={'#status': 'status'},
            ExpressionAttributeValues={
                ':status': 'auto_submitted',
                ':auto_submitted': True,
                ':timestamp': current_time
            }
        )
        
        return success_response({
            'session_id': session_id,
            'message': 'Session auto-submitted',
            'auto_submitted': True,
            'auto_submit_time': current_time,
            'user_answers': session.get('user_answers', {})
        })
        
    except Exception as e:
        print(f"Error preparing auto-submit: {str(e)}")
        return error_response(500, "Failed to prepare auto-submit")


def get_timer_color(remaining_time: int) -> str:
    """
    Determine timer color based on remaining time
    
    - Green: >5 minutes
    - Yellow: 5 minutes to 1 minute
    - Red: <1 minute
    """
    if remaining_time > YELLOW_THRESHOLD:
        return 'green'
    elif remaining_time > RED_THRESHOLD:
        return 'yellow'
    else:
        return 'red'


def format_time(seconds: int) -> str:
    """
    Format seconds as MM:SS
    
    Examples:
    - 600 -> "10:00"
    - 65 -> "01:05"
    - 5 -> "00:05"
    """
    minutes = seconds // 60
    secs = seconds % 60
    return f"{minutes:02d}:{secs:02d}"


def success_response(data: Dict[str, Any]) -> Dict[str, Any]:
    """Format successful response"""
    return {
        'statusCode': 200,
        'body': json.dumps(data),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }


def error_response(status_code: int, message: str) -> Dict[str, Any]:
    """Format error response"""
    return {
        'statusCode': status_code,
        'body': json.dumps({'error': message}),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }
