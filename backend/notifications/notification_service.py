"""
Notification Service

Implements event-driven notification system with:
- Milestone notifications (5 sets, 10 sets completed)
- Mastery notifications (≥80% average on paper)
- Reminder notifications (7 days without practice)
- Question bank update notifications
- Comprehensive logging with user ID, type, timestamp, delivery status
"""

import json
import uuid
import time
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import boto3
from decimal import Decimal

# AWS clients
dynamodb = boto3.resource('dynamodb')
notifications_table = dynamodb.Table('Notifications')
users_table = dynamodb.Table('Users')
scores_table = dynamodb.Table('Scores')
sessions_table = dynamodb.Table('PracticeSessions')
ses_client = boto3.client('ses')

# Constants
MILESTONE_5_SETS = 5
MILESTONE_10_SETS = 10
MASTERY_THRESHOLD = 0.80  # 80% average
REMINDER_DAYS = 7
NOTIFICATION_DELIVERY_TIMEOUT = 5  # seconds


class NotificationService:
    """Service for managing notifications"""
    
    @staticmethod
    def create_notification(
        user_id: str,
        notification_type: str,
        title: str,
        message: str,
        action_url: Optional[str] = None,
        delivery_status: str = "pending"
    ) -> Dict[str, Any]:
        """
        Create and store a notification
        
        Args:
            user_id: User ID
            notification_type: Type of notification (milestone, mastery, reminder, update)
            title: Notification title
            message: Notification message
            action_url: Optional URL for action
            delivery_status: Initial delivery status (pending, delivered, failed)
        
        Returns:
            Notification record
        """
        notification_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat()
        
        notification = {
            'user_id': user_id,
            'notification_id': notification_id,
            'type': notification_type,
            'title': title,
            'message': message,
            'read': False,
            'created_at': timestamp,
            'action_url': action_url,
            'delivery_status': delivery_status
        }
        
        try:
            notifications_table.put_item(Item=notification)
            return {
                'success': True,
                'notification_id': notification_id,
                'timestamp': timestamp
            }
        except Exception as e:
            print(f"Error creating notification: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    @staticmethod
    def check_milestone_notifications(user_id: str) -> List[Dict[str, Any]]:
        """
        Check and create milestone notifications
        
        Checks for:
        - 5 practice sets completed
        - 10 practice sets completed
        """
        notifications_created = []
        
        try:
            # Get user's completed sessions count
            response = scores_table.query(
                KeyConditionExpression='user_id = :user_id',
                ExpressionAttributeValues={':user_id': user_id},
                Select='COUNT'
            )
            
            completed_count = response.get('Count', 0)
            
            # Check for 5 sets milestone
            if completed_count == MILESTONE_5_SETS:
                result = NotificationService.create_notification(
                    user_id=user_id,
                    notification_type='milestone',
                    title='5 Practice Sets Completed!',
                    message='Great progress! You have completed 5 practice sets. Keep up the momentum!',
                    action_url='/dashboard'
                )
                if result['success']:
                    notifications_created.append(result)
            
            # Check for 10 sets milestone
            elif completed_count == MILESTONE_10_SETS:
                result = NotificationService.create_notification(
                    user_id=user_id,
                    notification_type='milestone',
                    title='10 Practice Sets Completed!',
                    message='Congratulations! You have completed 10 practice sets. You are on your way to mastery!',
                    action_url='/dashboard'
                )
                if result['success']:
                    notifications_created.append(result)
            
            return notifications_created
            
        except Exception as e:
            print(f"Error checking milestone notifications: {str(e)}")
            return []
    
    @staticmethod
    def check_mastery_notifications(user_id: str, paper_name: str) -> List[Dict[str, Any]]:
        """
        Check and create mastery notifications
        
        Checks for ≥80% average score on a paper
        """
        notifications_created = []
        
        try:
            # Get user's scores for the paper
            response = scores_table.query(
                KeyConditionExpression='user_id = :user_id',
                FilterExpression='paper_name = :paper',
                ExpressionAttributeValues={
                    ':user_id': user_id,
                    ':paper': paper_name
                }
            )
            
            items = response.get('Items', [])
            
            if not items:
                return []
            
            # Calculate average score
            total_score = sum(Decimal(item.get('score', 0)) for item in items)
            average_score = float(total_score) / len(items)
            
            # Check if mastery threshold reached
            if average_score >= MASTERY_THRESHOLD * 100:
                result = NotificationService.create_notification(
                    user_id=user_id,
                    notification_type='mastery',
                    title=f'Mastery Achieved on {paper_name}!',
                    message=f'Excellent! You have achieved an average score of {average_score:.1f}% on {paper_name}. You have mastered this paper!',
                    action_url=f'/dashboard?paper={paper_name}'
                )
                if result['success']:
                    notifications_created.append(result)
            
            return notifications_created
            
        except Exception as e:
            print(f"Error checking mastery notifications: {str(e)}")
            return []
    
    @staticmethod
    def check_reminder_notifications(user_id: str) -> List[Dict[str, Any]]:
        """
        Check and create reminder notifications
        
        Checks for 7 days without practice
        """
        notifications_created = []
        
        try:
            # Get user's last practice session
            response = sessions_table.query(
                KeyConditionExpression='user_id = :user_id',
                ExpressionAttributeValues={':user_id': user_id},
                ScanIndexForward=False,  # Sort descending by timestamp
                Limit=1
            )
            
            items = response.get('Items', [])
            
            if not items:
                # No practice sessions yet, don't send reminder
                return []
            
            last_session = items[0]
            last_practice_time = datetime.fromisoformat(last_session.get('submitted_at', datetime.utcnow().isoformat()))
            days_since_practice = (datetime.utcnow() - last_practice_time).days
            
            # Check if 7 days have passed
            if days_since_practice >= REMINDER_DAYS:
                result = NotificationService.create_notification(
                    user_id=user_id,
                    notification_type='reminder',
                    title='Time to Practice!',
                    message=f'It has been {days_since_practice} days since your last practice session. Come back and continue your learning journey!',
                    action_url='/practice'
                )
                if result['success']:
                    notifications_created.append(result)
            
            return notifications_created
            
        except Exception as e:
            print(f"Error checking reminder notifications: {str(e)}")
            return []
    
    @staticmethod
    def send_question_bank_update_notification(user_ids: List[str]) -> Dict[str, Any]:
        """
        Send question bank update notification to all users
        
        Called when a new question bank version is published
        """
        results = {
            'total_users': len(user_ids),
            'successful': 0,
            'failed': 0,
            'notifications': []
        }
        
        for user_id in user_ids:
            try:
                result = NotificationService.create_notification(
                    user_id=user_id,
                    notification_type='update',
                    title='New Questions Available!',
                    message='A new version of the question bank has been published with updated questions. Check them out!',
                    action_url='/practice'
                )
                
                if result['success']:
                    results['successful'] += 1
                    results['notifications'].append(result)
                else:
                    results['failed'] += 1
                    
            except Exception as e:
                print(f"Error sending update notification to {user_id}: {str(e)}")
                results['failed'] += 1
        
        return results
    
    @staticmethod
    def get_user_notifications(
        user_id: str,
        limit: int = 50,
        start_key: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Get user's notifications in reverse chronological order
        
        Args:
            user_id: User ID
            limit: Maximum number of notifications to return
            start_key: Pagination start key
        
        Returns:
            List of notifications and pagination info
        """
        try:
            query_params = {
                'KeyConditionExpression': 'user_id = :user_id',
                'ExpressionAttributeValues': {':user_id': user_id},
                'ScanIndexForward': False,  # Reverse chronological order
                'Limit': limit
            }
            
            if start_key:
                query_params['ExclusiveStartKey'] = start_key
            
            response = notifications_table.query(**query_params)
            
            return {
                'success': True,
                'notifications': response.get('Items', []),
                'count': len(response.get('Items', [])),
                'last_evaluated_key': response.get('LastEvaluatedKey')
            }
            
        except Exception as e:
            print(f"Error getting notifications: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    @staticmethod
    def mark_notification_as_read(user_id: str, notification_id: str) -> Dict[str, Any]:
        """
        Mark a notification as read
        
        Args:
            user_id: User ID
            notification_id: Notification ID
        
        Returns:
            Update result
        """
        try:
            notifications_table.update_item(
                Key={
                    'user_id': user_id,
                    'notification_id': notification_id
                },
                UpdateExpression='SET #read = :read',
                ExpressionAttributeNames={'#read': 'read'},
                ExpressionAttributeValues={':read': True}
            )
            
            return {
                'success': True,
                'message': 'Notification marked as read'
            }
            
        except Exception as e:
            print(f"Error marking notification as read: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    @staticmethod
    def send_email_notification(
        user_email: str,
        subject: str,
        message: str
    ) -> Dict[str, Any]:
        """
        Send email notification (optional, user opt-in)
        
        Args:
            user_email: User's email address
            subject: Email subject
            message: Email message
        
        Returns:
            Send result
        """
        try:
            response = ses_client.send_email(
                Source='noreply@jaiib-caiib.com',
                Destination={'ToAddresses': [user_email]},
                Message={
                    'Subject': {'Data': subject},
                    'Body': {'Html': {'Data': message}}
                }
            )
            
            return {
                'success': True,
                'message_id': response.get('MessageId')
            }
            
        except Exception as e:
            print(f"Error sending email notification: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    @staticmethod
    def log_notification(
        user_id: str,
        notification_type: str,
        delivery_status: str,
        timestamp: str
    ) -> Dict[str, Any]:
        """
        Log notification delivery for audit purposes
        
        Args:
            user_id: User ID
            notification_type: Type of notification
            delivery_status: Delivery status (delivered, failed, pending)
            timestamp: Timestamp of notification
        
        Returns:
            Log result
        """
        try:
            log_entry = {
                'log_id': str(uuid.uuid4()),
                'user_id': user_id,
                'notification_type': notification_type,
                'delivery_status': delivery_status,
                'timestamp': timestamp,
                'logged_at': datetime.utcnow().isoformat()
            }
            
            # Log to audit logs table if available
            audit_logs_table = dynamodb.Table('AuditLogs')
            audit_logs_table.put_item(Item=log_entry)
            
            return {
                'success': True,
                'log_id': log_entry['log_id']
            }
            
        except Exception as e:
            print(f"Error logging notification: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
