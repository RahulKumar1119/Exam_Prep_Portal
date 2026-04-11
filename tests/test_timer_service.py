"""
Unit tests for Timer Service Lambda Function

Tests cover:
- Timer status retrieval
- Timer color changes at thresholds
- Timer formatting (MM:SS)
- Auto-submission at timeout
- Inactivity timeout handling
"""

import pytest
import json
import uuid
import time
from unittest.mock import patch, MagicMock
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend', 'practice'))

from timer_service import (
    get_timer_status,
    update_timer_status,
    check_session_timeout,
    prepare_auto_submit,
    get_timer_color,
    format_time,
    TOTAL_SESSION_TIME,
    YELLOW_THRESHOLD,
    RED_THRESHOLD,
    INACTIVITY_TIMEOUT
)


class TestTimerFormatting:
    """Test timer formatting utilities"""
    
    def test_format_time_10_minutes(self):
        """Test formatting 10 minutes (600 seconds)"""
        result = format_time(600)
        assert result == "10:00"
    
    def test_format_time_5_minutes(self):
        """Test formatting 5 minutes (300 seconds)"""
        result = format_time(300)
        assert result == "05:00"
    
    def test_format_time_1_minute(self):
        """Test formatting 1 minute (60 seconds)"""
        result = format_time(60)
        assert result == "01:00"
    
    def test_format_time_1_minute_5_seconds(self):
        """Test formatting 1 minute 5 seconds (65 seconds)"""
        result = format_time(65)
        assert result == "01:05"
    
    def test_format_time_5_seconds(self):
        """Test formatting 5 seconds"""
        result = format_time(5)
        assert result == "00:05"
    
    def test_format_time_0_seconds(self):
        """Test formatting 0 seconds"""
        result = format_time(0)
        assert result == "00:00"
    
    def test_format_time_with_leading_zeros(self):
        """Test that leading zeros are included"""
        result = format_time(125)  # 2 minutes 5 seconds
        assert result == "02:05"
        assert result[0] == '0'  # First digit is 0


class TestTimerColor:
    """Test timer color determination"""
    
    def test_timer_color_green_above_5_minutes(self):
        """Test green color for >5 minutes"""
        assert get_timer_color(301) == 'green'
        assert get_timer_color(600) == 'green'
    
    def test_timer_color_yellow_between_1_and_5_minutes(self):
        """Test yellow color for 1-5 minutes"""
        assert get_timer_color(300) == 'yellow'
        assert get_timer_color(150) == 'yellow'
        assert get_timer_color(61) == 'yellow'
    
    def test_timer_color_red_below_1_minute(self):
        """Test red color for <1 minute"""
        assert get_timer_color(60) == 'red'
        assert get_timer_color(30) == 'red'
        assert get_timer_color(1) == 'red'
        assert get_timer_color(0) == 'red'


class TestTimerStatus:
    """Test timer status retrieval"""
    
    @patch('timer_service.sessions_table')
    def test_get_timer_status_returns_correct_format(self, mock_sessions):
        """Test that timer status returns all required fields"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        current_time = int(time.time())
        
        mock_sessions.get_item.return_value = {
            'Item': {
                'session_id': session_id,
                'user_id': user_id,
                'status': 'in_progress',
                'expires_at': current_time + 300,  # 5 minutes remaining
                'created_at': current_time
            }
        }
        
        result = get_timer_status(session_id, user_id)
        
        assert result['statusCode'] == 200
        body = json.loads(result['body'])
        assert 'remaining_time' in body
        assert 'total_time' in body
        assert 'status' in body
        assert 'color' in body
        assert 'formatted_time' in body
        assert 'show_warning' in body
    
    @patch('timer_service.sessions_table')
    def test_get_timer_status_calculates_remaining_time(self, mock_sessions):
        """Test that remaining time is calculated correctly"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        current_time = int(time.time())
        expires_at = current_time + 300
        
        mock_sessions.get_item.return_value = {
            'Item': {
                'session_id': session_id,
                'user_id': user_id,
                'status': 'in_progress',
                'expires_at': expires_at,
                'created_at': current_time
            }
        }
        
        result = get_timer_status(session_id, user_id)
        
        assert result['statusCode'] == 200
        body = json.loads(result['body'])
        assert body['remaining_time'] == 300
        assert body['formatted_time'] == "05:00"
    
    @patch('timer_service.sessions_table')
    def test_get_timer_status_shows_warning_at_red_threshold(self, mock_sessions):
        """Test that warning is shown when timer is red"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        current_time = int(time.time())
        
        mock_sessions.get_item.return_value = {
            'Item': {
                'session_id': session_id,
                'user_id': user_id,
                'status': 'in_progress',
                'expires_at': current_time + 30,  # 30 seconds remaining
                'created_at': current_time
            }
        }
        
        result = get_timer_status(session_id, user_id)
        
        assert result['statusCode'] == 200
        body = json.loads(result['body'])
        assert body['show_warning'] == True
        assert body['color'] == 'red'
    
    @patch('timer_service.sessions_table')
    def test_get_timer_status_returns_404_for_missing_session(self, mock_sessions):
        """Test that missing sessions return 404"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        
        mock_sessions.get_item.return_value = {}
        
        result = get_timer_status(session_id, user_id)
        
        assert result['statusCode'] == 404


