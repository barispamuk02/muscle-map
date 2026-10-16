'use strict';
// Smoke-test the separately deployed, explicitly named staging service.
// This sends anonymous requests only, never email, checkout or webhook writes.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const base='https://muscle-map-backend-staging.onrender.com';
async function request(path){
    let last;
    for(let i=0;i<4;i++){
        const signal=AbortSignal.timeout(25000);
        try {
            const res=await fetch(base+path,{redirect:'error',cache:'no-store',signal});
            if(res.status<500||i===3)return res;
            last=Error('HTTP '+res.status);
        }catch(e){last=e;if(i===3)break;}
        await new Promise(resolve=>setTimeout(resolve,2000));
    }
    throw last;
}
test('staging is live but anonymous and legacy Premium access is blocked',async()=>{
    const health=await request('/health');
    assert.equal(health.status,200,'staging /health');
    assert.equal((await health.json()).ok,true);
    const missingBearer=await request('/api/v2/me/premium');
    assert.equal(missingBearer.status,401,'protected Premium requires bearer token');
    // Neither anonymous callers nor requests nominating a recipient are
    // permitted to send mail. Absolutely no real email can be sent by CI.
    const anonymousMail=await fetch(base+'/api/staging/me/mail-test',{
        method:'POST',redirect:'error',signal:AbortSignal.timeout(25000)
    });
    assert.equal(anonymousMail.status,401,'mail testing requires verified signed Neon JWT');
    const injectedRecipient=await fetch(base+'/api/staging/me/mail-test',{
        method:'POST',redirect:'error',signal:AbortSignal.timeout(25000),
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({to:'not-the-owner@example.test'})
    });
    assert.equal(injectedRecipient.status,400,'browser cannot choose recipient');
    const legacy=await request('/api/premium/u_dummy_not_a_user');
    assert.equal(legacy.status,404,'legacy Premium disabled in staging');
    console.log('LIVE_STAGING_HEALTH_PROTECTED_AND_LEGACY_DISABLED_OK');
});
