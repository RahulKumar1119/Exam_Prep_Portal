#!/usr/bin/env node
/**
 * Pre-rendering script for SEO.
 * Uses puppeteer to crawl the built app and save static HTML.
 * This replaces react-snap with a more reliable approach for Amplify.
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const buildDir = path.resolve(__dirname, '..', 'build');

// Pages to pre-render
const PAGES = [
  '/',
  '/practice-tests',
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
  '/login',
  '/register',
  '/privacy-policy',
  '/terms-of-service',
];

async function prerender() {
  const puppeteer = require('puppeteer');
  const handler = require('serve-handler');
  const http = require('http');

  // Start a local server to serve the build
  const server = http.createServer((req, res) => {
    return handler(req, res, {
      public: buildDir,
      rewrites: [{ source: '**', destination: '/index.html' }],
    });
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

    // Wait a bit for React to fully render
    await page.waitForTimeout(1000);

    const html = await page.content();

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
