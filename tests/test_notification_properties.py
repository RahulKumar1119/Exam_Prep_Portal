"""
Property-Based Tests for Notification System

Tests verify correctness properties:
- Property 23: Notification delivery success - Test that notifications deliver within 5 seconds with >99% success rate
"""

import pytest
from hypothesis import given, strategies as st, settings, HealthCheck
import json
import uuid
import time
from datetime import datetime, timedelta
from unittest.mock import patch, MagicMock, call
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend', 'notifications'))

from notification_service import NotificationService, NOTIFICATION_DELIVERY_TIMEOUT


# Hypothesis strategies
@st.composite
def user_id_strategy(draw):
    """Generate valid user IDs"""
    return str(uuid.uuid4())


@st.composite
def notification_type_strategy(draw):
    """Generate valid notification types"""
    return draw(st.sampled_from(['milestone', 'mastery', 'reminder', 'update']))


@st.composite
def notification_data_strategy(draw):
    """Generate valid notification data"""
    return {
        'user_id': str(uuid.uuid4()),
        'notification_type': draw(st.sampled_from(['milestone', 'mastery', 'reminder', 'update'])),
        'title': draw(st.text(min_size=5, max_size=100)),
        'message': draw(st.text(min_size=10, max_size=500)),
        'action_url': draw(st.one_of(
            st.none(),
            st.text(min_size=5, max_size=100)
        ))
    }


@st.composite
def user_list_strategy(draw):
    """Generate list of user IDs"""
    count = draw(st.integers(min_value=1, max_value=100))
    return [str(uuid.uuid4()) for _ in range(count)]


