#!/bin/bash

# JAIIB-CAIIB Frontend Infrastructure Deployment Script
# This script sets up AWS Amplify and CloudFront for the React frontend

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
ENVIRONMENT=${1:-staging}
AWS_REGION=${AWS_REGION:-"ap-south-1"}
PROJECT_NAME="jaiib-caiib-exam-prep-portal"
AMPLIFY_APP_NAME="$PROJECT_NAME-$ENVIRONMENT"

echo -e "${YELLOW}=== Frontend Infrastructure Deployment ===${NC}"
echo -e "${YELLOW}Environment: $ENVIRONMENT${NC}"
echo -e "${YELLOW}Region: $AWS_REGION${NC}"

# Step 1: Verify AWS credentials
echo -e "${YELLOW}Step 1: Verifying AWS credentials...${NC}"
if ! aws sts get-caller-identity --region $AWS_REGION > /dev/null 2>&1; then
    echo -e "${RED}AWS credentials not configured or invalid${NC}"
    exit 1
fi
echo -e "${GREEN}AWS credentials verified${NC}"

# Step 2: Create S3 bucket for CloudFront logs
echo -e "${YELLOW}Step 2: Setting up S3 bucket for CloudFront logs...${NC}"
LOGS_BUCKET="$PROJECT_NAME-cloudfront-logs-$ENVIRONMENT"

if aws s3 ls "s3://$LOGS_BUCKET" --region $AWS_REGION 2>/dev/null; then
    echo -e "${GREEN}S3 bucket already exists: $LOGS_BUCKET${NC}"
else
    echo -e "${YELLOW}Creating S3 bucket: $LOGS_BUCKET${NC}"
    aws s3 mb "s3://$LOGS_BUCKET" --region $AWS_REGION
    
    # Enable versioning
    aws s3api put-bucket-versioning \
        --bucket "$LOGS_BUCKET" \
        --versioning-configuration Status=Enabled \
        --region $AWS_REGION
    
    # Block public access
    aws s3api put-public-access-block \
        --bucket "$LOGS_BUCKET" \
        --public-access-block-configuration \
        "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
        --region $AWS_REGION
    
    echo -e "${GREEN}S3 bucket created and configured${NC}"
fi

# Step 3: Create S3 bucket for frontend artifacts
echo -e "${YELLOW}Step 3: Setting up S3 bucket for frontend artifacts...${NC}"
ARTIFACTS_BUCKET="$PROJECT_NAME-frontend-artifacts-$ENVIRONMENT"

if aws s3 ls "s3://$ARTIFACTS_BUCKET" --region $AWS_REGION 2>/dev/null; then
    echo -e "${GREEN}S3 bucket already exists: $ARTIFACTS_BUCKET${NC}"
else
    echo -e "${YELLOW}Creating S3 bucket: $ARTIFACTS_BUCKET${NC}"
    aws s3 mb "s3://$ARTIFACTS_BUCKET" --region $AWS_REGION
    
    # Enable versioning
    aws s3api put-bucket-versioning \
        --bucket "$ARTIFACTS_BUCKET" \
        --versioning-configuration Status=Enabled \
        --region $AWS_REGION
    
    # Block public access
    aws s3api put-public-access-block \
        --bucket "$ARTIFACTS_BUCKET" \
        --public-access-block-configuration \
        "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
        --region $AWS_REGION
    
    echo -e "${GREEN}S3 bucket created and configured${NC}"
fi

# Step 4: Create IAM role for Amplify
echo -e "${YELLOW}Step 4: Setting up IAM role for Amplify...${NC}"
AMPLIFY_ROLE_NAME="$PROJECT_NAME-amplify-role-$ENVIRONMENT"

if aws iam get-role --role-name "$AMPLIFY_ROLE_NAME" 2>/dev/null; then
    echo -e "${GREEN}IAM role already exists: $AMPLIFY_ROLE_NAME${NC}"
