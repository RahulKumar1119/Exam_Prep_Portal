# Frontend Infrastructure Setup Guide

## Overview

This document describes the AWS infrastructure setup for hosting the JAIIB-CAIIB Exam Prep Portal React frontend using AWS Amplify and CloudFront CDN.

## Architecture Components

### 1. AWS Amplify

**Purpose:** Hosting and continuous deployment of React frontend

**Features:**
- Automatic builds on code commits
- Environment-specific deployments
- Built-in HTTPS
- Automatic scaling
- Git integration

**Configuration:**
- Build command: `npm run build`
- Build output directory: `build/`
- Environment variables: Managed in Amplify console

### 2. CloudFront CDN

**Purpose:** Global content delivery and static asset caching

**Features:**
- 200+ edge locations worldwide
- Automatic compression
- DDoS protection
- SSL/TLS encryption
- Access logging

**Configuration:**
- Origin: Amplify hosting
- Cache behaviors: Static assets (1 year), API (no cache), HTML (5 min)
- Compression: Enabled for text assets
- Logging: S3 bucket for access logs

### 3. S3 Buckets

**Purpose:** Storage for logs and build artifacts

**Buckets:**
- `jaiib-caiib-cloudfront-logs-{env}`: CloudFront access logs
- `jaiib-caiib-frontend-artifacts-{env}`: Build artifacts and backups

**Configuration:**
- Versioning: Enabled
- Public access: Blocked
- Encryption: SSE-S3 (default)
- Lifecycle policies: 90-day retention for logs

### 4. IAM Roles and Policies

**Purpose:** Access control for AWS services

**Roles:**
- `jaiib-caiib-amplify-role-{env}`: Amplify deployment permissions
- `jaiib-caiib-cloudfront-role-{env}`: CloudFront access permissions

**Permissions:**
- S3 read/write for artifacts
- CloudFront distribution management
- CloudWatch logs access

## Deployment Architecture

```
GitHub Repository
       │
       ├─ Push to main branch
       │
       ▼
AWS Amplify
       │
       ├─ Trigger build
       ├─ Run tests
       ├─ Build React app
       │
       ▼
S3 Build Artifacts
       │
       ├─ Store build output
       │
       ▼
CloudFront Distribution
       │
       ├─ Cache static assets
       ├─ Serve via edge locations
       │
       ▼
End Users
```

## Setup Instructions

### Prerequisites

```bash
# Check AWS CLI version
aws --version

# Check Node.js version
node --version

# Check npm version
npm --version
```

### Step 1: Create Amplify App

```bash
# Using AWS Console
1. Go to AWS Amplify console
2. Click "Create app"
3. Select "Host web app"
4. Connect GitHub repository
5. Select branch (main)
6. Configure build settings
7. Deploy

# Using AWS CLI
aws amplify create-app \
  --name jaiib-caiib-exam-prep-portal \
  --region ap-south-1 \
  --repository https://github.com/your-org/jaiib-caiib-portal.git
```

### Step 2: Configure Environment Variables

```bash
# In Amplify Console:
1. Go to App settings > Environment variables
2. Add variables for each environment:

Development:
  REACT_APP_API_ENDPOINT=http://localhost:3001
  REACT_APP_ENVIRONMENT=development

Staging:
  REACT_APP_API_ENDPOINT=https://staging-api.jaiib-caiib.example.com
  REACT_APP_ENVIRONMENT=staging

Production:
  REACT_APP_API_ENDPOINT=https://api.jaiib-caiib.example.com
  REACT_APP_ENVIRONMENT=production
```

### Step 3: Set Up CloudFront Distribution

```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --distribution-config file://infrastructure/cloudfront-config.json \
  --region ap-south-1

# Get distribution ID
DISTRIBUTION_ID=$(aws cloudfront list-distributions \
  --query "DistributionList.Items[0].Id" \
  --output text)

echo "Distribution ID: $DISTRIBUTION_ID"
```

### Step 4: Configure Custom Domain (Optional)

