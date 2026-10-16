// Public production homepage diagnosis: no login, no checkout, no payment.
'use strict';
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
  try {
    for(const viewport of [{width:1366,height:768},{width:390,height:844}]) {
      const context = await browser.newContext({viewport,locale:'ru-RU',serviceWorkers:'block'});
      const page = await context.newPage();
      const errors=[],network=[],requests=[];
      page.on('pageerror',e=>errors.push(e.message.slice(0,380)));
      page.on('console',m=>{if(m.type()==='error')errors.push(m.text().slice(0,380));});
      page.on('requestfailed',r=>{if(r.url().startsWith('https://muscle-map.app/'))network.push(r.url().split('?')[0]+' '+(r.failure()?.errorText||''));});
      page.on('response',r=>{if(r.url().startsWith('https://muscle-map.app/') && r.status()>=400)network.push(r.status()+' '+r.url().split('?')[0]);});
      const response=await page.goto('https://muscle-map.app/?public_diagnostic=20261016',{waitUntil:'domcontentloaded',timeout:45000});
      await page.waitForTimeout(9000);
      const m=await page.evaluate(()=>{
        const find=id=>document.getElementById(id);
        const counterNodes=[...document.querySelectorAll('[data-count]')];
        return {
          title:document.title,
          readyState:document.readyState,
          counters:counterNodes.map(n=>({expected:n.getAttribute('data-count'),shown:n.textContent.trim()})).slice(0,10),
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
      const label=viewport.width<500?'MOBILE':'DESKTOP';
      console.log(label+'_HTTP='+response.status());
      console.log(label+'_MAIN_METRICS='+JSON.stringify(m));
      console.log(label+'_JS_ERRORS='+JSON.stringify(errors.slice(0,16)));
      console.log(label+'_FAILED_LOCAL_REQUESTS='+JSON.stringify(network.slice(0,15)));
      if(response.status()!==200 || m.muscleDatabaseCount<25 ||
          m.exerciseDatabaseCount<1000 ||
          m.quote==='Загрузка...' ||
          !m.image?.width ||
          m.counters.some(c=>Number(c.expected)>0 && (c.shown==='0'||c.shown===''))) {
        console.error(label+'_PRODUCTION_HOME=FAIL');
        process.exitCode=1;
      } else console.log(label+'_PRODUCTION_HOME=PASS');
      await context.close();
    }
  }finally{await browser.close();}
})().catch(e=>{console.error('PUBLIC_BROWSER_DIAGNOSTIC_FATAL='+String(e.message).slice(0,220));process.exitCode=1;});
