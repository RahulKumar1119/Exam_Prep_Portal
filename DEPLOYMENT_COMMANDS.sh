#!/bin/bash

# JAIIB-CAIIB Exam Prep Portal - AWS Deployment Commands
# Run these commands in order to deploy to AWS

set -e  # Exit on error

echo "=========================================="
echo "AWS Deployment Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${GREEN}[STEP]${NC} $1"
}

print_info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Check Prerequisites
print_step "Checking prerequisites..."

if ! command -v aws &> /dev/null; then
    print_error "AWS CLI not found. Please install it first."
    exit 1
fi

if ! command -v cdk &> /dev/null; then
    print_error "AWS CDK not found. Install with: npm install -g aws-cdk"
    exit 1
fi

if ! command -v node &> /dev/null; then
    print_error "Node.js not found. Please install it first."
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    print_error "Python 3 not found. Please install it first."
    exit 1
fi

print_info "All prerequisites found ✓"

# Step 2: Deploy Backend Infrastructure
print_step "Deploying backend infrastructure with CDK..."

cd infrastructure

print_info "Installing CDK dependencies..."
npm install

print_info "Bootstrapping CDK (first time only)..."
cdk bootstrap || true

print_info "Deploying CDK stack..."
cdk deploy --require-approval never

# Capture API Gateway URL
print_info "Retrieving API Gateway URL..."
API_ID=$(aws apigateway get-rest-apis --query 'items[0].id' --output text)
REGION=$(aws configure get region)
API_URL="https://${API_ID}.execute-api.${REGION}.amazonaws.com/prod"

print_info "API Gateway URL: ${API_URL}"
print_info "Save this URL - you'll need it for the frontend configuration"

cd ..

# Step 3: Update Frontend Environment Variables
print_step "Updating frontend environment variables..."

print_info "Creating .env.production..."
cat > frontend/.env.production << EOF
REACT_APP_API_URL=${API_URL}/api
REACT_APP_ENVIRONMENT=production
EOF

print_info "Creating .env.staging..."
cat > frontend/.env.staging << EOF
REACT_APP_API_URL=${API_URL}/staging/api
REACT_APP_ENVIRONMENT=staging
EOF

print_info "Environment variables created ✓"

# Step 4: Build Frontend
print_step "Building frontend..."

cd frontend

print_info "Installing frontend dependencies..."
npm install

print_info "Building React application..."
npm run build

print_info "Frontend build completed ✓"

cd ..

# Step 5: Deploy Frontend to AWS Amplify
print_step "Frontend is ready for AWS Amplify deployment"

print_info "Next steps:"
print_info "1. Push your code to GitHub"
print_info "2. Go to AWS Amplify Console"
print_info "3. Click 'New app' → 'Host web app'"
print_info "4. Select your repository and branch"
print_info "5. Add environment variables:"
print_info "   REACT_APP_API_URL=${API_URL}/api"
print_info "   REACT_APP_ENVIRONMENT=production"
print_info "6. Click 'Deploy'"

# Step 6: Test API Endpoints
print_step "Testing API endpoints..."

print_info "Testing registration endpoint..."
curl -X POST ${API_URL}/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "full_name": "Test User",
    "bank_affiliation": "Test Bank"
  }' || print_error "Registration endpoint test failed"

print_info "API endpoint test completed"

# Summary
echo ""
echo "=========================================="
echo -e "${GREEN}Deployment Configuration Complete!${NC}"
echo "=========================================="
echo ""
echo "API Gateway URL: ${API_URL}"
echo ""
echo "Frontend Environment Variables:"
echo "  REACT_APP_API_URL=${API_URL}/api"
echo "  REACT_APP_ENVIRONMENT=production"
echo ""
echo "Next Steps:"
echo "1. Review AWS_DEPLOYMENT_GUIDE.md for detailed instructions"
echo "2. Deploy frontend to AWS Amplify"
echo "3. Configure custom domain (optional)"
echo "4. Set up monitoring and alerting"
echo ""
echo "Documentation:"
echo "  - AWS_DEPLOYMENT_GUIDE.md - Complete deployment guide"
echo "  - QUICK_DEPLOYMENT_REFERENCE.md - Quick reference"
echo "  - DEPLOYMENT_CHECKLIST.md - Pre-deployment checklist"
echo "  - GET_API_GATEWAY_URL.md - How to get API Gateway URL"
echo ""
echo "=========================================="
