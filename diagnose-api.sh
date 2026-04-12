#!/bin/bash

# Diagnose API Gateway and Lambda integration

API_ID="gf3qqozf2l"
REGION="ap-south-1"
STAGE="prod"

echo "API Gateway Diagnostics"
echo "======================="
echo ""

# 1. Check if API exists
echo "1. Checking API Gateway..."
API_NAME=$(aws apigateway get-rest-api --rest-api-id $API_ID --region $REGION --query "name" --output text 2>/dev/null)
if [ -z "$API_NAME" ]; then
    echo "   ✗ API not found"
    exit 1
fi
echo "   ✓ API: $API_NAME"
echo ""

# 2. Check stage
echo "2. Checking Stage..."
STAGE_INFO=$(aws apigateway get-stage --rest-api-id $API_ID --stage-name $STAGE --region $REGION 2>/dev/null)
if [ -z "$STAGE_INFO" ]; then
    echo "   ✗ Stage '$STAGE' not found"
    exit 1
fi
INVOKE_URL=$(echo "$STAGE_INFO" | grep -o '"invokeUrl":"[^"]*"' | cut -d'"' -f4)
echo "   ✓ Stage: $STAGE"
echo "   ✓ Invoke URL: $INVOKE_URL"
echo ""

# 3. Check resources
echo "3. Checking Resources..."
RESOURCE_COUNT=$(aws apigateway get-resources --rest-api-id $API_ID --region $REGION --query "length(items)" --output text 2>/dev/null)
echo "   ✓ Total resources: $RESOURCE_COUNT"
echo ""

# 4. Test OPTIONS request
echo "4. Testing OPTIONS Request..."
OPTIONS_RESPONSE=$(curl -s -X OPTIONS "$INVOKE_URL/auth/register" \
  -H "Origin: https://jaiib-portal.amplifyapp.com" \
  -w "\n%{http_code}" 2>&1)

HTTP_CODE=$(echo "$OPTIONS_RESPONSE" | tail -n 1)
echo "   HTTP Status: $HTTP_CODE"

if echo "$OPTIONS_RESPONSE" | grep -q "Access-Control-Allow-Origin"; then
    echo "   ✓ CORS headers present"
else
    echo "   ✗ CORS headers missing"
fi
echo ""

# 5. Test POST request
echo "5. Testing POST Request..."
POST_RESPONSE=$(curl -s -X POST "$INVOKE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!","full_name":"Test User"}' \
  -w "\n%{http_code}" 2>&1)

POST_CODE=$(echo "$POST_RESPONSE" | tail -n 1)
echo "   HTTP Status: $POST_CODE"

if [ "$POST_CODE" = "200" ]; then
    echo "   ✓ Request successful"
elif [ "$POST_CODE" = "500" ]; then
    echo "   ✗ Lambda error (500)"
    echo "   Response:"
    echo "$POST_RESPONSE" | head -n -1 | head -c 200
elif [ "$POST_CODE" = "403" ]; then
    echo "   ✗ Forbidden (403) - Lambda not integrated"
else
    echo "   ? Unexpected status: $POST_CODE"
fi
echo ""

echo "======================="
echo "Diagnostics complete"