```bash
# In Amplify Console:
1. Go to Domain management
2. Click "Add domain"
3. Enter your domain name
4. Configure DNS records
5. Wait for SSL certificate validation

# Using AWS CLI
aws amplify create-domain-association \
  --app-id $AMPLIFY_APP_ID \
  --domain-name jaiib-caiib.example.com \
  --enable-auto-sub-domain
```

### Step 5: Set Up Monitoring

```bash
# Create CloudWatch alarms
aws cloudwatch put-metric-alarm \
  --alarm-name cloudfront-error-rate \
  --alarm-description "Alert when CloudFront error rate exceeds 1%" \
  --metric-name ErrorRate \
  --namespace AWS/CloudFront \
  --statistic Average \
  --period 300 \
  --threshold 1 \
  --comparison-operator GreaterThanThreshold

# Create SNS topic for notifications
aws sns create-topic --name jaiib-caiib-alerts
```

## Build Pipeline Configuration

### Amplify Build Settings

File: `amplify.yml`

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - echo "Installing dependencies..."
        - npm ci
    build:
      commands:
        - echo "Building React application..."
        - npm run build
  artifacts:
    baseDirectory: build
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
  env:
    variables:
      NODE_ENV: production
      GENERATE_SOURCEMAP: false
appRoot: frontend
```

### Build Optimization

1. **Dependency Caching**
   - Cache `node_modules/` directory
   - Reduces build time by 50%

2. **Source Map Generation**
   - Disabled in production
   - Reduces bundle size by 30%

3. **Environment Variables**
   - Set `NODE_ENV=production`
   - Enables React optimizations

## Environment-Specific Configurations

### Development Environment

**Amplify Branch:** `develop`

**Build Settings:**
```yaml
env:
  variables:
    REACT_APP_ENVIRONMENT: development
    REACT_APP_LOG_LEVEL: debug
    GENERATE_SOURCEMAP: true
```

**CloudFront:** Not used (direct Amplify URL)

**Cache TTL:** 0 (no caching)

### Staging Environment

**Amplify Branch:** `staging`

**Build Settings:**
```yaml
env:
  variables:
    REACT_APP_ENVIRONMENT: staging
    REACT_APP_LOG_LEVEL: info
    GENERATE_SOURCEMAP: true
```

**CloudFront:** Enabled with 5-minute cache

**Cache TTL:** 300 seconds

### Production Environment

**Amplify Branch:** `main`

**Build Settings:**
```yaml
env:
  variables:
    REACT_APP_ENVIRONMENT: production
    REACT_APP_LOG_LEVEL: warn
    GENERATE_SOURCEMAP: false
