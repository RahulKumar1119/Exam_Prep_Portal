"""
Practice Session Manager Lambda Function

Implements session management:
- Session state management (in_progress, completed, expired)
- Incomplete session saving
- Session retrieval and resumption
- Session expiration handling
"""

import json
import uuid
import time
from typing import Dict, Any, Optional
import boto3

# AWS clients
dynamodb = boto3.resource('dynamodb')
sessions_table = dynamodb.Table('PracticeSessions')
questions_table = dynamodb.Table('QuestionBank')

# Constants
SESSION_TIMEOUT = 600  # 10 minutes in seconds
INACTIVE_TIMEOUT = 300  # 5 minutes for inactivity


def handler(event, context):
    """
    Main Lambda handler for session management
    
    Event structure:
    {
        "action": "retrieve" | "update_answers" | "check_expiry" | "resume",
        "session_id": "uuid",
        "user_id": "uuid",
        "user_answers": {...} (optional, for update_answers)
    }
    """
    try:
        action = event.get('action', 'retrieve')
        session_id = event.get('session_id')
        user_id = event.get('user_id')
        
        if not session_id or not user_id:
            return error_response(400, "session_id and user_id are required")
        
        if action == 'retrieve':
            return retrieve_session(session_id, user_id)
        elif action == 'update_answers':
            return update_session_answers(session_id, user_id, event.get('user_answers', {}))
        elif action == 'check_expiry':
            return check_session_expiry(session_id, user_id)
        elif action == 'resume':
            return resume_session(session_id, user_id)
        else:
            return error_response(400, f"Unknown action: {action}")
            
    except Exception as e:
        print(f"Error in handler: {str(e)}")
        return error_response(500, "Internal server error")


def retrieve_session(session_id: str, user_id: str) -> Dict[str, Any]:
    """
    Retrieve a practice session with all questions and current state
    """
    try:
        response = sessions_table.get_item(
            Key={'session_id': session_id, 'user_id': user_id}
        )
        
        if 'Item' not in response:
            return error_response(404, "Session not found")
        
        session = response['Item']
        
        # Check if session has expired
        current_time = int(time.time())
        if session['status'] == 'in_progress' and current_time > session.get('expires_at', current_time):
            # Mark as expired
            sessions_table.update_item(
                Key={'session_id': session_id, 'user_id': user_id},
                UpdateExpression='SET #status = :status',
                ExpressionAttributeNames={'#status': 'status'},
                ExpressionAttributeValues={':status': 'expired'}
            )
            return error_response(410, "Session has expired")
        
        # Get questions
        questions = get_questions_by_ids(session['question_ids'])
        
        # Format response
        formatted_questions = [
            {
                'question_id': q['question_id'],
                'text': q['question_text'],
                'options': q['options'],
                'topic': q.get('topic', 'General'),
                'difficulty': q.get('difficulty', 'medium')
            }
            for q in questions
        ]
        
        # Calculate remaining time
        remaining_time = max(0, session.get('expires_at', current_time) - current_time)
        
        return success_response({
            'session_id': session_id,
            'questions': formatted_questions,
            'user_answers': session.get('user_answers', {}),
            'status': session['status'],
            'paper_name': session['paper_name'],
            'created_at': session['created_at'],
            'expires_at': session['expires_at'],
            'remaining_time': remaining_time,
            'question_count': len(formatted_questions)
        })
        
    except Exception as e:
        print(f"Error retrieving session: {str(e)}")
        return error_response(500, "Failed to retrieve session")


