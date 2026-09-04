# Weak email validation + no enforced verification lets junk/test accounts register

## Problem
Registration accepts obviously invalid / placeholder emails (e.g. `a@mail.com`
was onboarded as a real user), and unverified accounts can exist and be used
without ever confirming ownership of the email.

`validate_email()` only does a minimal structural check:

```python
# backend/auth/lambda_function.py:113
def validate_email(email: str) -> bool:
    """Basic email validation."""
    if not email or '@' not in email:
        return False
    parts = email.split('@')
    if len(parts) != 2:
        return False
    local, domain = parts
    if not local or not domain or '.' not in domain:
        return False
    return True
```

This passes anything shaped like `x@y.z`, so `a@mail.com`, `test@test.com`,
`x@x.co`, etc. all register successfully. Of 26 onboarded users, 11 are
unverified and at least one (`a@mail.com`) is a junk/test address.

## Impact
- Junk/placeholder accounts inflate the user count and pollute analytics,
  leaderboard, and email campaigns (bounces hurt sender reputation).
- No protection against disposable/throwaway domains.
- Verification is not enforced as a gate — unverified users still occupy the
  users table and can attempt login flows.

## Affected code
- `backend/auth/lambda_function.py:113` — `validate_email()` (too permissive)
- `backend/auth/lambda_function.py:281` — `register_user()` validation call
- `backend/auth/lambda_function.py:371` — resend-verification path reuses the
  same weak check
- Frontend registration form (client-side email field) — no strong format check
  before submit

## Proposed changes
1. **Stronger format validation** (backend, authoritative): replace the ad-hoc
   check with a robust RFC-5322-style regex (or a vetted library) validating
   local part, domain labels, and TLD length. Normalize to lowercase/trim
   (already done) before validation.
2. **Block disposable / placeholder domains**: maintain a denylist of common
   throwaway domains (mailinator, guerrillamail, 10minutemail, yopmail, etc.)
   and reject obviously fake domains. Optionally require an MX record lookup for
   the domain at registration.
3. **Enforce verification as a gate**: unverified accounts should not count as
   active users. Options:
   - Block practice/session creation until `email_verified == true`, or
   - Move unverified signups to a pending state with a TTL and purge if not
     verified within N days.
4. **Mirror validation on the frontend** for immediate feedback (still enforce
   on the backend as source of truth).
5. **Clean up existing junk**: remove/quarantine current test accounts
   (e.g. `a@mail.com`) and re-count real users.

## Acceptance criteria
- [ ] `a@mail.com`, `test@test.com`, `x@x`, and disposable-domain emails are
      rejected at registration with a clear error.
- [ ] Valid real-world emails (incl. `+tags`, subdomains) still succeed.
- [ ] Unverified accounts cannot access gated features (or are purged after TTL).
- [ ] Frontend shows an inline format error before submit.
- [ ] Existing junk/test accounts cleaned up.
- [ ] Backend unit tests cover valid + invalid + disposable cases.

## References
- backend/auth/lambda_function.py:113 (`validate_email`)
- backend/auth/lambda_function.py:281 (register), :371 (resend verification)
