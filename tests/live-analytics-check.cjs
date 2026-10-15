'use strict';
const { chromium } = require('playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const context = await browser.newContext({ serviceWorkers: 'block' });
    const page = await context.newPage();
    const requests = [];
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('request', r => {
      if (/^https:\/\/eu\.i\.posthog\.com\//.test(r.url()) && r.method() === 'POST') requests.push(r.url().replace(/\?.*/, ''));
    });
    const response = await page.goto('https://muscle-map.app/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    assert.equal(response.status(), 200, 'Production website HTTP 200');
    await page.waitForFunction(() => !!window.posthog && window.posthog.__loaded === true, { timeout: 30000 });
    const status = await page.evaluate(() => ({
      initialized: !!window.posthog.__loaded,
      eu: window.posthog.config.api_host === 'https://eu.i.posthog.com',
      autoCaptureOff: window.posthog.config.autocapture === false,
      replayDisabled: window.posthog.config.disable_session_recording === true
    }));
    assert.equal(status.initialized, true);
    assert.equal(status.eu, true);
    assert.equal(status.autoCaptureOff, true);
    assert.equal(status.replayDisabled, true);
    await page.evaluate(() => window.posthog.capture('mm_analytics_smoke_check', { source: 'ci_qa', synthetic_test: true }));
    await page.waitForTimeout(14000);
    assert.ok(requests.length > 0, 'Browser must submit PostHog event requests');
    console.log('POSTHOG_PRODUCTION_BROWSER_OK', JSON.stringify({ status: response.status(), sdk: status, ingestionRequests: requests.length, jsErrors: errors.length }));
  } finally {
    await browser.close();
  }
})().catch(e => { console.error('POSTHOG_LIVE_SMOKE_FAILED', e); process.exitCode = 1; });