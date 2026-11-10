import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {ROOT,PROJECT,OUTDIR,serve,openScene} from './lib.mjs';
assert.equal(PROJECT.renderer,'education');assert.equal(PROJECT.reelId,'05-cartoon');
const expected={
 '01':'e898dc46419c97566494254064d92515e7d2cdc93240918605944f0a1ee4e19c',
 '02':'90736f21a9ef457c7f5db2182a32faec9ab366c993a7bf0093be0dcfb5dc9be9',
 '03':'32afdd2525605388535f14ffa48c89ef0d3c2dacb3f365d98a53e8f6d7555de3',
 '04':'8228407802df67ab8a7e91076d23c30435e1c4a25206a1105829e53b245775f6',
 '05':'c3afa0d4bc48407ca3cac53fe238da4867565048df3e14f627c34e911ea2a8ed'
};
for(const [id,hash] of Object.entries(expected))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT,`deliverables/nail-reel-${id}.mp4`))).digest('hex'),hash,`Protected reel ${id}`);
assert.equal(JSON.parse(fs.readFileSync(path.join(OUTDIR,'audio-status.json'))).voiceUsed,false);
assert.equal(JSON.parse(fs.readFileSync(path.join(ROOT,'brand.json'))).voice.enabled,false);
const timing=JSON.parse(fs.readFileSync(path.join(OUTDIR,'timing.json')));
for(const sc of PROJECT.scenes){const row=timing[sc.id];assert.equal(row.words.map(w=>w.w).join(' '),sc.text);assert.ok(row.dur-row.words.at(-1).t1>=.8999);}
assert.ok(!PROJECT.scenes.find(s=>s.id==='fix').text.includes('هفته'));
const server=await serve();let browser;
try{
 const session=await openScene(server);browser=session.browser;const {page}=session;
 const samples=[];
 for(const id of [...PROJECT.scenes.map(s=>s.id),'__endcard']){
  const bounds=await page.evaluate(id=>{if(id==='__endcard')return {start:window.__duration-3,dur:3};const s=window.__scenes.find(s=>s.id===id);return {start:s.start,dur:s.dur};},id);
  for(const fraction of [0,.15,.5,.8,.999]){
   await page.evaluate(t=>window.__seek(t),bounds.start+bounds.dur*fraction);
   const problems=await page.evaluate(()=>{
    const svg=document.querySelector('#education-world').closest('svg');
    const invalid=[...svg.querySelectorAll('*')].filter(el=>[...el.attributes].some(a=>/NaN|Infinity|undefined/.test(a.value))).map(el=>el.outerHTML.slice(0,200));
    const refs=[...svg.innerHTML.matchAll(/url\(#([^)]*)\)/g)].map(m=>m[1]);
    return {invalid,missing:refs.filter(id=>!svg.querySelector(`[id="${id}"]`)),head:document.getElementById('eyebrow').textContent};
   });
   assert.deepEqual(problems,{invalid:[],missing:[],head:id==='__endcard'&&fraction<.98?'AYDA · NAIL ROOM':''});samples.push({id,fraction});
  }
 }
 assert.deepEqual(session.errors,[]);
 const result={passed:true,protectedPreviousReels:expected,noVoice:true,captionReadingHoldMinimum:.9,cautiousOutcome:true,svgFiniteAttributes:true,svgReferencesResolved:true,samples:samples.length,originalCartoonCast:7,rendering:'Deterministic vector 2.5D; not a physical UV/water simulation',browserErrors:session.errors};
 fs.writeFileSync(path.join(OUTDIR,'education-qa.json'),JSON.stringify(result,null,2));console.log(result);
}finally{await browser?.close();server.close();}
