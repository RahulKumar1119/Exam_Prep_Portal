"""
Question Bank CRUD Service

Handles Create, Read, Update, Delete operations for MCQs with validation,
versioning, and search functionality.

Implements:
- MCQ creation with validation
- MCQ editing with version preservation
- MCQ deletion (mark as inactive)
- Search with filtering by paper, topic, difficulty, keyword
"""

import json
import boto3
import uuid
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple
from decimal import Decimal

# Initialize AWS clients
dynamodb = boto3.resource('dynamodb')
kms_client = boto3.client('kms')
cloudwatch = boto3.client('cloudwatch')

# Table names
QUESTION_BANK_TABLE = 'jaiib-question-bank'
VERSION_HISTORY_TABLE = 'jaiib-version-history'

# KMS key for encryption
KMS_KEY_ID = 'arn:aws:kms:ap-south-1:438097524343:key/8f4e49c4-9d56-47c1-a24e-37fb003c8b77'

# Valid values
VALID_PAPERS = ['IE & IFS', 'PPB', 'AFB', 'RBWM']
VALID_DIFFICULTIES = ['easy', 'medium', 'hard']


def get_question_bank_table():
    """Get DynamoDB question bank table"""
    return dynamodb.Table(QUESTION_BANK_TABLE)


def get_version_history_table():
    """Get DynamoDB version history table"""
    return dynamodb.Table(VERSION_HISTORY_TABLE)


