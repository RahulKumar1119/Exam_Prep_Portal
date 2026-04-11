"""
Unit tests for Authentication Service

Tests registration, login, email verification, and password reset flows.
"""

import pytest
import json
import uuid
from datetime import datetime, timedelta
from unittest.mock import Mock, patch, MagicMock
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend', 'auth'))

import bcrypt
import jwt


@pytest.fixture
def auth_module():
    """Import auth module with mocked AWS clients."""
    with patch('boto3.resource'), \
         patch('boto3.client'):
        import lambda_function
        return lambda_function


@pytest.fixture
def mock_dynamodb(auth_module):
    """Mock DynamoDB table."""
    mock_table = MagicMock()
    auth_module.users_table = mock_table
    return mock_table


@pytest.fixture
def mock_ses(auth_module):
    """Mock SES client."""
    auth_module.ses_client = MagicMock()
    return auth_module.ses_client


class TestPasswordHashing:
    """Test password hashing and verification."""
    
    def test_hash_password_creates_bcrypt_hash(self, auth_module):
        """Test that password is hashed with bcrypt."""
        password = "TestPassword123"
        hashed = auth_module.hash_password(password)
        
        assert hashed != password
        assert auth_module.verify_password(password, hashed)
    
    def test_verify_password_returns_false_for_wrong_password(self, auth_module):
        """Test that wrong password fails verification."""
        password = "TestPassword123"
        wrong_password = "WrongPassword123"
        hashed = auth_module.hash_password(password)
        
        assert not auth_module.verify_password(wrong_password, hashed)
    
    def test_hash_password_uses_12_salt_rounds(self, auth_module):
        """Test that bcrypt uses 12 salt rounds."""
        password = "TestPassword123"
        hashed = auth_module.hash_password(password)
        
        # Extract salt rounds from bcrypt hash
        salt_rounds = int(hashed.split('$')[2])
        assert salt_rounds == 12


class TestTokenGeneration:
    """Test JWT token generation and verification."""
    
    def test_generate_jwt_token_creates_valid_token(self, auth_module):
        """Test JWT token generation."""
        user_id = str(uuid.uuid4())
        email = "test@example.com"
        role = "bank_officer"
        
        token = auth_module.generate_jwt_token(user_id, email, role)
        
        assert token is not None
        assert isinstance(token, str)
    
    def test_jwt_token_contains_user_info(self, auth_module):
        """Test that JWT token contains user information."""
        user_id = str(uuid.uuid4())
        email = "test@example.com"
        role = "bank_officer"
        
        token = auth_module.generate_jwt_token(user_id, email, role)
        payload = jwt.decode(token, auth_module.JWT_SECRET, algorithms=['HS256'])
        
        assert payload['user_id'] == user_id
        assert payload['email'] == email
        assert payload['role'] == role
    
    def test_jwt_token_expires_in_30_minutes(self, auth_module):
        """Test that JWT token expires in 30 minutes."""
        user_id = str(uuid.uuid4())
        email = "test@example.com"
        role = "bank_officer"
        
        token = auth_module.generate_jwt_token(user_id, email, role)
        payload = jwt.decode(token, auth_module.JWT_SECRET, algorithms=['HS256'])
        
        exp_time = payload['exp']
        iat_time = payload['iat']
        diff_minutes = (exp_time - iat_time) / 60
        
        assert 29 <= diff_minutes <= 31
    
    def test_verify_token_returns_true_for_valid_token(self, auth_module):
        """Test token verification for valid token."""
        user_id = str(uuid.uuid4())
        email = "test@example.com"
        
        token = auth_module.generate_verification_token(user_id, email)
        valid, payload = auth_module.verify_token(token, 'email_verification')
        
        assert valid
        assert payload['user_id'] == user_id
    
    def test_verify_token_returns_false_for_expired_token(self, auth_module):
        """Test token verification for expired token."""
        user_id = str(uuid.uuid4())
        email = "test@example.com"
        
        # Create expired token
        payload = {
            'user_id': user_id,
            'email': email,
            'type': 'email_verification',
            'iat': datetime.utcnow() - timedelta(hours=25),
            'exp': datetime.utcnow() - timedelta(hours=1)
        }
        token = jwt.encode(payload, auth_module.JWT_SECRET, algorithm='HS256')
        
        valid, result = auth_module.verify_token(token, 'email_verification')
        
        assert not valid
        assert 'error' in result


class TestEmailValidation:
    """Test email validation."""
    
    def test_validate_email_accepts_valid_email(self, auth_module):
        """Test that valid email is accepted."""
        assert auth_module.validate_email("test@example.com")
        assert auth_module.validate_email("user.name@domain.co.uk")
    
    def test_validate_email_rejects_invalid_email(self, auth_module):
        """Test that invalid email is rejected."""
        assert not auth_module.validate_email("invalid")
        assert not auth_module.validate_email("@example.com")
        assert not auth_module.validate_email("test@")


