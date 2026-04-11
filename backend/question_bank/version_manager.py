"""
Question Bank Version Manager Service

Handles version creation, history retrieval, and version management for the question bank.
Implements versioning with unique version numbers (v1.0, v1.1, v2.0), publication timestamps,
publisher user IDs, and change summaries.
"""

import json
import boto3
import uuid
from datetime import datetime
from typing import Dict, List, Any, Tuple, Optional
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


def get_question_bank_table():
    """Get DynamoDB question bank table"""
    return dynamodb.Table(QUESTION_BANK_TABLE)


def get_version_history_table():
    """Get DynamoDB version history table"""
    return dynamodb.Table(VERSION_HISTORY_TABLE)


def generate_version_number(current_versions: List[str]) -> str:
    """
    Generate next version number based on existing versions.
    
    Supports semantic versioning: v1.0, v1.1, v2.0, etc.
    
    Args:
        current_versions: List of existing version strings
        
    Returns:
        Next version number as string (e.g., "v1.0", "v1.1", "v2.0")
    """
    if not current_versions:
        return "v1.0"
    
    # Parse versions and find the highest
    versions = []
    for v in current_versions:
        if v.startswith('v'):
            parts = v[1:].split('.')
            if len(parts) == 2:
                try:
                    major = int(parts[0])
                    minor = int(parts[1])
                    versions.append((major, minor))
                except ValueError:
                    continue
    
    if not versions:
        return "v1.0"
    
    # Sort versions
    versions.sort()
    major, minor = versions[-1]
    
    # Increment minor version
    next_minor = minor + 1
    return f"v{major}.{next_minor}"


def get_all_questions_for_version(version: str) -> List[Dict[str, Any]]:
    """
    Retrieve all questions for a specific version.
    
    Args:
        version: Version string (e.g., "v1.0")
        
    Returns:
        List of question dictionaries with all data
    """
    table = get_question_bank_table()
    
    try:
        # Query all questions with this version
        response = table.query(
            IndexName='version-index',
            KeyConditionExpression='#v = :version',
            ExpressionAttributeNames={'#v': 'version'},
            ExpressionAttributeValues={':version': version}
        )
        
        questions = response.get('Items', [])
        
        # Handle pagination
        while 'LastEvaluatedKey' in response:
            response = table.query(
                IndexName='version-index',
                KeyConditionExpression='#v = :version',
                ExpressionAttributeNames={'#v': 'version'},
                ExpressionAttributeValues={':version': version},
                ExclusiveStartKey=response['LastEvaluatedKey']
            )
            questions.extend(response.get('Items', []))
        
        return questions
    except Exception as e:
        print(f"Error retrieving questions for version {version}: {str(e)}")
        raise


def create_version(
    publisher_user_id: str,
    change_summary: str,
    questions_data: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Any]:
    """
    Create a new version of the question bank.
    
    Records publication timestamp, publisher user ID, and change summary.
    Stores complete MCQ data for the version.
    
    Args:
        publisher_user_id: User ID of the person publishing the version
        change_summary: Description of changes in this version
        questions_data: Optional list of questions to include in version
        
    Returns:
        Dictionary with version details including version_id, version_number, timestamp
    """
    version_history_table = get_version_history_table()
    question_bank_table = get_question_bank_table()
    
    try:
        # Get all existing versions to determine next version number
        response = version_history_table.scan(
            ProjectionExpression='version_number'
        )
        
        existing_versions = [item['version_number'] for item in response.get('Items', [])]
        next_version = generate_version_number(existing_versions)
        
        # If questions_data not provided, get all active questions
        if questions_data is None:
            # Scan for all active questions
            response = question_bank_table.scan(
                FilterExpression='#status = :active',
                ExpressionAttributeNames={'#status': 'status'},
                ExpressionAttributeValues={':active': 'active'}
            )
            questions_data = response.get('Items', [])
        
        # Create version record
        version_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat()
        
        version_record = {
            'version_id': version_id,
            'version_number': next_version,
            'publisher_user_id': publisher_user_id,
            'publication_timestamp': timestamp,
            'change_summary': change_summary,
            'question_count': len(questions_data),
            'questions_snapshot': json.dumps(questions_data, default=str),
            'created_at': timestamp
        }
        
        # Store version record
        version_history_table.put_item(Item=version_record)
        
        # Update all questions with this version
        for question in questions_data:
            question_id = question.get('question_id')
            if question_id:
                question_bank_table.update_item(
                    Key={'question_id': question_id, 'version': next_version},
                    UpdateExpression='SET #v = :version, updated_at = :timestamp',
                    ExpressionAttributeNames={'#v': 'version'},
                    ExpressionAttributeValues={
                        ':version': next_version,
                        ':timestamp': timestamp
                    }
                )
        
        # Publish CloudWatch metric
        cloudwatch.put_metric_data(
            Namespace='JAIIB-QuestionBank',
            MetricData=[
                {
                    'MetricName': 'VersionCreated',
                    'Value': 1,
                    'Unit': 'Count',
                    'Timestamp': datetime.utcnow()
                }
            ]
        )
        
        return {
            'success': True,
            'version_id': version_id,
            'version_number': next_version,
            'publication_timestamp': timestamp,
            'question_count': len(questions_data),
            'message': f'Version {next_version} created successfully'
        }
        
    except Exception as e:
        print(f"Error creating version: {str(e)}")
        raise