def validate_mcq_fields(
    question_text: str,
    options: List[str],
    correct_answer: str,
    topic: str,
    difficulty: str,
    references: Dict[str, str],
    paper: str
) -> Tuple[bool, str]:
    """
    Validate MCQ fields for creation or update.
    
    Args:
        question_text: The question text
        options: List of 4 options [A, B, C, D]
        correct_answer: Correct answer (A, B, C, or D)
        topic: Topic name
        difficulty: Difficulty level (easy, medium, hard)
        references: Dictionary with rbi_reference and iibf_reference
        paper: JAIIB paper name
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    # Validate question text
    if not question_text or not isinstance(question_text, str):
        return False, "Question text is required and must be a string"
    
    if len(question_text.strip()) < 10:
        return False, "Question text must be at least 10 characters"
    
    # Validate options
    if not options or not isinstance(options, list):
        return False, "Options must be a list"
    
    if len(options) != 4:
        return False, "Must provide exactly 4 options"
    
    for i, option in enumerate(options):
        if not option or not isinstance(option, str):
            return False, f"Option {chr(65+i)} must be a non-empty string"
        if len(option.strip()) < 2:
            return False, f"Option {chr(65+i)} must be at least 2 characters"
    
    # Validate correct answer
    if correct_answer not in ['A', 'B', 'C', 'D']:
        return False, "Correct answer must be A, B, C, or D"
    
    # Validate topic
    if not topic or not isinstance(topic, str):
        return False, "Topic is required and must be a string"
    
    if len(topic.strip()) < 2:
        return False, "Topic must be at least 2 characters"
    
    # Validate difficulty
    if difficulty not in VALID_DIFFICULTIES:
        return False, f"Difficulty must be one of: {', '.join(VALID_DIFFICULTIES)}"
    
    # Validate paper
    if paper not in VALID_PAPERS:
        return False, f"Paper must be one of: {', '.join(VALID_PAPERS)}"
    
    # Validate references
    if not references or not isinstance(references, dict):
        return False, "References must be a dictionary"
    
    if 'rbi_reference' not in references or not references['rbi_reference']:
        return False, "RBI reference is required"
    
    if 'iibf_reference' not in references or not references['iibf_reference']:
        return False, "IIBF reference is required"
    
    return True, ""


def create_mcq(
    question_text: str,
    options: List[str],
    correct_answer: str,
    topic: str,
    difficulty: str,
    references: Dict[str, str],
    paper: str,
    creator_user_id: str
) -> Dict[str, Any]:
    """
    Create a new MCQ in the question bank.
    
    Validates all required fields and creates a new question with unique ID.
    
    Args:
        question_text: The question text
        options: List of 4 options [A, B, C, D]
        correct_answer: Correct answer (A, B, C, or D)
        topic: Topic name
        difficulty: Difficulty level
        references: Dictionary with rbi_reference and iibf_reference
        paper: JAIIB paper name
        creator_user_id: User ID of the creator
        
    Returns:
        Dictionary with question_id, version, and success status
    """
    # Validate fields
    is_valid, error_msg = validate_mcq_fields(
        question_text, options, correct_answer, topic, difficulty, references, paper
    )
    
    if not is_valid:
        return {
            'success': False,
            'error': error_msg
        }
    
    try:
        table = get_question_bank_table()
        
        # Generate question ID and version
        question_id = str(uuid.uuid4())
        version = 'v1.0'
        timestamp = datetime.utcnow().isoformat()
        
        # Create question item
        question_item = {
            'question_id': question_id,
            'version': version,
            'paper': paper,
            'topic': topic,
            'difficulty': difficulty,
            'question_text': question_text,
            'options': options,
            'correct_answer': correct_answer,
            'rbi_reference': references.get('rbi_reference', ''),
            'iibf_reference': references.get('iibf_reference', ''),
            'created_at': timestamp,
            'created_by': creator_user_id,
            'updated_at': timestamp,
            'updated_by': creator_user_id,
            'status': 'active'
        }
        
        # Store in DynamoDB
        table.put_item(Item=question_item)
        
        # Publish metric
        cloudwatch.put_metric_data(
            Namespace='JAIIB-QuestionBank',
            MetricData=[
                {
                    'MetricName': 'MCQCreated',
                    'Value': 1,
                    'Unit': 'Count',
                    'Timestamp': datetime.utcnow()
                }
            ]
        )
        
        return {
            'success': True,
            'question_id': question_id,
            'version': version,
            'created_at': timestamp,
            'message': f'MCQ created successfully with ID {question_id}'
        }
        
    except Exception as e:
        print(f"Error creating MCQ: {str(e)}")
        return {
            'success': False,
            'error': f'Error creating MCQ: {str(e)}'
        }


def get_mcq(question_id: str, version: Optional[str] = None) -> Dict[str, Any]:
    """
    Retrieve an MCQ by question ID and optional version.
    
    Args:
        question_id: The question ID
        version: Optional version (defaults to latest)
        
    Returns:
        Dictionary with question data or error
    """
    try:
        table = get_question_bank_table()
        
        if version:
            # Get specific version
            response = table.get_item(
                Key={'question_id': question_id, 'version': version}
            )
        else:
            # Get latest version by querying all versions and sorting
            response = table.query(
                KeyConditionExpression='question_id = :qid',
                ExpressionAttributeValues={':qid': question_id}
            )
            
            items = response.get('Items', [])
            if not items:
                return {
                    'success': False,
                    'error': f'Question {question_id} not found'
                }
            
            # Sort by version and get latest
            items.sort(key=lambda x: x.get('version', 'v0.0'), reverse=True)
            response = {'Item': items[0]}
        
        item = response.get('Item')
        if not item:
            return {
                'success': False,
                'error': f'Question {question_id} not found'
            }
        
        return {
            'success': True,
            'question': item
        }
        
    except Exception as e:
        print(f"Error retrieving MCQ: {str(e)}")
        return {
            'success': False,
            'error': f'Error retrieving MCQ: {str(e)}'
        }


def update_mcq(
    question_id: str,
    question_text: Optional[str] = None,
    options: Optional[List[str]] = None,
    correct_answer: Optional[str] = None,
    topic: Optional[str] = None,
    difficulty: Optional[str] = None,
    references: Optional[Dict[str, str]] = None,
    updater_user_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Update an MCQ by creating a new version and preserving the previous version.
    
    Args:
        question_id: The question ID to update
        question_text: New question text (optional)
        options: New options (optional)
        correct_answer: New correct answer (optional)
        topic: New topic (optional)
        difficulty: New difficulty (optional)
        references: New references (optional)
        updater_user_id: User ID of the updater
        
    Returns:
        Dictionary with new version details or error
    """
    try:
        table = get_question_bank_table()
        
        # Get current version
        current_response = get_mcq(question_id)
        if not current_response.get('success'):
            return current_response
        
        current_question = current_response['question']
        
        # Use provided values or keep current values
        new_question_text = question_text or current_question.get('question_text')
        new_options = options or current_question.get('options')
        new_correct_answer = correct_answer or current_question.get('correct_answer')
        new_topic = topic or current_question.get('topic')
        new_difficulty = difficulty or current_question.get('difficulty')
        new_references = references or {
            'rbi_reference': current_question.get('rbi_reference', ''),
            'iibf_reference': current_question.get('iibf_reference', '')
        }
        paper = current_question.get('paper')
        
        # Validate new fields
        is_valid, error_msg = validate_mcq_fields(
            new_question_text, new_options, new_correct_answer,
            new_topic, new_difficulty, new_references, paper
        )
        
        if not is_valid:
            return {
                'success': False,
                'error': error_msg
            }
        
        # Generate new version number
        current_version = current_question.get('version', 'v1.0')
        parts = current_version[1:].split('.')
        major = int(parts[0])
        minor = int(parts[1])
        new_version = f"v{major}.{minor + 1}"
        
        timestamp = datetime.utcnow().isoformat()
        
        # Create new version item
        new_question_item = {
            'question_id': question_id,
            'version': new_version,
            'paper': paper,
            'topic': new_topic,
            'difficulty': new_difficulty,
            'question_text': new_question_text,
            'options': new_options,
            'correct_answer': new_correct_answer,
            'rbi_reference': new_references.get('rbi_reference', ''),
            'iibf_reference': new_references.get('iibf_reference', ''),
            'created_at': current_question.get('created_at'),
            'created_by': current_question.get('created_by'),
            'updated_at': timestamp,
            'updated_by': updater_user_id or 'system',
            'status': 'active',
            'previous_version': current_version
        }
        
        # Store new version
        table.put_item(Item=new_question_item)
        
        # Publish metric
        cloudwatch.put_metric_data(
            Namespace='JAIIB-QuestionBank',
            MetricData=[
                {
                    'MetricName': 'MCQUpdated',
                    'Value': 1,
                    'Unit': 'Count',
                    'Timestamp': datetime.utcnow()
                }
            ]
        )
        
        return {
            'success': True,
            'question_id': question_id,
            'previous_version': current_version,
            'new_version': new_version,
            'updated_at': timestamp,
            'message': f'MCQ updated successfully. New version {new_version} created.'
        }
        
    except Exception as e:
        print(f"Error updating MCQ: {str(e)}")
        return {
            'success': False,
            'error': f'Error updating MCQ: {str(e)}'
        }


