# Lambda Execution Role Policy

## Overview

The Lambda execution role provides permissions for Lambda functions to access AWS services required by the JAIIB-CAIIB Portal.

## Permissions Granted

### 1. CloudWatch Logs (AWS Managed Policy)

**Policy**: `service-role/AWSLambdaBasicExecutionRole`

Allows:
- `logs:CreateLogGroup`
- `logs:CreateLogStream`
- `logs:PutLogEvents`

### 2. DynamoDB Operations

**Actions**:
- `dynamodb:GetItem` - Retrieve single item
- `dynamodb:PutItem` - Create new item
- `dynamodb:UpdateItem` - Update existing item
- `dynamodb:DeleteItem` - Delete item
- `dynamodb:Query` - Query items with partition key
- `dynamodb:Scan` - Scan table
- `dynamodb:BatchGetItem` - Batch retrieve items
- `dynamodb:BatchWriteItem` - Batch write items

**Resources**: All tables matching `arn:aws:dynamodb:*:*:table/jaiib-*`

### 3. KMS Encryption

**Actions**:
- `kms:Decrypt` - Decrypt data
- `kms:GenerateDataKey` - Generate data encryption key
- `kms:DescribeKey` - Get key metadata

**Resources**: Customer-managed KMS key ARN

### 4. SES Email Sending

**Actions**:
- `ses:SendEmail` - Send email
- `ses:SendRawEmail` - Send raw email

**Resources**: All (`*`)

## Usage

The role is automatically attached to all Lambda functions created for:
- Authentication service
- Practice set generation
- Scoring engine
- AI tutor service
- Analytics service
- Notification service

## Security Considerations

1. **Least Privilege**: Permissions are scoped to specific actions and resources
2. **KMS Encryption**: All DynamoDB operations use KMS encryption
3. **Table Naming**: Only tables with `jaiib-` prefix can be accessed
4. **No Admin Access**: No wildcard permissions for sensitive operations

## Updating Permissions

To add new permissions:

1. Edit `cdk_stack/jaiib_stack.py`
2. Add new `PolicyStatement` to the role
3. Redeploy: `cdk deploy`

Example:

```python
lambda_role.add_to_policy(
    iam.PolicyStatement(
        effect=iam.Effect.ALLOW,
        actions=["s3:GetObject"],
        resources=["arn:aws:s3:::jaiib-*/*"],
    )
)
```

## Verification

To verify the role has correct permissions:

```bash
aws iam get-role-policy --role-name JaiibCaiibStack-LambdaExecutionRole --policy-name inline-policy
```

## Related Resources

- [AWS Lambda Execution Role](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html)
- [DynamoDB IAM Permissions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/access-control-overview.html)
- [KMS Key Policies](https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html)
