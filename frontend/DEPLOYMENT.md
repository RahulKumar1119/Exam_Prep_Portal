# Frontend Deployment Guide

## Overview

This guide covers the deployment of the JAIIB-CAIIB Exam Prep Portal React frontend to AWS Amplify with CloudFront CDN distribution.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CloudFront CDN                            │
│  - Static asset caching (images, CSS, JS)                   │
│  - Global edge locations                                     │
│  - TLS 1.2+ encryption                                       │
│  - Automatic compression                                     │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  AWS Amplify                                 │
│  - React.js hosting                                          │
│  - Automated builds and deployments                          │
│  - Environment-specific configurations                       │
│  - Automatic HTTPS                                           │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│              S3 Backend Storage                              │
│  - Build artifacts                                           │
│  - CloudFront logs                                           │
│  - Static assets                                             │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI v2 installed and configured
- Node.js 18+ and npm 9+
- Git repository connected to AWS Amplify
- Domain name (optional, for custom domain)

## Environment Setup

### 1. Install Dependencies

```bash
# Install Node.js dependencies
npm ci

# Install AWS CLI (if not already installed)
# macOS
brew install awscli

# Linux
sudo apt-get install awscliv2

# Windows
# Download from https://aws.amazon.com/cli/
```

### 2. Configure AWS Credentials

```bash
# Configure AWS CLI with your credentials
aws configure

# Verify configuration
aws sts get-caller-identity
```

### 3. Set Environment Variables

```bash
# Set AWS region (default: ap-south-1 for India)
export AWS_REGION=ap-south-1

# Set Amplify app ID (obtained after creating Amplify app)
export AMPLIFY_APP_ID=your-app-id

# Set deployment environment
export DEPLOYMENT_ENV=staging
```

## Deployment Process

### Step 1: Infrastructure Setup

Run the infrastructure deployment script to set up AWS resources:

```bash
cd infrastructure
bash deploy-frontend.sh staging
```

This script will:
- Create S3 buckets for logs and artifacts
- Set up IAM roles for Amplify
- Create CloudFront distribution
- Generate environment configuration files

### Step 2: Build and Deploy Frontend

```bash
cd frontend
bash deploy.sh staging
```

This script will:
- Install dependencies
- Run tests
- Build the React application
- Deploy to AWS Amplify
- Run smoke tests

### Step 3: Verify Deployment

```bash
# Check Amplify app status
aws amplify get-app --app-id $AMPLIFY_APP_ID

# Get deployment status
aws amplify list-jobs --app-id $AMPLIFY_APP_ID --branch-name main

# Test CloudFront distribution
curl -I https://your-cloudfront-domain.cloudfront.net
```

## Environment Configuration

### Development Environment

**File:** `frontend/.env.development`

```env
REACT_APP_API_ENDPOINT=http://localhost:3001
REACT_APP_ENVIRONMENT=development
REACT_APP_LOG_LEVEL=debug
REACT_APP_CACHE_TTL=300000
```

**Usage:**
```bash
npm start
```

### Staging Environment

**File:** `frontend/.env.staging`

```env
REACT_APP_API_ENDPOINT=https://staging-api.jaiib-caiib.example.com
REACT_APP_ENVIRONMENT=staging
REACT_APP_LOG_LEVEL=info
```

**Deployment:**
```bash
bash deploy.sh staging
```

### Production Environment

**File:** `frontend/.env.production`

```env
REACT_APP_API_ENDPOINT=https://api.jaiib-caiib.example.com
REACT_APP_ENVIRONMENT=production
REACT_APP_LOG_LEVEL=warn
REACT_APP_ENABLE_ANALYTICS=true
```

**Deployment:**
```bash
bash deploy.sh production
```

## Build Pipeline Configuration

### Amplify Build Settings

The `amplify.yml` file defines the build pipeline:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: build
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Build Phases

1. **Pre-Build Phase**
   - Install dependencies using `npm ci` (clean install)
   - Validate environment variables
   - Run linting checks

2. **Build Phase**
   - Build React application with `npm run build`
   - Generate optimized production bundle
   - Create source maps for debugging

3. **Post-Build Phase** (optional)
   - Run tests
   - Generate reports
   - Upload artifacts

## CloudFront Configuration

### Cache Behaviors

**Static Assets** (`/static/*`)
- Cache TTL: 31536000 seconds (1 year)
- Compression: Enabled
- Methods: GET, HEAD

**API Requests** (`/api/*`)
- Cache TTL: 0 seconds (no caching)
- Compression: Enabled
- Methods: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE

**HTML Files** (default)
- Cache TTL: 300 seconds (5 minutes)
- Compression: Enabled
- Methods: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE

### Security Headers

CloudFront automatically adds:
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

### Logging

CloudFront logs are stored in S3:
- **Bucket:** `jaiib-caiib-cloudfront-logs-{environment}`
- **Prefix:** `cloudfront-logs/`
- **Retention:** 90 days (configurable)

## Performance Optimization

### Frontend Optimization

