import fs from 'node:fs';
import path from 'node:path';
import {serve,openScene,OUTDIR} from './lib.mjs';
fs.mkdirSync(OUTDIR,{recursive:true});
const server=await serve();let browser;
try{
 const session=await openScene(server);browser=session.browser;const {page}=session;
 const scenes=await page.evaluate(()=>window.__scenes.map(s=>({id:s.id,start:s.start,dur:s.dur})));
 await page.evaluate(t=>window.__seek(t),scenes.find(s=>s.id==='hero').start+2);
 await page.screenshot({path:path.join(OUTDIR,'style-frame.png')});
 for(const scene of scenes){await page.evaluate(t=>window.__seek(t),scene.start+scene.dur*.65);await page.screenshot({path:path.join(OUTDIR,`scene-${scene.id}.png`)});}
 await page.evaluate(()=>window.__seek(window.__duration-1.4));await page.screenshot({path:path.join(OUTDIR,'end-card.png')});
 await page.evaluate(()=>{
  const s=window.__scenes.find(s=>s.id==='win');window.__seek(s.start+2.2);
  document.getElementById('cap').innerHTML='<span class="line">ناخن شمارهٔ <span class="w on">۷</span></span><span class="line">مأموریت زنده‌موندن</span>';
  document.getElementById('eyebrow').textContent='یک تریلر کوچک، یک قهرمان خیلی کوچک';
  document.getElementById('counter').textContent='قسمت ۰۲';
 });
 await page.screenshot({path:path.join(OUTDIR,'cover.png')});
 await page.setViewportSize({width:1440,height:1450});
 await page.evaluate(()=>{
  const {defs,hero,gel,door,can,yarn,text}=window.Trailer;
  let art=defs+'<rect width="1440" height="1450" fill="#172839"/>';
  art+='<text x="45" y="55" direction="ltr" text-anchor="start" font-family="Vazirmatn" font-size="27" font-weight="800" fill="#f3d3a2">AYDA / MISSION 07</text>';
  art+=text('راهنمای کاراکتر — شمارهٔ ۷ و شوالیهٔ ژلی',1092,54,22,'#c2e9e3');
  for(const y of [92,369,716,1102])art+=`<path d="M35 ${y}H1405" stroke="#bcd8d9" opacity=".18"/>`;
  art+=text('شمارهٔ ۷ / قهرمانِ کوچک',345,124,20,'#f9c9d4')+text('ژل / شوالیهٔ درخشان',1050,124,20,'#c1f5e8');
  for(const o of [{x:220,view:0},{x:485,view:1}]){art+=hero({...o,y:303,s:1,t:1.1});art+=text(o.view?'سه‌رخِ سبک‌پردازی‌شده':'روبرو',o.x,355,14,'#c7cdd5');}
  for(const o of [{x:900,view:0},{x:1180,view:-1}]){art+=gel({...o,y:303,s:.95,t:1.1});art+=text(o.view?'سه‌رخِ سبک‌پردازی‌شده':'روبرو',o.x,355,14,'#c7cdd5');}
  const moods=['brave','shock','angry','tired','love','calm','wink','happy'];
  const names=['شجاع','متعجب','مصمم','خسته','عاشق','آرام','چشمک','خوشحال'];
  for(let row=0;row<2;row++)moods.forEach((mood,i)=>{const x=91+i*180,y=502+row*157;art+=(row?gel:hero)({x,y,s:.62,t:1.1+i*.2,mood});art+=text(names[i],x,y+39,14,'#d8dfdb');});
  art+=text('شش ژست برای هر قهرمان',720,754,21,'#f4d29d');
  const poses=['stand','point','cheer','crouch','run','sneak'],pn=['ایستاده','اشاره','پیروزی','پناه‌گرفتن','فرار','یواشکی'];
  for(let row=0;row<2;row++)poses.forEach((pose,i)=>{const x=121+i*240,y=886+row*155;art+=(row?gel:hero)({x,y,s:.66,t:1.2,pose:row&&i===4?'slash':pose,r:row?(i===3?-22:i===5?17:0):0,mood:i===4?'shock':'brave'});art+=text(row&&i===4?'حرکت شمشیر':pn[i],x,y+42,14,'#d8dfdb');});
  art+=text('دشمن‌ها — بامزه، نه ترسناک',720,1143,22,'#f4d29d');
  art+=door({x:290,y:1350,s:.65,t:1})+can({x:755,y:1340,s:.8,t:1})+yarn({x:1200,y:1320,s:1.05,t:1});
  art+=text('درِ ماشین',290,1407,18)+text('قوطی نوشابه',755,1407,18)+text('یک تار پشمی',1200,1407,18);
  document.body.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1450" style="width:1440px;height:1450px">${art}</svg>`;
  document.body.style.cssText='margin:0;width:1440px;height:1450px;overflow:hidden';
 });
 await page.screenshot({path:path.join(OUTDIR,'character-sheet.png')});
 if(session.errors.length)throw new Error(session.errors.join('\n'));
 console.log('Reel 02 style, cover, cast and scene frames:',OUTDIR);
}finally{await browser?.close();server.close();}