else
    echo -e "${YELLOW}Creating IAM role: $AMPLIFY_ROLE_NAME${NC}"
    
    # Create trust policy
    cat > /tmp/amplify-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "amplify.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
    
    aws iam create-role \
        --role-name "$AMPLIFY_ROLE_NAME" \
        --assume-role-policy-document file:///tmp/amplify-trust-policy.json
    
    # Attach policies
    aws iam attach-role-policy \
        --role-name "$AMPLIFY_ROLE_NAME" \
        --policy-arn "arn:aws:iam::aws:policy/AdministratorAccess-Amplify"
    
    echo -e "${GREEN}IAM role created${NC}"
fi

# Step 5: Create CloudFront distribution
echo -e "${YELLOW}Step 5: Setting up CloudFront distribution...${NC}"
DISTRIBUTION_ID=$(aws cloudfront list-distributions --region $AWS_REGION \
    --query "DistributionList.Items[?Comment=='CloudFront distribution for JAIIB-CAIIB Exam Prep Portal'].Id" \
    --output text 2>/dev/null || echo "")

if [ -z "$DISTRIBUTION_ID" ]; then
    echo -e "${YELLOW}Creating CloudFront distribution...${NC}"
    
    # Create distribution using config file
    DISTRIBUTION=$(aws cloudfront create-distribution \
        --distribution-config file://cloudfront-config.json \
        --region $AWS_REGION)
    
    DISTRIBUTION_ID=$(echo $DISTRIBUTION | jq -r '.Distribution.Id')
    DISTRIBUTION_DOMAIN=$(echo $DISTRIBUTION | jq -r '.Distribution.DomainName')
    
    echo -e "${GREEN}CloudFront distribution created${NC}"
    echo -e "${GREEN}Distribution ID: $DISTRIBUTION_ID${NC}"
    echo -e "${GREEN}Domain: $DISTRIBUTION_DOMAIN${NC}"
else
    echo -e "${GREEN}CloudFront distribution already exists: $DISTRIBUTION_ID${NC}"
    DISTRIBUTION_DOMAIN=$(aws cloudfront get-distribution --id $DISTRIBUTION_ID --region $AWS_REGION \
        --query 'Distribution.DomainName' --output text)
fi

# Step 6: Create environment configuration file
echo -e "${YELLOW}Step 6: Creating environment configuration...${NC}"
cat > frontend/.env.$ENVIRONMENT << EOF
# Auto-generated environment configuration for $ENVIRONMENT
REACT_APP_ENVIRONMENT=$ENVIRONMENT
REACT_APP_CLOUDFRONT_DOMAIN=$DISTRIBUTION_DOMAIN
REACT_APP_DISTRIBUTION_ID=$DISTRIBUTION_ID
REACT_APP_AWS_REGION=$AWS_REGION
EOF

echo -e "${GREEN}Environment configuration created${NC}"

# Step 7: Output summary
echo -e "${GREEN}=== Deployment Summary ===${NC}"
echo -e "${GREEN}Environment: $ENVIRONMENT${NC}"
echo -e "${GREEN}Region: $AWS_REGION${NC}"
echo -e "${GREEN}Logs Bucket: $LOGS_BUCKET${NC}"
echo -e "${GREEN}Artifacts Bucket: $ARTIFACTS_BUCKET${NC}"
echo -e "${GREEN}Amplify Role: $AMPLIFY_ROLE_NAME${NC}"
echo -e "${GREEN}CloudFront Distribution ID: $DISTRIBUTION_ID${NC}"
echo -e "${GREEN}CloudFront Domain: $DISTRIBUTION_DOMAIN${NC}"

echo -e "${YELLOW}Next steps:${NC}"
echo -e "${YELLOW}1. Configure Amplify app in AWS Console${NC}"
echo -e "${YELLOW}2. Connect GitHub repository${NC}"
echo -e "${YELLOW}3. Set environment variables in Amplify console${NC}"
echo -e "${YELLOW}4. Deploy frontend using: cd frontend && bash deploy.sh $ENVIRONMENT${NC}"

echo -e "${GREEN}=== Deployment completed ===${NC}"