class TestPasswordValidation:
    """Test password validation."""
    
    def test_validate_password_accepts_strong_password(self, auth_module):
        """Test that strong password is accepted."""
        valid, msg = auth_module.validate_password("StrongPass123")
        assert valid
        assert msg == ''
    
    def test_validate_password_rejects_short_password(self, auth_module):
        """Test that short password is rejected."""
        valid, msg = auth_module.validate_password("Short1")
        assert not valid
        assert 'at least 8 characters' in msg
    
    def test_validate_password_rejects_no_uppercase(self, auth_module):
        """Test that password without uppercase is rejected."""
        valid, msg = auth_module.validate_password("lowercase123")
        assert not valid
        assert 'uppercase' in msg
    
    def test_validate_password_rejects_no_digit(self, auth_module):
        """Test that password without digit is rejected."""
        valid, msg = auth_module.validate_password("NoDigitPass")
        assert not valid
        assert 'digit' in msg


class TestRegistration:
    """Test user registration."""
    
    def test_register_user_creates_account(self, auth_module, mock_dynamodb, mock_ses):
        """Test that registration creates user account."""
        mock_dynamodb.query.return_value = {'Items': []}
        mock_ses.send_email.return_value = {}
        
        body = {
            'email': 'newuser@example.com',
            'password': 'StrongPass123',
            'full_name': 'Test User',
            'bank_affiliation': 'Test Bank'
        }
        
        response = auth_module.register_user(body)
        
        assert response['statusCode'] == 201
        data = json.loads(response['body'])
        assert 'user_id' in data
        assert data['verification_email_sent']
    
    def test_register_user_rejects_invalid_email(self, auth_module):
        """Test that registration rejects invalid email."""
        body = {
            'email': 'invalid',
            'password': 'StrongPass123',
            'full_name': 'Test User',
            'bank_affiliation': 'Test Bank'
        }
        
        response = auth_module.register_user(body)
        
        assert response['statusCode'] == 400
        data = json.loads(response['body'])
        assert 'Invalid email' in data['error']
    
    def test_register_user_rejects_weak_password(self, auth_module):
        """Test that registration rejects weak password."""
        body = {
            'email': 'test@example.com',
            'password': 'weak',
            'full_name': 'Test User',
            'bank_affiliation': 'Test Bank'
        }
        
        response = auth_module.register_user(body)
        
        assert response['statusCode'] == 400
    
    def test_register_user_rejects_duplicate_email(self, auth_module, mock_dynamodb):
        """Test that registration rejects duplicate email."""
        mock_dynamodb.query.return_value = {'Items': [{'user_id': 'existing'}]}
        
        body = {
            'email': 'existing@example.com',
            'password': 'StrongPass123',
            'full_name': 'Test User',
            'bank_affiliation': 'Test Bank'
        }
        
        response = auth_module.register_user(body)
        
        assert response['statusCode'] == 400
        data = json.loads(response['body'])
        assert 'already registered' in data['error']
    
    def test_register_user_hashes_password(self, auth_module, mock_dynamodb, mock_ses):
        """Test that registration hashes password."""
        mock_dynamodb.query.return_value = {'Items': []}
        mock_ses.send_email.return_value = {}
        
        body = {
            'email': 'newuser@example.com',
            'password': 'StrongPass123',
            'full_name': 'Test User',
            'bank_affiliation': 'Test Bank'
        }
        
        auth_module.register_user(body)
        
        # Check that put_item was called with hashed password
        call_args = mock_dynamodb.put_item.call_args
        item = call_args[1]['Item']
        
        assert item['password_hash'] != 'StrongPass123'
        assert auth_module.verify_password('StrongPass123', item['password_hash'])


