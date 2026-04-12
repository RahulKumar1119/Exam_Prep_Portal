"""
Question Bank Versioning and CRUD Lambda Function

Handles API requests for question bank operations:
- Create new versions
- Retrieve version history
- Get version details
- MCQ CRUD operations (create, read, update, delete)
- MCQ search with filtering
"""

import json
import os
from typing import Dict, Any, Tuple
from version_manager import (
    create_version,
    get_version_history,
    get_version_details,
    get_latest_version,
    publish_metric,
    initiate_rollback,
    confirm_and_execute_rollback
)
from crud_service import (
    create_mcq,
    get_mcq,
    update_mcq,
    delete_mcq,
    search_mcqs,
    get_mcq_versions
)


def validate_request(event: dict) -> Tuple[bool, str]:
    """
    Validate incoming request has required fields.
    
    Args:
        event: Lambda event
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    action = event.get('action')
    
    if not action:
        return False, "Missing 'action' parameter"
    
    if action == 'create_version':
        if not event.get('publisher_user_id'):
            return False, "Missing 'publisher_user_id'"
        if not event.get('change_summary'):
            return False, "Missing 'change_summary'"
    
    elif action == 'get_history':
        # Optional parameters only
        pass
    
    elif action == 'get_version_details':
        if not event.get('version_number'):
            return False, "Missing 'version_number'"
    
    elif action == 'get_latest_version':
        # No required parameters
        pass
    
    elif action == 'initiate_rollback':
        if not event.get('target_version'):
            return False, "Missing 'target_version'"
    
    elif action == 'confirm_rollback':
        if not event.get('target_version'):
            return False, "Missing 'target_version'"
        if not event.get('initiator_user_id'):
            return False, "Missing 'initiator_user_id'"
        if not event.get('rollback_reason'):
            return False, "Missing 'rollback_reason'"
    
    elif action == 'create_mcq':
        if not event.get('question_text'):
            return False, "Missing 'question_text'"
        if not event.get('options'):
            return False, "Missing 'options'"
        if not event.get('correct_answer'):
            return False, "Missing 'correct_answer'"
        if not event.get('topic'):
            return False, "Missing 'topic'"
        if not event.get('difficulty'):
            return False, "Missing 'difficulty'"
        if not event.get('references'):
            return False, "Missing 'references'"
        if not event.get('paper'):
            return False, "Missing 'paper'"
        if not event.get('creator_user_id'):
            return False, "Missing 'creator_user_id'"
    
    elif action == 'get_mcq':
        if not event.get('question_id'):
            return False, "Missing 'question_id'"
    
    elif action == 'update_mcq':
        if not event.get('question_id'):
            return False, "Missing 'question_id'"
        if not event.get('updater_user_id'):
            return False, "Missing 'updater_user_id'"
    
    elif action == 'delete_mcq':
        if not event.get('question_id'):
            return False, "Missing 'question_id'"
        if not event.get('deleter_user_id'):
            return False, "Missing 'deleter_user_id'"
    
    elif action == 'search_mcqs':
        # All parameters are optional
        pass
    
    elif action == 'get_mcq_versions':
        if not event.get('question_id'):
            return False, "Missing 'question_id'"
    
    else:
        return False, f"Unknown action: {action}"
    
    return True, ""


def error_response(status_code: int, message: str) -> Dict[str, Any]:
    """
    Generate error response.
    
    Args:
        status_code: HTTP status code
        message: Error message
        
    Returns:
        Lambda response dictionary
    """
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


def success_response(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate success response.
    
    Args:
        data: Response data
        
    Returns:
        Lambda response dictionary
    """
    return {
        'statusCode': 200,
        'body': json.dumps(data, default=str),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }


