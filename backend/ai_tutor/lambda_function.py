"""
AI Tutor Lambda Function
Handles AI explanation requests via AWS Bedrock Claude 4.5 Haiku
"""

import json
import uuid
import logging
from datetime import datetime
import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# AWS Bedrock client
bedrock = boto3.client('bedrock-runtime', region_name='ap-south-1')

# Model ID for Claude 4.5 Haiku
MODEL_ID = 'anthropic.claude-3-5-haiku-20241022-v1:0'


def generate_explanation(question_text: str, correct_answer: str, user_answer: str, options: dict) -> str:
    """Generate AI explanation using AWS Bedrock Claude"""
    try:
        prompt = f"""You are an expert banking and finance educator specializing in JAIIB and CAIIB exams.

A student answered a question incorrectly. Provide a brief, clear explanation (2-3 sentences) of why the correct answer is right.

Question: {question_text}

Options:
A. {options.get('A', '')}
B. {options.get('B', '')}
C. {options.get('C', '')}
D. {options.get('D', '')}

Correct Answer: {correct_answer}

Explanation:"""

        response = bedrock.invoke_model(
            modelId=MODEL_ID,
            contentType='application/json',
            accept='application/json',
            body=json.dumps({
                'anthropic_version': 'bedrock-2023-06-01',
                'max_tokens': 300,
                'messages': [
                    {
                        'role': 'user',
                        'content': prompt
                    }
                ]
            })
        )
        
        result = json.loads(response['body'].read())
        explanation = result['content'][0]['text'].strip()
        return explanation
        
    except Exception as e:
        logger.error(f"Error generating explanation with Bedrock: {str(e)}")
        # Fallback explanation
        return f"The correct answer is {correct_answer}. This is the most accurate response based on banking regulations and financial principles."


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
            "user_id": "u456",
            "question_text": "...",
            "correct_answer": "B",
            "options": {"A": "...", "B": "...", "C": "...", "D": "..."}
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
        question_text = body.get('question_text', '')
        correct_answer = body.get('correct_answer', '')
        options = body.get('options', {})
        
        logger.info(f"Processing explanation request for question {question_id} by user {user_id}")
        
        # Generate explanation using Bedrock
        logger.info("Generating explanation with AWS Bedrock Claude...")
        explanation = generate_explanation(
            question_text,
            correct_answer,
            '',
            options
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
