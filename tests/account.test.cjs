const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('account.html','utf8');
const js = fs.readFileSync('account.js','utf8');
const config = fs.readFileSync('account-config.js','utf8');
const main = fs.readFileSync('index.html','utf8');
const mobile = fs.readFileSync('mobile-home.js','utf8');

test('account navigation and controls are present and safe by default', () => {
    assert.match(main, /href="account\.html"/);
    assert.match(mobile, /\['navAccount', '👤', 'account'\]/);
    for(const id of ['authGuest','authMember','authVerify','authOpenVerify','verifyForm','verifyOtp','verifyResend','authForm','accountEmail',
        'accountPassword','accountName','authLogout','accountMessage','authOpenRecovery',
        'authRecovery','recoveryRequestForm','recoveryFinishForm','recoveryEmail',
        'recoveryOtp','recoveryPassword','recoveryRepeatPassword','recoveryBack']) {
        assert.ok(html.includes('id="' + id + '"'), 'missing #' + id);
    }
    assert.match(html, /robots" content="noindex,nofollow"/);
    assert.match(html, /autocomplete="current-password"/);
    assert.match(html, /role="status"/);
});
test('account UI uses official auth flow endpoints without storing credentials', () => {
    for(const e of ['/sign-up/email','/sign-in/email','/get-session','/sign-out'])
        assert.ok(js.includes(e), 'missing endpoint '+e);
    assert.match(js, /credentials:\s*'include'/);
    assert.match(js, /\/email-otp\/verify-email/);
    assert.match(js, /showVerification\(byId\('accountEmail'\)/);
    assert.match(js, /\/email-otp\/send-verification-otp/);
    assert.doesNotMatch(js, /localStorage\.setItem/);
    assert.doesNotMatch(js, /sessionStorage\.setItem/);
    assert.doesNotMatch(js, /console\.(?:log|debug)\(/);
});
test('staging configuration must not change production payment entitlements', () => {
    assert.match(config, /stage:\s*'staging'/);
    assert.match(config, /enableBackendPremium:\s*true/);
    assert.ok(config.includes("apiUrl: 'https://muscle-map-backend-staging.onrender.com'"));
    assert.ok(!config.includes("apiUrl: 'https://muscle-map-backend.onrender.com'"));
    assert.ok(!js.includes('muscleMap_premium'));
    assert.doesNotMatch(js, /\/api\/checkout/);
    assert.doesNotMatch(html, /<script\s+src="script\.js"/);
});

test('Premium UI separates loading, unavailable and verified paid state', () => {
    assert.match(js, /premiumChecking:'Проверяем Premium/);
    assert.match(js, /premiumError:'Не удалось проверить Premium/);
    assert.match(js, /premiumEl\.textContent = cfg\.enableBackendPremium === true \? t\('premiumChecking'\)/);
    assert.match(js, /if \(!res\.ok\) throw new Error\('Premium status request failed'\)/);
    assert.match(js, /status\.premium === true && date/);
    assert.match(js, /premiumEl\.textContent = t\('premiumError'\)/);
    assert.match(html, /id="legacyPremiumNotice"/);
    assert.match(html, /id="legacyPremiumWarning"/);
    assert.match(js, /if \(active\) for \(const notice of legacyPremiumNotices\) notice\.classList\.add\('hidden'\)/);
});

test('account password reset uses delivered email OTP without browser-stored secrets', () => {
    assert.match(js, /\/email-otp\/request-password-reset/);
    assert.match(js, /\/email-otp\/reset-password/);
    assert.match(js, /password:pass/);
    assert.match(html, /id="recoveryPassword"[^>]+autocomplete="new-password"/);
    assert.doesNotMatch(js, /sessionStorage\.setItem|localStorage\.setItem/);
});
