"""
Property-Based Tests for Authentication Service

Tests universal properties of authentication using Hypothesis.
Validates: Requirements 1.2, 1.3, 1.4, 1.5, 1.8
"""

import pytest
import json
import uuid
from datetime import datetime, timedelta
from unittest.mock import Mock, patch, MagicMock
import sys
import os

from hypothesis import given, strategies as st, settings, HealthCheck
import jwt

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend', 'auth'))


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


# Strategies for generating test data
email_strategy = st.emails()
password_strategy = st.text(
    alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    min_size=8,
    max_size=20
).filter(lambda p: any(c.isupper() for c in p) and any(c.isdigit() for c in p))
name_strategy = st.text(
    alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ',
    min_size=2,
    max_size=50
).filter(lambda n: n.strip())
bank_strategy = st.text(
    alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ',
    min_size=2,
    max_size=50
).filter(lambda b: b.strip())


class TestProperty2UserRegistrationCreatesAccount:
    """
    Property 2: User registration creates verified account
    
    **Validates: Requirements 1.2**
    
    For any valid user registration with email, password, full name, and bank affiliation,
    submitting the registration form should create a user account in the database and send
    a verification email.
    """
    
    @given(
        email=email_strategy,
        password=password_strategy,
        full_name=name_strategy,
        bank_affiliation=bank_strategy
    )
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture], deadline=None)
    def test_registration_creates_account_with_valid_data(
        self, auth_module, mock_dynamodb, mock_ses,
        email, password, full_name, bank_affiliation
    ):
        """
        For any valid registration data, the system should create a user account
        and send a verification email.
        """
        mock_dynamodb.query.return_value = {'Items': []}
        mock_ses.send_email.return_value = {}
        
        body = {
            'email': email,
            'password': password,
            'full_name': full_name,
            'bank_affiliation': bank_affiliation
        }
        
        response = auth_module.register_user(body)
        
        # Should succeed
        assert response['statusCode'] == 201
        data = json.loads(response['body'])
        
        # Should return user_id
        assert 'user_id' in data
        assert data['user_id']
        
        # Should send verification email
        assert data['verification_email_sent']
        
        # Should call put_item to create user
        assert mock_dynamodb.put_item.called
        call_args = mock_dynamodb.put_item.call_args
        item = call_args[1]['Item']
        
        # Verify user data is stored correctly
        assert item['email'] == email.lower()
        assert item['full_name'] == full_name
        assert item['bank_affiliation'] == bank_affiliation
        assert item['email_verified'] == False
        assert item['role'] == 'bank_officer'
        assert item['status'] == 'active'


class TestProperty3EmailVerificationEnablesLogin:
    """
    Property 3: Email verification enables login
    
    **Validates: Requirements 1.3**
    
    For any registered user who clicks the verification link in their email,
    the account should be marked as verified and the user should be able to log in
    with their credentials.
    """
    
    @given(
        email=email_strategy,
        password=password_strategy
    )
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture], deadline=None)
    def test_verified_user_can_login(
        self, auth_module, mock_dynamodb,
        email, password
    ):
        """
        For any verified user with correct credentials, login should succeed.
        """
        user_id = str(uuid.uuid4())
        password_hash = auth_module.hash_password(password)
        
        # Simulate verified user
        mock_dynamodb.query.return_value = {
            'Items': [{
                'user_id': user_id,
                'email': email,
                'password_hash': password_hash,
                'email_verified': True,
                'role': 'bank_officer',
                'full_name': 'Test User'
            }]
        }
        
        body = {
            'email': email,
            'password': password
        }
        
        response = auth_module.login_user(body)
        
        # Should succeed
        assert response['statusCode'] == 200
        data = json.loads(response['body'])
        
        # Should return tokens
        assert 'access_token' in data
        assert 'refresh_token' in data
        assert data['user_id'] == user_id


class TestProperty4ValidCredentialsAuthenticateUser:
    """
    Property 4: Valid credentials authenticate user
    
    **Validates: Requirements 1.4**
    
    For any verified user with correct email and password, the authentication service
    should create a valid session token that can be used for subsequent requests.
    """
    
    @given(
        email=email_strategy,
        password=password_strategy
    )
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture], deadline=None)
    def test_valid_credentials_create_valid_token(
        self, auth_module, mock_dynamodb,
        email, password
    ):
        """
        For any valid credentials, the system should create a valid JWT token.
        """
        user_id = str(uuid.uuid4())
        password_hash = auth_module.hash_password(password)
        
        mock_dynamodb.query.return_value = {
            'Items': [{
                'user_id': user_id,
                'email': email,
                'password_hash': password_hash,
                'email_verified': True,
                'role': 'bank_officer',
                'full_name': 'Test User'
            }]
        }
        
        body = {
            'email': email,
            'password': password
        }
        
        response = auth_module.login_user(body)
        data = json.loads(response['body'])
        
        # Token should be valid
        access_token = data['access_token']
        payload = jwt.decode(access_token, auth_module.JWT_SECRET, algorithms=['HS256'])
        
        # Token should contain user info
        assert payload['user_id'] == user_id
        assert payload['email'] == email
        assert payload['role'] == 'bank_officer'
        
        # Token should not be expired
        assert payload['exp'] > datetime.utcnow().timestamp()


