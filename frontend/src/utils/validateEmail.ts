/**
 * Email validation mirroring the backend (backend/auth/lambda_function.py).
 * The backend remains the source of truth; this gives immediate inline
 * feedback and blocks obvious junk before submit (issue #55).
 */

// RFC-5322-inspired practical regex: local part, domain labels, 2+ letter TLD.
const EMAIL_REGEX =
  /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

// Disposable / throwaway domains (kept in sync with the backend list).
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.info', 'grr.la',
  '10minutemail.com', '10minutemail.net', 'yopmail.com', 'yopmail.net',
  'tempmail.com', 'temp-mail.org', 'trashmail.com', 'trashmail.net',
  'getnada.com', 'nada.email', 'dispostable.com', 'fakeinbox.com',
  'maildrop.cc', 'mailnesia.com', 'sharklasers.com', 'throwawaymail.com',
  'mytemp.email', 'mohmal.com', 'emailondeck.com', 'moakt.com',
  'tempmailo.com', 'mailcatch.com', 'spam4.me', 'discard.email',
]);

// Obvious placeholder / test domains.
const PLACEHOLDER_DOMAINS = new Set([
  'test.com', 'example.com', 'example.org', 'example.net', 'mail.com',
  'email.com', 'domain.com', 'test.test', 'foo.com', 'bar.com',
  'abc.com', 'xyz.com', 'sample.com', 'demo.com', 'localhost',
]);

/**
 * Returns null when the email is valid, otherwise a user-facing error string.
 */
export function validateEmail(rawEmail: string): string | null {
  const email = (rawEmail || '').trim();
  if (!email) return 'Email is required';
  if (email.length > 254) return 'Please enter a valid email address';
  if (!EMAIL_REGEX.test(email)) return 'Please enter a valid email address';

  const atIndex = email.lastIndexOf('@');
  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1).toLowerCase();

  // Single-char local part (a@, x@ …) is a strong throwaway signal.
  if (local.length < 2) return 'Please enter a valid email address';

  if (DISPOSABLE_DOMAINS.has(domain)) return 'Disposable email addresses are not allowed';
  if (PLACEHOLDER_DOMAINS.has(domain)) return 'Please use a real email address';

  return null;
}
