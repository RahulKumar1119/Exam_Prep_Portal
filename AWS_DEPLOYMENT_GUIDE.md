# AWS Deployment Guide - JAIIB-CAIIB Exam Prep Portal

## Overview

This guide covers deploying the JAIIB-CAIIB Exam Prep Portal to AWS with:
- Frontend: AWS Amplify (React app)
- Backend: AWS Lambda + API Gateway
- Database: DynamoDB
- Storage: S3 (for static assets)
- CDN: CloudFront

## Prerequisites

1. AWS Account with appropriate permissions
2. AWS CLI configured with credentials
3. Node.js 16+ and npm
4. Python 3.8+
5. AWS CDK installed: `npm install -g aws-cdk`

## Step 1: Get Your API Gateway URL

After deploying the backend infrastructure (CDK stack), you'll have an API Gateway URL. It looks like:
```
https://abc123def.execute-api.us-east-1.amazonaws.com/prod
```

## Step 2: Configure Frontend Environment Variables

### For Production Deployment

1. Update `frontend/.env.production`:
```bash
REACT_APP_API_URL=https://your-api-gateway-url.execute-api.region.amazonaws.com/prod/api
REACT_APP_ENVIRONMENT=production
```

2. Update `frontend/.env.staging`:
```bash
REACT_APP_API_URL=https://your-api-gateway-url.execute-api.region.amazonaws.com/staging/api
REACT_APP_ENVIRONMENT=staging
```

Replace:
- `your-api-gateway-url` with your actual API Gateway ID
- `region` with your AWS region (e.g., us-east-1)

## Step 3: Build Frontend for Production

```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# Build for staging
REACT_APP_API_URL=https://your-api-gateway-url.execute-api.region.amazonaws.com/staging/api npm run build
```

## Step 4: Deploy Backend Infrastructure

### Deploy CDK Stack

```bash
cd infrastructure

# Install CDK dependencies
npm install

# Deploy the stack
cdk deploy

# Note the outputs:
# - API Gateway URL
# - CloudFront Distribution URL
# - S3 Bucket Name
```

## Step 5: Deploy Frontend to AWS Amplify

### Option A: Using AWS Amplify Console (Recommended)

1. Push code to GitHub/GitLab/Bitbucket
2. Go to AWS Amplify Console
3. Click "New app" → "Host web app"
4. Select your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Start command: `npm start`
6. Add environment variables:
   ```
   REACT_APP_API_URL=https://your-api-gateway-url.execute-api.region.amazonaws.com/prod/api
   REACT_APP_ENVIRONMENT=production
   ```
7. Deploy

### Option B: Manual S3 + CloudFront Deployment

```bash
# Build the frontend
cd frontend
npm run build

# Upload to S3
aws s3 sync build/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Step 6: Configure CORS in API Gateway

The API Gateway must allow requests from your frontend domain.

### Update CORS Settings

1. Go to API Gateway Console
2. Select your API
3. Go to Resources → {proxy+} → ANY
4. Click "Enable CORS"
5. Add your frontend domain to allowed origins:
   ```
   https://your-domain.com
   https://www.your-domain.com
   http://localhost:3000 (for local development)
   ```

## Step 7: Update Frontend API Configuration

The frontend is already configured to use environment variables. The API client will automatically use:

```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
```

## Step 8: Deploy Lambda Functions

### Deploy Auth Lambda

```bash
cd backend/auth

# Package the function
zip -r lambda_function.zip lambda_function.py

# Deploy to AWS Lambda
aws lambda update-function-code \
  --function-name jaiib-auth-lambda \
  --zip-file fileb://lambda_function.zip
```

### Deploy Practice Lambda

```bash
cd backend/practice

# Package the function
zip -r lambda_function.zip lambda_function.py session_manager.py timer_service.py scoring_service.py

# Deploy to AWS Lambda
aws lambda update-function-code \
  --function-name jaiib-practice-lambda \
  --zip-file fileb://lambda_function.zip
```

## Step 9: Verify Deployment

### Test API Endpoints

```bash
# Test registration endpoint
curl -X POST https://your-api-gateway-url.execute-api.region.amazonaws.com/prod/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "full_name": "Test User",
    "bank_affiliation": "Test Bank"
  }'

# Test login endpoint
curl -X POST https://your-api-gateway-url.execute-api.region.amazonaws.com/prod/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

### Test Frontend

