/* Reel 08: an identity quiz, not a phrase list. Original analytical SVG animation. */
(()=>{
'use strict';
const S=window.Studio,{character,nail,label,pill,star}=S;
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>1-(1-clamp(x))**3;
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
const spring=x=>x<=0?0:1-Math.exp(-7*x)*Math.cos(x*10);
const tr=(x,y,s=1,r=0)=>`translate(${x} ${y}) rotate(${r}) scale(${s})`;
const titles=['ساعت‌نشناس','اسکرین‌شات‌باز','دوست‌آورنده','ناخن به‌جای ابزار'];
const colors=['#f2c881','#b9cfdc','#cdb5e8','#b9d5c2'];
const defs=S.defs+`<defs>
<radialGradient id="qLav" cx="28%" cy="18%" r="90%"><stop stop-color="#e7dcff"/><stop offset=".4" stop-color="#c0a2e9"/><stop offset="1" stop-color="#705289"/></radialGradient>
<linearGradient id="qPaper" x2=".7" y2="1"><stop stop-color="#fff3db"/><stop offset="1" stop-color="#d9c0d7"/></linearGradient>
<linearGradient id="qMetal" x2="1" y2=".3"><stop stop-color="#4d7786"/><stop offset=".35" stop-color="#cfdfdc"/><stop offset=".7" stop-color="#799eab"/><stop offset="1" stop-color="#3e5378"/></linearGradient>
<radialGradient id="qWarm"><stop stop-color="#fce0a8" stop-opacity=".48"/><stop offset="1" stop-color="#fce0a8" stop-opacity="0"/></radialGradient>
</defs>`;
function icon(type,x=0,y=0,s=1,t=0){
 let a='';
 if(type===0){a=`<circle r="23" fill="#fff1d7" stroke="#795d78" stroke-width="3"/><path d="M0-15V0L${9*Math.cos(t)} ${8*Math.sin(t)}" fill="none" stroke="#795d78" stroke-width="3.5" stroke-linecap="round"/><path d="M-14-24L-24-15M14-24L24-15" stroke="#795d78" stroke-width="5" stroke-linecap="round"/><circle r="3" fill="#b9808e"/>`;}
 if(type===1)a='<rect x="-27" y="-17" width="54" height="37" rx="7" fill="#69728e" stroke="#f4e5d9" stroke-width="2"/><path d="M-15-17L-10-25H9L14-17" fill="#69728e"/><circle r="13" fill="#c5e4df" stroke="#f4e5d9" stroke-width="3"/><circle r="6" fill="#5e7993"/><rect x="17" y="-10" width="5" height="4" rx="1" fill="#efcc9b"/>';
 if(type===2)a='<circle cx="-12" cy="-10" r="12" fill="#9c7eb7"/><circle cx="15" cy="-6" r="11" fill="#f1c6ad"/><path d="M-34 23Q-34 0-13 1Q4 1 5 23Z" fill="#9c7eb7"/><path d="M0 25Q0 5 15 5Q32 5 34 25Z" fill="#f1c6ad"/><path d="M-18-12Q-12-7-6-12M10-7Q15-3 20-7" stroke="#51425e" stroke-width="2" fill="none"/>';
 if(type===3)a='<path d="M-17-25H17L19 22Q0 33-19 22Z" fill="url(#qMetal)" stroke="#d9e7df" stroke-width="2"/><ellipse cy="-25" rx="17" ry="6" fill="#b7cfce" stroke="#f7eddd"/><ellipse cy="-25" rx="5" ry="9" fill="#465976" stroke="#f5e4d6" stroke-width="2"/><path d="M-12 6H12M-10 13H10" stroke="#f6d5df" stroke-width="3"/>';
 if(type===4)a='<path d="M-18 19L-27 3Q-29-4-23-5L-13 4V-19Q-12-28-6-22V-29Q0-37 5-27V-23Q10-31 15-23V-15Q21-24 25-15V7Q24 26 7 28H-3Z" fill="#ecc7af" stroke="#fff1da" stroke-width="2"/><path d="M-16-28L27 28" stroke="#a15d7a" stroke-width="5" stroke-linecap="round"/>';
 if(type===5)a='<path d="M-17-26H17V28L0 16-17 28Z" fill="#bf9dcf" stroke="#ead7ea" stroke-width="3"/>';
 if(type===6)a='<path d="M-28-3L30-28 9 31-3 9Z" fill="url(#gold)" stroke="#f6dfb3" stroke-width="2"/><path d="M-3 9L30-28" stroke="#ad7a61" stroke-width="2"/>';
 return `<g transform="${tr(x,y,s)}">${a}</g>`;
}
function badge(i,x,y,s=1,t=0,number=true){return `<g transform="${tr(x,y,s)}"><ellipse cy="5" rx="42" ry="40" fill="#1e1b33" opacity=".25"/><circle r="39" fill="${colors[i]}" stroke="#fff1dd" stroke-width="2"/>${icon(i,0,0,.92,t)}${number?`<circle cx="27" cy="28" r="12" fill="#4a365e" stroke="#e8d9eb"/>${label('۱۲۳۴'[i],27,33,15,'#fff2dc')}`:''}</g>`;}
function friend(o={}){return character({type:'client',...o}).replaceAll('url(#cream)','url(#qLav)').replaceAll('#ffe6ce','#e8d6f6');}
const hero=o=>character({type:'hero',...o}),client=o=>character({type:'client',...o});
function bubbles(text,x,y,w=140){return `<g transform="${tr(x,y)}"><path d="M${-w/2+14}-24H${w/2-14}Q${w/2}-24 ${w/2}-10V10Q${w/2} 24 ${w/2-14} 24H15L-1 38-3 24H${-w/2+14}Q${-w/2} 24 ${-w/2} 10V-10Q${-w/2}-24 ${-w/2+14}-24Z" fill="#e8d5eb" stroke="#f5e4ec" stroke-opacity=".6"/>${label(text,0,7,17,'#4e365c')}</g>`;}
function heart(x,y,s=1,r=0){return `<path transform="${tr(x,y,s,r)}" d="M0 10C-27-7-12-26 0-13C12-26 27-7 0 10Z" fill="#f3a7c6"/>`;}
function glitter(t){let a='';for(let i=0;i<11;i++)a+=star(70+i*39,375+(i*53)%278,.14+.16*(.5+.5*Math.sin(t*5+i)),'#f4d6ab',t*24+i*13);return a;}
function photo(x,y,s=1,r=0,design=0,t=0){return `<g transform="${tr(x,y,s,r)}"><rect x="-40" y="-56" width="80" height="108" rx="8" fill="url(#qPaper)" stroke="#f5e9e6" stroke-width="2"/><rect x="-33" y="-48" width="66" height="77" rx="5" fill="${['#bcb0d4','#d0b8b5','#9cbebc','#d6c190'][design%4]}"/>${nail(0,21,.62,0,design%5,t)}<path d="M-23 40H23" stroke="#b39dbb" stroke-width="3" stroke-linecap="round"/></g>`;}
function phone(x,y,s=1,r=0,t=0){return `<g transform="${tr(x,y,s,r)}"><rect x="-32" y="-59" width="64" height="118" rx="12" fill="url(#phone)" stroke="#d3c4e2" stroke-width="3"/><rect x="-26" y="-46" width="52" height="87" rx="6" fill="#b8abcf"/>${nail(0,30,.63,0,2,t)}<path d="M-8 49H8" stroke="#e6d6e9" stroke-width="3" stroke-linecap="round"/></g>`;}
function notebook(t){const flip=1+.05*Math.sin(t*4);return `<g transform="${tr(258,496,flip,-8)}"><ellipse cy="71" rx="128" ry="17" fill="url(#ao)"/><rect x="-105" y="-77" width="210" height="146" rx="10" fill="#8e719f" stroke="#b494c6" stroke-width="4"/><path d="M0-75V66" stroke="#55415f" stroke-width="5"/><path d="M-97-68Q-48-82-6-65V56Q-48 43-97 57Z" fill="url(#qPaper)"/><path d="M6-65Q48-82 97-68V57Q48 43 6 56Z" fill="url(#qPaper)"/>${label('لقب‌های',-51,-37,16,'#654b70')}${label('خیلی محرمانه!',48,-37,14,'#654b70')}${[-1,1].map((side,i)=>`${label(i?'عین همین!':'ترافیک بود!',side*50,-5,13,'#8a5e7e')}<path d="M${side*50-34} ${-12+Math.sin(t*3+i)*4}l68 ${8+Math.sin(t*3)*3}" stroke="#b45d86" stroke-width="${2.4+Math.sin(t*4)*.6}" stroke-linecap="round"/>`).join('')}<path d="M-81 29H-22M22 29H81" stroke="#ad90af" stroke-width="3" stroke-dasharray="9 6"/></g>`;}
function usefulCard(t){
 const y=358+Math.max(0,1-ease(t/.22))*30;
 return `<g data-utility-card="true" transform="translate(0 ${y})"><rect x="58" width="424" height="286" rx="23" fill="url(#qPaper)" stroke="#fcf0e1" stroke-width="3"/><path d="M79 58H461" stroke="#c0a7c7" stroke-width="1.5"/>${label('کارت مشتری ایده‌آل',270,39,25,'#54385f')}${[0,1,4].map((n,i)=>{const yy=100+i*67;return icon(n,420,yy,.64,0)+label(['وقت‌شناس باش','فقط یک عکس مرجع','دستت رو ثابت نگه دار'][i],248,yy+7,20,'#5c4266')+`<path d="M94 ${yy}l7 7 12-15" stroke="#5d8b7f" stroke-width="4" stroke-linecap="round" fill="none"/>`;}).join('')}${icon(5,75,18,.65+Math.sin(t*4)*.025)}</g>`;
}
function scene(id,p,t){
 let a='',world=S.room(t,id==='payoff'?'warm':'normal');let scale=1+.025*p,dx=0,dy=0,rot=0;
 const H=o=>hero({x:153,y:639,s:1.02,t,...o}),C=o=>client({x:383,y:639,s:.97,t:t+.4,...o});
 if(id==='hook'){
  a+=S.desk(t,{lamp:false})+H({mood:'wink',pose:'point'})+C({mood:'happy',pose:'rest'})+notebook(t);
  const slam=.82+.18*spring(t/.22);a+=`<g transform="${tr(271,351,slam,-5+Math.sin(t*2))}"><rect x="-141" y="-32" width="282" height="64" rx="18" fill="url(#gold)" stroke="#ffe6b6" stroke-width="2"/>${label('۴ تیپ مشتری',0,13,33,'#4b3558')}${star(-144,-29,.65)}${star(144,25,.5)}</g>`;
  a+=glitter(t);scale=1+.04*ease(t/.8);
 }else if(id==='late'){
  const enter=ease(t/.7),hands=t<1.2?t*12:Math.PI*1.7;
  a+=S.desk(t,{lamp:false})+H({mood:'tired',pose:t>2?'panic':'rest'})+C({x:570-enter*187,mood:'happy',pose:t>1.9?'panic':'wave'});
  a+=`<g transform="${tr(470-enter*48,590,.6,-8)}"><path d="M-19-25H19L15 24H-15Z" fill="#e6ccb0" stroke="#ffead1" stroke-width="2"/><ellipse cy="-25" rx="22" ry="7" fill="#6f5268"/><path d="M22-15Q43-18 35-1L18 3" stroke="#ead3b7" stroke-width="6" fill="none"/><path d="M-6-40Q6-48-2-57" stroke="#e8d9dd" opacity=".5" fill="none"/></g>`;
  a+=badge(0,282,400,1.15,hands)+pill('۴۰ دقیقه بعد…',281,453,159,'#e4cba8');
  a+=bubbles(t<1.7?'ترافیک بود!':'ده دقیقه‌ای تمومه؟',382,507,t<1.7?143:185);
  if(t>1.9){a+=`<g opacity="${ease((t-1.9)/.2)}">`;for(const side of [-1,1])for(let i=0;i<5;i++)a+=`<path d="M${382+side*(52+i*8)} 552v-18" stroke="#ffe0c1" stroke-width="6" stroke-linecap="round"/>`;a+='</g>';a+=`<path d="M123 589l8-4-3 8 8-3" fill="none" stroke="#73486c" stroke-width="2"/>`;}
  dx=Math.sin(t*4)*5;rot=Math.sin(t*3)*.8;
 }else if(id==='shots'){
  a+=S.desk(t,{lamp:false})+H({mood:'shock',pose:'panic'})+C({mood:'happy',pose:'point'})+phone(391,537,.75,-12,t);
  // Forty distinct cards leave the phone, then form a visible pile around the artist.
  for(let i=0;i<40;i++){
   const q=clamp((t-.25-i*.027)/1.1),land=smooth(q),x=(1-land)*391+land*(91+(i*47)%164),y=(1-land)*492+land*(649-(i%6)*16)-Math.sin(q*Math.PI)*(100+i%4*17);
   if(t>=.25+i*.027)a+=photo(x,y,.40+(i%4)*.015,(i*23)%40-20,i,t);
  }
  a+=badge(1,289,381,.9,0)+bubbles('عین همین!',392,440,133);
  if(t>2.2)a+=photo(302,496,.65,-8,3,t);
  dy=t<1.9?Math.sin(t*38)*2:0;
 }else if(id==='friend'){
  const design=Math.floor(t/1.05)%4;
  a+=S.desk(t,{lamp:false})+H({mood:'angry',pose:'panic'})+C({mood:'shock',pose:'point'});
  a+=friend({x:444,y:540,s:.55,t,mood:'wink',pose:'wave',view:-1});
  a+=`<path d="M423 513Q414 516 407 522M427 522L409 529" fill="none" stroke="#e5cdec" stroke-width="2" stroke-linecap="round"/>`;
  a+=`<g transform="${tr(267,517,.84,(design%2?1:-1)*4)}"><rect x="-65" y="-116" width="130" height="155" rx="17" fill="#b5a1c9" stroke="#e8d0e4" stroke-width="2"/>${nail(0,5,.97,0,[1,4,2,4][design],t)}${label(['گل!','خط‌خطی!','نگین!','باز خط‌خطی!'][design],0,29,15,'#493459')}</g>`;
  a+=`<g transform="${tr(150,501,1,t*600)}"><path d="M-42 0Q0-10 42 0Q0 11-42 0Z" fill="#f7c8df" opacity=".65"/><path d="M0-23Q12 0 0 23Q-12 0 0-23Z" fill="#f7c8df" opacity=".4"/></g>`;
  a+=badge(2,377,375,.79)+bubbles('یه نظر دیگه…',433,438,132);dx=Math.sin(t*6)*3;
 }else if(id==='tool'){
  const action=Math.floor(t/1.1)%3,crack=ease((t-1.55)/.55);
  a+=S.desk(t,{lamp:false})+H({mood:'tired',view:t>2?0:1})+C({mood:t>2.2?'happy':'shock',pose:'point',view:t>2?0:-1});
  a+=badge(3,267,375,.85);
  if(action===0)a+=`<g transform="${tr(281,517,1)}"><path d="M-36-70H36V9Q0 28-36 9Z" fill="url(#qMetal)" stroke="#e2e5de" stroke-width="2"/><ellipse cy="-70" rx="36" ry="12" fill="#b6d0cf"/><ellipse cy="-71" rx="9" ry="17" fill="#5b7081" stroke="#f5dfd4" stroke-width="3"/></g>`;
  else a+=`<g transform="${tr(285,505,1)}"><path d="M-53-50L20-66 60-40V28L-20 46-53 21Z" fill="#cbaaa4" stroke="#efcfba" stroke-width="2"/><path d="M-53-50L-20-23 60-40M-20-23V46" fill="none" stroke="#8d6b88" stroke-width="2"/><path d="M-12-5L30-14 31 11-11 19Z" fill="#f2e1ca"/><path d="M-8 0L23-6M-8 6L23 0" stroke="#97728c" stroke-width="2"/>${action===1?'<path d="M20-10L47-29 34 7 22 12Z" fill="#fce9cf"/>':''}</g>`;
  a+=`<g transform="${tr(344,560,1,-50+crack*9)}">${nail(0,0,.8,0,0,t)}<path d="M-18-45L-3-38-11-26 10-19" stroke="#654463" stroke-width="2.5" fill="none" opacity="${crack}"/></g>`;
  a+=bubbles(t>2?'خودش شکست!':'فقط یه لحظه…',382,423,160);
  if(crack>.1)a+=`<g opacity="${crack}">${label('تَق!',209,485,26,'#f3c98f')}${star(224,513,.6,'#f6ce99')}</g>`;
  dy=Math.sin(t*7)*(1-crack);
 }else if(id==='payoff'){
  const melt=smooth((t-.7)/1.2);
  world+=`<circle cx="300" cy="492" r="320" fill="url(#qWarm)"/>`;
  a+=S.desk(t,{lamp:false})+C({mood:'love',pose:'hug'});
  a+=`<g transform="translate(153 648) scale(${1+melt*.65} ${1-melt*.64}) translate(-153 -648)">${H({mood:'love',pose:'hug'})}</g>`;
  a+=bubbles('دستت درد نکنه!',371,435,189);
  a+=`<g transform="${tr(264,521,.9,-11)}"><ellipse cy="12" rx="54" ry="14" fill="url(#ao)"/>${nail(-30,0,.9,-15,2,t)}${nail(10,-6,.98,3,1,t)}${nail(45,6,.82,17,0,t)}</g>`;
  for(let i=0;i<4;i++){const q=clamp(t/3.1);a+=`<g opacity="${1-q}">${icon(i,88+i*123,442-q*90,.4,q*4)}</g>`;}
  for(let i=0;i<7;i++)a+=heart(95+i*59,571-((t*37+i*29)%155),.23+(i%3)*.05,Math.sin(t+i)*15);
  a+=glitter(t);dy=-p*9;
 }else if(id==='card'){
  a+=usefulCard(t)+H({x:397,y:681,s:.6,mood:'calm',pose:'point'});
  scale=1; // Keep all three instructions readable for >3 seconds, without camera motion.
 }else if(id==='cta'){
  a+=S.desk(t,{lamp:false})+H({mood:'wink',pose:'point'})+C({mood:'happy',pose:'wave'});
  for(let i=0;i<4;i++){
   const x=91+i*120; a+=badge(i,x,417,1,0)+label(titles[i],x,490,12,'#ead6e7');
  }
  a+=pill('فقط نشان تیپت رو کامنت کن',270,533,327,'#ddc5e7');
  a+=icon(6,435+ease((t-1.4)/1)*90,607-ease((t-1.4)/1)*83,.8);
  a+=glitter(t);scale=1;
 }
 // Restrained cinema bars are consistent with the original cartoon series.
 return `<g transform="translate(${270+dx} ${520+dy}) rotate(${rot}) scale(${scale}) translate(-270 -520)">${world}${a}</g><rect width="540" height="86" fill="#19172f"/><rect y="808" width="540" height="152" fill="#19172f"/><rect width="540" height="960" fill="url(#grain)"/>`;
}
function endcard(p,t,brand){
 const fade=ease((p-.86)/.12);
 return `<g opacity="${1-fade}">${S.room(t,'warm')}<rect x="43" y="327" width="454" height="281" rx="25" fill="#2d2845" stroke="#bca1c6" stroke-width="1.5"/>${label('قسمت بعد: ۴ تیپ ناخن‌کار',270,375,27,'#f3d6a5')}${label('هر هفته یه قسمت',270,418,22,'#decae9')}${pill('فالو کن',270,450,182,'#f1ce91')}<text x="270" y="550" direction="ltr" text-anchor="middle" font-family="Vazirmatn" font-size="26" font-weight="800" fill="#f5e5dc">${brand.handle.replace(/[<>&]/g,'')}</text>${hero({x:159,y:683,s:.62,t,pose:'wave',mood:'happy'})}${client({x:380,y:683,s:.6,t,pose:'wave',mood:'love'})}<rect width="540" height="86" fill="#19172f"/><rect y="808" width="540" height="152" fill="#19172f"/></g><g opacity="${fade}">${scene('hook',0,0)}</g>`;
}
const ids=['hook','late','shots','friend','tool','payoff','card','cta'];
for(const id of [...ids,'__endcard'])registerScene(id,{mount(el){el.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 960" aria-hidden="true">${defs}<g id="quiz-world"></g></svg>`;},update(el,p,t,brand){el.querySelector('#quiz-world').innerHTML=id==='__endcard'?endcard(p,t,brand):scene(id,p,t);}});
window.Quiz={defs,hero,client,friend,icon,badge,label,pill,scene,usefulCard,ids};
})();
