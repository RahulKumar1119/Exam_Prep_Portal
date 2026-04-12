"""
Dashboard Lambda Function for JAIIB-CAIIB Exam Prep Portal

Provides performance metrics and analytics for the user dashboard.
"""

import json
import os
from datetime import datetime, timedelta
from typing import Dict, Any

import boto3
from botocore.exceptions import ClientError

# Initialize AWS clients
dynamodb = boto3.resource('dynamodb')

# Environment variables
USERS_TABLE = os.environ.get('USERS_TABLE', 'jaiib-users')
SESSIONS_TABLE = os.environ.get('SESSIONS_TABLE', 'jaiib-practice-sessions')

# DynamoDB tables
users_table = dynamodb.Table(USERS_TABLE)
sessions_table = dynamodb.Table(SESSIONS_TABLE)


def get_user_performance(user_id: str) -> Dict[str, Any]:
    """Get user performance metrics."""
    try:
        # Query practice sessions for this user
        response = sessions_table.query(
            IndexName='user_id-index',
            KeyConditionExpression='user_id = :user_id',
            ExpressionAttributeValues={':user_id': user_id}
        )
        
        sessions = response.get('Items', [])
        
        if not sessions:
            # No sessions yet, return default metrics
            return {
                'overall_score': 0,
                'total_sessions': 0,
                'average_score': 0,
                'total_study_time': 0,
                'last_session_date': None,
            }
        
        # Calculate metrics
        total_score = 0
        total_time = 0
        completed_sessions = 0
        last_session_date = None
        
        for session in sessions:
            if session.get('status') == 'completed':
                score = session.get('score', 0)
                total_score += score
                completed_sessions += 1
                
                # Track last session date
                submitted_at = session.get('submitted_at')
                if submitted_at:
                    if not last_session_date or submitted_at > last_session_date:
                        last_session_date = submitted_at
            
            # Add time taken
            time_taken = session.get('time_taken', 0)
            total_time += time_taken
        
        average_score = total_score / completed_sessions if completed_sessions > 0 else 0
        overall_score = int(average_score)
        
        return {
            'overall_score': overall_score,
            'total_sessions': len(sessions),
            'average_score': int(average_score),
            'total_study_time': total_time,
            'last_session_date': last_session_date,
        }
    
    except ClientError as e:
        print(f"Error getting user performance: {e}")
        return {
            'overall_score': 0,
            'total_sessions': 0,
            'average_score': 0,
            'total_study_time': 0,
            'last_session_date': None,
        }


def get_paper_performance(user_id: str) -> list:
    """Get performance by paper."""
    try:
        response = sessions_table.query(
            IndexName='user_id-index',
            KeyConditionExpression='user_id = :user_id',
            ExpressionAttributeValues={':user_id': user_id}
        )
        
        sessions = response.get('Items', [])
        paper_stats = {}
        
        for session in sessions:
            if session.get('status') == 'completed':
                paper_name = session.get('paper_name', 'Unknown')
                score = session.get('score', 0)
                
                if paper_name not in paper_stats:
                    paper_stats[paper_name] = {
                        'scores': [],
                        'sessions': 0,
                    }
                
                paper_stats[paper_name]['scores'].append(score)
                paper_stats[paper_name]['sessions'] += 1
        
        # Convert to list format
        paper_performance = []
        for paper_name, stats in paper_stats.items():
            avg_score = sum(stats['scores']) / len(stats['scores']) if stats['scores'] else 0
            paper_performance.append({
                'paper_name': paper_name,
                'average_score': int(avg_score),
                'sessions_completed': stats['sessions'],
                'accuracy_by_topic': {},  # Placeholder
            })
        
        return paper_performance
    
    except ClientError as e:
        print(f"Error getting paper performance: {e}")
        return []


def get_weak_areas(user_id: str) -> list:
    """Get weak areas for the user."""
    # Placeholder implementation
    return ['Monetary Policy', 'Banking Regulation', 'Risk Management']


def get_strong_areas(user_id: str) -> list:
    """Get strong areas for the user."""
    # Placeholder implementation
    return ['General Banking', 'Customer Service', 'Compliance']


def get_trend_data(user_id: str) -> list:
    """Get score trend data over time."""
    try:
        response = sessions_table.query(
            IndexName='user_id-index',
            KeyConditionExpression='user_id = :user_id',
            ExpressionAttributeValues={':user_id': user_id}
        )
        
        sessions = response.get('Items', [])
        trend_data = []
        
        # Sort by date
        sorted_sessions = sorted(
            [s for s in sessions if s.get('status') == 'completed'],
            key=lambda x: x.get('submitted_at', '')
        )
        
        for session in sorted_sessions[-10:]:  # Last 10 sessions
            trend_data.append({
                'date': session.get('submitted_at', ''),
                'score': session.get('score', 0),
            })
        
        return trend_data
    
    except ClientError as e:
        print(f"Error getting trend data: {e}")
        return []


def get_dashboard_data(user_id: str) -> Dict[str, Any]:
    """Get complete dashboard data for user."""
    return {
        'metrics': get_user_performance(user_id),
        'paper_performance': get_paper_performance(user_id),
        'weak_areas': get_weak_areas(user_id),
        'strong_areas': get_strong_areas(user_id),
        'trend_data': get_trend_data(user_id),
    }


def success_response(status_code: int, data: Dict[str, Any]) -> Dict[str, Any]:
    """Return success response."""
    return {
        'statusCode': status_code,
        'body': json.dumps(data),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }


def error_response(status_code: int, message: str) -> Dict[str, Any]:
    """Return error response."""
    return {
        'statusCode': status_code,
        'body': json.dumps({'error': message}),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }


def handler(event, context):
    """Lambda handler for dashboard requests."""
    try:
        # Parse request
        http_method = event.get('httpMethod', 'GET')
        path = event.get('path', '')
        
        # Remove stage name from path if present
        if path.startswith('/prod/'):
            path = path[5:]
        
        # Handle CORS preflight requests
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
        
        # Get user ID from request context
        request_context = event.get('requestContext', {})
        authorizer = request_context.get('authorizer', {})
        user_id = authorizer.get('claims', {}).get('sub') if isinstance(authorizer, dict) else None
        
        # If no user ID from authorizer, try to get from path or query params
        if not user_id:
            query_params = event.get('queryStringParameters', {}) or {}
            user_id = query_params.get('user_id')
        
        if not user_id:
            return error_response(401, 'User ID not found in request')
        
        # Route to appropriate handler
        if path == '/dashboard/performance' and http_method == 'GET':
            dashboard_data = get_dashboard_data(user_id)
            return success_response(200, dashboard_data)
        else:
            return error_response(404, f'Endpoint not found: {path}')
    
    except Exception as e:
        print(f"Error: {e}")
        return error_response(500, 'Internal server error')
