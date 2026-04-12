"""
AI Tutor Lambda Function with Bedrock Integration
Handles AI explanation requests with quality validation and storage
"""

import json
import uuid
import logging
import time
import re
from datetime import datetime
from typing import Dict, Tuple, Optional
import boto3
from botocore.exceptions import BotoCoreError, ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# AWS clients
bedrock = boto3.client('bedrock-runtime', region_name='ap-south-1')
dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
explanations_table = dynamodb.Table('jaiib-ai-explanations')

# Model ID for Claude 3.5 Haiku
MODEL_ID = 'anthropic.claude-3-5-haiku-20241022-v1:0'

# Constants
EXPLANATION_TIMEOUT = 5  # seconds
MIN_WORD_COUNT = 150
MAX_WORD_COUNT = 1000


def extract_citations(text: str) -> list:
    """Extract RBI/IIBF citations from explanation text"""
    citations = []
    # Look for patterns like "RBI Circular 2023/..." or "IIBF Guidelines..."
    rbi_pattern = r'RBI\s+(?:Circular|Guideline|Notification|Master\s+Direction)[^\n]*'
    iibf_pattern = r'IIBF\s+(?:Guidelines|Standards|Framework)[^\n]*'
    
    citations.extend(re.findall(rbi_pattern, text, re.IGNORECASE))
    citations.extend(re.findall(iibf_pattern, text, re.IGNORECASE))
    
    return list(set(citations))  # Remove duplicates


def validate_explanation(explanation: str) -> Tuple[bool, Optional[str]]:
    """
    Validate explanation quality
    
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not explanation:
        return False, "Explanation is empty"
    
    # Check word count - allow 50+ words minimum for Bedrock responses
    word_count = len(explanation.split())
    if word_count < 50:
        return False, f"Explanation too short ({word_count} words, minimum 50)"
    
    if word_count > MAX_WORD_COUNT:
        return False, f"Explanation too long ({word_count} words, maximum {MAX_WORD_COUNT})"
    
    # Check for required elements
    required_elements = {
        'correct_answer': r'(?:correct|answer|is\s+[A-D])',
        'reasoning': r'(?:because|reason|therefore|thus|since)',
        'concepts': r'(?:concept|principle|rule|regulation|guideline)',
    }
    
    found_elements = []
    for element, pattern in required_elements.items():
        if re.search(pattern, explanation, re.IGNORECASE):
            found_elements.append(element)
    
    if len(found_elements) < 1:
        return False, f"Explanation missing required elements. Found: {', '.join(found_elements)}"
    
    return True, None


def generate_explanation_with_timeout(
    question_text: str,
    correct_answer: str,
    options: dict,
    timeout: int = EXPLANATION_TIMEOUT
) -> Tuple[str, bool]:
    """
    Generate AI explanation with timeout handling
    
    Returns:
        Tuple of (explanation, is_timeout)
    """
    start_time = time.time()
    
    try:
        prompt = f"""You are an expert banking and finance educator specializing in JAIIB and CAIIB exams.

A student answered a question incorrectly. Provide a comprehensive explanation (800-1000 words) of why the correct answer is right.

Question: {question_text}

Options:
A. {options.get('A', '')}
B. {options.get('B', '')}
C. {options.get('C', '')}
D. {options.get('D', '')}

Correct Answer: {correct_answer}

Your explanation should:
1. State the correct answer clearly and explain why it is correct
2. Provide detailed reasoning with examples from banking practice
3. Reference relevant RBI circulars, guidelines, and IIBF standards
4. Explain the concepts and principles underlying the correct answer
5. Clarify common misconceptions and why other options are incorrect
6. Provide practical applications and real-world scenarios
7. Include regulatory framework and compliance requirements
8. Suggest resources for further learning

