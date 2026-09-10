"""
Send verification reminder emails to unverified users.
Pulls the live unverified list from DynamoDB, generates fresh JWT tokens,
sends via SES, and refreshes the auto-purge TTL (mirrors resend-verification).
"""
import boto3
import jwt
from datetime import datetime, timedelta

# Config — must match backend/auth/lambda_function.py defaults
JWT_SECRET = 'your-secret-key'  # Lambda has no JWT_SECRET env var, uses default
JWT_ALGORITHM = 'HS256'
FRONTEND_URL = 'https://mockmaster.fun'
SENDER_EMAIL = 'noreply@mockmaster.fun'
REGION = 'ap-south-1'
USERS_TABLE = 'jaiib-users'
UNVERIFIED_TTL_DAYS = 7

ses_client = boto3.client('ses', region_name=REGION)
dynamodb = boto3.resource('dynamodb', region_name=REGION)
users_table = dynamodb.Table(USERS_TABLE)


def fetch_unverified_users():
    """Scan for users with email_verified=false. Paginates fully."""
    users = []
    kwargs = {
        'FilterExpression': 'email_verified = :v',
        'ExpressionAttributeValues': {':v': False},
        'ProjectionExpression': 'user_id, email, full_name',
    }
    while True:
        resp = users_table.scan(**kwargs)
        users.extend(resp.get('Items', []))
        if 'LastEvaluatedKey' not in resp:
            break
        kwargs['ExclusiveStartKey'] = resp['LastEvaluatedKey']
    return users


def generate_verification_token(user_id, email):
    payload = {
        'user_id': user_id,
        'email': email,
        'type': 'email_verification',
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(hours=72),  # 3 days for reminder
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def refresh_ttl(user_id):
    """Extend the auto-purge window while the user is actively verifying."""
    new_ttl = int((datetime.utcnow() + timedelta(days=UNVERIFIED_TTL_DAYS)).timestamp())
    users_table.update_item(
        Key={'user_id': user_id},
        UpdateExpression='SET expires_at = :ttl',
        ExpressionAttributeValues={':ttl': new_ttl},
    )


def send_reminder(user):
    name = user.get('full_name', 'there')
    token = generate_verification_token(user['user_id'], user['email'])
    verification_link = f"{FRONTEND_URL}/verify-email?token={token}"

    html_body = f"""
    <html>
    <head>
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 40px 20px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 24px; font-weight: bold; color: #4F46E5;">MockMaster</div>
                <p style="color: #666;">JAIIB & CAIIB Exam Prep</p>
            </div>
            <h2 style="color: #1a1a1a;">Hi {name}, please verify your email 👋</h2>
            <p>You signed up for MockMaster but haven't verified your email yet. Verify now to unlock:</p>
            <ul>
                <li>✅ 3000+ JAIIB practice questions</li>
                <li>✅ AI-powered explanations with RBI circular references</li>
                <li>✅ Performance tracking & weak area analysis</li>
                <li>✅ Timed mock tests simulating real exam</li>
            </ul>
            <p style="text-align: center; margin: 30px 0;">
                <a href="{verification_link}" style="display: inline-block; padding: 14px 28px; background-color: #4F46E5; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Verify Email & Start Practicing →</a>
            </p>
            <p style="font-size: 14px; color: #666;">If the button doesn't work, copy and paste this link:</p>
            <p style="font-size: 13px; word-break: break-all; color: #4F46E5;">{verification_link}</p>
            <p style="font-size: 14px; color: #666;">This link expires in 72 hours.</p>
            <div style="margin-top: 40px; font-size: 12px; color: #888; text-align: center;">
                <p>You received this because you signed up at mockmaster.fun</p>
                <p>If you didn't sign up, you can safely ignore this email.</p>
            </div>
        </div>
    </body>
    </html>
    """

    text_body = f"""Hi {name},

You signed up for MockMaster but haven't verified your email yet.

Verify your email to start practicing: {verification_link}

This link expires in 72 hours.

- MockMaster Team
"""

    response = ses_client.send_email(
        Source=f"MockMaster <{SENDER_EMAIL}>",
        Destination={'ToAddresses': [user['email']]},
        Message={
            'Subject': {'Data': f"{name}, verify your email to start JAIIB practice 📚"},
            'Body': {
                'Html': {'Data': html_body},
                'Text': {'Data': text_body},
            }
        }
    )
    return response


if __name__ == '__main__':
    users = fetch_unverified_users()
    print(f"Found {len(users)} unverified users")
    sent, failed = 0, 0
    for user in users:
        try:
            resp = send_reminder(user)
            refresh_ttl(user['user_id'])
            sent += 1
            print(f"✅ Sent to {user['email']} (MessageId: {resp['MessageId']})")
        except Exception as e:
            failed += 1
            print(f"❌ Failed for {user.get('email')}: {e}")
    print(f"\nDone: {sent} sent, {failed} failed")
