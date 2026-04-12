#!/bin/bash

ACCOUNT_ID="438097524343"
ROLE_NAME="lambda-execution-role"
REGION="ap-south-1"

echo "Setting up IAM role for Lambda..."
echo ""

# Create trust policy document
cat > /tmp/trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create the role
echo "Creating IAM role: $ROLE_NAME"
aws iam create-role \
    --role-name "$ROLE_NAME" \
    --assume-role-policy-document file:///tmp/trust-policy.json \
    --region "$REGION" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✓ Role created successfully"
else
    echo "✓ Role already exists"
fi

echo ""
echo "Attaching policies to role..."

# Attach basic Lambda execution policy
echo "Attaching AWSLambdaBasicExecutionRole..."
aws iam attach-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" \
    --region "$REGION" 2>/dev/null

# Create and attach DynamoDB policy
echo "Creating DynamoDB access policy..."
cat > /tmp/dynamodb-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:BatchGetItem",
        "dynamodb:BatchWriteItem"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/*"
    }
  ]
}
EOF

aws iam put-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-name "DynamoDBAccess" \
    --policy-document file:///tmp/dynamodb-policy.json \
    --region "$REGION" 2>/dev/null

echo "✓ DynamoDB policy attached"

# Create and attach KMS policy
echo "Creating KMS access policy..."
cat > /tmp/kms-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "kms:Decrypt",
        "kms:Encrypt",
        "kms:GenerateDataKey",
        "kms:DescribeKey"
      ],
      "Resource": "arn:aws:kms:*:*:key/*"
    }
  ]
}
EOF

aws iam put-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-name "KMSAccess" \
    --policy-document file:///tmp/kms-policy.json \
    --region "$REGION" 2>/dev/null

echo "✓ KMS policy attached"

# Create and attach Bedrock policy
echo "Creating Bedrock access policy..."
cat > /tmp/bedrock-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": "arn:aws:bedrock:*:*:foundation-model/*"
    }
  ]
}
EOF

aws iam put-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-name "BedrockAccess" \
    --policy-document file:///tmp/bedrock-policy.json \
    --region "$REGION" 2>/dev/null

echo "✓ Bedrock policy attached"

# Create and attach SES policy
echo "Creating SES access policy..."
cat > /tmp/ses-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    }
  ]
}
EOF

aws iam put-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-name "SESAccess" \
    --policy-document file:///tmp/ses-policy.json \
    --region "$REGION" 2>/dev/null

echo "✓ SES policy attached"

# Cleanup
rm -f /tmp/trust-policy.json /tmp/dynamodb-policy.json /tmp/kms-policy.json /tmp/bedrock-policy.json /tmp/ses-policy.json

echo ""
echo "✓ IAM role setup complete!"
echo ""
echo "Role ARN: arn:aws:iam::$ACCOUNT_ID:role/$ROLE_NAME"
echo ""
echo "Next: Run 'bash deploy-lambdas.sh' to deploy Lambda functions"