Explanation:"""

        response = bedrock.invoke_model(
            modelId=MODEL_ID,
            contentType='application/json',
            accept='application/json',
            body=json.dumps({
                'anthropic_version': 'bedrock-2023-06-01',
                'max_tokens': 2000,
                'messages': [
                    {
                        'role': 'user',
                        'content': prompt
                    }
                ]
            })
        )
        
        elapsed = time.time() - start_time
        
        if elapsed > timeout:
            logger.warning(f"Explanation generation took {elapsed:.2f}s, exceeding {timeout}s timeout")
            return None, True
        
        result = json.loads(response['body'].read())
        explanation = result['content'][0]['text'].strip()
        
        # Validate explanation quality
        is_valid, error_msg = validate_explanation(explanation)
        if not is_valid:
            logger.warning(f"Explanation validation failed: {error_msg}")
            return None, False
        
        logger.info(f"Explanation generated successfully in {elapsed:.2f}s")
        return explanation, False
        
    except (BotoCoreError, ClientError) as e:
        logger.error(f"Bedrock API error: {str(e)}")
        return None, False
    except Exception as e:
        logger.error(f"Error generating explanation: {str(e)}")
        return None, False


def get_fallback_explanation(correct_answer: str) -> str:
    """Get fallback explanation for timeout scenarios"""
    return f"""The correct answer is {correct_answer}. 

This is the most accurate response based on banking regulations and financial principles. To understand why this answer is correct, please refer to the relevant RBI guidelines and IIBF standards for banking operations.

Key concepts to remember:
- Banking regulations are established by the Reserve Bank of India (RBI)
- The Indian Institute of Banking and Finance (IIBF) provides professional standards
- Always refer to the latest circulars and guidelines for current regulations

For more detailed explanations, please consult the official RBI website and IIBF resources."""


def save_explanation(
    question_id: str,
    user_id: str,
    explanation: str,
    citations: list,
    generation_time: float,
    is_fallback: bool = False
) -> bool:
    """Save explanation to DynamoDB"""
    try:
        explanations_table.put_item(
            Item={
                'explanation_id': str(uuid.uuid4()),
                'question_id': question_id,
                'user_id': user_id,
                'explanation': explanation,
                'citations': citations,
                'generation_time': generation_time,
                'is_fallback': is_fallback,
                'created_at': datetime.utcnow().isoformat(),
                'word_count': len(explanation.split()),
                'ttl': int(datetime.utcnow().timestamp()) + (90 * 24 * 60 * 60)  # 90 days
            }
        )
        logger.info(f"Explanation saved for question {question_id}, user {user_id}")
        return True
    except Exception as e:
        logger.error(f"Error saving explanation: {str(e)}")
        return False


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
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
        }
    }


def success_response(data: dict) -> dict:
    """Format success response"""
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
        
        # Parse body
        body_str = event.get('body', '{}')
        if isinstance(body_str, str):
            body = json.loads(body_str) if body_str else {}
        else:
            body = body_str if isinstance(body_str, dict) else {}
        
        # Extract parameters
        question_id = body.get('question_id')
        user_id = body.get('user_id')
        question_text = body.get('question_text', '')
        correct_answer = body.get('correct_answer', '')
        options = body.get('options', {})
        
        # Validate required fields
        if not question_id:
            return error_response(400, "question_id is required")
        if not user_id:
            return error_response(400, "user_id is required")
        if not question_text:
            return error_response(400, "question_text is required")
        if not correct_answer:
            return error_response(400, "correct_answer is required")
        
        logger.info(f"Processing explanation request for question {question_id} by user {user_id}")
        
        # Generate explanation with timeout
        start_time = time.time()
        explanation, is_timeout = generate_explanation_with_timeout(
            question_text,
            correct_answer,
            options,
            timeout=EXPLANATION_TIMEOUT
        )
        generation_time = time.time() - start_time
        
        # Use fallback if timeout or generation failed
        if explanation is None:
            logger.warning(f"Using fallback explanation (timeout={is_timeout})")
            explanation = get_fallback_explanation(correct_answer)
            is_fallback = True
        else:
            is_fallback = False
        
        # Extract citations
        citations = extract_citations(explanation)
        
        # Save explanation
        save_explanation(
            question_id,
            user_id,
            explanation,
            citations,
            generation_time,
            is_fallback
        )
        
        # Return response
        return success_response({
            'success': True,
            'explanation': explanation,
            'question_id': question_id,
            'citations': citations,
            'generation_time': generation_time,
            'is_fallback': is_fallback,
            'word_count': len(explanation.split())
        })
        
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        return error_response(500, "Internal server error")
