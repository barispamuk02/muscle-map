#!/usr/bin/env node
'use strict';
// Generate a production-only frontend config without modifying account-config.js.
// Usage: node scripts/prepare-production-account-config.cjs <Neon Production Auth base URL>
// IMPORTANT: Do not run against staging credentials, and do not deploy without owner approval.
const fs = require('node:fs');
const path = require('node:path');

function validateAuthUrl(value) {
    if (typeof value !== 'string' || !value) throw Error('Production Neon Auth URL is required');
    let url;
    try { url = new URL(value); } catch { throw Error('Invalid Neon Auth URL'); }
    const host = url.hostname.toLowerCase();
    if (url.protocol !== 'https:' || url.username || url.password ||
        url.port || url.search || url.hash || !host.includes('.neonauth.') ||
        !host.endsWith('.neon.tech') || !/^ep-[a-z0-9-]+\.neonauth\./.test(host) ||
        url.pathname !== '/neondb/auth' ||
        host.includes('ep-summer-recipe-b1qi9f29')) {
        throw Error('Rejected: not an independent Production Neon Auth endpoint');
    }
    return url.origin + url.pathname;
}

function generate(authUrl) {
    const verified = validateAuthUrl(authUrl);
    return `// GENERATED production-only config; do not point production at Neon STAGING.
window.MUSCLE_MAP_ACCOUNT_CONFIG = Object.freeze({
    stage: 'production',
    authUrl: ${JSON.stringify(verified)},
    apiUrl: 'https://muscle-map-backend.onrender.com',
    emailVerificationRequired: true,
    enableBackendPremium: true
});
`;
}

if (require.main === module) {
    try {
        if (process.argv.length !== 3) throw Error('Usage: node scripts/prepare-production-account-config.cjs <production-auth-base-url>');
        const output = path.resolve('account-config.production.js');
        if (fs.existsSync(output)) throw Error('account-config.production.js already exists; remove after reviewing before regenerating');
        const contents = generate(process.argv[2]);
        fs.writeFileSync(output, contents, { flag: 'wx', mode: 0o644 });
        console.log('Created account-config.production.js (draft artifact only; existing account-config.js unchanged).');
    } catch (err) {
        console.error(err.message);
        process.exitCode = 1;
    }
}
module.exports = { generate, validateAuthUrl };
