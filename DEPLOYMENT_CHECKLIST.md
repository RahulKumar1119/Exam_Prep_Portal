# AWS Deployment Checklist - JAIIB-CAIIB Exam Prep Portal

## Pre-Deployment Setup

### AWS Account & Credentials
- [ ] AWS Account created and verified
- [ ] AWS CLI installed and configured
- [ ] IAM user with appropriate permissions created
- [ ] AWS credentials configured locally: `aws configure`
- [ ] AWS CDK installed: `npm install -g aws-cdk`

### Local Environment
- [ ] Node.js 16+ installed
- [ ] Python 3.8+ installed
- [ ] Git configured
- [ ] Repository cloned locally

## Backend Deployment

### Infrastructure Setup (CDK)

1. **Prepare CDK Stack**
   - [ ] Review `infrastructure/cdk_stack/jaiib_stack.py`
   - [ ] Update region if needed (default: us-east-1)
   - [ ] Verify DynamoDB table names
   - [ ] Check Lambda function names

2. **Deploy Infrastructure**
   ```bash
   cd infrastructure
   npm install
   cdk bootstrap  # First time only
   cdk deploy
   ```
   - [ ] CDK deployment successful
   - [ ] Note API Gateway URL from outputs
   - [ ] Note CloudFront distribution URL
   - [ ] Note S3 bucket name

3. **Verify Infrastructure**
   - [ ] DynamoDB tables created (check AWS Console)
   - [ ] Lambda functions created
   - [ ] API Gateway endpoints accessible
   - [ ] CloudWatch logs configured
   - [ ] KMS key created

### Lambda Functions Deployment

1. **Auth Lambda**
   - [ ] `backend/auth/lambda_function.py` ready
   - [ ] Dependencies installed
   - [ ] Environment variables set:
     - [ ] JWT_SECRET
     - [ ] JWT_EXPIRY
     - [ ] DYNAMODB_REGION
   - [ ] IAM role has DynamoDB permissions
   - [ ] Function deployed and tested

2. **Practice Lambda**
   - [ ] `backend/practice/lambda_function.py` ready
   - [ ] `backend/practice/session_manager.py` included
   - [ ] `backend/practice/timer_service.py` included
   - [ ] `backend/practice/scoring_service.py` included
   - [ ] Dependencies installed
   - [ ] Environment variables set
   - [ ] IAM role has DynamoDB permissions
   - [ ] Function deployed and tested

### API Gateway Configuration

1. **CORS Setup**
   - [ ] CORS enabled on all endpoints
   - [ ] Frontend domain added to allowed origins
   - [ ] Staging domain added (if applicable)
   - [ ] localhost:3000 added for development

2. **API Keys & Throttling**
   - [ ] API key created (optional)
   - [ ] Rate limiting configured (100 req/min per user)
   - [ ] Throttling settings applied

3. **Logging & Monitoring**
   - [ ] CloudWatch logging enabled
   - [ ] X-Ray tracing enabled (optional)
   - [ ] Alarms configured for errors

## Frontend Deployment

### Environment Configuration

1. **Production Environment**
   - [ ] `frontend/.env.production` created
   - [ ] REACT_APP_API_URL set to API Gateway URL
   - [ ] REACT_APP_ENVIRONMENT set to "production"

2. **Staging Environment**
   - [ ] `frontend/.env.staging` created
   - [ ] REACT_APP_API_URL set to staging API Gateway URL
   - [ ] REACT_APP_ENVIRONMENT set to "staging"

3. **Development Environment**
   - [ ] `frontend/.env.development` configured
   - [ ] REACT_APP_API_URL set to local backend (if running locally)

### Build & Test

1. **Local Build**
   ```bash
   cd frontend
   npm install
   npm run build
   ```
   - [ ] Build successful
   - [ ] No TypeScript errors
   - [ ] No console warnings
   - [ ] Build size acceptable (<500KB gzipped)

2. **Local Testing**
   ```bash
   npm start
   ```
   - [ ] Frontend loads without errors
   - [ ] Navigation works
   - [ ] API calls work (if backend running)
   - [ ] Responsive design verified

### AWS Amplify Deployment

1. **Connect Repository**
   - [ ] Repository pushed to GitHub/GitLab/Bitbucket
   - [ ] Repository is public or Amplify has access
   - [ ] Branch selected (main/master)

2. **Amplify Console Setup**
   - [ ] Go to AWS Amplify Console
   - [ ] Click "New app" → "Host web app"
   - [ ] Select repository and branch
   - [ ] Configure build settings:
     - [ ] Build command: `npm run build`
     - [ ] Start command: `npm start`
     - [ ] Base directory: `frontend`

3. **Environment Variables**
   - [ ] Add REACT_APP_API_URL
   - [ ] Add REACT_APP_ENVIRONMENT
   - [ ] Verify variables are set correctly

4. **Deploy**
   - [ ] Click "Deploy"
   - [ ] Wait for build to complete
   - [ ] Verify deployment successful
   - [ ] Note Amplify URL

### Custom Domain (Optional)

1. **Domain Configuration**
   - [ ] Domain registered (Route 53 or external)
   - [ ] DNS records configured
   - [ ] SSL certificate created (ACM)
   - [ ] Custom domain added to Amplify

2. **Verification**
   - [ ] Domain resolves to Amplify URL
   - [ ] HTTPS working
   - [ ] Certificate valid

## Database Setup

### DynamoDB Tables

1. **Users Table**
   - [ ] Table created with correct schema
   - [ ] Primary key: user_id
   - [ ] GSI on email created
   - [ ] TTL configured for reset tokens

