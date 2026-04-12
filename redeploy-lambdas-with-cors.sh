#!/bin/bash

# Redeploy all Lambda functions with CORS support

REGION="ap-south-1"
ACCOUNT_ID="438097524343"

echo "=== Redeploying Lambda Functions with CORS Support ==="
echo "Region: $REGION"
echo ""

# Function to package and deploy a Lambda
deploy_lambda() {
    local FUNCTION_NAME=$1
    local SOURCE_DIR=$2
    local HANDLER=$3
    
    echo "Deploying $FUNCTION_NAME..."
    
    # Create temp directory
    TEMP_DIR=$(mktemp -d)
    
    # Copy source files
    cp -r "$SOURCE_DIR"/* "$TEMP_DIR/"
    
    # Install dependencies
    if [ -f "$SOURCE_DIR/requirements.txt" ]; then
        pip install -r "$SOURCE_DIR/requirements.txt" -t "$TEMP_DIR/" --quiet
    fi
    
    # Create zip file
    cd "$TEMP_DIR"
    zip -r /tmp/"$FUNCTION_NAME".zip . > /dev/null 2>&1
    cd - > /dev/null
    
    # Update Lambda function
    aws lambda update-function-code \
        --function-name "$FUNCTION_NAME" \
        --zip-file fileb:///tmp/"$FUNCTION_NAME".zip \
        --region "$REGION" > /dev/null 2>&1
    
    # Wait for update
    sleep 2
    
    # Check status
    STATUS=$(aws lambda get-function --function-name "$FUNCTION_NAME" --region "$REGION" --query "Configuration.LastUpdateStatus" --output text)
    
    if [ "$STATUS" = "Successful" ]; then
        echo "  ✓ $FUNCTION_NAME deployed successfully"
    else
        echo "  ✗ $FUNCTION_NAME deployment status: $STATUS"
    fi
    
    # Cleanup
    rm -rf "$TEMP_DIR"
    rm -f /tmp/"$FUNCTION_NAME".zip
}

# Deploy all Lambda functions
deploy_lambda "jaiib-auth" "backend/auth" "lambda_function.handler"
deploy_lambda "jaiib-practice" "backend/practice" "lambda_function.handler"
deploy_lambda "jaiib-ai-tutor" "backend/ai_tutor" "lambda_function.lambda_handler"
deploy_lambda "jaiib-question-bank" "backend/question_bank" "lambda_function.handler"
deploy_lambda "jaiib-audit" "backend/audit" "lambda_function.handler"
deploy_lambda "jaiib-notifications" "backend/notifications" "lambda_function.handler"

echo ""
echo "=== All Lambda Functions Redeployed ==="
echo ""

# Verify deployment
echo "Verifying deployments..."
for FUNC in jaiib-auth jaiib-practice jaiib-ai-tutor jaiib-question-bank jaiib-audit jaiib-notifications; do
    STATUS=$(aws lambda get-function --function-name "$FUNC" --region "$REGION" --query "Configuration.LastUpdateStatus" --output text)
    echo "  $FUNC: $STATUS"
done

echo ""
echo "Testing OPTIONS request..."
sleep 3

RESPONSE=$(curl -s -w "\n%{http_code}" -X OPTIONS \
    https://gf3qqozf2l.execute-api.$REGION.amazonaws.com/prod/auth/register)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ OPTIONS request successful (HTTP 200)"
    echo "✓ CORS is now working!"
else
    echo "✗ OPTIONS request returned HTTP $HTTP_CODE"
fi

echo ""
echo "=== Redeployment Complete ==="
