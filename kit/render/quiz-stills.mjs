import fs from 'node:fs';
import path from 'node:path';
import {serve,openScene,OUTDIR} from './lib.mjs';
fs.mkdirSync(OUTDIR,{recursive:true});const server=await serve();let browser;
try{
 const session=await openScene(server);browser=session.browser;const {page}=session;
 const scenes=await page.evaluate(()=>window.__scenes.map(s=>({id:s.id,start:s.start,dur:s.dur})));
 for(const s of scenes){await page.evaluate(t=>window.__seek(t),s.start+s.dur*.65);await page.screenshot({path:path.join(OUTDIR,`scene-${s.id}.png`)});}
 await page.evaluate(t=>window.__seek(t),scenes.find(s=>s.id==='shots').start+1.75);await page.screenshot({path:path.join(OUTDIR,'style-frame.png')});
 await page.evaluate(()=>window.__seek(window.__duration-1.4));await page.screenshot({path:path.join(OUTDIR,'end-card.png')});
 await page.evaluate(t=>window.__seek(t),scenes.find(s=>s.id==='card').start+1.8);await page.screenshot({path:path.join(OUTDIR,'utility-card.png')});
 await page.evaluate(()=>{window.__seek(.8);document.getElementById('cap').innerHTML='<span class="line">۴ تیپ مشتری ناخن</span><span class="line"><span class="w on">تو کدومی؟</span></span>';document.getElementById('eyebrow').textContent='';document.getElementById('counter').textContent='قصه‌های میز ناخن';});
 await page.screenshot({path:path.join(OUTDIR,'cover.png')});
 await page.setViewportSize({width:1400,height:1300});
 await page.evaluate(()=>{
  const Q=window.Quiz,{label}=Q;let a=Q.defs+'<rect width="1400" height="1300" fill="#25233c"/>';
  a+='<text x="40" y="57" direction="ltr" font-family="Vazirmatn" font-size="28" font-weight="800" fill="#efc992">AYDA / CLIENT TYPES — 08</text>'+label('کوییز هویتی، با پایان مهربان',1060,57,24,'#e0c9e9');
  const cast=[Q.hero,Q.client,Q.friend],names=['نِیلی / ناخن‌کار','مشتری / چهار رفتار','دوست / یک نظر تازه'];
  cast.forEach((f,i)=>{const x=260+i*440;a+=f({x,y:290,s:1.2,t:1.2,pose:'wave',mood:i===2?'wink':'happy'});a+=label(names[i],x,369,22,'#e4c5d9');});
  for(let i=0;i<4;i++){a+=Q.badge(i,250+i*300,465,1.05,0)+label(['ساعت‌نشناس','اسکرین‌شات‌باز','دوست‌آورنده','ناخن به‌جای ابزار'][i],250+i*300,535,21,'#ddc8e3');}
  const moods=['happy','shock','angry','tired','love','calm','wink','happy'],mn=['خوشحال','تعجب','مصمم','خسته','عاشق','آرام','چشمک','در حال حرف'];
  cast.forEach((f,row)=>moods.forEach((mood,i)=>{const x=88+i*175,y=714+row*169;a+=f({x,y,s:.73,t:1.3,pose:i===2?'point':i===1?'panic':i===4?'hug':'rest',mood,talk:i===7});a+=label(mn[i],x,y+47,15,'#dbc9de');}));
  a+=label('نشان‌ها ترسیمی‌اند؛ ایموجی‌های متن کپشن برای کامنت‌گذاشتن‌اند.',700,1221,21,'#e5d0b6');
  document.body.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 1300" style="width:1400px;height:1300px">${a}</svg>`;document.body.style.cssText='margin:0;width:1400px;height:1300px;overflow:hidden';
 });
 await page.screenshot({path:path.join(OUTDIR,'character-sheet.png')});
 if(session.errors.length)throw new Error(session.errors.join('\n'));console.log('Quiz stills:',OUTDIR);
}finally{await browser?.close();server.close();}
