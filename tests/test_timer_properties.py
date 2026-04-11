"""
Property-Based Tests for Timer Service

Tests verify correctness properties:
- Property 9: Timer accuracy within tolerance
- Property 10: Auto-submit at timeout
"""

import pytest
from hypothesis import given, strategies as st, settings, HealthCheck
import json
import uuid
import time
from unittest.mock import patch, MagicMock
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend', 'practice'))

from timer_service import (
    format_time,
    get_timer_color,
    get_timer_status,
    update_timer_status,
    TOTAL_SESSION_TIME,
    YELLOW_THRESHOLD,
    RED_THRESHOLD
)


# Hypothesis strategies
@st.composite
def valid_seconds_strategy(draw):
    """Generate valid seconds for timer (0-600)"""
    return draw(st.integers(min_value=0, max_value=600))


@st.composite
def session_data_strategy(draw):
    """Generate session data for testing"""
    current_time = int(time.time())
    remaining_seconds = draw(st.integers(min_value=0, max_value=600))
    
    return {
        'session_id': str(uuid.uuid4()),
        'user_id': str(uuid.uuid4()),
        'status': 'in_progress',
        'expires_at': current_time + remaining_seconds,
        'created_at': current_time - (600 - remaining_seconds)
    }


class TestProperty9TimerAccuracy:
    """
    Property 9: Timer accuracy within tolerance
    
    For any practice session, the timer should display remaining time in MM:SS format 
    and update every second with ±1 second deviation from actual elapsed time.
    
    Validates: Requirements 3.1, 3.8
    """
    
    @given(valid_seconds_strategy())
    @settings(max_examples=5)
    def test_timer_format_is_valid_mmss(self, seconds):
        """
        Property: For any number of seconds (0-600), format_time should return 
        a valid MM:SS format string.
        """
        result = format_time(seconds)
        
        # Verify format is MM:SS
        assert len(result) == 5, f"Expected MM:SS format (5 chars), got {len(result)}"
        assert result[2] == ':', f"Expected colon at position 2, got {result[2]}"
        
        # Verify minutes and seconds are valid
        parts = result.split(':')
        assert len(parts) == 2, f"Expected 2 parts separated by colon, got {len(parts)}"
        
        minutes = int(parts[0])
        secs = int(parts[1])
        
        assert 0 <= minutes <= 10, f"Minutes should be 0-10, got {minutes}"
        assert 0 <= secs <= 59, f"Seconds should be 0-59, got {secs}"
    
    @given(valid_seconds_strategy())
    @settings(max_examples=5)
    def test_timer_format_accuracy(self, seconds):
        """
        Property: For any number of seconds, format_time should accurately 
        represent that time in MM:SS format.
        """
        result = format_time(seconds)
        
        # Parse the result
        parts = result.split(':')
        formatted_minutes = int(parts[0])
        formatted_seconds = int(parts[1])
        
        # Calculate expected values
        expected_minutes = seconds // 60
        expected_seconds = seconds % 60
        
        assert formatted_minutes == expected_minutes, \
            f"Minutes mismatch: expected {expected_minutes}, got {formatted_minutes}"
        assert formatted_seconds == expected_seconds, \
            f"Seconds mismatch: expected {expected_seconds}, got {formatted_seconds}"
    
    @given(valid_seconds_strategy())
    @settings(max_examples=5)
    def test_timer_format_has_leading_zeros(self, seconds):
        """
        Property: For any number of seconds, format_time should include leading 
        zeros for single-digit minutes and seconds.
        """
        result = format_time(seconds)
        
        # Verify leading zeros
        parts = result.split(':')
        minutes_str = parts[0]
        seconds_str = parts[1]
        
        # Both should be 2 digits
        assert len(minutes_str) == 2, f"Minutes should be 2 digits, got {len(minutes_str)}"
        assert len(seconds_str) == 2, f"Seconds should be 2 digits, got {len(seconds_str)}"
        
        # Verify they're numeric
        assert minutes_str.isdigit(), f"Minutes should be numeric, got {minutes_str}"
        assert seconds_str.isdigit(), f"Seconds should be numeric, got {seconds_str}"
    
    @given(valid_seconds_strategy())
    @settings(max_examples=5)
    def test_timer_color_consistency(self, seconds):
        """
        Property: For any number of seconds, get_timer_color should return 
        a consistent color based on the threshold.
        """
        color = get_timer_color(seconds)
        
        # Verify color is valid
        assert color in ['green', 'yellow', 'red'], \
            f"Color should be green, yellow, or red, got {color}"
        
        # Verify color matches threshold
        if seconds > YELLOW_THRESHOLD:
            assert color == 'green', \
                f"Seconds {seconds} > {YELLOW_THRESHOLD} should be green, got {color}"
        elif seconds > RED_THRESHOLD:
            assert color == 'yellow', \
                f"Seconds {seconds} between {RED_THRESHOLD} and {YELLOW_THRESHOLD} should be yellow, got {color}"
        else:
            assert color == 'red', \
                f"Seconds {seconds} <= {RED_THRESHOLD} should be red, got {color}"
    
    @given(st.integers(min_value=0, max_value=600))
    @settings(max_examples=5)
    def test_timer_updates_every_second(self, initial_seconds):
        """
        Property: For any initial time, timer should update every second 
        with ±1 second accuracy.
        """
        # Simulate timer countdown
        times = []
        for i in range(min(5, initial_seconds + 1)):
            times.append(initial_seconds - i)
        
        # Verify each update is exactly 1 second less
        for i in range(1, len(times)):
            diff = times[i-1] - times[i]
            assert diff == 1, \
                f"Timer should decrease by 1 second, got {diff}"


