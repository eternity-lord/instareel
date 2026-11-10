import fs from 'node:fs';
import path from 'node:path';
import {serve,openScene,OUTDIR} from './lib.mjs';
fs.mkdirSync(OUTDIR,{recursive:true});const server=await serve();let browser;
try{
 const session=await openScene(server);browser=session.browser;const {page}=session;
 const scenes=await page.evaluate(()=>window.__scenes.map(s=>({id:s.id,start:s.start,dur:s.dur})));
 await page.evaluate(t=>window.__seek(t),scenes.find(s=>s.id==='rookie').start+2.1);
 await page.screenshot({path:path.join(OUTDIR,'style-frame.png')});
 for(const s of scenes){await page.evaluate(t=>window.__seek(t),s.start+s.dur*.65);await page.screenshot({path:path.join(OUTDIR,`scene-${s.id}.png`)});}
 await page.evaluate(()=>window.__seek(window.__duration-1.4));await page.screenshot({path:path.join(OUTDIR,'end-card.png')});
 await page.evaluate(()=>{
  const s=window.__scenes.find(s=>s.id==='acetone');window.__seek(s.start+1.4);
  const g=document.getElementById('sequel-world');g.insertAdjacentHTML('beforeend',window.Sequel.rookie({x:128,y:673,s:.95,t:1,coat:true,skate:true}));
  document.getElementById('cap').innerHTML='<span class="line">ناخن شمارهٔ <span class="w on">۸</span></span><span class="line">انتقام استون</span>';
  document.getElementById('eyebrow').textContent='';document.getElementById('counter').textContent='قسمت ۰۳';
 });
 await page.screenshot({path:path.join(OUTDIR,'cover.png')});
 await page.setViewportSize({width:1440,height:2020});
 await page.evaluate(()=>{
  const Q=window.Sequel,T=window.Trailer,{text}=Q;
  let art=Q.defs+'<rect width="1440" height="2020" fill="#19303a"/>';
  art+='<text x="40" y="54" direction="ltr" text-anchor="start" font-family="Vazirmatn" font-size="27" font-weight="800" fill="#e7d49d">AYDA / ACETONE RETURNS</text>';
  art+=text('شمارهٔ ۸ — جهانِ تازه، رفقای قدیمی',1050,54,22,'#c5e4d5');
  const cast=[{f:T.hero,name:'شمارهٔ ۷',opts:{armor:1,bandage:.3}},{f:T.gel,name:'ژل',opts:{}},{f:Q.rookie,name:'شمارهٔ ۸',opts:{skate:true}},{f:Q.acetone,name:'استون',opts:{open:.8}},{f:Q.cotton,name:'ارتش پنبه',opts:{}},{f:Q.nine,name:'شمارهٔ ۹',opts:{}}];
  cast.forEach((o,i)=>{const cx=120+i*240;art+=text(o.name,cx,119,19,'#f0d2af');for(let j=0;j<2;j++)art+=o.f({x:cx-49+j*98,y:282,s:o.f===Q.acetone?.47:.52,t:1.2,view:j?1:0,r:j?7:0,...o.opts});art+=text('روبرو / سه‌رخِ سبک‌پردازی',cx,338,13,'#bad2cf');});
  const moods=['brave','shock','angry','tired','love','calm','wink','happy'];
  const names=['شجاع','متعجب','مصمم','خسته','عاشق','آرام','چشمک','خوشحال'];
  const actors=[{f:Q.rookie,label:'شمارهٔ ۸ — هشت حالت چهره',opts:{glasses:false}},{f:T.hero,label:'شمارهٔ ۷',opts:{armor:1}},{f:T.gel,label:'شوالیهٔ ژلی',opts:{}},{f:Q.nine,label:'شمارهٔ ۹ — غول خواب‌آلود',opts:{}}];
  actors.forEach((a,row)=>{const yy=495+row*164;art+=`<path d="M32 ${yy-132}H1408" stroke="#c1d4bd" opacity=".15"/>`;art+=text(a.label,720,yy-106,18,'#c9ded4');moods.forEach((mood,i)=>{const x=91+i*180;art+=a.f({x,y:yy,s:a.f===Q.nine?.47:.53,t:1.3+i*.2,mood,...a.opts});art+=text(names[i],x,yy+40,13,'#e0ddcd');});});
  const poses=['cool','point','cheer','hang','run','cool'],pn=['ژست اصلی','اشاره','پیروزی','آویزان','فرار','اسکیت'];
  art+=text('شش ژست — شمارهٔ ۸، شمارهٔ ۷، ژل و شمارهٔ ۹',720,1195,22,'#e8d49c');
  actors.forEach((a,row)=>{const y=1340+row*171;poses.forEach((pose,i)=>{const x=120+i*240;let options={pose,glasses:i!==3,skate:i===5,r:i===3?-18:i===4?14:0};if(a.f===T.hero)options.pose=i===3?'crouch':i===4?'run':pose==='cool'?'stand':pose;if(a.f===T.gel)options.pose=i===4?'slash':pose;art+=a.f({x,y,s:a.f===Q.nine?.55:.64,t:1.2,mood:i===3?'shock':'happy',...a.opts,...options});art+=text(pn[i],x,y+43,14,'#d9dfd2');});});
  document.body.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 2020" style="width:1440px;height:2020px">${art}</svg>`;
  document.body.style.cssText='margin:0;width:1440px;height:2020px;overflow:hidden';
 });
 await page.screenshot({path:path.join(OUTDIR,'character-sheet.png')});
 if(session.errors.length)throw new Error(session.errors.join('\n'));
 console.log('Reel 03 stills ready:',OUTDIR);
}finally{await browser?.close();server.close();}
