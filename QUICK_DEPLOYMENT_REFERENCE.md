# Quick AWS Deployment Reference

## TL;DR - 5 Steps to Deploy

### 1. Get Your API Gateway URL
After CDK deployment, you'll have a URL like:
```
https://abc123def.execute-api.us-east-1.amazonaws.com/prod
```

### 2. Update Frontend Environment Variables

**For Production:**
```bash
# frontend/.env.production
REACT_APP_API_URL=https://abc123def.execute-api.us-east-1.amazonaws.com/prod/api
REACT_APP_ENVIRONMENT=production
```

**For Staging:**
```bash
# frontend/.env.staging
REACT_APP_API_URL=https://abc123def.execute-api.us-east-1.amazonaws.com/staging/api
REACT_APP_ENVIRONMENT=staging
```

### 3. Build Frontend
```bash
cd frontend
npm install
npm run build
```

### 4. Deploy to AWS Amplify
- Push code to GitHub
- Connect to Amplify Console
- Add environment variables
- Deploy

### 5. Test
```bash
# Test registration
curl -X POST https://your-api-url/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "full_name": "Test User",
    "bank_affiliation": "Test Bank"
  }'
```

## Environment Variables

### Frontend (.env files)

| File | Variable | Value |
|------|----------|-------|
| .env.production | REACT_APP_API_URL | https://your-api-gateway-url/prod/api |
| .env.production | REACT_APP_ENVIRONMENT | production |
| .env.staging | REACT_APP_API_URL | https://your-api-gateway-url/staging/api |
| .env.staging | REACT_APP_ENVIRONMENT | staging |
| .env.development | REACT_APP_API_URL | http://localhost:5000/api |
| .env.development | REACT_APP_ENVIRONMENT | development |

## Common Issues & Fixes

### CORS Error
**Error**: "Access to XMLHttpRequest blocked by CORS policy"

**Fix**:
1. Go to API Gateway Console
2. Select your API
3. Go to Resources → {proxy+} → ANY
4. Click "Enable CORS"
5. Add your frontend domain to allowed origins

### 404 Not Found
**Error**: "Cannot POST /api/auth/register"

**Fix**:
1. Verify API Gateway URL is correct
2. Check Lambda function is deployed
3. Verify API Gateway routes are configured

### 500 Internal Server Error
**Error**: "Internal Server Error"

**Fix**:
1. Check CloudWatch logs: `aws logs tail /aws/lambda/jaiib-auth-lambda --follow`
2. Verify DynamoDB tables exist
3. Check Lambda IAM role has permissions

### Slow Response
**Error**: API calls take >5 seconds

**Fix**:
1. Enable Lambda provisioned concurrency
2. Configure DynamoDB auto-scaling
3. Enable API Gateway caching

## Useful Commands

### View API Gateway URL
```bash
aws apigateway get-rest-apis --query 'items[0].id' --output text
```

### View Lambda Logs
```bash
aws logs tail /aws/lambda/jaiib-auth-lambda --follow
aws logs tail /aws/lambda/jaiib-practice-lambda --follow
```

### Update Lambda Function
```bash
cd backend/auth
zip -r lambda_function.zip lambda_function.py
aws lambda update-function-code \
  --function-name jaiib-auth-lambda \
  --zip-file fileb://lambda_function.zip
```

### Deploy Frontend to S3
```bash
cd frontend
npm run build
aws s3 sync build/ s3://your-bucket-name --delete
```

### Invalidate CloudFront Cache
```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

## File Locations

| File | Purpose |
|------|---------|
| `frontend/.env.production` | Production environment variables |
| `frontend/.env.staging` | Staging environment variables |
| `frontend/.env.development` | Development environment variables |
| `frontend/amplify.yml` | Amplify build configuration |
| `AWS_DEPLOYMENT_GUIDE.md` | Detailed deployment guide |
| `DEPLOYMENT_CHECKLIST.md` | Complete deployment checklist |

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│              AWS Amplify + CloudFront                    │
│         https://your-domain.com                          │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS
┌────────────────────▼────────────────────────────────────┐
│                  API Gateway                             │
│  https://abc123.execute-api.region.amazonaws.com/prod   │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼──────┐ ┌──▼──────────┐ │
│ Auth Lambda  │ │ Practice    │ │
│              │ │ Lambda      │ │
└───────┬──────┘ └──┬──────────┘ │
        │           │            │
        └───────────┼────────────┘
                    │
        ┌───────────▼───────────┐
        │     DynamoDB          │
        │  (Encrypted with KMS) │
        └───────────────────────┘
```

## Next Steps

1. **Immediate**: Deploy infrastructure and frontend
2. **Short-term**: Set up monitoring and alerting
3. **Medium-term**: Configure CI/CD pipeline
4. **Long-term**: Implement blue-green deployments

## Support

- Check `AWS_DEPLOYMENT_GUIDE.md` for detailed instructions
- Review `DEPLOYMENT_CHECKLIST.md` before deploying
- Check CloudWatch logs for errors
- Review AWS documentation

---

**Last Updated**: April 2026
