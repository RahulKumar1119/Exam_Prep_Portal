#!/bin/bash

REGION="ap-south-1"

echo "Testing Lambda functions with sample payloads..."
echo ""

# Function to test Lambda
test_lambda() {
    local function_name=$1
    local payload=$2
    
    echo "Testing: $function_name"
    echo "Payload: $payload"
    
    # Invoke Lambda with JSON payload (no base64 encoding needed for direct invocation)
    aws lambda invoke \
        --function-name "$function_name" \
        --region "$REGION" \
        --payload "$payload" \
        --log-type Tail \
        /tmp/lambda_response.json 2>&1
    
    echo "Response:"
    if [ -f /tmp/lambda_response.json ]; then
        cat /tmp/lambda_response.json
        rm /tmp/lambda_response.json
    else
        echo "No response file generated"
    fi
    echo ""
    echo "---"
    echo ""
}

# Test Auth Lambda
echo "=== AUTH LAMBDA TESTS ==="
echo ""

test_lambda "jaiib-auth" '{"httpMethod": "POST", "path": "/auth/register", "body": "{\"email\": \"test@example.com\", \"password\": \"TestPass123!\", \"full_name\": \"Test User\"}"}'

test_lambda "jaiib-auth" '{"httpMethod": "POST", "path": "/auth/login", "body": "{\"email\": \"test@example.com\", \"password\": \"TestPass123!\"}"}'

# Test Practice Lambda
echo "=== PRACTICE LAMBDA TESTS ==="
echo ""

test_lambda "jaiib-practice" '{"httpMethod": "POST", "path": "/practice/generate", "body": "{\"user_id\": \"user123\", \"paper\": \"JAIIB\"}"}'

test_lambda "jaiib-practice" '{"httpMethod": "POST", "path": "/practice/submit", "body": "{\"session_id\": \"session123\", \"answers\": [\"A\", \"B\", \"C\", \"D\"]}"}'

# Test Question Bank Lambda
echo "=== QUESTION BANK LAMBDA TESTS ==="
echo ""

test_lambda "jaiib-question-bank" '{"httpMethod": "GET", "path": "/questions", "queryStringParameters": {"paper": "JAIIB", "limit": "10"}}'

test_lambda "jaiib-question-bank" '{"httpMethod": "POST", "path": "/questions", "body": "{\"question_text\": \"What is RBI?\", \"options\": [\"A\", \"B\", \"C\", \"D\"], \"correct_answer\": \"A\", \"topic\": \"Banking\", \"difficulty\": \"Easy\"}"}'

# Test AI Tutor Lambda
echo "=== AI TUTOR LAMBDA TESTS ==="
echo ""

test_lambda "jaiib-ai-tutor" '{"httpMethod": "POST", "path": "/ai/explain", "body": "{\"question_id\": \"q123\", \"user_id\": \"user123\", \"selected_answer\": \"B\", \"correct_answer\": \"A\"}"}'

# Test Audit Lambda
echo "=== AUDIT LAMBDA TESTS ==="
echo ""

test_lambda "jaiib-audit" '{"httpMethod": "POST", "path": "/audit/logs", "body": "{\"user_id\": \"user123\", \"action\": \"login\", \"timestamp\": \"2024-01-01T00:00:00Z\", \"ip_address\": \"192.168.1.1\"}"}'

test_lambda "jaiib-audit" '{"httpMethod": "GET", "path": "/audit/logs", "queryStringParameters": {"user_id": "user123", "limit": "10"}}'

# Test Notifications Lambda
echo "=== NOTIFICATIONS LAMBDA TESTS ==="
echo ""

test_lambda "jaiib-notifications" '{"httpMethod": "POST", "path": "/notifications", "body": "{\"user_id\": \"user123\", \"type\": \"milestone\", \"message\": \"Congratulations! You completed 5 practice sets.\"}"}'

test_lambda "jaiib-notifications" '{"httpMethod": "GET", "path": "/notifications", "queryStringParameters": {"user_id": "user123"}}'

echo ""
echo "✓ All Lambda tests completed!"
echo ""
echo "Check CloudWatch logs for detailed execution information:"
echo "  aws logs tail /aws/lambda/jaiib-auth --follow --region ap-south-1"
echo "  aws logs tail /aws/lambda/jaiib-practice --follow --region ap-south-1"
echo "  aws logs tail /aws/lambda/jaiib-ai-tutor --follow --region ap-south-1"
echo "  aws logs tail /aws/lambda/jaiib-question-bank --follow --region ap-south-1"
echo "  aws logs tail /aws/lambda/jaiib-audit --follow --region ap-south-1"
echo "  aws logs tail /aws/lambda/jaiib-notifications --follow --region ap-south-1"
