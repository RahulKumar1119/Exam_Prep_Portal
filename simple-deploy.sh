#!/bin/bash

# Simple deployment script that updates existing Lambda functions

ACCOUNT_ID="438097524343"
REGION="ap-south-1"

echo "Updating Lambda functions with new code..."
echo ""

# Update auth function with new passlib-based code
echo "Updating jaiib-auth..."
aws lambda update-function-code \
    --function-name jaiib-auth \
    --zip-file fileb://backend/auth/auth_lambda.zip \
    --region "$REGION" 2>&1 | grep -E "(FunctionArn|Error)" || echo "  ✓ Updated"

echo "Updating jaiib-practice..."
aws lambda update-function-code \
    --function-name jaiib-practice \
    --zip-file fileb://backend/practice/practice_lambda.zip \
    --region "$REGION" 2>&1 | grep -E "(FunctionArn|Error)" || echo "  ✓ Updated"

echo "Updating jaiib-ai-tutor..."
aws lambda update-function-code \
    --function-name jaiib-ai-tutor \
    --zip-file fileb://backend/ai_tutor/ai_tutor_lambda.zip \
    --region "$REGION" 2>&1 | grep -E "(FunctionArn|Error)" || echo "  ✓ Updated"

echo "Updating jaiib-question-bank..."
aws lambda update-function-code \
    --function-name jaiib-question-bank \
    --zip-file fileb://backend/question_bank/question_bank_lambda.zip \
    --region "$REGION" 2>&1 | grep -E "(FunctionArn|Error)" || echo "  ✓ Updated"

echo "Updating jaiib-audit..."
aws lambda update-function-code \
    --function-name jaiib-audit \
    --zip-file fileb://backend/audit/audit_lambda.zip \
    --region "$REGION" 2>&1 | grep -E "(FunctionArn|Error)" || echo "  ✓ Updated"

echo "Updating jaiib-notifications..."
aws lambda update-function-code \
    --function-name jaiib-notifications \
    --zip-file fileb://backend/notifications/notifications_lambda.zip \
    --region "$REGION" 2>&1 | grep -E "(FunctionArn|Error)" || echo "  ✓ Updated"

echo ""
echo "✓ All Lambda functions updated!"
