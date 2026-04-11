#!/bin/bash

# JAIIB-CAIIB Exam Prep Portal - Frontend Deployment Script
# This script handles building and deploying the React frontend to AWS Amplify

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-development}
AMPLIFY_APP_ID=${AMPLIFY_APP_ID:-""}
AMPLIFY_BRANCH=${AMPLIFY_BRANCH:-"main"}
AWS_REGION=${AWS_REGION:-"ap-south-1"}

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(development|staging|production)$ ]]; then
    echo -e "${RED}Error: Invalid environment. Must be development, staging, or production${NC}"
    exit 1
fi

echo -e "${YELLOW}=== JAIIB-CAIIB Frontend Deployment ===${NC}"
echo -e "${YELLOW}Environment: $ENVIRONMENT${NC}"
echo -e "${YELLOW}Region: $AWS_REGION${NC}"

# Step 1: Install dependencies
echo -e "${YELLOW}Step 1: Installing dependencies...${NC}"
npm ci

# Step 2: Run tests
echo -e "${YELLOW}Step 2: Running tests...${NC}"
npm run test -- --coverage --watchAll=false || {
    echo -e "${RED}Tests failed. Aborting deployment.${NC}"
    exit 1
}

# Step 3: Build application
echo -e "${YELLOW}Step 3: Building application...${NC}"
REACT_APP_ENVIRONMENT=$ENVIRONMENT npm run build

# Step 4: Validate build
if [ ! -d "build" ]; then
    echo -e "${RED}Build directory not found. Build failed.${NC}"
    exit 1
fi

echo -e "${GREEN}Build completed successfully${NC}"

# Step 5: Deploy to Amplify (if Amplify CLI is configured)
if [ -n "$AMPLIFY_APP_ID" ]; then
    echo -e "${YELLOW}Step 5: Deploying to AWS Amplify...${NC}"
    
    # Check if Amplify CLI is installed
    if ! command -v amplify &> /dev/null; then
        echo -e "${RED}Amplify CLI not found. Please install it with: npm install -g @aws-amplify/cli${NC}"
        exit 1
    fi
    
    # Deploy using Amplify CLI
    amplify publish --yes --environment $ENVIRONMENT
    
    echo -e "${GREEN}Deployment to Amplify completed${NC}"
else
    echo -e "${YELLOW}Step 5: Skipping Amplify deployment (AMPLIFY_APP_ID not set)${NC}"
    echo -e "${YELLOW}Build artifacts are ready in the 'build' directory${NC}"
fi

# Step 6: Run smoke tests (if deployment was successful)
if [ -n "$AMPLIFY_APP_ID" ]; then
    echo -e "${YELLOW}Step 6: Running smoke tests...${NC}"
    
    # Get the Amplify app URL
    AMPLIFY_URL=$(aws amplify get-app --app-id $AMPLIFY_APP_ID --region $AWS_REGION --query 'app.defaultDomain' --output text)
    
    if [ -z "$AMPLIFY_URL" ]; then
        echo -e "${RED}Could not retrieve Amplify URL${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}Testing URL: https://$AMPLIFY_URL${NC}"
    
    # Simple health check
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$AMPLIFY_URL")
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}Smoke test passed (HTTP $HTTP_CODE)${NC}"
    else
        echo -e "${RED}Smoke test failed (HTTP $HTTP_CODE)${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}=== Deployment completed successfully ===${NC}"
