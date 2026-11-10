/* Sequel: analytic 2.5D choreography. No timers, CSS animation or runtime randomness. */
(() => {
'use strict';
const T=window.Trailer;
const C=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const E=v=>1-(1-C(v))**3;
const S=v=>{v=C(v);return v*v*(3-2*v);};
const P=v=>v<=0?0:1-Math.exp(-7*v)*Math.cos(v*10);
const L=(a,b,p)=>a+(b-a)*p;
const tr=(x,y,s=1,r=0)=>`translate(${x} ${y}) rotate(${r}) scale(${s})`;
const {text,pill,star,hero,gel,landscape,cinema}=T;
const extra=`<defs>
<radialGradient id="ruby" cx="26%" cy="20%" r="90%"><stop stop-color="#ffd8d4"/><stop offset=".25" stop-color="#fa7d8a"/><stop offset=".55" stop-color="#d52c57"/><stop offset="1" stop-color="#692b54"/></radialGradient>
<radialGradient id="pale" cx="25%" cy="20%"><stop stop-color="#fff2df"/><stop offset=".6" stop-color="#efd0c4"/><stop offset="1" stop-color="#bfa4b3"/></radialGradient>
<linearGradient id="bottleGlass" x2="1" y2=".4"><stop stop-color="#c7f6d1" stop-opacity=".55"/><stop offset=".25" stop-color="#7eb399" stop-opacity=".15"/><stop offset=".6" stop-color="#d8f5df" stop-opacity=".36"/><stop offset="1" stop-color="#7e9fa3" stop-opacity=".65"/></linearGradient>
<radialGradient id="vapor"><stop stop-color="#b5e69f" stop-opacity=".38"/><stop offset=".5" stop-color="#8dd99c" stop-opacity=".19"/><stop offset="1" stop-color="#90d09d" stop-opacity="0"/></radialGradient>
<radialGradient id="greenEye"><stop stop-color="#f0ffd5"/><stop offset=".5" stop-color="#c2f48d"/><stop offset="1" stop-color="#5fa18a"/></radialGradient>
<radialGradient id="cotton" cx="30%" cy="25%"><stop stop-color="#fffdf0"/><stop offset=".55" stop-color="#eee9e4"/><stop offset="1" stop-color="#b8b8c4"/></radialGradient>
<radialGradient id="toe" cx="30%" cy="23%"><stop stop-color="#fff0d0"/><stop offset=".5" stop-color="#eac39f"/><stop offset="1" stop-color="#a78391"/></radialGradient>
<linearGradient id="file" x2=".3" y2="1"><stop stop-color="#b9a9c9"/><stop offset=".5" stop-color="#8f829e"/><stop offset="1" stop-color="#554f70"/></linearGradient>
<linearGradient id="rainbow" x2="1" y2=".6"><stop stop-color="#c6f9e8"/><stop offset=".3" stop-color="#d9caff"/><stop offset=".55" stop-color="#ffd4df"/><stop offset=".8" stop-color="#f7e8ac"/><stop offset="1" stop-color="#adf2dd"/></linearGradient>
<pattern id="grit" width="9" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".8" fill="#f3e5dd" opacity=".4"/><path d="M6 6h1" stroke="#322e46" opacity=".5"/></pattern>
</defs>`;
function board(x,y,s=1,r=0){return `<g transform="${tr(x,y,s,r)}"><ellipse cy="13" rx="87" ry="14" fill="url(#ao)"/><path d="M-85-7Q-99-8-94-17L-72-25 76-25Q95-21 89-11L75-4Z" fill="url(#file)" stroke="#d3c2d4" stroke-width="2"/><path d="M-84-14L-68-21H76Q84-20 79-14Z" fill="url(#grit)"/><circle cx="-53" cy="5" r="9" fill="#39445c" stroke="#9ad9d9" stroke-width="3"/><circle cx="55" cy="5" r="9" fill="#39445c" stroke="#9ad9d9" stroke-width="3"/></g>`;}
function rookie({x=0,y=0,s=1,t=0,r=0,mood='happy',pose='cool',pale=0,glasses=true,coat=false,skate=false,view=0}={}){
 const bob=Math.sin(t*4)*2,body='M-47 12C-61-26-40-94-8-139Q0-151 8-139C40-94 61-26 47 12Q0 41-47 12Z';
 const arms=pose==='hang'?[120,-120]:pose==='cheer'?[58,-58]:pose==='point'?[30,-78]:pose==='run'?[Math.sin(t*12)*40,-Math.sin(t*12)*40]:[8,-12];
 let a=`<g transform="${tr(x,y+bob,s,r)}"><ellipse cy="34" rx="69" ry="16" fill="url(#ao)"/>`;
 if(skate)a+=board(0,45,1);
 for(let i=0;i<2;i++){const side=i?1:-1;a+=`<g transform="rotate(${arms[i]} ${side*43} -12)"><path d="M${side*43}-12L${side*67} 2" stroke="${pale>.5?'#e7c9c0':'#d94d74'}" stroke-width="13" stroke-linecap="round"/><circle cx="${side*67}" cy="2" r="8" fill="url(#${pale>.5?'pale':'ruby'})"/></g>`;}
 a+=`<ellipse cx="-23" cy="28" rx="16" ry="9" fill="url(#ruby)"/><ellipse cx="23" cy="28" rx="16" ry="9" fill="url(#ruby)"/><path d="${body}" fill="url(#ruby)" stroke="${coat?'#f7e2a8':'#ffb9c7'}" stroke-width="${coat?3:1.6}"/>`;
 if(pale)a+=`<path d="${body}" fill="url(#pale)" opacity="${pale}"/>`;
 a+=`<path d="M-36-16Q-39-68-6-120" stroke="#ffece0" stroke-width="5" stroke-linecap="round" opacity=".65" fill="none"/><path d="M28-90Q51-25 40 9" stroke="#8e284f" stroke-width="3" opacity=".3" fill="none"/>`;
 a+=T.eyes({mood,t,view,y:-47});
 a+=`<circle cy="10" r="12" fill="${coat?'url(#gold)':'#902943'}"/>${text('۸',0,17,16,'#ffe1c7')}`;
 if(glasses){const lift=pose==='cheer'?24:0;a+=`<g transform="translate(${view*6} ${-lift}) rotate(${-4+Math.sin(t*1.4)*2} 0 -46)"><path d="M-43-53Q0-60 43-53" stroke="#e5c184" stroke-width="5" fill="none"/><path d="M-41-53H-7L-10-33Q-28-20-39-34ZM7-53H41L39-34Q28-20 10-33Z" fill="#19283c" stroke="#e7c78b" stroke-width="2.5"/><path d="M-30-48L-19-39M18-48L29-39" stroke="#8bd4d5" stroke-width="3" opacity=".6"/></g>`;}
 if(coat)a+=`<path d="M-44-10Q0 14 44-10" stroke="url(#rainbow)" stroke-width="5" fill="none"/>${star(43,-89,.5+.13*Math.sin(t*6),'#fff2ba')}`;
 return a+'</g>';
}
function acetone({x=0,y=0,s=1,t=0,r=0,open=1,sleep=false}={}){
 const lid=22*open+Math.sin(t*2)*2*open;
 let a=`<g transform="${tr(x,y,s,r)}"><ellipse cy="20" rx="91" ry="18" fill="url(#ao)"/><path d="M-65 0V-118Q-64-143-35-154V-181H35V-154Q64-143 65-118V0Q0 22-65 0Z" fill="url(#bottleGlass)" stroke="#b9dcbb" stroke-width="2"/><path d="M-55-66Q-24-76 3-66T55-67V-4Q0 11-55-4Z" fill="#6ca887" opacity=".45"/><path d="M-47-14V-111Q-46-131-24-139" stroke="#edffe3" stroke-width="6" stroke-linecap="round" opacity=".58"/><path d="M47-124Q59-114 56-87" stroke="#edffe3" stroke-width="2" opacity=".5" fill="none"/><rect x="-48" y="-108" width="96" height="69" rx="15" fill="#234239" fill-opacity=".82" stroke="#adcfaa" stroke-width="1"/>
 <circle cy="-78" r="25" fill="url(#vapor)"/>`;
 if(sleep)a+='<path d="M-19-76Q0-60 19-76" stroke="#d9f4b8" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cy="-49" rx="6" ry="4" fill="#a8d5ab"/>';
 else a+=`<ellipse cy="-77" rx="22" ry="${10+12*open}" fill="url(#greenEye)"/><ellipse cx="${Math.sin(t)*4}" cy="-76" rx="7" ry="14" fill="#284744"/><circle cx="-5" cy="-85" r="5" fill="#fffade"/><path d="M-21-112Q0-104 20-112" stroke="#25423b" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-13-43Q0-34 13-43" stroke="#b5dca6" stroke-width="3" fill="none" stroke-linecap="round"/>`;
 a+=`<g transform="translate(0 ${-lid})"><path d="M-44-179L-47-207-21-195 0-220 21-195 47-207 44-179Z" fill="url(#gold)" stroke="#e4dfaa" stroke-width="1.5"/><rect x="-44" y="-184" width="88" height="14" rx="5" fill="#9bbb98"/><path d="M-30-181V-173M-15-181V-173M0-181V-173M15-181V-173M30-181V-173" stroke="#456d64" stroke-width="2"/><path d="M0-205L7-197 0-190-7-197Z" fill="#d1f6ae"/></g>`;
 if(sleep)for(let i=0;i<4;i++)a+=`<circle cx="${20+Math.sin(t*2+i)*12}" cy="${-134-((t*21+i*19)%90)}" r="${2+i*2}" stroke="#bfdfb9" fill="#c6f2c0" fill-opacity=".08" opacity="${.5-i*.07}"/>`;
 return a+'</g>';
}
function cotton({x=0,y=0,s=1,t=0,r=0,angry=true}={}){
 const march=Math.sin(t*11),yy=Math.abs(march)*3;
 return `<g transform="${tr(x,y-yy,s,r)}"><ellipse cy="13" rx="33" ry="9" fill="url(#ao)"/><path d="M-13 4L${-18+march*4} 15M13 4L${18-march*4} 15" stroke="#a5a6b0" stroke-width="4" stroke-linecap="round"/><path d="M-28-2Q-43-19-23-28Q-24-48-4-44Q14-56 24-34Q43-30 33-12Q42 5 18 10Q0 24-18 10Q-38 10-28-2Z" fill="url(#cotton)" stroke="#f8f6e8" stroke-width="1.2"/><path d="M-27-17Q-22-36-7-32" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7" fill="none"/><ellipse cx="-10" cy="-12" rx="4" ry="6" fill="#384253"/><ellipse cx="11" cy="-12" rx="4" ry="6" fill="#384253"/><path d="${angry?'M-17-25L-4-20M4-20L18-25':'M-17-24Q-10-29-4-24M4-24Q11-29 18-24'}" fill="none" stroke="#726a7d" stroke-width="2.5" stroke-linecap="round"/><path d="M-4 0Q0-4 5 0" stroke="#87778a" stroke-width="2" fill="none"/></g>`;
}
function nine({x=0,y=0,s=1,t=0,r=0,mood='tired',pose='stand',view=0}={}){
 return `<g transform="${tr(x,y+Math.sin(t*1.7)*2,s,r)}"><ellipse cy="33" rx="107" ry="21" fill="url(#ao)"/><path d="M-72 2L-99 9M72 2L99 9" stroke="#d0a492" stroke-width="17" stroke-linecap="round"/><ellipse cx="-40" cy="27" rx="26" ry="10" fill="url(#toe)"/><ellipse cx="40" cy="27" rx="26" ry="10" fill="url(#toe)"/><path d="M-83 2Q-92-52-66-91Q-45-121 0-124Q53-125 75-88Q96-51 82 7Q0 50-83 2Z" fill="url(#toe)" stroke="#f6d7b6" stroke-width="2"/><path d="M-72-16Q-78-66-45-92" stroke="#fff1d5" stroke-width="6" stroke-linecap="round" opacity=".55" fill="none"/><g transform="translate(${view*9} 0)">${T.eyes({mood,t,view,y:-48})}${mood==='tired'?[-22,22].map(ex=>`<path d="M${ex-18}-70H${ex+18}V-48Q${ex}-40 ${ex-18}-48Z" fill="#dbb69b"/><path d="M${ex-17}-48Q${ex}-40 ${ex+17}-48" fill="none" stroke="#947584" stroke-width="3" stroke-linecap="round"/>`).join(''):''}</g><circle cy="10" r="12" fill="#ba8b84"/>${text('۹',0,17,17,'#ffe3c2')}
 <g transform="${tr(-33,-108,1,-18+Math.sin(t*2)*3)}"><path d="M-26 8L-21-27Q-18-47 7-42L31-34Q39-20 19-13L12 10Z" fill="#8ba8bd" stroke="#cce0dd" stroke-width="2"/><path d="M-25-5L17 1M-23-17L24-10M-16-30L29-22" stroke="#d4e5dc" stroke-width="5" opacity=".75"/><rect x="-29" y="5" width="45" height="15" rx="6" fill="#a6c6cd"/><path d="M-21 9V17M-12 10V18M-3 11V18M6 11V18" stroke="#7699ac" stroke-width="2"/><circle cx="29" cy="-30" r="12" fill="url(#cotton)"/></g></g>`;
}
function fumes(t,{strength=1,cx=282,cy=501,spread=1}={}){
 let a='';for(let i=0;i<7;i++){const u=t*1.9+i*.83,x=cx+Math.sin(u)*100*spread,y=cy+Math.cos(u*.7)*92;a+=`<ellipse cx="${x}" cy="${y}" rx="${100+i%3*18}" ry="${63+i%2*29}" fill="url(#vapor)" opacity="${strength}"/>`;}
 for(let i=0;i<3;i++){const side=i%2?1:-1;a+=`<path d="M${cx+side*41} ${cy+111}C${cx+side*(140+Math.sin(t*2+i)*31)} ${cy+55},${cx-side*76} ${cy-45},${cx+side*138} ${cy-97-i*17}" fill="none" stroke="#9ed4a2" stroke-opacity="${.24*strength}" stroke-width="${10-i*2}" stroke-linecap="round"/>`;}
 return a;
}
function lines(t,intensity=1){let a='';for(let i=0;i<16;i++){const y=330+(i*29)%380,x=((i*113-t*(190+i%3*80))%800+800)%800-130;a+=`<path d="M${x} ${y}h${35+i%4*21}" stroke="${i%2?'#bde4d8':'#efcab8'}" stroke-width="${1+i%2}" opacity="${.08*intensity}"/>`;}return a;}
function platform(t,{green=0,warm=.3,track=0}={}){
 let a=landscape(t,{warm,light:.15});
 if(green)a+=`<rect width="540" height="960" fill="#7bbc91" opacity="${green*.12}"/>`;
 if(track){a+=`<g transform="translate(${-track%170} 0)">`;for(let i=0;i<5;i++)a+=`<path d="M${i*170-120} 714Q${i*170-90} 541 ${i*170-20} 550Q${i*170+80} 543 ${i*170+110} 719Z" fill="url(#ground)" stroke="#edb5a5" stroke-opacity=".2"/><path d="M${i*170-83} 699Q${i*170-37} 570 ${i*170+47} 692" fill="none" stroke="#f3c0a9" opacity=".2" stroke-width="2"/>`;a+='</g>';}
 return a;
}
const motion=(back,art,{scale=1,x=0,y=0,r=0,bgScale=1,bgR=0}={})=>`<rect width="540" height="960" fill="url(#sky)"/><g transform="translate(270 520) rotate(${bgR}) scale(${bgScale}) translate(-270 -520)">${back}</g><g transform="translate(${270+x} ${520+y}) rotate(${r}) scale(${scale}) translate(-270 -520)">${art}</g>`;
function shot(id,p,t){
 let back=platform(t),art='',cam={scale:1+.025*p,x:0,y:Math.sin(t*.8)*2,r:0};
 if(id==='hook'){
  const dark=S((t-.7)/.45),hit=P((t-1.5)/.32),whip=E((t-3.25)/.45);
  back=platform(t,{warm:1-dark*.8,green:dark});
  art+=hero({x:270,y:650,s:1.02,t,mood:'wink',pose:'cheer',armor:1,bandage:.35});
  art+=`<path d="M${570-dark*640} 280L${800-dark*640} 280L${460-dark*320} 746L${220-dark*320} 746Z" fill="#8ac69a" opacity=".23"/>`;
  if(t>1.15){for(let i=0;i<7;i++){const a=i*Math.PI*2/7+.2;art+=`<path d="M270 493L${270+Math.cos(a)*80} ${493+Math.sin(a)*80}l${Math.cos(a+.5)*65} ${Math.sin(a+.5)*65}" fill="none" stroke="#d9f1cd" stroke-opacity="${.55*(1-E((t-2)/1))}" stroke-width="1.5"/>`;}}
  if(t>1.5)art+=`<g transform="${tr(270,420,Math.max(.01,hit),Math.sin(t*45)*Math.exp(-(t-1.5)*8)*4)}"><rect x="-112" y="-57" width="224" height="102" rx="10" fill="#1c3838" stroke="#b3dca4" stroke-width="2"/>${text('قسمت ۲',0,13,47,'#d4eab4')}</g>`;
  cam={scale:1+.06*E(t/.7),x:-whip*560+Math.sin(t*53)*Math.exp(-Math.max(0,t-1.5)*12)*(t>1.5?4:0),y:0,r:whip*8};
 }else if(id==='acetone'){
  back=platform(t,{green:.9,warm:0});
  art+=`<path d="M74 659H473" stroke="#414c5a" stroke-width="27" stroke-linecap="round"/><path d="M74 647H473" stroke="#b5bbb0" stroke-width="4" stroke-linecap="round"/>`;
  art+=fumes(t,{strength:E(t/1.5),cx:286,cy:491});
  art+=acetone({x:284,y:649,s:1.22,t,open:E((t-.3)/1),r:Math.sin(t*2)*1.2});
  art+=pill('پرونده: استون',275,339,188,'#c8dda9');
  cam={scale:1+.17*E(t/2.5),x:Math.sin(t*5)*E((t-1.7)/.5)*3,y:0,r:Math.sin(t*2)*.7,bgScale:1-.025*p};
 }else if(id==='army'){
  back=platform(t,{green:.6,warm:0});
  const descent=E(t/1.3),swarm=E((t-1.3)/1.1),troops=[];
  for(let row=0;row<4;row++)for(let col=0;col<6;col++){
   const z=row/3,ss=.32+z*.43,x=95+col*70+Math.sin(t*3+row)*swarm*19,y=L(420+row*65,463+row*66,descent)+Math.sin(t*6+col)*swarm*9;
   troops.push(cotton({x,y,s:ss,t:t+row*.03,r:swarm*Math.sin(t*4+col)*9}));
   if(row>1)art+=`<ellipse cx="${x}" cy="${y+11}" rx="${12+7*Math.abs(Math.sin(t*9))}" ry="4" fill="#efddc4" opacity=".12"/>`;
  }
  art+=troops.join('');art+=pill('ارتشِ خیلی نرم!',270,341,192,'#e9e9d4');
  cam={scale:1+.08*descent,x:Math.sin(t*.7)*14,y:(1-descent)*-35,r:(1-descent)*-11};
 }else if(id==='rookie'){
  back=platform(t,{warm:.8});const land=P(t/.6),slide=E((t-.7)/1.15),x=L(400,270,slide),y=639-(1-land)*280;
  art+=rookie({x,y,s:.85+.16*slide,t,r:(1-land)*25-13*Math.sin(slide*Math.PI),skate:true});
  for(let i=0;i<12;i++){const q=C((t-.65-i*.035)/.55);if(q>0&&q<1)art+=star(x-40-q*(30+i*9),y+45-q*(10+i%3*16),.12*(1-q),'#ffdfa4',t*40);}
  if(t>1.55)art+=`<g transform="${tr(267,390,P((t-1.55)/.45),-5)}"><rect x="-122" y="-46" width="244" height="80" rx="7" fill="#eed0ad" stroke="#a66c74" stroke-width="2"/>${text('شمارهٔ ۸',0,9,38,'#8e3659')}</g>`;
  cam={scale:1+.1*slide,x:(1-E(t/.4))*-70,y:0,r:-2*(1-slide)};
 }else if(id==='chase'){
  const jump=S((t-1.2)/.85),air=Math.sin(jump*Math.PI),slide=E((t-2.8)/.75),spin=S((t-1.3)/.9);
  back=platform(t,{track:t*210,warm:.65});
  art+=`<g transform="translate(${(480-t*210)%700+150} 0)"><ellipse cx="270" cy="511" rx="73" ry="114" fill="none" stroke="#af834e" stroke-width="18"/><ellipse cx="270" cy="506" rx="71" ry="113" fill="none" stroke="url(#gold)" stroke-width="11"/><path d="M258 393L270 373 283 393" fill="#f4deab"/></g>`;
  art+=`<path d="M-40 419Q273 526 584 400" stroke="#644b63" stroke-width="10" fill="none"/><path d="M-40 414Q273 521 584 395" stroke="url(#gold)" stroke-width="6" fill="none"/>`;
  for(let i=0;i<6;i++)art+=cotton({x:62+i*27-((t*25)%30),y:675-i%2*25,s:.44+i%2*.08,t:t+i*.1,r:Math.sin(t*6+i)*14});
  art+=rookie({x:299+Math.sin(t*3)*15,y:626-air*128+slide*10,s:.84,t,r:-air*25+slide*12,skate:true,pose:air>.4?'cheer':'cool'});
  art+=lines(t,2);
  cam={scale:1.02+.06*Math.sin(t*1.7),x:Math.sin(t*6)*8,y:air*25,r:360*spin,bgR:360*spin};
 }else if(id==='melt'){
  const danger=E((t-.2)/1.1),dolly=S(t/2.5);
  back=platform(t,{green:1,warm:0});
  art+=acetone({x:413,y:615,s:.73,t,open:1});
  art+=fumes(t,{strength:.85,cx:266,cy:484,spread:1.2});
  art+=`<path d="M-20 690L270 638 305 693 333 674 353 705 540 713V807H-20Z" fill="url(#ground)"/><path d="M270 638L286 681 310 690 301 730" fill="none" stroke="#4d435c" stroke-width="3"/>`;
  art+=rookie({x:237,y:632+Math.sin(t*16)*2,s:.88,t,mood:'shock',pose:'hang',glasses:false,pale:danger*.8});
  for(let i=0;i<4;i++){const q=((t*.9+i*.24)%1);art+=`<path transform="${tr(210+i*18,634+q*65,.36*(1-q*.3))}" d="M0-8Q-10 8 0 10Q10 8 0-8Z" fill="#dc5476" opacity="${(1-q)*danger}"/>`;}
  art+=`<ellipse cx="237" cy="568" rx="${91+Math.sin(t*7)*7}" ry="124" fill="none" stroke="#b7d7b0" stroke-opacity=".13" stroke-width="2"/>`;
  cam={scale:1+.18*dolly,bgScale:1-.12*dolly,x:-dolly*17,y:Math.sin(t*8)*1.5,r:Math.sin(t*1.4)*1.5};
 }else if(id==='team'){
  const orbit=S((t-.2)/2.5),angle=orbit*Math.PI*2,snap=E((t-2.8)/.4);
  back=platform(t,{green:.6,warm:.7});
  art+=fumes(t,{strength:1-E(t/.8),cx:270,cy:500,spread:1.5});
  art+=`<circle cx="270" cy="496" r="187" fill="url(#cyanflare)"/><ellipse cx="270" cy="661" rx="183" ry="38" fill="none" stroke="#c4efde" stroke-opacity=".25" stroke-width="2"/>`;
  const entries=[{fn:hero,phase:0,opts:{armor:1,bandage:.25,pose:'cheer'}},{fn:gel,phase:2.09,opts:{pose:'cheer'}},{fn:rookie,phase:4.19,opts:{coat:true,glasses:false,mood:'love'}}].map(o=>{
   const z=Math.sin(angle+o.phase),x=270+Math.cos(angle+o.phase)*127*(1-snap*.4),y=640+z*22;
   return {z,image:o.fn({x,y,s:(.65+z*.13)*(1+snap*.13),t,view:Math.cos(angle+o.phase)*.5,...o.opts})};
  }).sort((a,b)=>a.z-b.z);
  art+=entries.map(o=>o.image).join('');
  art+=pill('تیمِ درخشش',270,347,179,'#bde9de');
  cam={scale:1+snap*.14,x:-snap*8,y:Math.sin(angle)*8,r:Math.sin(angle)*4};
 }else if(id==='final'){
  const shield=E(t/.5),reflect=S((t-.7)/.65),sleep=S((t-1.55)/.35);
  back=platform(t,{warm:.75,green:.4*(1-sleep)});
  art+=acetone({x:412+reflect*10,y:636,s:.7,t,open:1-sleep,sleep:sleep>.5,r:Math.sin(t*40)*Math.exp(-Math.max(0,t-1.6)*12)*(t>1.6?4:0)});
  art+=fumes(t,{strength:(1-sleep)*.7,cx:L(311,416,reflect),cy:472,spread:1-reflect*.65});
  art+=gel({x:143,y:670,s:.78,t,pose:t<1.1?'slash':'cheer'});
  art+=rookie({x:266,y:662,s:.78,t,coat:true,pose:'cheer',glasses:false,mood:'happy'});
  art+=hero({x:69,y:692,s:.46,t,armor:1,bandage:.25,pose:'cheer'});
  art+=`<g opacity="${shield}"><path d="M193 432Q283 385 346 446L327 587Q294 628 260 648Q213 617 190 583Z" fill="url(#rainbow)" fill-opacity=".16" stroke="url(#rainbow)" stroke-width="5"/><path d="M210 450L308 604M230 436L329 575" stroke="#fff4e3" stroke-opacity=".19" stroke-width="10"/>${star(260,458,.7,'#f1ffe6',t*20)}</g>`;
  if(t>.7&&t<1.65)art+=`<path d="M${L(266,420,reflect)} 489L${L(287,438,reflect)} 460" stroke="url(#rainbow)" stroke-width="${15*(1-reflect)+3}" stroke-linecap="round"/>`;
  if(t>2.1)art+=pill('تیم، یک — استون، خواب!',270,340,258,'#d4ead8');
  cam={scale:1+.045*S(p),x:Math.sin(t*57)*Math.exp(-Math.max(0,t-1.6)*12)*(t>1.6?3:0),y:0,r:(1-E(t/.35))*-5};
 }else if(id==='twist'){
  const rise=S((t-.7)/1.65),eyesOpen=E((t-2.5)/.4),rumble=(1-S((t-2)/1))*.9;
  back=platform(t,{warm:.9});
  art+=`<circle cx="295" cy="467" r="240" fill="url(#flare)"/>`;
  art+=nine({x:284,y:872-rise*211,s:1.75,t,mood:eyesOpen>.6?'shock':'tired'});
  art+=hero({x:85,y:694,s:.35,t,mood:'shock',pose:'panic',armor:1});
  art+=rookie({x:451,y:696,s:.35,t,mood:'shock',glasses:false});
  if(t>2.1)art+=`<g transform="${tr(270,366,P((t-2.1)/.4))}">${pill('ناخن شمارهٔ نُه',0,0,217,'#efd7b2')}</g>`;
  cam={scale:1+.025*rise,x:Math.sin(t*44)*rumble*3,y:-rise*18+Math.cos(t*41)*rumble*2,r:Math.sin(t*.6)*1.2};
 }else if(id==='cta'){
  back=platform(t,{warm:.8});
  art+=nine({x:440,y:658,s:.74,t,mood:'tired'});
  art+=hero({x:91,y:675,s:.58,t,pose:'point',armor:1,bandage:.25});
  art+=rookie({x:204,y:675,s:.67,t,pose:'point',coat:true});
  art+=gel({x:328,y:677,s:.64,t,pose:'point'});
  art+=`<g transform="${tr(270,399+Math.sin(t*3)*4,.9,Math.sin(t)*6)}"><circle r="42" fill="url(#gold)"/><path d="M-24 1L25-20 10 24-2 8Z" fill="#fff4da"/><path d="M-2 8L25-20-12 2M-2 8L-3 20 6 13" stroke="#b38566" stroke-width="1.5" fill="none"/></g>`;
  art+=pill('قسمت بعد: نُه هنوز خواب‌آلوده!',270,466,287,'#c2dfd8');
  for(let i=0;i<7;i++)art+=star(71+(i*67)%400,499+(i*41)%135,.18+.13*(1+Math.sin(t*4+i)));
  cam={scale:1+.03*Math.sin(t*.8),x:Math.sin(t*.9)*3,y:0,r:0};
 }
 return motion(back,art,cam)+cinema(t);
}
function endcard(p,t,brand){
 const loop=E((p-.9)/.08);
 return `<g opacity="${1-loop}">${platform(t,{warm:.6,green:.25})}${hero({x:104,y:678,s:.49,t,pose:'cheer',armor:1,bandage:.25})}${rookie({x:214,y:678,s:.56,t,pose:'cheer',coat:true})}${gel({x:326,y:678,s:.54,t,pose:'cheer'})}${nine({x:440,y:673,s:.57,t})}<rect x="61" y="324" width="418" height="192" rx="24" fill="#19343b" fill-opacity=".94" stroke="#b6d6b8" stroke-opacity=".45"/>${text('ادامه دارد…',270,372,33,'#e4e9b2')}${text('قهرمان بعدی هنوز بیدار نشده!',270,408,18,'#c2dfd4')}<text x="270" y="450" text-anchor="middle" direction="ltr" font-family="Vazirmatn" font-weight="800" font-size="28" fill="#fff0d4">${brand.handle.replace(/[<>&]/g,'')}</text>${pill('فالو کن',270,470,144)}${cinema(t)}</g><g opacity="${loop}">${shot('hook',0,0)}</g>`;
}
const ids=['hook','acetone','army','rookie','chase','melt','team','final','twist','cta'];
for(const id of [...ids,'__endcard'])registerScene(id,{
 mount(el){el.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 960" aria-hidden="true">${T.defs}${extra}<g id="sequel-world"></g></svg>`;},
 update(el,p,t,brand){el.querySelector('#sequel-world').innerHTML=id==='__endcard'?endcard(p,t,brand):shot(id,p,t);}
});
window.Sequel={defs:T.defs+extra,rookie,acetone,cotton,nine,board,shot,text,pill,star};
})();
