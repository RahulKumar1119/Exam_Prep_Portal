#!/bin/bash

ACCOUNT_ID="438097524343"
REGION="ap-south-1"
API_NAME="jaiib-caiib-api"

echo "Connecting Lambda functions to API Gateway: $API_NAME"
echo ""

# Get API ID
API_ID=$(aws apigateway get-rest-apis --region "$REGION" --query "items[?name=='$API_NAME'].id" --output text)

if [ -z "$API_ID" ]; then
    echo "✗ Error: API Gateway '$API_NAME' not found"
    exit 1
fi

echo "API ID: $API_ID"
echo ""

# Get root resource ID
ROOT_ID=$(aws apigateway get-resources --rest-api-id "$API_ID" --region "$REGION" --query "items[?path=='/'].id" --output text)

echo "Root Resource ID: $ROOT_ID"
echo ""

# Function to create resource and method
create_resource_and_method() {
    local resource_path=$1
    local method=$2
    local lambda_function=$3
    
    echo "Setting up: $method $resource_path → $lambda_function"
    
    # Create resource if it doesn't exist
    local parent_id=$ROOT_ID
    local current_path=""
    
    for segment in $(echo "$resource_path" | tr '/' '\n' | grep -v '^$'); do
        current_path="$current_path/$segment"
        
        # Check if resource exists
        local resource_id=$(aws apigateway get-resources --rest-api-id "$API_ID" --region "$REGION" --query "items[?path=='$current_path'].id" --output text)
        
        if [ -z "$resource_id" ]; then
            # Create resource
            resource_id=$(aws apigateway create-resource \
                --rest-api-id "$API_ID" \
                --parent-id "$parent_id" \
                --path-part "$segment" \
                --region "$REGION" \
                --query 'id' \
                --output text)
            echo "  ✓ Created resource: $current_path"
        fi
        
        parent_id=$resource_id
    done
    
    # Create method
    local resource_id=$parent_id
    
    aws apigateway put-method \
        --rest-api-id "$API_ID" \
        --resource-id "$resource_id" \
        --http-method "$method" \
        --authorization-type NONE \
        --region "$REGION" > /dev/null 2>&1
    
    # Create integration
    local lambda_arn="arn:aws:lambda:$REGION:$ACCOUNT_ID:function:$lambda_function"
    
    aws apigateway put-integration \
        --rest-api-id "$API_ID" \
        --resource-id "$resource_id" \
        --http-method "$method" \
        --type AWS_PROXY \
        --integration-http-method POST \
        --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$lambda_arn/invocations" \
        --region "$REGION" > /dev/null 2>&1
    
    # Add Lambda permission
    aws lambda add-permission \
        --function-name "$lambda_function" \
        --statement-id "apigateway-$resource_id-$method" \
        --action lambda:InvokeFunction \
        --principal apigateway.amazonaws.com \
        --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT_ID:$API_ID/*/*" \
        --region "$REGION" > /dev/null 2>&1
    
    echo "  ✓ Method configured: $method $resource_path"
}

# Create all resources and methods
echo "Creating resources and methods..."
echo ""

# Auth endpoints
create_resource_and_method "/auth/register" "POST" "jaiib-auth"
create_resource_and_method "/auth/login" "POST" "jaiib-auth"
create_resource_and_method "/auth/verify-email" "POST" "jaiib-auth"
create_resource_and_method "/auth/reset-password" "POST" "jaiib-auth"

# Practice endpoints
create_resource_and_method "/practice/generate" "POST" "jaiib-practice"
create_resource_and_method "/practice/session" "GET" "jaiib-practice"
create_resource_and_method "/practice/submit" "POST" "jaiib-practice"

# AI endpoints
create_resource_and_method "/ai/explain" "POST" "jaiib-ai-tutor"

# Question Bank endpoints
create_resource_and_method "/questions" "GET" "jaiib-question-bank"
create_resource_and_method "/questions" "POST" "jaiib-question-bank"
create_resource_and_method "/questions/update" "PUT" "jaiib-question-bank"

# Audit endpoints
create_resource_and_method "/audit/logs" "GET" "jaiib-audit"
create_resource_and_method "/audit/logs" "POST" "jaiib-audit"

# Notification endpoints
create_resource_and_method "/notifications" "GET" "jaiib-notifications"
create_resource_and_method "/notifications" "POST" "jaiib-notifications"

echo ""
echo "✓ All resources and methods created!"
echo ""
echo "Deploying API..."

# Deploy API
DEPLOYMENT_ID=$(aws apigateway create-deployment \
    --rest-api-id "$API_ID" \
    --stage-name prod \
    --region "$REGION" \
    --query 'id' \
    --output text)

echo "✓ API deployed: $DEPLOYMENT_ID"
echo ""
echo "API Endpoint: https://$API_ID.execute-api.$REGION.amazonaws.com/prod"
echo ""
echo "Next steps:"
echo "1. Test Lambda functions with sample payloads"
echo "2. Check CloudWatch logs for any errors"
echo "3. Configure CORS if needed"
echo "4. Update frontend API endpoint configuration"
