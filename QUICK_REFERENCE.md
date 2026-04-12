# Quick Reference - JAIIB-CAIIB Portal Deployment

## Current Status: Phase 1 Complete ✓

All Lambda functions deployed and authentication service ready.

## Quick Commands

### Check Lambda Status
```bash
bash check-lambda-status.sh
```

### Test Lambda Functions
```bash
bash quick-test-lambdas.sh
```

### View CloudWatch Logs
```bash
# Auth function
aws logs tail /aws/lambda/jaiib-auth --region ap-south-1 --follow

# Practice function
aws logs tail /aws/lambda/jaiib-practice --region ap-south-1 --follow

# Question bank function
aws logs tail /aws/lambda/jaiib-question-bank --region ap-south-1 --follow
```

### Deploy Updated Lambda Function
```bash
# For auth function
python3 clean-package-auth.py
aws lambda update-function-code \
  --function-name jaiib-auth \
  --zip-file fileb://backend/auth/auth_lambda.zip \
  --region ap-south-1
```

### Connect to API Gateway
```bash
bash connect-lambdas-to-api.sh
```

## Lambda Functions

| Name | Handler | Status |
|------|---------|--------|
| jaiib-auth | lambda_function.handler | ✓ Active |
| jaiib-practice | lambda_function.handler | ✓ Active |
| jaiib-ai-tutor | lambda_function.lambda_handler | ✓ Active |
| jaiib-question-bank | lambda_function.handler | ✓ Active |
| jaiib-audit | lambda_function.handler | ✓ Active |
| jaiib-notifications | lambda_function.handler | ✓ Active |

## Environment Variables

All Lambda functions have these environment variables:
- USERS_TABLE=jaiib-users
- SESSIONS_TABLE=jaiib-practice-sessions
- SCORES_TABLE=jaiib-scores
- QUESTIONS_TABLE=jaiib-question-bank
- AUDIT_TABLE=jaiib-audit-logs
- NOTIFICATIONS_TABLE=jaiib-notifications
- KMS_KEY_ID=arn:aws:kms:ap-south-1:438097524343:alias/jaiib-kms-key
- BEDROCK_MODEL_ID=anthropic.claude-haiku-4.5-v1:0
- SES_SENDER_EMAIL=noreply@jaiib-portal.com
- REGION=ap-south-1

## AWS Account Details

- Account ID: 438097524343
- Region: ap-south-1
- API Gateway: jaiib-caiib-api
- Frontend: Deployed to AWS Amplify

## Key Files

### Implementation Plan
- `tasks.md` - Complete implementation plan with all 21 tasks

### Deployment Scripts
- `deploy-lambdas.sh` - Deploy all Lambda functions
- `package_lambdas.py` - Package Lambda functions
- `clean-package-auth.py` - Clean repackage auth function
- `quick-test-lambdas.sh` - Quick test Lambda functions
- `check-lambda-status.sh` - Check Lambda status
- `connect-lambdas-to-api.sh` - Connect to API Gateway

### Documentation
- `IMPLEMENTATION_STATUS.md` - Current implementation status
- `LAMBDA_DEPLOYMENT_COMPLETE.md` - Lambda deployment summary
- `LAMBDA_FIX_COMPLETE.md` - Bcrypt issue fix details
- `QUICK_REFERENCE.md` - This file

## Backend Code

### Lambda Functions
- `backend/auth/lambda_function.py` - Authentication
- `backend/practice/lambda_function.py` - Practice sets
- `backend/ai_tutor/lambda_function.py` - AI explanations
- `backend/question_bank/lambda_function.py` - Question management
- `backend/audit/lambda_function.py` - Audit logging
- `backend/notifications/lambda_function.py` - Notifications

### Requirements
- `backend/auth/requirements.txt` - Auth dependencies
- `backend/practice/requirements.txt` - Practice dependencies
- `backend/ai_tutor/requirements.txt` - AI tutor dependencies
- `backend/question_bank/requirements.txt` - Question bank dependencies
- `backend/audit/requirements.txt` - Audit dependencies
- `backend/notifications/requirements.txt` - Notification dependencies

## Frontend

- Deployed to AWS Amplify
- React.js with TypeScript
- Tailwind CSS styling
- Login page accessible at: https://jaiib-portal.amplifyapp.com/login

## Next Steps

1. **Connect Lambda to API Gateway**
   ```bash
   bash connect-lambdas-to-api.sh
   ```

2. **Test Authentication**
   - Register a test user
   - Verify email
   - Login with credentials

3. **Start Phase 2 Implementation**
   - Open `tasks.md`
   - Begin Task 4: Practice Set Generation

## Troubleshooting

### Lambda Import Error
If you see `No module named '_cffi_backend'`:
```bash
python3 clean-package-auth.py
aws lambda update-function-code \
  --function-name jaiib-auth \
  --zip-file fileb://backend/auth/auth_lambda.zip \
  --region ap-south-1
```

### Check Lambda Logs
```bash
aws logs tail /aws/lambda/jaiib-auth --region ap-south-1 --since 1h
```

### Verify Dependencies
```bash
unzip -l backend/auth/auth_lambda.zip | grep -E "(passlib|bcrypt)"
```

## Important Notes

- All Lambda functions use Python 3.8
- Password hashing uses PBKDF2 (passlib) - no C extensions required
- All dependencies are Python 3.8 compatible
- DynamoDB tables have KMS encryption enabled
- CloudWatch monitoring is active
- Audit logging is configured

## Contact & Support

For issues:
1. Check CloudWatch logs
2. Review deployment scripts
3. Verify environment variables
4. Check IAM permissions

---

**Last Updated**: 2026-04-12
**Phase**: 1 Complete ✓
**Next Phase**: Phase 2 - Core Practice Engine
