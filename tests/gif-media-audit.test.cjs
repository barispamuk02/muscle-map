'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process');
test('all GIFs accounted for; orphan assets are quarantined, not auto-published',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mm-gifs-'));
 try{
  const json=path.join(dir,'audit.json');
  const run=cp.spawnSync(process.execPath,['scripts/audit-gif-coverage.cjs','--json',json,'--fail-on-broken'],
   {cwd:path.join(__dirname,'..'),encoding:'utf8',timeout:90000,maxBuffer:5*1024*1024});
  assert.equal(run.status,0,run.stdout.slice(0,2000)+'\n'+run.stderr.slice(0,1000));
  const r=JSON.parse(fs.readFileSync(json,'utf8'));
  assert.equal(r.summary.catalogCount,1295);
  assert.equal(r.summary.orphanGifFiles,29);
  assert.equal(r.summary.orphanWithThumbnail,29);
  assert.equal(r.summary.brokenGifRefs,0);
  assert.equal(r.summary.manualWithoutGif,26,'Manual exercise cards without illustrations are independently inventoried');
  assert.equal(r.manualWithoutGif.length,26);
  assert.ok(r.manualWithoutGif.every(x=>x.id&&x.name&&x.muscleId),'Each incomplete card must be identifiable');

  assert.ok(r.unlinked.every(x=>x.publication==='not_connected'));
  const ids=new Set(r.unlinked.map(x=>x.id));
  assert.equal(ids.size,29,'Each orphan needs its own source ID');
 }finally{fs.rmSync(dir,{recursive:true,force:true})}
});
