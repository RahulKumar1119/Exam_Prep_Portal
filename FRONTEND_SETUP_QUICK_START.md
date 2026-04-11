# Frontend Setup Quick Start Guide

## One-Command Deployment

### Prerequisites
- AWS Account with appropriate permissions
- AWS CLI v2 configured
- Node.js 18+ and npm 9+
- GitHub repository connected

## Quick Setup (5 minutes)

### 1. Set Environment Variables

```bash
export AWS_REGION=ap-south-1
export DEPLOYMENT_ENV=staging
export AMPLIFY_APP_ID=your-app-id  # Get from AWS Amplify console
```

### 2. Deploy Infrastructure

```bash
cd infrastructure
bash deploy-frontend.sh $DEPLOYMENT_ENV
```

This creates:
- S3 buckets for logs and artifacts
- IAM roles for Amplify
- CloudFront distribution
- Environment configuration files

### 3. Deploy Frontend

```bash
cd frontend
bash deploy.sh $DEPLOYMENT_ENV
```

This:
- Installs dependencies
- Runs tests
- Builds React app
- Deploys to Amplify
- Runs smoke tests

## Deployment Checklist

- [ ] AWS credentials configured
- [ ] Node.js 18+ installed
- [ ] GitHub repository connected to Amplify
- [ ] Environment variables set
- [ ] Infrastructure deployed
- [ ] Frontend deployed
- [ ] Smoke tests passed
- [ ] CloudFront distribution active
- [ ] Custom domain configured (optional)

## Environment Variables

### Development
```bash
REACT_APP_API_ENDPOINT=http://localhost:3001
REACT_APP_ENVIRONMENT=development
```

### Staging
```bash
REACT_APP_API_ENDPOINT=https://staging-api.jaiib-caiib.example.com
REACT_APP_ENVIRONMENT=staging
```

### Production
```bash
REACT_APP_API_ENDPOINT=https://api.jaiib-caiib.example.com
REACT_APP_ENVIRONMENT=production
```

## Verify Deployment

```bash
# Check Amplify app
aws amplify get-app --app-id $AMPLIFY_APP_ID

# Check CloudFront distribution
aws cloudfront list-distributions

# Test frontend
curl -I https://your-cloudfront-domain.cloudfront.net
```

## Common Commands

```bash
# Build locally
npm run build

# Run tests
npm test

# Start development server
npm start

# Deploy to staging
bash frontend/deploy.sh staging

# Deploy to production
bash frontend/deploy.sh production

# View Amplify logs
aws amplify list-jobs --app-id $AMPLIFY_APP_ID --branch-name main

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
```

## Performance Targets

- Page load time: <3 seconds (3G)
- First Contentful Paint: <1.5 seconds
- Cache hit rate: >80%
- API response time: <200ms (p95)

## Support

For issues or questions:
1. Check `frontend/DEPLOYMENT.md` for detailed guide
2. Check `infrastructure/FRONTEND_INFRASTRUCTURE.md` for architecture
3. Review CloudWatch logs: `aws amplify list-jobs --app-id $AMPLIFY_APP_ID`
4. Check CloudFront logs: `s3://jaiib-caiib-cloudfront-logs-{env}/`

## Next Steps

1. Configure custom domain in Amplify console
2. Set up monitoring and alarms
3. Configure CI/CD pipeline
4. Set up performance monitoring
5. Configure backup and disaster recovery
