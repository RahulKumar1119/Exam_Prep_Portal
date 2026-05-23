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
import jwt
from passlib.context import CryptContext
from botocore.exceptions import ClientError

# Initialize AWS clients
dynamodb = boto3.resource('dynamodb')
ses_client = boto3.client('ses')
kms_client = boto3.client('kms')

# Password hashing context using PBKDF2 (pure Python, no C extensions)
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

# Environment variables
USERS_TABLE = os.environ.get('USERS_TABLE', 'jaiib-users')
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRY_MINUTES = 30
RESET_TOKEN_EXPIRY_HOURS = 24
VERIFICATION_TOKEN_EXPIRY_HOURS = 24
SENDER_EMAIL = os.environ.get('SES_SENDER_EMAIL', 'noreply@mockmaster.fun')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'https://mockmaster.fun')

# DynamoDB table
users_table = dynamodb.Table(USERS_TABLE)


def hash_password(password: str) -> str:
    """Hash password using PBKDF2 (pure Python, no C extensions required)."""
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    """Verify password against PBKDF2 hash."""
    return pwd_context.verify(password, password_hash)


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
    """Send email verification link via SES."""
    verification_link = f"{FRONTEND_URL}/verify-email?token={token}"
    
    html_body = f"""
    <html>
    <head>
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 40px 20px; }}
            .header {{ text-align: center; margin-bottom: 30px; }}
            .logo {{ font-size: 24px; font-weight: bold; color: #4F46E5; }}
            .btn {{ display: inline-block; padding: 14px 28px; background-color: #4F46E5; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; }}
            .footer {{ margin-top: 40px; font-size: 12px; color: #888; text-align: center; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">MockMaster</div>
                <p style="color: #666;">JAIIB & CAIIB Exam Prep</p>
            </div>
            <h2 style="color: #1a1a1a;">Verify Your Email Address</h2>
            <p>Welcome to MockMaster! Please verify your email address to activate your account and start practicing.</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="{verification_link}" style="display: inline-block; padding: 14px 28px; background-color: #4F46E5; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; mso-padding-alt: 0; text-align: center;"><!--[if mso]><i style="letter-spacing: 28px; mso-font-width: -100%; mso-text-raise: 26pt;">&nbsp;</i><![endif]--><span style="color: #ffffff;">Verify Email</span><!--[if mso]><i style="letter-spacing: 28px; mso-font-width: -100%;">&nbsp;</i><![endif]--></a>
            </p>
            <p style="font-size: 14px; color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="font-size: 13px; word-break: break-all; color: #4F46E5;">{verification_link}</p>
            <p style="font-size: 14px; color: #666;">This link expires in 24 hours.</p>
            <div class="footer">
                <p>You received this email because you signed up for MockMaster.</p>
                <p>If you didn't create an account, you can safely ignore this email.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    text_body = f"""Welcome to MockMaster - JAIIB & CAIIB Exam Prep!

Please verify your email address by clicking the link below:

{verification_link}

This link expires in 24 hours.

If you didn't create an account, you can safely ignore this email.
"""
    
    try:
        ses_client.send_email(
            Source=f"MockMaster <{SENDER_EMAIL}>",
            Destination={'ToAddresses': [email]},
            Message={
                'Subject': {'Data': 'Verify your MockMaster account'},
                'Body': {
                    'Html': {'Data': html_body},
                    'Text': {'Data': text_body}
                }
            }
        )
        print(f"Verification email sent to {email}")
        return True
    except ClientError as e:
        print(f"Error sending verification email: {e}")
        return False


def send_password_reset_email(email: str, user_id: str, token: str) -> bool:
    """Send password reset link via SES."""
    reset_link = f"{FRONTEND_URL}/password-reset?token={token}"
    
    html_body = f"""
    <html>
    <head>
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 40px 20px; }}
            .header {{ text-align: center; margin-bottom: 30px; }}
            .logo {{ font-size: 24px; font-weight: bold; color: #4F46E5; }}
            .btn {{ display: inline-block; padding: 14px 28px; background-color: #4F46E5; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; }}
            .footer {{ margin-top: 40px; font-size: 12px; color: #888; text-align: center; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">MockMaster</div>
                <p style="color: #666;">JAIIB & CAIIB Exam Prep</p>
            </div>
            <h2 style="color: #1a1a1a;">Reset Your Password</h2>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="{reset_link}" style="display: inline-block; padding: 14px 28px; background-color: #4F46E5; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;"><span style="color: #ffffff;">Reset Password</span></a>
            </p>
            <p style="font-size: 14px; color: #666;">If the button doesn't work, copy and paste this link:</p>
            <p style="font-size: 13px; word-break: break-all; color: #4F46E5;">{reset_link}</p>
            <p style="font-size: 14px; color: #666;">This link expires in 24 hours.</p>
            <div class="footer">
                <p>If you didn't request a password reset, you can safely ignore this email.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    try:
        ses_client.send_email(
            Source=f"MockMaster <{SENDER_EMAIL}>",
            Destination={'ToAddresses': [email]},
            Message={
                'Subject': {'Data': 'Reset your MockMaster password'},
                'Body': {'Html': {'Data': html_body}}
            }
        )
        return True
    except ClientError as e:
        print(f"Error sending password reset email: {e}")
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
                'password_hash': password_hash,
                'email_verified': False,  # Must verify email before login
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
        
        # Send verification email (skipped in dev mode)
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


def handle_contact_form(body: Dict[str, Any]) -> Dict[str, Any]:
    """Handle contact form submission — send email to support."""
    name = body.get('name', '').strip()
    email = body.get('email', '').strip()
    subject = body.get('subject', '').strip()
    message = body.get('message', '').strip()

    if not name or not email or not subject or not message:
        return error_response(400, 'All fields are required')

    # Send to support email
    html_body = f"""
    <html><body>
    <h2>New Contact Form Submission</h2>
    <table style="border-collapse:collapse;width:100%;">
      <tr><td style="padding:8px;font-weight:bold;border:1px solid #ddd;">Name</td><td style="padding:8px;border:1px solid #ddd;">{name}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;border:1px solid #ddd;">Email</td><td style="padding:8px;border:1px solid #ddd;">{email}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;border:1px solid #ddd;">Subject</td><td style="padding:8px;border:1px solid #ddd;">{subject}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;border:1px solid #ddd;">Message</td><td style="padding:8px;border:1px solid #ddd;">{message}</td></tr>
    </table>
    </body></html>
    """

    try:
        ses_client.send_email(
            Source=f"MockMaster Contact <{SENDER_EMAIL}>",
            Destination={'ToAddresses': ['support@mockmaster.fun']},
            ReplyToAddresses=[email],
            Message={
                'Subject': {'Data': f'[Contact Form] {subject} — from {name}'},
                'Body': {'Html': {'Data': html_body}}
            }
        )
        return success_response(200, {'message': 'Message sent successfully'})
    except ClientError as e:
        print(f"Error sending contact email: {e}")
        return error_response(500, 'Failed to send message. Please try again.')


def handler(event, context):
    """Lambda handler for authentication requests."""
    try:
        # Parse request
        http_method = event.get('httpMethod', 'POST')
        path = event.get('path', '')
        
        # Remove stage name from path if present (API Gateway includes it)
        if path.startswith('/prod/'):
            path = path[5:]  # Remove '/prod' prefix
        
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
        elif path == '/auth/contact' and http_method == 'POST':
            return handle_contact_form(body)
        else:
            return error_response(404, f'Endpoint not found: {path}')
    
    except Exception as e:
        print(f"Error: {e}")
        return error_response(500, 'Internal server error')
