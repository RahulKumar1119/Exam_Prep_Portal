"""
AI Tutor Lambda Function with Bedrock Integration
Handles AI explanation requests with quality validation and storage
"""

import json
import uuid
import logging
import time
import re
import threading
from datetime import datetime
from typing import Dict, Tuple, Optional
from decimal import Decimal
import boto3
from botocore.config import Config
from botocore.exceptions import BotoCoreError, ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# AWS clients - configure with read timeout matching our explanation timeout
bedrock = boto3.client(
    'bedrock-runtime',
    region_name='ap-south-1',
    config=Config(read_timeout=30, connect_timeout=10)
)
dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
explanations_table = dynamodb.Table('jaiib-ai-explanations')

# Model ID for Claude using inference profile - prefer env var if set
import os
MODEL_ID = os.environ.get(
    'BEDROCK_MODEL_ID',
    'arn:aws:bedrock:ap-south-1:438097524343:inference-profile/apac.anthropic.claude-sonnet-4-20250514-v1:0'
)

# Constants
EXPLANATION_TIMEOUT = 25  # seconds - Bedrock can take 10-20s for detailed responses
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
    Validate explanation quality - accept any non-empty response
    
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not explanation or len(explanation.strip()) < 10:
        return False, "Explanation is empty or too short"
    
    return True, None


def generate_explanation_with_timeout(
    question_text: str,
    correct_answer: str,
    options: dict,
    timeout: int = EXPLANATION_TIMEOUT
) -> Tuple[str, bool]:
    """
    Generate AI explanation with timeout handling using threading.
    
    Returns:
        Tuple of (explanation, is_timeout)
    """
    result_container = {'explanation': None, 'error': None}

    def _call_bedrock():
        try:
            prompt = f"""You are an expert banking and finance educator specializing in JAIIB and CAIIB exams.

A student answered a question incorrectly. Provide a DETAILED and COMPREHENSIVE explanation of why the correct answer is right.

Question: {question_text}

Options:
A. {options.get('A', '')}
B. {options.get('B', '')}
C. {options.get('C', '')}
D. {options.get('D', '')}

Correct Answer: {correct_answer}

Your explanation MUST include ALL of the following:

1. CORRECT ANSWER STATEMENT: Clearly state that {correct_answer} is the correct answer and why it is correct.

2. DETAILED REASONING: Provide 2-3 paragraphs explaining the banking/financial principles behind the correct answer.

3. WHY OTHER OPTIONS ARE WRONG: For each incorrect option, explain why it is wrong and what misconception it represents.

4. REGULATORY REFERENCES: Include specific references to:
   - RBI guidelines, circulars, or master directions
   - IIBF standards or frameworks
   - Banking regulations or acts
   - Any relevant regulatory body guidelines

5. PRACTICAL EXAMPLES: Provide 1-2 real-world banking scenarios or examples that illustrate the concept.

6. KEY CONCEPTS: List and explain 3-4 key banking/financial concepts related to this question.

7. COMMON MISCONCEPTIONS: Explain 2-3 common misconceptions students have about this topic.

Write a comprehensive, detailed explanation with multiple paragraphs. Aim for 300-500 words minimum."""

            logger.info(f"Calling Bedrock with model: {MODEL_ID}")

            response = bedrock.invoke_model(
                modelId=MODEL_ID,
                contentType='application/json',
                accept='application/json',
                body=json.dumps({
                    'anthropic_version': 'bedrock-2023-05-31',
                    'max_tokens': 2000,
                    'messages': [
                        {
                            'role': 'user',
                            'content': prompt
                        }
                    ]
                })
            )

            parsed = json.loads(response['body'].read())
            result_container['explanation'] = parsed['content'][0]['text'].strip()

        except Exception as e:
            result_container['error'] = str(e)
            logger.error(f"Bedrock call error: {str(e)}")

    start_time = time.time()
    thread = threading.Thread(target=_call_bedrock, daemon=True)
    thread.start()
    thread.join(timeout=timeout)

    elapsed = time.time() - start_time

    if thread.is_alive():
        logger.warning(f"Bedrock call timed out after {elapsed:.2f}s")
        return None, True  # is_timeout=True

    if result_container['error'] or not result_container['explanation']:
        logger.error(f"Bedrock call failed: {result_container['error']}")
        return None, False

    explanation = result_container['explanation']
    logger.info(f"Bedrock returned {len(explanation.split())} words in {elapsed:.2f}s")

    is_valid, error_msg = validate_explanation(explanation)
    if not is_valid:
        logger.warning(f"Explanation validation failed: {error_msg}")
        return None, False

    return explanation, False


def get_fallback_explanation(correct_answer: str) -> str:
    """Get fallback explanation for timeout scenarios"""
    return (
        f"The correct answer is {correct_answer}. "
        "Our AI explanation service is taking longer than expected to respond. "
        "Please try requesting the explanation again in a moment. "
        "If the issue persists, refer to your JAIIB/CAIIB study materials or "
        "the official RBI and IIBF resources for detailed guidance on this topic."
    )


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
                'generation_time': Decimal(str(generation_time)),
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
