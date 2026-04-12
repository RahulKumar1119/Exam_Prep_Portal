"""
AI Tutor Explanation Service
Handles AI-powered explanation generation using AWS Bedrock Claude 4.5 Haiku
"""

import json
import time
import logging
import re
from typing import Dict, List, Optional, Tuple
from datetime import datetime

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Lazy-load AWS clients to avoid import errors in test environments
bedrock_client = None
dynamodb = None
explanations_table = None
questions_table = None

def _init_aws_clients():
    """Initialize AWS clients lazily"""
    global bedrock_client, dynamodb, explanations_table, questions_table
    
    if bedrock_client is None:
        try:
            import boto3
            from botocore.config import Config
            bedrock_client = boto3.client(
                'bedrock-runtime',
                region_name='ap-south-1',
                config=Config(read_timeout=30, connect_timeout=10)
            )
            dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
            explanations_table = dynamodb.Table('jaiib-ai-explanations')
            questions_table = dynamodb.Table('Question_Bank')
        except Exception as e:
            logger.warning(f"Failed to initialize AWS clients: {str(e)}")
            raise


class ExplanationGenerator:
    """Generates AI explanations using AWS Bedrock Claude 4.5 Haiku"""
    
    MODEL_ID = "arn:aws:bedrock:ap-south-1:438097524343:inference-profile/apac.anthropic.claude-sonnet-4-20250514-v1:0"
    MAX_TOKENS = 1024
    TIMEOUT_SECONDS = 5
    
    @staticmethod
    def build_tutor_prompt(question: Dict, user_context: Dict) -> str:
        """
        Build a prompt for the AI tutor with question context and user performance
        
        Args:
            question: Question data with text, options, correct answer
            user_context: User's performance data for the topic
            
        Returns:
            Formatted prompt for Claude
        """
        question_text = question.get('question_text', '')
        options = question.get('options', [])
        correct_answer = question.get('correct_answer', '')
        topic = question.get('topic', '')
        
        # Format options
        options_text = '\n'.join([
            f"{chr(65 + i)}. {opt}" for i, opt in enumerate(options)
        ])
        
        # Get user's accuracy for context
        user_accuracy = user_context.get('accuracy', 0)
        user_level = "beginner" if user_accuracy < 50 else "intermediate" if user_accuracy < 75 else "advanced"
        
        prompt = f"""You are an expert JAIIB/CAIIB exam tutor. Provide a clear, concise explanation for this question.

QUESTION:
{question_text}

OPTIONS:
{options_text}

CORRECT ANSWER: {correct_answer}

TOPIC: {topic}
USER LEVEL: {user_level} (accuracy: {user_accuracy}%)

REQUIREMENTS:
1. Start with the correct answer and why it's correct
2. Explain the reasoning clearly
3. Include relevant RBI/IIBF regulatory references if applicable
4. Highlight key concepts the user should understand
5. Address common misconceptions
6. Keep explanation between 150-300 words
7. Use simple, clear language appropriate for {user_level} level

EXPLANATION:"""
        
        return prompt
    
    @staticmethod
    def invoke_bedrock(prompt: str, timeout: int = TIMEOUT_SECONDS) -> Tuple[str, bool]:
        """
        Invoke AWS Bedrock Claude 4.5 Haiku with timeout handling
        
        Args:
            prompt: The prompt to send to Claude
            timeout: Timeout in seconds
            
        Returns:
            Tuple of (explanation_text, success_flag)
        """
        try:
            _init_aws_clients()
            start_time = time.time()
            
            # Prepare request
            request_body = {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": ExplanationGenerator.MAX_TOKENS,
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            }
            
            # Invoke Bedrock with timeout
            response = bedrock_client.invoke_model(
                modelId=ExplanationGenerator.MODEL_ID,
                body=json.dumps(request_body)
            )
            
            elapsed = time.time() - start_time
            
            # Parse response
            response_body = json.loads(response['body'].read())
            explanation = response_body['content'][0]['text'].strip()
            
            logger.info(f"Bedrock invocation successful in {elapsed:.2f}s")
            return explanation, True
            
        except Exception as e:
            elapsed = time.time() - start_time
            logger.error(f"Bedrock invocation failed after {elapsed:.2f}s: {str(e)}")
            return None, False
    
    @staticmethod
    def extract_citations(explanation: str) -> List[Dict[str, str]]:
        """
        Extract RBI/IIBF citations from explanation
        
        Args:
            explanation: The generated explanation text
            
        Returns:
            List of citations found
        """
        citations = []
        
        # Patterns for common regulatory references
        patterns = [
            (r'RBI\s+(?:Circular|Notification|Guidelines?|Master\s+Circular)[^.]*', 'RBI'),
            (r'IIBF\s+(?:Guidelines?|Standards?|Framework)[^.]*', 'IIBF'),
            (r'(?:Reserve\s+Bank|RBI)\s+[^.]*(?:circular|notification|guideline)[^.]*', 'RBI'),
            (r'(?:Indian\s+Institute|IIBF)\s+[^.]*(?:guideline|standard|framework)[^.]*', 'IIBF'),
        ]
        
        for pattern, source in patterns:
            matches = re.finditer(pattern, explanation, re.IGNORECASE)
            for match in matches:
                citation = {
                    'source': source,
                    'reference': match.group(0).strip(),
                    'position': match.start()
                }
                citations.append(citation)
        
        # Remove duplicates and sort by position
        unique_citations = {}
        for citation in citations:
            key = (citation['source'], citation['reference'])
            if key not in unique_citations:
                unique_citations[key] = citation
        
        return sorted(unique_citations.values(), key=lambda x: x['position'])
    
    @staticmethod
    def validate_explanation(explanation: str) -> Tuple[bool, str]:
        """
        Validate explanation meets quality requirements
        
        Args:
            explanation: The explanation to validate
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        if not explanation:
            return False, "Explanation is empty"
        
        word_count = len(explanation.split())
        
        if word_count < 150:
            return False, f"Explanation too short ({word_count} words, minimum 150)"
        
        if word_count > 300:
            return False, f"Explanation too long ({word_count} words, maximum 300)"
        
        # Check for required elements
        required_elements = {
            'answer': r'(?:correct\s+answer|answer\s+is|correct\s+option)',
            'reasoning': r'(?:because|reason|since|therefore|thus)',
            'concepts': r'(?:concept|principle|understand|important)',
        }
        
        found_elements = []
        for element, pattern in required_elements.items():
            if re.search(pattern, explanation, re.IGNORECASE):
                found_elements.append(element)
        
        if len(found_elements) < 2:
            return False, f"Missing required elements: {', '.join(set(required_elements.keys()) - set(found_elements))}"
        
        return True, ""
    
    @staticmethod
    def generate_explanation(question_id: str, user_id: str, question: Dict, user_context: Dict) -> Dict:
        """
        Generate AI explanation for a question
        
        Args:
            question_id: ID of the question
            user_id: ID of the user
            question: Question data
            user_context: User's performance context
            
        Returns:
            Dictionary with explanation data
        """
        try:
            # Build prompt
            prompt = ExplanationGenerator.build_tutor_prompt(question, user_context)
            
            # Invoke Bedrock with timeout
            explanation, success = ExplanationGenerator.invoke_bedrock(prompt)
            
            if not success or not explanation:
                # Return fallback message
                return {
                    'success': False,
                    'explanation': 'The AI explanation service is temporarily unavailable. Please try again in a moment.',
                    'citations': [],
                    'word_count': 0,
                    'is_fallback': True,
                    'error': 'Bedrock timeout or service unavailable'
                }
            
            # Validate explanation
            is_valid, error_msg = ExplanationGenerator.validate_explanation(explanation)
            
            if not is_valid:
                logger.warning(f"Explanation validation failed: {error_msg}")
                # Still return the explanation but mark as unvalidated
            
            # Extract citations
            citations = ExplanationGenerator.extract_citations(explanation)
            
            # Calculate word count
            word_count = len(explanation.split())
            
            return {
                'success': True,
                'explanation': explanation,
                'citations': citations,
                'word_count': word_count,
                'is_fallback': False,
                'validated': is_valid
            }
            
        except Exception as e:
            logger.error(f"Error generating explanation: {str(e)}")
            return {
                'success': False,
                'explanation': 'An error occurred while generating the explanation. Please try again.',
                'citations': [],
                'word_count': 0,
                'is_fallback': True,
                'error': str(e)
            }


class ExplanationStorage:
    """Handles storage and retrieval of AI explanations"""
    
    @staticmethod
    def save_explanation(explanation_id: str, user_id: str, question_id: str, 
                        explanation: str, citations: List[Dict], word_count: int) -> bool:
        """
        Save explanation to DynamoDB
        
        Args:
            explanation_id: Unique ID for this explanation
            user_id: User who requested the explanation
            question_id: Question being explained
            explanation: The explanation text
            citations: List of citations
            word_count: Word count of explanation
            
        Returns:
            True if saved successfully
        """
        try:
            _init_aws_clients()
            explanations_table.put_item(
                Item={
                    'explanation_id': explanation_id,
                    'user_id': user_id,
                    'question_id': question_id,
                    'explanation': explanation,
                    'citations': citations,
                    'word_count': word_count,
                    'created_at': datetime.utcnow().isoformat(),
                    'ttl': int(time.time()) + (30 * 24 * 60 * 60)  # 30 days TTL
                }
            )
            logger.info(f"Explanation {explanation_id} saved successfully")
            return True
        except Exception as e:
            logger.error(f"Error saving explanation: {str(e)}")
            return False
    
    @staticmethod
    def get_explanation(explanation_id: str) -> Optional[Dict]:
        """
        Retrieve explanation from DynamoDB
        
        Args:
            explanation_id: ID of the explanation to retrieve
            
        Returns:
            Explanation data or None if not found
        """
        try:
            _init_aws_clients()
            response = explanations_table.get_item(Key={'explanation_id': explanation_id})
            return response.get('Item')
        except Exception as e:
            logger.error(f"Error retrieving explanation: {str(e)}")
            return None
    
    @staticmethod
    def get_user_explanations(user_id: str, limit: int = 10) -> List[Dict]:
        """
        Get recent explanations for a user
        
        Args:
            user_id: User ID
            limit: Maximum number of explanations to return
            
        Returns:
            List of explanations
        """
        try:
            _init_aws_clients()
            response = explanations_table.query(
                IndexName='user_id-created_at-index',
                KeyConditionExpression='user_id = :user_id',
                ExpressionAttributeValues={':user_id': user_id},
                ScanIndexForward=False,
                Limit=limit
            )
            return response.get('Items', [])
        except Exception as e:
            logger.error(f"Error retrieving user explanations: {str(e)}")
            return []


def get_user_performance_context(user_id: str, topic: str) -> Dict:
    """
    Get user's performance context for a topic
    
    Args:
        user_id: User ID
        topic: Topic name
        
    Returns:
        Dictionary with user's performance data
    """
    try:
        _init_aws_clients()
        # Query scores table for user's performance on this topic
        scores_table = dynamodb.Table('Scores')
        
        response = scores_table.query(
            KeyConditionExpression='user_id = :user_id',
            ExpressionAttributeValues={':user_id': user_id},
            Limit=50
        )
        
        scores = response.get('Items', [])
        
        # Calculate accuracy for this topic
        topic_scores = [s for s in scores if s.get('topic') == topic]
        
        if not topic_scores:
            return {
                'accuracy': 0,
                'attempts': 0,
                'average_score': 0
            }
        
        total_correct = sum(1 for s in topic_scores if s.get('score', 0) >= 75)
        accuracy = (total_correct / len(topic_scores)) * 100 if topic_scores else 0
        average_score = sum(s.get('score', 0) for s in topic_scores) / len(topic_scores)
        
        return {
            'accuracy': round(accuracy, 1),
            'attempts': len(topic_scores),
            'average_score': round(average_score, 1)
        }
        
    except Exception as e:
        logger.error(f"Error getting user performance context: {str(e)}")
        return {
            'accuracy': 0,
            'attempts': 0,
            'average_score': 0
        }
