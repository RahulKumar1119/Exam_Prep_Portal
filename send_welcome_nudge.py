"""
Send a "Welcome + Start Practicing" nudge email to verified users
who haven't taken any practice tests yet.
"""
import boto3

SENDER_EMAIL = 'noreply@mockmaster.fun'
REGION = 'ap-south-1'
FRONTEND_URL = 'https://mockmaster.fun'

ses_client = boto3.client('ses', region_name=REGION)

# Real verified users only (excluding test accounts)
USERS = [
    {'email': 'senthilsbi2007@gmail.com', 'name': 'Senthilkumar'},
    {'email': 'senthil.thil@sbi.co.in', 'name': 'Senthilkumar'},
    {'email': 'tvarghez43@gmail.com', 'name': 'Thomson'},
    {'email': 'nagaresarthak32@gmail.com', 'name': 'Sarthak'},
    {'email': 'jainvignesh90@gmail.com', 'name': 'Vicky'},
    {'email': 'rashmihasda@gmail.com', 'name': 'Rashmi'},
    {'email': 'rahulprem512@gmail.com', 'name': 'Rahul'},
]


def send_nudge(user):
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

            <h2 style="color: #1a1a1a;">Hi {user['name']}, ready to start practicing? 🎯</h2>

            <p style="color: #444;">Your account is all set up! Here's how to take your first practice test in under 2 minutes:</p>

            <div style="background: #f0f4ff; border-radius: 12px; padding: 24px; margin: 24px 0;">
                <p style="margin: 0 0 12px 0; font-weight: bold; color: #1e40af;">3 Simple Steps:</p>
                <ol style="color: #374151; margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 8px;"><strong>Login</strong> at <a href="{FRONTEND_URL}/login" style="color: #4F46E5;">mockmaster.fun/login</a></li>
                    <li style="margin-bottom: 8px;"><strong>Select a paper</strong> (IE&IFS, PPB, AFM, or RBWM)</li>
                    <li style="margin-bottom: 8px;"><strong>Click "Start Test"</strong> — you'll get 50 questions with instant feedback</li>
                </ol>
            </div>

            <div style="background: #ecfdf5; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #a7f3d0;">
                <p style="margin: 0; font-weight: bold; color: #065f46;">✨ What you get:</p>
                <ul style="color: #374151; margin: 8px 0 0 0; padding-left: 20px;">
                    <li>50 questions per practice set — no time limit</li>
                    <li>Instant "Check Answer" after each question</li>
                    <li>AI explanations citing RBI circulars & IIBF textbooks</li>
                    <li>Score tracking & weak area identification</li>
                </ul>
            </div>

            <p style="text-align: center; margin: 30px 0;">
                <a href="{FRONTEND_URL}/login" style="display: inline-block; padding: 14px 32px; background-color: #4F46E5; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Start Your First Practice Test →</a>
            </p>

            <p style="color: #666; font-size: 14px;">
                <strong>Pro tip:</strong> Start with the paper you find easiest (most people pick PPB) to build confidence, then move to tougher papers.
            </p>

            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #888; text-align: center;">
                <p>You're receiving this because you signed up at mockmaster.fun</p>
                <p>Questions? Reply to this email or contact support@mockmaster.fun</p>
            </div>
        </div>
    </body>
    </html>
    """

    text_body = f"""Hi {user['name']},

Your MockMaster account is ready! Here's how to take your first practice test:

1. Login at {FRONTEND_URL}/login
2. Select a paper (IE&IFS, PPB, AFM, or RBWM)
3. Click "Start Test" — you'll get 50 questions with instant feedback

What you get:
- 50 questions per practice set, no time limit
- Instant answer checking
- AI explanations citing RBI circulars
- Score tracking & weak area analysis

Start now: {FRONTEND_URL}/login

Pro tip: Start with PPB (most people find it easiest) to build confidence.

— MockMaster Team
"""

    response = ses_client.send_email(
        Source=f"MockMaster <{SENDER_EMAIL}>",
        Destination={'ToAddresses': [user['email']]},
        Message={
            'Subject': {'Data': f"{user['name']}, take your first JAIIB practice test (2 min setup) 🎯"},
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
            resp = send_nudge(user)
            msg_id = resp['MessageId']
            print(f"✅ Sent to {user['email']} (MessageId: {msg_id})")
        except Exception as e:
            print(f"❌ Failed for {user['email']}: {e}")
