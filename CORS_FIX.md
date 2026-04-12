# CORS Configuration Fix

## Problem

Frontend is getting CORS errors when trying to call the API:
```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at 
https://gf3qqozf2l.execute-api.ap-south-1.amazonaws.com/prod/auth/register. 
(Reason: CORS header 'Access-Control-Allow-Origin' missing). Status code: 403.
```

## Root Cause

API Gateway needs to be configured to:
1. Accept OPTIONS preflight requests
2. Return CORS headers in responses
3. Be deployed to make changes take effect

## Solution

### Step 1: Enable CORS on API Gateway

Run the simple CORS enablement script:
```bash
bash enable-cors-simple.sh
```

This script:
- Adds OPTIONS method to all API resources
- Configures mock integration for OPTIONS
- Sets CORS response headers
- Deploys the API

### Step 2: Verify Lambda Functions Have CORS Headers

All Lambda functions already include CORS headers in their responses:

```python
def success_response(status_code: int, data: Dict[str, Any]) -> Dict[str, Any]:
    return {
        'statusCode': status_code,
        'body': json.dumps(data),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'  # ← CORS header
        }
    }
```

### Step 3: Test CORS

After running the script, test with curl:
```bash
curl -X OPTIONS https://gf3qqozf2l.execute-api.ap-south-1.amazonaws.com/prod/auth/register \
  -H "Origin: https://jaiib-portal.amplifyapp.com" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

You should see:
```
< HTTP/1.1 200 OK
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
< Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token
```

### Step 4: Update Frontend API Endpoint

Make sure your frontend is using the correct API endpoint:
```
https://gf3qqozf2l.execute-api.ap-south-1.amazonaws.com/prod
```

## CORS Headers Explained

| Header | Purpose |
|--------|---------|
| `Access-Control-Allow-Origin: *` | Allow requests from any origin |
| `Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS` | Allow these HTTP methods |
| `Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token` | Allow these request headers |

## API Resources Configured

The following resources have CORS enabled:
- `/auth/verify-email`
- `/auth/login`
- `/auth/register`
- `/auth/reset-password`
- `/audit/logs`
- `/audit`
- `/questions`
- `/questions/update`
- `/ai/explain`
- `/ai`
- `/practice/session`
- And all other resources

## Frontend Configuration

Update your frontend API client to use the correct endpoint:

```typescript
// frontend/src/api/client.ts
const API_BASE_URL = 'https://gf3qqozf2l.execute-api.ap-south-1.amazonaws.com/prod';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## Testing the Fix

### 1. Test Registration
```bash
curl -X POST https://gf3qqozf2l.execute-api.ap-south-1.amazonaws.com/prod/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "full_name": "Test User"
  }'
```

### 2. Test from Browser Console
```javascript
fetch('https://gf3qqozf2l.execute-api.ap-south-1.amazonaws.com/prod/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'TestPass123!',
    full_name: 'Test User'
  })
})
.then(r => r.json())
.then(d => console.log(d))
.catch(e => console.error(e));
```

## Troubleshooting

### Still Getting CORS Errors?

1. **Clear browser cache**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

2. **Check API Gateway deployment**
   ```bash
   aws apigateway get-stage --rest-api-id gf3qqozf2l --stage-name prod --region ap-south-1
   ```

3. **Verify OPTIONS method exists**
   ```bash
   aws apigateway get-method --rest-api-id gf3qqozf2l --resource-id <resource-id> --http-method OPTIONS --region ap-south-1
   ```

4. **Check CloudWatch logs**
   ```bash
   aws logs tail /aws/lambda/jaiib-auth --region ap-south-1 --follow
   ```

### 403 Forbidden Error

This usually means:
- API Gateway doesn't have the resource/method configured
- Lambda function doesn't have permission to be invoked
- API hasn't been deployed after configuration changes

**Solution**: Run the CORS script again and wait for deployment to complete.

## API Endpoint

**Base URL**: `https://gf3qqozf2l.execute-api.ap-south-1.amazonaws.com/prod`

**Available Endpoints**:
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/verify-email` - Verify email
- `POST /auth/password-reset-request` - Request password reset
- `POST /auth/password-reset` - Reset password
- `POST /practice/generate` - Generate practice set
- `POST /practice/submit` - Submit practice answers
- `GET /questions` - Get questions
- `POST /questions` - Create question
- `POST /ai/explain` - Get AI explanation
- `POST /audit/logs` - Log audit event
- `GET /audit/logs` - Get audit logs
- `POST /notifications` - Create notification
- `GET /notifications` - Get notifications

## Next Steps

1. Run CORS configuration script
2. Test API endpoints
3. Update frontend with correct API endpoint
4. Test authentication flow from frontend
5. Monitor CloudWatch logs for errors

---

**Status**: CORS configuration ready
**API Endpoint**: https://gf3qqozf2l.execute-api.ap-south-1.amazonaws.com/prod
**Last Updated**: 2026-04-12