```

**CloudFront:** Enabled with 1-year cache for static assets

**Cache TTL:** 31536000 seconds (static), 300 seconds (HTML)

## Performance Optimization

### CloudFront Cache Behaviors

**Static Assets** (`/static/*`)
```
Cache Policy: Managed-CachingOptimized
TTL: 31536000 seconds (1 year)
Compression: Enabled
Methods: GET, HEAD
```

**API Requests** (`/api/*`)
```
Cache Policy: Managed-CachingDisabled
TTL: 0 seconds
Compression: Enabled
Methods: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
```

**HTML Files** (default)
```
Cache Policy: Managed-CachingOptimized
TTL: 300 seconds (5 minutes)
Compression: Enabled
Methods: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
```

### Performance Metrics

Monitor these metrics in CloudWatch:

```bash
# Cache hit rate
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name CacheHitRate \
  --dimensions Name=DistributionId,Value=$DISTRIBUTION_ID \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 300 \
  --statistics Average

# Origin latency
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name OriginLatency \
  --dimensions Name=DistributionId,Value=$DISTRIBUTION_ID \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 300 \
  --statistics Average,Maximum

# Error rate
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name ErrorRate \
  --dimensions Name=DistributionId,Value=$DISTRIBUTION_ID \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 300 \
  --statistics Average
```

## Security Configuration

### HTTPS/TLS

- **Minimum TLS Version:** 1.2
- **Certificate:** AWS Certificate Manager (ACM)
- **Auto-renewal:** Enabled
- **HSTS:** Enabled (max-age=31536000)

### Security Headers

CloudFront automatically adds:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

### Access Control

```bash
# Block public access to S3 buckets
aws s3api put-public-access-block \
  --bucket jaiib-caiib-frontend-artifacts-staging \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Create CloudFront Origin Access Identity (OAI)
aws cloudfront create-cloud-front-origin-access-identity \
  --cloud-front-origin-access-identity-config \
  CallerReference=jaiib-caiib-oai,Comment="OAI for JAIIB-CAIIB Portal"
```

## Monitoring and Logging

### CloudFront Logs

**Location:** `s3://jaiib-caiib-cloudfront-logs-{env}/cloudfront-logs/`

**Log Format:**
```
date time x-edge-location bytes status-code origin-ip user-agent referer
```

**Analysis:**
```bash
# Count requests by status code
zcat logs/*.gz | awk '{print $9}' | sort | uniq -c

# Find slow requests (>1000ms)
zcat logs/*.gz | awk '$8 > 1000 {print}' | wc -l

# Analyze cache hit/miss
zcat logs/*.gz | awk '{print $10}' | sort | uniq -c
```

### CloudWatch Alarms

```bash
# High error rate alarm
aws cloudwatch put-metric-alarm \
  --alarm-name cloudfront-high-error-rate \
  --alarm-description "Alert when error rate > 1%" \
  --metric-name ErrorRate \
  --namespace AWS/CloudFront \
  --statistic Average \
  --period 300 \
  --threshold 1 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:ap-south-1:123456789012:jaiib-caiib-alerts

# High latency alarm
aws cloudwatch put-metric-alarm \
  --alarm-name cloudfront-high-latency \
  --alarm-description "Alert when latency > 500ms" \
  --metric-name OriginLatency \
  --namespace AWS/CloudFront \
  --statistic Average \
  --period 300 \
  --threshold 500 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:ap-south-1:123456789012:jaiib-caiib-alerts
```

## Troubleshooting

### Common Issues

**Issue:** Build fails in Amplify

**Solution:**
```bash
# Check build logs
aws amplify list-jobs --app-id $AMPLIFY_APP_ID --branch-name main

# Get detailed logs
aws amplify get-job --app-id $AMPLIFY_APP_ID --branch-name main --job-id <job-id>
```

**Issue:** CloudFront returns 403 Forbidden

**Solution:**
```bash
# Verify S3 bucket policy
aws s3api get-bucket-policy --bucket jaiib-caiib-frontend-artifacts-staging

# Check CloudFront origin configuration
aws cloudfront get-distribution-config --id $DISTRIBUTION_ID
```

**Issue:** Slow page load

**Solution:**
```bash
# Check cache hit rate
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name CacheHitRate \
  --dimensions Name=DistributionId,Value=$DISTRIBUTION_ID

# Analyze CloudFront logs
zcat logs/*.gz | awk '{sum+=$8; count++} END {print "Avg latency:", sum/count}'
```

## Cost Optimization

### Recommendations

1. **CloudFront**
   - Use PriceClass_100 (North America, Europe, Asia)
   - Enable compression for text assets
   - Set appropriate cache TTLs

2. **Amplify**
   - Use build cache
   - Optimize dependencies
   - Monitor build minutes

3. **S3**
   - Enable Intelligent-Tiering
   - Set lifecycle policies
   - Use S3 Transfer Acceleration if needed

### Cost Monitoring

```bash
# Get Amplify costs
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --filter file://amplify-filter.json

# Get CloudFront costs
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --filter file://cloudfront-filter.json
```

## Maintenance

### Regular Tasks

- **Daily:** Monitor error rates and latency
- **Weekly:** Review CloudFront logs
- **Monthly:** Optimize cache settings
- **Quarterly:** Update dependencies
- **Annually:** Review and optimize costs

### Backup Procedures

```bash
# Backup distribution configuration
aws cloudfront get-distribution-config --id $DISTRIBUTION_ID > backup-config.json

# Backup S3 artifacts
aws s3 sync s3://jaiib-caiib-frontend-artifacts-staging/ ./backup/
```

## References

- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [S3 Documentation](https://docs.aws.amazon.com/s3/)
- [IAM Documentation](https://docs.aws.amazon.com/iam/)
