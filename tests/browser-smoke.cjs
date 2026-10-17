'use strict';
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');

const root = path.resolve(__dirname, '..');
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.gif':'image/gif', '.woff':'font/woff', '.woff2':'font/woff2' };
const serve = http.createServer((request, response) => {
    let name;
    try { name = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
    catch { response.writeHead(400).end(); return; }
    const candidate = path.resolve(root, '.' + name);
    if (candidate !== root && !candidate.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    const file = fs.existsSync(candidate) && fs.statSync(candidate).isDirectory() ? path.join(candidate, 'index.html') : candidate;
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404).end('Not found'); return; }
    response.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(response);
});
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function main() {
    // Update safety guardrails: no automatic storage deletion and no eager reload.
    const sw = fs.readFileSync(path.join(root, 'service-worker.js'), 'utf8');
    const app = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
    assert.match(sw, /cache: request\.destination === 'document'/);
    assert.match(sw, /name\.startsWith\('muscle-map-'\)/);
    assert.doesNotMatch(sw, /localStorage\.clear\(|indexedDB\.deleteDatabase\(/);
    assert.match(app, /updateViaCache: 'none'/);
    assert.match(app, /controllerchange/);
    await new Promise(resolve => serve.listen(0, '127.0.0.1', resolve));
    const port = serve.address().port;
    const origin = 'http://127.0.0.1:' + port;
    const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
    try {
        for (const mobile of [false, true]) {
            const context = await browser.newContext({
                viewport: mobile ? { width: 390, height: 844 } : { width: 1366, height: 900 },
                isMobile: mobile, hasTouch: mobile
            });
            const page = await context.newPage();
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            await page.goto(origin, { waitUntil: 'domcontentloaded', timeout: 90000 });
            await page.waitForFunction(() => typeof getWorkoutLog === 'function' && typeof openPremium === 'function', {timeout: 25000});
            const exerciseCount = await page.evaluate(() => typeof exerciseDatabase !== 'undefined' ? exerciseDatabase.length : 0);
            assert.ok(exerciseCount >= 1200, 'Full exercise catalogue must load');
            if (mobile) {
                await page.locator('#mmMobileHero').waitFor();
                await page.locator('.mm-mobile-bottom-nav').waitFor();
                assert.ok(await page.locator('.mm-mobile-bottom-nav button').count() >= 5);
                const mobileLayout = await page.evaluate(() => {
                    const hero = document.getElementById('mmMobileHero').getBoundingClientRect();
                    const anatomy = document.querySelector('#viewMuscles > .body-view').getBoundingClientRect();
                    const targets = [...document.querySelectorAll('.mm-mobile-bottom-nav button')].map(b => b.getBoundingClientRect());
                    return {
                        heroVisible: hero.height > 40,
                        anatomyWithinScreen: anatomy.left >= 0 && anatomy.right <= window.innerWidth + 1,
                        touchTargets: targets.every(t => t.height >= 44),
                        searchReadable: parseFloat(getComputedStyle(document.getElementById('searchInput')).fontSize) >= 16
                    };
                });
                assert.ok(mobileLayout.heroVisible, 'Mobile hero must be visible');
                assert.ok(mobileLayout.anatomyWithinScreen, 'Anatomy card must fit mobile viewport');
                assert.ok(mobileLayout.touchTargets, 'Bottom tabs must have comfortable touch heights');
                assert.ok(mobileLayout.searchReadable, 'Search font must avoid mobile auto zoom');
                // Rapid front/back interactions must never reactivate stale SVG layers.
                await page.locator('#viewToggle').click();
                await page.waitForTimeout(420);
                await page.locator('#viewToggle').click();
                await page.waitForTimeout(420);
                const state = await page.evaluate(() => ({
                    visible: [...document.querySelectorAll('.body-svg-layer.visible')].map(e => e.id),
                    outgoing: document.querySelectorAll('.mm-motion-outgoing-image').length,
                    image: document.getElementById('bodyImage').getAttribute('src')
                }));
                assert.deepEqual(state.visible, ['bodySvgFront'], 'Only front SVG should remain active');
                assert.match(state.image, /body-front_1.png/, 'Front image must match SVG layer');
                assert.equal(state.outgoing, 0, 'Old image frame must be cleaned up');
                // Simulate impatient taps after SVG initialization; no ignored clicks.
                await page.evaluate(() => {
                    toggleView();
                    toggleView();
                    toggleView();
                });
                const repeated = await page.evaluate(() => ({
                    view: currentView,
                    image: document.getElementById('bodyImage').getAttribute('src'),
                    active: [...document.querySelectorAll('.body-svg-layer.visible')].map(e => e.id),
                    animation: getComputedStyle(document.querySelector('.body-svg-layer svg path')).animationName
                }));
                assert.equal(repeated.view, 'back', 'Three rapid taps must count as three view changes');
                assert.match(repeated.image, /body-back_2.png/);
                assert.deepEqual(repeated.active, ['bodySvgBack']);
                assert.equal(repeated.animation, 'none', 'SVG paths must not pulse continuously');
                await page.waitForTimeout(600);
                await page.evaluate(() => toggleView());



                // Real tap on a muscle must lead visitors to the exercise panel.
                await page.waitForSelector('#muscleList .list-item', { timeout: 15000 });
                await page.evaluate(() => {
                    window.__mobileDetailRevealed = false;
                    const info = document.getElementById('infoContent');
                    info.scrollIntoView = () => { window.__mobileDetailRevealed = true; };
                });
                assert.match(await page.locator('#mmMobileHero h2').innerText(), /Know your muscles|Изучай мышцы/i);
                assert.ok(await page.locator('#mmMobileHero .mm-hero-accent').isVisible());
                await page.evaluate(() => {
                    const path = document.querySelector('.body-svg-layer svg path');
                    if (path) {
                        path.classList.add('synergist-active');
                        window.__amberTestPath = path;
                    }
                });
                await page.locator('#muscleList .list-item').first().click();
                const primary = await page.evaluate(() => {
                    const paths = [...document.querySelectorAll('.body-svg-layer svg path.active')];
                    return {
                        ids: paths.map(path => path.dataset.muscleId),
                        selected: currentMuscleId,
                        noPulse: paths.every(path => getComputedStyle(path).animationName === 'none')
                    };
                });
                assert.ok(primary.ids.every(id => id === primary.selected), 'Red SVG must match selected muscle');
                assert.ok(primary.noPulse, 'Primary highlight must not animate endlessly');
                await page.locator('#muscleList .list-item').nth(1).click();
                const afterChange = await page.evaluate(() =>
                    [...document.querySelectorAll('.body-svg-layer svg path.active')]
                        .every(path => path.dataset.muscleId === currentMuscleId)
                );
                assert.ok(afterChange, 'Previous red muscle must reset after selecting another');

                const amberReset = await page.evaluate(() =>
                    !window.__amberTestPath || !window.__amberTestPath.classList.contains('synergist-active')
                );
                assert.ok(amberReset, 'Selecting a different muscle must clear previous amber glow');
                await page.waitForFunction(() => window.__mobileDetailRevealed === true, { timeout: 3000 });
                assert.ok((await page.locator('#infoContent').innerText()).trim().length > 20,
                    'Selected muscle must reveal exercise details');
                await page.locator('.mm-mobile-bottom-nav [data-mm-target="navPrograms"]').click();
            } else {
                await page.locator('#navPrograms').click();
            }
            await page.waitForFunction(() => document.getElementById('viewPrograms').style.display !== 'none');
            if (mobile) await page.locator('.mm-mobile-bottom-nav [data-mm-target="navMyWorkout"]').click();
            else await page.locator('#navMyWorkout').click();
            await page.waitForFunction(() => document.getElementById('viewMyWorkout').style.display === 'block');
            await page.locator('#workoutTracker').waitFor({timeout: 10000});
            await page.waitForFunction(() => document.getElementById('trackerAddBtn') !== null, {timeout: 10000});
            const result = await page.evaluate(() => {
                const ex = exerciseDatabase[0];
                const name = typeof translateExerciseName === 'function' ? translateExerciseName(ex) : ex.name;
                if (!name) throw Error('First exercise name missing');
                document.getElementById('trackerExName').value = name;
                document.getElementById('trackerWeight').value = '20';
                document.getElementById('trackerReps').value = '8';
                document.getElementById('trackerAddBtn').click();
                const sets = getCurrentWorkout().exercises[name];
                return { name, sets: sets?.length || 0, weight: sets?.at(-1)?.weight, reps: sets?.at(-1)?.reps };
            });
            assert.equal(result.sets, 1, 'Workout set persisted after adding');
            assert.equal(result.weight, 20);
            assert.equal(result.reps, 8);
            await page.reload({ waitUntil: 'domcontentloaded', timeout: 90000 });
            await page.waitForFunction(() => typeof getCurrentWorkout === 'function');
            const saved = await page.evaluate(name => getCurrentWorkout().exercises[name], result.name);
            assert.equal(saved.length, 1, 'Workout should survive F5');
            assert.equal(saved[0].weight, 20);
            assert.equal(saved[0].reps, 8);
            await page.evaluate(() => openPremium());
            assert.ok(await page.locator('#premiumModal.show').count(), 'Premium modal must open');
            await page.evaluate(() => closePremium());
            assert.equal(await page.locator('#premiumModal.show').count(), 0, 'Premium modal should close');
            assert.deepEqual(errors, [], (mobile ? 'Mobile' : 'Desktop') + ' JavaScript errors');
            console.log((mobile ? 'MOBILE' : 'DESKTOP') + '_BROWSER_REGRESSION_OK', JSON.stringify({ exerciseCount, diarySet: result.sets }));
            await context.close();
        }
    } finally {
        await browser.close();
        await new Promise(resolve => serve.close(resolve));
    }
}
main().catch(error => { console.error('BROWSER_REGRESSION_FAILED', error); serve.close(); process.exitCode = 1; });