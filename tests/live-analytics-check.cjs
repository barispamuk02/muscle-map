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
    const network = [];
    page.on('requestfailed', r => { if (r.url().includes('posthog')) network.push({kind:'failed',host:new URL(r.url()).host,path:new URL(r.url()).pathname,error:r.failure()?.errorText}); });
    page.on('response', r => {if (r.url().includes('posthog')) network.push({kind:'response',host:new URL(r.url()).host,path:new URL(r.url()).pathname,status:r.status()});});
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
    const diagnostic = await page.evaluate(() => {
      const p = window.posthog;
      const sent = p.capture('mm_analytics_smoke_check', { source: 'ci_qa', synthetic_test: true }, {send_instantly:true});
      return {optedOut:typeof p.has_opted_out_capturing === 'function' ? p.has_opted_out_capturing() : null, distinctId:!!p.get_distinct_id(), initialized: !!p.__loaded, sentType:typeof sent, disabled: !!p.config.opt_out_capturing_by_default, persistence:p.config.persistence, blocked:navigator.globalPrivacyControl === true || navigator.doNotTrack === '1'};
    });
    await page.waitForTimeout(14000);
    console.log('POSTHOG_DIAGNOSTIC', JSON.stringify({diagnostic, network:network.slice(-18),posts:requests.length,errors:errors.slice(-5)}));
    assert.ok(requests.length > 0, 'Browser must submit PostHog event requests');
    console.log('POSTHOG_PRODUCTION_BROWSER_OK', JSON.stringify({ status: response.status(), sdk: status, ingestionRequests: requests.length, jsErrors: errors.length }));
  } finally {
    await browser.close();
  }
})().catch(e => { console.error('POSTHOG_LIVE_SMOKE_FAILED', e); process.exitCode = 1; });