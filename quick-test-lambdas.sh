#!/bin/bash

REGION="ap-south-1"

echo "Quick test of Lambda functions..."
echo ""

# Test auth function
echo "Testing jaiib-auth..."
aws lambda invoke \
    --function-name jaiib-auth \
    --region "$REGION" \
    --payload '{"httpMethod": "POST", "path": "/auth/register", "body": "{\"email\": \"test@example.com\", \"password\": \"TestPass123!\", \"full_name\": \"Test User\"}"}' \
    /tmp/auth_response.json 2>&1 | grep -E "(FunctionArn|Error|StatusCode)" || echo "  ✓ Invoked"

if [ -f /tmp/auth_response.json ]; then
    echo "  Response:"
    cat /tmp/auth_response.json | head -5
    rm /tmp/auth_response.json
fi
echo ""

# Test practice function
echo "Testing jaiib-practice..."
aws lambda invoke \
    --function-name jaiib-practice \
    --region "$REGION" \
    --payload '{"httpMethod": "POST", "path": "/practice/generate", "body": "{\"user_id\": \"user123\", \"paper\": \"JAIIB\"}"}' \
    /tmp/practice_response.json 2>&1 | grep -E "(FunctionArn|Error|StatusCode)" || echo "  ✓ Invoked"

if [ -f /tmp/practice_response.json ]; then
    echo "  Response:"
    cat /tmp/practice_response.json | head -5
    rm /tmp/practice_response.json
fi
echo ""

# Test question bank function
echo "Testing jaiib-question-bank..."
aws lambda invoke \
    --function-name jaiib-question-bank \
    --region "$REGION" \
    --payload '{"httpMethod": "GET", "path": "/questions", "queryStringParameters": {"paper": "JAIIB", "limit": "10"}}' \
    /tmp/qb_response.json 2>&1 | grep -E "(FunctionArn|Error|StatusCode)" || echo "  ✓ Invoked"

if [ -f /tmp/qb_response.json ]; then
    echo "  Response:"
    cat /tmp/qb_response.json | head -5
    rm /tmp/qb_response.json
fi
echo ""

echo "✓ Quick test complete!"
echo ""
echo "Check CloudWatch logs for detailed execution information:"
echo "  aws logs tail /aws/lambda/jaiib-auth --follow --region ap-south-1"
echo "  aws logs tail /aws/lambda/jaiib-practice --follow --region ap-south-1"
echo "  aws logs tail /aws/lambda/jaiib-question-bank --follow --region ap-south-1"
