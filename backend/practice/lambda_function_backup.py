"""
Practice Set Generator Lambda Function

Implements adaptive practice set generation with:
- Random selection for users with <10 completed sets
- Adaptive selection weighted toward weak areas for experienced users
- Unique question selection within sessions
- Session management and state tracking
"""

import json
import uuid
import time
from datetime import datetime
from typing import List, Dict, Any, Optional
import boto3
from decimal import Decimal

# AWS clients
dynamodb = boto3.resource('dynamodb')
users_table = dynamodb.Table('Users')
sessions_table = dynamodb.Table('PracticeSessions')
scores_table = dynamodb.Table('Scores')
questions_table = dynamodb.Table('jaiib-question-bank')

# Constants
QUESTIONS_PER_SET = 4
SESSION_TIMEOUT = 600  # 10 minutes in seconds
WEAK_AREA_THRESHOLD = 0.70  # <70% accuracy = weak area
ADAPTIVE_SELECTION_THRESHOLD = 10  # Use adaptive selection after 10 sessions


def handler(event, context):
    """
    Main Lambda handler for practice set generation
    
    Event structure:
    {
        "action": "generate" | "get_session" | "save_incomplete",
        "user_id": "uuid",
        "paper_name": "IE & IFS" | "PPB" | "AFB" | "RBWM",
        "session_id": "uuid" (optional, for get_session)
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
        
        action = body.get('action', 'generate')
        user_id = body.get('user_id')
        
        if not user_id:
            return error_response(400, "user_id is required")
        
        # Merge body into event for downstream functions
        event.update(body)
        
        if action == 'generate':
            return generate_practice_set(event)
        elif action == 'get_session':
            return get_session(event)
        elif action == 'save_incomplete':
            return save_incomplete_session(event)
        else:
            return error_response(400, f"Unknown action: {action}")
            
    except Exception as e:
        print(f"Error in handler: {str(e)}")
        return error_response(500, "Internal server error")


def generate_practice_set(event: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate a new practice set for the user
    
    Implements adaptive selection:
    - Random selection for users with <10 completed sets
    - Weighted selection toward weak areas for experienced users
    """
    user_id = event.get('user_id')
    
    if not user_id:
        return error_response(400, "user_id is required")
    
    paper_name = event.get('paper_name')
    
    if not paper_name:
        return error_response(400, "paper_name is required")
    
    # Validate paper name
    valid_papers = ['IE & IFS', 'PPB', 'AFB', 'RBWM']
    if paper_name not in valid_papers:
        return error_response(400, f"Invalid paper_name. Must be one of: {', '.join(valid_papers)}")
    
    try:
        # Save any incomplete session
        save_incomplete_session_for_user(user_id)
        
        # Get user's performance history
        user_performance = get_user_performance(user_id)
        completed_sessions = user_performance['completed_sessions']
        
        # Select questions based on experience level
        if len(completed_sessions) < ADAPTIVE_SELECTION_THRESHOLD:
            # Random selection for new users
            questions = select_random_questions(paper_name, QUESTIONS_PER_SET)
        else:
            # Adaptive selection for experienced users
            weak_areas = identify_weak_areas(user_performance)
            questions = select_adaptive_questions(paper_name, weak_areas, QUESTIONS_PER_SET)
        
        if not questions or len(questions) < QUESTIONS_PER_SET:
            return error_response(500, "Insufficient questions available in question bank")
        
        # Create session
        session_id = str(uuid.uuid4())
        question_ids = [q['question_id'] for q in questions]
        
        session_data = {
            'session_id': session_id,
            'user_id': user_id,
            'paper_name': paper_name,
            'question_ids': question_ids,
            'user_answers': {},
            'status': 'in_progress',
            'created_at': int(time.time()),
            'expires_at': int(time.time()) + SESSION_TIMEOUT,
            'version': get_current_question_bank_version()
        }
        
        # Store session
        sessions_table.put_item(Item=session_data)
        
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
            'timer_duration': SESSION_TIMEOUT,
            'paper_name': paper_name,
            'question_count': len(formatted_questions)
        })
        
    except Exception as e:
        print(f"Error generating practice set: {str(e)}")
        return error_response(500, "Failed to generate practice set")


def get_session(event: Dict[str, Any]) -> Dict[str, Any]:
    """Retrieve an existing practice session"""
    session_id = event.get('session_id')
    user_id = event.get('user_id')
    
    if not session_id or not user_id:
        return error_response(400, "session_id and user_id are required")
    
    try:
        response = sessions_table.get_item(
            Key={'session_id': session_id, 'user_id': user_id}
        )
        
        if 'Item' not in response:
            return error_response(404, "Session not found")
        
        session = response['Item']
        
        # Check if session has expired (only if expires_at is in the past)
        current_time = int(time.time())
        if session['status'] == 'in_progress' and current_time > session.get('expires_at', current_time):
            session['status'] = 'expired'
            sessions_table.update_item(
                Key={'session_id': session_id, 'user_id': user_id},
                UpdateExpression='SET #status = :status',
                ExpressionAttributeNames={'#status': 'status'},
                ExpressionAttributeValues={':status': 'expired'}
            )
            return error_response(410, "Session has expired")
        
        # Get questions
        questions = get_questions_by_ids(session['question_ids'])
        
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
            'status': session['status'],
            'paper_name': session['paper_name'],
            'created_at': session['created_at'],
            'expires_at': session['expires_at']
        })
        
    except Exception as e:
        print(f"Error retrieving session: {str(e)}")
        return error_response(500, "Failed to retrieve session")


