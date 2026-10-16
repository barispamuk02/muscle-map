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
        'accountPassword','accountName','authLogout','accountMessage']) {
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
    assert.match(config, /enableBackendPremium:\s*false/);
    assert.ok(!js.includes('muscleMap_premium'));
    assert.doesNotMatch(js, /\/api\/checkout/);
    assert.doesNotMatch(html, /<script\s+src="script\.js"/);
});
