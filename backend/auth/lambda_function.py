"""
Authentication Lambda Function for JAIIB-CAIIB Exam Prep Portal

Handles user registration, login, email verification, and password reset flows.
"""

import json
import os
import uuid
import hashlib
import hmac
import base64
from datetime import datetime, timedelta
from typing import Dict, Any, Tuple

import boto3
import bcrypt
import jwt
from botocore.exceptions import ClientError

# Initialize AWS clients
dynamodb = boto3.resource('dynamodb')
ses_client = boto3.client('ses')
kms_client = boto3.client('kms')

# Environment variables
USERS_TABLE = os.environ.get('USERS_TABLE', 'jaiib-users')
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRY_MINUTES = 30
RESET_TOKEN_EXPIRY_HOURS = 24
VERIFICATION_TOKEN_EXPIRY_HOURS = 24
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'noreply@jaiib-portal.com')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'https://jaiib-portal.com')

# DynamoDB table
users_table = dynamodb.Table(USERS_TABLE)


def hash_password(password: str) -> str:
    """Hash password using bcrypt with 12-character salt rounds."""
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')


def verify_password(password: str, password_hash: str) -> bool:
    """Verify password against bcrypt hash."""
    return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))


def generate_jwt_token(user_id: str, email: str, role: str) -> str:
    """Generate JWT token with 30-minute expiry."""
    payload = {
        'user_id': user_id,
        'email': email,
        'role': role,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(minutes=JWT_EXPIRY_MINUTES)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def generate_refresh_token(user_id: str) -> str:
    """Generate refresh token (longer expiry)."""
    payload = {
        'user_id': user_id,
        'type': 'refresh',
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def generate_verification_token(user_id: str, email: str) -> str:
    """Generate email verification token."""
    payload = {
        'user_id': user_id,
        'email': email,
        'type': 'email_verification',
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(hours=VERIFICATION_TOKEN_EXPIRY_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def generate_reset_token(user_id: str, email: str) -> str:
    """Generate password reset token."""
    payload = {
        'user_id': user_id,
        'email': email,
        'type': 'password_reset',
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(hours=RESET_TOKEN_EXPIRY_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_token(token: str, token_type: str = None) -> Tuple[bool, Dict[str, Any]]:
    """Verify JWT token and return payload."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if token_type and payload.get('type') != token_type:
            return False, {}
        return True, payload
    except jwt.ExpiredSignatureError:
        return False, {'error': 'Token expired'}
    except jwt.InvalidTokenError:
        return False, {'error': 'Invalid token'}


def validate_email(email: str) -> bool:
    """Basic email validation."""
    if not email or '@' not in email:
        return False
    parts = email.split('@')
    if len(parts) != 2:
        return False
    local, domain = parts
    if not local or not domain or '.' not in domain:
        return False
    return True


def validate_password(password: str) -> Tuple[bool, str]:
    """Validate password strength."""
    if len(password) < 8:
        return False, 'Password must be at least 8 characters'
    if not any(c.isupper() for c in password):
        return False, 'Password must contain uppercase letter'
    if not any(c.isdigit() for c in password):
        return False, 'Password must contain digit'
    return True, ''


def send_verification_email(email: str, user_id: str, token: str) -> bool:
    """Send email verification link."""
    verification_link = f"{FRONTEND_URL}/verify-email?token={token}"
    
    html_body = f"""
    <html>
    <head></head>
    <body>
        <h2>Verify Your Email</h2>
        <p>Click the link below to verify your email address:</p>
        <a href="{verification_link}">Verify Email</a>
        <p>This link expires in 24 hours.</p>
    </body>
    </html>
    """
    
    try:
        ses_client.send_email(
            Source=SENDER_EMAIL,
            Destination={'ToAddresses': [email]},
            Message={
                'Subject': {'Data': 'Verify Your JAIIB Portal Email'},
                'Body': {'Html': {'Data': html_body}}
            }
        )
        return True
    except ClientError as e:
        print(f"Error sending email: {e}")
        return False


def send_password_reset_email(email: str, user_id: str, token: str) -> bool:
    """Send password reset link."""
    reset_link = f"{FRONTEND_URL}/reset-password?token={token}"
    
    html_body = f"""
    <html>
    <head></head>
    <body>
        <h2>Reset Your Password</h2>
        <p>Click the link below to reset your password:</p>
        <a href="{reset_link}">Reset Password</a>
        <p>This link expires in 24 hours.</p>
    </body>
    </html>
    """
    
    try:
        ses_client.send_email(
            Source=SENDER_EMAIL,
            Destination={'ToAddresses': [email]},
            Message={
                'Subject': {'Data': 'Reset Your JAIIB Portal Password'},
                'Body': {'Html': {'Data': html_body}}
            }
        )
        return True
    except ClientError as e:
        print(f"Error sending email: {e}")
        return False


def user_exists(email: str) -> bool:
    """Check if user with email already exists."""
    try:
        response = users_table.query(
            IndexName='email-index',
            KeyConditionExpression='email = :email',
            ExpressionAttributeValues={':email': email}
        )
        return len(response['Items']) > 0
    except ClientError as e:
        print(f"Error checking user: {e}")
        return False


def register_user(body: Dict[str, Any]) -> Dict[str, Any]:
    """Register new user."""
    email = body.get('email', '').strip().lower()
    password = body.get('password', '')
    full_name = body.get('full_name', '').strip()
    bank_affiliation = body.get('bank_affiliation', '').strip()
    
    # Validation
    if not email or not validate_email(email):
        return error_response(400, 'Invalid email address')
    
    if not password:
        return error_response(400, 'Password is required')
    
    valid, msg = validate_password(password)
    if not valid:
        return error_response(400, msg)
    
    if not full_name:
        return error_response(400, 'Full name is required')
    
    if not bank_affiliation:
        return error_response(400, 'Bank affiliation is required')
    
    # Check if user exists
    if user_exists(email):
        return error_response(400, 'Email already registered')
    
    # Create user
    user_id = str(uuid.uuid4())
    password_hash = hash_password(password)
    verification_token = generate_verification_token(user_id, email)
    
    try:
        users_table.put_item(
            Item={
                'user_id': user_id,
                'email': email,
                'full_name': full_name,
                'bank_affiliation': bank_affiliation,
                'password_hash': password_hash,
                'email_verified': False,
                'created_at': int(datetime.utcnow().timestamp()),
                'last_login': None,
                'role': 'bank_officer',
                'status': 'active',
                'preferences': {
                    'notifications_enabled': True,
                    'theme': 'light'
                }
            }
        )
        
        # Send verification email
        email_sent = send_verification_email(email, user_id, verification_token)
        
        return success_response(201, {
            'user_id': user_id,
            'message': 'Registration successful. Please check your email to verify your account.',
            'verification_email_sent': email_sent
        })
    
    except ClientError as e:
        print(f"Error registering user: {e}")
        return error_response(500, 'Error registering user')


def verify_email(body: Dict[str, Any]) -> Dict[str, Any]:
    """Verify user email."""
    token = body.get('token', '')
    
    if not token:
        return error_response(400, 'Verification token is required')
    
    # Verify token
    valid, payload = verify_token(token, 'email_verification')
    if not valid:
        return error_response(400, 'Invalid or expired verification token')
    
    user_id = payload.get('user_id')
    
    try:
        # Update user
        users_table.update_item(
            Key={'user_id': user_id},
            UpdateExpression='SET email_verified = :verified',
            ExpressionAttributeValues={':verified': True}
        )
        
        return success_response(200, {
            'message': 'Email verified successfully. You can now log in.'
        })
    
    except ClientError as e:
        print(f"Error verifying email: {e}")
        return error_response(500, 'Error verifying email')


def login_user(body: Dict[str, Any]) -> Dict[str, Any]:
    """Authenticate user and return tokens."""
    email = body.get('email', '').strip().lower()
    password = body.get('password', '')
    
    if not email or not password:
        return error_response(400, 'Email and password are required')
    
    try:
        # Get user by email
        response = users_table.query(
            IndexName='email-index',
            KeyConditionExpression='email = :email',
            ExpressionAttributeValues={':email': email}
        )
        
        if not response['Items']:
            # Don't reveal if email exists
            return error_response(401, 'Invalid email or password')
        
        user = response['Items'][0]
        
        # Check if email is verified
        if not user.get('email_verified', False):
            return error_response(403, 'Please verify your email before logging in')
        
        # Verify password
        if not verify_password(password, user['password_hash']):
            return error_response(401, 'Invalid email or password')
        
        # Generate tokens
        access_token = generate_jwt_token(user['user_id'], user['email'], user['role'])
        refresh_token = generate_refresh_token(user['user_id'])
        
        # Update last login
        users_table.update_item(
            Key={'user_id': user['user_id']},
            UpdateExpression='SET last_login = :timestamp',
            ExpressionAttributeValues={':timestamp': int(datetime.utcnow().timestamp())}
        )
        
        return success_response(200, {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user_id': user['user_id'],
            'email': user['email'],
            'role': user['role'],
            'full_name': user['full_name']
        })
    
    except ClientError as e:
        print(f"Error logging in: {e}")
        return error_response(500, 'Error logging in')


def refresh_access_token(body: Dict[str, Any]) -> Dict[str, Any]:
    """Generate new access token from refresh token."""
    refresh_token = body.get('refresh_token', '')
    
    if not refresh_token:
        return error_response(400, 'Refresh token is required')
    
    # Verify refresh token
    valid, payload = verify_token(refresh_token, 'refresh')
    if not valid:
        return error_response(401, 'Invalid or expired refresh token')
    
    user_id = payload.get('user_id')
    
    try:
        # Get user
        response = users_table.get_item(Key={'user_id': user_id})
        if 'Item' not in response:
            return error_response(404, 'User not found')
        
        user = response['Item']
        
        # Generate new access token
        access_token = generate_jwt_token(user['user_id'], user['email'], user['role'])
        
        return success_response(200, {
            'access_token': access_token
        })
    
    except ClientError as e:
        print(f"Error refreshing token: {e}")
        return error_response(500, 'Error refreshing token')


def request_password_reset(body: Dict[str, Any]) -> Dict[str, Any]:
    """Request password reset."""
    email = body.get('email', '').strip().lower()
    
    if not email:
        return error_response(400, 'Email is required')
    
    try:
        # Get user by email
        response = users_table.query(
            IndexName='email-index',
            KeyConditionExpression='email = :email',
            ExpressionAttributeValues={':email': email}
        )
        
        if not response['Items']:
            # Don't reveal if email exists
            return success_response(200, {
                'message': 'If email exists, password reset link has been sent'
            })
        
        user = response['Items'][0]
        reset_token = generate_reset_token(user['user_id'], user['email'])
        
        # Send reset email
        email_sent = send_password_reset_email(email, user['user_id'], reset_token)
        
        return success_response(200, {
            'message': 'Password reset link sent to email',
            'reset_email_sent': email_sent
        })
    
    except ClientError as e:
        print(f"Error requesting password reset: {e}")
        return error_response(500, 'Error requesting password reset')


def reset_password(body: Dict[str, Any]) -> Dict[str, Any]:
    """Reset user password."""
    token = body.get('token', '')
    new_password = body.get('new_password', '')
    
    if not token:
        return error_response(400, 'Reset token is required')
    
    if not new_password:
        return error_response(400, 'New password is required')
    
    # Validate password
    valid, msg = validate_password(new_password)
    if not valid:
        return error_response(400, msg)
    
    # Verify token
    valid, payload = verify_token(token, 'password_reset')
    if not valid:
        return error_response(400, 'Invalid or expired reset token')
    
    user_id = payload.get('user_id')
    
    try:
        # Hash new password
        password_hash = hash_password(new_password)
        
        # Update password
        users_table.update_item(
            Key={'user_id': user_id},
            UpdateExpression='SET password_hash = :hash',
            ExpressionAttributeValues={':hash': password_hash}
        )
        
        return success_response(200, {
            'message': 'Password reset successfully. You can now log in with your new password.'
        })
    
    except ClientError as e:
        print(f"Error resetting password: {e}")
        return error_response(500, 'Error resetting password')


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
    """Lambda handler for authentication requests."""
    try:
        # Parse request
        http_method = event.get('httpMethod', 'POST')
        path = event.get('path', '')
        body = json.loads(event.get('body', '{}'))
        
        # Route to appropriate handler
        if path == '/auth/register' and http_method == 'POST':
            return register_user(body)
        elif path == '/auth/verify-email' and http_method == 'POST':
            return verify_email(body)
        elif path == '/auth/login' and http_method == 'POST':
            return login_user(body)
        elif path == '/auth/refresh-token' and http_method == 'POST':
            return refresh_access_token(body)
        elif path == '/auth/password-reset-request' and http_method == 'POST':
            return request_password_reset(body)
        elif path == '/auth/password-reset' and http_method == 'POST':
            return reset_password(body)
        else:
            return error_response(404, 'Endpoint not found')
    
    except Exception as e:
        print(f"Error: {e}")
        return error_response(500, 'Internal server error')
