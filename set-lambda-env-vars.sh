#!/bin/bash

ACCOUNT_ID="438097524343"
REGION="ap-south-1"

echo "Setting environment variables for Lambda functions..."
echo ""

# Function to set environment variables
set_env_vars() {
    local function_name=$1
    local table_names=$2
    
    echo "Setting env vars for $function_name..."
    
    aws lambda update-function-configuration \
        --function-name "$function_name" \
        --environment "Variables={
            REGION=$REGION,
            USERS_TABLE=jaiib-users,
            SESSIONS_TABLE=jaiib-practice-sessions,
            SCORES_TABLE=jaiib-scores,
            QUESTIONS_TABLE=jaiib-question-bank,
            AUDIT_TABLE=jaiib-audit-logs,
            NOTIFICATIONS_TABLE=jaiib-notifications,
            KMS_KEY_ID=arn:aws:kms:$REGION:$ACCOUNT_ID:alias/jaiib-kms-key,
            BEDROCK_MODEL_ID=anthropic.claude-haiku-4.5-v1:0,
            SES_SENDER_EMAIL=noreply@jaiib-portal.com
        }" \
        --region "$REGION" > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo "  ✓ Environment variables set"
    else
        echo "  ✗ Failed to set environment variables"
    fi
}

# Set env vars for all functions
set_env_vars "jaiib-auth"
set_env_vars "jaiib-practice"
set_env_vars "jaiib-ai-tutor"
set_env_vars "jaiib-question-bank"
set_env_vars "jaiib-audit"
set_env_vars "jaiib-notifications"

echo ""
echo "✓ Environment variables configured!"
echo ""
echo "Next steps:"
echo "1. Verify Lambda functions in AWS Console"
echo "2. Check CloudWatch logs for any errors"
echo "3. Configure API Gateway routes"
echo "4. Test Lambda functions with sample payloads"
