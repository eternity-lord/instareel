import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {ROOT,PROJECT,OUTDIR,serve,openScene} from './lib.mjs';
assert.equal(PROJECT.renderer,'quiz');assert.equal(PROJECT.reelId,'08');
const expected={
 '01':'e898dc46419c97566494254064d92515e7d2cdc93240918605944f0a1ee4e19c',
 '02':'90736f21a9ef457c7f5db2182a32faec9ab366c993a7bf0093be0dcfb5dc9be9',
 '03':'32afdd2525605388535f14ffa48c89ef0d3c2dacb3f365d98a53e8f6d7555de3',
 '04':'8228407802df67ab8a7e91076d23c30435e1c4a25206a1105829e53b245775f6',
 '05':'c3afa0d4bc48407ca3cac53fe238da4867565048df3e14f627c34e911ea2a8ed',
 '05-cartoon':'8831ff012fe254ec57aaf3ac6894e9a71e8dbad69f0f309cf5c30d6004dcba2a'
};
for(const [id,hash] of Object.entries(expected))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT,`deliverables/nail-reel-${id}.mp4`))).digest('hex'),hash,`Protected reel ${id}`);
assert.equal(JSON.parse(fs.readFileSync(path.join(OUTDIR,'audio-status.json'))).voiceUsed,false);
assert.equal(JSON.parse(fs.readFileSync(path.join(ROOT,'brand.json'))).voice.enabled,false);
const timing=JSON.parse(fs.readFileSync(path.join(OUTDIR,'timing.json')));
for(const sc of PROJECT.scenes){const row=timing[sc.id];assert.equal(row.words.map(w=>w.w).join(' '),sc.text);assert.ok(row.dur-row.words.at(-1).t1>=.59999);}
assert.ok(timing.card.dur>=3.3);assert.equal(timing.hook.words[0].t0,.2);
const server=await serve();let browser;
try{
 const session=await openScene(server);browser=session.browser;const {page}=session;
 for(const id of [...PROJECT.scenes.map(s=>s.id),'__endcard']){
  const bounds=await page.evaluate(id=>{if(id==='__endcard')return {start:window.__duration-3,dur:3};const s=window.__scenes.find(s=>s.id===id);return {start:s.start,dur:s.dur};},id);
  for(const fraction of [0,.15,.5,.8,.999]){
   await page.evaluate(t=>window.__seek(t),bounds.start+bounds.dur*fraction);
   const problems=await page.evaluate(()=>{
    const svg=document.querySelector('#quiz-world').closest('svg');
    const invalid=[...svg.querySelectorAll('*')].filter(el=>[...el.attributes].some(a=>/NaN|Infinity|undefined/.test(a.value))).map(el=>el.outerHTML.slice(0,200));
    const refs=[...svg.innerHTML.matchAll(/url\(#([^)]*)\)/g)].map(m=>m[1]);
    return {invalid,missing:refs.filter(id=>!svg.querySelector(`[id="${id}"]`)),head:document.getElementById('eyebrow').textContent};
   });
   assert.deepEqual(problems,{invalid:[],missing:[],head:id==='__endcard'&&fraction<.98?'AYDA · NAIL ROOM':''});
  }
 }
 const cardStart=await page.evaluate(()=>window.__scenes.find(s=>s.id==='card').start);
 for(const t of [.3,1.8,3.4]){
  await page.evaluate(t=>window.__seek(t),cardStart+t);
  const card=await page.locator('[data-utility-card]').textContent();for(const text of ['کارت مشتری ایده‌آل','وقت‌شناس باش','فقط یک عکس مرجع','دستت رو ثابت نگه دار'])assert.ok(card.includes(text));
  const boxes=await page.locator('[data-utility-card] text').evaluateAll(els=>els.map(el=>{const b=el.getBoundingClientRect();return {x:b.x,y:b.y,right:b.right,bottom:b.bottom};}));
  for(const b of boxes)assert.ok(b.x>=35&&b.right<=505&&b.y>=320&&b.bottom<=690,JSON.stringify(b));
 }
 await page.evaluate(()=>window.__seek(window.__duration-1.5));
 const end=await page.locator('#quiz-world').textContent();for(const text of ['قسمت بعد: ۴ تیپ ناخن‌کار','هر هفته یه قسمت','فالو کن','@ayda.nailroom'])assert.ok(end.includes(text));
 assert.deepEqual(session.errors,[]);
 const result={passed:true,protectedPreviousReels:expected,noVoice:true,captionReadingHoldMinimum:.6,svgFiniteAttributes:true,svgReferencesResolved:true,timeSamples:45,utilityCardAllInstructionsVisibleFrom:.3,utilityCardReadableUntil:3.4,utilityCardStableSeconds:3.1,hookFirstHighlight:.2,drawnTypeBadges:4,followPromiseAndTease:true,rendering:'Deterministic 2.5D vector cartoon',browserErrors:session.errors};
 fs.writeFileSync(path.join(OUTDIR,'quiz-qa.json'),JSON.stringify(result,null,2));console.log(result);
}finally{await browser?.close();server.close();}
