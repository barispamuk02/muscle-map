// Public production homepage diagnosis: no login, no checkout, no payment.
'use strict';
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const localCandidate = process.env.LOCAL_CANDIDATE === 'true';
(async () => {
  const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
  try {
    for(const viewport of [{width:1366,height:768},{width:390,height:844}]) {
      const context = await browser.newContext({viewport,locale:'ru-RU',serviceWorkers:'block'});
      const page = await context.newPage();
      const errors=[],network=[],requests=[];
      if(localCandidate) {
        // Run exact production hostname while serving the proposed branch
        // source. No Production writes, accounts or payments.
        await page.route('https://muscle-map.app/**',async route=>{
          const url=new URL(route.request().url());
          const rel=decodeURIComponent(url.pathname).split('/').filter(Boolean).join('/')||'index.html';
          const full=path.resolve(root,rel);
          if(!full.startsWith(root+path.sep) || !fs.existsSync(full) || !fs.statSync(full).isFile()) {
            return route.fulfill({status:404,body:''});
          }
          const ext=path.extname(full);
          const mime={
            '.html':'text/html','.js':'application/javascript','.css':'text/css',
            '.json':'application/json','.svg':'image/svg+xml','.png':'image/png',
            '.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg',
            '.ico':'image/x-icon','.woff2':'font/woff2'
          }[ext]||'application/octet-stream';
          return route.fulfill({status:200,contentType:mime,body:fs.readFileSync(full)});
        });
        await page.route('**/neondb/auth/**',route=>route.fulfill({
          status:200,contentType:'application/json',body:'null',
          headers:{'access-control-allow-origin':'https://muscle-map.app',
            'access-control-allow-credentials':'true'}
        }));
      }
      page.on('pageerror',e=>errors.push(e.message.slice(0,380)));
      page.on('console',m=>{if(m.type()==='error')errors.push(m.text().slice(0,380));});
      page.on('requestfailed',r=>{if(r.url().startsWith('https://muscle-map.app/'))network.push(r.url().split('?')[0]+' '+(r.failure()?.errorText||''));});
      page.on('response',r=>{if(r.url().startsWith('https://muscle-map.app/') && r.status()>=400)network.push(r.status()+' '+r.url().split('?')[0]);});
      const response=await page.goto('https://muscle-map.app/?public_diagnostic=20261016',{waitUntil:'domcontentloaded',timeout:45000});
      await page.waitForTimeout(9000);
      // Counters animate through IntersectionObserver only when on screen.
      // Mobile stat row is below the fold: scroll it into view first.
      if(viewport.width<500) {
        const firstCounter=page.locator('[data-count]').first();
        if(await firstCounter.isVisible()){
          await firstCounter.scrollIntoViewIfNeeded();
          await page.waitForTimeout(3200);
        }
      }
      const m=await page.evaluate(()=>{
        const find=id=>document.getElementById(id);
        const counterNodes=[...document.querySelectorAll('[data-count]')];
        return {
          title:document.title,
          readyState:document.readyState,
          counters:counterNodes.map(n=>({expected:n.getAttribute('data-count'),shown:n.textContent.trim(),visible:!!n.getClientRects().length})).slice(0,10),
          quote:find('quoteText')?.textContent.trim().slice(0,110),
          image:find('bodyImage')?{src:find('bodyImage').getAttribute('src'),complete:find('bodyImage').complete,width:find('bodyImage').naturalWidth}:null,
          muscleListChildren:find('muscleList')?.children.length??null,
          muscleDatabaseType:typeof muscleDatabase,
          muscleDatabaseCount:typeof muscleDatabase==='undefined'?null:Object.keys(muscleDatabase).length,
          exerciseDatabaseType:typeof exerciseDatabase,
          exerciseDatabaseCount:typeof exerciseDatabase==='undefined'?null:exerciseDatabase.length,
          hasSvgOverlay:!!document.querySelector('.body-overlay'),
          initializedIconNodes:document.querySelectorAll('svg.svg-icon, svg[data-icon]').length
        };
      });
      const label=(localCandidate?'CANDIDATE_':'LIVE_')+(viewport.width<500?'MOBILE':'DESKTOP');
      console.log(label+'_HTTP='+response.status());
      console.log(label+'_MAIN_METRICS='+JSON.stringify(m));
      console.log(label+'_JS_ERRORS='+JSON.stringify(errors.slice(0,16)));
      console.log(label+'_FAILED_LOCAL_REQUESTS='+JSON.stringify(network.slice(0,15)));
      if(response.status()!==200 || m.muscleDatabaseCount<25 ||
          m.exerciseDatabaseCount<1000 ||
          m.quote==='Загрузка...' ||
          !m.image?.width ||
          m.counters.some(c=>c.visible && Number(c.expected)>0 && (c.shown==='0'||c.shown===''))) {
        console.error(label+'_PRODUCTION_HOME=FAIL');
        process.exitCode=1;
      } else console.log(label+'_PRODUCTION_HOME=PASS');
      if(localCandidate){
        const ui=await page.evaluate(()=>{
          switchToPrograms();
          currentProgramId='mass3';
          renderPrograms();
          return {freeDays:document.querySelectorAll('.program-day').length,
            buttons:document.querySelectorAll('.program-progression-open').length,
            content:document.querySelectorAll('.program-progression-phase').length};
        });
        console.log(label+'_PROGRAM_UI='+JSON.stringify(ui));
        if(ui.freeDays<3 || ui.buttons!==1 || ui.content!==0){
          console.error(label+'_PREMIUM_PROGRAM_CANDIDATE=FAIL');
          process.exitCode=1;
        } else console.log(label+'_PREMIUM_PROGRAM_CANDIDATE=PASS');
      }
      await context.close();
    }
  }finally{await browser.close();}
})().catch(e=>{console.error('PUBLIC_BROWSER_DIAGNOSTIC_FATAL='+String(e.message).slice(0,220));process.exitCode=1;});
