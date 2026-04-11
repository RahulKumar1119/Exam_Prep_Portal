# API Gateway Configuration

## Overview

API Gateway provides the REST API interface for the JAIIB-CAIIB Portal with CORS, rate limiting, and request validation.

## Endpoint Configuration

### Base URL

```
https://{api-id}.execute-api.ap-south-1.amazonaws.com/prod
```

### Resources

#### 1. Authentication (`/auth`)

**Methods**: POST

**Purpose**: User registration, login, email verification, password reset

**CORS**: Enabled for all origins

#### 2. Practice (`/practice`)

**Methods**: POST, GET

**Purpose**: Generate practice sets, submit answers, retrieve results

**CORS**: Enabled for all origins

#### 3. Dashboard (`/dashboard`)

**Methods**: GET

**Purpose**: Retrieve performance metrics and analytics

**CORS**: Enabled for all origins

## CORS Configuration

**Allowed Origins**: `*` (all origins)

**Allowed Methods**:
- GET
- POST
- PUT
- DELETE
- PATCH
- OPTIONS

**Allowed Headers**:
- `Content-Type`
- `Authorization`
- `X-Amz-Date`
- `X-Api-Key`
- `X-Amz-Security-Token`

**Max Age**: 1 day (86400 seconds)

## Rate Limiting

### Implementation

Rate limiting is implemented at the API Gateway level using Usage Plans and API Keys.

### Configuration

- **Rate Limit**: 100 requests per minute per user
- **Burst Limit**: 200 requests per second
- **Throttle Settings**: Enabled

### API Key Management

1. Create API Key in AWS Console
2. Associate with Usage Plan
3. Distribute to clients
4. Monitor usage in CloudWatch

## Request Validation

### Enabled Validations

- **Request Body Validation**: Enabled
- **Request Parameter Validation**: Enabled

### Validation Rules

All requests must include:
- Valid `Content-Type` header
- Valid request body (if applicable)
- Valid path parameters
- Valid query parameters

### Error Responses

**400 Bad Request**: Invalid request format

```json
{
  "message": "Invalid request body",
  "type": "BadRequest"
}
```

**401 Unauthorized**: Missing or invalid authentication

```json
{
  "message": "Unauthorized",
  "type": "Unauthorized"
}
```

**429 Too Many Requests**: Rate limit exceeded

```json
{
  "message": "Rate limit exceeded",
  "type": "TooManyRequests"
}
```

## Security Headers

### Implemented Headers

- **X-Content-Type-Options**: `nosniff`
- **X-Frame-Options**: `DENY`
- **X-XSS-Protection**: `1; mode=block`
- **Strict-Transport-Security**: `max-age=31536000; includeSubDomains`

## Endpoint Details

### Authentication Endpoints

```
POST /auth/register
POST /auth/login
POST /auth/verify-email
POST /auth/logout
POST /auth/refresh-token
POST /auth/password-reset-request
POST /auth/password-reset
```

### Practice Endpoints

```
POST /practice/generate
POST /practice/submit
GET /practice/session/{session_id}
GET /practice/results/{session_id}
```

### Dashboard Endpoints

```
GET /dashboard/performance
GET /dashboard/analytics
GET /dashboard/audit-logs
```

### Question Bank Endpoints

```
POST /questions/create
PUT /questions/{question_id}
GET /questions/search
POST /questions/version/publish
POST /questions/version/rollback
```

## Monitoring

### CloudWatch Metrics

- **Count**: Number of API calls
- **4XXError**: Client errors
- **5XXError**: Server errors
- **Latency**: Response time in milliseconds
- **IntegrationLatency**: Backend response time

### CloudWatch Alarms

- **High Error Rate**: Alert when 4XX/5XX errors exceed 1%
- **High Latency**: Alert when response time exceeds 500ms
- **Throttling**: Alert when requests are throttled

## Deployment

### Deploy API

```bash
cdk deploy
```

### Update API

```bash
cdk deploy --require-approval=change-only
```

### Delete API

```bash
cdk destroy
```

## Testing

### Using cURL

```bash
# Register user
curl -X POST https://{api-id}.execute-api.ap-south-1.amazonaws.com/prod/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "full_name": "John Doe",
    "bank_affiliation": "HDFC Bank"
  }'

# Generate practice set
curl -X POST https://{api-id}.execute-api.ap-south-1.amazonaws.com/prod/practice/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "paper_name": "IE & IFS"
  }'
```

### Using Postman

1. Import API Gateway endpoint
2. Set up environment variables
3. Create requests for each endpoint
4. Test with various payloads

## Troubleshooting

### CORS Errors

If you see CORS errors in browser console:

1. Verify CORS configuration in CDK stack
2. Check allowed origins and methods
3. Verify request headers match allowed headers

### Rate Limiting

If requests are throttled:

1. Check API key usage in CloudWatch
2. Verify rate limit configuration
3. Consider increasing limits if needed

### 5XX Errors

If backend returns 5XX errors:

1. Check Lambda function logs in CloudWatch
2. Verify DynamoDB table access
3. Check KMS key permissions

## Related Resources

- [API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)
- [API Gateway CORS](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html)
- [API Gateway Rate Limiting](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html)
- [API Gateway Request Validation](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-validation.html)
