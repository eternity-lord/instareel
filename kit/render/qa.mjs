import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {PNG} from 'pngjs';
function compare(a,b){
 const aa=PNG.sync.read(a).data,bb=PNG.sync.read(b).data;assert.equal(aa.length,bb.length);
 let max=0,total=0,changed=0;for(let i=0;i<aa.length;i++){const d=Math.abs(aa[i]-bb[i]);max=Math.max(max,d);total+=d;if(d>5)changed++;}
 const mean=total/aa.length,fraction=changed/aa.length;
 // SwiftShader raster cache/antialiasing can vary at subpixel edges on remount.
 // DOM equality is strict; visual MAE must stay below 0.1 of 255 (<0.04%).
 assert.ok(mean<.1&&fraction<.001,`Raster delta max=${max}, mean=${mean}, fraction=${fraction}`);
 return {maxChannelDelta:max,meanChannelDelta:mean,fractionOver5:fraction};
}
import fs from 'node:fs';
import path from 'node:path';
import {ROOT,serve,openScene,OUTDIR,PROJECT} from './lib.mjs';
const server=await serve();let browser;
try{
 const session=await openScene(server);browser=session.browser;const {page,errors}=session;
 const data=await page.evaluate(()=>({duration:window.__duration,scenes:window.__scenes}));
 assert.equal(data.scenes.length,PROJECT.scenes.length);assert.ok(data.duration>=(PROJECT.renderer==='quiz'?28:['macro','education'].includes(PROJECT.renderer)?30:PROJECT.renderer==='journey'?34:PROJECT.renderer==='sequel'?32:28)&&data.duration<=(PROJECT.renderer==='quiz'?34:['macro','education'].includes(PROJECT.renderer)?38:PROJECT.renderer==='journey'?42:PROJECT.renderer==='sequel'?40:['trailer','sequel','journey','macro','education','quiz'].includes(PROJECT.renderer)?36:38));
 const capture=async t=>{await page.evaluate(t=>window.__seek(t),t);return {dom:await page.content(),buf:await page.screenshot({type:'png'})};};
 const checks=[];
 for(const s of data.scenes){
  const t=s.start+s.dur*.65;
  const first=await capture(t);await capture(data.duration-.4);const again=await capture(t);
  assert.equal(first.dom,again.dom,`Random-access DOM idempotence: ${s.id}`);
  console.log('Comparing',s.id);const raster=compare(first.buf,again.buf);
  checks.push({scene:s.id,randomAccess:true,raster,hash:createHash('sha256').update(again.buf).digest('hex')});
 }
 // Every karaoke word is selectable, non-clipped and inside the phone safe region.
 let words=0;
 for(const s of data.scenes)for(const w of s.words){
  const state=await page.evaluate(t=>{
   window.__seek(t);const cap=document.getElementById('cap'),box=cap.getBoundingClientRect();
   const selected=[...cap.querySelectorAll('.on')].map(e=>e.textContent);
   return {selected,eyebrow:document.getElementById('eyebrow').textContent,boxes:[...cap.querySelectorAll('.w')].map(e=>{const b=e.getBoundingClientRect();return{x:b.x,y:b.y,right:b.right,bottom:b.bottom};}),loaded:document.fonts.check('800 34px Vazirmatn'),box:{y:box.y,bottom:box.bottom},emoji:/\p{Extended_Pictographic}/u.test(document.getElementById('stage').textContent)};
  },s.start+(w.t0+w.t1)/2);
  assert.deepEqual(state.selected,[w.w],`Highlight ${s.id}: ${w.w}`);
  assert.ok(state.loaded);assert.ok(!state.emoji);
  if(['trailer','sequel','journey','macro','education','quiz'].includes(PROJECT.renderer))assert.equal(state.eyebrow,'','Trailer must not have an extra heading above captions');
  for(const b of state.boxes)assert.ok(b.x>=15&&b.right<=525&&b.y>=125&&b.bottom<=310,JSON.stringify({scene:s.id,b}));
  words++;
 }
 const beginning=await capture(0),ending=await capture(data.duration-1/30);
 assert.equal(beginning.dom,ending.dom,'Loop boundary exact opening DOM');
 const loopRaster=compare(beginning.buf,ending.buf);
 // Ensure no global CSS animations or wall-clock timers drive the scene.
 const animations=await page.evaluate(()=>document.getAnimations().length);assert.equal(animations,0);
 assert.deepEqual(errors,[]);
 const report={passed:true,duration:data.duration,scenes:checks,checkedWords:words,trailerHeadingRemoved:['trailer','sequel','journey','macro','education','quiz'].includes(PROJECT.renderer),captionSafeZones:true,localFont:true,noEmoji:true,loopBoundaryDomIdentical:true,loopRaster,activeCssAnimations:animations,browserErrors:errors};
 fs.writeFileSync(path.join(OUTDIR,'qa.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
}finally{await browser?.close();server.close();}
