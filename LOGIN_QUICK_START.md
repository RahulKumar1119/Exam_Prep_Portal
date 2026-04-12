# Quick Start - Frontend Login

## Frontend URL
https://main.d2m93pdjeduz2w.amplifyapp.com/login

## Test Account
- **Email**: rahulgood66@gmail.com
- **Password**: TempPass123!

## How to Login

1. Open: https://main.d2m93pdjeduz2w.amplifyapp.com/login
2. Enter email: `rahulgood66@gmail.com`
3. Enter password: `TempPass123!`
4. Click **Login**
5. You should be redirected to the dashboard

## What Happens Behind the Scenes

1. Frontend sends login request to API Gateway
2. API Gateway routes to Auth Lambda
3. Lambda validates credentials against DynamoDB
4. Lambda returns JWT tokens (access_token + refresh_token)
5. Frontend stores tokens in localStorage
6. Frontend updates AuthContext with user data
7. User is authenticated and redirected to dashboard

## Verify It's Working

### In Browser
1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Local Storage**
4. Look for:
   - `access_token` - Should contain a JWT token
   - `refresh_token` - Should contain a JWT token
   - `user` - Should contain user data as JSON

### In Console
1. Open DevTools (F12)
2. Go to **Console** tab
3. Should see API configuration logs
4. No red error messages

### In Network Tab
1. Open DevTools (F12)
2. Go to **Network** tab
3. Login again
4. Look for POST request to `/auth/login`
5. Response should show HTTP 200 with tokens

## API Endpoint
```
https://gf3qqozf2l.execute-api.ap-south-1.amazonaws.com/prod
```

## Test with curl
```bash
curl -X POST https://gf3qqozf2l.execute-api.ap-south-1.amazonaws.com/prod/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rahulgood66@gmail.com","password":"TempPass123!"}'
```

## Create New Account

1. Go to: https://main.d2m93pdjeduz2w.amplifyapp.com/register
2. Fill in:
   - Full Name: Your Name
   - Email: your@email.com
   - Password: SecurePass123! (must have uppercase, number, 8+ chars)
   - Confirm Password: SecurePass123!
3. Click **Register**
4. Go to login page and login with your new credentials

## Troubleshooting

### "Login failed" error
- Check email and password are correct
- Try with test account first: rahulgood66@gmail.com / TempPass123!

### CORS errors in console
- Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache: DevTools → Application → Clear storage

### No tokens in localStorage
- Check browser console for errors
- Check Network tab for API response
- Verify API endpoint is correct

### Still having issues?
- Check CloudWatch logs: `aws logs tail /aws/lambda/jaiib-auth --follow --region ap-south-1`
- Test API directly with curl command above
- Verify DynamoDB has user data

---

**Status**: ✓ Login fully functional
**Frontend**: https://main.d2m93pdjeduz2w.amplifyapp.com
**API**: https://gf3qqozf2l.execute-api.ap-south-1.amazonaws.com/prod

