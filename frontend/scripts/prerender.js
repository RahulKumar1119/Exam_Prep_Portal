#!/usr/bin/env node
/**
 * Pre-rendering script for SEO.
 * Uses puppeteer to crawl the built app and save static HTML.
 * This replaces react-snap with a more reliable approach for Amplify.
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const buildDir = path.resolve(__dirname, '..', 'dist');

// Pages to pre-render
const PAGES = [
  '/',
  '/practice-tests',
  '/exams',
  '/ai-300-practice-test',
  '/capm-practice-test',  '/study-topics',
  '/practice-tests/ie-ifs',
  '/practice-tests/ppb',
  '/practice-tests/afm',
  '/practice-tests/rbwm',
  '/blog',
  '/blog/how-to-clear-ie-ifs-first-attempt',
  '/blog/important-rbi-circulars-ppb-2026',
  '/blog/jaiib-updated-syllabus-passing-criteria-2026',
  '/blog/jaiib-afm-formulas-list-2026',
  '/blog/jaiib-vs-caiib-difference-salary-benefits',
  '/blog/how-to-pass-jaiib-in-15-days',
  '/blog/rbi-crr-slr-repo-rate-current-2026',
  '/blog/ppb-important-topics-module-wise-2026',
  '/blog/ai-300-preparation-guide-2026',
  '/blog/capm-exam-complete-guide-2026',
  '/blog/jaiib-exam-day-tips-dos-donts',
  '/blog/jaiib-rbwm-preparation-guide-2026',
  '/blog/jaiib-registration-process-fees-2026',
  '/blog/npa-classification-sarfaesi-act-explained',
  '/blog/time-value-of-money-solved-examples-jaiib',
  '/free-quiz/ie-ifs',
  '/free-quiz/ppb',
  '/free-quiz/afm',
  '/free-quiz/rbwm',
  '/contact',
  '/about',
  '/faq',
  '/disclaimer',
  '/jaiib/ppb/crr-explained',
  '/jaiib/ppb/npa-classification',
  '/jaiib/ppb/priority-sector-lending',
  '/jaiib/afm/npv-irr-explained',
  '/jaiib/ppb/sarfaesi-act',
  '/jaiib/ppb/slr-explained',
  '/jaiib/ppb/kyc-norms',
  '/jaiib/ppb/negotiable-instruments-act',
  '/jaiib/ppb/basel-norms',
  '/jaiib/ppb/deposit-insurance-dicgc',
  '/jaiib/ppb/repo-rate-explained',
  '/jaiib/afm/break-even-analysis',
  '/jaiib/afm/depreciation-methods',
  '/jaiib/afm/ratio-analysis',
  '/jaiib/rbwm/mutual-funds-guide',
  '/jaiib/ppb/upi-payments-system',
  '/jaiib/rbwm/home-loan-guide',
  '/login',
  '/register',
  '/password-reset',
  '/verify-email',
  '/privacy-policy',
  '/terms-of-service',
  // Protected SPA routes — prerendered as shells so refresh doesn't 404
  // (React will hydrate and check auth from sessionStorage)
  '/practice',
  '/home',
  '/dashboard',
  '/bookmarks',
  '/notifications',
  '/profile',
  '/leaderboard',
  '/previous-attempts',
];

/**
 * Collapse duplicate head tags to a single value so search engines see one
 * canonical/title/og per page. react-helmet-async injects its (correct) tag
 * near the START of <head>, while the static fallback from index.html sits at
 * its original position later — so we keep the FIRST match (Helmet's) and drop
 * the rest.
 */
function dedupeHeadTag(html, regex, keepLast = false) {
  const matches = html.match(regex);
  if (!matches || matches.length <= 1) return html;
  if (!keepLast) {
    const keep = matches[0];
    let seen = false;
    return html.replace(regex, (m) => {
      if (!seen) { seen = true; return keep; }
      return '';
    });
  }
  const keep = matches[matches.length - 1];
  let skipped = 0;
  return html.replace(regex, () => {
    skipped++;
    return skipped === matches.length ? keep : '';
  });
}

async function prerender() {
  const puppeteer = require('puppeteer');
  const handler = require('serve-handler');
  const http = require('http');

  // Start a local server to serve the build.
  // IMPORTANT: the '/' crawl overwrites dist/index.html with landing-rendered
  // HTML (including its <head> SEO tags). If later routes fall back to that
  // file, React hydrates on top of the landing's head tags and every page
  // inherits the homepage canonical/og:url. So navigation requests ALWAYS get
  // the pristine build template captured here, before any crawling happens.
  const pristineTemplate = fs.readFileSync(path.join(buildDir, 'index.html'));
  const server = http.createServer((req, res) => {
    const urlPath = (req.url || '/').split('?')[0];
    const isAsset = /\.[a-z0-9]+$/i.test(urlPath) && !urlPath.endsWith('.html');
    if (!isAsset) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(pristineTemplate);
      return;
    }
    return handler(req, res, { public: buildDir });
  });

  await new Promise((resolve) => server.listen(45678, resolve));
  console.log('Local server started on port 45678');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--single-process',
    ],
  });

  let crawled = 0;
  for (const route of PAGES) {
    const page = await browser.newPage();

    // Block external requests (analytics, ads, etc.)
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const url = req.url();
      if (
        url.includes('googletagmanager') ||
        url.includes('google-analytics') ||
        url.includes('googlesyndication') ||
        url.includes('adsbygoogle')
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    const url = `http://localhost:45678${route}`;
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait a bit for React to fully render (page.waitForTimeout removed in puppeteer 22+)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let html = await page.content();

    // De-duplicate head tags that must be unique for SEO. react-helmet-async
    // can leave more than one <title>/canonical/og:url in the prerendered
    // markup; Google uses the FIRST canonical it sees, so stale duplicates
    // (e.g. a homepage canonical) would make every page look like a dup of "/".
    // Keep only the LAST occurrence of each (Helmet's final, correct value).
    html = dedupeHeadTag(html, /<title>[\s\S]*?<\/title>/gi);
    html = dedupeHeadTag(html, /<link[^>]*rel="canonical"[^>]*>/gi);
    html = dedupeHeadTag(html, /<meta[^>]*property="og:url"[^>]*>/gi);
    html = dedupeHeadTag(html, /<meta[^>]*property="og:title"[^>]*>/gi);
    // Descriptions: the static template ships a generic one and Helmet
    // appends the page-specific one after it — keep the LAST (page-specific).
    html = dedupeHeadTag(html, /<meta[^>]*name="description"[^>]*>/gi, true);
    html = dedupeHeadTag(html, /<meta[^>]*property="og:description"[^>]*>/gi, true);
    html = dedupeHeadTag(html, /<meta[^>]*name="twitter:description"[^>]*>/gi, true);

    // Determine output path
    const outputDir = path.join(buildDir, route === '/' ? '' : route);
    if (route !== '/') {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFile = route === '/'
      ? path.join(buildDir, 'index.html')
      : path.join(outputDir, 'index.html');

    fs.writeFileSync(outputFile, html);
    crawled++;
    console.log(`✅ [${crawled}/${PAGES.length}] ${route}`);

    await page.close();
  }

  await browser.close();
  server.close();
  console.log(`\nDone! Pre-rendered ${crawled} pages.`);
}

prerender().catch((err) => {
  console.error('Pre-rendering failed:', err.message);
  // Don't fail the build — pre-rendering is an optimization, not a requirement
  console.log('Continuing without pre-rendering...');
  process.exit(0);
});
