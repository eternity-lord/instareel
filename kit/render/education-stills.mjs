import fs from 'node:fs';
import path from 'node:path';
import {serve,openScene,OUTDIR} from './lib.mjs';
fs.mkdirSync(OUTDIR,{recursive:true});const server=await serve();let browser;
try{
 const session=await openScene(server);browser=session.browser;const {page}=session;
 const scenes=await page.evaluate(()=>window.__scenes.map(s=>({id:s.id,start:s.start,dur:s.dur})));
 for(const s of scenes){await page.evaluate(t=>window.__seek(t),s.start+s.dur*.65);await page.screenshot({path:path.join(OUTDIR,`scene-${s.id}.png`)});}
 await page.evaluate(t=>window.__seek(t),scenes.find(s=>s.id==='oil').start+2);await page.screenshot({path:path.join(OUTDIR,'style-frame.png')});
 await page.evaluate(()=>window.__seek(window.__duration-1.4));await page.screenshot({path:path.join(OUTDIR,'end-card.png')});
 await page.evaluate(t=>window.__seek(t),scenes.find(s=>s.id==='fix').start+2);
 await page.evaluate(()=>{document.getElementById('cap').innerHTML='<span class="line">ژل ناخنت چرا</span><span class="line"><span class="w on">زود می‌پره؟</span></span>';document.getElementById('eyebrow').textContent='';document.getElementById('counter').textContent='۵ دلیل رایج';});
 await page.screenshot({path:path.join(OUTDIR,'cover.png')});
 await page.setViewportSize({width:1440,height:1720});
 await page.evaluate(()=>{
  const Q=window.Education,{label}=Q;
  let a=Q.defs+'<rect width="1440" height="1720" fill="#25243f"/>';
  a+='<text x="38" y="55" text-anchor="start" direction="ltr" font-family="Vazirmatn" font-size="27" font-weight="800" fill="#e7d2b7">AYDA / GEL LIFTING — CARTOON EDITION</text>';
  a+=label('نِیلی، ژلی و پنج مزاحمِ اتصال',1070,55,23,'#d8c3e5');
  const cast=[{f:Q.nailie,name:'Nailie',o:{pose:'wave'}},{f:Q.blob,name:'Gely',o:{}},{f:Q.blob,name:'Oily',o:{type:'oily'}},{f:Q.skinny,name:'Skinny',o:{}},{f:Q.blob,name:'Thicc',o:{type:'thicc',cutaway:true}},{f:Q.blob,name:'Drippy',o:{type:'drippy'}},{f:Q.can,name:'Can-Tab',o:{}}];
  cast.forEach((c,i)=>{const x=102+i*206;a+=c.f({x,y:275,s:.84,t:1.1,...c.o});a+=`<text x="${x}" y="345" text-anchor="middle" direction="ltr" font-family="Vazirmatn" font-size="20" fill="#f0d7b7">${c.name}</text>`;});
  const moods=['happy','shock','angry','calm','wink','tired','love','happy'],names=['خوشحال','متعجب','مصمم','آرام','چشمک','خسته','عاشق','خوشحال'];
  a+=label('حالت‌های چهره و ژست‌های دو قهرمان',720,410,25,'#e0c9e5');
  for(let row=0;row<2;row++)moods.forEach((mood,i)=>{const x=90+i*180,y=578+row*230;a+=(row?Q.blob:Q.nailie)({x,y,s:.76,t:1.2+i*.3,mood});a+=label(names[i],x,y+57,15,'#d9c5d8');});
  const poses=['stand','cheer','hug','panic','point','stand'],pn=['ایستاده','پیروزی','در آغوش','وحشت','اشاره','غلتیدن'];
  for(let row=0;row<2;row++)poses.forEach((pose,i)=>{const x=120+i*240,y=1090+row*260;const opts={x,y,s:1.02,t:1.4,pose:i===5?'panic':pose,r:i===5?55:0,angle:i===5?20:0,mood:i===3?'shock':'happy'};a+=(row?Q.blob:Q.nailie)(opts);a+=label(pn[i],x,y+70,17,'#d9c5d8');});
  a+=label('کمدی آموزشی · تصویرسازی اختصاصی ۲٫۵بعدی · بدون گوینده',720,1596,23,'#e4d0bc');
  document.body.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1720" style="width:1440px;height:1720px">${a}</svg>`;document.body.style.cssText='margin:0;width:1440px;height:1720px;overflow:hidden';
 });
 await page.screenshot({path:path.join(OUTDIR,'character-sheet.png')});
 if(session.errors.length)throw new Error(session.errors.join('\n'));console.log('Cartoon educational stills:',OUTDIR);
}finally{await browser?.close();server.close();}
