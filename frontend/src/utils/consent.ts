/**
 * Cookie consent (DPDP Act 2023 / GDPR) + Google Consent Mode v2.
 *
 * choice is stored in localStorage as { analytics, ads, decidedAt }.
 * Tracking scripts (GA4, Google Ads, AdSense) are injected ONLY after
 * the user grants the matching category. Default state is denied.
 */

export interface ConsentChoice {
  analytics: boolean;
  ads: boolean;
  decidedAt: string;
}

const STORAGE_KEY = 'mockmaster_cookie_consent';
export const COOKIE_SETTINGS_EVENT = 'mockmaster:open-cookie-settings';

const GA_ID = 'G-8VGLY6HD39';
const ADS_ID = 'AW-17664283083';
const ADSENSE_CLIENT = 'ca-pub-4438011184531485';

/**
 * App/auth screens have no publisher content — Google bans ads there
 * ("screens without publisher-content"). AdSense only loads on content
 * pages. Analytics/measurement tags are fine everywhere.
 */
const ADS_EXCLUDED_PREFIXES = [
  '/practice',
  '/dashboard',
  '/home',
  '/login',
  '/register',
  '/profile',
  '/bookmarks',
  '/previous-attempts',
  '/leaderboard',
  '/notifications',
  '/admin',
  '/verify-email',
  '/password-reset',
];

export function isContentPage(path: string = window.location.pathname): boolean {
  return !ADS_EXCLUDED_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(prefix + '/')
  );
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function ensureGtagStub(): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };
  }
}

function loadScript(src: string, id: string): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(id)) return;
  const s = document.createElement('script');
  s.id = id;
  s.async = true;
  s.src = src;
  if (src.includes('adsbygoogle')) s.setAttribute('crossorigin', 'anonymous');
  document.head.appendChild(s);
}

export function loadConsent(): ConsentChoice | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentChoice;
    if (typeof parsed.analytics !== 'boolean' || typeof parsed.ads !== 'boolean') return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Apply a choice: persist it, update Consent Mode, inject granted scripts. */
export function saveConsent(choice: Omit<ConsentChoice, 'decidedAt'>): ConsentChoice {
  const full: ConsentChoice = { ...choice, decidedAt: new Date().toISOString() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
  } catch {}
  applyConsent(full);
  return full;
}

export function applyConsent(choice: ConsentChoice): void {
  ensureGtagStub();
  const gtag = window.gtag;
  if (!gtag) return;

  if (choice.analytics) {
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`, 'ga-gtag-js');
    gtag('consent', 'update', { analytics_storage: 'granted' });
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  if (choice.ads) {
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`, 'ga-gtag-js');
    gtag('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    });
    gtag('js', new Date());
    gtag('config', ADS_ID);
    // AdSense only on content pages — never inside the logged-in app.
    if (isContentPage()) {
      loadScript(
        `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`,
        'adsense-js'
      );
    }
  }
}

/** Re-open the banner (footer "Cookie Settings" link). */
export function openCookieSettings(): void {
  window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT));
}
