"""
AI Tutor Lambda Function
Handles AI explanation requests via AWS Bedrock Claude 4.5 Haiku
"""

import json
import uuid
import logging
from datetime import datetime
import boto3

from explanation_service import (
    ExplanationGenerator,
    ExplanationStorage,
    get_user_performance_context
)

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# AWS Clients
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
cloudwatch = boto3.client('cloudwatch', region_name='us-east-1')

# DynamoDB Tables
questions_table = dynamodb.Table('Question_Bank')
audit_logs_table = dynamodb.Table('Audit_Logs')


def get_question(question_id: str) -> dict:
    """Get question from DynamoDB"""
    try:
        response = questions_table.get_item(Key={'question_id': question_id})
        return response.get('Item')
    except Exception as e:
        logger.error(f"Error getting question: {str(e)}")
        return None


def log_audit_event(user_id: str, action: str, question_id: str, result: str, details: dict = None):
    """Log audit event for AI explanation request"""
    try:
        audit_logs_table.put_item(
            Item={
                'log_id': str(uuid.uuid4()),
                'timestamp': datetime.utcnow().isoformat(),
                'user_id': user_id,
                'action_type': action,
                'resource_id': question_id,
                'resource_type': 'question',
                'result': result,
                'details': details or {}
            }
        )
    except Exception as e:
        logger.error(f"Error logging audit event: {str(e)}")


def publish_metric(metric_name: str, value: float, unit: str = 'Count'):
    """Publish metric to CloudWatch"""
    try:
        cloudwatch.put_metric_data(
            Namespace='JAIIB-ExamPrep/AI-Tutor',
            MetricData=[
                {
                    'MetricName': metric_name,
                    'Value': value,
                    'Unit': unit,
                    'Timestamp': datetime.utcnow()
                }
            ]
        )
    except Exception as e:
        logger.error(f"Error publishing metric: {str(e)}")


def validate_request(event: dict) -> tuple:
    """
    Validate request parameters
    
    Returns:
        Tuple of (is_valid, error_message)
    """
    body = event.get('body', {})
    if isinstance(body, str):
        try:
            body = json.loads(body)
        except:
            return False, "Invalid JSON in request body"
    
    question_id = body.get('question_id')
    user_id = body.get('user_id')
    
    if not question_id:
        return False, "question_id is required"
    
    if not user_id:
        return False, "user_id is required"
    
    return True, ""


def error_response(status_code: int, message: str) -> dict:
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


def success_response(data: dict) -> dict:
    """Format success response"""
    return {
        'statusCode': 200,
        'body': json.dumps(data),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }


def lambda_handler(event, context):
    """
    Main Lambda handler for AI explanation requests
    
    Event format:
    {
        "body": {
            "question_id": "q123",
            "user_id": "u456"
        }
    }
    """
    try:
        logger.info(f"Received event: {json.dumps(event)}")
        
        # Validate request
        is_valid, error_msg = validate_request(event)
        if not is_valid:
            logger.warning(f"Invalid request: {error_msg}")
            return error_response(400, error_msg)
        
        # Parse request
        body = event.get('body', {})
        if isinstance(body, str):
            body = json.loads(body)
        
        question_id = body.get('question_id')
        user_id = body.get('user_id')
        
        logger.info(f"Processing explanation request for question {question_id} by user {user_id}")
        
        # Get question
        question = get_question(question_id)
        if not question:
            logger.error(f"Question not found: {question_id}")
            log_audit_event(user_id, 'ai_explanation_request', question_id, 'failure', 
                          {'error': 'Question not found'})
            return error_response(404, "Question not found")
        
        # Get user performance context
        topic = question.get('topic', 'General')
        user_context = get_user_performance_context(user_id, topic)
        
        logger.info(f"User context: {user_context}")
        
        # Generate explanation
        logger.info("Generating explanation with Bedrock...")
        result = ExplanationGenerator.generate_explanation(
            question_id, user_id, question, user_context
        )
        
        if not result['success']:
            logger.warning(f"Explanation generation failed: {result.get('error')}")
            log_audit_event(user_id, 'ai_explanation_request', question_id, 'failure',
                          {'error': result.get('error'), 'is_fallback': result.get('is_fallback')})
            
            # Publish metric
            publish_metric('ExplanationGenerationFailure', 1)
            
            # Return fallback response
            return success_response({
                'success': True,
                'explanation': result['explanation'],
                'citations': result['citations'],
                'word_count': result['word_count'],
                'is_fallback': result['is_fallback']
            })
        
        # Save explanation
        explanation_id = str(uuid.uuid4())
        saved = ExplanationStorage.save_explanation(
            explanation_id,
            user_id,
            question_id,
            result['explanation'],
            result['citations'],
            result['word_count']
        )
        
        if not saved:
            logger.warning(f"Failed to save explanation {explanation_id}")
        
        # Log audit event
        log_audit_event(user_id, 'ai_explanation_request', question_id, 'success',
                       {
                           'explanation_id': explanation_id,
                           'word_count': result['word_count'],
                           'citations_count': len(result['citations']),
                           'validated': result.get('validated', True)
                       })
        
        # Publish metrics
        publish_metric('ExplanationGenerationSuccess', 1)
        publish_metric('ExplanationWordCount', result['word_count'])
        publish_metric('ExplanationCitationsCount', len(result['citations']))
        
        logger.info(f"Explanation generated successfully: {explanation_id}")
        
        # Return response
        return success_response({
            'success': True,
            'explanation_id': explanation_id,
            'explanation': result['explanation'],
            'citations': result['citations'],
            'word_count': result['word_count'],
            'is_fallback': False,
            'question_id': question_id,
            'topic': topic
        })
        
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        publish_metric('ExplanationGenerationError', 1)
        return error_response(500, "Internal server error")


# For local testing
if __name__ == "__main__":
    test_event = {
        "body": {
            "question_id": "q123",
            "user_id": "u456"
        }
    }
    result = lambda_handler(test_event, None)
    print(json.dumps(result, indent=2))
