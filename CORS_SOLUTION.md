# CORS Solution - Complete Guide

## Issue

Frontend getting CORS errors when calling API Gateway:
```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at 
https://gf3qqozf2l.execute-api.ap-south-1.amazonaws.com/prod/auth/register. 
(Reason: CORS header 'Access-Control-Allow-Origin' missing). Status code: 403.
```

## Quick Fix

### Run this command:
```bash
bash enable-cors-simple.sh
```

This will:
1. ✓ Add OPTIONS method to all API resources
2. ✓ Configure CORS headers
3. ✓ Deploy the API

### Then verify:
```bash
bash verify-cors.sh
```

## What Was Done

### 1. Lambda Functions Already Have CORS Headers
All Lambda functions return CORS headers in their responses:
```python
'headers': {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
}
```

### 2. API Gateway Needs OPTIONS Method
API Gateway requires:
- OPTIONS method on each resource for preflight requests
- Mock integration that returns CORS headers
- Deployment to activate changes

### 3. CORS Headers Required
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token
```

## API Endpoint

```
https://gf3qqozf2l.execute-api.ap-south-1.amazonaws.com/prod
```

## Frontend Configuration

Update your API client to use the correct endpoint:

```typescript
// frontend/src/api/client.ts
import axios from 'axios';

const API_BASE_URL = 'https://gf3qqozf2l.execute-api.ap-south-1.amazonaws.com/prod';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Example usage
export const registerUser = (email: string, password: string, fullName: string) => {
  return apiClient.post('/auth/register', {
    email,
    password,
    full_name: fullName,
  });
};

export const loginUser = (email: string, password: string) => {
  return apiClient.post('/auth/login', {
    email,
    password,
  });
};
```

## Testing

### Test 1: OPTIONS Preflight
```bash
curl -X OPTIONS https://gf3qqozf2l.execute-api.ap-south-1.amazonaws.com/prod/auth/register \
  -H "Origin: https://jaiib-portal.amplifyapp.com" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

Expected response:
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token
```

### Test 2: POST Request
```bash
curl -X POST https://gf3qqozf2l.execute-api.ap-south-1.amazonaws.com/prod/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "full_name": "Test User"
  }'
```

### Test 3: From Browser Console
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
   ```
   Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   ```

2. **Check API Gateway stage**
   ```bash
   aws apigateway get-stage --rest-api-id gf3qqozf2l --stage-name prod --region ap-south-1
   ```

3. **Re-run CORS configuration**
   ```bash
   bash enable-cors-simple.sh
   ```

4. **Check CloudWatch logs**
   ```bash
   aws logs tail /aws/lambda/jaiib-auth --region ap-south-1 --follow
   ```

### 403 Forbidden

Usually means API hasn't been deployed. Run:
```bash
bash enable-cors-simple.sh
```

### 404 Not Found

Resource doesn't exist. Check:
```bash
aws apigateway get-resources --rest-api-id gf3qqozf2l --region ap-south-1
```

## Available Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login user |
| POST | /auth/verify-email | Verify email |
| POST | /auth/password-reset-request | Request password reset |
| POST | /auth/password-reset | Reset password |
| POST | /practice/generate | Generate practice set |
| POST | /practice/submit | Submit practice answers |
| GET | /questions | Get questions |
| POST | /questions | Create question |
| POST | /ai/explain | Get AI explanation |
| POST | /audit/logs | Log audit event |
| GET | /audit/logs | Get audit logs |
| POST | /notifications | Create notification |
| GET | /notifications | Get notifications |

## Files

- `enable-cors-simple.sh` - Enable CORS on API Gateway
- `verify-cors.sh` - Verify CORS configuration
- `CORS_FIX.md` - Detailed CORS documentation
- `CORS_SOLUTION.md` - This file

## Next Steps

1. Run CORS configuration: `bash enable-cors-simple.sh`
2. Verify CORS: `bash verify-cors.sh`
3. Update frontend API endpoint
4. Test authentication flow
5. Monitor CloudWatch logs

---

**Status**: CORS configuration ready
**API Endpoint**: https://gf3qqozf2l.execute-api.ap-south-1.amazonaws.com/prod
**Last Updated**: 2026-04-12
