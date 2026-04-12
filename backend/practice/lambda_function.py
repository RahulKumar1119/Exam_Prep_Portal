"""
Practice Set Generator Lambda Function
Handles practice set generation and submission.
"""

import json
import uuid
import random
from datetime import datetime
from typing import List, Dict, Any

import boto3

# Constants
QUESTIONS_PER_SET = 100


def get_dynamodb_tables():
    """Get DynamoDB table references."""
    dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
    return dynamodb.Table('jaiib-question-bank'), dynamodb.Table('jaiib-practice-sessions')


def success_response(data: Dict[str, Any]) -> Dict[str, Any]:
    """Return success response."""
    return {
        'statusCode': 200,
        'body': json.dumps(data),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
        }
    }


def error_response(status_code: int, message: str) -> Dict[str, Any]:
    """Return error response."""
    return {
        'statusCode': status_code,
        'body': json.dumps({'error': message}),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
        }
    }


def get_questions_by_paper(questions_table, paper_name: str, count: int) -> List[Dict[str, Any]]:
    """Get random questions from a specific paper."""
    try:
        response = questions_table.query(
            IndexName='paper-topic-index',
            KeyConditionExpression='paper_name = :paper',
            ExpressionAttributeValues={':paper': paper_name}
        )
        
        questions = response.get('Items', [])
        
        if len(questions) < count:
            return questions
        
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
        
        # Parse body - it comes as a JSON string from API Gateway
        body_str = event.get('body', '{}')
        if isinstance(body_str, str):
            body = json.loads(body_str) if body_str else {}
        else:
            body = body_str if isinstance(body_str, dict) else {}
        
        # Extract parameters
        user_id = body.get('user_id')
        paper_name = body.get('paper_name')
        action = body.get('action', 'generate')
        session_id = body.get('session_id')
        answers = body.get('answers', {})
        
        if not user_id:
            return error_response(400, "user_id is required")
        
        # Get DynamoDB tables
        questions_table, sessions_table = get_dynamodb_tables()
        
        if action == 'generate':
            if not paper_name:
                return error_response(400, "paper_name is required")
            
            valid_papers = ['IE & IFS', 'PPB', 'AFB', 'RBWM']
            if paper_name not in valid_papers:
                return error_response(400, f"Invalid paper_name. Must be one of: {', '.join(valid_papers)}")
            
            questions = get_questions_by_paper(questions_table, paper_name, QUESTIONS_PER_SET)
            
            if not questions or len(questions) < QUESTIONS_PER_SET:
                return error_response(500, "Insufficient questions available in question bank")
            
            session_id = str(uuid.uuid4())
            
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
            
            try:
                sessions_table.put_item(
                    Item={
                        'session_id': session_id,
                        'user_id': user_id,
                        'paper_name': paper_name,
                        'questions': formatted_questions,
                        'created_at': datetime.utcnow().isoformat(),
                        'ttl': int(datetime.utcnow().timestamp()) + 86400
                    }
                )
            except Exception as e:
                print(f"Error storing session: {str(e)}")
            
            return success_response({
                'session_id': session_id,
                'user_id': user_id,
                'paper_name': paper_name,
                'questions': formatted_questions,
                'total_questions': len(formatted_questions),
                'created_at': datetime.utcnow().isoformat()
            })
        
        elif action == 'submit':
            if not session_id:
                return error_response(400, "session_id is required")
            
            if not answers:
                return error_response(400, "answers are required")
            
            try:
                response = sessions_table.get_item(Key={'session_id': session_id})
                session = response.get('Item')
                
                if not session:
                    return error_response(404, "Session not found")
                
                questions = session.get('questions', [])
                
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
                        'question_text': question.get('question_text', ''),
                        'options': question.get('options', {}),
                        'correct': is_correct,
                        'user_answer': user_answer or '',
                        'correct_answer': correct_answer
                    })
                
                total_questions = len(questions)
                score = int((correct_count / total_questions * 100)) if total_questions > 0 else 0
                passed = score >= 60
                submitted_at = datetime.utcnow().isoformat()

                # Calculate time taken in seconds from session start
                try:
                    created_at_str = session.get('created_at', submitted_at)
                    created_dt = datetime.fromisoformat(created_at_str)
                    submitted_dt = datetime.fromisoformat(submitted_at)
                    time_taken = int((submitted_dt - created_dt).total_seconds())
                except Exception:
                    time_taken = 0

                # Save score, status and time back to the session record
                try:
                    sessions_table.update_item(
                        Key={'session_id': session_id},
                        UpdateExpression='SET #s = :status, score = :score, passed = :passed, submitted_at = :submitted_at, time_taken = :time_taken',
                        ExpressionAttributeNames={'#s': 'status'},
                        ExpressionAttributeValues={
                            ':status': 'completed',
                            ':score': score,
                            ':passed': passed,
                            ':submitted_at': submitted_at,
                            ':time_taken': time_taken,
                        }
                    )
                except Exception as update_err:
                    print(f"Warning: failed to update session record: {update_err}")

                return success_response({
                    'session_id': session_id,
                    'user_id': user_id,
                    'score': score,
                    'results': results,
                    'time_taken': time_taken,
                    'passed': passed,
                    'submitted_at': submitted_at
                })
                
            except Exception as e:
                print(f"Error processing submission: {str(e)}")
                return error_response(500, f"Error processing submission: {str(e)}")
        
        else:
            return error_response(400, f"Unknown action: {action}")
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return error_response(500, "Internal server error")
