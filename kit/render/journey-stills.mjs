import fs from 'node:fs';
import path from 'node:path';
import {serve,openScene,OUTDIR} from './lib.mjs';
fs.mkdirSync(OUTDIR,{recursive:true});const server=await serve();let browser;
try{
 const session=await openScene(server);browser=session.browser;const {page}=session;
 const scenes=await page.evaluate(()=>window.__scenes.map(s=>({id:s.id,start:s.start,dur:s.dur})));
 await page.evaluate(t=>window.__seek(t),scenes.find(s=>s.id==='glow').start+2.6);
 await page.screenshot({path:path.join(OUTDIR,'style-frame.png')});
 for(const s of scenes){await page.evaluate(t=>window.__seek(t),s.start+s.dur*.65);await page.screenshot({path:path.join(OUTDIR,`scene-${s.id}.png`)});}
 await page.evaluate(()=>window.__seek(window.__duration-1.4));await page.screenshot({path:path.join(OUTDIR,'end-card.png')});
 await page.evaluate(()=>{
  const s=window.__scenes.find(s=>s.id==='walk');window.__seek(s.start+1);
  document.getElementById('cap').innerHTML='<span class="line">ناخن شمارهٔ <span class="w on">۹</span></span><span class="line">از پا تا اوج</span>';
  document.getElementById('eyebrow').textContent='';document.getElementById('counter').textContent='قسمت ۰۴';
 });
 await page.screenshot({path:path.join(OUTDIR,'cover.png')});
 await page.setViewportSize({width:1440,height:1920});
 await page.evaluate(()=>{
  const J=window.Journey,Q=window.Sequel,T=window.Trailer,{text}=J;
  let art=J.defs+'<rect width="1440" height="1920" fill="#eee0d2"/>';
  art+='<text x="40" y="55" direction="ltr" text-anchor="start" font-family="Vazirmatn" font-size="27" font-weight="800" fill="#655370">AYDA / FROM TOE TO GLOW</text>';
  art+=text('شمارهٔ نُه — از پا تا اوج',1100,55,25,'#806278');
  const cast=[{f:J.nine,name:'نُه — پیش از سفر',opts:{mood:'tired'}},{f:J.nine,name:'نُه — با رنگ یاسی',opts:{glow:1,sandals:true}},{f:J.duck,name:'اردکِ حوله‌پوش',opts:{point:true}},{f:T.hero,name:'هفت',opts:{bandage:.4,armor:1}},{f:Q.rookie,name:'هشت',opts:{}},{f:T.gel,name:'ژل',opts:{}},{f:J.ten,name:'ده — سایهٔ شست',opts:{}}];
  cast.forEach((o,i)=>{const cx=103+i*205;art+=text(o.name,cx,117,18,'#705770');art+=o.f({x:cx,y:270,s:o.f===J.ten?.51:.62,t:1.2,...o.opts});});
  art+=text('هشت حالت نُه — قبل و بعد، روبرو و چرخشِ سبک‌پردازی',720,347,25,'#785c76');
  const moods=['brave','shock','angry','tired','love','calm','wink','happy'],names=['شجاع','متعجب','مصمم','خسته','عاشق','آرام','چشمک','خوشحال'];
  for(let row=0;row<2;row++)moods.forEach((mood,i)=>{const x=91+i*180,y=490+row*207;art+=J.nine({x,y,s:.6,t:1+i*.3,mood,glow:row,view:row?.6:0});art+=text(names[i],x,y+47,16,'#765d74');});
  const poses=['hug','wave','run','bounce','point','cheer'],pn=['جمع‌شده','دست‌تکان','دویدن','غلتیدن','اشاره','پیروزی'];
  art+=text('شش ژست اصلی — مسیر قهرمان',720,805,25,'#785c76');
  for(let row=0;row<2;row++)poses.forEach((pose,i)=>{const x=120+i*240,y=1005+row*235;art+=J.nine({x,y,s:.85,t:1.3,pose,glow:row,sandals:!!row,r:pose==='bounce'?35:0,mood:pose==='hug'?'tired':'happy'});art+=text(pn[i],x,y+55,18,'#765d74');});
  art+=text('اردک — دو حالت / همراه‌های قدیمی / تیزر ده',720,1357,25,'#785c76');
  art+=J.duck({x:135,y:1551,s:1.25,t:1,wink:true,point:true})+J.duck({x:365,y:1551,s:1.25,t:1,wink:false})+T.hero({x:610,y:1551,s:1.15,t:1,armor:1,bandage:.4,pose:'point'})+Q.rookie({x:833,y:1551,s:1.15,t:1,pose:'point'})+T.gel({x:1050,y:1551,s:1.15,t:1,pose:'point'})+J.ten({x:1290,y:1551,s:.95,t:1});
  art+=text('تصویرسازی ۲٫۵بعدی با SVG — نماها مدل سه‌بعدی واقعی نیستند.',720,1725,23,'#806b7e');
  art+=text('بدون تصویر استوک، بدون صدای واقعی؛ طراحی و موسیقی اختصاصی',720,1772,20,'#806b7e');
  document.body.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1920" style="width:1440px;height:1920px">${art}</svg>`;
  document.body.style.cssText='margin:0;width:1440px;height:1920px;overflow:hidden';
 });
 await page.screenshot({path:path.join(OUTDIR,'character-sheet.png')});
 if(session.errors.length)throw new Error(session.errors.join('\n'));
 console.log('Reel 04 stills ready:',OUTDIR);
}finally{await browser?.close();server.close();}
