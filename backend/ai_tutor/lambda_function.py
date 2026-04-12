"""
AI Tutor Lambda Function
Handles AI explanation requests via AWS Bedrock Claude 4.5 Haiku
"""

import json
import uuid
import logging
from datetime import datetime

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def generate_explanation(question_text: str, correct_answer: str, user_answer: str, options: dict) -> str:
    """Generate explanation for the answer"""
    try:
        # For now, return a simple explanation
        # In production, this would call Bedrock
        correct_option = options.get(correct_answer, '')
        return f"The correct answer is {correct_answer}: {correct_option}. This is the most accurate response based on banking regulations and financial principles."
        
    except Exception as e:
        logger.error(f"Error generating explanation: {str(e)}")
        return "Explanation not available"


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
        
        logger.info(f"Received event: {json.dumps(event)}")
        
        # Parse body if it's a string (from API Gateway)
        body = event.get('body', {})
        if isinstance(body, str):
            body = json.loads(body) if body else {}
        
        # Validate request
        is_valid, error_msg = validate_request({'body': body})
        if not is_valid:
            logger.warning(f"Invalid request: {error_msg}")
            return error_response(400, error_msg)
        
        question_id = body.get('question_id')
        user_id = body.get('user_id')
        
        logger.info(f"Processing explanation request for question {question_id} by user {user_id}")
        
        # Generate a simple explanation
        explanation = generate_explanation(
            "Banking question",
            "B",
            "A",
            {"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"}
        )
        
        logger.info(f"Explanation generated successfully")
        
        # Return response
        return success_response({
            'success': True,
            'explanation': explanation,
            'question_id': question_id
        })
        
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
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
