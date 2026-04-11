# JAIIB-CAIIB Portal AWS Infrastructure

## Overview

This directory contains the AWS CDK infrastructure-as-code for the JAIIB-CAIIB Exam Prep Portal. It defines all AWS resources including DynamoDB tables, Lambda execution roles, API Gateway, KMS encryption, and CloudWatch monitoring.

## Directory Structure

```
infrastructure/
├── cdk_stack/
│   ├── __init__.py
│   ├── app.py                 # CDK app entry point
│   └── jaiib_stack.py         # Main CDK stack definition
├── cdk.json                   # CDK configuration
├── requirements.txt           # Python dependencies
├── package.json              # Node.js dependencies
├── deploy.sh                 # Deployment script
├── README.md                 # This file
├── DEPLOYMENT.md             # Deployment guide
├── DYNAMODB_SCHEMAS.md       # DynamoDB table schemas
├── LAMBDA_ROLE_POLICY.md     # Lambda role permissions
├── API_GATEWAY_CONFIG.md     # API Gateway configuration
└── KMS_CLOUDWATCH_CONFIG.md  # KMS and CloudWatch setup
```

## Quick Start

### Prerequisites

- AWS Account with appropriate permissions
- AWS CLI configured
- Python 3.9+
- Node.js 14+
- AWS CDK CLI: `npm install -g aws-cdk`

### Installation

```bash
cd infrastructure
pip install -r requirements.txt
npm install
```

### Deployment

```bash
# First time setup (bootstrap)
cdk bootstrap aws://ACCOUNT_ID/ap-south-1

# Deploy infrastructure
cdk deploy
```

## AWS Resources Created

### 1. DynamoDB Tables (6 tables)

- **jaiib-users** - User accounts and profiles
- **jaiib-practice-sessions** - Active practice sessions
- **jaiib-scores** - User scores and results
- **jaiib-question-bank** - MCQ repository with versioning
- **jaiib-audit-logs** - Audit trail for compliance
- **jaiib-notifications** - User notifications

All tables include:
- KMS encryption with customer-managed key
- Point-in-time recovery
- Global secondary indexes for efficient queries
- On-demand billing mode

### 2. KMS Key

- **Alias**: `alias/jaiib-caiib-key`
- **Rotation**: Automatic quarterly rotation
- **Encryption**: All sensitive data at rest

### 3. Lambda Execution Role

Permissions for:
- DynamoDB read/write operations
- KMS encryption/decryption
- CloudWatch Logs
- SES email sending

### 4. API Gateway

- **Endpoint Type**: Regional
- **CORS**: Enabled for all origins
- **Rate Limiting**: 100 req/min per user
- **Request Validation**: Enabled
- **Resources**: `/auth`, `/practice`, `/dashboard`

### 5. CloudWatch

- **Log Group**: `/aws/lambda/jaiib-caiib` (1-year retention)
- **Metrics**: API response time, Lambda duration, error rate
- **Alarms**: Response time, error rate, DynamoDB throttling

## Configuration

### Update AWS Account and Region

Edit `cdk_stack/app.py`:

```python
JaiibCaiibStack(app, "JaiibCaiibStack", env=cdk.Environment(
    account="YOUR_ACCOUNT_ID",
    region="ap-south-1"  # Change region if needed
))
```

### Customize Stack

Edit `cdk_stack/jaiib_stack.py` to:
- Change table names
- Modify KMS key settings
- Update API Gateway configuration
- Adjust CloudWatch alarms

## Deployment Commands

### Synthesize Template

```bash
cdk synth
```

Generates CloudFormation template in `cdk.out/` directory.

### Deploy Stack

```bash
cdk deploy
```

Deploys all resources to AWS.

### Deploy with Auto-Approval

```bash
cdk deploy --require-approval=never
```

### View Differences

```bash
cdk diff
```

Shows what will change before deployment.

### Destroy Stack

```bash
cdk destroy
```

Deletes all AWS resources (with confirmation).

## Outputs

After deployment, the stack outputs display:

```
KmsKeyArn: arn:aws:kms:ap-south-1:123456789012:key/12345678-1234-1234-1234-123456789012
LambdaRoleArn: arn:aws:iam::123456789012:role/JaiibCaiibStack-LambdaExecutionRole
ApiEndpoint: https://abc123def456.execute-api.ap-south-1.amazonaws.com/prod
UsersTableName: jaiib-users
PracticeSessionsTableName: jaiib-practice-sessions
ScoresTableName: jaiib-scores
QuestionBankTableName: jaiib-question-bank
AuditLogsTableName: jaiib-audit-logs
NotificationsTableName: jaiib-notifications
LogGroupName: /aws/lambda/jaiib-caiib
```

## Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Detailed deployment guide
- **[DYNAMODB_SCHEMAS.md](DYNAMODB_SCHEMAS.md)** - DynamoDB table schemas
- **[LAMBDA_ROLE_POLICY.md](LAMBDA_ROLE_POLICY.md)** - Lambda role permissions
- **[API_GATEWAY_CONFIG.md](API_GATEWAY_CONFIG.md)** - API Gateway configuration
- **[KMS_CLOUDWATCH_CONFIG.md](KMS_CLOUDWATCH_CONFIG.md)** - KMS and CloudWatch setup

## Monitoring

### CloudWatch Dashboard

View real-time metrics:

```bash
aws cloudwatch get-dashboard --dashboard-name JaiibCaiibDashboard
```

### CloudWatch Logs

View Lambda logs:

```bash
aws logs tail /aws/lambda/jaiib-caiib --follow
```

### CloudWatch Alarms

List active alarms:

```bash
aws cloudwatch describe-alarms --alarm-names ApiResponseTimeAlarm
```

## Cost Optimization

### DynamoDB

- **Billing Mode**: On-demand (pay per request)
- **No provisioned capacity**: Automatic scaling
- **Cost**: ~$1.25 per million read units, ~$6.25 per million write units

### Lambda

- **Free Tier**: 1 million requests/month
- **Pricing**: $0.20 per 1 million requests
- **Duration**: $0.0000166667 per GB-second

### KMS

- **Key Storage**: $1/month per key
- **API Calls**: $0.03 per 10,000 requests

### CloudWatch

- **Logs**: $0.50 per GB ingested
- **Metrics**: $0.30 per custom metric
- **Alarms**: $0.10 per alarm

## Troubleshooting

### CDK Bootstrap Error

```bash
cdk bootstrap aws://YOUR_ACCOUNT_ID/ap-south-1
```

### Permission Denied

Ensure AWS credentials have permissions for:
- DynamoDB, Lambda, API Gateway, KMS, CloudWatch, IAM

### Stack Already Exists

Use `cdk deploy` to update existing stack.

### Resource Limit Exceeded

Check AWS service quotas and request increases if needed.

## Next Steps

1. Deploy Lambda functions for authentication, practice engine, and scoring
2. Configure API Gateway integrations with Lambda functions
3. Set up frontend deployment with AWS Amplify
4. Configure monitoring and alerting
5. Run integration tests

## Support

For issues or questions:
- Check [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- Review [AWS DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- Consult [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)

## License

This infrastructure code is part of the JAIIB-CAIIB Exam Prep Portal project.
