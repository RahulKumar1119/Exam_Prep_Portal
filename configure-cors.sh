#!/bin/bash

# Configure CORS for API Gateway

REGION="ap-south-1"
API_NAME="jaiib-caiib-api"

echo "Configuring CORS for API Gateway..."
echo ""

# Get API Gateway ID
API_ID=$(aws apigateway get-rest-apis --region $REGION --query "items[?name=='$API_NAME'].id" --output text)
if [ -z "$API_ID" ]; then
    echo "✗ Error: API Gateway '$API_NAME' not found"
    exit 1
fi

echo "API Gateway ID: $API_ID"
echo ""

# Get all resources
echo "Configuring CORS for all resources..."
RESOURCES=$(aws apigateway get-resources --rest-api-id $API_ID --region $REGION --query "items[].id" --output text)

for RESOURCE_ID in $RESOURCES; do
    # Get resource path
    RESOURCE_PATH=$(aws apigateway get-resource --rest-api-id $API_ID --resource-id $RESOURCE_ID --region $REGION --query "path" --output text)
    
    echo "  Configuring: $RESOURCE_PATH"
    
    # Create OPTIONS method
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
    
    # Add integration response with CORS headers
    aws apigateway put-integration-response \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method OPTIONS \
        --status-code 200 \
        --response-parameters '{
            "method.response.header.Access-Control-Allow-Headers":"'"'"'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"'"'",
            "method.response.header.Access-Control-Allow-Methods":"'"'"'GET,POST,PUT,DELETE,OPTIONS'"'"'",
            "method.response.header.Access-Control-Allow-Origin":"'"'"'*'"'"'"
        }' \
        --region $REGION > /dev/null 2>&1
    
    # Add method response
    aws apigateway put-method-response \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method OPTIONS \
        --status-code 200 \
        --response-parameters '{
            "method.response.header.Access-Control-Allow-Headers":false,
            "method.response.header.Access-Control-Allow-Methods":false,
            "method.response.header.Access-Control-Allow-Origin":false
        }' \
        --region $REGION > /dev/null 2>&1
done

echo ""
echo "✓ CORS configured for all resources"
echo ""

# Deploy API
echo "Deploying API..."
STAGE_NAME="prod"

# Check if deployment exists
DEPLOYMENT_ID=$(aws apigateway get-deployments --rest-api-id $API_ID --region $REGION --query "items[0].id" --output text 2>/dev/null)

if [ -z "$DEPLOYMENT_ID" ] || [ "$DEPLOYMENT_ID" = "None" ]; then
    # Create new deployment
    DEPLOYMENT_ID=$(aws apigateway create-deployment \
        --rest-api-id $API_ID \
        --stage-name $STAGE_NAME \
        --region $REGION \
        --query "id" \
        --output text)
    echo "  Created new deployment: $DEPLOYMENT_ID"
else
    # Update existing deployment
    aws apigateway create-deployment \
        --rest-api-id $API_ID \
        --stage-name $STAGE_NAME \
        --region $REGION > /dev/null 2>&1
    echo "  Updated deployment"
fi

echo ""
echo "✓ API deployed successfully"
echo ""

# Get API endpoint
API_ENDPOINT=$(aws apigateway get-stage --rest-api-id $API_ID --stage-name $STAGE_NAME --region $REGION --query "invokeUrl" --output text)
echo "API Endpoint: $API_ENDPOINT"
echo ""

echo "✓ CORS configuration complete!"
echo ""
echo "You can now make requests from the frontend to:"
echo "  $API_ENDPOINT/auth/register"
echo "  $API_ENDPOINT/auth/login"
echo "  $API_ENDPOINT/practice/generate"
echo "  etc."