def delete_mcq(question_id: str, deleter_user_id: str) -> Dict[str, Any]:
    """
    Delete an MCQ by marking it as inactive (soft delete).
    
    Does not permanently delete the question, preserves all versions.
    
    Args:
        question_id: The question ID to delete
        deleter_user_id: User ID of the person deleting
        
    Returns:
        Dictionary with deletion status or error
    """
    try:
        table = get_question_bank_table()
        
        # Get current version
        current_response = get_mcq(question_id)
        if not current_response.get('success'):
            return current_response
        
        current_question = current_response['question']
        current_version = current_question.get('version')
        
        timestamp = datetime.utcnow().isoformat()
        
        # Mark as inactive
        table.update_item(
            Key={'question_id': question_id, 'version': current_version},
            UpdateExpression='SET #status = :inactive, deleted_at = :timestamp, deleted_by = :user_id',
            ExpressionAttributeNames={'#status': 'status'},
            ExpressionAttributeValues={
                ':inactive': 'inactive',
                ':timestamp': timestamp,
                ':user_id': deleter_user_id
            }
        )
        
        # Publish metric
        cloudwatch.put_metric_data(
            Namespace='JAIIB-QuestionBank',
            MetricData=[
                {
                    'MetricName': 'MCQDeleted',
                    'Value': 1,
                    'Unit': 'Count',
                    'Timestamp': datetime.utcnow()
                }
            ]
        )
        
        return {
            'success': True,
            'question_id': question_id,
            'deleted_at': timestamp,
            'message': f'MCQ {question_id} marked as inactive'
        }
        
    except Exception as e:
        print(f"Error deleting MCQ: {str(e)}")
        return {
            'success': False,
            'error': f'Error deleting MCQ: {str(e)}'
        }


