'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const code = fs.readFileSync(path.resolve(__dirname,'../posthog-analytics.js'),'utf8');
const html = fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8');

function boot(hostname, options={}) {
    const scripts = [];
    const head = { insertBefore(element) { scripts.push(element); } };
    const document = {
        createElement(tag) { assert.equal(tag,'script'); return {}; },
        getElementsByTagName(tag) { assert.equal(tag,'script'); return [{parentNode:head}]; }
    };
    const window = { location: { hostname } };
    const navigator = { doNotTrack: options.dnt || '0', globalPrivacyControl: !!options.gpc };
    vm.runInNewContext(code, {window,document,navigator}, {filename:'posthog-analytics.js'});
    return {window,scripts};
}

test('production loads verified EU SDK and queues safe configuration', () => {
    assert.match(html, /<script defer src="posthog-analytics.js"><\/script>/);
    const {window,scripts} = boot('muscle-map.app');
    assert.equal(scripts.length,1);
    assert.equal(scripts[0].src,'https://eu-assets.i.posthog.com/static/array.js');
    assert.equal(scripts[0].async,true);
    assert.ok(window.posthog?.__SV === 1);
    const [[token,config]] = window.posthog._i;
    assert.match(token, /^phc_[A-Za-z0-9]+$/);
    assert.equal(config.api_host,'https://eu.i.posthog.com');
    assert.equal(config.ui_host,'https://eu.posthog.com');
    assert.equal(config.capture_pageview,true);
    assert.equal(config.autocapture,false);
    assert.equal(config.disable_session_recording,true);
    assert.equal(config.person_profiles,'identified_only');
    assert.equal(config.persistence,'memory');
    assert.equal(config.mask_all_text,true);
    assert.equal(config.mask_all_element_attributes,true);
});
test('www production hostname is supported', () => {
    assert.equal(boot('www.muscle-map.app').scripts.length,1);
});
test('staging, unrelated hosts and local browser tests send no telemetry', () => {
    for (const host of ['localhost','127.0.0.1','evil-muscle-map.app','preview.github.io','muscle-map.app.evil.com']) {
        const {scripts,window} = boot(host);
        assert.equal(scripts.length,0,host);
        assert.equal(window.posthog,undefined,host);
    }
});
test('do-not-track and global privacy control block SDK initialization', () => {
    for (const options of [{dnt:'1'},{gpc:true}]) {
        const {scripts,window} = boot('muscle-map.app',options);
        assert.equal(scripts.length,0);
        assert.equal(window.posthog,undefined);
    }
});