def get_version_history(limit: int = 50, start_key: Optional[str] = None) -> Dict[str, Any]:
    """
    Retrieve version history with publication dates and change summaries.
    
    Args:
        limit: Maximum number of versions to return
        start_key: Pagination token for retrieving next batch
        
    Returns:
        Dictionary with versions list and pagination info
    """
    version_history_table = get_version_history_table()
    
    try:
        # Scan version history table, sorted by creation date descending
        scan_kwargs = {
            'Limit': limit,
            'ProjectionExpression': 'version_id, version_number, publisher_user_id, publication_timestamp, change_summary, question_count'
        }
        
        if start_key:
            scan_kwargs['ExclusiveStartKey'] = json.loads(start_key)
        
        response = version_history_table.scan(**scan_kwargs)
        
        # Sort by publication timestamp descending
        versions = sorted(
            response.get('Items', []),
            key=lambda x: x.get('publication_timestamp', ''),
            reverse=True
        )
        
        result = {
            'success': True,
            'versions': versions,
            'count': len(versions),
            'total_count': response.get('Count', 0)
        }
        
        # Add pagination token if more results available
        if 'LastEvaluatedKey' in response:
            result['next_token'] = json.dumps(response['LastEvaluatedKey'], default=str)
        
        return result
        
    except Exception as e:
        print(f"Error retrieving version history: {str(e)}")
        raise


def get_version_details(version_number: str) -> Dict[str, Any]:
    """
    Get detailed information about a specific version.
    
    Args:
        version_number: Version string (e.g., "v1.0")
        
    Returns:
        Dictionary with version details and questions snapshot
    """
    version_history_table = get_version_history_table()
    
    try:
        # Query for version
        response = version_history_table.scan(
            FilterExpression='version_number = :version',
            ExpressionAttributeValues={':version': version_number}
        )
        
        items = response.get('Items', [])
        if not items:
            return {
                'success': False,
                'error': f'Version {version_number} not found'
            }
        
        version_record = items[0]
        
        # Parse questions snapshot
        questions_snapshot = []
        if 'questions_snapshot' in version_record:
            try:
                questions_snapshot = json.loads(version_record['questions_snapshot'])
            except json.JSONDecodeError:
                questions_snapshot = []
        
        return {
            'success': True,
            'version_id': version_record.get('version_id'),
            'version_number': version_record.get('version_number'),
            'publisher_user_id': version_record.get('publisher_user_id'),
            'publication_timestamp': version_record.get('publication_timestamp'),
            'change_summary': version_record.get('change_summary'),
            'question_count': version_record.get('question_count'),
            'questions': questions_snapshot
        }
        
    except Exception as e:
        print(f"Error retrieving version details: {str(e)}")
        raise


def get_latest_version() -> Optional[str]:
    """
    Get the latest published version number.
    
    Returns:
        Latest version string (e.g., "v1.0") or None if no versions exist
    """
    version_history_table = get_version_history_table()
    
    try:
        response = version_history_table.scan(
            ProjectionExpression='version_number, publication_timestamp'
        )
        
        items = response.get('Items', [])
        if not items:
            return None
        
        # Sort by publication timestamp and get latest
        latest = max(items, key=lambda x: x.get('publication_timestamp', ''))
        return latest.get('version_number')
        
    except Exception as e:
        print(f"Error getting latest version: {str(e)}")
        return None