class TestLogin:
    """Test user login."""
    
    def test_login_user_returns_tokens(self, auth_module, mock_dynamodb):
        """Test that login returns access and refresh tokens."""
        user_id = str(uuid.uuid4())
        password = 'StrongPass123'
        password_hash = auth_module.hash_password(password)
        
        mock_dynamodb.query.return_value = {
            'Items': [{
                'user_id': user_id,
                'email': 'test@example.com',
                'password_hash': password_hash,
                'email_verified': True,
                'role': 'bank_officer',
                'full_name': 'Test User'
            }]
        }
        
        body = {
            'email': 'test@example.com',
            'password': password
        }
        
        response = auth_module.login_user(body)
        
        assert response['statusCode'] == 200
        data = json.loads(response['body'])
        assert 'access_token' in data
        assert 'refresh_token' in data
        assert data['user_id'] == user_id
    
    def test_login_user_rejects_wrong_password(self, auth_module, mock_dynamodb):
        """Test that login rejects wrong password."""
        password = 'StrongPass123'
        password_hash = auth_module.hash_password(password)
        
        mock_dynamodb.query.return_value = {
            'Items': [{
                'user_id': str(uuid.uuid4()),
                'email': 'test@example.com',
                'password_hash': password_hash,
                'email_verified': True,
                'role': 'bank_officer'
            }]
        }
        
        body = {
            'email': 'test@example.com',
            'password': 'WrongPassword123'
        }
        
        response = auth_module.login_user(body)
        
        assert response['statusCode'] == 401
        data = json.loads(response['body'])
        assert 'Invalid email or password' in data['error']
    
    def test_login_user_rejects_unverified_email(self, auth_module, mock_dynamodb):
        """Test that login rejects unverified email."""
        password = 'StrongPass123'
        password_hash = auth_module.hash_password(password)
        
        mock_dynamodb.query.return_value = {
            'Items': [{
                'user_id': str(uuid.uuid4()),
                'email': 'test@example.com',
                'password_hash': password_hash,
                'email_verified': False,
                'role': 'bank_officer'
            }]
        }
        
        body = {
            'email': 'test@example.com',
            'password': password
        }
        
        response = auth_module.login_user(body)
        
        assert response['statusCode'] == 403
        data = json.loads(response['body'])
        assert 'verify your email' in data['error']
    
    def test_login_user_does_not_reveal_email_existence(self, auth_module, mock_dynamodb):
        """Test that login doesn't reveal if email exists."""
        mock_dynamodb.query.return_value = {'Items': []}
        
        body = {
            'email': 'nonexistent@example.com',
            'password': 'SomePassword123'
        }
        
        response = auth_module.login_user(body)
        
        assert response['statusCode'] == 401
        data = json.loads(response['body'])
        assert 'Invalid email or password' in data['error']


class TestEmailVerification:
    """Test email verification."""
    
    def test_verify_email_marks_account_verified(self, auth_module, mock_dynamodb):
        """Test that email verification marks account as verified."""
        user_id = str(uuid.uuid4())
        email = 'test@example.com'
        
        token = auth_module.generate_verification_token(user_id, email)
        
        body = {'token': token}
        response = auth_module.verify_email(body)
        
        assert response['statusCode'] == 200
        
        # Check that update_item was called
        call_args = mock_dynamodb.update_item.call_args
        assert call_args[1]['Key']['user_id'] == user_id
    
    def test_verify_email_rejects_invalid_token(self, auth_module):
        """Test that email verification rejects invalid token."""
        body = {'token': 'invalid_token'}
        response = auth_module.verify_email(body)
        
        assert response['statusCode'] == 400
        data = json.loads(response['body'])
        assert 'Invalid or expired' in data['error']


class TestPasswordReset:
    """Test password reset flow."""
    
    def test_request_password_reset_sends_email(self, auth_module, mock_dynamodb, mock_ses):
        """Test that password reset request sends email."""
        user_id = str(uuid.uuid4())
        
        mock_dynamodb.query.return_value = {
            'Items': [{
                'user_id': user_id,
                'email': 'test@example.com'
            }]
        }
        mock_ses.send_email.return_value = {}
        
        body = {'email': 'test@example.com'}
        response = auth_module.request_password_reset(body)
        
        assert response['statusCode'] == 200
        data = json.loads(response['body'])
        assert data['reset_email_sent']
    
    def test_reset_password_updates_password(self, auth_module, mock_dynamodb):
        """Test that password reset updates password."""
        user_id = str(uuid.uuid4())
        email = 'test@example.com'
        new_password = 'NewPassword123'
        
        token = auth_module.generate_reset_token(user_id, email)
        
        body = {
            'token': token,
            'new_password': new_password
        }
        
        response = auth_module.reset_password(body)
        
        assert response['statusCode'] == 200
        
        # Check that update_item was called with new password hash
        call_args = mock_dynamodb.update_item.call_args
        assert call_args[1]['Key']['user_id'] == user_id
    
    def test_reset_password_rejects_invalid_token(self, auth_module):
        """Test that password reset rejects invalid token."""
        body = {
            'token': 'invalid_token',
            'new_password': 'NewPassword123'
        }
        
        response = auth_module.reset_password(body)
        
        assert response['statusCode'] == 400
        data = json.loads(response['body'])
        assert 'Invalid or expired' in data['error']


class TestTokenRefresh:
    """Test token refresh."""
    
    def test_refresh_token_returns_new_access_token(self, auth_module, mock_dynamodb):
        """Test that refresh token returns new access token."""
        user_id = str(uuid.uuid4())
        
        refresh_token = auth_module.generate_refresh_token(user_id)
        
        mock_dynamodb.get_item.return_value = {
            'Item': {
                'user_id': user_id,
                'email': 'test@example.com',
                'role': 'bank_officer'
            }
        }
        
        body = {'refresh_token': refresh_token}
        response = auth_module.refresh_access_token(body)
        
        assert response['statusCode'] == 200
        data = json.loads(response['body'])
        assert 'access_token' in data
