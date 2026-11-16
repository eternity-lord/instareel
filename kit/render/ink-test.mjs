import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {ROOT,OUTDIR,PROJECT,serve,openScene} from './lib.mjs';
assert.equal(PROJECT.renderer,'ink');assert.equal(PROJECT.reelId,'10');
const original=JSON.parse(fs.readFileSync(path.join(ROOT,'input/scenarios/scenario-10.json')));
assert.deepEqual(PROJECT.scenes,original.scenes,'Attachment scene texts/holds/ideas must be unchanged');
assert.equal(JSON.parse(fs.readFileSync(path.join(ROOT,'brand.json'))).music.bpm,96);
const timing=JSON.parse(fs.readFileSync(path.join(OUTDIR,'timing.json')));
for(const s of PROJECT.scenes){const m=timing[s.id];assert.equal(m.words.map(w=>w.w).join(' '),s.text);assert.ok(Math.abs(m.dur-m.words.at(-1).t1-s.hold)<1e-5,s.id);}
const before=JSON.parse(fs.readFileSync(path.join(ROOT,'docs/evidence-10/preservation.json')));
for(const [file,hash] of Object.entries(before))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.resolve(ROOT,'..',file))).digest('hex'),hash,file);
assert.equal(Object.keys(before).length,8);
const audio=JSON.parse(fs.readFileSync(path.join(OUTDIR,'audio-status.json')));assert.equal(audio.voiceUsed,false);assert.equal(audio.bpm,96);
const server=await serve();let browser;
try{
 const session=await openScene(server);browser=session.browser;const {page,errors}=session;
 const scenes=await page.evaluate(()=>window.__scenes);assert.equal(scenes.length,10);
 const samples=scenes.flatMap(s=>[s.start+.21,s.start+s.dur*.45,s.start+s.dur*.8,s.start+s.dur-.1]);
 for(const time of [...samples,...samples.toReversed()]){
  const state=await page.evaluate(t=>{window.__seek(t);const svg=document.querySelector('#scene svg');const bad=[...svg.querySelectorAll('*')].flatMap(e=>[...e.attributes].filter(a=>/NaN|Infinity|undefined/.test(a.value)).map(a=>a.name));const missing=[...svg.innerHTML.matchAll(/url\(#([^)]+)\)/g)].map(m=>m[1]).filter(id=>!svg.querySelector('[id="'+id+'"]'));return{bad,missing,html:svg.innerHTML};},time);
  assert.deepEqual(state.bad,[]);assert.deepEqual(state.missing,[]);
 }
 const step=await page.evaluate(()=>{
  window.__seek(.391);const a={seed:document.querySelector('feTurbulence').getAttribute('seed'),poses:[...document.querySelectorAll('[data-pose]')].map(e=>e.getAttribute('data-pose')),camera:document.querySelector('[data-camera]').getAttribute('transform')};
  window.__seek(.405);const b={seed:document.querySelector('feTurbulence').getAttribute('seed'),poses:[...document.querySelectorAll('[data-pose]')].map(e=>e.getAttribute('data-pose')),camera:document.querySelector('[data-camera]').getAttribute('transform')};return{a,b};
 });
 // Both samples deliberately within one 1/12s pose bucket; camera must still move.
 assert.equal(step.a.seed,step.b.seed);assert.deepEqual(step.a.poses,step.b.poses);assert.notEqual(step.a.camera,step.b.camera);
 const card=scenes.find(s=>s.id==='card');
 const cardHTML=[];
 for(const t of [1.1,2.5,4.7])cardHTML.push(await page.evaluate(t=>{window.__seek(t);return document.querySelector('[data-utility-card]').outerHTML;},card.start+t));
 assert.equal(cardHTML[0],cardHTML[1]);assert.equal(cardHTML[1],cardHTML[2]);
 const texts=await page.evaluate(()=>{window.__seek(33.5);return document.querySelector('[data-utility-card]').textContent;});
 for(const text of ['آروم صحبت کن','نظر اضافه نده','دست دوستت رو بگیر'])assert.ok(texts.includes(text));
 assert.deepEqual(errors,[]);
 const report={passed:true,attachmentScenesUnchanged:true,sourceAttachmentSha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT,'input/scenarios/scenario-10.json'))).digest('hex'),protectedPreviousVideos:Object.keys(before).length,timeSamples:samples.length*2,perSceneHoldsHonored:true,steppedPoses12fps:true,deterministicLineBoil12fps:true,smoothCameraWithinPoseBucket:true,utilityCardFullyVisibleFrom:1.1,utilityCardStableThrough:4.7,utilityCardStableSeconds:3.6,noVoice:true,bpm:96,browserErrors:errors};
 fs.writeFileSync(path.join(OUTDIR,'ink-qa.json'),JSON.stringify(report,null,2)+'\n');console.log(report);
}finally{await browser?.close();server.close();}
