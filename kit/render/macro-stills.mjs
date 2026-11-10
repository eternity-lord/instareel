import fs from 'node:fs';
import path from 'node:path';
import {serve,openScene,OUTDIR} from './lib.mjs';
fs.mkdirSync(OUTDIR,{recursive:true});const server=await serve();let browser;
try{
 const session=await openScene(server);browser=session.browser;const {page}=session;
 const scenes=await page.evaluate(()=>window.__scenes.map(s=>({id:s.id,start:s.start,dur:s.dur})));
 for(const s of scenes){await page.evaluate(t=>window.__seek(t),s.start+s.dur*.65);await page.screenshot({path:path.join(OUTDIR,`scene-${s.id}.png`)});}
 await page.evaluate(t=>window.__seek(t),scenes.find(s=>s.id==='fix').start+2.1);await page.screenshot({path:path.join(OUTDIR,'style-frame.png')});
 await page.evaluate(()=>window.__seek(window.__duration-1.5));await page.screenshot({path:path.join(OUTDIR,'end-card.png')});
 await page.evaluate(t=>window.__seek(t),scenes.find(s=>s.id==='hook').start+1.7);
 await page.evaluate(()=>{document.getElementById('cap').innerHTML='<span class="line">چرا ژل ناخن</span><span class="line"><span class="w on">زود می‌پره؟</span></span>';document.querySelector('.macro-overlay').innerHTML='<svg viewBox="0 0 540 960"><text x="270" y="331" font-family="Vazirmatn" font-size="18" fill="#d9b88f" text-anchor="middle" direction="rtl">پنج علت رایج</text></svg>';});
 await page.screenshot({path:path.join(OUTDIR,'cover.png')});
 // Product/material study instead of the old cartoon cast sheet.
 await page.setViewportSize({width:1440,height:1220});
 await page.evaluate(()=>{document.body.className='';document.body.style.cssText='margin:0;width:1440px;height:1220px;background:#0b0a0c;overflow:hidden';document.body.innerHTML='<div style="padding:35px;color:#d9b88f;font:800 27px Vazirmatn;direction:ltr">AYDA / MATERIAL & MACRO STUDY</div><div id="studies" style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;padding:0 24px"></div>';});
 const samples=['hook','oil','skin','thick','seal','tool','fix','cta'];
 for(const id of samples){const buf=fs.readFileSync(path.join(OUTDIR,`scene-${id}.png`));await page.evaluate(({id,src})=>{const e=document.createElement('div');e.innerHTML=`<img src="${src}" style="width:100%;display:block"><p style="font:500 16px Vazirmatn;color:#d9b88f;text-align:center">${id}</p>`;document.querySelector('#studies').append(e);},{id,src:'data:image/png;base64,'+buf.toString('base64')});}
 await page.screenshot({path:path.join(OUTDIR,'character-sheet.png')});
 if(session.errors.length)throw new Error(session.errors.join('\n'));console.log('Macro stills:',OUTDIR);
}finally{await browser?.close();server.close();}
