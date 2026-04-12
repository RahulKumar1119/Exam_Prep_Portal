#!/bin/bash

# Fix CORS by routing OPTIONS to Lambda (which returns CORS headers)

REGION="ap-south-1"
API_ID="gf3qqozf2l"
STAGE_NAME="prod"

echo "=== Fixing CORS with Lambda Integration ==="
echo "API ID: $API_ID"
echo "Region: $REGION"
echo ""

# Get all resources
RESOURCES=$(aws apigateway get-resources --rest-api-id $API_ID --region $REGION --query "items[].id" --output text)

echo "Configuring OPTIONS method to use Lambda..."
for RESOURCE_ID in $RESOURCES; do
    RESOURCE_PATH=$(aws apigateway get-resource --rest-api-id $API_ID --resource-id $RESOURCE_ID --region $REGION --query "path" --output text 2>/dev/null)
    
    # Skip root resource
    if [ "$RESOURCE_PATH" = "/" ]; then
        continue
    fi
    
    # Delete existing OPTIONS method
    aws apigateway delete-method \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method OPTIONS \
        --region $REGION > /dev/null 2>&1
    
    # Create OPTIONS method
    aws apigateway put-method \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method OPTIONS \
        --authorization-type NONE \
        --region $REGION > /dev/null 2>&1
    
    # Get the Lambda function ARN from the POST method (if it exists)
    LAMBDA_ARN=$(aws apigateway get-integration --rest-api-id $API_ID --resource-id $RESOURCE_ID --http-method POST --region $REGION --query "uri" --output text 2>/dev/null)
    
    if [ -z "$LAMBDA_ARN" ] || [ "$LAMBDA_ARN" = "None" ]; then
        # Try GET method
        LAMBDA_ARN=$(aws apigateway get-integration --rest-api-id $API_ID --resource-id $RESOURCE_ID --http-method GET --region $REGION --query "uri" --output text 2>/dev/null)
    fi
    
    if [ -z "$LAMBDA_ARN" ] || [ "$LAMBDA_ARN" = "None" ]; then
        # Use default auth Lambda
        LAMBDA_ARN="arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:438097524343:function:jaiib-auth/invocations"
    fi
    
    # Create AWS_PROXY integration with Lambda
    aws apigateway put-integration \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method OPTIONS \
        --type AWS_PROXY \
        --integration-http-method POST \
        --uri "$LAMBDA_ARN" \
        --region $REGION > /dev/null 2>&1
    
    echo "  ✓ $RESOURCE_PATH"
done

echo ""
echo "Deploying API..."
aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name $STAGE_NAME \
    --region $REGION > /dev/null 2>&1

echo "✓ API deployed"
echo ""

# Wait for deployment
sleep 3

# Test
echo "Testing OPTIONS request..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X OPTIONS \
    https://$API_ID.execute-api.$REGION.amazonaws.com/$STAGE_NAME/auth/register \
    -H "Origin: https://jaiib-portal.amplifyapp.com" \
    -H "Access-Control-Request-Method: POST")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ OPTIONS request successful (HTTP 200)"
else
    echo "✗ OPTIONS request returned HTTP $HTTP_CODE"
fi

echo ""
echo "API Endpoint: https://$API_ID.execute-api.$REGION.amazonaws.com/$STAGE_NAME"
