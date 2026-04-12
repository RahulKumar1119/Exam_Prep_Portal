#!/bin/bash

echo "Packaging Lambda functions..."
echo ""

# Function to package Lambda
package_lambda() {
    local module_name=$1
    local module_path=$2
    
    echo "Packaging $module_name..."
    
    # Create temp directory
    mkdir -p "/tmp/lambda_$module_name"
    
    # Copy lambda function and dependencies
    cp -r "$module_path"/* "/tmp/lambda_$module_name/"
    
    # Install dependencies
    if [ -f "$module_path/requirements.txt" ]; then
        pip install -r "$module_path/requirements.txt" -t "/tmp/lambda_$module_name/" --quiet
    fi
    
    # Create zip file
    cd "/tmp/lambda_$module_name"
    zip -r -q "../../$module_path/${module_name}_lambda.zip" .
    cd - > /dev/null
    
    # Cleanup
    rm -rf "/tmp/lambda_$module_name"
    
    echo "  ✓ $module_name packaged: $module_path/${module_name}_lambda.zip"
}

# Package all Lambda functions
package_lambda "auth" "backend/auth"
package_lambda "practice" "backend/practice"
package_lambda "ai_tutor" "backend/ai_tutor"
package_lambda "question_bank" "backend/question_bank"
package_lambda "audit" "backend/audit"
package_lambda "notifications" "backend/notifications"

echo ""
echo "✓ All Lambda functions packaged successfully!"
echo ""
echo "Next: Run 'bash deploy-lambdas.sh' to deploy to AWS"