class TestProperty5InvalidCredentialsRejected:
    """
    Property 5: Invalid credentials rejected
    
    **Validates: Requirements 1.5**
    
    For any invalid email/password combination, the authentication service should reject
    the login attempt without revealing whether the email exists in the system.
    """
    
    @given(
        email=email_strategy,
        correct_password=password_strategy,
        wrong_password=password_strategy
    )
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture], deadline=None)
    def test_invalid_password_rejected(
        self, auth_module, mock_dynamodb,
        email, correct_password, wrong_password
    ):
        """
        For any invalid password, login should be rejected.
        """
        # Skip if passwords are the same
        if correct_password == wrong_password:
            return
        
        user_id = str(uuid.uuid4())
        password_hash = auth_module.hash_password(correct_password)
        
        mock_dynamodb.query.return_value = {
            'Items': [{
                'user_id': user_id,
                'email': email,
                'password_hash': password_hash,
                'email_verified': True,
                'role': 'bank_officer'
            }]
        }
        
        body = {
            'email': email,
            'password': wrong_password
        }
        
        response = auth_module.login_user(body)
        
        # Should fail
        assert response['statusCode'] == 401
        data = json.loads(response['body'])
        
        # Should not reveal email existence
        assert 'Invalid email or password' in data['error']
    
    @given(email=email_strategy)
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture], deadline=None)
    def test_nonexistent_email_rejected_without_revealing_existence(
        self, auth_module, mock_dynamodb,
        email
    ):
        """
        For any nonexistent email, login should be rejected without revealing
        that the email doesn't exist.
        """
        mock_dynamodb.query.return_value = {'Items': []}
        
        body = {
            'email': email,
            'password': 'SomePassword123'
        }
        
        response = auth_module.login_user(body)
        
        # Should fail
        assert response['statusCode'] == 401
        data = json.loads(response['body'])
        
        # Should not reveal email doesn't exist
        assert 'Invalid email or password' in data['error']


class TestProperty6SessionTimeoutEnforcesInactivity:
    """
    Property 6: Session timeout enforces inactivity
    
    **Validates: Requirements 1.8**
    
    For any user session that remains inactive for 30 minutes, the session should be
    automatically invalidated and the user should be redirected to the login page.
    """
    
    @given(email=email_strategy)
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture], deadline=None)
    def test_expired_token_is_invalid(self, auth_module, email):
        """
        For any token that has expired, verification should fail.
        """
        user_id = str(uuid.uuid4())
        
        # Create expired token (31 minutes old)
        payload = {
            'user_id': user_id,
            'email': email,
            'role': 'bank_officer',
            'iat': datetime.utcnow() - timedelta(minutes=31),
            'exp': datetime.utcnow() - timedelta(minutes=1)
        }
        expired_token = jwt.encode(payload, auth_module.JWT_SECRET, algorithm='HS256')
        
        # Token should be invalid
        valid, result = auth_module.verify_token(expired_token)
        
        assert not valid
        assert 'error' in result
    
    @given(email=email_strategy)
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture], deadline=None)
    def test_valid_token_is_within_30_minutes(self, auth_module, email):
        """
        For any newly generated token, it should be valid for 30 minutes.
        """
        user_id = str(uuid.uuid4())
        
        token = auth_module.generate_jwt_token(user_id, email, 'bank_officer')
        
        # Token should be valid
        valid, payload = auth_module.verify_token(token)
        
        assert valid
        
        # Token should expire in approximately 30 minutes
        exp_time = payload['exp']
        iat_time = payload['iat']
        diff_minutes = (exp_time - iat_time) / 60
        
        assert 29 <= diff_minutes <= 31


class TestPasswordHashingProperties:
    """
    Property-based tests for password hashing.
    """
    
    @given(password=password_strategy)
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture], deadline=None)
    def test_password_hash_is_deterministic_for_verification(
        self, auth_module, password
    ):
        """
        For any password, hashing and verification should work consistently.
        """
        hashed = auth_module.hash_password(password)
        
        # Should verify correctly
        assert auth_module.verify_password(password, hashed)
    
    @given(password=password_strategy)
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture], deadline=None)
    def test_password_hash_is_different_each_time(
        self, auth_module, password
    ):
        """
        For any password, hashing should produce different hashes each time
        (due to random salt).
        """
        hash1 = auth_module.hash_password(password)
        hash2 = auth_module.hash_password(password)
        
        # Hashes should be different
        assert hash1 != hash2
        
        # But both should verify
        assert auth_module.verify_password(password, hash1)
        assert auth_module.verify_password(password, hash2)


class TestEmailValidationProperties:
    """
    Property-based tests for email validation.
    """
    
    @given(email=email_strategy)
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture], deadline=None)
    def test_valid_emails_are_accepted(self, auth_module, email):
        """
        For any valid email from hypothesis, validation should accept it.
        """
        assert auth_module.validate_email(email)
    
    @given(
        local=st.text(
            alphabet='abcdefghijklmnopqrstuvwxyz',
            min_size=1,
            max_size=20
        ),
        domain=st.text(
            alphabet='abcdefghijklmnopqrstuvwxyz',
            min_size=1,
            max_size=20
        )
    )
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture], deadline=None)
    def test_constructed_emails_are_valid(self, auth_module, local, domain):
        """
        For any constructed email with local and domain parts, validation should accept it.
        """
        email = f"{local}@{domain}.com"
        assert auth_module.validate_email(email)


class TestPasswordValidationProperties:
    """
    Property-based tests for password validation.
    """
    
    @given(password=password_strategy)
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture], deadline=None)
    def test_strong_passwords_are_accepted(self, auth_module, password):
        """
        For any password from the strong password strategy, validation should accept it.
        """
        valid, msg = auth_module.validate_password(password)
        assert valid
        assert msg == ''
    
    @given(
        short_password=st.text(
            alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            min_size=1,
            max_size=7
        )
    )
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow, HealthCheck.function_scoped_fixture], deadline=None)
    def test_short_passwords_are_rejected(self, auth_module, short_password):
        """
        For any password shorter than 8 characters, validation should reject it.
        """
        valid, msg = auth_module.validate_password(short_password)
        assert not valid