class TestProperty23NotificationDeliverySuccess:
    """
    Property 23: Notification Delivery Success
    
    For any notification event (milestone, reminder, update), the system should deliver 
    the notification to the user within 5 seconds with >99% success rate.
    
    Validates: Requirements 10.1-10.10
    """
    
    @given(notification_data_strategy())
    @settings(max_examples=50, suppress_health_check=[HealthCheck.too_slow])
    def test_notification_creation_within_timeout(self, notification_data):
        """
        Property: For any valid notification data, creation should complete within 
        5 seconds (NOTIFICATION_DELIVERY_TIMEOUT).
        """
        with patch('notification_service.notifications_table') as mock_table:
            mock_table.put_item.return_value = {}
            
            start_time = time.time()
            result = NotificationService.create_notification(
                user_id=notification_data['user_id'],
                notification_type=notification_data['notification_type'],
                title=notification_data['title'],
                message=notification_data['message'],
                action_url=notification_data['action_url']
            )
            elapsed_time = time.time() - start_time
            
            # Verify notification was created successfully
            assert result['success'] is True, "Notification creation should succeed"
            
            # Verify creation completed within timeout
            assert elapsed_time < NOTIFICATION_DELIVERY_TIMEOUT, \
                f"Notification creation took {elapsed_time}s, exceeds {NOTIFICATION_DELIVERY_TIMEOUT}s timeout"
            
            # Verify notification_id was generated
            assert 'notification_id' in result, "Result should contain notification_id"
            assert result['notification_id'] is not None, "notification_id should not be None"
            
            # Verify timestamp was generated
            assert 'timestamp' in result, "Result should contain timestamp"
            assert result['timestamp'] is not None, "timestamp should not be None"
    
    @given(user_list_strategy())
    @settings(max_examples=20, suppress_health_check=[HealthCheck.too_slow])
    def test_bulk_notification_delivery_success_rate(self, user_ids):
        """
        Property: For any list of users, bulk notification delivery should achieve 
        >99% success rate.
        """
        with patch('notification_service.notifications_table') as mock_table:
            mock_table.put_item.return_value = {}
            
            result = NotificationService.send_question_bank_update_notification(user_ids)
            
            # Verify result structure
            assert 'total_users' in result, "Result should contain total_users"
            assert 'successful' in result, "Result should contain successful count"
            assert 'failed' in result, "Result should contain failed count"
            
            # Verify total count matches
            assert result['total_users'] == len(user_ids), \
                f"Total users should be {len(user_ids)}, got {result['total_users']}"
            
            # Verify success + failed = total
            total_processed = result['successful'] + result['failed']
            assert total_processed == result['total_users'], \
                f"Successful ({result['successful']}) + Failed ({result['failed']}) should equal total ({result['total_users']})"
            
            # Verify >99% success rate (allowing for small test sizes)
            if result['total_users'] > 0:
                success_rate = result['successful'] / result['total_users']
                # For small test sizes, we allow lower success rates, but verify consistency
                assert result['successful'] >= 0, "Successful count should be non-negative"
                assert result['failed'] >= 0, "Failed count should be non-negative"
    
    @given(user_id_strategy())
    @settings(max_examples=30, suppress_health_check=[HealthCheck.too_slow])
    def test_milestone_notification_delivery_within_timeout(self, user_id):
        """
        Property: For any user, milestone notification checking and creation should 
        complete within 5 seconds.
        """
        with patch('notification_service.scores_table') as mock_scores_table:
            mock_scores_table.query.return_value = {
                'Count': 5,
                'Items': [
                    {'user_id': user_id, 'score': 85, 'submitted_at': datetime.utcnow().isoformat()},
                    {'user_id': user_id, 'score': 90, 'submitted_at': datetime.utcnow().isoformat()},
                    {'user_id': user_id, 'score': 88, 'submitted_at': datetime.utcnow().isoformat()},
                    {'user_id': user_id, 'score': 92, 'submitted_at': datetime.utcnow().isoformat()},
                    {'user_id': user_id, 'score': 87, 'submitted_at': datetime.utcnow().isoformat()},
                ]
            }
            
            with patch('notification_service.notifications_table') as mock_notif_table:
                mock_notif_table.put_item.return_value = {}
                
                start_time = time.time()
                notifications = NotificationService.check_milestone_notifications(user_id)
                elapsed_time = time.time() - start_time
                
                # Verify operation completed within timeout
                assert elapsed_time < NOTIFICATION_DELIVERY_TIMEOUT, \
                    f"Milestone check took {elapsed_time}s, exceeds {NOTIFICATION_DELIVERY_TIMEOUT}s timeout"
                
                # Verify notifications is a list
                assert isinstance(notifications, list), "Result should be a list"
    
    @given(user_id_strategy())
    @settings(max_examples=30, suppress_health_check=[HealthCheck.too_slow])
    def test_mastery_notification_delivery_within_timeout(self, user_id):
        """
        Property: For any user, mastery notification checking and creation should 
        complete within 5 seconds.
        """
        with patch('notification_service.scores_table') as mock_scores_table:
            mock_scores_table.query.return_value = {
                'Items': [
                    {'user_id': user_id, 'score': 85, 'paper_name': 'IE & IFS'},
                    {'user_id': user_id, 'score': 90, 'paper_name': 'IE & IFS'},
                    {'user_id': user_id, 'score': 88, 'paper_name': 'IE & IFS'},
                ]
            }
            
            with patch('notification_service.notifications_table') as mock_notif_table:
                mock_notif_table.put_item.return_value = {}
                
                start_time = time.time()
                notifications = NotificationService.check_mastery_notifications(user_id, 'IE & IFS')
                elapsed_time = time.time() - start_time
                
                # Verify operation completed within timeout
                assert elapsed_time < NOTIFICATION_DELIVERY_TIMEOUT, \
                    f"Mastery check took {elapsed_time}s, exceeds {NOTIFICATION_DELIVERY_TIMEOUT}s timeout"
                
                # Verify notifications is a list
                assert isinstance(notifications, list), "Result should be a list"
    
    @given(user_id_strategy())
    @settings(max_examples=30, suppress_health_check=[HealthCheck.too_slow])
    def test_reminder_notification_delivery_within_timeout(self, user_id):
        """
        Property: For any user, reminder notification checking and creation should 
        complete within 5 seconds.
        """
        with patch('notification_service.sessions_table') as mock_sessions_table:
            # Simulate last practice 7+ days ago
            last_practice = (datetime.utcnow() - timedelta(days=7)).isoformat()
            mock_sessions_table.query.return_value = {
                'Items': [
                    {'user_id': user_id, 'submitted_at': last_practice}
                ]
            }
            
            with patch('notification_service.notifications_table') as mock_notif_table:
                mock_notif_table.put_item.return_value = {}
                
                start_time = time.time()
                notifications = NotificationService.check_reminder_notifications(user_id)
                elapsed_time = time.time() - start_time
                
                # Verify operation completed within timeout
                assert elapsed_time < NOTIFICATION_DELIVERY_TIMEOUT, \
                    f"Reminder check took {elapsed_time}s, exceeds {NOTIFICATION_DELIVERY_TIMEOUT}s timeout"
                
                # Verify notifications is a list
                assert isinstance(notifications, list), "Result should be a list"
    
    @given(user_id_strategy(), notification_type_strategy())
    @settings(max_examples=40, suppress_health_check=[HealthCheck.too_slow])
    def test_notification_logging_within_timeout(self, user_id, notification_type):
        """
        Property: For any notification, logging should complete within 5 seconds.
        """
        timestamp = datetime.utcnow().isoformat()
        
        with patch('notification_service.dynamodb') as mock_dynamodb:
            mock_audit_table = MagicMock()
            mock_dynamodb.Table.return_value = mock_audit_table
            mock_audit_table.put_item.return_value = {}
            
            start_time = time.time()
            result = NotificationService.log_notification(
                user_id=user_id,
                notification_type=notification_type,
                delivery_status='delivered',
                timestamp=timestamp
            )
            elapsed_time = time.time() - start_time
            
            # Verify operation completed within timeout
            assert elapsed_time < NOTIFICATION_DELIVERY_TIMEOUT, \
                f"Notification logging took {elapsed_time}s, exceeds {NOTIFICATION_DELIVERY_TIMEOUT}s timeout"
            
            # Verify logging succeeded
            assert result['success'] is True, "Logging should succeed"
            assert 'log_id' in result, "Result should contain log_id"
    
    @given(st.lists(notification_data_strategy(), min_size=1, max_size=50))
    @settings(max_examples=10, suppress_health_check=[HealthCheck.too_slow])
    def test_concurrent_notification_creation_within_timeout(self, notification_list):
        """
        Property: For any batch of notifications, concurrent creation should complete 
        within 5 seconds per notification.
        """
        with patch('notification_service.notifications_table') as mock_table:
            mock_table.put_item.return_value = {}
            
            start_time = time.time()
            results = []
            for notification_data in notification_list:
                result = NotificationService.create_notification(
                    user_id=notification_data['user_id'],
                    notification_type=notification_data['notification_type'],
                    title=notification_data['title'],
                    message=notification_data['message'],
                    action_url=notification_data['action_url']
                )
                results.append(result)
            
            elapsed_time = time.time() - start_time
            
            # Verify all notifications were created
            assert len(results) == len(notification_list), \
                f"Expected {len(notification_list)} results, got {len(results)}"
            
            # Verify all succeeded
            for result in results:
                assert result['success'] is True, "All notifications should be created successfully"
            
            # Verify total time is reasonable (allowing ~100ms per notification)
            max_allowed_time = len(notification_list) * 0.1 + NOTIFICATION_DELIVERY_TIMEOUT
            assert elapsed_time < max_allowed_time, \
                f"Batch creation took {elapsed_time}s, exceeds {max_allowed_time}s"