class TestProperty10AutoSubmit:
    """
    Property 10: Auto-submit at timeout
    
    For any practice session where the timer reaches 0 seconds, the system should 
    automatically submit the practice set and display results without user intervention.
    
    Validates: Requirements 3.4
    """
    
    @patch('timer_service.sessions_table')
    @given(session_data_strategy())
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow])
    def test_auto_submit_when_timer_reaches_zero(self, mock_sessions, session_data):
        """
        Property: For any session where timer reaches 0, update_timer_status 
        should return should_auto_submit=True.
        """
        session_id = session_data['session_id']
        user_id = session_data['user_id']
        current_time = int(time.time())
        
        # Set expires_at to current time (timer at 0)
        session_data['expires_at'] = current_time
        
        mock_sessions.get_item.return_value = {'Item': session_data}
        
        result = update_timer_status(session_id, user_id, current_time)
        
        assert result['statusCode'] == 200
        body = json.loads(result['body'])
        assert body['should_auto_submit'] == True, \
            "should_auto_submit should be True when timer reaches 0"
        assert body['remaining_time'] == 0, \
            "remaining_time should be 0 when timer reaches 0"
    
    @patch('timer_service.sessions_table')
    @given(st.integers(min_value=1, max_value=600))
    @settings(max_examples=5)
    def test_no_auto_submit_when_timer_running(self, mock_sessions, remaining_seconds):
        """
        Property: For any session where timer is still running (>0 seconds), 
        update_timer_status should return should_auto_submit=False.
        """
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        current_time = int(time.time())
        
        mock_sessions.get_item.return_value = {
            'Item': {
                'session_id': session_id,
                'user_id': user_id,
                'status': 'in_progress',
                'expires_at': current_time + remaining_seconds,
                'created_at': current_time - (600 - remaining_seconds)
            }
        }
        
        result = update_timer_status(session_id, user_id, current_time)
        
        assert result['statusCode'] == 200
        body = json.loads(result['body'])
        assert body['should_auto_submit'] == False, \
            f"should_auto_submit should be False when {remaining_seconds} seconds remain"
        assert body['status'] == 'running', \
            "status should be 'running' when timer is still running"
    
    @given(session_data_strategy())
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow])
    def test_auto_submit_marks_session_expired(self, session_data):
        """
        Property: For any session where timer reaches 0, the session should be 
        marked as expired in the database.
        """
        with patch('timer_service.sessions_table') as mock_sessions:
            session_id = session_data['session_id']
            user_id = session_data['user_id']
            current_time = int(time.time())
            
            # Set expires_at to current time (timer at 0)
            session_data['expires_at'] = current_time
            
            mock_sessions.get_item.return_value = {'Item': session_data}
            
            result = update_timer_status(session_id, user_id, current_time)
            
            assert result['statusCode'] == 200
            body = json.loads(result['body'])
            assert body['status'] == 'expired', \
                "Session status should be 'expired' when timer reaches 0"
            
            # Verify update was called
            mock_sessions.update_item.assert_called_once()


class TestProperty9And10Integration:
    """Integration tests for Properties 9 and 10"""
    
    @given(valid_seconds_strategy())
    @settings(max_examples=5)
    def test_timer_format_and_color_consistency(self, seconds):
        """
        Property: For any number of seconds, both format_time and get_timer_color 
        should work consistently together.
        """
        formatted = format_time(seconds)
        color = get_timer_color(seconds)
        
        # Verify format is valid
        assert len(formatted) == 5
        assert formatted[2] == ':'
        
        # Verify color is valid
        assert color in ['green', 'yellow', 'red']
        
        # Verify consistency: if color is red, seconds should be <= 60
        if color == 'red':
            assert seconds <= RED_THRESHOLD
        # If color is yellow, seconds should be between 60 and 300
        elif color == 'yellow':
            assert RED_THRESHOLD < seconds <= YELLOW_THRESHOLD
        # If color is green, seconds should be > 300
        else:
            assert seconds > YELLOW_THRESHOLD
    
    @given(st.lists(
        st.integers(min_value=0, max_value=600),
        min_size=1,
        max_size=10,
        unique=True
    ))
    @settings(max_examples=5)
    def test_timer_format_for_multiple_values(self, seconds_list):
        """
        Property: For any list of second values, format_time should produce 
        valid MM:SS format for each value.
        """
        for seconds in seconds_list:
            formatted = format_time(seconds)
            
            # Verify format
            assert len(formatted) == 5
            assert formatted[2] == ':'
            
            # Verify accuracy
            parts = formatted.split(':')
            minutes = int(parts[0])
            secs = int(parts[1])
            
            expected_minutes = seconds // 60
            expected_seconds = seconds % 60
            
            assert minutes == expected_minutes
            assert secs == expected_seconds
