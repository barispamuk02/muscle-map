'use strict';
const { chromium } = require('playwright');
const { randomUUID } = require('node:crypto');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const assert = require('node:assert/strict');
const { jwtVerify, createRemoteJWKSet } = require('jose');

const root = path.resolve(__dirname, '..');
const staticFiles = new Set(['account.html','account.js','account.css','account-config.js','index.html']);
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8' };
const server = http.createServer((req,res) => {
    const name = decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\//,'') || 'account.html';
    if (!staticFiles.has(name)) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type',mime[path.extname(name)]);
    fs.createReadStream(path.join(root,name)).pipe(res);
});
const mobile = process.env.MOBILE_ACCOUNT === 'true';
async function run() {
    const port = 8000;
    await new Promise(resolve => server.listen(port,'127.0.0.1',resolve));
    const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
    try {
        const context = await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1280,height:820},isMobile:mobile,hasTouch:mobile});
        const page = await context.newPage();
        const errors=[];
        page.on('pageerror',e=>errors.push(e.message));
        await page.goto('http://localhost:'+port+'/account.html',{waitUntil:'domcontentloaded'});
        const message = page.locator('#accountMessage');
        const email = 'mm-staging-' + randomUUID().slice(0,12) + '@example.com';
        const pass = 'Stage!'+randomUUID()+'a1';
        await page.locator('#tabRegister').click();
        await page.locator('#accountName').fill('Staging Browser Test');
        await page.locator('#accountEmail').fill(email);
        await page.locator('#accountPassword').fill(pass);
        await page.locator('#authSubmit').click();
        // Managed Better Auth can either auto-sign-in or require an explicit login.
        await page.waitForFunction(() =>
            !document.querySelector('#accountMember') &&
            (document.querySelector('#authMember')?.classList.contains('hidden') === false ||
             document.querySelector('#accountMessage')?.textContent?.includes('Аккаунт создан') ||
             document.querySelector('#accountMessage')?.classList.contains('error')),
             { timeout:30000 });
        const error = await message.evaluate(el=>el.classList.contains('error')?el.textContent:'');
        if (error) throw Error('Sign up failed: '+error);
        if (await page.locator('#authMember').isHidden()) {
            await page.locator('#tabLogin').click();
            await page.locator('#accountEmail').fill(email);
            await page.locator('#accountPassword').fill(pass);
            await page.locator('#authSubmit').click();
        }
        await page.locator('#authMember').waitFor({state:'visible',timeout:20000});
        assert.match(await page.locator('#accountIdentity').textContent(),/mm-staging-/);
        assert.match(await page.locator('#accountPremium').textContent(),/Проверка подписки|Subscription status/);
        await page.reload({waitUntil:'domcontentloaded'});
        await page.locator('#authMember').waitFor({state:'visible',timeout:15000});
        await page.locator('#authLogout').click();
        await page.locator('#authGuest').waitFor({state:'visible'});
        await page.locator('#accountEmail').fill(email);
        await page.locator('#accountPassword').fill(pass);
        await page.locator('#authSubmit').click();
        await page.locator('#authMember').waitFor({state:'visible',timeout:15000});
        // Confirm the signed short-lived Neon JWT can be used by our backend.
        const jwtData = await page.evaluate(async () => {
            const authUrl = window.MUSCLE_MAP_ACCOUNT_CONFIG.authUrl;
            const response = await fetch(authUrl + '/token', { credentials:'include', cache:'no-store' });
            const json = await response.json().catch(() => ({}));
            return { status:response.status, token:json.token || null };
        });
        assert.equal(jwtData.status,200,'Managed Neon Auth token endpoint must be available');
        assert.ok(jwtData.token,'Managed Neon Auth did not return a signed JWT');
        const authUrl = 'https://ep-summer-recipe-b1qi9f29.neonauth.c-5.eu-central-1.aws.neon.tech/neondb/auth';
        const { payload, protectedHeader } = await jwtVerify(
            jwtData.token,
            createRemoteJWKSet(new URL(authUrl + '/.well-known/jwks.json')),
            { issuer:new URL(authUrl).origin, algorithms:['EdDSA'] }
        );
        assert.ok(typeof payload.sub === 'string' && payload.sub.length > 3);
        assert.equal(protectedHeader.alg,'EdDSA');
        console.log('STAGING_NEON_SIGNED_JWT_EDDSA_VERIFIED_OK');
        assert.deepEqual(errors,[], 'No runtime errors expected');
        console.log('STAGING_NEON_AUTH_SIGNUP_LOGIN_LOGOUT_RELOGIN_OK',mobile?'mobile':'desktop');
        await context.close();
    } finally { await browser.close();await new Promise(resolve=>server.close(resolve)); }
}
run().catch(e=>{console.error('STAGING_NEON_AUTH_E2E_FAILED',e);server.close();process.exitCode=1;});
