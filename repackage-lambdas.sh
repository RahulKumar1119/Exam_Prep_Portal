#!/bin/bash

# Repackage Lambda functions with updated dependencies

echo "Repackaging Lambda functions..."
echo ""

# Function to repackage Lambda
repackage_lambda() {
    local module_name=$1
    local module_path="backend/$module_name"
    
    echo "Repackaging $module_name..."
    
    # Create build directory
    build_dir="/tmp/${module_name}_build"
    rm -rf "$build_dir"
    mkdir -p "$build_dir"
    
    # Install dependencies
    pip install -r "$module_path/requirements.txt" -t "$build_dir" --quiet 2>/dev/null
    
    # Copy Lambda function code
    cp "$module_path/lambda_function.py" "$build_dir/" 2>/dev/null
    
    # Copy any service modules
    if [ -f "$module_path/${module_name}_service.py" ]; then
        cp "$module_path/${module_name}_service.py" "$build_dir/"
    fi
    
    # Copy any other Python files in the module (but not __pycache__)
    for file in "$module_path"/*.py; do
        if [ -f "$file" ] && [ "$(basename "$file")" != "lambda_function.py" ]; then
            cp "$file" "$build_dir/" 2>/dev/null
        fi
    done
    
    # Remove old zip file
    rm -f "$module_path/${module_name}_lambda.zip"
    
    # Create zip file
    (cd "$build_dir" && zip -r "$module_path/${module_name}_lambda.zip" . > /dev/null 2>&1)
    
    # Cleanup
    rm -rf "$build_dir"
    
    echo "  ✓ $module_name repackaged"
}

# Repackage all Lambda functions
repackage_lambda "auth"
repackage_lambda "practice"
repackage_lambda "ai_tutor"
repackage_lambda "question_bank"
repackage_lambda "audit"
repackage_lambda "notifications"

echo ""
echo "✓ All Lambda functions repackaged successfully!"
echo ""
echo "Next step: Run deploy-lambdas.sh to deploy updated functions"
