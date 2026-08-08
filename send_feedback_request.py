"""
Send email to verified users requesting them to take a practice test and share feedback.
"""
import boto3

SENDER_EMAIL = 'noreply@mockmaster.fun'
REGION = 'ap-south-1'
FRONTEND_URL = 'https://mockmaster.fun'

ses_client = boto3.client('ses', region_name=REGION)

USERS = [
    {'email': 'tvarghez43@gmail.com', 'name': 'Thomson'},
    {'email': 'jainvignesh90@gmail.com', 'name': 'Vicky'},
    {'email': 'rashmihasda@gmail.com', 'name': 'Rashmi'},
    {'email': 'backups.deepdutta@gmail.com', 'name': 'Deep'},
    {'email': 'kariyappangr2@gmail.com', 'name': 'Ram'},
    {'email': 'mahesh54445@gmail.com', 'name': 'Mahesh'},
    {'email': 'pradeep.munda1@gmail.com', 'name': 'Pradeep'},
    {'email': 'mekaveerababu@gmail.com', 'name': 'Veerababu'},
]


def send_feedback_email(user):
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

            <h2 style="color: #1a1a1a;">Hi {user['name']}, we'd love your feedback! 🙏</h2>

            <p style="color: #444;">
                We've been working hard to improve MockMaster and would really appreciate 5 minutes of your time.
                Could you take one practice test and let us know what you think?
            </p>

            <div style="background: #f0f4ff; border-radius: 12px; padding: 24px; margin: 24px 0;">
                <p style="margin: 0 0 12px 0; font-weight: bold; color: #1e40af;">What we'd like you to try:</p>
                <ol style="color: #374151; margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 8px;">Login at <a href="{FRONTEND_URL}/login" style="color: #4F46E5;">{FRONTEND_URL}/login</a></li>
                    <li style="margin-bottom: 8px;">Pick any paper (PPB is recommended for first try)</li>
                    <li style="margin-bottom: 8px;">Attempt at least 10-15 questions</li>
                    <li style="margin-bottom: 8px;">Click "Check" after each question to see the AI explanation</li>
                </ol>
            </div>

            <div style="background: #fef3c7; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #f59e0b;">
                <p style="margin: 0; font-weight: bold; color: #92400e;">📝 Then reply to this email with your feedback:</p>
                <ul style="color: #78350f; margin: 12px 0 0 0; padding-left: 20px;">
                    <li>Were the questions relevant and of good quality?</li>
                    <li>Were the AI explanations helpful?</li>
                    <li>Was anything confusing or broken?</li>
                    <li>What feature would you most want added?</li>
                    <li>Would you recommend this to a colleague? Why or why not?</li>
                </ul>
            </div>

            <p style="text-align: center; margin: 30px 0;">
                <a href="{FRONTEND_URL}/login" style="display: inline-block; padding: 14px 32px; background-color: #4F46E5; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Take a Practice Test →</a>
            </p>

            <p style="color: #666; font-size: 14px;">
                Your honest feedback (positive or negative) helps us build a better product for all JAIIB aspirants.
                Even a one-line reply is valuable!
            </p>

            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #888; text-align: center;">
                <p>You're receiving this because you signed up at mockmaster.fun</p>
                <p>Just reply to this email with your feedback — it comes directly to us.</p>
            </div>
        </div>
    </body>
    </html>
    """

    text_body = f"""Hi {user['name']},

We'd love your feedback on MockMaster! Could you take 5 minutes to try a practice test?

Steps:
1. Login at {FRONTEND_URL}/login
2. Pick any paper (PPB recommended)
3. Attempt 10-15 questions
4. Click "Check" after each question to see the AI explanation

Then reply to this email with your thoughts:
- Were the questions relevant and good quality?
- Were the AI explanations helpful?
- Was anything confusing or broken?
- What feature would you most want added?
- Would you recommend this to a colleague?

Your honest feedback (even one line) helps us improve.

Take a test: {FRONTEND_URL}/login

Thanks!
— MockMaster Team
"""

    response = ses_client.send_email(
        Source=f"MockMaster <{SENDER_EMAIL}>",
        ReplyToAddresses=['support@mockmaster.fun'],
        Destination={'ToAddresses': [user['email']]},
        Message={
            'Subject': {'Data': f"{user['name']}, can you try one practice test & share feedback? (2 min) 🙏"},
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
            resp = send_feedback_email(user)
            msg_id = resp['MessageId']
            print(f"✅ Sent to {user['email']} (MessageId: {msg_id})")
        except Exception as e:
            print(f"❌ Failed for {user['email']}: {e}")