def save_incomplete_session(event: Dict[str, Any]) -> Dict[str, Any]:
    """Save incomplete session before generating new one"""
    session_id = event.get('session_id')
    user_id = event.get('user_id')
    user_answers = event.get('user_answers', {})
    
    if not session_id or not user_id:
        return error_response(400, "session_id and user_id are required")
    
    try:
        sessions_table.update_item(
            Key={'session_id': session_id, 'user_id': user_id},
            UpdateExpression='SET #status = :status, user_answers = :answers',
            ExpressionAttributeNames={'#status': 'status'},
            ExpressionAttributeValues={
                ':status': 'incomplete',
                ':answers': user_answers
            }
        )
        
        return success_response({'message': 'Session saved'})
        
    except Exception as e:
        print(f"Error saving incomplete session: {str(e)}")
        return error_response(500, "Failed to save session")


def select_random_questions(paper_name: str, count: int) -> List[Dict[str, Any]]:
    """
    Select random questions from the question bank
    Used for users with <10 completed sets
    """
    try:
        # Query questions by paper using GSI
        # When querying a GSI, we only need the GSI keys, not the table keys
        response = questions_table.query(
            IndexName='paper-topic-index',
            KeyConditionExpression='paper_name = :paper',
            ExpressionAttributeValues={':paper': paper_name}
        )
        
        questions = response.get('Items', [])
        
        if len(questions) < count:
            return questions
        
        # Randomly select without replacement
        import random
        selected = random.sample(questions, count)
        
        return selected
        
    except Exception as e:
        print(f"Error selecting random questions: {str(e)}")
        return []


def select_adaptive_questions(paper_name: str, weak_areas: List[str], count: int) -> List[Dict[str, Any]]:
    """
    Select questions weighted toward weak areas
    Used for users with 10+ completed sets
    
    Weak areas are topics with <70% accuracy
    """
    try:
        # Query questions by paper
        response = questions_table.query(
            KeyConditionExpression='paper_name = :paper',
            ExpressionAttributeValues={':paper': paper_name},
            Limit=100
        )
        
        questions = response.get('Items', [])
        
        if len(questions) < count:
            return questions
        
        # Separate questions into weak area and other
        weak_area_questions = [q for q in questions if q.get('topic') in weak_areas]
        other_questions = [q for q in questions if q.get('topic') not in weak_areas]
        
        # Weight selection: 70% from weak areas, 30% from others
        import random
        weak_count = min(int(count * 0.7), len(weak_area_questions))
        other_count = count - weak_count
        
        selected = []
        if weak_area_questions:
            selected.extend(random.sample(weak_area_questions, weak_count))
        if other_questions and other_count > 0:
            selected.extend(random.sample(other_questions, min(other_count, len(other_questions))))
        
        # If we don't have enough, fill with random questions
        if len(selected) < count:
            remaining = count - len(selected)
            available = [q for q in questions if q not in selected]
            if available:
                selected.extend(random.sample(available, min(remaining, len(available))))
        
        return selected[:count]
        
    except Exception as e:
        print(f"Error selecting adaptive questions: {str(e)}")
        return []


def get_user_performance(user_id: str) -> Dict[str, Any]:
    """Get user's performance history for adaptive selection"""
    try:
        # Query completed sessions
        response = scores_table.query(
            KeyConditionExpression='user_id = :user_id',
            ExpressionAttributeValues={':user_id': user_id}
        )
        
        completed_sessions = response.get('Items', [])
        
        # Calculate topic-wise accuracy
        topic_accuracy = {}
        for session in completed_sessions:
            topic = session.get('topic', 'General')
            if topic not in topic_accuracy:
                topic_accuracy[topic] = {'correct': 0, 'total': 0}
            
            # Estimate accuracy from score (this is simplified)
            score = float(session.get('score', 0))
            accuracy = score / 100.0
            topic_accuracy[topic]['correct'] += accuracy
            topic_accuracy[topic]['total'] += 1
        
        # Calculate percentages
        for topic in topic_accuracy:
            if topic_accuracy[topic]['total'] > 0:
                topic_accuracy[topic]['percentage'] = (
                    topic_accuracy[topic]['correct'] / topic_accuracy[topic]['total']
                )
        
        return {
            'completed_sessions': completed_sessions,
            'topic_accuracy': topic_accuracy
        }
        
    except Exception as e:
        print(f"Error getting user performance: {str(e)}")
        return {'completed_sessions': [], 'topic_accuracy': {}}


def identify_weak_areas(user_performance: Dict[str, Any]) -> List[str]:
    """Identify topics where user has <70% accuracy"""
    weak_areas = []
    topic_accuracy = user_performance.get('topic_accuracy', {})
    
    for topic, data in topic_accuracy.items():
        if data.get('percentage', 1.0) < WEAK_AREA_THRESHOLD:
            weak_areas.append(topic)
    
    return weak_areas


def get_questions_by_ids(question_ids: List[str]) -> List[Dict[str, Any]]:
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


def save_incomplete_session_for_user(user_id: str) -> None:
    """Save any incomplete session before generating new one"""
    try:
        # Query for incomplete sessions
        response = sessions_table.query(
            IndexName='user_id-index',
            KeyConditionExpression='user_id = :user_id AND #status = :status',
            ExpressionAttributeNames={'#status': 'status'},
            ExpressionAttributeValues={
                ':user_id': user_id,
                ':status': 'in_progress'
            }
        )
        
        for session in response.get('Items', []):
            sessions_table.update_item(
                Key={'session_id': session['session_id'], 'user_id': user_id},
                UpdateExpression='SET #status = :status',
                ExpressionAttributeNames={'#status': 'status'},
                ExpressionAttributeValues={':status': 'incomplete'}
            )
    except Exception as e:
        print(f"Error saving incomplete session: {str(e)}")


def get_current_question_bank_version() -> str:
    """Get the current question bank version"""
    # This would typically query a version table
    # For now, return a default version
    return "v1.0"


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
