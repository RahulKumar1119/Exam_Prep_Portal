# How to Get Your API Gateway URL

## After CDK Deployment

When you run `cdk deploy`, the output will show your API Gateway URL. Look for something like:

```
Outputs:
jaiibStack.ApiGatewayUrl = https://abc123def.execute-api.us-east-1.amazonaws.com/prod
```

## If You Missed the Output

### Method 1: AWS CLI

```bash
# Get the API Gateway ID
API_ID=$(aws apigateway get-rest-apis --query 'items[0].id' --output text)

# Get the API Gateway URL
echo "https://${API_ID}.execute-api.us-east-1.amazonaws.com/prod"
```

### Method 2: AWS Console

1. Go to AWS Console → API Gateway
2. Click on your API (should be named something like "jaiib-api")
3. Click "Stages" in the left menu
4. Click on "prod" stage
5. Copy the "Invoke URL" at the top

Example: `https://abc123def.execute-api.us-east-1.amazonaws.com/prod`

## Construct Your API Endpoints

Once you have the base URL, your endpoints are:

| Endpoint | Full URL |
|----------|----------|
| Register | `https://abc123def.execute-api.us-east-1.amazonaws.com/prod/api/auth/register` |
| Login | `https://abc123def.execute-api.us-east-1.amazonaws.com/prod/api/auth/login` |
| Verify Email | `https://abc123def.execute-api.us-east-1.amazonaws.com/prod/api/auth/verify-email` |
| Generate Practice Set | `https://abc123def.execute-api.us-east-1.amazonaws.com/prod/api/practice/generate` |
| Submit Practice Set | `https://abc123def.execute-api.us-east-1.amazonaws.com/prod/api/practice/submit` |

## Update Frontend Configuration

### Step 1: Copy Your API Gateway URL
```
https://abc123def.execute-api.us-east-1.amazonaws.com/prod
```

### Step 2: Update frontend/.env.production
```bash
REACT_APP_API_URL=https://abc123def.execute-api.us-east-1.amazonaws.com/prod/api
REACT_APP_ENVIRONMENT=production
```

### Step 3: Update frontend/.env.staging (if using staging)
```bash
REACT_APP_API_URL=https://abc123def.execute-api.us-east-1.amazonaws.com/staging/api
REACT_APP_ENVIRONMENT=staging
```

## Test Your API Gateway URL

### Test with curl

```bash
# Replace with your actual URL
API_URL="https://abc123def.execute-api.us-east-1.amazonaws.com/prod"

# Test registration endpoint
curl -X POST ${API_URL}/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "full_name": "Test User",
    "bank_affiliation": "Test Bank"
  }'

# Expected response:
# {"success": true, "message": "User registered successfully"}
```

### Test with Postman

1. Open Postman
2. Create new POST request
3. URL: `https://abc123def.execute-api.us-east-1.amazonaws.com/prod/api/auth/register`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
```json
{
  "email": "test@example.com",
  "password": "TestPassword123!",
  "full_name": "Test User",
  "bank_affiliation": "Test Bank"
}
```
6. Click Send

## Verify CORS is Configured

If you get a CORS error, you need to configure CORS in API Gateway:

1. Go to AWS Console → API Gateway
2. Select your API
3. Click "Resources" in the left menu
4. Select "/{proxy+}" resource
5. Click "ANY" method
6. Click "Enable CORS"
7. In the popup, add your frontend domain:
   - For Amplify: `https://your-amplify-domain.amplifyapp.com`
   - For custom domain: `https://your-domain.com`
   - For development: `http://localhost:3000`
8. Click "Enable CORS and replace existing CORS headers"
9. Click "Yes, replace existing values"

## Troubleshooting

### URL Not Working
- Verify the URL format: `https://[ID].execute-api.[REGION].amazonaws.com/[STAGE]`
- Check that Lambda functions are deployed
- Check CloudWatch logs for errors

### CORS Errors
- Verify CORS is enabled in API Gateway
- Check that your frontend domain is in the allowed origins
- Try with `*` temporarily to test (not recommended for production)

### 404 Errors
- Verify the endpoint path is correct
- Check that the Lambda function is deployed
- Verify API Gateway routes are configured

### 500 Errors
- Check CloudWatch logs: `aws logs tail /aws/lambda/jaiib-auth-lambda --follow`
- Verify DynamoDB tables exist
- Check Lambda IAM role has permissions

## Save Your URL

Once you have your API Gateway URL, save it somewhere safe:

```
API Gateway URL: https://abc123def.execute-api.us-east-1.amazonaws.com/prod
Region: us-east-1
Stage: prod
```

You'll need this for:
- Frontend environment variables
- Testing API endpoints
- Configuring CORS
- Monitoring and debugging

---

**Next Step**: Update your frontend environment variables and deploy!
