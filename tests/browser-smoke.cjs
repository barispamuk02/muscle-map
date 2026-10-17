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
            // Simulate Production hostname only for the new UI; never sign in
            // or call live checkout or Premium backend during this browser test.
            await page.evaluate(() => { isProductionAuthSite = () => true; });
            if (mobile) await page.locator('.mm-mobile-bottom-nav [data-mm-target="navPrograms"]').click();
            else await page.locator('#navPrograms').click();
            await page.locator('[data-program="mass3"]').click();
            assert.equal(await page.locator('.program-progression-open').count(), 1, 'paid progression entry must display');
            await page.locator('[data-program="strength4"]').click();
            assert.equal(await page.locator('.program-progression-open').count(), 1, 'switching programs keeps paid entry');
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