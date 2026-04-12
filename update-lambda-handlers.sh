#!/bin/bash

REGION="ap-south-1"

echo "Updating Lambda handler configurations..."
echo ""

# Update handlers for each function
echo "Updating jaiib-auth handler..."
aws lambda update-function-configuration \
    --function-name jaiib-auth \
    --handler lambda_function.handler \
    --region "$REGION" > /dev/null
echo "✓ jaiib-auth handler updated"

echo "Updating jaiib-practice handler..."
aws lambda update-function-configuration \
    --function-name jaiib-practice \
    --handler lambda_function.handler \
    --region "$REGION" > /dev/null
echo "✓ jaiib-practice handler updated"

echo "Updating jaiib-audit handler..."
aws lambda update-function-configuration \
    --function-name jaiib-audit \
    --handler lambda_function.handler \
    --region "$REGION" > /dev/null
echo "✓ jaiib-audit handler updated"

echo "Updating jaiib-notifications handler..."
aws lambda update-function-configuration \
    --function-name jaiib-notifications \
    --handler lambda_function.lambda_handler \
    --region "$REGION" > /dev/null
echo "✓ jaiib-notifications handler updated"

echo "Updating jaiib-question-bank handler..."
aws lambda update-function-configuration \
    --function-name jaiib-question-bank \
    --handler lambda_function.lambda_handler \
    --region "$REGION" > /dev/null
echo "✓ jaiib-question-bank handler updated"

echo "Updating jaiib-ai-tutor handler..."
aws lambda update-function-configuration \
    --function-name jaiib-ai-tutor \
    --handler lambda_function.lambda_handler \
    --region "$REGION" > /dev/null
echo "✓ jaiib-ai-tutor handler updated"

echo ""
echo "✓ All handlers updated!"
echo ""
echo "Now run: bash test-lambdas.sh"
