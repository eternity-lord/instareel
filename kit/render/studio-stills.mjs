import fs from 'node:fs';
import path from 'node:path';
import {ROOT,serve,openScene} from './lib.mjs';
const out=path.join(ROOT,'out');fs.mkdirSync(out,{recursive:true});
const server=await serve();let browser;
try{
 const session=await openScene(server);browser=session.browser;const page=session.page;
 const scenes=await page.evaluate(()=>window.__scenes.map(s=>({id:s.id,start:s.start,dur:s.dur})));
 // Full-production scene frame, not a separate mockup.
 await page.evaluate(t=>window.__seek(t),scenes.find(s=>s.id==='simple').start+3.4);
 await page.screenshot({path:path.join(out,'style-frame.png')});
 for(const s of scenes){await page.evaluate(t=>window.__seek(t),s.start+s.dur*.65);await page.screenshot({path:path.join(out,`scene-${s.id}.png`)});}
 await page.evaluate(t=>window.__seek(t),33.5);await page.screenshot({path:path.join(out,'end-card.png')});
 // Dedicated thumbnail: exact same illustration system, short readable cover line.
 await page.evaluate(()=>{
  window.__seek(1.2);
  document.getElementById('cap').innerHTML='<span class="line">۵ جمله‌ای که هر</span><span class="line"><span class="w on">ناخن‌کار</span> می‌شنوه!</span>';
  document.getElementById('counter').textContent='قصه‌های میز ناخن';
 });
 await page.screenshot({path:path.join(out,'cover.png')});
 // Character bible. Both cast get 8 expressions + 6 distinct silhouettes/poses.
 await page.setViewportSize({width:1200,height:1030});
 await page.evaluate(()=>{
  const {defs,character,label,pill}=window.Studio;
  let svg=defs+'<rect width="1200" height="1030" fill="#29223d"/><path d="M35 106H1165M35 355H1165M35 657H1165" stroke="#92779f" stroke-opacity=".35"/>';
  svg+='<text x="45" y="55" direction="ltr" text-anchor="start" fill="#f2c989" font-size="27" font-family="Vazirmatn" font-weight="800">AYDA / ORIGINAL CAST</text>';
  svg+=label('نِیلی و مشتری کوچولو — راهنمای کاراکتر',890,54,20);
  const intro=[{x:150,type:'hero',v:0},{x:350,type:'hero',v:1},{x:720,type:'client',v:0},{x:920,type:'client',v:-1}];
  intro.forEach(o=>{svg+=character({x:o.x,y:296,s:1.05,t:1.1,type:o.type,view:o.v});svg+=label(o.v?'سه‌رخ':'روبرو',o.x,348,15,'#ddc3e2');});
  svg+=label('نِیلی / ناخن‌کار',250,135,19,'#f6c6db')+label('مشتری / همیشه یه درخواست تازه',830,135,19,'#f6d6b3');
  const moods=['happy','shock','angry','tired','love','calm','wink','happy'];
  const names=['خوشحال','متعجب','عصبانی','خسته','عاشق','آرام','چشمک','در حال حرف'];
  for(let row=0;row<2;row++)moods.forEach((m,i)=>{const x=83+i*147,y=470+row*133;svg+=character({x,y,s:.62,type:row?'client':'hero',mood:m,t:1.1,talk:i===7});svg+=label(names[i],x,y+45,13,'#ddc4dd');});
  svg+=label('شش ژست — هر دو کاراکتر',600,693,20,'#f3ca88');
  const poses=['rest','wave','point','panic','hug','rest'];
  const pn=['استراحت','سلام','اشاره','وحشت','ذوق','نشسته'];
  for(let row=0;row<2;row++)poses.forEach((pose,i)=>{const x=100+i*200,y=809+row*139;svg+=character({x,y,s:.69,type:row?'client':'hero',pose,t:1.2,angle:i===5?-12:0,mood:i===3?'shock':i===4?'love':'happy'});svg+=label(pn[i],x,y+48,14,'#dfc5df');});
  document.body.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1030" style="width:1200px;height:1030px">${svg}</svg>`;
  document.body.style.cssText='margin:0;width:1200px;height:1030px;overflow:hidden';
 });
 await page.screenshot({path:path.join(out,'character-sheet.png')});
 console.log('Stills ready:',out);
 if(session.errors.length)throw new Error(session.errors.join('\n'));
}finally{await browser?.close();server.close();}
