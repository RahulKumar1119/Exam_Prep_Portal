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
sessions_table = dynamodb.Table('jaiib-practice-sessions')

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
                    'topic': q.get('topic', 'General'),
                    'correct_answer': q.get('correct_answer')
                })
            
            # Store session in DynamoDB
            try:
                sessions_table.put_item(
                    Item={
                        'session_id': session_id,
                        'user_id': user_id,
                        'paper_name': paper_name,
                        'questions': formatted_questions,
                        'created_at': datetime.utcnow().isoformat(),
                        'ttl': int(datetime.utcnow().timestamp()) + 86400  # 24 hour TTL
                    }
                )
            except Exception as e:
                print(f"Error storing session: {str(e)}")
                # Continue anyway, session won't be stored but practice can still work
            
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
            
            # Retrieve session from DynamoDB
            try:
                response = sessions_table.get_item(Key={'session_id': session_id})
                session = response.get('Item')
                
                if not session:
                    return error_response(404, "Session not found")
                
                questions = session.get('questions', [])
                
                # Score the answers
                results = []
                correct_count = 0
                
                for question in questions:
                    question_id = question['question_id']
                    user_answer = answers.get(question_id)
                    correct_answer = question.get('correct_answer')
                    
                    is_correct = user_answer == correct_answer
                    if is_correct:
                        correct_count += 1
                    
                    results.append({
                        'question_id': question_id,
                        'correct': is_correct,
                        'user_answer': user_answer or '',
                        'correct_answer': correct_answer
                    })
                
                # Calculate score (percentage)
                total_questions = len(questions)
                score = int((correct_count / total_questions * 100)) if total_questions > 0 else 0
                passed = score >= 60  # 60% pass threshold
                
                return success_response({
                    'session_id': session_id,
                    'user_id': user_id,
                    'score': score,
                    'results': results,
                    'time_taken': 0,
                    'passed': passed,
                    'submitted_at': datetime.utcnow().isoformat()
                })
                
            except Exception as e:
                print(f"Error processing submission: {str(e)}")
                return error_response(500, f"Error processing submission: {str(e)}")
        
        else:
            return error_response(400, f"Unknown action: {action}")
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return error_response(500, "Internal server error")