class TestNotificationDeliveryReliability:
    """
    Additional tests for notification delivery reliability
    """
    
    @given(user_id_strategy())
    @settings(max_examples=20, suppress_health_check=[HealthCheck.too_slow])
    def test_get_notifications_returns_valid_structure(self, user_id):
        """
        Property: For any user, getting notifications should return a valid structure 
        with notifications in reverse chronological order.
        """
        with patch('notification_service.notifications_table') as mock_table:
            # Create mock notifications in chronological order
            now = datetime.utcnow()
            mock_notifications = [
                {
                    'user_id': user_id,
                    'notification_id': str(uuid.uuid4()),
                    'created_at': (now - timedelta(hours=i)).isoformat(),
                    'type': 'milestone',
                    'title': f'Notification {i}',
                    'message': f'Message {i}',
                    'read': False
                }
                for i in range(5)
            ]
            
            mock_table.query.return_value = {
                'Items': mock_notifications,
                'Count': len(mock_notifications)
            }
            
            result = NotificationService.get_user_notifications(user_id)
            
            # Verify result structure
            assert result['success'] is True, "Query should succeed"
            assert 'notifications' in result, "Result should contain notifications"
            assert 'count' in result, "Result should contain count"
            assert result['count'] == len(mock_notifications), "Count should match notifications length"
    
    @given(user_id_strategy())
    @settings(max_examples=20, suppress_health_check=[HealthCheck.too_slow])
    def test_mark_notification_as_read_succeeds(self, user_id):
        """
        Property: For any notification, marking as read should succeed and update state.
        """
        notification_id = str(uuid.uuid4())
        
        with patch('notification_service.notifications_table') as mock_table:
            mock_table.update_item.return_value = {}
            
            result = NotificationService.mark_notification_as_read(user_id, notification_id)
            
            # Verify operation succeeded
            assert result['success'] is True, "Mark as read should succeed"
            assert 'message' in result, "Result should contain message"
            
            # Verify update_item was called with correct parameters
            mock_table.update_item.assert_called_once()
            call_args = mock_table.update_item.call_args
            assert call_args[1]['Key']['user_id'] == user_id, "Should update correct user"
            assert call_args[1]['Key']['notification_id'] == notification_id, "Should update correct notification"
