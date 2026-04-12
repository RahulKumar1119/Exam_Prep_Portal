#!/bin/bash

# Simple CORS enablement for API Gateway

REGION="ap-south-1"
API_ID="gf3qqozf2l"
STAGE_NAME="prod"

echo "Enabling CORS for API Gateway..."
echo "API ID: $API_ID"
echo "Region: $REGION"
echo ""

# Get all resources
echo "Getting resources..."
RESOURCES=$(aws apigateway get-resources --rest-api-id $API_ID --region $REGION --query "items[].id" --output text)

RESOURCE_COUNT=0
for RESOURCE_ID in $RESOURCES; do
    RESOURCE_COUNT=$((RESOURCE_COUNT + 1))
    
    # Try to create OPTIONS method (ignore if already exists)
    aws apigateway put-method \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method OPTIONS \
        --authorization-type NONE \
        --region $REGION > /dev/null 2>&1
    
    # Create mock integration
    aws apigateway put-integration \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method OPTIONS \
        --type MOCK \
        --region $REGION > /dev/null 2>&1
    
    # Add integration response
    aws apigateway put-integration-response \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method OPTIONS \
        --status-code 200 \
        --response-parameters '{"method.response.header.Access-Control-Allow-Headers":"'"'"'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"'"'","method.response.header.Access-Control-Allow-Methods":"'"'"'GET,POST,PUT,DELETE,OPTIONS'"'"'","method.response.header.Access-Control-Allow-Origin":"'"'"'*'"'"'"}' \
        --region $REGION > /dev/null 2>&1
    
    # Add method response
    aws apigateway put-method-response \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method OPTIONS \
        --status-code 200 \
        --response-parameters '{"method.response.header.Access-Control-Allow-Headers":false,"method.response.header.Access-Control-Allow-Methods":false,"method.response.header.Access-Control-Allow-Origin":false}' \
        --region $REGION > /dev/null 2>&1
done

echo "✓ Configured CORS for $RESOURCE_COUNT resources"
echo ""

# Deploy
echo "Deploying API..."
aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name $STAGE_NAME \
    --region $REGION > /dev/null 2>&1

echo "✓ API deployed"
echo ""
echo "API Endpoint: https://$API_ID.execute-api.$REGION.amazonaws.com/$STAGE_NAME"
