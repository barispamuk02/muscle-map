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
    const listeners = {};
    const head = { insertBefore(element) { scripts.push(element); } };
    const document = {
        addEventListener(type, handler) { listeners[type] = handler; },
        createElement(tag) { assert.equal(tag,'script'); return {}; },
        getElementsByTagName(tag) { assert.equal(tag,'script'); return [{parentNode:head}]; }
    };
    const window = { location: { hostname } };
    const navigator = { doNotTrack: options.dnt || '0', globalPrivacyControl: !!options.gpc };
    vm.runInNewContext(code, {window,document,navigator}, {filename:'posthog-analytics.js'});
    return {window,scripts,listeners};
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

test('anonymous navigation and Premium clicks emit only whitelisted events', () => {
    const {window,listeners} = boot('muscle-map.app');
    assert.equal(typeof listeners.click,'function');
    const click = id => listeners.click({ target: { closest: () => ({ id, getAttribute: () => null }) } });
    click('navPrograms');
    click('navMyWorkout');
    click('premiumBtn');
    click('premiumCta');
    click('trackerWeight'); // Should remain ignored even if a selector matches an ancestor
    const entries = window.posthog.filter(x => Array.isArray(x) && x[0] === 'capture');
    assert.equal(entries.length,4);
    assert.equal(entries[0][1],'section_opened');
    assert.equal(entries[0][2].section,'programs');
    assert.equal(entries[1][2].section,'my_workout');
    assert.equal(entries[2][1],'premium_entry_clicked');
    assert.equal(entries[3][1],'premium_checkout_clicked');
    for (const entry of entries) {
        assert.ok(!JSON.stringify(entry).match(/weight|reps|email|userId|name/i), 'No private data');
    }
});
test('mobile navigation clicks are tracked through safe target identifiers', () => {
    const {window,listeners} = boot('www.muscle-map.app');
    listeners.click({ target: { closest: () => ({id:'',getAttribute: x => x === 'data-mm-target' ? 'navNutrition' : null }) } });
    const capture = window.posthog.find(x => Array.isArray(x) && x[0] === 'capture');
    assert.equal(capture[1], 'section_opened');
    assert.equal(capture[2].section, 'nutrition');
});
