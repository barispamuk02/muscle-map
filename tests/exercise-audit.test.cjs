'use strict';
const assert=require('node:assert/strict');
const {test}=require('node:test');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawnSync}=require('node:child_process');
test('exercise audit is offline and creates a structured report',()=>{
    const dir=fs.mkdtempSync(path.join(os.tmpdir(),'muscle-map-audit-'));
    try{
        const json=path.join(dir,'exercise-audit.json');
        const md=path.join(dir,'exercise-audit.md');
        const res=spawnSync(process.execPath,[
            path.join(__dirname,'..','scripts','audit-exercises.cjs'),
            '--json',json,'--markdown',md,'--fail-on-errors'
        ],{cwd:path.join(__dirname,'..'),encoding:'utf8',maxBuffer:12*1024*1024,timeout:90000});
        assert.equal(res.status,0,'Audit structural errors: '+res.stdout.slice(0,3000)+'\n'+res.stderr.slice(0,1000));
        assert.ok(fs.existsSync(json),'Full structured audit created');
        assert.ok(fs.existsSync(md),'Readable audit created');
        const report=JSON.parse(fs.readFileSync(json,'utf8'));
        assert.equal(report.stats.catalogCount,1295,'Full expected catalogue must be audited');
        assert.equal(report.stats.reviewedByExternalExpert,0,'Do not fabricate external expert verification');
        assert.equal(report.counts.error,0,'No broken references or duplicate IDs');
        assert.ok(report.stats.customCount>0,'Manual exercises are included');
        assert.ok(report.byCode.UNVERIFIED_PERCENTAGES>0,'Generated percentages explicitly flagged for review');
        assert.ok(report.byCode.DUPLICATE_ENGLISH_NAME>0,'Exercise name aliases must be reviewed by stable ID');
        assert.match(fs.readFileSync(md,'utf8'),/NOT a scientific certification/);
    }finally{fs.rmSync(dir,{recursive:true,force:true})}
});
