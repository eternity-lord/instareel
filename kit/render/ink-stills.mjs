import fs from 'node:fs';
import path from 'node:path';
import {serve,openScene,OUTDIR} from './lib.mjs';
fs.mkdirSync(OUTDIR,{recursive:true});const server=await serve();let browser;
try{
 const session=await openScene(server);browser=session.browser;const {page}=session;
 const scenes=await page.evaluate(()=>window.__scenes.map(s=>({id:s.id,start:s.start,dur:s.dur})));
 for(const s of scenes){await page.evaluate(t=>window.__seek(t),s.start+s.dur*.68);await page.screenshot({path:path.join(OUTDIR,`scene-${s.id}.png`)});}
 for(const [name,time] of [['first-frame.png',0],['style-frame.png',1.9],['cover.png',.6],['utility-card.png',34.8],['emotional-hands.png',22.8],['end-card.png',42]]){await page.evaluate(t=>window.__seek(t),time);await page.screenshot({path:path.join(OUTDIR,name)});}
 await page.setViewportSize({width:1400,height:1460});
 await page.evaluate(()=>{
  const I=window.Ink;let a=I.defs+'<rect width="1400" height="1460" fill="#f5e7cb"/>';
  a+='<text x="45" y="62" font-family="Vazirmatn" font-size="30" font-weight="800" fill="#34303e">AYDA / INK DOODLE / 10</text>'+I.txt('همون رفیق‌ها؛ با خط‌های تازه',1090,62,24);
  const names=['نِیلی','مشتری','فیلم‌بردار','بازرس','خواب‌آلود','دوست واقعی'];
  for(let i=0;i<6;i++){const x=125+i*230;a+=I.blob(i,x,260,.87,1,'happy','wave')+I.txt(names[i],x,368,21);}
  const moods=['happy','shock','angry','sad','anxious','sleep','love','happy'];
  moods.forEach((m,i)=>{const x=155+i%4*360,y=570+Math.floor(i/4)*230;a+=I.blob(i%2,x,y,.88,1.3,m,i%3===0?'panic':'rest')+I.txt(['شاد','تعجب','کلافگی','غم','اضطراب','خواب','عشق','آرامش'][i],x,y+94,20);});
  a+=I.txt('چهار نشان؛ نه گلیف ایموجی',1100,1055,24);
  for(let i=0;i<4;i++)a+=I.badge(i,285+i*280,1140,1.15);
  a+=I.txt('خط جوهری لرزان / ژست ۱۲fps / دوربین نرم / رنگ خارج از رجیستر',700,1280,24);
  a+=I.txt('گرم و شلوغ ← آبی‌خاکستری ← طلایی و امن',700,1340,25);
  document.body.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="1460" viewBox="0 0 1400 1460">${a}</svg>`;
 });
 await page.screenshot({path:path.join(OUTDIR,'character-sheet.png')});
 console.log('Ink stills:',OUTDIR);
}finally{await browser?.close();server.close();}
