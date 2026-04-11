#!/bin/bash

# JAIIB-CAIIB Portal AWS Infrastructure Deployment Script

set -e

echo "=========================================="
echo "JAIIB-CAIIB Portal Infrastructure Deployment"
echo "=========================================="

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI not found. Please install AWS CLI."
    exit 1
fi

if ! command -v cdk &> /dev/null; then
    echo "Error: AWS CDK not found. Please install AWS CDK: npm install -g aws-cdk"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 not found. Please install Python 3.9+"
    exit 1
fi

echo "✓ All prerequisites found"

# Install dependencies
echo ""
echo "Installing Python dependencies..."
pip install -r requirements.txt

echo ""
echo "Installing Node dependencies..."
npm install

# Synthesize template
echo ""
echo "Synthesizing CloudFormation template..."
cdk synth

# Deploy stack
echo ""
echo "Deploying AWS infrastructure..."
cdk deploy --require-approval=change-only

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Stack outputs:"
cdk output

echo ""
echo "Next steps:"
echo "1. Review the outputs above"
echo "2. Deploy Lambda functions"
echo "3. Configure API Gateway integrations"
echo "4. Set up frontend deployment"
echo "5. Run integration tests"
