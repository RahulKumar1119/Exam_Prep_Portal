"""
Simplified Practice Set Generator Lambda Function

Returns practice questions from the question bank without session management.
"""

import json
import uuid
import random
from datetime import datetime
from typing import List, Dict, Any

import boto3

# AWS clients
dynamodb = boto3.resource('dynamodb')
questions_table = dynamodb.Table('jaiib-question-bank')

# Constants
QUESTIONS_PER_SET = 4


def success_response(data: Dict[str, Any]) -> Dict[str, Any]:
    """Return success response."""
    return {
        'statusCode': 200,
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


def get_questions_by_paper(paper_name: str, count: int) -> List[Dict[str, Any]]:
    """Get random questions from a specific paper."""
    try:
        # Query questions by paper using GSI
        response = questions_table.query(
            IndexName='paper-topic-index',
            KeyConditionExpression='paper_name = :paper',
            ExpressionAttributeValues={':paper': paper_name}
        )
        
        questions = response.get('Items', [])
        
        if len(questions) < count:
            return questions
        
        # Randomly select without replacement
        selected = random.sample(questions, count)
        return selected
        
    except Exception as e:
        print(f"Error getting questions: {str(e)}")
        return []


def handler(event, context):
    """Lambda handler for practice set generation."""
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
        
        # Merge body into event
        event.update(body)
        
        # Get parameters
        user_id = event.get('user_id')
        paper_name = event.get('paper_name')
        action = event.get('action', 'generate')
        
        if not user_id:
            return error_response(400, "user_id is required")
        
        if action == 'generate':
            if not paper_name:
                return error_response(400, "paper_name is required")
            
            # Validate paper name
            valid_papers = ['IE & IFS', 'PPB', 'AFB', 'RBWM']
            if paper_name not in valid_papers:
                return error_response(400, f"Invalid paper_name. Must be one of: {', '.join(valid_papers)}")
            
            # Get questions
            questions = get_questions_by_paper(paper_name, QUESTIONS_PER_SET)
            
            if not questions or len(questions) < QUESTIONS_PER_SET:
                return error_response(500, "Insufficient questions available in question bank")
            
            # Create session
            session_id = str(uuid.uuid4())
            
            # Format questions for response
            formatted_questions = []
            for q in questions:
                formatted_questions.append({
                    'question_id': q['question_id'],
                    'question_text': q['question_text'],
                    'options': q['options'],
                    'difficulty': q.get('difficulty', 'medium'),
                    'topic': q.get('topic', 'General')
                })
            
            return success_response({
                'session_id': session_id,
                'user_id': user_id,
                'paper_name': paper_name,
                'questions': formatted_questions,
                'total_questions': len(formatted_questions),
                'created_at': datetime.utcnow().isoformat()
            })
        
        elif action == 'submit':
            # Handle practice set submission
            session_id = event.get('session_id')
            answers = event.get('answers', {})
            
            if not session_id:
                return error_response(400, "session_id is required")
            
            if not answers:
                return error_response(400, "answers are required")
            
            # For now, return a simple result
            # In a real implementation, you would:
            # 1. Retrieve the session from DynamoDB
            # 2. Get the questions for that session
            # 3. Score the answers
            # 4. Store the results
            
            return success_response({
                'session_id': session_id,
                'user_id': user_id,
                'score': 0,
                'results': [],
                'time_taken': 0,
                'passed': False,
                'submitted_at': datetime.utcnow().isoformat()
            })
        
        else:
            return error_response(400, f"Unknown action: {action}")
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return error_response(500, "Internal server error")
