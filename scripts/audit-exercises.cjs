#!/usr/bin/env node
'use strict';
/**
 * Muscle Map exercise quality audit.
 * Node built-ins only; offline/read-only; NO medical or independent expert certification.
 * Usage: node scripts/audit-exercises.cjs --json reports/audit.json --markdown reports/audit.md --fail-on-errors
 */
const fs=require('node:fs'), path=require('node:path'), vm=require('node:vm');
const root=path.resolve(__dirname,'..'), argv=process.argv.slice(2);
const option=flag=>{const i=argv.indexOf(flag);return i<0?undefined:argv[i+1]};
const normal=v=>String(v||'').trim().toLocaleLowerCase('en-US');
const exists=rel=>{
    if(!rel || typeof rel!=='string' || /^(?:[a-z]+:)?\/\//i.test(rel)||rel.includes('\0'))return false;
    const abs=path.resolve(root,rel.replace(/^\//,''));
    return abs.startsWith(root+path.sep)&&fs.existsSync(abs)&&fs.statSync(abs).isFile();
};
function data(filename,variable){
    const context=vm.createContext({console:{log(){} }});
    // Repository-owned static source only; not a sandbox for untrusted uploaded code.
    vm.runInContext(fs.readFileSync(path.join(root,filename),'utf8')+
        '\n;globalThis.__audit_data='+variable+';',context,{filename,timeout:15000});
    return context.__audit_data;
}
const exercises=Array.from(data('exercise-data.js','exerciseDatabase'));
const muscles=data('muscle-data.js','muscleDatabase');
const synergy=data('synergists-data.js','synergistsData');
const custom=data('custom-exercises.js','customExercises');
const curated=data('custom-synergists-data.js','customExerciseSynergists');
const translation=data('exercise-name-ru.js','exerciseNameRU');
const muscleIds=new Set(Object.keys(muscles));
const issues=[], ids=new Set(), englishNames=new Map(), usedSynergies=new Set();
function add(severity,code,id,detail,extras={}){
    issues.push({severity,code,exerciseId:id==null?null:String(id),detail,...extras});
}
const stats={
    catalogCount:exercises.length,muscleEntries:muscleIds.size,
    synergyLookupKeys:Object.keys(synergy).length,customGroups:Object.keys(custom).length,
    customCount:0,curatedCustomCount:0,mediaPathsChecked:0,missingImages:0,missingGifs:0,
    missingRuNames:0,missingRuTechnique:0,reviewedByExternalExpert:0,
    unreviewed:exercises.length,hasGeneratedTemplatePercentages:false
};
for(const ex of exercises){
    const id=String(ex.id??''),key=normal(ex.name_en);
    if(!id||!key||!String(ex.name||'').trim()||!String(ex.muscleId||'').trim())
        add('error','MISSING_REQUIRED_FIELD',id,'id, name, name_en and muscleId are required');
    if(ids.has(id))add('error','DUPLICATE_EXERCISE_ID',id,'Duplicate immutable exercise ID');
    ids.add(id);
    if(!muscleIds.has(ex.muscleId))add('error','UNKNOWN_PRIMARY_MUSCLE',id,'Unknown muscleId: '+ex.muscleId);
    const names=englishNames.get(key)||[];names.push({id,muscleId:ex.muscleId});englishNames.set(key,names);
    const row=synergy[key];
    if(!row)add('error','MISSING_SYNERGY_LOOKUP',id,'No synergy entry for '+key);
    else{
        usedSynergies.add(key);
        const primary=row.primary?.muscleId;
        if(!muscleIds.has(primary))add('error','UNKNOWN_SYNERGY_PRIMARY',id,'Unknown primary: '+primary);
        else if(primary!==ex.muscleId)add('warning','CATALOG_SYNERGY_MISMATCH',id,'Catalogue='+ex.muscleId+'; synergy='+primary);
        const partners=new Set();
        for(const partner of row.synergists||[]){
            if(!muscleIds.has(partner.muscleId))
                add('error','UNKNOWN_SYNERGIST',id,'Unknown partner: '+partner.muscleId);
            if(partners.has(partner.muscleId))
                add('warning','DUPLICATE_PARTNER',id,'Repeated partner: '+partner.muscleId);
            if(partner.muscleId===primary)
                add('warning','SELF_SYNERGIST',id,'Primary is also listed as partner');
            partners.add(partner.muscleId);
            if(Number.isFinite(partner.percent))stats.hasGeneratedTemplatePercentages=true;
        }
    }
    if(!String(translation[key]||'').trim()){
        stats.missingRuNames++;add('warning','RU_NAME_MISSING',id,'No title in exercise-name-ru.js');
    }
    if(!String(ex.instructions_ru||'').trim() && !(ex.instruction_steps_ru||[]).some(Boolean)){
        stats.missingRuTechnique++;add('warning','RU_TECHNIQUE_MISSING',id,'Missing Russian exercise technique');
    }
    for(const [field,metric] of [['image','missingImages'],['gif','missingGifs']]){
        stats.mediaPathsChecked++;
        if(!exists(ex[field])){
            stats[metric]++;
            add('warning','MEDIA_MISSING',id,field+': '+String(ex[field]||'(empty)'));
        }
    }
    // Narrow heuristics raise questions; never correct anatomy automatically.
    if(/\brear delt\b|\brear deltoid\b/i.test(key)&&ex.muscleId!=='male_deltoid_posterior')
        add('review','REAR_DELTOID_ROLE_CHECK',id,'Rear-delt move assigned elsewhere',{name:ex.name_en,target:ex.muscleId});
    if(/\bshrug\b/i.test(key)&&ex.muscleId!=='male_trapezius_upper')
        add('review','SHRUG_ROLE_CHECK',id,'Review scapular elevation versus assigned primary',{name:ex.name_en,target:ex.muscleId});
    if(/\brectus femoris\b/i.test(key)&&ex.muscleId==='male_rectus_abdominis')
        add('review','RECTUS_FEMORIS_CONFUSION',id,'Rectus femoris belongs to quadriceps, not abdominals',{name:ex.name_en});
    if(normal(ex.target)==='levator scapulae'&&!muscleIds.has('male_levator_scapulae'))
        add('review','MISSING_ATLAS_TARGET',id,'Source targets levator scapulae, not separately modeled',{name:ex.name_en});
    if(/\bstretch\b/i.test(key))
        add('review','STRETCH_ROLE_REVIEW',id,'Check whether stretched tissue was confused with contracting primary',{name:ex.name_en});
}
for(const [name,entries] of englishNames){
    if(entries.length<2)continue;
    const targets=[...new Set(entries.map(e=>e.muscleId))];
    add('review','DUPLICATE_ENGLISH_NAME',null,'Do not collapse separate exercise IDs based on name',
        {name,ids:entries.map(e=>e.id),targets});
    if(targets.length>1)
        add('warning','AMBIGUOUS_NAME_KEY',null,'Different target muscles share one synergy lookup',{name,targets});
}
for(const key of Object.keys(synergy))
    if(!usedSynergies.has(normal(key)))add('warning','ORPHAN_SYNERGY_LOOKUP',null,'No catalogue exercise named '+key);
const customIds=new Set();
for(const [muscleId,groups] of Object.entries(custom)){
    if(!muscleIds.has(muscleId))add('error','UNKNOWN_CUSTOM_GROUP',null,'Unknown custom muscle '+muscleId);
    for(const kind of ['primary','secondary']){
        for(const [index,ex] of (groups[kind]||[]).entries()){
            stats.customCount++;
            const id=String(ex.stableId||'custom_'+muscleId+'_'+kind+'_'+index);
            if(customIds.has(id)||ids.has(id))add('error','CUSTOM_ID_COLLISION',id,'Duplicate stable custom ID');
            customIds.add(id);
            if(!String(ex.description||'').trim())
                add('warning','CUSTOM_DESCRIPTION_MISSING',id,'Custom exercise has no description');
            if(ex.gif&&!exists(ex.gif))add('warning','CUSTOM_MEDIA_MISSING',id,'gif: '+ex.gif);
            const links=curated[muscleId]?.[ex.name]||[];
            if(links.length)stats.curatedCustomCount++;
            const seen=new Set();
            for(const linked of links){
                if(!muscleIds.has(linked))add('error','INVALID_CUSTOM_PARTNER',id,'Invalid partner '+linked);
                if(linked===muscleId)add('warning','SELF_CUSTOM_PARTNER',id,'Self-referencing partner');
                if(seen.has(linked))add('warning','DUPLICATE_CUSTOM_PARTNER',id,'Repeated '+linked);
                seen.add(linked);
            }
        }
    }
}
for(const [muscleId,exerciseMap] of Object.entries(curated)){
    const names=new Set([...(custom[muscleId]?.primary||[]),...(custom[muscleId]?.secondary||[])].map(x=>x.name));
    if(!custom[muscleId])add('error','ORPHAN_CUSTOM_GROUP',null,'Unknown custom group '+muscleId);
    for(const name of Object.keys(exerciseMap))
        if(!names.has(name))add('warning','ORPHAN_CUSTOM_EXERCISE',null,'No custom exercise '+muscleId+': '+name);
}
if(stats.hasGeneratedTemplatePercentages)add('review','UNVERIFIED_PERCENTAGES',null,
    'Generated percent values are not proof of measured EMG or biomechanical muscle contributions');
const order={error:0,warning:1,review:2};
issues.sort((a,b)=>order[a.severity]-order[b.severity]
    ||String(a.exerciseId||'').localeCompare(String(b.exerciseId||''))
    ||a.code.localeCompare(b.code));
const counts={error:0,warning:0,review:0},byCode={};
for(const f of issues){counts[f.severity]++;byCode[f.code]=(byCode[f.code]||0)+1}
const report={
    schema:1,generatedAt:new Date().toISOString(),purpose:'Structural data quality and review triage',
    disclaimer:'Not an independent expert certification; no expert or measured muscle-activation percentages asserted',
    stats,counts,byCode,issues
};
const safe=s=>String(s??'').replace(/\|/g,'\\|').replace(/\r?\n/g,' ').slice(0,190);
const lines=[
    '# Muscle Map: exercise catalogue audit','',
    'Automated quality check of 1295 catalogue exercises, manual exercises, assets, muscle links and translations.',
    'This report is NOT a scientific certification or medical endorsement.','',
    '## Summary','',
    '| Measurement | Count |','|---|---:|',
    ...Object.entries({...stats,...counts}).map(([k,v])=>'| '+safe(k)+' | '+safe(v)+' |'),
    '','## Findings by rule','','| Code | Count |','|---|---:|',
    ...Object.entries(byCode).sort((a,b)=>b[1]-a[1]).map(([k,v])=>'| '+safe(k)+' | '+v+' |'),
    '','## First 60 issues (full list in JSON)','','| Severity | ID | Code | Detail |',
    '|---|---|---|---|',
    ...issues.slice(0,60).map(x=>'| '+x.severity+' | '+safe(x.exerciseId)+' | '+x.code+' | '+safe(x.detail)+' |'),
    '','## Interpretation','','- Error: broken structural invariant requiring correction.',
    '- Warning: missing data or a mapping needing investigation.',
    '- Review: plausible biomechanical/content issue for a qualified reviewer; NOT proof of an error.',
    '- No verified expert status may be displayed based on this report.',
    '- Never replace existing stable IDs, stored diaries, or Production data to silence a rule.',''
];
function output(flag,data){
    const filename=option(flag);if(!filename)return;
    const abs=path.resolve(process.cwd(),filename);
    fs.mkdirSync(path.dirname(abs),{recursive:true});
    fs.writeFileSync(abs,data,'utf8');
}
output('--json',JSON.stringify(report,null,2)+'\n');
output('--markdown',lines.join('\n'));
console.log('EXERCISE_AUDIT_SUMMARY '+JSON.stringify({stats,counts,byCode}));
for(const issue of issues.filter(x=>x.severity==='error').slice(0,12))
    console.log('EXERCISE_AUDIT_ERROR '+JSON.stringify(issue));
for(const issue of issues.filter(x=>x.severity==='review').slice(0,8))
    console.log('EXERCISE_AUDIT_REVIEW '+JSON.stringify(issue));
if(argv.includes('--fail-on-errors')&&counts.error>0)process.exitCode=1;
