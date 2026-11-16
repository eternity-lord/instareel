/* Scenario 10 — original ink-doodle reinterpretation. Pure functions of time.
   Poses + ink boil: 12 fps. Camera: continuous. No wall-clock animation. */
(()=>{
'use strict';
const INK='#34303e',C=['#ed91a9','#f4c99c','#9fbed0','#b4b283','#c0a1cd','#e7b96f'];
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x);};
const mix=(a,b,p)=>a+(b-a)*p,pose=t=>Math.floor(t*12)/12;
const tr=(x,y,s=1,r=0)=>`translate(${x} ${y}) rotate(${r}) scale(${s})`;
const txt=(s,x,y,size=22,fill=INK,rot=0)=>`<text transform="rotate(${rot} ${x} ${y})" x="${x}" y="${y}" text-anchor="middle" direction="rtl" font-family="Vazirmatn" font-size="${size}" font-weight="800" fill="${fill}">${s}</text>`;
function path(d,fill='none',sw=3,extra=''){return `<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;}
function line(d,sw=3,extra=''){return path(d,'none',sw,extra);}
const defs=`<defs><filter id="inkBoil" x="-15%" y="-15%" width="130%" height="130%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="1" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G"/></filter><pattern id="paper" width="83" height="79" patternUnits="userSpaceOnUse"><path d="M3 14l7-1m27 24l4 1m24 27l9-1M12 64h3m51-51h6" stroke="#695342" opacity=".095" stroke-width=".7"/><circle cx="35" cy="68" r=".6" fill="#604a38" opacity=".12"/></pattern><pattern id="hatch" width="9" height="9" patternUnits="userSpaceOnUse"><path d="M-2 9L9-2M5 14l9-9" stroke="#44313f" stroke-width="1.1" opacity=".32"/></pattern><linearGradient id="dusk" x2=".2" y2="1"><stop stop-color="#c3cbd7"/><stop offset="1" stop-color="#99aec4"/></linearGradient><radialGradient id="sun"><stop stop-color="#ffe4a4"/><stop offset="1" stop-color="#f0d9ac"/></radialGradient><mask id="inkSwipe"><rect width="540" height="960" fill="white"/></mask></defs>`;
function icon(i,x,y,s=1){let a='';
 if(i===0)a=path('M-23-14H13V17H-23ZM13-5L31-17V20L13 9Z','#edd7d3',2.4)+`<circle cx="-15" cy="-24" r="9" fill="#f6e7d7" stroke="${INK}" stroke-width="2.3"/><circle cx="5" cy="-24" r="9" fill="#f6e7d7" stroke="${INK}" stroke-width="2.3"/>`;
 if(i===1)a=`<circle cx="-5" cy="-6" r="22" fill="#e7eff0" stroke="${INK}" stroke-width="3.5"/>`+line('M11 10l23 25',8)+line('M-19-14q8-12 17-10',2);
 if(i===2)a=txt('Z',-17,17,28)+txt('z',9,0,23)+txt('z',26,-17,17);
 if(i===3)a=path('M-30 0l13-13 17 10 17-9 17 15-22 22-14-7-12 1Z','#f6c9a1',2.7)+line('M-1-3L10 7l10-9M-11 4L4 17M-19 10L-5 22',1.8);
 if(i===4)a=path('M-15-26H15V26L0 16-15 26Z','#f0ce79',2.5);
 return `<g transform="${tr(x,y,s)}" data-icon="${i}">${a}</g>`;
}
function badge(i,x,y,s=1){return `<g transform="${tr(x,y,s,-3+i*2)}"><circle r="36" fill="${C[i+2]}" stroke="${INK}" stroke-width="2.4"/><circle r="32" fill="none" stroke="${INK}" stroke-opacity=".25" stroke-dasharray="4 5"/>${icon(i,0,0,.65)}<circle cx="26" cy="26" r="12" fill="#fff1d9" stroke="${INK}" stroke-width="2"/>${txt('۱۲۳۴'[i],26,31,14)}</g>`;}
function eye(x,y,kind,t,look=0){
 if(kind==='sleep')return line(`M${x-13} ${y}q13 10 26-1`,3);
 if(kind==='love')return `<path d="M${x-12} ${y}q-6-18 12-9q18-9 12 9l-12 16Z" fill="#a45269"/>`;
 const rx=kind==='shock'?16:14,ry=kind==='anxious'?19:17,pupil=kind==='anxious'?5:kind==='happy'?9:7;
 return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff9ec" stroke="${INK}" stroke-width="2.2"/><ellipse cx="${x+look*4+Math.sin(t*2)*1.2}" cy="${y+2}" rx="${pupil}" ry="${pupil+3}" fill="${INK}"/><circle cx="${x+look*4+3}" cy="${y-3}" r="3.5" fill="#fff6df"/>`;
}
function blob(type,x,y,s,t,mood='happy',act='rest',look=0){
 const q=pose(t),bob=Math.sin(q*4+type)*2.5,breath=1+Math.sin(q*3)*.022;
 const color=C[type],body='M-62 24C-78-4-62-66-28-79C4-99 55-72 63-38C79-13 74 35 48 52C18 74-42 66-62 24Z';
 const arms=act==='wave'?Math.sin(q*10)*20:act==='panic'?Math.sin(q*14)*15:act==='hug'?14:0;
 let a=`<ellipse cx="1" cy="66" rx="66" ry="10" fill="url(#hatch)"/>`;
 a+=path('M-35 49l-6 16q-16 13-23 0l13-16M27 50l7 17q18 10 24-4L48 48',color,2.7);
 a+=path(`M-58-4Q-99 ${-5-arms} -88 ${16-arms}Q-82 ${27-arms} -67 18`,color,2.8)+path(`M61-9Q94 ${-23-arms} 93 ${-1-arms}Q87 ${10-arms} 70 11`,color,2.8);
 a+=`<path d="${body}" fill="${color}" transform="translate(2 -1.2)"/><g filter="url(#inkBoil)">${line(body,3.5)}${line('M-57 16q8 30 37 36',1.5)}${path('M-57 16q5 34 46 40l-8-17-24-14Z','url(#hatch)',0)}</g>`;
 if(type===0){a+=line(`M-12-79Q-28-107 ${-10+Math.sin(q*5)*8}-127`,4)+`<g transform="${tr(-10+Math.sin(q*5)*8,-136,1,-15)}">${path('M-9-9H9V15H-9Z','#775d81',2)}${path('M-9-10Q-16-28 0-39Q16-25 9-10Z','#ed669a',2)}${line('M-1-31l-4 13',1.5)}</g>`;
 a+=path('M-39 20H36L32 53H-35Z','#c56788',2)+line('M-29-5L-34 24M23-5L29 24',4)+path('M-10 32H14V44H-10Z','#f7decf',1.5);
 }else if(type===1){a+=`<g transform="translate(9 -81) rotate(-9)">${path('M-19-7H18V9H-19Z','#e3ac74',2.8)}${line('M-11-4V5M-3-4V5M5-4V5M13-4V5',1.3)}</g>`;
 }else a+=badge(type-2,35,34,.45);
 const eyes=mood==='sleep'?'sleep':mood==='love'?'love':mood==='anxious'?'anxious':mood==='shock'?'shock':'happy';
 a+=eye(-27,-26,eyes,q,look)+eye(24,-26,eyes,q,look);
 const brow=mood==='angry'?9:mood==='anxious'?-8:0;
 a+=line(`M-43-52q13 ${-9+brow} 27 ${brow}M12 ${-52+brow}q13 ${-10-brow} 27 ${-brow}`,3);
 if(mood==='shock'||mood==='anxious')a+=`<ellipse cx="0" cy="13" rx="${mood==='shock'?12:7}" ry="${mood==='shock'?17:9}" fill="${INK}"/>`;
 else if(mood==='sleep')a+=`<ellipse cx="1" cy="14" rx="8" ry="10" fill="${INK}"/>`;
 else if(mood==='sad'||mood==='angry')a+=line('M-14 20q14-17 29-1',3);
 else a+=path('M-18 4Q0 17 20 3Q15 36-3 29Q-13 23-18 4Z',INK,1)+path('M-6 24Q5 14 14 23Q6 33-6 24','#df849a',0);
 a+=`<ellipse cx="-44" cy="3" rx="11" ry="5" fill="#c8737f" opacity=".45"/><ellipse cx="43" cy="3" rx="11" ry="5" fill="#c8737f" opacity=".45"/>`;
 if(mood==='anxious')a+=path('M48-47q-13 17-2 18q13-1 2-18Z','#a4c2d1',1.5);
 return `<g data-blob="${type}" data-pose="${q}" transform="${tr(x,y+bob,s)}"><g transform="scale(${breath} ${2-breath})">${a}</g></g>`;
}
function nail(x,y,s=1,r=0,t=0){return `<g transform="${tr(x,y,s,r)}">${path('M-22 30L-23-22Q-20-67 0-80Q21-66 24-23L21 30Z','#ed87ad',3.1)}${path('M-20 12Q0 19 22 10V30H-22Z','#f7dccd',1.8)}${line('M-12-28Q-13-54-1-64',4,'stroke="#fff0db"')}${line(`M${-20+clamp(t%2)*30}-37l11-14`,2,'stroke="#fff8e9"')}${line('M-9-7L2-13 11-7 7 4-5 5Z',1.3)}</g>`;}
function bottle(x,y,r=0){return `<g transform="${tr(x,y,1,r)}">${path('M-11-23H11V-7L16-2V28Q0 34-16 28V-2L-11-7Z','#e794ac',2.3)}${path('M-11-27H11V-8H-11Z','#6b6275',2)}${line('M-8 3V21',2,'stroke="#ffe9d7"')}</g>`;}
function phone(x,y,s=1,r=0){return `<g transform="${tr(x,y,s,r)}">${path('M-38-72H38V70H-38Z','#e4d4bd',3.5)}${path('M-31-56H31V49H-31Z','#b6c7cb',2)}${nail(0,28,.6,0,0)}${line('M-7 60H8',3)}<circle cy="-63" r="2.5" fill="${INK}"/></g>`;}
function burst(word,x,y,s=1){return `<g transform="${tr(x,y,s,-7)}">${path('M-61-20l18-7 7-18 20 14 18-17 9 23 29-10-2 24 24 9-23 15 9 25-29-3-5 21-22-14-19 9-4-23-25-2 12-20Z','#f1ca66',2.2)}${txt(word,0,10,24)}</g>`;}
function arrow(x,y,s=1,r=0){return `<g transform="${tr(x,y,s,r)}">${line('M-45 4Q-16-27 23-8L9-22M23-8L5 2',3)}</g>`;}
function heart(x,y,s=1){return `<g transform="${tr(x,y,s)}">${path('M0 14C-39-8-15-37 0-17C15-37 39-8 0 14Z','#d67487',2)}</g>`;}
function desk(t,cool=false){return `<g>${path('M32 654L495 634 513 675 23 697Z',cool?'#a7b8c8':'#e5be98',3)}${line('M52 690L34 807M480 676L503 793',8)}${line('M73 689L60 790M456 681L478 779',2)}${bottle(403,610,-3)}${bottle(453,610,4)}</g>`;}
function scenery(kind,t){
 let a='';const q=pose(t);
 if(kind==='door'){
 a+=path('M-80 341L613 314V872L-80 891Z','#dfba93',3)+path('M96 408L426 386V809L96 834Z','#796b7e',4)+path('M109 421L408 402V795L109 815Z','#f3dfbf',3)+line('M119 813L403 405',2)+path('M154 352L367 340 371 390 153 401Z','#efd6a5',3)+txt('نیل‌روم',263,380,25)+line('M-40 856l598-25M-20 900l600-26',3);
 for(let i=0;i<5;i++)a+=line(`M${-140+i*180} 890l70 210`,2);
 a+=path('M-5 635q47-56 60 15q-16 39-29 20q-45 0-31-35Z','#a6b496',2)+path('M-2 675H57L47 767H7Z','#d49a8c',2.5);
 }else if(kind==='couch'){
 a+=path('M26 520Q12 486 45 466H465Q502 487 488 524L478 694H38Z','#b8b09d',4)+path('M41 564Q265 540 480 564V669H41Z','#d3bc99',3)+line('M201 559V668M349 555V666',2)+line('M59 692l-9 46M461 692l9 45',6);
 a+=line('M15 385H518',7);
 for(let i=0;i<7;i++)a+=bottle(38+i*75,350-Math.max(0,Math.sin(q*8+i))*9,Math.sin(q*7+i)*8);
 }else if(kind==='window'){
 a+=path('M21 304H510V664H21Z','#e8bd76',4)+path('M36 321H495V647H36Z','#ffebae',2)+line('M266 320V646M36 480H495',5);
 a+=path('M-100 420L125 320 596 886 318 923Z','#fff1c8',0,'opacity=".5"');a+=desk(t);
 }else{
 a+=path('M24 313H244V589H24Z',kind==='dusk'?'#a3b1c3':'#c7d0c3',3)+line('M132 316V587M26 453H243',3)+line('M-100 733H640M-130 805H650',2);
 for(let i=0;i<7;i++)a+=line(`M${-110+i*130} 733l${(i-3)*38} 380`,1.5);
 if(kind==='lamp')a+=line('M403 306v90',3)+path('M353 430Q393 346 447 421Z','#e6bf6f',3)+path('M379 425L258 678H551L425 426Z','#ffedba',0,'opacity=".65"');
 a+=desk(t,kind==='dusk');
 }
 return `<g data-environment="${kind}" filter="url(#inkBoil)">${a}</g>`;
}
function base(t,tone='warm'){
 const bg=tone==='dusk'?'url(#dusk)':tone==='gold'?'url(#sun)':'#f5e7cb';
 return `<rect width="540" height="960" fill="${bg}"/><path d="M-30 120Q130 98 560 132M-20 884Q300 911 570 878" stroke="${INK}" opacity=".065" stroke-width="18" fill="none"/>`;
}
function hands(t,calm=false){const q=pose(t),j=calm?0:Math.sin(q*26)*3,join=ease((t-.25)/1.1);return `<g data-hands="true">${path(`M28 666L164 ${526+j}Q202 ${504+j} 228 ${522+j}L293 ${552+j}Q310 ${568+j} 288 ${576+j}L220 ${563+j}L179 597 88 715Z`,'#f3c69e',3.4)}${calm?path(`M527 664L${mix(430,346,join)} 528Q${mix(400,299,join)} 500 ${mix(375,261,join)} 526L${mix(355,217,join)} 558Q${mix(330,200,join)} 579 ${mix(355,226,join)} 590L${mix(420,315,join)} 569L459 716Z`,'#e8b663',3.4):''}${line(`M203 ${541+j}l52 18m-38-29l51 18m-31-27l42 18`,2)}${calm?line('M237 558l39 17m-18-32l40 19m-16-31l38 19',2):''}${nail(264,561,.34,-72,t)}</g>`;}
function pulse(t,calm=false){let d='M0 0';for(let x=0;x<=540;x+=15){const y=calm?Math.sin(x*.035-t*3)*6:Math.sin(x*.13+t*7)*12+(x%90===0?-24:0);d+=`L${x} ${y}`;}return `<g transform="translate(0 731)">${line(d,2.2,`stroke="${calm?'#829c78':'#6c647a'}"`)}</g>`;}
// Camera anchors are world-space subject positions; view target is always the safe action band.
function camera(x,y,z,r=0){return `translate(270 552) rotate(${r}) scale(${z}) translate(${-x} ${-y})`;}
function scene(id,p,t){
 const q=pose(t);let a='',env='desk',tone='warm',cx=270,cy=550,z=1,r=0,front='';
 const H=(x=131,y=657,s=.95,m='happy',act='rest')=>blob(0,x,y,s,q,m,act);
 const U=(x=393,y=653,s=.96,m='happy',act='rest')=>blob(1,x,y,s,q,m,act);
 const F=(i,x,y,s=.87,m='happy',act='rest')=>blob(i+2,x,y,s,q,m,act);
 if(id==='hook'){
 env='door';z=1.12+.2*ease(p);r=Math.sin(t*4)*1.3;
 // First frame already contains the client and four distinct friend badges in a cramped doorway.
 a+=F(2,330,602,.73,'sleep')+F(1,213,576,.78,'shock','wave')+F(0,382,664,.8,'happy','wave')+F(3,174,704,.8,'happy','hug')+U(279,669,1.05,'shock','panic')+H(96,720,.6,'shock','panic');
 a+=line('M106 432l-15 51 19 23-26 40M411 419l25 43-12 22 25 38',4)+burst('کرچ!',436,454,.61);
 a+=`<g data-draw-on="title">${line('M139 377Q260 344 404 368',5,`stroke-dasharray="300" stroke-dashoffset="${300*(1-ease(t/.65))}"`)}${txt('۴ نوع دوست',270,342,31,INK,-3)}</g>`;
 if(t>.9&&t<1.65){z=1.52+.42*ease((t-.9)/.75);cx=280;cy=634;a+=burst('جا نیست!',323,507,.55);}
 if(t>1.65){z=1.3+.18*ease((t-1.65)/1.35);cx=270;cy=626;}
 }else if(id==='filmer'){
 a+=H(130,661,1,'angry')+U(373,664,.93)+F(0,466,588,.68,'happy','wave')+phone(292,535,.9,-8+Math.sin(q*6)*3);
 a+=txt('یه برداشت دیگه!',270,408,23,INK,-5)+arrow(370,453,.65,43);
 if(t<.65){z=1.08+.35*ease(t/.65);cx=275;cy=554;}
 else if(t<1.65){z=2.1+.35*ease((t-.65));cx=287;cy=516;
 front+=`<g data-phone-pov="true" opacity=".96">${path('M53 321H488V739H53Z','none',4)}${line('M67 366v-28h28M475 366v-28h-28M67 688v30h28M475 688v30h-28',4)}<circle cx="89" cy="384" r="7" fill="#c05865"/>${txt('REC',133,391,17)}${txt('۰۱ : ۰۰',395,697,15)}</g>`;
 }else if(t<2.5){z=3.1;cx=104+Math.sin(t*3)*5;cy=635;}
 else{z=1.3+.22*ease((t-2.5)/1.3);cx=277;cy=594;a+=burst('تق!',383,475,.55);}
 }else if(id==='inspector'){
 env='lamp';a+=H(129,668,.96,'anxious')+U(390,675,.87,'shock')+F(1,363,514,.87,'angry','wave');
 a+=`<g transform="${tr(270,532,1,-18)}"><circle r="83" fill="#e9eddf" fill-opacity=".63" stroke="${INK}" stroke-width="7"/>${line('M59 59l68 73',15)}<circle cx="-8" cy="-5" r="43" fill="#fff8df" stroke="${INK}" stroke-width="3"/><circle cx="${Math.sin(q*12)*16}" cy="-3" r="19" fill="${INK}"/><circle cx="4" cy="-12" r="7" fill="#fff4df"/></g>`;
 if(t<1.05){z=1.25+.23*ease(t);cx=263;cy=562;}
 else if(t<2.0){z=3.2+.3*ease(t-1.05);cx=270;cy=527;}
 else if(t<2.75){z=2.4;cx=127;cy=623;front+=burst('یه ذره!',380,401,.67);}
 else{z=1.15+.25*ease((t-2.75)/1.05);cx=266;cy=566;a+=path('M240 437l-8-17 21 7 8-23 12 21 23-9-8 24 16 18-25-1-11 20-9-21-24 3Z','#a4958f',2)+txt('؟',267,449,21);}
 }else if(id==='sleeper'){
 env='couch';a+=F(2,298,590,1.38,'sleep')+H(88+ease((t-1.7)/.8)*82,746,.7,'shock','panic');
 for(let i=0;i<3;i++)a+=`<path d="M${315+i*22} ${451-i*29}q50-22 3-42" stroke="${INK}" stroke-width="2.5" fill="none" transform="translate(${Math.sin(q*5+i)*12} 0)"/>`;
 a+=txt('خُررر…',371,427,27,INK,-9)+bottle(146+Math.sin(q*7)*30,574+Math.sin(q*6)*40,Math.sin(q*6)*50);
 if(t<1.1){z=1.02+.27*ease(t/1.1);cy=505+70*ease(t/1.1);}
 else if(t<2.15){z=2.5;cx=295;cy=552;}
 else{z=1.2+.33*ease((t-2.15)/1.65);cx=210;cy=640;r=-4+8*ease((t-2.15)/1.65);a+=burst('گرفتم!',137,569,.55);}
 }else if(id==='hush'){
 env='dusk';tone='dusk';a+=U(290,652,1.13,'anxious')+H(69,662,.66,'shock');
 a+=`<g opacity="${1-ease(t/1.2)}">${F(0,466,540,.56,'shock')}${F(1,125,460,.62,'shock')}${txt('تق! خُررر…',270,400,30)}</g>`;
 z=1.05+.7*ease(p);cx=290;cy=600;
 for(let i=0;i<7;i++)front+=`<path d="M${i*92-22} 0v${Math.max(0,95+Math.sin(i*3)*65-(t-.3)*170)}" stroke="${INK}" stroke-width="${19+i%3*8}" stroke-linecap="round" opacity=".7"/>`;
 }else if(id==='turn'){
 env='dusk';tone='dusk';if(t>=1.6&&t<3.05){a+=hands(t);}else{a+=U(311,639,1.17,'anxious')+`<g transform="translate(84 250) scale(.72)">${hands(t)}</g>`;}a+=pulse(t);
 a+=`<g transform="${tr(107+Math.sin(q*8)*2,421,1,-6)}">${path('M-51-54H51V48H-51Z','#d6dce1',3)}${line('M-51-29H51M-29-67v23M28-67v23',3)}${txt('فردا',0,13,26)}<ellipse cy="5" rx="43" ry="28" stroke="#9e6375" stroke-width="2" fill="none"/></g>`;
 if(t<1.6){z=1.3+.24*ease(t/1.6);cx=300;cy=598;}
 else if(t<3.05){z=1.6+.22*ease((t-1.6)/1.45);cx=254;cy=572;}
 else{z=1.93+.37*ease((t-3.05)/1.95);cx=307+Math.sin(t*3)*1.5;cy=598+Math.sin(t*2)*1.2;}
 }else if(id==='friend'){
 env='desk';tone=p<.3?'dusk':'gold';const relieved=t>2.1;
 if(t<1.8){a+=hands(t,true);}else{a+=U(183,639,1.05,relieved?'happy':'anxious')+F(3,401,627,1.06,'happy','hug')+`<g transform="translate(68 245) scale(.75)">${hands(t,true)}</g>`;}
 a+=pulse(t,true);if(t>=3.25)a+=txt('قشنگ می‌شه',335,433,20,INK,-5);
 if(t<1.8){z=1.5+.24*ease(t/1.8);cx=271;cy=568;}
 else if(t<3.25){z=2.35+.2*ease((t-1.8)/1.45);cx=181;cy=604;a+=path('M216 618q-9 15-2 16q11 0 2-16Z','#90b6c6',1.5);}
 else{z=1.58-.35*ease((t-3.25)/2.25);cx=280;cy=593;}
 for(let i=0;i<4;i++)a+=heart(150+i*72,503-Math.sin(q*2+i)*11-i%2*26,.18+.1*ease((t-1.6)/1.4));
 }else if(id==='payoff'){
 env='window';tone='gold';
 a+=H(82,688,.75,'happy','hug')+U(228,666,.87,'happy','hug')+F(3,375,663,.9,'happy','hug');
 a+=F(0,114,485,.62,'happy','wave')+F(1,273,483,.62,'happy','wave')+F(2,430,478,.64,'happy','wave')+phone(144,453,.43,-10);
 a+=nail(228,578,.75,-13,t)+nail(272,567,.85,3,t)+nail(314,582,.68,19,t);
 if(t<1.3){z=2.6+.3*ease(t/1.3);cx=270;cy=546;}
 else if(t<2.1){z=2.5;cx=82;cy=651;}
 else{z=1.46-.29*ease((t-2.1)/2.6);cx=269;cy=582-34*ease((t-2.1)/2.6);}
 for(let i=0;i<5;i++)a+=heart(77+i*94,414+Math.sin(q*2+i)*13,.2);
 front+=`<g opacity="${ease((t-2.5)/.4)}">${path('M136 700Q270 682 406 699V746H136Z','#f5d18d',2)}${txt('دوست واقعیت رو تگ کن',271,730,20)}</g>`;
 }else if(id==='card'){
 tone='gold';env=null;
 a+=`<g data-utility-card="true">${path('M51 341L484 349 478 682 57 688Z','#fff4dc',3.5)}${txt('قانون همراه خوب',268,394,29)}${line('M93 418Q270 428 447 416',2.5,`stroke-dasharray="360" stroke-dashoffset="${360*(1-ease(t/.3))}"`)}${['آروم صحبت کن','نظر اضافه نده','دست دوستت رو بگیر'].map((s,i)=>`<g data-card-row="${i}" opacity="${ease((t-i*.4)/.16)}">${txt(s,264,477+i*76,23)}${line(`M87 ${468+i*76}l9 9 20-24`,3.5)}${i===0?line('M426 452v28m-13-9l13 10 14-11',3):i===1?line('M408 530h34v21h-34Zm-6-8l48 37',2.5):icon(3,426,624,.55)}</g>`).join('')}</g>`;
 front+=icon(4,467,330+Math.max(0,1-ease(t/.4))*16,.7); // Settled after .4s; entire card fully visible by .96s.
 }else if(id==='cta'){
 env='door';tone='gold';a+=H(129,701,.91,'happy','wave')+U(404,706,.9,'happy','wave');
 for(let i=0;i<4;i++)a+=badge(i,96+i*117,462,.94);
 a+=txt('فیلم‌بردار',96,532,14)+txt('بازرس',213,532,14)+txt('خواب‌آلود',330,532,14)+txt('دوست واقعی',447,532,14);
 a+=path('M100 570H440V615H100Z','#f2cc79',2)+txt(t<1.8?'با نشانِ نوعت جواب بده':'دوست واقعیت رو تگ کن',270,600,23);
 if(t>1.8)a+=arrow(436-ease((t-1.8)/1)*55,647,.9,-28);
 if(t<1.45){z=1.01+.18*ease(t/1.45);cx=270;cy=573;}
 else if(t<2.35){z=2.1;cx=143;cy=667;}
 else{z=1.33-.22*ease((t-2.35)/2.05);cx=270;cy=612;}
 }
 let art=base(t,tone)+`<g data-camera="true" transform="${camera(cx,cy,z,r)}">${env?scenery(env,t):''}<g data-acting="true">${a}</g></g>`+front;
 // Ink wipe is motivated by each cut. Opening itself starts with the crowd, unobscured.
 if(id!=='hook'&&id!=='card'&&t<.19){const u=t/.19;art+=`<path d="M${-240+u*1100} 270l-70 535 145 29 80-590Z" fill="${INK}"/><circle cx="${-230+u*1100}" cy="410" r="32" fill="${INK}"/>`;}
 return art+`<rect width="540" height="960" fill="url(#paper)" style="mix-blend-mode:multiply" pointer-events="none"/>`;
}
function endcard(p,t,brand){
 const back=ease((p-.85)/.13);
 return `<g opacity="${1-back}">${base(t,'gold')}<g transform="${camera(270,540,1+.17*ease(p))}">${scenery('door',t)}${path('M55 349L487 357 478 611 63 622Z','#fdf1d9',3.5)}${txt('قسمت بعد:',270,397,24)}${txt('۴ نوع ناخن‌کار کارتونی',270,439,26)}${txt('هر هفته یه قسمت',270,483,20)}${path('M189 512H351V553H189Z','#f1c567',2)}${txt('فالو کن',270,540,24)}<text x="270" y="589" text-anchor="middle" direction="ltr" font-family="Vazirmatn" font-size="24" font-weight="800" fill="${INK}">${brand.handle.replace(/[<>&]/g,'')}</text>${HatchEyes(423,397)}${line('M151 599H389',2,`stroke-dasharray="240" stroke-dashoffset="${240*(1-ease(t/.6))}"`)}${blob(0,159,734,.67,t,'happy','wave')}${blob(1,388,734,.67,t,'happy','wave')}</g><rect width="540" height="960" fill="url(#paper)" style="mix-blend-mode:multiply"/></g><g opacity="${back}">${scene('hook',0,0)}</g>`;
}
function HatchEyes(x,y){return `<g transform="${tr(x,y,.75,-8)}">${eye(-10,0,'shock',0)}${eye(16,0,'shock',0)}</g>`;}
const ids=['hook','filmer','inspector','sleeper','hush','turn','friend','payoff','card','cta'];
for(const id of [...ids,'__endcard'])registerScene(id,{
 mount(el){el.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 960" aria-hidden="true">${defs}<g id="ink-world"></g></svg>`;},
 update(el,p,t,brand){el.querySelector('feTurbulence').setAttribute('seed',String(Math.floor(t*12)+1));el.querySelector('#ink-world').innerHTML=id==='__endcard'?endcard(p,t,brand):scene(id,p,t);}
});
window.Ink={defs,blob,icon,badge,nail,txt,scene,ids,pose};
})();
