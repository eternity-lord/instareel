/* Research-informed 08 recut: an identity quiz, not a phrase list. Original analytical SVG animation. */
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
function usefulCard(t){
 const y=358+Math.max(0,1-ease(t/.22))*30;
 return `<g data-utility-card="true" transform="translate(0 ${y})"><rect x="58" width="424" height="286" rx="23" fill="url(#qPaper)" stroke="#fcf0e1" stroke-width="3"/><path d="M79 58H461" stroke="#c0a7c7" stroke-width="1.5"/>${label('کارت مشتری ایده‌آل',270,39,25,'#54385f')}${[0,1,4].map((n,i)=>{const yy=100+i*67;return icon(n,420,yy,.64,0)+label(['وقت‌شناس باش','فقط یک عکس مرجع','دستت رو ثابت نگه دار'][i],248,yy+7,20,'#5c4266')+`<path d="M94 ${yy}l7 7 12-15" stroke="#5d8b7f" stroke-width="4" stroke-linecap="round" fill="none"/>`;}).join('')}${icon(5,75,18,.65)}</g>`;
}
// All numerical edit decisions are project hypotheses; see EDITING-PLAYBOOK.md.
function rail(current){let a='<g data-type-rail="true">';for(let i=0;i<4;i++){const x=170+i*67; a+=`<g opacity="${current<0||i<=current?1:.3}">${badge(i,x,324,.53,0)}</g>`;if(i<3)a+=`<path d="M${x+25} 324h16" stroke="${i<current?'#f5cf90':'#b59bbf'}" stroke-opacity=".55" stroke-width="2"/>`;}return a+'</g>';}
function stage(t,warm=false){return `<g opacity=".66">${S.room(t,warm?'warm':'normal')}</g><rect width="540" height="960" fill="#211d39" opacity=".18"/><ellipse cx="269" cy="546" rx="251" ry="263" fill="${warm?'url(#qWarm)':'url(#light)'}"/>`;}
function scene(id,p,t){
 let a='',cam=1,cy=550,dx=0;const isCard=id==='card';
 const H=o=>hero({x:144,y:647,s:1.08,t,...o}),C=o=>client({x:392,y:647,s:1.02,t:t+.4,...o});
 const table=()=>S.desk(t,{lamp:false});
 const chapter=['late','shots','friend','tool'].indexOf(id);
 if(id==='hook'){
  a+=table()+H({mood:'shock',pose:'panic'})+C({mood:'wink',pose:'point'});
  // A readable comic tableau from frame zero, not a logo or notebook intro.
  a+=phone(365,523,.8,-15,t);
  for(let i=0;i<9;i++)a+=photo(111+(i*41)%153,611-(i%4)*29-Math.sin(t*3+i)*3,.49,(i*17)%33-17,i,t);
  a+=`<g transform="${tr(270,409,.96+.04*spring(t/.2),-3)}"><rect x="-155" y="-34" width="310" height="68" rx="20" fill="url(#gold)" stroke="#ffe8bd" stroke-width="2"/>${label('۴ تیپ مشتری',0,13,35,'#4c3657')}</g>`;
  cam=1+.035*ease(t/.6);a+=rail(-1);
 }else if(id==='late'){
  const arrived=ease(t/.55),reaction=smooth((t-2)/.35);
  a+=table()+H({mood:reaction>.5?'tired':'shock',pose:'rest',view:reaction>.5?0:1})+C({x:554-arrived*162,pose:'wave'});
  a+=`<g transform="${tr(419,554,.83,-8)}"><path d="M-19-25H19L15 24H-15Z" fill="#dec4a9" stroke="#ffead1" stroke-width="2"/><ellipse cy="-25" rx="22" ry="7" fill="#6b4859"/><path d="M22-15Q43-18 35-1L18 3" stroke="#ead3b7" stroke-width="6" fill="none"/><path d="M-5-38Q7-46-1-56" fill="none" stroke="#efdde3" opacity=".5" stroke-width="2"/></g>`;
  a+=`<g transform="${tr(266,454,1.5)}">${icon(0,0,0,1,t<1.2?t*13:1.57)}</g>${label('۴۰',266,547,47,'#f5d29e')}${label('دقیقه بعد',266,570,15,'#e8d2e5')}`;
  a+=rail(chapter);cam=1+.045*(1-reaction);
 }else if(id==='shots'){
  const flow=ease((t-.35)/1.3),reaction=smooth((t-2.3)/.35);
  a+=table()+H({mood:'shock',pose:reaction>.3?'rest':'panic'})+C({mood:'happy',pose:'point'})+phone(389,516,.91,-12,t);
  for(let i=0;i<40;i++){
   const q=clamp((t-.32-i*.02)/1.0),f=smooth(q);
   if(t>=.32+i*.02)a+=photo(389*(1-f)+(90+(i*43)%155)*f,482*(1-f)+(655-i%5*17)*f-Math.sin(q*Math.PI)*95,.4+i%3*.02,(i*23)%38-19,i,t);
  }
  // Selected reference: after the avalanche, freeze the main result long enough to decode it.
  if(t>1.8)a+=photo(280,488,.86,-5,3,Math.min(t,2.8));
  a+=rail(chapter);cam=1+.07*flow*(1-reaction);
 }else if(id==='friend'){
  const beat=t<1.05?0:t<2.1?1:2,reaction=smooth((t-2.65)/.25);
  a+=table()+H({mood:reaction>.5?'tired':'angry',pose:'point'})+C({mood:'shock',pose:'hug'});
  a+=friend({x:447,y:531,s:.57,t,mood:'wink',pose:'wave',view:-1});
  a+=`<path d="M425 509l-16 9m18 0l-17 8" stroke="#dfc4e8" stroke-width="2" stroke-linecap="round"/>`;
  a+=`<g transform="${tr(267,517,.91)}"><rect x="-62" y="-126" width="124" height="166" rx="17" fill="#ac98bd" stroke="#e8d3e9" stroke-width="2"/>${nail(0,12,1.05,0,[1,4,2][beat],Math.min(t,2.7))}<g>${[0,1,2].map(i=>`<circle cx="${(i-1)*17}" cy="29" r="4" fill="${i===beat?'#f4cb8a':'#6b547f'}"/>`).join('')}</g></g>`;
  if(t<2.7)a+=`<g transform="${tr(143,503,.75,t*580)}"><path d="M-39 0Q0-9 39 0Q0 9-39 0Z" fill="#ffd0e1" opacity=".6"/></g>`;
  a+=rail(chapter);cam=1+.04*(1-reaction);
 }else if(id==='tool'){
  const lever=smooth((t-.35)/.75),crack=ease((t-1.4)/.3),look=smooth((t-2.1)/.3);
  a+=table()+H({mood:'tired',view:look>.5?0:1,pose:'rest'})+C({mood:look>.5?'wink':'happy',pose:'point'});
  a+=`<g transform="${tr(283,531,1.2)}"><path d="M-35-78H35V8Q0 29-35 8Z" fill="url(#qMetal)" stroke="#dae4dc" stroke-width="2"/><ellipse cy="-78" rx="35" ry="12" fill="#c4d8d4"/><g transform="rotate(${-lever*37} 0 -78)"><ellipse cy="-79" rx="9" ry="17" fill="#526a7e" stroke="#f5e2d4" stroke-width="3"/></g></g>`;
  a+=`<g transform="${tr(349,558,1,-47-lever*15)}">${nail(0,0,.91,0,0,Math.min(t,2.0))}<path d="M-18-45L-3-38-11-26 10-19" stroke="#664560" stroke-width="2.5" fill="none" opacity="${crack}"/></g>`;
  if(t>1.4&&t<2.1)a+=`<g opacity="${1-clamp((t-1.7)/.4)}">${star(296,444,.7,'#f8d39a')}${star(325,458,.4,'#f8d39a')}</g>`;
  a+=rail(chapter);cam=1+.09*lever*(1-look);
 }else if(id==='payoff'){
  const melt=smooth((t-.8)/.9);
  a+=table()+C({mood:'love',pose:'hug'});
  a+=`<g transform="translate(144 650) scale(${1+melt*.52} ${1-melt*.5}) translate(-144 -650)">${H({mood:'love',pose:'hug'})}</g>`;
  a+=`<g transform="${tr(270,510,.96,-7)}">${nail(-32,0,.98,-14,2,t)}${nail(7,-5,1.07,2,1,t)}${nail(45,5,.86,16,0,t)}</g>`;
  for(let i=0;i<5;i++)a+=heart(146+i*54,540-((t*32+i*23)%111),.26,Math.sin(t+i)*9);
  cam=1+.025*(1-p);cy=560;
 }else if(isCard){
  a+=usefulCard(t)+H({x:401,y:682,s:.58,mood:'calm',pose:'point'});cam=1;
 }else if(id==='cta'){
  a+=table()+H({mood:'wink',pose:'point'})+C({mood:'happy',pose:'wave'});
  for(let i=0;i<4;i++){const x=91+i*120;a+=badge(i,x,419,1.04,0)+label(titles[i],x,492,12,'#ead9e8');}
  a+=`<g data-single-cta="true">${pill(t<2.0?'فقط ایموجی تیپت رو بفرست':'رفیقِ تیپ سه رو تگ کن',270,540,347,'#e1cce9')}</g>`;
  if(t>=2.0)a+=`<g opacity="${ease((t-2)/.18)}">${icon(6,454,620-ease((t-2)/.5)*21,.65)}</g>`;
 }
 // No top/bottom bars: imagery continues through the complete vertical canvas.
 return `<g data-full-bleed="true">${stage(t,id==='payoff')}<g transform="translate(${270+dx} ${cy}) scale(${cam}) translate(-270 -${cy})">${a}</g><rect width="540" height="960" fill="url(#grain)"/></g>`;
}
function endcard(p,t,brand){
 const back=ease((p-.86)/.12);
 return `<g opacity="${1-back}" data-full-bleed="true">${stage(t,true)}<rect x="45" y="330" width="450" height="277" rx="26" fill="#302943" stroke="#c1a7ca" stroke-width="1.5"/>${label('قسمت بعد: ۴ تیپ ناخن‌کار',270,379,27,'#f4d39d')}${label('هر هفته یه قسمت',270,423,22,'#e5d0eb')}${pill('فالو کن',270,456,183,'#edcc96')}<text x="270" y="552" direction="ltr" text-anchor="middle" font-family="Vazirmatn" font-size="26" font-weight="800" fill="#f4e4db">${brand.handle.replace(/[<>&]/g,'')}</text>${hero({x:156,y:684,s:.61,t,pose:'wave'})}${client({x:382,y:684,s:.59,t,mood:'love',pose:'wave'})}</g><g opacity="${back}">${scene('hook',0,0)}</g>`;
}
const ids=['hook','late','shots','friend','tool','payoff','card','cta'];
for(const id of [...ids,'__endcard'])registerScene(id,{mount(el){el.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 960" aria-hidden="true">${defs}<g id="quiz-world"></g></svg>`;},update(el,p,t,brand){el.querySelector('#quiz-world').innerHTML=id==='__endcard'?endcard(p,t,brand):scene(id,p,t);}});
window.Quiz={defs,hero,client,friend,icon,badge,label,pill,scene,usefulCard,ids};
})();
