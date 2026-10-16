'use strict';
// No live Neon/Dodo/Render network. Exercise the actual production-only
// functions extracted from script.js in a sandbox, never browser-declared IDs.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('script.js','utf8').replace(/\r\n/g,'\n');

function part(start,end){
    const a=source.indexOf(start),b=source.indexOf(end,a+start.length);
    assert.ok(a>=0&&b>a,'cannot locate '+start);
    return source.slice(a,b);
}
const runtime=[
    part('const BACKEND_URL =','function getUserId()'),
    part('function isPremium()','// Установка статуса Премиум'),
    part('function setPremium(active, days = 30)','// ============================================\n// 🔗 СИНХРОНИЗАЦИЯ PREMIUM С BACKEND'),
    part('async function syncPremiumFromBackend()','// Обновление UI после смены статуса'),
    part('async function openDodoCheckout()','// ============================================\n// 📄 ПАГИНАЦИЯ')
].join('\n')+'\nglobalThis.exports={isPremium,setPremium,syncPremiumFromBackend,openDodoCheckout,getProductionAuthToken};';

const productionAuth='https://ep-muddy-rice-b1y5qbz8.neonauth.c-5.eu-central-1.aws.neon.tech/neondb/auth';
const prodApi='https://muscle-map-backend.onrender.com';
const fakeJwt=['eyJhbGciOiJFZERTQSJ9','eyJzdWIiOiJ0ZXN0In0','a'.repeat(86)].join('.');
const expires='2026-11-14T04:23:24.489Z';

function setup({hostname='muscle-map.app',stage='production',session=true,paid=true,now}={}){
    const calls=[],state=new Map();
    let updates=0;
    const cfg={
        stage,authUrl:stage==='production'?productionAuth:
            'https://ep-summer-recipe-b1qi9f29.neonauth.c-5.eu-central-1.aws.neon.tech/neondb/auth',
        apiUrl:stage==='production'?prodApi:'https://muscle-map-backend-staging.onrender.com'
    };
    const sandbox={
        location:{hostname},
        window:{MUSCLE_MAP_ACCOUNT_CONFIG:cfg,open:()=>({}),location:{assign:()=>{}}},
        localStorage:{
            getItem:k=>state.get(k)||null,
            setItem:(k,v)=>{state.set(k,v);},
            removeItem:k=>{state.delete(k);}
        },
        fetch:async (url,options={})=>{
            calls.push({url,options});
            if(url===productionAuth+'/get-session')return {
                ok:true,json:async()=>session?{user:{id:'verified-ci',emailVerified:true}}:null
            };
            if(url===productionAuth+'/token')return {ok:true,json:async()=>({token:fakeJwt})};
            if(url===prodApi+'/api/v2/me/premium')return {
                ok:true,json:async()=>({premium:paid,expiresAt:paid?expires:null})
            };
            if(url===prodApi+'/api/v2/me/checkout')return {
                ok:true,json:async()=>({checkout_url:'https://checkout.dodopayments.com/test'})
            };
            throw Error('An unapproved or anonymous network request was made: '+url);
        },
        Date:now?class extends Date {constructor(x){super(x??now)} static now(){return Date.parse(now)}}:Date,
        console:{log(){},warn(){},error(){}},
        updatePremiumUI:()=>updates++,updatePremiumButtons:()=>updates++,
        showToast:()=>{},trackEvent:()=>{},getUserId:()=>{throw Error('legacy ID may not be used')},
        setTimeout:()=>{},
        document:{},
    };
    vm.runInNewContext(runtime,sandbox,{timeout:1000});
    return {api:sandbox.exports,calls,state,updates:()=>updates,sandbox};
}

test('logged-in verified paid member unlocks workout Premium with signed backend claim',async()=>{
    const t=setup();
    assert.equal(t.api.isPremium(),false,'Premium is not trusted until server response');
    t.state.set('muscleMap_premium',JSON.stringify({active:true,expires:'2099-01-01'}));
    assert.equal(t.api.isPremium(),false,'legacy localStorage may not grant Premium');
    await t.api.syncPremiumFromBackend();
    assert.equal(t.api.isPremium(),true);
    assert.equal(t.calls.length,3);
    assert.equal(t.calls[2].url,prodApi+'/api/v2/me/premium');
    assert.equal(t.calls[2].options.headers.Authorization,'Bearer '+fakeJwt);
    assert.equal(t.calls[0].options.credentials,'include');
    assert.ok(t.updates()>=2);
});
test('signed-out or unpaid member cannot keep old Premium privileges',async()=>{
    for(const scenario of [{session:false,paid:true},{session:true,paid:false}]){
        const t=setup(scenario);
        t.state.set('muscleMap_premium',JSON.stringify({active:true,expires:'2099-01-01'}));
        t.api.setPremium(true,365);
        assert.equal(t.api.isPremium(),false);
        await t.api.syncPremiumFromBackend();
        assert.equal(t.api.isPremium(),false);
        assert.equal(t.calls.some(x=>x.url.includes('/api/premium/')),false);
    }
});
test('staging config accidentally published on the production hostname fails closed',async()=>{
    const t=setup({stage:'staging'});
    await t.api.syncPremiumFromBackend();
    assert.equal(t.calls.length,0,'must not send tokens or email to staging tenant');
    assert.equal(t.api.isPremium(),false);
    await t.api.openDodoCheckout();
    assert.equal(t.calls.length,0,'must not create anonymous live checkout');
});
test('production checkout uses signed Neon bearer, never an editable userId',async()=>{
    const t=setup();
    await t.api.openDodoCheckout();
    assert.deepEqual(t.calls.map(x=>x.url),[
        productionAuth+'/get-session',productionAuth+'/token',
        prodApi+'/api/v2/me/checkout'
    ]);
    const request=t.calls[2].options;
    assert.equal(request.method,'POST');
    assert.equal(request.headers.Authorization,'Bearer '+fakeJwt);
    assert.equal(request.body,'{}');
    assert.equal(t.calls.some(x=>x.url.endsWith('/api/checkout')),false);
});
test('Production config is injected into main workout page before script.js',()=>{
    const html=fs.readFileSync('index.html','utf8');
    assert.ok(html.indexOf('src="account-config.js"')<
        html.indexOf('src="script.js"'));
});
