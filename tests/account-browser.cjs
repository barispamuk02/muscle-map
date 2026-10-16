'use strict';
// This suite tests OTP UX with MOCKED provider responses. It must not send
// automated e-mail to unowned inboxes. Live Neon JWT auth was covered in
// GitHub Actions run 38838495017 before required email verification.
const { chromium } = require('playwright');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const allow = new Set(['account.html','account.js','account.css','account-config.js','index.html']);
const mime = {'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
const server = http.createServer((req, res) => {
    const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\//, '') || 'account.html';
    if (!allow.has(name)) return res.writeHead(404).end();
    res.setHeader('Content-Type', mime[path.extname(name)]);
    fs.createReadStream(path.join(root, name)).pipe(res);
});
const mobile = process.env.MOBILE_ACCOUNT === 'true';

async function run() {
    await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
    const origin = 'http://localhost:' + server.address().port;
    const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
    try {
        const context = await browser.newContext({
            viewport: mobile ? {width:390,height:844} : {width:1280,height:820},
            isMobile:mobile,hasTouch:mobile,locale:'ru-RU'
        });
        const page = await context.newPage();
        const errors=[];
        page.on('pageerror', err => errors.push(err.message));
        let verified=false, signedIn=false, sent=0, userEmail='', premiumRequests=0, mailTestRequests=0, recoveryRequests=0, passwordReset=false;
        // Intercept staging config only inside this test. Real staging UI still
        // defaults to no API connection and contains no production endpoint.
        await page.route('**/account-config.js', async route => {
            // This regression deliberately simulates STAGING while the
            // release branch itself publishes PRODUCTION account-config.js.
            // Never substitute the actual release config in a staging mock.
            const original = "window.MUSCLE_MAP_ACCOUNT_CONFIG = Object.freeze({"
                + "stage:'staging',"
                + "authUrl:'https://ep-summer-recipe-b1qi9f29.neonauth.c-5.eu-central-1.aws.neon.tech/neondb/auth',"
                + "apiUrl:'https://muscle-map-backend-staging.onrender.com',"
                + "emailVerificationRequired:true,enableBackendPremium:true"
                + "});";
            await route.fulfill({status:200,contentType:'application/javascript',body:original});
        });
        await page.route('**/api/staging/me/mail-test',async route=>{
            mailTestRequests++;
            assert.equal(route.request().method(),'POST');
            assert.equal(route.request().headers().authorization,'Bearer ui-only-test-token');
            assert.equal(route.request().postData(),null,'recipient must never be browser-supplied');
            await route.fulfill({status:202,contentType:'application/json',
                body:JSON.stringify({ok:true,message:'test email accepted'})});
        });
        await page.route('**/api/v2/me/premium', async route => {
            premiumRequests++;
            assert.equal(route.request().headers().authorization,'Bearer ui-only-test-token');
            await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({
                premium:false,expiresAt:null
            })});
        });
        await page.route('**/neondb/auth/**',async route => {
            const request = route.request();
            const suffix = new URL(request.url()).pathname.split('/neondb/auth')[1];
            const method = request.method();
            const headers={
                'Access-Control-Allow-Origin':origin,
                'Access-Control-Allow-Credentials':'true',
                'Access-Control-Allow-Headers':'content-type',
                'Access-Control-Allow-Methods':'GET,POST,OPTIONS',
                'Content-Type':'application/json'
            };
            if (method==='OPTIONS') return route.fulfill({status:204,headers,body:''});
            const data = method==='POST' ? request.postDataJSON() : {};
            let result={}, status=200;
            if (suffix==='/get-session') {
                result=signedIn ? {user:{id:'test-id',email:userEmail,emailVerified:verified},session:{id:'test-session'}} : null;
            } else if (suffix==='/sign-up/email') {
                userEmail=data.email; verified=false; signedIn=false;
                result={user:{id:'test-id',email:userEmail},token:null};
            } else if (suffix==='/email-otp/send-verification-otp') {
                assert.equal(data.type,'email-verification');
                assert.equal(data.email,userEmail);
                sent++;
                result={success:true};
            } else if (suffix==='/email-otp/verify-email') {
                if (data.otp !== '123456') {
                    status=400;result={code:'INVALID_OTP'};
                } else {
                    verified=true;result={status:true};
                }
            } else if (suffix==='/email-otp/request-password-reset') {
                assert.equal(data.email,userEmail);
                recoveryRequests++;
                result={success:true};
            } else if (suffix==='/email-otp/reset-password') {
                assert.equal(data.email,userEmail);
                if (data.otp!=='654321') {
                    status=400;result={code:'INVALID_OTP'};
                } else {
                    assert.ok(data.password.length>=12);
                    passwordReset=true;result={success:true};
                }
            } else if (suffix==='/sign-in/email') {
                if (!verified) {status=403;result={code:'EMAIL_NOT_VERIFIED'};}
                else {signedIn=true;result={user:{id:'test-id',email:userEmail}};}
            } else if (suffix==='/token') {
                assert.equal(signedIn,true);
                result={token:'ui-only-test-token'};
            } else if (suffix==='/sign-out') {
                signedIn=false;result={success:true};
            } else {
                status=404;result={error:'unexpected mocked route '+suffix};
            }
            return route.fulfill({status,headers,body:JSON.stringify(result)});
        });
        await page.goto(origin+'/account.html',{waitUntil:'domcontentloaded'});
        await page.locator('#tabRegister').click();
        await page.locator('#accountName').fill('Test OTP Account');
        await page.locator('#accountEmail').fill('test-otp@example.test');
        await page.locator('#accountPassword').fill('TestOTP!12345');
        await page.locator('#authSubmit').click();
        await page.locator('#authVerify').waitFor({state:'visible'});
        assert.equal(sent,0,'client must not silently rotate any sign-up OTP');
        await page.locator('#verifyResend').click();
        await page.waitForFunction(() => document.querySelector('#accountMessage')?.textContent?.includes('Новый код запрошен'));
        assert.equal(sent,1,'explicit resend generates one OTP');
        assert.ok(await page.locator('#authGuest').isHidden());
        await page.locator('#verifyOtp').fill('000000');
        await page.locator('#verifySubmit').click();
        await page.waitForFunction(() => document.querySelector('#accountMessage')?.classList.contains('error'));
        assert.match(await page.locator('#accountMessage').textContent(),/INVALID_OTP/);
        assert.equal(verified,false);
        assert.ok(await page.locator('#authVerify').isVisible());
        await page.locator('#verifyOtp').fill('123456');
        await page.locator('#verifySubmit').click();
        await page.locator('#authGuest').waitFor({state:'visible'});
        assert.equal(verified,true);
        await page.locator('#accountPassword').fill('TestOTP!12345');
        await page.locator('#authSubmit').click();
        await page.locator('#authMember').waitFor({state:'visible'});
        await page.locator('#accountPremium').getByText('Premium не активен').waitFor({timeout:10000});
        await page.locator('#stagingMailTest').click();
        await page.waitForFunction(()=>document.querySelector('#accountMessage')?.textContent?.includes('Тестовое письмо принято'));
        assert.equal(mailTestRequests,1,'exactly one authenticated staging mail-test call');
        assert.ok(premiumRequests>0,'must call protected Premium read with bearer token');
        await page.reload({waitUntil:'domcontentloaded'});
        await page.locator('#authMember').waitFor({state:'visible'});
        await page.locator('#authLogout').click();
        await page.locator('#authGuest').waitFor({state:'visible'});
        assert.equal(signedIn,false);
        assert.ok(premiumRequests>=2,'must recheck Premium on session restore');

        // Real user-facing recovery (fully mocked, never emails anyone).
        await page.locator('#authOpenRecovery').click();
        await page.locator('#authRecovery').waitFor({state:'visible'});
        await page.locator('#recoveryEmail').fill(userEmail);
        await page.locator('#recoveryRequestSubmit').click();
        await page.locator('#recoveryFinishForm').waitFor({state:'visible'});
        assert.equal(recoveryRequests,1);
        await page.locator('#recoveryOtp').fill('000000');
        await page.locator('#recoveryPassword').fill('Recovered-password12345');
        await page.locator('#recoveryRepeatPassword').fill('Recovered-password12345');
        await page.locator('#recoveryResetSubmit').click();
        await page.waitForFunction(()=>
            document.querySelector('#accountMessage')?.textContent?.includes('Не удалось изменить пароль'));
        assert.equal(passwordReset,false);
        await page.locator('#recoveryOtp').fill('654321');
        await page.locator('#recoveryPassword').fill('Recovered-password12345');
        await page.locator('#recoveryRepeatPassword').fill('Recovered-password12345');
        await page.locator('#recoveryResetSubmit').click();
        await page.locator('#authGuest').waitFor({state:'visible'});
        assert.equal(passwordReset,true);
        assert.equal(recoveryRequests,1,'reset code should not be silently resent');
        assert.deepEqual(errors,[]);
        console.log('MOCKED_STAGING_OTP_SIGNUP_INVALID_CODE_VERIFIED_LOGIN_LOGOUT_OK',mobile?'mobile':'desktop');
        await context.close();
    } finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
}
run().catch(error => {console.error('STAGING_OTP_UI_TEST_FAILED',error);server.close();process.exitCode=1;});