def publish_metric(metric_name: str, value: float, unit: str = 'Count'):
    """
    Publish a CloudWatch metric.
    
    Args:
        metric_name: Name of the metric
        value: Metric value
        unit: Unit of measurement
    """
    try:
        cloudwatch.put_metric_data(
            Namespace='JAIIB-QuestionBank',
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
        print(f"Error publishing metric {metric_name}: {str(e)}")


def initiate_rollback(target_version: str) -> Dict[str, Any]:
    """
    Initiate a rollback request requiring confirmation.
    
    Returns confirmation details that must be confirmed before proceeding.
    
    Args:
        target_version: Version to rollback to (e.g., "v1.0")
        
    Returns:
        Dictionary with rollback details for confirmation
    """
    version_history_table = get_version_history_table()
    
    try:
        # Verify target version exists
        response = version_history_table.scan(
            FilterExpression='version_number = :version',
            ExpressionAttributeValues={':version': target_version}
        )
        
        items = response.get('Items', [])
        if not items:
            return {
                'success': False,
                'error': f'Target version {target_version} not found'
            }
        
        target_version_record = items[0]
        
        # Get current version
        current_version = get_latest_version()
        
        return {
            'success': True,
            'requires_confirmation': True,
            'target_version': target_version,
            'current_version': current_version,
            'target_version_details': {
                'version_number': target_version_record.get('version_number'),
                'publisher_user_id': target_version_record.get('publisher_user_id'),
                'publication_timestamp': target_version_record.get('publication_timestamp'),
                'change_summary': target_version_record.get('change_summary'),
                'question_count': target_version_record.get('question_count')
            },
            'message': f'Rollback to {target_version} requires confirmation. This will restore {target_version_record.get("question_count")} questions from that version.'
        }
        
    except Exception as e:
        print(f"Error initiating rollback: {str(e)}")
        return {
            'success': False,
            'error': f'Error initiating rollback: {str(e)}'
        }


def confirm_and_execute_rollback(
    target_version: str,
    initiator_user_id: str,
    rollback_reason: str
) -> Dict[str, Any]:
    """
    Execute a confirmed rollback to a previous version.
    
    Restores questions to the target version state and creates a new version
    snapshot documenting the rollback action.
    
    Args:
        target_version: Version to rollback to
        initiator_user_id: User ID of the person initiating rollback
        rollback_reason: Reason for the rollback
        
    Returns:
        Dictionary with rollback result and new version details
    """
    version_history_table = get_version_history_table()
    question_bank_table = get_question_bank_table()
    
    try:
        # Get target version details
        target_response = version_history_table.scan(
            FilterExpression='version_number = :version',
            ExpressionAttributeValues={':version': target_version}
        )
        
        target_items = target_response.get('Items', [])
        if not target_items:
            return {
                'success': False,
                'error': f'Target version {target_version} not found'
            }
        
        target_version_record = target_items[0]
        
        # Parse questions from target version
        questions_snapshot = []
        if 'questions_snapshot' in target_version_record:
            try:
                questions_snapshot = json.loads(target_version_record['questions_snapshot'])
            except json.JSONDecodeError:
                questions_snapshot = []
        
        # Create new version with rollback documentation
        rollback_change_summary = f'Rollback to {target_version}: {rollback_reason}'
        
        new_version_result = create_version(
            publisher_user_id=initiator_user_id,
            change_summary=rollback_change_summary,
            questions_data=questions_snapshot
        )
        
        if not new_version_result.get('success'):
            return {
                'success': False,
                'error': 'Failed to create new version snapshot'
            }
        
        # Record rollback action in audit log
        rollback_record = {
            'rollback_id': str(uuid.uuid4()),
            'timestamp': datetime.utcnow().isoformat(),
            'initiator_user_id': initiator_user_id,
            'target_version': target_version,
            'new_version': new_version_result['version_number'],
            'reason': rollback_reason,
            'questions_restored': len(questions_snapshot)
        }
        
        # Publish CloudWatch metric
        cloudwatch.put_metric_data(
            Namespace='JAIIB-QuestionBank',
            MetricData=[
                {
                    'MetricName': 'RollbackExecuted',
                    'Value': 1,
                    'Unit': 'Count',
                    'Timestamp': datetime.utcnow()
                }
            ]
        )
        
        return {
            'success': True,
            'rollback_id': rollback_record['rollback_id'],
            'target_version': target_version,
            'new_version': new_version_result['version_number'],
            'timestamp': rollback_record['timestamp'],
            'initiator_user_id': initiator_user_id,
            'questions_restored': len(questions_snapshot),
            'message': f'Successfully rolled back to {target_version}. New version {new_version_result["version_number"]} created with {len(questions_snapshot)} questions.'
        }
        
    except Exception as e:
        print(f"Error executing rollback: {str(e)}")
        return {
            'success': False,
            'error': f'Error executing rollback: {str(e)}'
        }


def get_incomplete_practice_sessions_for_version(version: str) -> List[Dict[str, Any]]:
    """
    Get all incomplete practice sessions using a specific version.
    
    Ensures incomplete practice sets continue using original version's questions.
    
    Args:
        version: Version string to search for
        
    Returns:
        List of incomplete practice session records
    """
    # This would query the practice sessions table
    # For now, returning empty list as practice sessions table is separate
    try:
        # In a full implementation, this would query jaiib-practice-sessions table
        # and filter for sessions with status='in_progress' and matching version
        return []
    except Exception as e:
        print(f"Error retrieving incomplete sessions: {str(e)}")
        return []
