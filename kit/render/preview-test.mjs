import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {ROOT,serve,openScene,OUTDIR,STEM} from './lib.mjs';
const server=await serve({home:'/preview.html'});let browser;
try{
 const session=await openScene(server,{width:1360,height:1000,scale:1});browser=session.browser;const {page,errors}=session;
 const base=`http://127.0.0.1:${server.address().port}`;
 await page.goto(base);await page.evaluate(()=>document.fonts.ready);
 const meta=await page.evaluate(()=>new Promise((resolve,reject)=>{
  const video=document.querySelector('video');
  const result=()=>resolve({width:video.videoWidth,height:video.videoHeight,duration:video.duration});
  if(video.readyState>=1)result();else{video.addEventListener('loadedmetadata',result,{once:true});video.addEventListener('error',()=>reject(new Error('Video metadata failed')),{once:true});}
 }));
 assert.equal(meta.width,1080);assert.equal(meta.height,1920);assert.equal(meta.duration,JSON.parse(fs.readFileSync(path.join(OUTDIR,'render-manifest.json'))).duration);
 for(const a of await page.locator('a[download]').all()){
  const href=await a.getAttribute('href');const response=await fetch(base+href,{headers:{Range:'bytes=0-15'}});
  assert.equal(response.status,206,href);assert.equal((await response.arrayBuffer()).byteLength,16);
 }
 await page.locator('[data-image="character-sheet.png"]').click();assert.equal(await page.locator('dialog').evaluate(el=>el.open),true);
 await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').evaluate(el=>el.open),false);
 await page.screenshot({path:path.join(OUTDIR,'preview-desktop.png')});
 await page.setViewportSize({width:390,height:844});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:path.join(OUTDIR,'preview-mobile.png'),fullPage:true});
 const invalid=await fetch(base+`/deliverables/${STEM}.mp4`,{headers:{Range:'bytes=999999999-'}});assert.equal(invalid.status,416);
 assert.deepEqual(errors,[]);
 const result={passed:true,video:meta,downloads:true,rangeRequests:true,invalidRange416:true,lightbox:true,mobileNoOverflow:true,browserErrors:errors};
 fs.writeFileSync(path.join(OUTDIR,'preview-qa.json'),JSON.stringify(result,null,2));console.log(result);
}finally{await browser?.close();server.close();}
