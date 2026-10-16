'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const exists = file => fs.existsSync(path.join(root, file));

test('all local frontend JS scripts exist and compile', () => {
    const html = read('index.html');
    const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)]
        .map(m => m[1].split('?')[0]).filter(p => !/^https?:/.test(p));
    assert.ok(scripts.length >= 20, 'Expected the main app and its data bundles');
    for (const file of scripts) {
        assert.ok(exists(file), file + ' missing');
        assert.doesNotThrow(() => new vm.Script(read(file), { filename: file }), 'Invalid JS: ' + file);
    }
});

test('essential navigation and Premium DOM targets exist', () => {
    const html = read('index.html');
    for (const id of ['navMuscles','navMyWorkout','navPrograms','navRecovery','navNutrition',
         'premiumBtn','premiumCta','premiumModal','viewMuscles','viewMyWorkout','viewPrograms',
         'workoutTracker','langToggle']) {
        assert.ok(html.includes('id="' + id + '"') || (id === 'workoutTracker' && (read('script.js').includes("trackerEl.id = 'workoutTracker'") || read('my-workout.js').includes("tracker.id = 'workoutTracker'"))), 'Missing ' + id);
    }
    assert.ok(html.includes('mobile-home.js'));
});

test('Premium export contains all exercises and backend expiry is respected', () => {
    const script = read('script.js');
    const pdf = script.slice(script.indexOf('function exportToPDF()'),script.indexOf('window.exportToPDF = exportToPDF'));
    assert.ok(pdf.includes('exercises.forEach(([name, sets])'));
    assert.ok(!pdf.includes('exercises.slice(0, FREE_LIMIT)'), 'Premium PDF must not be capped at six');
    assert.ok(pdf.includes('doc.addPage()'), 'Large reports must support multiple pages');
    assert.ok(script.includes('data.expiresAt'), 'Use backend actual expiry date');
    assert.ok(!script.includes("trackEvent('payment_success')"), 'Do not count entitlement restoration as a payment');
});

test('PWA pre-cache includes only existing static files', () => {
    const source = read('service-worker.js');
    assert.match(source,/const CACHE_NAME = 'muscle-map-v\\d+'/);
    const segment=source.split('const PRECACHE_URLS = [')[1].split('];')[0];
    assert.ok(segment.includes("'./posthog-analytics.js'"), 'Analytics bootstrap must be cached with the PWA shell');
    const files=[...segment.matchAll(/['"]\.\/([^'"]+)['"]/g)].map(m=>m[1]);
    for (const p of files) {
        assert.ok(p === '' || exists(p), 'Missing PWA asset: ' + p);
    }
});

test('SEO sitemap paths exist and muscle pages have no broken relative exercise links', () => {
    const sitemap=read('sitemap-seo.xml');
    const urls=[...sitemap.matchAll(/<loc>https:\/\/muscle-map\.app\/([^<]+)<\/loc>/g)].map(m=>m[1]);
    assert.ok(urls.length>=1300);
    for(const u of urls) assert.ok(exists(path.join(u,'index.html')), 'Missing sitemap target: '+u);
    const muscles=fs.readdirSync(path.join(root,'muscles'),{withFileTypes:true}).filter(x=>x.isDirectory());
    assert.equal(muscles.length,30);
    for(const m of muscles) {
        const src=read(path.join('muscles',m.name,'index.html'));
        for(const match of src.matchAll(/href="\.\.\/\.\.\/exercises\/([^"]*)\/"/g)) {
            assert.ok(match[1], 'Empty exercise slug in '+m.name);
            assert.ok(exists(path.join('exercises',match[1],'index.html')), 'Broken link: '+m.name+' => '+match[1]);
        }
    }
});

test('exercise and diary navigation remain reachable in source', () => {
    const script=read('script.js');
    for(const symbol of ['function getCurrentWorkout()','function getWorkoutLog()',
        'function exportProgress()','function importProgress(event)','function saveCurrentWorkout(',
        'function switchToPrograms()','function switchToNutrition()','function switchToMuscles()']) {
        assert.ok(script.includes(symbol),'Missing '+symbol);
    }
});