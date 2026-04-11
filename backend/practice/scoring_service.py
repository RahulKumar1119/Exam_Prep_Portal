"""
MCQ Scoring Engine Lambda Function

Implements scoring functionality:
- Score calculation: (correct_answers / 4) × 100
- Score storage with session ID, timestamp, paper name, time taken
- Topic-wise accuracy breakdown calculation
- Score retrieval for results display
- Results formatting with correct/incorrect indicators
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
sessions_table = dynamodb.Table('PracticeSessions')
scores_table = dynamodb.Table('Scores')
questions_table = dynamodb.Table('QuestionBank')

# Constants
QUESTIONS_PER_SET = 4
PASS_THRESHOLD = 75  # 75% to pass


def handler(event, context):
    """
    Main Lambda handler for scoring operations
    
    Event structure:
    {
        "action": "submit" | "get_results",
        "session_id": "uuid",
        "user_id": "uuid",
        "answers": {...} (optional, for submit action)
    }
    """
    try:
        action = event.get('action', 'submit')
        session_id = event.get('session_id')
        user_id = event.get('user_id')
        
        if not session_id or not user_id:
            return error_response(400, "session_id and user_id are required")
        
        if action == 'submit':
            return submit_practice_set(event)
        elif action == 'get_results':
            return get_results(session_id, user_id)
        else:
            return error_response(400, f"Unknown action: {action}")
            
    except Exception as e:
        print(f"Error in handler: {str(e)}")
        return error_response(500, "Internal server error")


def submit_practice_set(event: Dict[str, Any]) -> Dict[str, Any]:
    """
    Submit a practice set and calculate score
    
    Calculates:
    - Score: (correct_answers / 4) × 100
    - Results with correct/incorrect indicators
    - Topic-wise accuracy breakdown
    - Pass/fail status
    """
    session_id = event.get('session_id')
    user_id = event.get('user_id')
    user_answers = event.get('answers', {})
    
    if not session_id or not user_id:
        return error_response(400, "session_id and user_id are required")
    
    try:
        # Get session
        session_response = sessions_table.get_item(
            Key={'session_id': session_id, 'user_id': user_id}
        )
        
        if 'Item' not in session_response:
            return error_response(404, "Session not found")
        
        session = session_response['Item']
        
        # Get questions
        question_ids = session.get('question_ids', [])
        questions = get_questions_by_ids(question_ids)
        
        if not questions:
            return error_response(404, "Questions not found")
        
        # Calculate score and results
        correct_count = 0
        results = []
        topic_accuracy = {}
        
        for question in questions:
            question_id = question['question_id']
            user_answer = user_answers.get(question_id)
            correct_answer = question.get('correct_answer')
            topic = question.get('topic', 'General')
            
            is_correct = user_answer == correct_answer
            if is_correct:
                correct_count += 1
            
            # Track topic accuracy
            if topic not in topic_accuracy:
                topic_accuracy[topic] = {'correct': 0, 'total': 0}
            topic_accuracy[topic]['total'] += 1
            if is_correct:
                topic_accuracy[topic]['correct'] += 1
            
            results.append({
                'question_id': question_id,
                'correct': is_correct,
                'user_answer': user_answer,
                'correct_answer': correct_answer,
                'topic': topic
            })
        
        # Calculate score
        score = (correct_count / len(questions)) * 100
        
        # Calculate topic-wise accuracy percentages
        topic_breakdown = {}
        for topic, data in topic_accuracy.items():
            if data['total'] > 0:
                topic_breakdown[topic] = (data['correct'] / data['total']) * 100
        
        # Calculate time taken
        time_taken = int(time.time()) - session.get('created_at', int(time.time()))
        
        # Store score
        submitted_at = int(time.time())
        scores_table.put_item(
            Item={
                'user_id': user_id,
                'submitted_at': submitted_at,
                'session_id': session_id,
                'paper_name': session.get('paper_name', 'Unknown'),
                'score': Decimal(str(round(score, 2))),
                'questions_correct': correct_count,
                'time_taken': time_taken,
                'topic_breakdown': topic_breakdown,
                'created_at': submitted_at
            }
        )
        
        # Update session status
        sessions_table.update_item(
            Key={'session_id': session_id, 'user_id': user_id},
            UpdateExpression='SET #status = :status, submitted_at = :submitted_at, score = :score',
            ExpressionAttributeNames={
                '#status': 'status'
            },
            ExpressionAttributeValues={
                ':status': 'completed',
                ':submitted_at': submitted_at,
                ':score': Decimal(str(round(score, 2)))
            }
        )
        
        # Determine pass/fail
        passed = score >= PASS_THRESHOLD
        
        return success_response({
            'score': round(score, 2),
            'passed': passed,
            'questions_correct': correct_count,
            'total_questions': len(questions),
            'time_taken': time_taken,
            'results': results,
            'topic_breakdown': {k: round(v, 2) for k, v in topic_breakdown.items()}
        })
        
    except Exception as e:
        print(f"Error submitting practice set: {str(e)}")
        return error_response(500, f"Error submitting practice set: {str(e)}")


def get_results(session_id: str, user_id: str) -> Dict[str, Any]:
    """
    Retrieve results for a submitted practice set
    
    Returns:
    - Score as percentage (0-100%)
    - Correct/incorrect indicators for each question
    - User's selected answer and correct answer for each question
    - Pass/fail badge status
    """
    try:
        # Get session
        session_response = sessions_table.get_item(
            Key={'session_id': session_id, 'user_id': user_id}
        )
        
        if 'Item' not in session_response:
            return error_response(404, "Session not found")
        
        session = session_response['Item']
        
        if session.get('status') != 'completed':
            return error_response(400, "Session not completed yet")
        
        # Get score
        score_response = scores_table.get_item(
            Key={'user_id': user_id, 'submitted_at': session.get('submitted_at')}
        )
        
        if 'Item' not in score_response:
            return error_response(404, "Score not found")
        
        score_data = score_response['Item']
        
        # Get questions
        question_ids = session.get('question_ids', [])
        questions = get_questions_by_ids(question_ids)
        
        # Build results with question details
        results = []
        user_answers = session.get('user_answers', {})
        
        for question in questions:
            question_id = question['question_id']
            user_answer = user_answers.get(question_id)
            correct_answer = question.get('correct_answer')
            
            is_correct = user_answer == correct_answer
            
            results.append({
                'question_id': question_id,
                'question_text': question.get('question_text'),
                'options': question.get('options', []),
                'correct': is_correct,
                'user_answer': user_answer,
                'correct_answer': correct_answer,
                'topic': question.get('topic', 'General'),
                'difficulty': question.get('difficulty', 'medium')
            })
        
        score = float(score_data.get('score', 0))
        passed = score >= PASS_THRESHOLD
        
        return success_response({
            'session_id': session_id,
            'score': score,
            'passed': passed,
            'badge': 'Passed' if passed else 'Review Needed',
            'badge_color': 'green' if passed else 'orange',
            'questions_correct': int(score_data.get('questions_correct', 0)),
            'total_questions': len(results),
            'time_taken': int(score_data.get('time_taken', 0)),
            'paper_name': score_data.get('paper_name', 'Unknown'),
            'submitted_at': int(score_data.get('submitted_at', 0)),
            'results': results,
            'topic_breakdown': {k: round(float(v), 2) for k, v in score_data.get('topic_breakdown', {}).items()}
        })
        
    except Exception as e:
        print(f"Error retrieving results: {str(e)}")
        return error_response(500, f"Error retrieving results: {str(e)}")


def get_questions_by_ids(question_ids: List[str]) -> List[Dict[str, Any]]:
    """
    Retrieve questions by their IDs from the question bank
    """
    if not question_ids:
        return []
    
    try:
        questions = []
        for question_id in question_ids:
            # Query the question bank for the current version
            response = questions_table.query(
                KeyConditionExpression='question_id = :qid',
                ExpressionAttributeValues={':qid': question_id},
                ScanIndexForward=False,  # Get latest version first
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
        'body': json.dumps(data, default=str),
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