def update_session_answers(session_id: str, user_id: str, user_answers: Dict[str, str]) -> Dict[str, Any]:
    """
    Update user's answers for a session
    
    Saves answers without submitting the session
    """
    try:
        # Verify session exists and is in progress
        response = sessions_table.get_item(
            Key={'session_id': session_id, 'user_id': user_id}
        )
        
        if 'Item' not in response:
            return error_response(404, "Session not found")
        
        session = response['Item']
        
        if session['status'] != 'in_progress':
            return error_response(400, f"Cannot update answers for session with status: {session['status']}")
        
        # Check if session has expired
        current_time = int(time.time())
        if current_time > session.get('expires_at', current_time):
            sessions_table.update_item(
                Key={'session_id': session_id, 'user_id': user_id},
                UpdateExpression='SET #status = :status',
                ExpressionAttributeNames={'#status': 'status'},
                ExpressionAttributeValues={':status': 'expired'}
            )
            return error_response(410, "Session has expired")
        
        # Update answers
        sessions_table.update_item(
            Key={'session_id': session_id, 'user_id': user_id},
            UpdateExpression='SET user_answers = :answers, last_updated = :timestamp',
            ExpressionAttributeValues={
                ':answers': user_answers,
                ':timestamp': current_time
            }
        )
        
        return success_response({
            'message': 'Answers updated',
            'session_id': session_id,
            'answers_count': len(user_answers)
        })
        
    except Exception as e:
        print(f"Error updating session answers: {str(e)}")
        return error_response(500, "Failed to update session answers")


def check_session_expiry(session_id: str, user_id: str) -> Dict[str, Any]:
    """
    Check if a session has expired
    
    Returns remaining time and expiry status
    """
    try:
        response = sessions_table.get_item(
            Key={'session_id': session_id, 'user_id': user_id}
        )
        
        if 'Item' not in response:
            return error_response(404, "Session not found")
        
        session = response['Item']
        current_time = int(time.time())
        
        # Check expiry
        expires_at = session.get('expires_at', current_time)
        remaining_time = max(0, expires_at - current_time)
        is_expired = current_time > expires_at
        
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
            'status': session['status'],
            'remaining_time': remaining_time,
            'is_expired': is_expired,
            'expires_at': expires_at
        })
        
    except Exception as e:
        print(f"Error checking session expiry: {str(e)}")
        return error_response(500, "Failed to check session expiry")


def resume_session(session_id: str, user_id: str) -> Dict[str, Any]:
    """
    Resume an incomplete session
    
    Extends the session timeout and returns session data
    """
    try:
        response = sessions_table.get_item(
            Key={'session_id': session_id, 'user_id': user_id}
        )
        
        if 'Item' not in response:
            return error_response(404, "Session not found")
        
        session = response['Item']
        
        # Check if session can be resumed
        if session['status'] not in ['incomplete', 'in_progress']:
            return error_response(400, f"Cannot resume session with status: {session['status']}")
        
        # Extend session timeout
        current_time = int(time.time())
        new_expires_at = current_time + SESSION_TIMEOUT
        
        sessions_table.update_item(
            Key={'session_id': session_id, 'user_id': user_id},
            UpdateExpression='SET #status = :status, expires_at = :expires_at',
            ExpressionAttributeNames={'#status': 'status'},
            ExpressionAttributeValues={
                ':status': 'in_progress',
                ':expires_at': new_expires_at
            }
        )
        
        # Get questions
        questions = get_questions_by_ids(session['question_ids'])
        
        # Format response
        formatted_questions = [
            {
                'question_id': q['question_id'],
                'text': q['question_text'],
                'options': q['options'],
                'topic': q.get('topic', 'General'),
                'difficulty': q.get('difficulty', 'medium')
            }
            for q in questions
        ]
        
        return success_response({
            'session_id': session_id,
            'questions': formatted_questions,
            'user_answers': session.get('user_answers', {}),
            'status': 'in_progress',
            'paper_name': session['paper_name'],
            'created_at': session['created_at'],
            'expires_at': new_expires_at,
            'remaining_time': SESSION_TIMEOUT,
            'message': 'Session resumed'
        })
        
    except Exception as e:
        print(f"Error resuming session: {str(e)}")
        return error_response(500, "Failed to resume session")


def get_questions_by_ids(question_ids: list) -> list:
    """Retrieve questions by their IDs"""
    try:
        questions = []
        for question_id in question_ids:
            # Query by question_id (assuming GSI exists)
            response = questions_table.query(
                IndexName='question_id-index',
                KeyConditionExpression='question_id = :id',
                ExpressionAttributeValues={':id': question_id},
                Limit=1
            )
            
            if response.get('Items'):
                questions.append(response['Items'][0])
        
        return questions
        
    except Exception as e:
        print(f"Error retrieving questions: {str(e)}")
        return []


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
