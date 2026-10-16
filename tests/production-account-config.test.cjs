const { test } = require('node:test');
const assert = require('node:assert/strict');
const { generate, validateAuthUrl } = require('../scripts/prepare-production-account-config.cjs');

test('generates only a production frontend config for a distinct Neon Auth tenant', () => {
    const good = 'https://ep-production-example-123.neonauth.c-5.eu-central-1.aws.neon.tech/neondb/auth';
    const value = generate(good);
    assert.match(value, /stage: 'production'/);
    assert.ok(value.includes(good));
    assert.match(value, /apiUrl: 'https:\/\/muscle-map-backend\.onrender\.com'/);
    assert.match(value, /emailVerificationRequired: true/);
    assert.match(value, /enableBackendPremium: true/);
    assert.doesNotMatch(value, /muscle-map-backend-staging/);
});

test('rejects staging, local, unsigned and malformed production auth URLs', () => {
    for (const url of [
        'https://ep-summer-recipe-b1qi9f29.neonauth.c-5.eu-central-1.aws.neon.tech/neondb/auth',
        'http://ep-production-example-123.neonauth.c-5.eu-central-1.aws.neon.tech/neondb/auth',
        'http://localhost:8001/neondb/auth',
        'https://evil.example/neondb/auth',
        'https://user:password@ep-production-example-123.neonauth.c-5.eu-central-1.aws.neon.tech/neondb/auth',
        'https://ep-production-example-123.neonauth.c-5.eu-central-1.aws.neon.tech/neondb/auth?secret=1',
        'https://ep-production-example-123.neonauth.c-5.eu-central-1.aws.neon.tech/wrong/auth'
    ]) {
        assert.throws(() => validateAuthUrl(url), /Rejected|Invalid/);
    }
});

test('release candidate matches generator and keeps active STAGING config untouched', () => {
    const fs = require('node:fs');
    const release = fs.readFileSync('release/account-config.production.js', 'utf8');
    const liveDraft = fs.readFileSync('account-config.js', 'utf8');
    const actualProductionUrl = 'https://ep-muddy-rice-b1y5qbz8.neonauth.c-5.eu-central-1.aws.neon.tech/neondb/auth';
    assert.equal(release, generate(actualProductionUrl));
    assert.match(liveDraft, /stage: 'staging'/);
    assert.doesNotMatch(release, /ep-summer-recipe-b1qi9f29|muscle-map-backend-staging/);
    assert.match(release, /emailVerificationRequired: true/);
    assert.match(release, /enableBackendPremium: true/);
});
