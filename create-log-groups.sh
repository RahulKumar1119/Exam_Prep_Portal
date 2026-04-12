#!/bin/bash

REGION="ap-south-1"

echo "Creating CloudWatch log groups for Lambda functions..."
echo ""

# Function to create log group
create_log_group() {
    local function_name=$1
    local log_group="/aws/lambda/$function_name"
    
    echo "Creating log group: $log_group"
    
    aws logs create-log-group \
        --log-group-name "$log_group" \
        --region "$REGION" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "  ✓ Log group created"
    else
        echo "  ✓ Log group already exists"
    fi
}

# Create log groups for all functions
create_log_group "jaiib-auth"
create_log_group "jaiib-practice"
create_log_group "jaiib-ai-tutor"
create_log_group "jaiib-question-bank"
create_log_group "jaiib-audit"
create_log_group "jaiib-notifications"

echo ""
echo "✓ All log groups created!"
echo ""
echo "Now run: bash test-lambdas.sh"