class TestTimerUpdate:
    """Test timer update functionality"""
    
    @patch('timer_service.sessions_table')
    def test_update_timer_status_returns_running_status(self, mock_sessions):
        """Test that running timer returns correct status"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        current_time = int(time.time())
        
        mock_sessions.get_item.return_value = {
            'Item': {
                'session_id': session_id,
                'user_id': user_id,
                'status': 'in_progress',
                'expires_at': current_time + 300,
                'created_at': current_time
            }
        }
        
        result = update_timer_status(session_id, user_id, current_time)
        
        assert result['statusCode'] == 200
        body = json.loads(result['body'])
        assert body['status'] == 'running'
        assert body['should_auto_submit'] == False
    
    @patch('timer_service.sessions_table')
    def test_update_timer_status_auto_submits_at_zero(self, mock_sessions):
        """Test that timer auto-submits when reaching 0"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        current_time = int(time.time())
        
        mock_sessions.get_item.return_value = {
            'Item': {
                'session_id': session_id,
                'user_id': user_id,
                'status': 'in_progress',
                'expires_at': current_time,  # Timer at 0
                'created_at': current_time - 600
            }
        }
        
        result = update_timer_status(session_id, user_id, current_time)
        
        assert result['statusCode'] == 200
        body = json.loads(result['body'])
        assert body['status'] == 'expired'
        assert body['should_auto_submit'] == True
        assert body['remaining_time'] == 0
        assert body['formatted_time'] == "00:00"
    
    @patch('timer_service.sessions_table')
    def test_update_timer_status_shows_warning_message(self, mock_sessions):
        """Test that warning message is shown at red threshold"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        current_time = int(time.time())
        
        mock_sessions.get_item.return_value = {
            'Item': {
                'session_id': session_id,
                'user_id': user_id,
                'status': 'in_progress',
                'expires_at': current_time + 30,  # 30 seconds
                'created_at': current_time - 570
            }
        }
        
        result = update_timer_status(session_id, user_id, current_time)
        
        assert result['statusCode'] == 200
        body = json.loads(result['body'])
        assert body['warning_message'] is not None
        assert 'seconds remaining' in body['warning_message']


class TestSessionTimeout:
    """Test session timeout checking"""
    
    @patch('timer_service.sessions_table')
    def test_check_session_timeout_detects_expired_session(self, mock_sessions):
        """Test that expired sessions are detected"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        current_time = int(time.time())
        
        mock_sessions.get_item.return_value = {
            'Item': {
                'session_id': session_id,
                'user_id': user_id,
                'status': 'in_progress',
                'expires_at': current_time - 100,  # Expired 100 seconds ago
                'created_at': current_time - 700,
                'last_updated': current_time - 100
            }
        }
        
        result = check_session_timeout(session_id, user_id)
        
        assert result['statusCode'] == 200
        body = json.loads(result['body'])
        assert body['is_expired'] == True
    
    @patch('timer_service.sessions_table')
    def test_check_session_timeout_detects_inactivity(self, mock_sessions):
        """Test that inactivity timeout is detected"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        current_time = int(time.time())
        
        mock_sessions.get_item.return_value = {
            'Item': {
                'session_id': session_id,
                'user_id': user_id,
                'status': 'in_progress',
                'expires_at': current_time + 300,
                'created_at': current_time - 600,
                'last_updated': current_time - 400  # Inactive for 400 seconds (>5 min)
            }
        }
        
        result = check_session_timeout(session_id, user_id)
        
        assert result['statusCode'] == 200
        body = json.loads(result['body'])
        assert body['is_inactive'] == True
        assert body['inactivity_duration'] > INACTIVITY_TIMEOUT


class TestAutoSubmit:
    """Test auto-submission functionality"""
    
    @patch('timer_service.sessions_table')
    def test_prepare_auto_submit_marks_session(self, mock_sessions):
        """Test that auto-submit marks session correctly"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        current_time = int(time.time())
        
        mock_sessions.get_item.return_value = {
            'Item': {
                'session_id': session_id,
                'user_id': user_id,
                'status': 'in_progress',
                'expires_at': current_time,  # Timer at 0
                'user_answers': {'q1': 'A', 'q2': 'B'},
                'created_at': current_time - 600
            }
        }
        
        result = prepare_auto_submit(session_id, user_id)
        
        assert result['statusCode'] == 200
        body = json.loads(result['body'])
        assert body['auto_submitted'] == True
        assert body['message'] == 'Session auto-submitted'
    
    @patch('timer_service.sessions_table')
    def test_prepare_auto_submit_rejects_running_timer(self, mock_sessions):
        """Test that auto-submit is rejected if timer is still running"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        current_time = int(time.time())
        
        mock_sessions.get_item.return_value = {
            'Item': {
                'session_id': session_id,
                'user_id': user_id,
                'status': 'in_progress',
                'expires_at': current_time + 100,  # Timer still running
                'created_at': current_time - 500
            }
        }
        
        result = prepare_auto_submit(session_id, user_id)
        
        assert result['statusCode'] == 400
        body = json.loads(result['body'])
        assert 'Timer has not reached 0' in body['error']


class TestErrorHandling:
    """Test error handling"""
    
    @patch('timer_service.sessions_table')
    def test_get_timer_status_handles_missing_session(self, mock_sessions):
        """Test handling of missing session"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        
        mock_sessions.get_item.return_value = {}
        
        result = get_timer_status(session_id, user_id)
        
        assert result['statusCode'] == 404
    
    @patch('timer_service.sessions_table')
    def test_update_timer_status_handles_missing_session(self, mock_sessions):
        """Test handling of missing session during update"""
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        
        mock_sessions.get_item.return_value = {}
        
        result = update_timer_status(session_id, user_id)
        
        assert result['statusCode'] == 404
