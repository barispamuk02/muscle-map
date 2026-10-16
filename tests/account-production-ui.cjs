'use strict';
// Fully mocked, never hits live Production Neon/Auth/Render.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const production=fs.readFileSync(path.join(root,'release/account-config.production.js'),'utf8');
const staging=fs.readFileSync(path.join(root,'account-config.js'),'utf8');
const base='https://muscle-map.app/';
const assets={'account.html':'text/html; charset=utf-8',
    'account.js':'application/javascript; charset=utf-8',
    'account.css':'text/css; charset=utf-8',
    'account-config.js':'application/javascript; charset=utf-8'};
async function testPage(browser,config,{safe}){
    const context=await browser.newContext({locale:'ru-RU'});
    const page=await context.newPage();
    let authCalls=0;
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('https://muscle-map.app/**',async route=>{
        const n=new URL(route.request().url()).pathname.replace(/^\//,'');
        if(!assets[n])return route.fulfill({status:404,body:''});
        const body=n==='account-config.js'?config:fs.readFileSync(path.join(root,n),'utf8');
        return route.fulfill({status:200,contentType:assets[n],body});
    });
    await page.route('**/neondb/auth/**',async route=>{
        authCalls++;
        const url=route.request().url();
        assert.match(url,/ep-muddy-rice-b1y5qbz8\.neonauth\./);
        assert.match(url,/\/get-session$/);
        return route.fulfill({status:200,contentType:'application/json',
            headers:{'Access-Control-Allow-Origin':base.slice(0,-1),
                'Access-Control-Allow-Credentials':'true'},
            body:'null'});
    });
    await page.goto(base+'account.html',{waitUntil:'domcontentloaded'});
    if(safe){
        await page.locator('#authGuest').waitFor({state:'visible'});
        await page.waitForFunction(()=>
            document.querySelector('#accountMessage')?.classList.contains('hidden'));
        assert.equal(await page.locator('#accountStageLabel').isHidden(),true);
        assert.equal(await page.locator('#stagingMailTest').isHidden(),true);
        assert.equal(await page.locator('#stagingMailTestHint').isHidden(),true);
        assert.equal(await page.title(),'Аккаунт | Muscle Map');
        assert.equal(authCalls,1);
    }else{
        await page.waitForFunction(()=>document.querySelector('#accountMessage')?.classList.contains('error'));
        assert.equal(authCalls,0,'unsafe production config must never contact STAGING');
        assert.match(await page.locator('#accountMessage').textContent(),/Authentication configuration is unavailable/);
    }
    assert.deepEqual(errors,[]);
    await context.close();
}
async function main(){
    const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
    try{
        await testPage(browser,production,{safe:true});
        await testPage(browser,staging,{safe:false});
        const wrong=production.replace('https://muscle-map-backend.onrender.com',
            'https://muscle-map-backend-staging.onrender.com');
        await testPage(browser,wrong,{safe:false});
        console.log('PRODUCTION_ACCOUNT_UI_NO_TEST_BANNER_NO_STAGING_TOKEN_LEAK=PASS');
    }finally{await browser.close();}
}
main().catch(error=>{console.error('PRODUCTION_ACCOUNT_BROWSER_TEST_FAILED',error);process.exitCode=1;});
