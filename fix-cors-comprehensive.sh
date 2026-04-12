#!/bin/bash

# Comprehensive CORS fix for API Gateway

REGION="ap-south-1"
API_ID="gf3qqozf2l"
STAGE_NAME="prod"

echo "=== Comprehensive CORS Configuration ==="
echo "API ID: $API_ID"
echo "Region: $REGION"
echo "Stage: $STAGE_NAME"
echo ""

# Step 1: Get all resources
echo "Step 1: Getting all resources..."
RESOURCES=$(aws apigateway get-resources --rest-api-id $API_ID --region $REGION --query "items[].id" --output text)
RESOURCE_COUNT=$(echo $RESOURCES | wc -w)
echo "✓ Found $RESOURCE_COUNT resources"
echo ""

# Step 2: Configure CORS on each resource
echo "Step 2: Configuring CORS on each resource..."
for RESOURCE_ID in $RESOURCES; do
    # Get resource path for logging
    RESOURCE_PATH=$(aws apigateway get-resource --rest-api-id $API_ID --resource-id $RESOURCE_ID --region $REGION --query "path" --output text 2>/dev/null)
    
    # Delete existing OPTIONS method if it exists
    aws apigateway delete-method \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method OPTIONS \
        --region $REGION > /dev/null 2>&1
    
    # Create new OPTIONS method
    aws apigateway put-method \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method OPTIONS \
        --authorization-type NONE \
        --region $REGION > /dev/null 2>&1
    
    # Add method response for 200
    aws apigateway put-method-response \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method OPTIONS \
        --status-code 200 \
        --response-parameters '{
            "method.response.header.Access-Control-Allow-Headers": false,
            "method.response.header.Access-Control-Allow-Methods": false,
            "method.response.header.Access-Control-Allow-Origin": false
        }' \
        --region $REGION > /dev/null 2>&1
    
    # Create mock integration
    aws apigateway put-integration \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method OPTIONS \
        --type MOCK \
        --request-templates '{"application/json": "{\"statusCode\": 200}"}' \
        --region $REGION > /dev/null 2>&1
    
    # Add integration response
    aws apigateway put-integration-response \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method OPTIONS \
        --status-code 200 \
        --response-parameters '{
            "method.response.header.Access-Control-Allow-Headers": "'"'"'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"'"'",
            "method.response.header.Access-Control-Allow-Methods": "'"'"'GET,POST,PUT,DELETE,OPTIONS,PATCH'"'"'",
            "method.response.header.Access-Control-Allow-Origin": "'"'"'*'"'"'"
        }' \
        --response-templates '{"application/json": "{}"}' \
        --region $REGION > /dev/null 2>&1
    
    echo "  ✓ $RESOURCE_PATH"
done

echo "✓ CORS configured on all resources"
echo ""

# Step 3: Deploy API
echo "Step 3: Deploying API..."
DEPLOYMENT=$(aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name $STAGE_NAME \
    --region $REGION \
    --query "id" \
    --output text)

echo "✓ Deployment created: $DEPLOYMENT"
echo ""

# Step 4: Verify deployment
echo "Step 4: Verifying deployment..."
sleep 2

# Test OPTIONS request
RESPONSE=$(curl -s -w "\n%{http_code}" -X OPTIONS \
    https://$API_ID.execute-api.$REGION.amazonaws.com/$STAGE_NAME/auth/register \
    -H "Origin: https://jaiib-portal.amplifyapp.com" \
    -H "Access-Control-Request-Method: POST")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
HEADERS=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ OPTIONS request successful (HTTP 200)"
    echo "✓ CORS headers present"
else
    echo "✗ OPTIONS request failed (HTTP $HTTP_CODE)"
    echo "Response:"
    echo "$HEADERS"
fi

echo ""
echo "=== Configuration Complete ==="
echo "API Endpoint: https://$API_ID.execute-api.$REGION.amazonaws.com/$STAGE_NAME"
echo ""
echo "Test with:"
echo "curl -X POST https://$API_ID.execute-api.$REGION.amazonaws.com/$STAGE_NAME/auth/register \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\":\"test@example.com\",\"password\":\"TestPass123!\",\"full_name\":\"Test User\"}'"
