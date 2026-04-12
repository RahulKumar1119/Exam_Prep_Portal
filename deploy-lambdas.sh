#!/bin/bash

# AWS Account ID
ACCOUNT_ID="438097524343"
REGION="ap-south-1"
ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/lambda-execution-role"

echo "Deploying Lambda functions to AWS..."
echo "Account ID: $ACCOUNT_ID"
echo "Region: $REGION"
echo ""

# Function to deploy or update Lambda
deploy_lambda() {
    local function_name=$1
    local zip_file=$2
    local timeout=$3
    local memory=$4
    local handler=$5
    
    echo "Deploying $function_name..."
    
    # Check if zip file exists
    if [ ! -f "$zip_file" ]; then
        echo "  ✗ Error: Zip file not found: $zip_file"
        return 1
    fi
    
    # Get absolute path
    local abs_zip_file=$(cd "$(dirname "$zip_file")" && pwd)/$(basename "$zip_file")
    
    # Check if function exists
    if aws lambda get-function --function-name "$function_name" --region "$REGION" 2>/dev/null; then
        echo "  Function exists, updating code..."
        aws lambda update-function-code \
            --function-name "$function_name" \
            --zip-file "fileb://$abs_zip_file" \
            --region "$REGION" > /dev/null
        
        echo "  Updating configuration..."
        aws lambda update-function-configuration \
            --function-name "$function_name" \
            --timeout "$timeout" \
            --memory-size "$memory" \
            --handler "$handler" \
            --region "$REGION" > /dev/null
    else
        echo "  Creating new function..."
        aws lambda create-function \
            --function-name "$function_name" \
            --runtime python3.8 \
            --role "$ROLE_ARN" \
            --handler "$handler" \
            --zip-file "fileb://$abs_zip_file" \
            --timeout "$timeout" \
            --memory-size "$memory" \
            --region "$REGION" > /dev/null
    fi
    
    echo "  ✓ $function_name deployed successfully"
}

# Deploy all Lambda functions
deploy_lambda "jaiib-auth" "backend/auth/auth_lambda.zip" 30 256 "lambda_function.handler"
deploy_lambda "jaiib-practice" "backend/practice/practice_lambda.zip" 30 256 "lambda_function.handler"
deploy_lambda "jaiib-ai-tutor" "backend/ai_tutor/ai_tutor_lambda.zip" 30 512 "lambda_function.lambda_handler"
deploy_lambda "jaiib-question-bank" "backend/question_bank/question_bank_lambda.zip" 30 256 "lambda_function.handler"
deploy_lambda "jaiib-audit" "backend/audit/audit_lambda.zip" 30 256 "lambda_function.handler"
deploy_lambda "jaiib-notifications" "backend/notifications/notifications_lambda.zip" 30 256 "lambda_function.handler"

echo ""
echo "✓ All Lambda functions deployed successfully!"
echo ""
echo "Next steps:"
echo "1. Verify functions in AWS Lambda console"
echo "2. Check CloudWatch logs for any errors"
echo "3. Configure API Gateway routes to trigger these functions"
echo "4. Set environment variables for each function if needed"