1. Open your frontend URL in browser
2. Navigate to `/register`
3. Fill in the registration form
4. Submit and verify the request goes to your API Gateway

## Step 10: Configure Custom Domain (Optional)

### Using Route 53

1. Go to Route 53 Console
2. Create a hosted zone for your domain
3. Create an A record pointing to CloudFront distribution
4. Update ACM certificate for HTTPS

### Using API Gateway Custom Domain

1. Go to API Gateway Console
2. Click "Custom domain names"
3. Create new custom domain
4. Map to your API stage
5. Update Route 53 records

## Environment Variables Reference

### Frontend (.env files)

| Variable | Description | Example |
|----------|-------------|---------|
| REACT_APP_API_URL | Backend API base URL | https://api.example.com/api |
| REACT_APP_ENVIRONMENT | Environment name | production, staging, development |

### Backend (Lambda Environment Variables)

Set these in Lambda console or via CDK:

| Variable | Description | Example |
|----------|-------------|---------|
| DYNAMODB_REGION | AWS region | us-east-1 |
| KMS_KEY_ID | KMS key for encryption | arn:aws:kms:... |
| JWT_SECRET | Secret for JWT signing | your-secret-key |
| JWT_EXPIRY | Token expiry in minutes | 30 |

## Troubleshooting

### CORS Errors

**Problem**: "Access to XMLHttpRequest blocked by CORS policy"

**Solution**:
1. Check API Gateway CORS settings
2. Verify frontend domain is in allowed origins
3. Check response headers include `Access-Control-Allow-Origin`

### 404 Errors

**Problem**: "Cannot POST /api/auth/register"

**Solution**:
1. Verify API Gateway URL is correct
2. Check Lambda function is deployed
3. Verify API Gateway routes are configured
4. Check CloudWatch logs for Lambda errors

### 500 Errors

**Problem**: "Internal Server Error"

**Solution**:
1. Check CloudWatch logs for Lambda errors
2. Verify DynamoDB tables exist
3. Check Lambda IAM role has DynamoDB permissions
4. Verify environment variables are set

### Slow Response Times

**Problem**: API calls take >5 seconds

**Solution**:
1. Enable Lambda provisioned concurrency
2. Configure DynamoDB auto-scaling
3. Enable API Gateway caching
4. Use CloudFront for static assets

## Monitoring & Logging

### CloudWatch Logs

View Lambda logs:
```bash
aws logs tail /aws/lambda/jaiib-auth-lambda --follow
aws logs tail /aws/lambda/jaiib-practice-lambda --follow
```

### CloudWatch Metrics

Monitor in CloudWatch Console:
- Lambda invocations and duration
- API Gateway requests and latency
- DynamoDB read/write capacity
- Error rates

### X-Ray Tracing

Enable X-Ray for detailed tracing:
```bash
aws lambda update-function-configuration \
  --function-name jaiib-auth-lambda \
  --tracing-config Mode=Active
```

## Cost Optimization

1. **Lambda**: Use provisioned concurrency for predictable load
2. **DynamoDB**: Enable auto-scaling, use on-demand for variable load
3. **API Gateway**: Enable caching for frequently accessed endpoints
4. **CloudFront**: Set appropriate TTL for static assets
5. **S3**: Enable lifecycle policies for old logs

## Security Best Practices

1. **Secrets Management**: Use AWS Secrets Manager for sensitive data
2. **IAM Roles**: Follow least privilege principle
3. **VPC**: Deploy Lambda in VPC for database access
4. **Encryption**: Enable encryption at rest and in transit
5. **API Keys**: Implement API key validation
6. **Rate Limiting**: Configure API Gateway throttling

## Rollback Procedure

If deployment fails:

```bash
# Rollback Lambda function
aws lambda update-function-code \
  --function-name jaiib-auth-lambda \
  --s3-bucket your-backup-bucket \
  --s3-key previous-version.zip

# Rollback frontend (if using Amplify)
# Go to Amplify Console → Deployments → Select previous version → Redeploy

# Rollback CDK stack
cdk destroy
cdk deploy
```

## Next Steps

1. Set up CI/CD pipeline (GitHub Actions, CodePipeline)
2. Configure automated backups for DynamoDB
3. Set up monitoring and alerting
4. Implement blue-green deployment strategy
5. Create disaster recovery plan

## Support

For issues or questions:
1. Check CloudWatch logs
2. Review AWS documentation
3. Check application error messages
4. Contact AWS support

---

**Last Updated**: April 2026
**Version**: 1.0
