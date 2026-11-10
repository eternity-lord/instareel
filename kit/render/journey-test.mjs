// Journey-specific contract: portal endpoints, transformation beats and preserved inputs/videos.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {PNG} from 'pngjs';
import {ROOT,OUTDIR,serve,openScene,PROJECT} from './lib.mjs';
assert.equal(PROJECT.renderer,'journey');
const original=JSON.parse(fs.readFileSync(path.join(ROOT,'input/scenarios/scenario-04.json')));
const {reelId,renderer,audioStyle,...content}=PROJECT;assert.deepEqual(content,original);
const timing=JSON.parse(fs.readFileSync(path.join(OUTDIR,'timing.json')));
for(const scene of Object.values(timing))assert.ok(Math.abs(scene.dur-scene.words.at(-1).t1-.7)<.00002,'0.7-second reading hold');
assert.deepEqual(timing.glow.words.map(w=>w.t0),[0,.6,1.2]);
const prior={
 '01':'e898dc46419c97566494254064d92515e7d2cdc93240918605944f0a1ee4e19c',
 '02':'90736f21a9ef457c7f5db2182a32faec9ab366c993a7bf0093be0dcfb5dc9be9',
 '03':'32afdd2525605388535f14ffa48c89ef0d3c2dacb3f365d98a53e8f6d7555de3'
};
for(const [id,sha] of Object.entries(prior))assert.equal(createHash('sha256').update(fs.readFileSync(path.join(ROOT,`deliverables/nail-reel-${id}.mp4`))).digest('hex'),sha);
const server=await serve();let browser;
try{
 const session=await openScene(server);browser=session.browser;const {page}=session;
 const portals=[];
 for(let i=0;i<9;i++){
  await page.evaluate(i=>{const J=window.Journey;document.querySelector('#journey-world').innerHTML=J.scene(J.ids[i],1,J.durations[i]);},i);
  const a=PNG.sync.read(await page.screenshot()).data;
  await page.evaluate(i=>{const J=window.Journey;document.querySelector('#journey-world').innerHTML=J.scene(J.ids[i+1],0,0);},i);
  const b=PNG.sync.read(await page.screenshot()).data;
  let delta=0;for(let j=0;j<a.length;j++)delta+=Math.abs(a[j]-b[j]);
  assert.ok(delta/a.length<.01,`Portal ${i}: ${delta/a.length}`);portals.push({from:PROJECT.scenes[i].id,to:PROJECT.scenes[i+1].id,meanChannelDelta:delta/a.length});
 }
 const phases=await page.evaluate(()=>[.3,.9,1.5].map(t=>{
  const html=window.Journey.shot('glow',t/3.6,t);
  return {lilac:html.includes(`d="M-83 2Q-92-52-66-91Q-45-121 0-124Q53-125 75-88Q96-51 82 7Q0 50-83 2Z" fill="url(#lilac)"`),gem:html.includes('fill="url(#gem04)"')};
 }));
 assert.deepEqual(phases,[{lilac:false,gem:false},{lilac:true,gem:false},{lilac:true,gem:true}]);
 const svgSamples=await page.evaluate(()=>{
  const J=window.Journey;let count=0;
  for(const id of J.ids)for(const p of [0,.15,.4,.65,.9,.99]){
   const str=J.scene(id,p,p*J.durations[J.ids.indexOf(id)]);
   if(/NaN|Infinity|undefined/.test(str))throw new Error('Nonfinite SVG '+id);
   const doc=new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${J.defs}${str}</svg>`,'image/svg+xml');
   if(doc.querySelector('parsererror'))throw new Error('Malformed SVG '+id);
   const list=[...doc.querySelectorAll('[id]')].map(e=>e.id);if(new Set(list).size!==list.length)throw new Error('Duplicate SVG id '+id);
   count++;
  }return count;
 });
 assert.deepEqual(session.errors,[]);
 const result={passed:true,originalScenarioUnchanged:true,priorVideoSha256:prior,lastWordHold:.7,bpm:100,glowPhases:phases,portals,validSvgSamples:svgSamples,browserErrors:session.errors};
 fs.writeFileSync(path.join(OUTDIR,'journey-qa.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}finally{await browser?.close();server.close();}
