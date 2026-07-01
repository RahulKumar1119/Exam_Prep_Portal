"""
Send verification reminder emails to unverified users.
Generates fresh JWT tokens and sends via SES.
"""
import boto3
import jwt
from datetime import datetime, timedelta

# Config
JWT_SECRET = 'your-secret-key'  # Must match your Lambda's JWT_SECRET env var
JWT_ALGORITHM = 'HS256'
FRONTEND_URL = 'https://mockmaster.fun'
SENDER_EMAIL = 'noreply@mockmaster.fun'
REGION = 'ap-south-1'

ses_client = boto3.client('ses', region_name=REGION)

# Users to remind
USERS = [
    {'user_id': '74e47991-3d45-404c-ab8b-a57d51e27db9', 'email': 'ymonal463@gmail.com', 'name': 'Monal'},
    {'user_id': '293ee784-26ab-4cea-b76c-61488c2f1d31', 'email': 'vijay.ingle281285@gmail.com', 'name': 'Vijay'},
    {'user_id': '4ef86337-92bf-4f8d-99c8-7613b5634982', 'email': 'deepanjali6847@gmail.com', 'name': 'Deepanjali'},
    {'user_id': 'df112411-c144-4071-a52e-554f4994777c', 'email': 'vijayalakshmissh2023@gmail.com', 'name': 'Vijayalakshmi'},
    {'user_id': '36158703-c041-4ac7-a471-875ad28beee1', 'email': 'papupachani22@gmail.com', 'name': 'Monjit'},
    {'user_id': 'ee4d3223-1472-448b-a440-e461d4e28dde', 'email': 'susanth31@gmail.com', 'name': 'Susanth'},
]


def generate_verification_token(user_id, email):
    payload = {
        'user_id': user_id,
        'email': email,
        'type': 'email_verification',
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(hours=72),  # 3 days for reminder
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def send_reminder(user):
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
            <h2 style="color: #1a1a1a;">Hi {user['name']}, please verify your email 👋</h2>
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

    text_body = f"""Hi {user['name']},

You signed up for MockMaster but haven't verified your email yet.

Verify your email to start practicing: {verification_link}

This link expires in 72 hours.

- MockMaster Team
"""

    response = ses_client.send_email(
        Source=f"MockMaster <{SENDER_EMAIL}>",
        Destination={'ToAddresses': [user['email']]},
        Message={
            'Subject': {'Data': f"{user['name']}, verify your email to start JAIIB practice 📚"},
            'Body': {
                'Html': {'Data': html_body},
                'Text': {'Data': text_body},
            }
        }
    )
    return response


if __name__ == '__main__':
    for user in USERS:
        try:
            resp = send_reminder(user)
            msg_id = resp['MessageId']
            print(f"✅ Sent to {user['email']} (MessageId: {msg_id})")
        except Exception as e:
            print(f"❌ Failed for {user['email']}: {e}")
