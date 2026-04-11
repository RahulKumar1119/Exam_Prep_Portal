# AWS Infrastructure Deployment Guide

## Overview

This document describes how to deploy the JAIIB-CAIIB Exam Prep Portal AWS infrastructure using AWS CDK.

## Prerequisites

1. AWS Account with appropriate permissions
2. AWS CLI configured with credentials
3. Python 3.9+
4. Node.js 14+ (for CDK)
5. AWS CDK CLI installed: `npm install -g aws-cdk`

## Setup Instructions

### 1. Install Dependencies

```bash
cd infrastructure
pip install -r requirements.txt
npm install
```

### 2. Configure AWS Credentials

```bash
aws configure
# Enter your AWS Access Key ID, Secret Access Key, default region (ap-south-1), and output format
```

### 3. Bootstrap CDK (First Time Only)

```bash
cdk bootstrap aws://ACCOUNT_ID/ap-south-1
```

Replace `ACCOUNT_ID` with your AWS account ID.

### 4. Update Configuration

Edit `cdk_stack/app.py` and update:
- AWS Account ID (replace `123456789012`)
- AWS Region (currently set to `ap-south-1` for India)

## Deployment

### Synthesize CloudFormation Template

```bash
cdk synth
```

This generates the CloudFormation template in `cdk.out/` directory.

### Deploy Stack

```bash
cdk deploy
```

This will:
1. Display the resources to be created
2. Ask for confirmation
3. Deploy all resources to AWS

### Deploy with Auto-Approval

```bash
cdk deploy --require-approval=never
```

## Outputs

After successful deployment, the stack outputs will display:

- **KmsKeyArn**: ARN of the KMS key for data encryption
- **LambdaRoleArn**: ARN of the Lambda execution role
- **ApiEndpoint**: API Gateway endpoint URL
- **UsersTableName**: DynamoDB Users table name
- **PracticeSessionsTableName**: DynamoDB Practice Sessions table name
- **ScoresTableName**: DynamoDB Scores table name
- **QuestionBankTableName**: DynamoDB Question Bank table name
- **AuditLogsTableName**: DynamoDB Audit Logs table name
- **NotificationsTableName**: DynamoDB Notifications table name
- **LogGroupName**: CloudWatch Log Group name

## Resource Details

### DynamoDB Tables

All tables are created with:
- KMS encryption using customer-managed key
- Point-in-time recovery enabled
- On-demand billing mode
- Global secondary indexes for efficient queries

**Tables Created:**
1. `jaiib-users` - User accounts and profiles
2. `jaiib-practice-sessions` - Active practice sessions
3. `jaiib-scores` - User scores and results
4. `jaiib-question-bank` - MCQ repository with versioning
5. `jaiib-audit-logs` - Audit trail for compliance
6. `jaiib-notifications` - User notifications

### KMS Key

- Customer-managed key with automatic rotation enabled
- Alias: `alias/jaiib-caiib-key`
- Used for encrypting all sensitive data at rest

### Lambda Execution Role

Permissions granted:
- DynamoDB read/write operations
- KMS encryption/decryption
- CloudWatch Logs
- SES email sending

### API Gateway

- Regional endpoint
- CORS enabled for all origins
- Request validation enabled
- Resources: `/auth`, `/practice`, `/dashboard`

### CloudWatch

- Log Group: `/aws/lambda/jaiib-caiib` with 1-year retention
- Metrics: API response time, Lambda duration, error rate
- Alarms: Response time, error rate, DynamoDB throttling

## Cleanup

To delete all resources:

```bash
cdk destroy
```

This will remove all AWS resources created by the stack.

## Troubleshooting

### CDK Bootstrap Error

If you get a bootstrap error, ensure you have the correct AWS account ID and region:

```bash
cdk bootstrap aws://YOUR_ACCOUNT_ID/ap-south-1
```

### Permission Denied

Ensure your AWS credentials have permissions for:
- DynamoDB
- Lambda
- API Gateway
- KMS
- CloudWatch
- IAM

### Stack Already Exists

If the stack already exists, use `cdk deploy` to update it.

## Next Steps

1. Deploy Lambda functions for authentication, practice engine, and scoring
2. Configure API Gateway integrations with Lambda functions
3. Set up frontend deployment with AWS Amplify
4. Configure monitoring and alerting
5. Run integration tests

## Support

For issues or questions, refer to:
- AWS CDK Documentation: https://docs.aws.amazon.com/cdk/
- AWS DynamoDB Documentation: https://docs.aws.amazon.com/dynamodb/
- AWS Lambda Documentation: https://docs.aws.amazon.com/lambda/