2. **Practice Sessions Table**
   - [ ] Table created with correct schema
   - [ ] Primary key: session_id
   - [ ] GSI on user_id created
   - [ ] TTL configured for expired sessions

3. **Scores Table**
   - [ ] Table created with correct schema
   - [ ] Primary key: user_id, submitted_at
   - [ ] Indexes configured

4. **Question Bank Table**
   - [ ] Table created with correct schema
   - [ ] Primary key: question_id, version
   - [ ] Sample questions loaded

5. **Audit Logs Table**
   - [ ] Table created with correct schema
   - [ ] Encryption enabled
   - [ ] TTL configured for old logs

### Data Initialization

- [ ] Sample questions loaded into Question Bank
- [ ] Test user created for verification
- [ ] DynamoDB backups configured

## Security Configuration

### Encryption

- [ ] KMS key created for DynamoDB encryption
- [ ] KMS key created for S3 encryption
- [ ] TLS 1.2+ enforced on API Gateway
- [ ] Passwords hashed with bcrypt (12 rounds)

### IAM Roles & Policies

- [ ] Lambda execution role created
- [ ] DynamoDB permissions granted
- [ ] KMS permissions granted
- [ ] CloudWatch permissions granted
- [ ] S3 permissions granted (if needed)

### Secrets Management

- [ ] JWT secret stored in AWS Secrets Manager
- [ ] Database credentials secured
- [ ] API keys secured
- [ ] No secrets in code or environment files

## Testing & Verification

### API Testing

1. **Registration Endpoint**
   ```bash
   curl -X POST https://your-api-url/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "TestPassword123!",
       "full_name": "Test User",
       "bank_affiliation": "Test Bank"
     }'
   ```
   - [ ] Returns 200 with success message
   - [ ] User created in DynamoDB
   - [ ] Verification email sent

2. **Login Endpoint**
   ```bash
   curl -X POST https://your-api-url/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "TestPassword123!"
     }'
   ```
   - [ ] Returns 200 with access token
   - [ ] Token is valid JWT
   - [ ] Refresh token provided

3. **Practice Endpoints**
   - [ ] Generate practice set works
   - [ ] Submit answers works
   - [ ] Get results works
   - [ ] Timer endpoints work

### Frontend Testing

1. **User Registration**
   - [ ] Navigate to /register
   - [ ] Fill form with valid data
   - [ ] Submit registration
   - [ ] Success message displayed
   - [ ] Redirected to login

2. **User Login**
   - [ ] Navigate to /login
   - [ ] Enter credentials
   - [ ] Submit login
   - [ ] Redirected to dashboard
   - [ ] User info displayed

3. **Practice Flow**
   - [ ] Select paper
   - [ ] Generate practice set
   - [ ] Answer questions
   - [ ] Submit answers
   - [ ] View results
   - [ ] Score displayed correctly

4. **Responsive Design**
   - [ ] Desktop (1920px+): Full layout
   - [ ] Tablet (768-1919px): Responsive layout
   - [ ] Mobile (<768px): Mobile layout
   - [ ] All buttons clickable
   - [ ] Forms usable

### Performance Testing

1. **Load Testing**
   - [ ] API responds within 200ms (p95)
   - [ ] Frontend loads within 3s (3G)
   - [ ] Dashboard loads within 1s
   - [ ] No timeout errors

2. **Stress Testing**
   - [ ] System handles 100+ concurrent users
   - [ ] No database throttling
   - [ ] No Lambda timeouts
   - [ ] Error rates < 1%

## Monitoring & Alerting

### CloudWatch Setup

- [ ] CloudWatch logs configured
- [ ] Log groups created for each Lambda
- [ ] Log retention set (30 days recommended)
- [ ] Alarms created for:
  - [ ] Lambda errors
  - [ ] API Gateway 5xx errors
  - [ ] DynamoDB throttling
  - [ ] High latency (>500ms)

### Dashboards

- [ ] CloudWatch dashboard created
- [ ] Key metrics displayed:
  - [ ] API request count
  - [ ] API latency
  - [ ] Lambda invocations
  - [ ] Error rates
  - [ ] DynamoDB capacity

## Post-Deployment

### Documentation

- [ ] Deployment guide updated
- [ ] API documentation updated
- [ ] Runbooks created for common issues
- [ ] Architecture diagram updated

### Backup & Recovery

- [ ] DynamoDB backups configured
- [ ] S3 versioning enabled
- [ ] Disaster recovery plan documented
- [ ] Rollback procedure tested

### Monitoring

- [ ] CloudWatch alarms active
- [ ] Email notifications configured
- [ ] Slack integration (optional)
- [ ] Daily health checks scheduled

### Optimization

- [ ] Lambda provisioned concurrency configured
- [ ] DynamoDB auto-scaling enabled
- [ ] API Gateway caching enabled
- [ ] CloudFront cache optimized

## Rollback Plan

If deployment fails:

1. **Immediate Actions**
   - [ ] Stop new deployments
   - [ ] Notify team
   - [ ] Check CloudWatch logs for errors

2. **Rollback Steps**
   - [ ] Revert Lambda functions to previous version
   - [ ] Revert frontend to previous Amplify deployment
   - [ ] Verify services are operational
   - [ ] Test critical flows

3. **Post-Rollback**
   - [ ] Investigate root cause
   - [ ] Fix issues
   - [ ] Test thoroughly
   - [ ] Re-deploy

## Sign-Off

- [ ] All checklist items completed
- [ ] All tests passed
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Team approval obtained
- [ ] Deployment date: ___________
- [ ] Deployed by: ___________
- [ ] Verified by: ___________

---

**Notes:**
- Keep this checklist updated after each deployment
- Document any issues encountered
- Update procedures based on lessons learned
- Review quarterly for improvements
