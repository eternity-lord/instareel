/* Original illustrated cast and set. No external artwork. All animation is f(t). */
(() => {
'use strict';
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ease=x=>1-Math.pow(1-clamp(x),3);
const spring=x=>x<=0?0:1-Math.exp(-7*x)*Math.cos(10*x);
const mix=(a,b,p)=>a+(b-a)*p;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tr=(x,y,s=1,r=0)=>`translate(${x} ${y}) rotate(${r}) scale(${s})`;
const star=(x,y,s=1,col='#fff1cc',r=0)=>`<path transform="${tr(x,y,s,r)}" d="M0-12 Q2-2 12 0 Q2 2 0 12 Q-2 2-12 0 Q-2-2 0-12" fill="${col}"/>`;
const heart=(x,y,s=1,c='#ff8bbc',r=0)=>`<path transform="${tr(x,y,s,r)}" d="M0 10C-27-7-12-26 0-13C12-26 27-7 0 10Z" fill="${c}"/>`;
const label=(s,x,y,size=20,color='#fff6e8',weight=800)=>`<text x="${x}" y="${y}" text-anchor="middle" direction="rtl" font-family="Vazirmatn" font-size="${size}" font-weight="${weight}" fill="${color}">${esc(s)}</text>`;
const pill=(s,x,y,w=150,c='#f6b945')=>`<g transform="translate(${x-w/2} ${y})"><rect width="${w}" height="38" rx="19" fill="${c}"/>${label(s,w/2,26,18,'#342348')}</g>`;
const defs=`<defs>
<radialGradient id="room" cx="55%" cy="40%" r="75%"><stop stop-color="#5e4388"/><stop offset=".55" stop-color="#302650"/><stop offset="1" stop-color="#18172e"/></radialGradient>
<linearGradient id="arch" x2=".5" y2="1"><stop stop-color="#8c71aa"/><stop offset=".5" stop-color="#5b477c"/><stop offset="1" stop-color="#302d54"/></linearGradient>
<linearGradient id="window" x2="1" y2="1"><stop stop-color="#b3dfcf"/><stop offset=".5" stop-color="#7dabb5"/><stop offset="1" stop-color="#716d99"/></linearGradient>
<radialGradient id="pink" cx="32%" cy="20%" r="85%"><stop stop-color="#ffd6e5"/><stop offset=".33" stop-color="#ff95bd"/><stop offset=".7" stop-color="#e45e9c"/><stop offset="1" stop-color="#a63979"/></radialGradient>
<radialGradient id="cream" cx="30%" cy="18%" r="85%"><stop stop-color="#fff5df"/><stop offset=".4" stop-color="#ffdab6"/><stop offset=".8" stop-color="#e8a780"/><stop offset="1" stop-color="#b57376"/></radialGradient>
<linearGradient id="apron" x2="1" y2="1"><stop stop-color="#b8a4e4"/><stop offset=".5" stop-color="#8875b6"/><stop offset="1" stop-color="#574475"/></linearGradient>
<radialGradient id="eye" cx="38%" cy="35%"><stop stop-color="#675076"/><stop offset=".65" stop-color="#30283c"/><stop offset="1" stop-color="#191a2a"/></radialGradient>
<linearGradient id="nail" x2="1" y2=".35"><stop stop-color="#c4407e"/><stop offset=".3" stop-color="#ff87b9"/><stop offset=".55" stop-color="#ffd0df"/><stop offset=".73" stop-color="#f26ca4"/><stop offset="1" stop-color="#a62f68"/></linearGradient>
<linearGradient id="gold" x2=".9" y2="1"><stop stop-color="#fff2c0"/><stop offset=".3" stop-color="#eac475"/><stop offset=".65" stop-color="#b47a49"/><stop offset="1" stop-color="#f8d99e"/></linearGradient>
<linearGradient id="table" x2="0" y2="1"><stop stop-color="#f7dac7"/><stop offset=".25" stop-color="#d6b0bc"/><stop offset="1" stop-color="#a2799e"/></linearGradient>
<linearGradient id="glass" x2="1" y2="1"><stop stop-color="#f0e3ff" stop-opacity=".7"/><stop offset=".4" stop-color="#8e9ee4" stop-opacity=".3"/><stop offset="1" stop-color="#a86cbb" stop-opacity=".6"/></linearGradient>
<linearGradient id="phone" x2=".8" y2="1"><stop stop-color="#70608f"/><stop offset="1" stop-color="#211e35"/></linearGradient>
<radialGradient id="light"><stop stop-color="#ffcf98" stop-opacity=".35"/><stop offset="1" stop-color="#ffcf98" stop-opacity="0"/></radialGradient>
<radialGradient id="ao"><stop stop-color="#100f27" stop-opacity=".5"/><stop offset="1" stop-color="#100f27" stop-opacity="0"/></radialGradient>
<pattern id="grain" width="71" height="83" patternUnits="userSpaceOnUse"><circle cx="3" cy="18" r=".6" fill="#fff" opacity=".12"/><circle cx="44" cy="58" r=".5" fill="#fff" opacity=".13"/><circle cx="64" cy="28" r=".7" fill="#100c27" opacity=".2"/><circle cx="21" cy="72" r=".8" fill="#fff" opacity=".07"/></pattern>
</defs>`;
function bottle(x,y,s=1,color='#f382ad',rot=0){return `<g transform="${tr(x,y,s,rot)}"><ellipse cy="28" rx="24" ry="7" fill="url(#ao)"/><rect x="-17" y="-24" width="34" height="50" rx="10" fill="${color}" stroke="#fff" stroke-opacity=".3"/><path d="M-10-14V12" stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/><rect x="-10" y="-54" width="20" height="34" rx="5" fill="#312840"/><path d="M-5-49V-28" stroke="#9e829e" stroke-width="2"/><rect x="-12" y="-3" width="24" height="17" rx="4" fill="#fff8e9" opacity=".85"/><path d="M-5 4H5" stroke="#855b83" stroke-width="2"/></g>`;}
function nail(x,y,s=1,r=0,detail=0,t=0){
 let decorations='';
 if(detail>=1) for(let i=0;i<5;i++) decorations+=`<ellipse cx="${Math.cos(i*1.257)*12}" cy="${-37+Math.sin(i*1.257)*12}" rx="6" ry="9" transform="rotate(${i*72} ${Math.cos(i*1.257)*12} ${-37+Math.sin(i*1.257)*12})" fill="#fff4dc"/>`;
 if(detail>=1) decorations+='<circle cy="-37" r="5" fill="url(#gold)"/>';
 if(detail>=2) decorations+='<path d="M0-66L9-57 0-47-9-57Z" fill="#daf9ef" stroke="#fff" stroke-width="1.5"/><path d="M0-66V-47M-9-57H9" stroke="#7ec8c6"/>';
 if(detail>=3) decorations+='<path d="M-17-69Q0-98 17-69L12-85Q0-106-12-85Z" fill="#fff6ea"/>';
 if(detail>=4) decorations+='<path d="M-25-22Q5-16 23-52" fill="none" stroke="url(#gold)" stroke-width="3"/><circle cx="-19" cy="-16" r="3" fill="url(#gold)"/>';
 return `<g transform="${tr(x,y,s,r)}"><ellipse cy="19" rx="34" ry="12" fill="url(#ao)"/><path d="M-26 0C-28-32-23-76-9-96Q0-110 9-96C23-76 28-32 26 0Q0 17-26 0Z" fill="url(#nail)" stroke="#ffc0d6" stroke-width="1.5"/><path d="M-16-20Q-21-60-6-85" fill="none" stroke="#fff7ef" stroke-width="5" opacity=".72" stroke-linecap="round"/><path d="M10-85Q25-42 20-12" fill="none" stroke="#9b225f" opacity=".4" stroke-width="2"/>${decorations}<path d="M-18 ${-15-60*((t*.5)%1)}Q0 ${-28-60*((t*.5)%1)} 18 ${-20-60*((t*.5)%1)}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="3"/>${star(25,-65, .35+.15*Math.sin(t*5))}</g>`;
}
function character({x=0,y=0,s=1,t=0,type='hero',mood='happy',pose='rest',angle=0,talk=false,view=0}={}){
 const hero=type==='hero',skin=hero?'pink':'cream',bounce=Math.sin(t*2.8)*2;
 const stretch=1+.018*Math.sin(t*3.2),body='M-61 16C-76-9-69-59-47-79C-26-101 30-98 51-74C75-50 75-5 60 18C44 42-43 44-61 16Z';
 let aL=pose==='wave'?65:pose==='panic'?100:pose==='point'?35:pose==='hug'?50:12+Math.sin(t*3)*6;
 let aR=pose==='wave'?12:pose==='panic'?-100:pose==='point'?-65:pose==='hug'?-50:-12+Math.sin(t*3+.8)*6;
 let eyes='';
 const blink=Math.cos(t*1.3)>.996 || mood==='wink';
 const look=view?5:0;
 for(const [i,ex] of [-24,24].entries()){
  if((blink&&i===0)||mood==='calm') eyes+=`<path d="M${ex-12} -37Q${ex} -45 ${ex+12} -37" fill="none" stroke="#48263d" stroke-width="4" stroke-linecap="round"/>`;
  else if(mood==='love') eyes+=heart(ex,-40,.62,'#8d2c60');
  else eyes+=`<ellipse cx="${ex}" cy="-42" rx="${mood==='shock'?18:16}" ry="${mood==='tired'?17:21}" fill="#fff7f2"/><ellipse cx="${ex+look+2*Math.sin(t)}" cy="-40" rx="10" ry="${mood==='shock'?12:15}" fill="url(#eye)"/><ellipse cx="${ex-3+look}" cy="-47" rx="4.5" ry="5.5" fill="#fff"/><circle cx="${ex+5+look}" cy="-35" r="2.2" fill="#d5b7e1"/>`;
 }
 const brows=mood==='angry'?'M-39-68L-14-59M14-59L39-68':mood==='shock'?'M-39-71Q-24-80-13-70M13-70Q24-80 39-71':mood==='tired'?'M-39-62L-16-67M16-67L39-62':'M-38-69Q-25-76-14-68M14-68Q25-76 38-69';
 const mouth=mood==='shock'?'<ellipse cy="-13" rx="9" ry="12" fill="#6d2f50"/><ellipse cy="-8" rx="5" ry="3" fill="#e67999"/>':mood==='tired'?'<path d="M-10-10Q0-17 10-10" fill="none" stroke="#743352" stroke-width="3" stroke-linecap="round"/>':`<path d="M-14-18Q0 ${talk?-9+10*Math.sin(t*13):-10} 14-18Q9 ${talk?5:-1} 0 0Q-9-1-14-18" fill="#6d2f50"/><path d="M-8-3Q0-9 8-3Q0 3-8-3" fill="#f28da8"/>`;
 return `<g transform="${tr(x,y+bounce,s,angle)}"><ellipse cy="38" rx="79" ry="18" fill="url(#ao)"/><g transform="scale(${2-stretch} ${stretch})"><ellipse cx="-32" cy="33" rx="19" ry="9" fill="url(#${skin})"/><ellipse cx="32" cy="33" rx="19" ry="9" fill="url(#${skin})"/>
 <g transform="rotate(${aL} -52 -7)"><path d="M-57-9Q-86-11-87 8" fill="none" stroke="url(#${skin})" stroke-width="18" stroke-linecap="round"/><ellipse cx="-87" cy="8" rx="11" ry="12" fill="url(#${skin})"/>${hero?'<path d="M-94 1Q-99-10-92-12Q-85-10-87 1" fill="url(#nail)"/>':''}</g>
 <g transform="rotate(${aR} 52 -7)"><path d="M57-9Q86-11 87 8" fill="none" stroke="url(#${skin})" stroke-width="18" stroke-linecap="round"/><ellipse cx="87" cy="8" rx="11" ry="12" fill="url(#${skin})"/>${hero?'<path d="M87 1Q85-10 92-12Q99-10 94 1" fill="url(#nail)"/>':'<path d="M80-1L93-5" stroke="url(#gold)" stroke-width="5"/>'}</g>
 <path d="${body}" fill="url(#${skin})" stroke="${hero?'#ffb6d0':'#ffe6ce'}" stroke-width="1.5"/><path d="M-59-38Q-60-78-24-85" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".38"/>
 ${hero?'<path d="M-40 0Q0 14 40 0L36 25Q0 41-36 25Z" fill="url(#apron)"/><path d="M-31 0L-39-22M31 0L39-22" stroke="#b8a3df" stroke-width="6"/><rect x="-14" y="10" width="28" height="15" rx="5" fill="#cfb9ee"/><path d="M-5 15H5" stroke="#8b6ca9" stroke-width="2"/>':'<path d="M-21 22Q0 29 21 22" stroke="#f5cbad" stroke-width="3" fill="none"/>'}
 <g transform="translate(${view*9} 0) scale(${view?.91:1} 1)"><ellipse cx="-41" cy="-21" rx="12" ry="7" fill="#ee6999" opacity=".36"/><ellipse cx="41" cy="-21" rx="12" ry="7" fill="#ee6999" opacity=".36"/>${eyes}<path d="${brows}" stroke="#7d3b5e" stroke-width="3.2" fill="none" stroke-linecap="round"/>${mouth}<ellipse cy="-28" rx="4" ry="2.5" fill="#fff" opacity=".3"/></g>
 ${hero?`<g transform="rotate(${(mood==='angry'?Math.sin(t*20)*26:Math.sin(t*3)*7)+(mood==='tired'?24:0)} 0 -88)"><path d="M0-87Q-8-105 3-118" fill="none" stroke="url(#gold)" stroke-width="6"/><rect x="-3" y="-135" width="11" height="24" rx="4" fill="#5e3b70" transform="rotate(18 2 -121)"/><path d="M1-135Q-10-150 2-157Q19-148 10-137Z" fill="url(#nail)"/><path d="M2-148L1-140" stroke="#fff" stroke-width="2" stroke-linecap="round"/></g>`:'<g transform="rotate(-8 0 -96)"><rect x="-18" y="-108" width="36" height="20" rx="8" fill="url(#gold)"/><path d="M-10-105V-94M-3-106V-94M4-106V-94M11-104V-94" stroke="#ae785e" stroke-width="2"/><path d="M-11-111Q0-122 11-111" stroke="#ffe8c4" stroke-width="4" fill="none"/></g>'}
 </g></g>`;
}
function room(t,theme='normal'){
 const dx=Math.sin(t*.2)*3,warm=theme==='warm';
 let bokeh='';for(let i=0;i<18;i++){const x=(i*97+13)%540,y=210+((i*137+Math.sin(t*.3+i)*20)%560);bokeh+=`<circle cx="${x}" cy="${y}" r="${2+i%4*2}" fill="${i%2?'#ffe0b0':'#d4caf1'}" opacity="${.035+.025*Math.sin(t+i)}"/>`;}
 return `<rect width="540" height="960" fill="url(#room)"/><g transform="translate(${dx} 0)"><path d="M80 766V400A190 190 0 0 1 460 400V766" fill="none" stroke="#1b1933" stroke-width="28" opacity=".3"/><path d="M83 760V402A187 187 0 0 1 457 402V760Z" fill="url(#arch)"/><path d="M93 760V403A177 177 0 0 1 447 403" stroke="#b9a0cf" opacity=".32" stroke-width="2" fill="none"/>
 <g opacity=".7"><rect x="115" y="316" width="116" height="234" rx="57" fill="url(#window)"/><path d="M172 319V550M116 423H229" stroke="#5a507c" stroke-width="5"/><path d="M121 535L221 355" stroke="#f7f2cb" stroke-width="14" opacity=".12"/></g>
 <path d="M8 560H106M454 560H532" stroke="#b89eb9" stroke-width="8" stroke-linecap="round"/><path d="M5 569H105M455 569H535" stroke="#17172b" stroke-width="5" opacity=".4"/>
 ${bottle(29,539,.48,'#e9a0b7')}${bottle(65,539,.48,'#ab98ce')}${bottle(482,539,.48,'#c3d5b9')}${bottle(516,539,.48,'#f4c887')}
 <path d="M374 0V312" stroke="#ccaf93" stroke-width="2"/><path d="M344 324Q374 285 404 324L411 339H337Z" fill="url(#gold)"/><ellipse cx="374" cy="338" rx="31" ry="6" fill="#ffe5aa"/><circle cx="374" cy="362" r="100" fill="url(#light)"/>
 <rect x="0" y="684" width="540" height="276" fill="#201d35" opacity=".32"/><path d="M0 785H540M0 876H540M74 684L-50 960M465 684L590 960M220 684L191 960M320 684L349 960" stroke="#ab8ca5" opacity=".08" stroke-width="1.5"/></g>${warm?'<rect width="540" height="960" fill="url(#light)" opacity=".7"/>':''}<rect width="540" height="960" fill="url(#grain)"/>${bokeh}`;
}
function desk(t,{lamp=true}={}){
 return `<g><ellipse cx="270" cy="742" rx="221" ry="24" fill="url(#ao)"/><path d="M91 662L83 747M449 662L457 747" stroke="#5b3d65" stroke-width="15" stroke-linecap="round"/><path d="M91 662L86 733M449 662L454 733" stroke="#b691ad" stroke-width="5" stroke-linecap="round"/><rect x="56" y="635" width="428" height="39" rx="18" fill="url(#table)"/><ellipse cx="270" cy="637" rx="214" ry="19" fill="#f5d9d0"/><path d="M88 632Q268 614 452 632" stroke="#fff7e6" stroke-width="2" fill="none" opacity=".7"/>
 ${lamp?`<g transform="translate(276 617)"><ellipse cy="10" rx="48" ry="13" fill="url(#ao)"/><path d="M-39 0V-17Q-37-49 0-48Q37-49 39-17V0Z" fill="url(#apron)" stroke="#d5c6f5" stroke-width="1.5"/><path d="M-26 0V-13Q-25-31 0-31Q25-31 26-13V0Z" fill="#3c2857"/><ellipse cy="-3" rx="24" ry="7" fill="#dbb2ff" opacity="${.35+.15*Math.sin(t*3)}"/><rect x="-9" y="-41" width="18" height="6" rx="3" fill="#dec2fa"/></g>`:''}${bottle(104,624,.55,'#e991b8')}${bottle(411,625,.5,'#b3c9bf')}<path d="M335 632L374 629" stroke="#90709d" stroke-width="7" stroke-linecap="round"/><path d="M345 628L374 626" stroke="#d7c5de" stroke-width="2"/></g>`;
}
function castPair(t,{heroMood='happy',clientMood='happy',heroPose='rest',clientPose='rest',heroX=176,clientX=367,scale=1.02,heroTalk=false,clientTalk=true}={}){
 return character({x:heroX,y:601,s:scale,t,type:'hero',mood:heroMood,pose:heroPose,talk:heroTalk,view:1})+character({x:clientX,y:605,s:scale*.96,t:t+.4,type:'client',mood:clientMood,pose:clientPose,talk:clientTalk,view:-1});
}
function sparkles(t,area='high'){
 let a='';for(let i=0;i<7;i++){let x=83+(i*67)%385,y=(area==='high'?340:400)+(i*47)%145; a+=star(x+Math.sin(t+i)*5,y+Math.sin(t*.9+i)*8,.25+.18*(1+Math.sin(t*3+i)),i%2?'#f5bf6b':'#fff2d8',t*9); }return a;
}
const ids=['hook','short','simple','hurry','photo','trust','payoff','cta'];
function shot(id,p,t){
 let art='',crowd={},theme='normal';
 const reveal=(at,w=.35)=>spring((t-at)/w),fade=at=>ease((t-at)/.3);
 if(id==='hook'){
  const land=reveal(.1,.65),clientIn=ease(t/.6);
  art+=`<g transform="${tr(270,415+(1-land)*-140,1+Math.sin(t*1.2)*.02,(1-land)*-12)}"><text text-anchor="middle" font-family="Vazirmatn" font-size="165" font-weight="800" fill="#261d3b" stroke="#261d3b" stroke-width="12" y="9">۵</text><text text-anchor="middle" font-family="Vazirmatn" font-size="165" font-weight="800" fill="url(#gold)">۵</text>${star(-83,-40,.8)}${star(77,5,.6)}</g>`;
  art+=pill('جملهٔ آشنای هر روز',270,435,211,'#eadcf4');
  crowd={heroPose:t<1?'wave':'rest',clientX:mix(600,367,clientIn),heroMood:'happy'};
 } else if(id==='short'){
  const grow=ease((t-1.5)/.9);
  art+=`<g transform="${tr(270,388,1, -8+Math.sin(t)*2)}"><rect x="-157" y="-55" width="314" height="114" rx="25" fill="#dfcfe9" stroke="#fff0e9" stroke-opacity=".5"/><g transform="translate(-84 8) rotate(82)">${nail(0,0,.8+grow*.6,0,0,t)}</g><rect x="-139" y="29" width="278" height="20" rx="5" fill="url(#gold)"/>${Array.from({length:27},(_,i)=>`<path d="M${-130+i*10} 30V${i%5?38:44}" stroke="#8b5b65" stroke-width="1.5"/>`).join('')}<path d="M-114-30H${-75+grow*195}" stroke="#9e467e" stroke-width="3"/><path d="M-114-37V-23M${-75+grow*195}-37V-23" stroke="#9e467e" stroke-width="3"/></g>`;
  if(t>1.5) art+=`<g opacity="${fade(1.5)}">${pill('۳ سانت؟!',343,442,128)}</g>`;
  for(let i=0;i<6;i++) if(t>2+i*.06) art+=`<path transform="${tr(229+i*12,487+Math.abs(Math.sin((t-2)*4+i))*8,.6,i*28)}" d="M-7-4Q0 8 7-4L5 3Q0 12-5 3Z" fill="#f7a4c4"/>`;
  crowd={heroMood:t>1.6?'shock':'happy',clientPose:'point'};
 } else if(id==='simple'){
  const n=Math.min(4,Math.max(0,Math.floor((t-.6)/.65)+1));
  art+=`<g transform="${tr(270,420,reveal(0,.5))}"><ellipse cy="12" rx="96" ry="20" fill="url(#ao)"/><circle cy="-25" r="96" fill="#d5bedf" opacity=".22"/>${nail(0,38,1.25,8*Math.sin(t*.7),n,t)}</g>`;
  const names=['گل','نگین','فرنچ','طلا'];names.forEach((name,i)=>{const a=clamp((t-.6-i*.65)/.3);if(a)art+=`<g opacity="${a}" transform="translate(0 ${(1-spring(a))*15})">${pill(name,i%2?405:135,i<2?337:404,79,i%2?'#bcdad3':'#f2d5de')}</g>`;});
  crowd={heroMood:t>2?'angry':'happy',clientMood:'calm',heroPose:'point'};
 } else if(id==='hurry'){
  let fast=ease((t-1.3)/.5),rot=t*(30+fast*600);
  art+=`<g transform="${tr(270,375, .95+.04*Math.sin(t*2))}"><circle r="75" fill="url(#gold)"/><circle r="66" fill="#fff0dd"/><circle r="59" fill="none" stroke="#d9b2b6" stroke-width="1"/>${Array.from({length:12},(_,i)=>`<path d="M0-53V-46" transform="rotate(${i*30})" stroke="#886077" stroke-width="${i%3?2:4}" stroke-linecap="round"/>`).join('')}<path d="M0 7V-41" transform="rotate(${rot})" stroke="#53405f" stroke-width="5" stroke-linecap="round"/><path d="M0 5V-27" transform="rotate(${rot/12+90})" stroke="#e17fa7" stroke-width="7" stroke-linecap="round"/><circle r="6" fill="#8b587e"/></g>`;
  if(t>1.5) art+=`<g opacity="${fade(1.5)}">${pill('۱۰ دقیقه بعد…',270,458,177)}</g>`;
  if(t>2.6) for(let i=0;i<3;i++) art+=`<path d="M${146+i*19} ${493-Math.sin(t*3+i)*7}q-12-13 0-24t0-25" stroke="#f1c8de" opacity=".4" stroke-width="3" fill="none"/>`;
  crowd={heroMood:'tired',clientMood:t>2?'shock':'calm',clientPose:t>2?'panic':'rest'};
 } else if(id==='photo'){
  art+=`<g transform="${tr(255,405+(1-reveal(0,.5))*100,1,-9+Math.sin(t)*2)}"><rect x="-71" y="-112" width="142" height="211" rx="25" fill="url(#phone)" stroke="#cbb1d9" stroke-width="3"/><rect x="-62" y="-102" width="124" height="189" rx="18" fill="url(#glass)"/><rect x="-20" y="-98" width="40" height="8" rx="4" fill="#30273e"/>${nail(0,49,1.15,0,4,t)}${star(-43,-45,.7)}${star(43,-9,.5)}${star(26,-68,.4)}<path d="M-48-74L-40-82H-29" stroke="#fff" stroke-opacity=".4" stroke-width="3" fill="none"/></g>`;
  art+=`<g transform="${tr(390,410, .85,12)}"><circle r="35" fill="#c8d4e0" fill-opacity=".12" stroke="url(#gold)" stroke-width="6"/><path d="M25 25L58 58" stroke="#c29bb4" stroke-width="12" stroke-linecap="round"/>${star(0,0,.9)}</g>`;
  if(t>1.8) art+=`<g opacity="${fade(1.8)}">${pill('فیلتر روشنه!',260,487,170)}</g>`;
  crowd={heroMood:t>1.2?'shock':'happy',clientPose:'point'};
 } else if(id==='trust'){
  const colors=['#cda6e9','#91c5bd','#e98bab','#e9bf71','#9b789d'];
  for(let i=0;i<5;i++){const enter=reveal(i*.07,.45),reject=ease((t-2)/.5);art+=bottle(150+i*60,425+(1-enter)*-180+Math.sin(t*2+i)*5,.9,colors[i],(i-2)*7+reject*Math.sin(t*7+i)*7);}
  if(t<2) art+=pill('انتخاب با تو!',270,326,173,'#c1ded2');
  else art+=`<g transform="${tr(270,343,spring((t-2)/.3))}"><circle r="31" fill="#f3adc0"/><path d="M-12-12L12 12M12-12L-12 12" stroke="#8c385c" stroke-width="7" stroke-linecap="round"/></g>${pill('نه، اون رنگ نه!',270,468,192)}`;
  crowd={heroMood:t>2?'tired':'happy',heroPose:t>2?'rest':'point',clientMood:t>2?'shock':'happy',clientPose:t>2?'panic':'wave'};
 } else if(id==='payoff'){
  theme='warm';
  for(let i=0;i<3;i++)art+=nail(199+i*72,452+(1-reveal(i*.12,.6))*100,1.17,i*14-14,i===1?4:3,t+i);
  for(let i=0;i<7;i++)art+=heart(90+(i*61)%380,470-((t*28+i*33)%150),.25+.1*Math.sin(t+i),'#f7b9cc',Math.sin(t+i)*15);
  art+=sparkles(t);
  crowd={heroMood:'love',clientMood:'love',heroPose:'hug',clientPose:'hug'};
 } else if(id==='cta'){
  const go=.5+.5*Math.sin(t*2);
  art+=`<g transform="${tr(270,381+Math.sin(t*2)*5,1,-5+Math.sin(t)*4)}"><circle r="66" fill="#f3c46f"/><circle r="56" fill="none" stroke="#fff2ce" stroke-opacity=".6"/><path d="M-34 2L37-29 15 35-3 12Z" fill="#fff3dd"/><path d="M-3 12L37-29-17 3M-3 12L-4 29 9 19" fill="none" stroke="#b07c5c" stroke-width="2" stroke-linejoin="round"/></g><path d="M122 436Q155 470 191 432" fill="none" stroke="#f0ccdb" stroke-width="2" stroke-dasharray="5 7" opacity="${go}"/>`;
  art+=pill('ناخن‌کارت رو تگ کن',270,473,235,'#e9d9f1');
  crowd={heroMood:'wink',heroPose:'point',clientPose:t>1.3?'point':'wave'};
 }
 let camera=1+.018*ease(p)+Math.sin(t*.8)*.003;
 let entrance=clamp(t/.42),ox=0,oy=0,rotate=0;
 if(id==='short') ox=(1-ease(entrance))*65;
 if(id==='simple') camera*=.92+.08*spring(entrance);
 if(id==='hurry') rotate=(1-ease(entrance))*-5;
 if(id==='photo') oy=(1-ease(entrance))*55;
 if(id==='trust') ox=-(1-ease(entrance))*55;
 if(id==='payoff') camera*=.96+.04*ease(entrance);
 // Background, cast, gag and foreground are separate depth planes.
 const image=`${room(t,theme)}<g transform="translate(${270+ox} ${480+oy}) rotate(${rotate}) scale(${camera}) translate(-270 -480)">${art}${castPair(t,crowd)}${desk(t)}${sparkles(t,'low')}</g>`;
 return image;
}
function endcard(p,t,brand){
 const loop=ease((p-.9)/.08),alpha=1-loop;
 return `<g opacity="${alpha}">${room(t,'warm')}${castPair(t,{heroPose:'wave',clientPose:'point',heroMood:'happy'})}${desk(t)}<rect x="84" y="277" width="372" height="222" rx="28" fill="#302443" fill-opacity=".94" stroke="#b394bb" stroke-opacity=".3"/>${label('یه دنیا صبر،',270,322,30)}${label('یه عالمه ناخن خوشگل',270,367,27,'#f6c975')}<text x="270" y="411" text-anchor="middle" direction="ltr" font-family="Vazirmatn" font-weight="800" font-size="27" fill="#fff4e6">${esc(brand.handle)}</text><g transform="translate(0 ${Math.sin(t*2)*2})">${pill('فالو کن',270,435,147)}</g>${sparkles(t)}</g><g opacity="${loop}">${shot('hook',0,0)}</g>`;
}
for(const id of ids)registerScene(id,{mount(el){el.innerHTML='<svg viewBox="0 0 540 960" aria-hidden="true">'+defs+'<g id="world"></g></svg>';},update(el,p,t){el.querySelector('#world').innerHTML=shot(id,p,t);}});
registerScene('__endcard',{mount(el){el.innerHTML='<svg viewBox="0 0 540 960" aria-hidden="true">'+defs+'<g id="world"></g></svg>';},update(el,p,t,brand){el.querySelector('#world').innerHTML=endcard(p,t,brand);}});
window.Studio={defs,character,nail,room,desk,shot,label,pill,star};
})();
