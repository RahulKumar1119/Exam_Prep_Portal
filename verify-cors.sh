#!/bin/bash

# Verify CORS configuration

API_ID="gf3qqozf2l"
REGION="ap-south-1"
STAGE_NAME="prod"

echo "Verifying CORS Configuration"
echo "=============================="
echo ""

# Get API endpoint
API_ENDPOINT="https://$API_ID.execute-api.$REGION.amazonaws.com/$STAGE_NAME"
echo "API Endpoint: $API_ENDPOINT"
echo ""

# Test OPTIONS request
echo "Testing OPTIONS request to /auth/register..."
echo ""

RESPONSE=$(curl -s -X OPTIONS "$API_ENDPOINT/auth/register" \
  -H "Origin: https://jaiib-portal.amplifyapp.com" \
  -H "Access-Control-Request-Method: POST" \
  -w "\n%{http_code}" \
  -v 2>&1)

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
HEADERS=$(echo "$RESPONSE" | head -n -1)

echo "HTTP Status: $HTTP_CODE"
echo ""

if echo "$HEADERS" | grep -q "Access-Control-Allow-Origin"; then
    echo "✓ CORS headers present"
    echo ""
    echo "CORS Headers:"
    echo "$HEADERS" | grep -i "access-control" || echo "  (none found)"
else
    echo "✗ CORS headers missing"
fi

echo ""
echo "Full Response Headers:"
echo "$HEADERS" | grep -E "^<|^>" | head -20

echo ""
echo "=============================="
echo ""

# Test actual POST request
echo "Testing POST request to /auth/register..."
echo ""

curl -X POST "$API_ENDPOINT/auth/register" \
  -H "Content-Type: application/json" \
  -H "Origin: https://jaiib-portal.amplifyapp.com" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "full_name": "Test User"
  }' \
  -w "\nHTTP Status: %{http_code}\n" \
  -v 2>&1 | grep -E "^<|^>|HTTP|Access-Control|error|success"

echo ""
echo "✓ CORS verification complete"
