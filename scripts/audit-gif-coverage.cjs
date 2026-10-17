#!/usr/bin/env node
'use strict';
// Read-only inventory: NEVER automatically publishes a GIF into the workout UI.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),args=process.argv.slice(2);
const opt=flag=>{const i=args.indexOf(flag);return i>=0?args[i+1]:null};
function load(name,sym){
  const c=vm.createContext({console:{log(){}}});
  vm.runInContext(fs.readFileSync(path.join(root,name),'utf8')+';globalThis.__data='+sym,c,{timeout:20000});
  return c.__data;
}
const exercises=Array.from(load('exercise-data.js','exerciseDatabase'));
const custom=load('custom-exercises.js','customExercises');
const atlas=load('muscle-data.js','muscleDatabase');
const paths=[];
function walk(dir,relative){
  if(!fs.existsSync(dir))return;
  for(const item of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,item.name),short=relative+'/'+item.name;
    if(item.isDirectory())walk(full,short);
    else if(item.isFile())paths.push(short.replaceAll('\\','/'));
  }
}
walk(path.join(root,'videos'),'videos');walk(path.join(root,'images/exercises'),'images/exercises');
const customs=Object.values(custom).flatMap(x=>[...(x.primary||[]),...(x.secondary||[])]);
const listed=new Set([...exercises,...customs].map(x=>x.gif).filter(Boolean));
const orphans=paths.filter(x=>x.endsWith('.gif')&&!listed.has(x)).sort();
const upstream=new Map();
if(opt('--upstream') && fs.existsSync(opt('--upstream'))){
  const arr=JSON.parse(fs.readFileSync(opt('--upstream'),'utf8'));
  for(const row of arr)upstream.set(String(row.id),row);
}
const entries=orphans.map(gif=>{
  const base=path.basename(gif,'.gif'),id=base.match(/^([0-9]{4})-/)?.[1]||'';
  const image='images/exercises/'+base+'.jpg',row=upstream.get(id);
  return {id,gif,image,imagePresent:paths.includes(image),metadataFound:!!row,
    nameEn:row?.name||'',target:row?.target||'',
    category:row?.body_part||row?.bodyPart||row?.category||'',equipment:row?.equipment||'',
    review:'unreviewed',publication:'not_connected'};
});
const broken=[...listed].filter(x=>!paths.includes(x));
const summary={catalogCount:exercises.length,customCount:customs.length,atlasEntries:Object.keys(atlas).length,
  totalGifFiles:paths.filter(x=>x.endsWith('.gif')).length,
  linkedCatalogGifs:new Set(exercises.map(x=>x.gif).filter(Boolean)).size,
  linkedCustomGifs:new Set(customs.map(x=>x.gif).filter(Boolean)).size,
  orphanGifFiles:orphans.length,orphanWithThumbnail:entries.filter(x=>x.imagePresent).length,
  metadataRecovered:entries.filter(x=>x.metadataFound).length,brokenGifRefs:broken.length};
const output={schema:1,summary,unlinked:entries,broken,notice:'Gym visual media rights must be verified before commercial use; identification is not approval'};
function write(flag,content){const dest=opt(flag);if(!dest)return;
  const file=path.resolve(process.cwd(),dest);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,content);
}
write('--json',JSON.stringify(output,null,2)+'\n');
const escapeText=x=>String(x||'').replace(/\|/g,'\\|').replace(/[\r\n]/g,' ');
const lines=['# Unlinked GIF inventory','','Read-only inventory: no cards changed. Media licensing and anatomical motion still require review.','',
  '| ID | Source title | Target | GIF file | JPG exists |','|---|---|---|---|---|',
  ...entries.map(e=>'| '+e.id+' | '+escapeText(e.nameEn)+' | '+escapeText(e.target)+' | '+e.gif+' | '+(e.imagePresent?'yes':'no')+' |'),
  '','WARNING: matching an ID does not prove biomechanical appropriateness or commercial media rights.'];
write('--markdown',lines.join('\n')+'\n');
console.log('GIF_COVERAGE_AUDIT '+JSON.stringify(summary));
console.log('GIF_ORPHAN_CANDIDATES '+JSON.stringify(entries.map(e=>({id:e.id,name:e.nameEn,target:e.target,category:e.category,equipment:e.equipment,thumb:e.imagePresent}))));
if(args.includes('--fail-on-broken')&&(broken.length||entries.some(e=>!e.imagePresent)))process.exitCode=1;
