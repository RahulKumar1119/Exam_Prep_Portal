#!/bin/bash

ACCOUNT_ID="438097524343"
REGION="ap-south-1"

echo "Setting up API Gateway routes..."
echo ""

# Get or create API Gateway
API_NAME="jaiib-api"
API_ID=$(aws apigateway get-rest-apis --region "$REGION" --query "items[?name=='$API_NAME'].id" --output text)

if [ -z "$API_ID" ]; then
    echo "Creating API Gateway: $API_NAME"
    API_ID=$(aws apigateway create-rest-api \
        --name "$API_NAME" \
        --description "JAIIB-CAIIB Exam Prep Portal API" \
        --region "$REGION" \
        --query 'id' \
        --output text)
    echo "✓ API created: $API_ID"
else
    echo "✓ API already exists: $API_ID"
fi

echo ""
echo "API Gateway ID: $API_ID"
echo ""
echo "Next steps to configure routes:"
echo "1. Go to AWS API Gateway console"
echo "2. Select API: $API_NAME ($API_ID)"
echo "3. Create resources and methods:"
echo ""
echo "   POST /auth/register → jaiib-auth"
echo "   POST /auth/login → jaiib-auth"
echo "   POST /auth/verify-email → jaiib-auth"
echo "   POST /auth/reset-password → jaiib-auth"
echo ""
echo "   POST /practice/generate → jaiib-practice"
echo "   GET /practice/session/{sessionId} → jaiib-practice"
echo "   POST /practice/submit → jaiib-practice"
echo ""
echo "   POST /ai/explain → jaiib-ai-tutor"
echo ""
echo "   GET /questions → jaiib-question-bank"
echo "   POST /questions → jaiib-question-bank"
echo "   PUT /questions/{questionId} → jaiib-question-bank"
echo ""
echo "   GET /audit/logs → jaiib-audit"
echo "   POST /audit/logs → jaiib-audit"
echo ""
echo "   GET /notifications → jaiib-notifications"
echo "   POST /notifications → jaiib-notifications"
echo ""
echo "4. Deploy API to 'prod' stage"
echo "5. Enable CORS for all methods"
echo "6. Set up request/response models"
