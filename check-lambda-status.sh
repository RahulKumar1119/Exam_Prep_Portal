#!/bin/bash

REGION="ap-south-1"

echo "Checking Lambda function status..."
echo ""

# Function to check Lambda status
check_lambda() {
    local function_name=$1
    
    echo "Checking: $function_name"
    
    aws lambda get-function \
        --function-name "$function_name" \
        --region "$REGION" \
        --query 'Configuration.[FunctionName,Runtime,State,LastModified]' \
        --output table
    
    echo ""
}

# Check all functions
check_lambda "jaiib-auth"
check_lambda "jaiib-practice"
check_lambda "jaiib-ai-tutor"
check_lambda "jaiib-question-bank"
check_lambda "jaiib-audit"
check_lambda "jaiib-notifications"

echo "✓ Status check complete!"