def handler(event, context):
    """
    Lambda handler for question bank operations.
    
    Args:
        event: Lambda event containing action and parameters
        context: Lambda context
        
    Returns:
        Lambda response with status code and body
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
        
        # Parse body if it's a string (from API Gateway)
        body = event.get('body', {})
        if isinstance(body, str):
            body = json.loads(body) if body else {}
        
        # Validate request
        is_valid, error_msg = validate_request({'body': body})
        if not is_valid:
            return error_response(400, error_msg)
        
        action = body.get('action')
        
        # Handle create_version action
        if action == 'create_version':
            publisher_user_id = event.get('publisher_user_id')
            change_summary = event.get('change_summary')
            questions_data = event.get('questions_data')
            
            result = create_version(
                publisher_user_id=publisher_user_id,
                change_summary=change_summary,
                questions_data=questions_data
            )
            
            publish_metric('VersionCreated', 1)
            return success_response(result)
        
        # Handle get_history action
        elif action == 'get_history':
            limit = event.get('limit', 50)
            start_key = event.get('start_key')
            
            result = get_version_history(limit=limit, start_key=start_key)
            return success_response(result)
        
        # Handle get_version_details action
        elif action == 'get_version_details':
            version_number = event.get('version_number')
            
            result = get_version_details(version_number)
            if not result.get('success'):
                return error_response(404, result.get('error'))
            
            return success_response(result)
        
        # Handle get_latest_version action
        elif action == 'get_latest_version':
            latest_version = get_latest_version()
            
            if not latest_version:
                return error_response(404, 'No versions found')
            
            return success_response({
                'success': True,
                'latest_version': latest_version
            })
        
        # Handle initiate_rollback action
        elif action == 'initiate_rollback':
            target_version = event.get('target_version')
            
            result = initiate_rollback(target_version)
            
            if not result.get('success'):
                return error_response(404, result.get('error'))
            
            return success_response(result)
        
        # Handle confirm_rollback action
        elif action == 'confirm_rollback':
            target_version = event.get('target_version')
            initiator_user_id = event.get('initiator_user_id')
            rollback_reason = event.get('rollback_reason')
            
            result = confirm_and_execute_rollback(
                target_version=target_version,
                initiator_user_id=initiator_user_id,
                rollback_reason=rollback_reason
            )
            
            if not result.get('success'):
                return error_response(400, result.get('error'))
            
            publish_metric('RollbackExecuted', 1)
            return success_response(result)
        
        # Handle create_mcq action
        elif action == 'create_mcq':
            result = create_mcq(
                question_text=event.get('question_text'),
                options=event.get('options'),
                correct_answer=event.get('correct_answer'),
                topic=event.get('topic'),
                difficulty=event.get('difficulty'),
                references=event.get('references'),
                paper=event.get('paper'),
                creator_user_id=event.get('creator_user_id')
            )
            
            if not result.get('success'):
                return error_response(400, result.get('error'))
            
            return success_response(result)
        
        # Handle get_mcq action
        elif action == 'get_mcq':
            question_id = event.get('question_id')
            version = event.get('version')
            
            result = get_mcq(question_id, version)
            
            if not result.get('success'):
                return error_response(404, result.get('error'))
            
            return success_response(result)
        
        # Handle update_mcq action
        elif action == 'update_mcq':
            result = update_mcq(
                question_id=event.get('question_id'),
                question_text=event.get('question_text'),
                options=event.get('options'),
                correct_answer=event.get('correct_answer'),
                topic=event.get('topic'),
                difficulty=event.get('difficulty'),
                references=event.get('references'),
                updater_user_id=event.get('updater_user_id')
            )
            
            if not result.get('success'):
                return error_response(400, result.get('error'))
            
            return success_response(result)
        
        # Handle delete_mcq action
        elif action == 'delete_mcq':
            result = delete_mcq(
                question_id=event.get('question_id'),
                deleter_user_id=event.get('deleter_user_id')
            )
            
            if not result.get('success'):
                return error_response(400, result.get('error'))
            
            return success_response(result)
        
        # Handle search_mcqs action
        elif action == 'search_mcqs':
            result = search_mcqs(
                paper=event.get('paper'),
                topic=event.get('topic'),
                difficulty=event.get('difficulty'),
                keyword=event.get('keyword'),
                limit=event.get('limit', 50),
                start_key=event.get('start_key')
            )
            
            if not result.get('success'):
                return error_response(400, result.get('error'))
            
            return success_response(result)
        
        # Handle get_mcq_versions action
        elif action == 'get_mcq_versions':
            result = get_mcq_versions(event.get('question_id'))
            
            if not result.get('success'):
                return error_response(400, result.get('error'))
            
            return success_response(result)
        
        else:
            return error_response(400, f"Unknown action: {action}")
    
    except Exception as e:
        print(f"Error in handler: {str(e)}")
        return error_response(500, f"Internal server error: {str(e)}")