def search_mcqs(
    paper: Optional[str] = None,
    topic: Optional[str] = None,
    difficulty: Optional[str] = None,
    keyword: Optional[str] = None,
    limit: int = 50,
    start_key: Optional[str] = None
) -> Dict[str, Any]:
    """
    Search MCQs with filtering by paper, topic, difficulty, and keyword.
    
    Args:
        paper: Filter by paper name (optional)
        topic: Filter by topic (optional)
        difficulty: Filter by difficulty (optional)
        keyword: Search in question text (optional)
        limit: Maximum number of results
        start_key: Pagination token
        
    Returns:
        Dictionary with search results and pagination info
    """
    try:
        table = get_question_bank_table()
        
        # Build filter expression
        filter_expressions = []
        expression_values = {}
        expression_names = {}
        
        # Only include active questions
        filter_expressions.append('#status = :active')
        expression_values[':active'] = 'active'
        expression_names['#status'] = 'status'
        
        # Add paper filter
        if paper:
            filter_expressions.append('paper = :paper')
            expression_values[':paper'] = paper
        
        # Add topic filter
        if topic:
            filter_expressions.append('topic = :topic')
            expression_values[':topic'] = topic
        
        # Add difficulty filter
        if difficulty:
            filter_expressions.append('difficulty = :difficulty')
            expression_values[':difficulty'] = difficulty
        
        # Add keyword filter (searches question_text)
        if keyword:
            filter_expressions.append('contains(question_text, :keyword)')
            expression_values[':keyword'] = keyword
        
        # Combine filter expressions
        filter_expression = ' AND '.join(filter_expressions) if filter_expressions else None
        
        # Perform scan
        scan_kwargs = {
            'Limit': limit,
            'ProjectionExpression': 'question_id, version, paper, topic, difficulty, question_text, correct_answer, created_at, updated_at'
        }
        
        if filter_expression:
            scan_kwargs['FilterExpression'] = filter_expression
            scan_kwargs['ExpressionAttributeValues'] = expression_values
            if expression_names:
                scan_kwargs['ExpressionAttributeNames'] = expression_names
        
        if start_key:
            scan_kwargs['ExclusiveStartKey'] = json.loads(start_key)
        
        response = table.scan(**scan_kwargs)
        
        # Get latest version for each question
        questions_by_id = {}
        for item in response.get('Items', []):
            qid = item.get('question_id')
            if qid not in questions_by_id:
                questions_by_id[qid] = item
            else:
                # Keep the latest version
                if item.get('version', 'v0.0') > questions_by_id[qid].get('version', 'v0.0'):
                    questions_by_id[qid] = item
        
        questions = list(questions_by_id.values())
        
        result = {
            'success': True,
            'questions': questions,
            'count': len(questions),
            'total_count': response.get('Count', 0)
        }
        
        # Add pagination token if more results available
        if 'LastEvaluatedKey' in response:
            result['next_token'] = json.dumps(response['LastEvaluatedKey'], default=str)
        
        return result
        
    except Exception as e:
        print(f"Error searching MCQs: {str(e)}")
        return {
            'success': False,
            'error': f'Error searching MCQs: {str(e)}'
        }


def get_mcq_versions(question_id: str) -> Dict[str, Any]:
    """
    Get all versions of a specific MCQ.
    
    Args:
        question_id: The question ID
        
    Returns:
        Dictionary with all versions sorted by version number
    """
    try:
        table = get_question_bank_table()
        
        # Query all versions of this question
        response = table.query(
            KeyConditionExpression='question_id = :qid',
            ExpressionAttributeValues={':qid': question_id}
        )
        
        versions = response.get('Items', [])
        
        # Sort by version descending
        versions.sort(key=lambda x: x.get('version', 'v0.0'), reverse=True)
        
        return {
            'success': True,
            'question_id': question_id,
            'versions': versions,
            'version_count': len(versions)
        }
        
    except Exception as e:
        print(f"Error retrieving MCQ versions: {str(e)}")
        return {
            'success': False,
            'error': f'Error retrieving MCQ versions: {str(e)}'
        }