1. **Code Splitting**
   - React Router lazy loading
   - Dynamic imports for large components
   - Separate vendor bundle

2. **Asset Optimization**
   - Image compression (WebP format)
   - CSS minification
   - JavaScript minification
   - Source map generation

3. **Caching Strategy**
   - Browser caching for static assets
   - CloudFront edge caching
   - React Query for API response caching

### Performance Targets

- **Page Load Time:** <3 seconds (p95) on 3G
- **First Contentful Paint:** <1.5 seconds
- **Largest Contentful Paint:** <2.5 seconds
- **Cumulative Layout Shift:** <0.1

## Monitoring and Logging

### CloudWatch Metrics

Monitor these key metrics:

```bash
# API response time
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name OriginLatency \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 300 \
  --statistics Average,Maximum

# Cache hit rate
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name CacheHitRate \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 300 \
  --statistics Average
```

### CloudFront Logs Analysis

```bash
# Download CloudFront logs
aws s3 sync s3://jaiib-caiib-cloudfront-logs-staging/cloudfront-logs/ ./logs/

# Analyze logs
grep "200" logs/*.gz | wc -l  # Count successful requests
grep "404" logs/*.gz | wc -l  # Count not found errors
```

## Troubleshooting

### Build Failures

**Issue:** Build fails with "npm ERR! code ERESOLVE"

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Use legacy peer deps
npm ci --legacy-peer-deps
```

**Issue:** Build timeout

**Solution:**
- Increase build timeout in Amplify console
- Optimize dependencies
- Use npm ci instead of npm install

### Deployment Issues

**Issue:** Amplify deployment fails

**Solution:**
```bash
# Check Amplify logs
aws amplify list-jobs --app-id $AMPLIFY_APP_ID --branch-name main

# Get detailed job logs
aws amplify get-job --app-id $AMPLIFY_APP_ID --branch-name main --job-id <job-id>
```

**Issue:** CloudFront returns 403 Forbidden

**Solution:**
- Verify S3 bucket permissions
- Check CloudFront origin configuration
- Verify IAM role permissions

### Performance Issues

**Issue:** Slow page load

**Solution:**
```bash
# Analyze bundle size
npm run build -- --analyze

# Check CloudFront cache hit rate
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name CacheHitRate \
  --dimensions Name=DistributionId,Value=<distribution-id>
```

## Rollback Procedure

### Rollback to Previous Version

```bash
# List previous deployments
aws amplify list-jobs --app-id $AMPLIFY_APP_ID --branch-name main

# Redeploy specific commit
aws amplify start-job \
  --app-id $AMPLIFY_APP_ID \
  --branch-name main \
  --job-type RELEASE \
  --commit-id <previous-commit-id>
```

### Rollback CloudFront Configuration

```bash
# Get previous distribution configuration
aws cloudfront get-distribution-config --id $DISTRIBUTION_ID

# Update distribution with previous config
aws cloudfront update-distribution \
  --id $DISTRIBUTION_ID \
  --distribution-config file://previous-config.json
```

## Cost Optimization

### Recommendations

1. **CloudFront**
   - Use PriceClass_100 for cost optimization
   - Enable compression for text assets
   - Set appropriate cache TTLs

2. **Amplify**
   - Use build cache to reduce build time
   - Optimize dependencies
   - Monitor build minutes usage

3. **S3**
   - Enable S3 Intelligent-Tiering
   - Set lifecycle policies for old logs
   - Use S3 Transfer Acceleration if needed

### Cost Monitoring

```bash
# Get Amplify build minutes usage
aws amplify get-app --app-id $AMPLIFY_APP_ID

# Monitor CloudFront costs
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --filter file://cloudfront-filter.json
```

## Security Best Practices

1. **HTTPS Enforcement**
   - All traffic redirected to HTTPS
   - TLS 1.2+ required
   - HSTS header enabled

2. **Access Control**
   - CloudFront Origin Access Identity (OAI)
   - S3 bucket policies restrict direct access
   - IAM roles with least privilege

3. **Data Protection**
   - Sensitive data encrypted in transit
   - Environment variables not exposed in frontend
   - API keys stored securely

4. **Monitoring**
   - CloudWatch alarms for errors
   - CloudFront access logs analyzed
   - Security group rules reviewed regularly

## Maintenance

### Regular Tasks

- **Weekly:** Monitor CloudFront metrics and error rates
- **Monthly:** Review and optimize cache settings
- **Quarterly:** Update dependencies and security patches
- **Annually:** Review and optimize costs

### Backup and Recovery

```bash
# Backup current distribution config
aws cloudfront get-distribution-config --id $DISTRIBUTION_ID > backup-config.json

# Backup S3 artifacts
aws s3 sync s3://jaiib-caiib-frontend-artifacts-staging/ ./backup/
```

## Support and Documentation

- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [React Deployment Guide](https://create-react-app.dev/deployment/)
- [AWS CLI Reference](https://docs.aws.amazon.com/cli/latest/reference/)

## Contact

For deployment issues or questions, contact the DevOps team or refer to the main README.md.
