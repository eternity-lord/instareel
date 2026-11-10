/* Reel 02. Original vector cast, cinematic set and deterministic choreography. */
(() => {
'use strict';
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const ease=v=>1-(1-clamp(v))**3;
const smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
const pop=v=>v<=0?0:1-Math.exp(-7*v)*Math.cos(10*v);
const lerp=(a,b,p)=>a+(b-a)*p;
const tr=(x,y,s=1,r=0)=>`translate(${x} ${y}) rotate(${r}) scale(${s})`;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=(s,x,y,size=22,c='#fff0d8',weight=800)=>`<text x="${x}" y="${y}" text-anchor="middle" direction="rtl" font-family="Vazirmatn" font-size="${size}" font-weight="${weight}" fill="${c}">${esc(s)}</text>`;
const star=(x,y,s=1,c='#ffdf99',r=0)=>`<path transform="${tr(x,y,s,r)}" d="M0-12Q2-2 12 0Q2 2 0 12Q-2 2-12 0Q-2-2 0-12" fill="${c}"/>`;
const heart=(x,y,s=.5)=>`<path transform="${tr(x,y,s)}" d="M0 11C-26-5-13-25 0-12C13-25 26-5 0 11Z" fill="#fda7c6"/>`;
const pill=(s,x,y,w=164,c='#f2c27c')=>`<g transform="translate(${x-w/2} ${y})"><rect width="${w}" height="34" rx="17" fill="${c}"/>${text(s,w/2,23,16,'#273443')}</g>`;
const defs=`<defs>
<radialGradient id="sky" cx="65%" cy="40%" r="85%"><stop stop-color="#314e61"/><stop offset=".45" stop-color="#192c40"/><stop offset="1" stop-color="#101725"/></radialGradient>
<linearGradient id="haze" x2="0" y2="1"><stop stop-color="#f4c08b" stop-opacity="0"/><stop offset=".6" stop-color="#e5b392" stop-opacity=".25"/><stop offset="1" stop-color="#7290a5" stop-opacity="0"/></linearGradient>
<linearGradient id="ridge" x2=".3" y2="1"><stop stop-color="#dc9a89"/><stop offset=".35" stop-color="#a56c77"/><stop offset="1" stop-color="#33364e"/></linearGradient>
<linearGradient id="ground" x2=".3" y2="1"><stop stop-color="#edb3a0"/><stop offset=".3" stop-color="#bd8991"/><stop offset=".75" stop-color="#5d536a"/><stop offset="1" stop-color="#1d273a"/></linearGradient>
<radialGradient id="pink" cx="30%" cy="25%" r="90%"><stop stop-color="#ffe4e5"/><stop offset=".3" stop-color="#ffafc7"/><stop offset=".65" stop-color="#f36f9c"/><stop offset="1" stop-color="#963e74"/></radialGradient>
<linearGradient id="gloss" x2="1" y2=".2"><stop stop-color="#fff7ef" stop-opacity=".7"/><stop offset=".4" stop-color="#ffbed6" stop-opacity=".05"/><stop offset=".7" stop-color="#fff1e6" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="gel" cx="28%" cy="18%" r="85%"><stop stop-color="#e2ffff"/><stop offset=".25" stop-color="#98e9ed" stop-opacity=".95"/><stop offset=".6" stop-color="#4bbaca" stop-opacity=".83"/><stop offset="1" stop-color="#316a99" stop-opacity=".95"/></radialGradient>
<linearGradient id="metal" x2="1" y2=".4"><stop stop-color="#426d83"/><stop offset=".23" stop-color="#c6e6e5"/><stop offset=".45" stop-color="#6d9daa"/><stop offset=".7" stop-color="#e3f2e6"/><stop offset="1" stop-color="#52758b"/></linearGradient>
<linearGradient id="gold" x2=".8" y2="1"><stop stop-color="#fff2bf"/><stop offset=".3" stop-color="#f8ce82"/><stop offset=".6" stop-color="#c78a54"/><stop offset="1" stop-color="#ffdf9c"/></linearGradient>
<radialGradient id="eye" cx="35%" cy="30%"><stop stop-color="#50607a"/><stop offset=".65" stop-color="#283447"/><stop offset="1" stop-color="#172133"/></radialGradient>
<linearGradient id="door" x2="1" y2=".8"><stop stop-color="#efac9c"/><stop offset=".28" stop-color="#c76575"/><stop offset=".7" stop-color="#883b5a"/><stop offset="1" stop-color="#492e4b"/></linearGradient>
<linearGradient id="window" x2="1" y2="1"><stop stop-color="#8dd0d3"/><stop offset=".45" stop-color="#386e88"/><stop offset="1" stop-color="#19384e"/></linearGradient>
<radialGradient id="flare"><stop stop-color="#fff4cb" stop-opacity=".85"/><stop offset=".15" stop-color="#ffdfa1" stop-opacity=".24"/><stop offset="1" stop-color="#efb791" stop-opacity="0"/></radialGradient>
<radialGradient id="cyanflare"><stop stop-color="#b4ffff" stop-opacity=".65"/><stop offset=".2" stop-color="#88e9e7" stop-opacity=".18"/><stop offset="1" stop-color="#66cedf" stop-opacity="0"/></radialGradient>
<radialGradient id="ao"><stop stop-color="#0e1929" stop-opacity=".65"/><stop offset="1" stop-color="#101b30" stop-opacity="0"/></radialGradient>
<linearGradient id="beam" x2="0" y2="1"><stop stop-color="#ebf8de" stop-opacity=".14"/><stop offset="1" stop-color="#b2d7cd" stop-opacity="0"/></linearGradient>
<pattern id="knit" width="13" height="15" patternUnits="userSpaceOnUse"><path d="M0 0Q12 6 6 15M13 0Q1 6 6 15" fill="none" stroke="#fff0cb" stroke-opacity=".28" stroke-width="2"/></pattern>
<pattern id="grain" width="67" height="73" patternUnits="userSpaceOnUse"><circle cx="3" cy="16" r=".6" fill="#fff" opacity=".17"/><circle cx="45" cy="39" r=".7" fill="#000" opacity=".2"/><circle cx="22" cy="67" r=".6" fill="#fff" opacity=".09"/><path d="M61 25h1" stroke="#fff" opacity=".1"/></pattern>
</defs>`;
function eyes({mood='brave',t=0,view=0,scale=1,y=-48}={}){
 let out='';const blink=Math.cos(t*1.35)>.998;
 for(let i=0;i<2;i++){
  const x=(i?22:-22)*scale+view*6;
  if(mood==='love')out+=heart(x,y,.57);
  else if(mood==='calm'||(blink&&i===0)||mood==='wink'&&i===1)out+=`<path d="M${x-12} ${y+1}Q${x} ${y-8} ${x+12} ${y+1}" fill="none" stroke="#2e3b51" stroke-width="4" stroke-linecap="round"/>`;
  else out+=`<ellipse cx="${x}" cy="${y}" rx="16" ry="${mood==='shock'?23:20}" fill="#fff9ee"/><ellipse cx="${x+2+view*3}" cy="${y+2}" rx="10" ry="${mood==='shock'?14:15}" fill="url(#eye)"/><ellipse cx="${x-2+view*3}" cy="${y-5}" rx="4.5" ry="5.3" fill="#fff"/><circle cx="${x+6+view*3}" cy="${y+8}" r="2" fill="#b8d2df"/>`;
 }
 const brow=mood==='tired'?'M-38-72L-13-79M13-79L38-72':mood==='shock'?'M-38-82Q-22-91-11-81M11-81Q22-91 38-82':mood==='angry'?'M-38-80L-13-70M13-70L38-80':'M-38-76Q-25-83-13-76M13-76Q25-83 38-76';
 out+=`<g transform="translate(${view*6} ${y+48})"><path d="${brow}" fill="none" stroke="#5a4162" stroke-width="3.5" stroke-linecap="round"/>`;
 if(mood==='shock')out+='<ellipse cy="-17" rx="8" ry="11" fill="#654261"/><ellipse cy="-13" rx="5" ry="3" fill="#e58b9f"/>';
 else if(mood==='tired')out+='<path d="M-9-13Q0-19 9-13" fill="none" stroke="#654261" stroke-width="3" stroke-linecap="round"/>';
 else out+=`<path d="M-13-22Q0-13 13-22Q8 ${-3+Math.sin(t*5)*2} 0-6Q-8-5-13-22Z" fill="#654261"/><path d="M-7-9Q0-14 7-9" stroke="#ee9db0" stroke-width="3" stroke-linecap="round"/>`;
 out+='</g>';return out;
}
function hero({x=0,y=0,s=1,t=0,mood='brave',pose='stand',r=0,armor=0,bandage=1,view=0,num='۷'}={}){
 const bob=Math.sin(t*3.6)*2,run=pose==='run'?Math.sin(t*15):0;
 const squash=pose==='crouch'?.78:1+.015*Math.sin(t*3);
 let arms=pose==='point'?[-65,-75]:pose==='panic'?[65,-65]:pose==='cheer'?[55,-55]:pose==='sneak'?[15,-40]:[8+Math.sin(t*3)*8,-8-Math.sin(t*3+1)*8];
 const shape='M-45 12C-61-23-42-92-10-139Q0-152 10-139C42-92 61-23 45 12Q0 40-45 12Z';
 let a=`<g transform="${tr(x,y+bob,s,r)}"><ellipse cy="35" rx="67" ry="15" fill="url(#ao)"/><g transform="scale(${1/squash} ${squash})">`;
 a+=`<ellipse cx="${-22+run*9}" cy="29" rx="15" ry="8" fill="url(#pink)" transform="rotate(${run*15} -22 29)"/><ellipse cx="${22-run*9}" cy="29" rx="15" ry="8" fill="url(#pink)"/>`;
 for(let i=0;i<2;i++){const side=i?1:-1;a+=`<g transform="rotate(${arms[i]+run*25} ${side*42} -13)"><path d="M${side*43}-13Q${side*64}-9 ${side*68} 2" fill="none" stroke="#ed87ac" stroke-width="12" stroke-linecap="round"/><circle cx="${side*68}" cy="2" r="8" fill="url(#pink)"/></g>`;}
 a+=`<path d="${shape}" fill="url(#pink)" stroke="${armor?'#ffe8b0':'#ffc3d5'}" stroke-width="${armor?3:1.6}"/><path d="M-39-16Q-43-66-7-120" fill="none" stroke="#fff5e8" stroke-width="5" stroke-linecap="round" opacity=".65"/><path d="M31-83Q50-38 40 10" fill="none" stroke="#9b3b75" stroke-width="2" opacity=".35"/><ellipse cx="-32" cy="-27" rx="11" ry="6" fill="#d85891" opacity=".35"/><ellipse cx="32" cy="-27" rx="11" ry="6" fill="#d85891" opacity=".35"/>${eyes({mood,t,view})}`;
 a+=`<circle cy="11" r="11" fill="${armor?'url(#gold)':'#d55b90'}" opacity=".9"/>${text(num,0,17,15,armor?'#58405d':'#ffe5e7')}`;
 if(bandage>0)a+=`<g transform="${tr(-2+Math.sin(t*2)*.4,-106,bandage, -20)}"><rect x="-22" y="-8" width="44" height="16" rx="7" fill="#ffe6bf" stroke="#e7b895" stroke-width="1"/><rect x="-8" y="-7" width="16" height="14" rx="3" fill="#f4cea9"/><path d="M-16-2v4M16-2v4M-3-3v6M3-3v6" stroke="#cc9b91" stroke-width="1.4"/></g>`;
 if(armor)a+=`<path d="M-42-5Q0 16 42-5" fill="none" stroke="url(#gold)" stroke-width="5"/><path d="M-45-13L-53-23-46-34-37-23M45-13L53-23 46-34 37-23" fill="url(#gold)"/><path d="M-24-99Q0-128 25-96" fill="none" stroke="#fff2ce" stroke-width="3" opacity=".6"/>${star(41,-88,.5+.12*Math.sin(t*6))}`;
 a+='</g></g>';return a;
}
function brush(x,y,s=1,r=0){return `<g transform="${tr(x,y,s,r)}"><rect x="-4" y="-68" width="8" height="92" rx="4" fill="url(#gold)"/><rect x="-13" y="-45" width="26" height="6" rx="3" fill="url(#metal)"/><path d="M-8-69L-10-106Q0-122 10-106L8-69Z" fill="#dbc6e5" stroke="#efffff" stroke-width="1.5"/><path d="M-6-102L6-102M-5-96H5M-5-90H5M-5-84H5" stroke="#7c9faf" stroke-width="1.5"/><circle cy="26" r="6" fill="#8bd7db"/></g>`;}
function gel({x=0,y=0,s=1,t=0,mood='brave',pose='stand',r=0,view=0}={}){
 const bob=Math.sin(t*2.6)*2,arm=pose==='slash'?-80+Math.sin(t*9)*28:pose==='point'?-65:pose==='cheer'?-38:-12+Math.sin(t*2)*4;
 return `<g transform="${tr(x,y+bob,s,r)}"><ellipse cy="39" rx="87" ry="17" fill="url(#ao)"/><path d="M-44-94Q-98-38-91 18Q-64 8-49 28L-20-23Z" fill="#4a8fbd" opacity=".6"/><path d="M-46-91Q-80-31-80 10" stroke="#a6e6e5" stroke-width="2" fill="none" opacity=".45"/>
 ${[0,1,2].map(i=>star(-73+Math.sin(t*3+i)*10,12-i*27,.2+.1*Math.sin(t*5+i),'#c2f8ed')).join('')}
 <ellipse cx="-30" cy="32" rx="21" ry="9" fill="url(#metal)"/><ellipse cx="30" cy="32" rx="21" ry="9" fill="url(#metal)"/>
 <path d="M-55-14L-78-2" stroke="url(#metal)" stroke-width="17" stroke-linecap="round"/><g transform="rotate(${arm} 52 -15)"><path d="M52-15L81-6" stroke="url(#metal)" stroke-width="17" stroke-linecap="round"/>${brush(85,0,.84,15)}</g>
 <path d="M-58 11Q-80-39-44-85Q-17-120 3-150Q12-124 44-92Q79-58 65-8Q55 37 0 35Q-44 36-58 11Z" fill="url(#gel)" stroke="#b7f5ed" stroke-width="1.8"/>
 <path d="M-51-32Q-65-67-32-100Q-11-124 2-143" fill="none" stroke="#effff2" stroke-width="5" opacity=".63" stroke-linecap="round"/><path d="M39-95Q72-51 57-14" fill="none" stroke="#2c638c" stroke-width="3" opacity=".45"/>
 <path d="M-50-70Q0-116 51-69L46-53Q0-87-46-53Z" fill="url(#metal)" stroke="#d2eee5" stroke-width="1.5"/><path d="M-45-67Q0-99 46-66" fill="none" stroke="#eaffed" stroke-width="2"/><path d="M-7-98L0-123 8-98 0-90Z" fill="url(#gold)"/>
 <g transform="translate(0 16) scale(.94)">${eyes({mood,t,view,y:-48})}</g>
 <path d="M-40 0Q0 22 43 0L32 24Q0 45-32 24Z" fill="url(#metal)" opacity=".8"/><path d="M0 10L9 18 0 28-9 18Z" fill="url(#gold)"/><path d="M-20 24Q0 31 21 24" fill="none" stroke="#e4ffef" opacity=".6" stroke-width="2"/>
 </g>`;
}
function propFace(t,mood='sly',scale=1){return `<g transform="scale(${scale})"><ellipse cx="-20" cy="-8" rx="11" ry="13" fill="#fff3df"/><ellipse cx="20" cy="-8" rx="11" ry="13" fill="#fff3df"/><ellipse cx="-17" cy="-5" rx="5" ry="8" fill="#2a3347"/><ellipse cx="17" cy="-5" rx="5" ry="8" fill="#2a3347"/><path d="M-32-25L-10-20M10-20L32-25" stroke="#50334f" stroke-width="3" stroke-linecap="round"/><path d="M-20 15Q0 ${28+Math.sin(t*3)*2} 20 12Q11 34-3 31Q-16 29-20 15" fill="#69475e"/><path d="M-13 21L11 20" stroke="#fff2db" stroke-width="4" stroke-linecap="round"/></g>`;}
function door({x=0,y=0,s=1,r=0,t=0}={}){
 return `<g transform="${tr(x,y,s,r)}"><ellipse cy="16" rx="125" ry="21" fill="url(#ao)"/><path d="M-110 0V-223Q-111-240-91-241H47Q72-242 85-218L115-163 103-7Q0 15-110 0Z" fill="url(#door)" stroke="#edb3a8" stroke-width="2"/><path d="M-96-218H40Q56-220 65-199L85-160H-96Z" fill="url(#window)" stroke="#5d4059" stroke-width="5"/><path d="M-81-215L-23-167M-64-216L-7-168" stroke="#f2f7df" stroke-width="7" opacity=".18"/><path d="M-98-146H99M-99-15Q0 0 92-16" stroke="#7b3e5b" stroke-width="4" fill="none"/><rect x="55" y="-139" width="35" height="10" rx="5" fill="url(#metal)"/><path d="M-105-211V-25" stroke="#ffc1b1" opacity=".5" stroke-width="3"/>${`<g transform="translate(1 -88)">${propFace(t,'sly',1.15)}</g>`}<path d="M-112-16H-117V-74H-111" stroke="url(#metal)" stroke-width="7" fill="none"/></g>`;
}
function can({x=0,y=0,s=1,r=0,t=0,tab=0}={}){
 let a=`<g transform="${tr(x,y,s,r)}"><ellipse cy="15" rx="64" ry="14" fill="url(#ao)"/><rect x="-52" y="-174" width="104" height="175" rx="13" fill="url(#metal)" stroke="#bdcbcd" stroke-width="1.5"/><ellipse cy="-174" rx="52" ry="10" fill="#d1dcda"/><ellipse cy="-174" rx="44" ry="7" fill="#718a98"/><path d="M-52-137Q0-126 52-137V-32Q0-20-52-32Z" fill="#b9667a"/><path d="M-43-123V-51" stroke="#f0b3ae" stroke-width="5" stroke-linecap="round" opacity=".3"/><g transform="translate(0 -84)">${propFace(t,'sly',.9)}</g><g transform="translate(0 -178) rotate(${tab})"><ellipse rx="16" ry="8" fill="url(#metal)" stroke="#516d80" stroke-width="2"/><ellipse rx="8" ry="3" fill="#43576d"/></g><path d="M-47-10Q0 0 47-10" stroke="#e3e5da" stroke-width="3" fill="none"/>`;
 for(let i=0;i<8;i++)a+=`<ellipse cx="${-34+(i*23)%70}" cy="${-155+(i*43)%140}" rx="${2+i%2}" ry="${3+i%2}" fill="#e7fff6" opacity=".45"/>`;
 return a+'</g>';
}
function yarn({x=0,y=0,s=1,r=0,t=0}={}){return `<g transform="${tr(x,y,s,r)}"><ellipse cy="24" rx="64" ry="13" fill="url(#ao)"/><ellipse cy="-24" rx="61" ry="55" fill="#e4c290" stroke="#fbe4b9" stroke-width="2"/><ellipse cy="-24" rx="60" ry="54" fill="url(#knit)"/><path d="M-42-62Q46-55 48 2M-52-43Q0-64 54-12M-55-17Q0-44 49 11" fill="none" stroke="#a88479" stroke-width="4" opacity=".6"/><g transform="translate(0 -20)">${propFace(t,'sly',.65)}</g><path d="M-51 0Q-76 19-94 0T-121 11" stroke="#edc996" stroke-width="7" stroke-linecap="round" fill="none"/></g>`;}
function landscape(t,{warm=0,light=0}={}){
 const drift=Math.sin(t*.18)*4;
 let a=`<rect width="540" height="960" fill="url(#sky)"/><g transform="translate(${drift} 0)"><path d="M-35 591Q10 346 121 365Q191 384 227 572L301 616Z" fill="#334354"/><path d="M284 619Q342 360 460 347Q566 335 581 610Z" fill="#3d4659"/><path d="M-29 669Q20 430 111 451Q190 468 210 643Z" fill="url(#ridge)"/><path d="M346 658Q375 435 478 416Q564 404 585 670Z" fill="url(#ridge)"/>
 <path d="M-20 691Q75 505 156 546Q247 596 283 742L-20 789Z" fill="#7c657b"/><path d="M304 750Q354 526 438 529Q519 528 563 731Z" fill="#6c6078"/>
 <path d="M-75 935Q-15 603 256 609Q514 591 612 935Z" fill="url(#ground)"/><path d="M-25 786Q84 624 261 627Q423 629 558 790M-16 806Q91 643 263 646Q427 648 551 810M-4 825Q100 662 266 665Q429 668 542 829M8 845Q112 682 266 686Q423 687 532 850M26 865Q115 703 266 706Q413 708 517 870M44 888Q131 726 269 726Q405 730 500 891" fill="none" stroke="#edb5a6" stroke-width="2" opacity=".18"/>
 <path d="M120 625L80 660 93 679 59 706M426 623L465 658 451 672 478 696" fill="none" stroke="#5d4b66" stroke-width="2" opacity=".5"/></g><rect y="320" width="540" height="370" fill="url(#haze)"/>`;
 a+=`<g transform="rotate(${-20+Math.sin(t*.3)*8} 364 230)"><path d="M332 200L-40 765H352L394 200Z" fill="url(#beam)"/><path d="M369 195L276 782H512L407 195Z" fill="url(#beam)" opacity=".5"/></g>`;
 if(warm)a+=`<circle cx="376" cy="423" r="260" fill="url(#flare)" opacity="${warm}"/>`;
 if(light)a+=`<circle cx="315" cy="410" r="260" fill="url(#cyanflare)" opacity="${light}"/>`;
 for(let i=0;i<30;i++){const x=(i*83+Math.sin(t*.4+i)*12+540)%540,y=290+((i*67-t*(7+i%3)+620)%440);a+=`<circle cx="${x}" cy="${y}" r="${.6+i%4*.45}" fill="${i%3?'#fae2bd':'#b3e3e0'}" opacity="${.12+.12*Math.sin(t+i)}"/>`;}
 return a;
}
function cinema(t){return `<rect width="540" height="960" fill="url(#grain)"/><rect width="540" height="${88+6*ease(t/.6)}" fill="#0a101a"/><rect y="807" width="540" height="153" fill="#0a101a"/><path d="M0 94H540M0 807H540" stroke="#eac188" opacity=".17"/><text x="270" y="861" text-anchor="middle" direction="ltr" fill="#b8b7b0" opacity=".32" font-family="Vazirmatn" font-size="9" letter-spacing="4">AN AYDA NAIL ROOM PICTURE</text>`;}
function flash(t,at){return clamp(1-Math.abs(t-at)/.075)*.18;}
function speed(t,x=270,y=497){let a='';for(let i=0;i<12;i++){let r=i*30+t*10;a+=`<path transform="${tr(x,y,1,r)}" d="M87 0H${130+i%3*18}" stroke="#e7ece0" stroke-width="${i%2?1:2}" opacity="${.06+.07*Math.sin(t*6+i)}"/>`;}return a;}
function scene(id,p,t){
 let back=landscape(t),art='',camera=1+.035*ease(p),panX=Math.sin(t*.5)*2,panY=Math.sin(t*.6)*2,rot=0,shake=0;
 if(id==='hook'){
  camera=1+.05*ease(t/1.1)+.015*p;
  art+=`<text x="355" y="520" text-anchor="middle" font-family="Vazirmatn" font-size="250" font-weight="800" fill="#f6cd99" opacity=".055">۷</text>`;
  art+=hero({x:270,y:651,s:.83,t,mood:t>1.4?'shock':'tired',pose:t>1.6?'panic':'stand'});
  art+=pill('مأموریت: سالم موندن',270,358,209,'#c6d5d0');
  art+=`<path d="M196 685H343" stroke="#f9d3a5" stroke-width="1" opacity=".4"/>${star(354,556,.35,'#f8d89f')}`;
 }else if(id==='door'){
  panX=(1-ease(t/.45))*65;
  const approach=ease(t/1.3),slam=smooth((t-1.82)/.38),escape=smooth((t-1.25)/.65);
  art+=door({x:348-approach*25,y:605,s:.97,r:-35+approach*14+slam*24,t});
  art+=hero({x:217-escape*100,y:670-40*Math.sin(escape*Math.PI),s:.66,t,mood:'shock',pose:escape>.1?'run':'panic',r:-escape*28+pop((t-2.45)/.6)*20});
  if(t>2.15){let q=clamp((t-2.15)/.8);art+=`<ellipse cx="340" cy="649" rx="${28+q*154}" ry="${6+q*30}" fill="none" stroke="#f7d4b7" stroke-width="${5*(1-q)}" opacity="${1-q}"/><path d="M324 638L285 658 307 677 251 703" stroke="#3b344a" stroke-width="3" fill="none" opacity="${ease(q*4)}"/>`;}
  shake=Math.exp(-Math.max(0,t-2.16)*10)*(t>2.16?6:0);
  art+=pill('خطر شمارهٔ ۱',150,338,155,'#e2b5ab');
 }else if(id==='can'){
  const creep=ease(t/2.6);camera=1+.03*p;
  art+=`<g transform="rotate(${Math.sin(t*1.3)*27} 380 360)"><path d="M389 371L74 667H346Z" fill="#edf5ce" opacity=".08"/></g>`;
  art+=can({x:352,y:625,s:1.15,t,tab:-25*clamp(Math.sin(t*4))});
  art+=hero({x:100+creep*99,y:679-Math.abs(Math.sin(t*7))*5,s:.62,t,mood:'tired',pose:'sneak',r:-7+Math.sin(t*3)*2});
  for(let i=0;i<14;i++){let yy=633-((t*35+i*29)%180);art+=`<circle cx="${330+Math.sin(t+i)*47}" cy="${yy}" r="${2+i%3*2}" fill="#d6efdb" opacity="${.06+.06*Math.sin(t+i)}"/>`;}
  art+=pill('کمینِ قوطی',173,344,151,'#d1dbce');
 }else if(id==='thread'){
  camera=1+.055*p;rot=Math.sin(t*.5)*1.3;
  const coil=smooth((t-.5)/1.2),freeze=smooth((t-2.3)/.25);
  art+=yarn({x:382,y:587,s:.94,r:-8,t});
  art+=hero({x:225,y:666,s:.8,t,mood:'shock',pose:'panic',r:Math.sin(t*5)*3*(1-freeze)});
  art+=`<path d="M334 577Q${274+Math.sin(t*5)*17} ${470-coil*20} 181 563Q${126-coil*28} 657 227 665Q${295+coil*28} 648 267 591Q${232-Math.sin(t*4)*12} 542 181 580" fill="none" stroke="#725a69" stroke-width="10" stroke-linecap="round"/><path d="M334 574Q${274+Math.sin(t*5)*17} ${467-coil*20} 181 560Q${126-coil*28} 654 227 662Q${295+coil*28} 645 267 588Q${232-Math.sin(t*4)*12} 539 181 577" fill="none" stroke="#e5c494" stroke-width="6" stroke-linecap="round"/>`;
  if(t>2.5){const q=pop((t-2.5)/.5);art+=`<g transform="${tr(264,419,q,-7)}"><rect x="-107" y="-74" width="214" height="126" rx="7" fill="#f0d4a7" stroke="#a47970" stroke-width="3"/><path d="M-94-62H94M-94 39H94" stroke="#b69178" stroke-width="1"/>${text('تحت تعقیب',0,-35,25,'#704858')}<path d="M-60-10Q-30-35-5-8T47-6" stroke="#a77b71" stroke-width="6" fill="none" stroke-linecap="round"/>${text('فقط یک تار پشمی!',0,26,15,'#8b615f')}</g>`;}
  art+=`<path transform="${tr(178,546+Math.sin(t*4)*4,.65)}" d="M0-12Q-14 4 0 9Q14 4 0-12Z" fill="#b2e4ea"/>`;
 }else if(id==='hero'){
  back=landscape(t,{light:.9,warm:.35});
  const land=pop(t/.85);panY=(1-ease(t/.4))*-20;
  art+=`<path d="M286 282L198 687H438L348 282Z" fill="#b6f6f0" opacity="${.13+.03*Math.sin(t*3)}"/><circle cx="320" cy="469" r="132" fill="url(#cyanflare)"/><ellipse cx="331" cy="670" rx="${70+land*30}" ry="14" fill="url(#cyanflare)"/>`;
  art+=hero({x:149,y:670,s:.66,t,mood:t>.6?'love':'shock',pose:'cheer',view:1});
  art+=gel({x:339,y:652-(1-land)*233,s:1.12,t,mood:'brave',pose:'cheer',r:(1-land)*-12});
  for(let i=0;i<10;i++)art+=star(238+(i*47)%180,363+(i*37+t*15)%253,.2+.2*(1+Math.sin(t*5+i)),'#d9fff1',t*12);
  art+=pill('ژل؛ شوالیهٔ درخشان',274,338,225,'#c6ece6');
 }else if(id==='combo'){
  back=landscape(t,{light:.9});
  const stage=Math.min(3,Math.floor(t/.8)),power=ease((t-2.4)/.5);
  art+=`<circle cx="269" cy="526" r="${90+Math.sin(t*6)*8}" fill="url(#cyanflare)"/><g transform="${tr(269,629,1)}"><path d="M-113 8V-42Q-113-105 0-105Q113-105 113-42V8Z" fill="url(#metal)" stroke="#d6f7ed" stroke-width="2"/><path d="M-96 8V-35Q-95-83 0-83Q95-83 96-35V8Z" fill="#223d5a"/><ellipse cy="6" rx="96" ry="17" fill="#adb4ff" opacity="${.1+power*.5}"/><rect x="-24" y="-97" width="48" height="12" rx="6" fill="#d0eaff"/>${text('UV',0,-88,9,'#3b6380')}</g>`;
  art+=hero({x:270,y:599,s:.91,t,mood:stage>=3?'happy':'shock',pose:stage>=3?'cheer':'stand',armor:power,bandage:1-power});
  art+=gel({x:102,y:674,s:.62,t,mood:'brave',pose:'slash'});
  ['بیس','رنگ','تاپ'].forEach((name,i)=>{if(t>=i*.8)art+=`<g opacity="${ease((t-i*.8)/.2)}">${pill(name,180+i*90,341,78,i===stage?'#f3cf8e':'#b5deda')}</g>`;});
  for(let i=0;i<3;i++){const q=clamp((t-i*.8)/.45);if(q>0&&q<1)art+=`<g opacity="${Math.sin(q*Math.PI)}"><path d="M${70+q*200} 440L${310+q*130} 590" stroke="${['#c1f4f0','#ffb6d1','#fff0bb'][i]}" stroke-width="${18*(1-q)+2}" stroke-linecap="round"/>${speed(t)}</g>`;}
  for(let i=0;i<3;i++){const q=((t-2.4+i*.35)%1+1)%1;if(power)art+=`<ellipse cx="270" cy="580" rx="${50+q*135}" ry="${11+q*24}" fill="none" stroke="#bdf9ed" opacity="${(1-q)*.5*power}" stroke-width="2"/>`;}
  if(stage>=3)art+=pill('قدرتِ درخشش',270,432,173,'#f0d09a');
 }else if(id==='win'){
  back=landscape(t,{warm:1});
  const shield=.75+.06*Math.sin(t*3);
  art+=`<circle cx="270" cy="557" r="143" fill="url(#flare)"/><ellipse cx="270" cy="579" rx="114" ry="142" fill="#f2d698" fill-opacity=".03" stroke="#f5d18e" stroke-opacity="${shield}" stroke-width="2"/><ellipse cx="270" cy="579" rx="121" ry="149" fill="none" stroke="#ffde9f" stroke-opacity=".12" stroke-width="7"/>`;
  const bounce=(at)=>{let q=clamp((t-at)/.6);return {q,d:Math.sin(q*Math.PI)*38};};
  let b=bounce(.3);art+=door({x:118-b.d,y:610-b.d*.3,s:.38,r:-18-b.q*28,t});
  b=bounce(1);art+=can({x:420+b.d,y:591-b.d*.3,s:.48,r:18+b.q*28,t,tab:t*20});
  b=bounce(1.8);art+=yarn({x:402+b.d*.5,y:688-b.d*.3,s:.42,r:b.q*40,t});
  art+=hero({x:270,y:658,s:1.12,t,mood:'wink',pose:'cheer',armor:1,bandage:1-ease(t/.8)});
  const flick=ease((t-.4)/.6);if(flick>0&&flick<1)art+=`<g transform="${tr(270-flick*111,504-flick*100,1-flick*.4,flick*240)}"><rect x="-15" y="-5" width="30" height="10" rx="4" fill="#ffe4bd"/></g>`;
  art+=pill('هنوز سرپاست!',270,343,176,'#f4d49e');
  for(let i=0;i<7;i++)art+=star(115+(i*61)%310,415+(i*39)%220,.2+.15*(1+Math.sin(t*4+i)));
 }else if(id==='cta'){
  back=landscape(t,{warm:.6,light:.3});
  art+=hero({x:206,y:663,s:.92,t,mood:'wink',pose:'point',armor:1,bandage:0});
  art+=gel({x:383,y:662,s:.88,t,mood:'happy',pose:'point',view:-1});
  const peek=ease((t-1.5)/.6);
  art+=hero({x:62,y:818-peek*128,s:.43,t:t+.5,mood:'shock',pose:'panic',num:'۸'});
  art+=`<g transform="${tr(275,403+Math.sin(t*3)*3,.9,Math.sin(t)*4)}"><circle r="41" fill="url(#gold)"/><path d="M-24 1L25-20 10 24-2 8Z" fill="#fff4da"/><path d="M-2 8L25-20-12 2M-2 8L-3 20 6 13" fill="none" stroke="#b38566" stroke-width="1.6"/></g>`;
  if(t>1.5)art+=`<g opacity="${peek}">${pill('بعدی: شمارهٔ ۸',270,472,196,'#b8dcd7')}</g>`;
 }
 const wx=panX+Math.sin(t*67)*shake,wy=panY+Math.cos(t*71)*shake;
 const world=back+`<g transform="translate(${270+wx} ${520+wy}) rotate(${rot}) scale(${camera}) translate(-270 -520)">${art}</g>`;
 return world+(id==='door'?`<rect width="540" height="960" fill="#ffedcb" opacity="${flash(t,2.18)}"/>`:'')+cinema(t);
}
function endcard(p,t,brand){
 const loop=ease((p-.9)/.08);
 return `<g opacity="${1-loop}">${landscape(t,{warm:.6,light:.5})}${hero({x:177,y:668,s:.76,t,mood:'happy',armor:1,bandage:0,pose:'cheer'})}${gel({x:366,y:668,s:.79,t,pose:'cheer'})}<rect x="66" y="315" width="408" height="205" rx="23" fill="#172b3d" fill-opacity=".93" stroke="#c4ddcf" stroke-opacity=".3"/>${text('مأموریتِ درخشش',270,361,32,'#f7d59f')}${text('ادامه دارد…',270,398,20,'#afd9d9')}<text x="270" y="442" text-anchor="middle" direction="ltr" font-family="Vazirmatn" font-weight="800" font-size="28" fill="#f9ebd3">${esc(brand.handle)}</text>${pill('فالو کن',270,465,144)}${cinema(t)}</g><g opacity="${loop}">${scene('hook',0,0)}</g>`;
}
const ids=['hook','door','can','thread','hero','combo','win','cta'];
for(const id of [...ids,'__endcard'])registerScene(id,{
 mount(el){el.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 960" aria-hidden="true">${defs}<g id="trailer-world"></g></svg>`;},
 update(el,p,t,brand){el.querySelector('#trailer-world').innerHTML=id==='__endcard'?endcard(p,t,brand):scene(id,p,t);}
});
window.Trailer={defs,hero,gel,door,can,yarn,scene,text,pill,star,landscape,cinema,brush,eyes,heart};
})();
