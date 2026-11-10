/* Reel 04 — a warm, analytic camera journey. No runtime random or wall-clock animation. */
(() => {
'use strict';
const T=window.Trailer,Q=window.Sequel;
const {text,pill,star,hero,gel,heart}=T;
const clamp=v=>Math.max(0,Math.min(1,v)),ease=v=>1-(1-clamp(v))**3;
const smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
const lerp=(a,b,p)=>a+(b-a)*p;
const tr=(x,y,s=1,r=0)=>`translate(${x} ${y}) rotate(${r}) scale(${s})`;
const ids=['hook','tired','break','shoe','spa','glow','walk','heart','tease','cta'];
const durations=[3,4.2,3,4.2,3.6,3.6,4.2,3,3.6,4.2];
const extra=`<defs>
<linearGradient id="warmSky" x2="0" y2="1"><stop stop-color="#f9e6c6"/><stop offset=".6" stop-color="#edbbaf"/><stop offset="1" stop-color="#a8cecd"/></linearGradient>
<radialGradient id="sockDark" cx="60%" cy="28%" r="80%"><stop stop-color="#3f6070"/><stop offset=".55" stop-color="#243b52"/><stop offset="1" stop-color="#172438"/></radialGradient>
<pattern id="sockKnit04" width="20" height="28" patternUnits="userSpaceOnUse"><path d="M0 0Q17 11 10 26Q3 11 20 0M-10 0Q7 11 0 26M20 26Q13 11 30 0" fill="none" stroke="#94b4bb" stroke-width="1.6" opacity=".15"/></pattern>
<radialGradient id="lilac" cx="28%" cy="19%" r="90%"><stop stop-color="#fff0f6"/><stop offset=".26" stop-color="#e6ccfa"/><stop offset=".58" stop-color="#b58cda"/><stop offset="1" stop-color="#7163a5"/></radialGradient>
<radialGradient id="duckGold" cx="29%" cy="20%"><stop stop-color="#fff3b3"/><stop offset=".5" stop-color="#ffd16c"/><stop offset="1" stop-color="#ce8969"/></radialGradient>
<linearGradient id="bath" x2=".3" y2="1"><stop stop-color="#fff4df"/><stop offset=".55" stop-color="#e7bec1"/><stop offset="1" stop-color="#bb91ab"/></linearGradient>
<linearGradient id="sea" x2="0" y2="1"><stop stop-color="#b4dddc"/><stop offset="1" stop-color="#639fba"/></linearGradient>
<linearGradient id="gem04" x2=".9" y2=".8"><stop stop-color="#fff4e5"/><stop offset=".3" stop-color="#abe8df"/><stop offset=".6" stop-color="#b2b3ed"/><stop offset="1" stop-color="#f7b1d5"/></linearGradient>
<radialGradient id="warmHalo"><stop stop-color="#fff3c9" stop-opacity=".75"/><stop offset="1" stop-color="#fff5da" stop-opacity="0"/></radialGradient>
<pattern id="tiles04" width="65" height="65" patternUnits="userSpaceOnUse"><rect width="65" height="65" fill="#eed7ce"/><rect x="3" y="3" width="59" height="59" rx="8" stroke="#f9e9d5" fill="#e5c7c6"/></pattern>
</defs>`;
const body='M-83 2Q-92-52-66-91Q-45-121 0-124Q53-125 75-88Q96-51 82 7Q0 50-83 2Z';
function nine({x=0,y=0,s=1,t=0,r=0,mood='happy',pose='stand',glow=0,gem=glow,sandals=false,view=0,tear=false,foam=false}={}){
 let a=Q.nine({x:0,y:0,s:1,t,mood:mood==='sad'?'tired':mood,view});
 // Keep the returning hero's proportions and sock hat, repaint only the nail surface.
 if(glow){a=a.replace(`<path d="${body}" fill="url(#toe)"`, `<path d="${body}" fill="url(#lilac)"`).replace('stroke="#f6d7b6"','stroke="#f5dff7"');}
 if(pose!=='stand')a=a.replace(/<path d="M-72 2L-99 9M72 2L99 9"[^>]*\/>/,'');
 if(mood==='sad'||mood==='tired')a=a.replace(/M(-?\d+)-70H(-?\d+)V-48Q(-?\d+)-40 (-?\d+)-48Z/g,(_,left,right,cx)=>`M${left}-68Q${cx}-82 ${right}-68V-48Q${cx}-40 ${left}-48Z`);
 let over='';
 const armColor=glow?'#be9bdf':'#d0a492';
 if(pose==='hug')over+=`<ellipse cx="-42" cy="7" rx="25" ry="25" fill="url(#toe)"/><ellipse cx="42" cy="7" rx="25" ry="25" fill="url(#toe)"/><path d="M-76-3Q-49 26-22 6M76-3Q49 26 22 6" fill="none" stroke="${armColor}" stroke-width="14" stroke-linecap="round"/>`;
 if(['wave','cheer','point','run'].includes(pose))for(const side of [-1,1]){
 const yy=pose==='point'?-24:pose==='run'?Math.sin(t*15+side)*18:pose==='cheer'?-74:side===1?-72:10;
 over+=`<path d="M${side*72}-5Q${side*102}-12 ${side*104} ${yy}" stroke="${armColor}" fill="none" stroke-width="16" stroke-linecap="round"/><circle cx="${side*104}" cy="${yy}" r="9" fill="url(#${glow?'lilac':'toe'})"/>`;
 }
 if(sandals)for(const side of [-1,1])over+=`<g transform="translate(${side*40} 28)"><ellipse rx="30" ry="11" fill="#e7ba80" stroke="#976c70" stroke-width="2"/><path d="M-21-4L0 6 21-4M0 6V-5" fill="none" stroke="#7da8b5" stroke-width="5" stroke-linecap="round"/></g>`;
 if(gem)over+=`<g transform="${tr(40,-90,.8)}"><path d="M-13-6L-6-15H7L15-5 0 13Z" fill="url(#gem04)" stroke="#fff3db" stroke-width="2"/><path d="M-13-6H15M-6-15L0 13 7-15" fill="none" stroke="#fff" stroke-width="1" opacity=".65"/>${star(12,-10,.3+.22*Math.sin(t*4),'#fff5da')}</g>`;
 if(glow)over+=`<path d="M-68-31Q-69-80-38-98" stroke="#fff8ed" stroke-width="7" stroke-linecap="round" opacity=".65" fill="none"/>${star(-63,-78,.22+.1*Math.sin(t*5),'#fff9df')}`;
 if(tear)over+='<path d="M-42-33Q-52-19-42-16Q-32-19-42-33Z" fill="#b1e3e3" stroke="#e8fff5" stroke-width="1"/>';
 if(foam)for(let i=0;i<9;i++)over+=`<circle cx="${-60+i*14}" cy="${-111-Math.sin(i*2)*9}" r="${11+i%3*3}" fill="#fff6e6" stroke="#d4dfdd"/>`;
 const bob=pose==='run'?Math.abs(Math.sin(t*10))*7:0;
 const squash=pose==='bounce'?1+.15*Math.cos(t*10):1;
 return `<g transform="${tr(x,y-bob,s,r)}"><g transform="scale(${1/squash} ${squash})">${a}${over}</g></g>`;
}
function duck({x=0,y=0,s=1,t=0,r=0,wink=true,point=false}={}){
 return `<g transform="${tr(x,y+Math.sin(t*3)*3,s,r)}"><ellipse cy="15" rx="49" ry="10" fill="url(#ao)"/><path d="M-40-28Q-65-47-52-49L-34-40Q-13-60 17-43Q44-29 30-5Q-9 21-40-5Z" fill="url(#duckGold)" stroke="#ffe4a1" stroke-width="2"/><circle cx="25" cy="-57" r="31" fill="url(#duckGold)" stroke="#ffe3a7" stroke-width="2"/><path d="M47-61Q83-63 66-48L45-46Z" fill="#e99b69" stroke="#f7c081" stroke-width="2"/><ellipse cx="-13" cy="-21" rx="22" ry="15" fill="#f3bc68"/><path d="M-29-25Q-12-9 3-26" fill="none" stroke="#ffe59b" stroke-width="2"/>${wink?'<path d="M18-63Q25-57 32-63" stroke="#51465d" stroke-width="4" fill="none" stroke-linecap="round"/>':'<ellipse cx="26" cy="-64" rx="4" ry="6" fill="#51465d"/>'}<path d="M-22-4L3-12 14 13-13 18Z" fill="#f5e7df" stroke="#c7c6d3" stroke-width="1.5"/><path d="M-15 0L6-6M-10 11L10 5" stroke="#adcbce" stroke-width="3"/>${point?'<path d="M-17-26Q-50-60-62-40" fill="none" stroke="#f8d07c" stroke-width="10" stroke-linecap="round"/>':''}</g>`;
}
function ten({x=270,y=655,s=1,t=0,reveal=false}={}){
 return `<g transform="${tr(x,y,s,Math.sin(t)*1.5)}"><ellipse cy="35" rx="114" ry="20" fill="url(#ao)"/><path d="M-93 8L-94-69Q-98-141-35-166Q24-192 74-140Q99-110 93-54L92 8Q0 43-93 8Z" fill="#49465d" stroke="#d9bcae" stroke-width="2"/><path d="M-71-24V-84Q-69-125-33-139" fill="none" stroke="#ddc5b8" stroke-width="7" stroke-linecap="round" opacity=".15"/><path d="M-85-22L-120-41-125-78Q-127-93-137-88Q-146-82-143-54L-153-51-163-63Q-171-69-174-58L-170-24Q-168-9-154-8L-122 0-88 3Z" fill="#49465d" stroke="#d9bcae" stroke-width="2"/><path d="M90-5L116 4" stroke="#49465d" stroke-width="16" stroke-linecap="round"/>${reveal?T.eyes({mood:'wink',t,y:-55}):'<path d="M-31-60Q-23-69-15-60M15-60Q23-69 31-60" fill="none" stroke="#e0c6ba" stroke-opacity=".4" stroke-width="3"/>'}${text('۱۰',0,15,24,'#e6d0c2')}</g>`;
}
function sparkles(t,n=12,area=[40,360,460,330]){
 let a='';for(let i=0;i<n;i++){const x=area[0]+(i*83)%area[2],y=area[1]+((i*63-t*17)%area[3]+area[3])%area[3];a+=star(x,y,.1+.22*(.5+.5*Math.sin(t*4+i)),i%2?'#fff1c2':'#e6f4df',t*13+i*11);}return a;
}
function hearts(t,n=6,{up=true}={}){let a='';for(let i=0;i<n;i++){const q=(t*.21+i/n)%1,x=75+(i*87)%400,y=up?690-q*340:350+q*330;a+=`<g transform="${tr(x,y,.42+.1*Math.sin(i+t),Math.sin(t+i)*10)}" opacity="${Math.sin(q*Math.PI)*.7}">${heart(0,0,1,'#e9a9b4')}</g>`;}return a;}
function cave(t,{patched=false}={}){
 let a=`<rect width="540" height="960" fill="url(#sockDark)"/><path d="M-28 410Q40 105 260 126Q542 102 590 491L566 807H-18Z" fill="url(#sockKnit04)" stroke="#668591" stroke-opacity=".18" stroke-width="22"/><ellipse cx="371" cy="353" rx="43" ry="32" transform="rotate(-19 371 353)" fill="#ead8bb" stroke="#acbdb2" stroke-width="8"/><path d="M339 374L74 768H421L403 370Z" fill="#ffe8b9" opacity=".08"/><ellipse cx="265" cy="709" rx="224" ry="61" fill="#1d2b40"/><path d="M14 729Q270 677 528 737M48 755Q270 717 490 759" stroke="#9ab7b7" stroke-opacity=".12" stroke-width="2" fill="none"/>`;
 for(let i=0;i<15;i++)a+=`<circle cx="${170+(i*41)%250+Math.sin(t+i)*5}" cy="${399+((i*31+t*12)%280)}" r="${.8+i%3*.4}" fill="#e3d7b5" opacity=".25"/>`;
 a+=`<path d="M38 437Q156 374 120 510T89 674" fill="none" stroke="#91b0b9" stroke-width="2" opacity=".3"/>`;
 if(patched)a+=patch(112,652,.9);
 return a;
}
function patch(x,y,s=1){return `<g transform="${tr(x,y,s,-12)}"><path d="M-35-30H30L40 23-29 31Z" fill="#afc8c4" stroke="#decec0" stroke-width="2" stroke-dasharray="4 4"/>${heart(0,-1,1.2,'#da9ca7')}</g>`;}
function spaBack(t){let a=`<rect width="540" height="960" fill="url(#warmSky)"/><path d="M25 735V375Q25 291 115 291H425Q515 291 515 375V735Z" fill="#efcfbf" stroke="#f6e7d3" stroke-width="5"/><path d="M-30 703L570 703V960H-30Z" fill="url(#tiles04)"/><circle cx="277" cy="465" r="143" fill="url(#warmHalo)"/><circle cx="277" cy="465" r="112" fill="none" stroke="#fff0cc" stroke-width="9" opacity=".75"/><path d="M78 404V610M95 404V610M112 404V610" stroke="#dbafb1" stroke-width="9" stroke-linecap="round" opacity=".4"/>`;
 for(let i=0;i<6;i++)a+=`<path d="M${151+i*37} 635Q${131+i*37+Math.sin(t*2+i)*13} 571 ${157+i*37} 506" stroke="#fff6e4" stroke-opacity=".2" stroke-width="${10-i%3*2}" fill="none" stroke-linecap="round"/>`;
 return a;
}
function palm(x,y,s,t){return `<g transform="${tr(x,y,s)}"><path d="M0 0Q-14-92 17-181" stroke="#ae8d7d" stroke-width="13" fill="none"/><path d="M-4-22L7-19M-7-50L3-47M-5-78L5-75M-1-109L9-106M7-140L17-137" stroke="#e9bc95" stroke-width="3"/><g transform="rotate(${Math.sin(t)*3} 17 -181)">${[-100,-55,0,45,90].map(r=>`<path d="M17-181Q8-237-59-221Q-20-202 17-181" transform="rotate(${r} 17 -181)" fill="#7ca997" stroke="#d5d2ac" stroke-width="1"/>`).join('')}</g></g>`;}
function beach(t,track=0){let a=`<rect width="540" height="960" fill="url(#warmSky)"/><circle cx="392" cy="383" r="53" fill="#fff2c9" opacity=".75"/><circle cx="392" cy="383" r="139" fill="url(#warmHalo)"/><rect y="492" width="540" height="131" fill="url(#sea)"/><path d="M0 581Q67 570 135 581T270 581T405 581T540 581M0 602Q67 589 135 602T270 602T405 602T540 602" stroke="#e7efe1" stroke-width="3" opacity=".65" fill="none"/><path d="M0 616Q250 580 540 614V960H0Z" fill="#e9c9aa"/><path d="M210 605L-80 960H620L352 605Z" fill="#c79d91"/>`;
 for(let i=0;i<12;i++){const yy=620+(i*31+track)%350;a+=`<path d="M${196-(yy-620)*.84} ${yy}H${367+(yy-620)*.76}" stroke="#e6bca2" stroke-width="3"/>`;}
 a+=palm(47-track*.07,636,.9,t)+palm(515-track*.1,647,1.25,t+.8);return a;
}
function fans(t){let a='';const colors=['#c1cfa4','#86bfc9','#edb3b6','#b39dce','#e6bd88'];for(let i=0;i<10;i++){
 const side=i%2===0?-1:1,row=Math.floor(i/2),x=270+side*(92+row*22),y=635+row*16,ss=.29+row*.02;
 a+=`<g transform="${tr(x,y,ss,Math.sin(t*4+i)*6)}"><path d="M-35 0Q-42-53-4-105Q0-115 4-105Q42-53 35 0Q0 23-35 0Z" fill="${colors[i%5]}" stroke="#f5dfc6" stroke-width="2"/>${T.eyes({t:t+i,mood:'love',y:-35,scale:.65})}<path d="M32-5L50-39" stroke="${colors[i%5]}" stroke-width="12" stroke-linecap="round"/><path d="M50-39V-64" stroke="#dfefb3" stroke-width="7" stroke-linecap="round"/><rect x="-53" y="-30" width="29" height="22" rx="4" fill="#4e566b" stroke="#e4d2c0" stroke-width="2"/><circle cx="-37" cy="-20" r="6" fill="#afc9cf"/></g>`;
 if(Math.sin(t*12+i*3)>.94)a+=star(x-10,y-12,.65,'#fff8e1');
 }return a;}
function camera(back,art,{scale=1,x=0,y=0,r=0,bs=1}={}){return `<rect width="540" height="960" fill="#efd3c0"/><g transform="translate(270 535) scale(${bs}) translate(-270 -535)">${back}</g><g transform="translate(${270+x} ${535+y}) rotate(${r}) scale(${scale}) translate(-270 -535)">${art}</g>`;}
function shot(id,p,t){
 let back='',art='',cam={scale:1+.04*p};
 if(id==='hook'){
 back=cave(t,{patched:true});art+=nine({x:260,y:683,s:1.1,t,mood:'sad',pose:'hug'});
 art+=`<g transform="${tr(372,358,.17)}">${hero({x:-41,y:10,t,pose:'cheer'})}${Q.rookie({x:43,y:10,t})}</g>`;
 cam={scale:1+.09*ease(p),x:-6*p,y:6*p};
 }else if(id==='tired'){
 back=cave(t);const tilt=Math.sin(t*1.1)*12;
 art+=`<g transform="translate(0 ${tilt})"><rect x="34" y="328" width="472" height="176" rx="20" fill="#edd1bc"/><path d="M391 429V385H439V429Q414 447 391 429Z" fill="#f5e4d1" stroke="#c79c9d" stroke-width="3"/><path d="M439 390Q469 389 456 412H439" fill="none" stroke="#f5e4d1" stroke-width="7"/>${hero({x:154,y:463,s:.53,t,armor:1,pose:'cheer'})}${Q.rookie({x:256,y:463,s:.52,t})}${gel({x:340,y:464,s:.47,t,pose:'cheer'})}<path d="M27 516H515" stroke="#a5b8b8" opacity=".6" stroke-width="4"/>${nine({x:265,y:695,s:.83,t,mood:'sad',pose:t>1.8?'wave':'hug'})}</g>`;
 art+=hearts(t,6);for(let i=0;i<8;i++)art+=`<ellipse cx="${97+i*50+Math.sin(t+i)*9}" cy="${553+(i*31+t*15)%132}" rx="5" ry="2" fill="#a9b6bd" opacity=".3"/>`;
 cam={scale:1+.02*Math.sin(t),y:tilt*.3};
 }else if(id==='break'){
 back=cave(t);const run=ease((t-.4)/1),hit=smooth((t-1.3)/.28),x=lerp(160,319,run);
 art+=nine({x,y:679,s:.97,t,mood:'angry',pose:t<.4?'hug':'run',r:run*12-hit*19});
 art+=`<g transform="${tr(387,575,1+hit*1.3)}"><path d="M-48-110Q-35-70-62-34L-35-9-46 36-11 42 16 90 24 46 60 24 42-20 64-43 37-67 51-104Z" fill="#263e50" opacity="${hit}"/><path d="M-55-110L-25-55-43-22-18 11 0 38 24 75M48-110L22-70 43-35 16 0 40 34" stroke="#a2bbb9" stroke-width="3" fill="none" opacity="${hit*.8}"/></g>`;
 for(let i=0;i<11;i++){const q=clamp((t-1.35)/1.1);art+=`<path d="M${351+q*Math.cos(i*2)*i*18} ${553+q*Math.sin(i*2)*i*17}l${Math.cos(i)*19} ${Math.sin(i)*22}" fill="none" stroke="#b4c4c3" stroke-width="1.7" opacity="${hit*(1-q*.8)}"/>`;}
 cam={scale:1+.07*run,x:Math.sin(t*51)*Math.exp(-Math.max(0,t-1.4)*10)*(t>1.4?4:0),r:Math.sin(t)*2};
 }else if(id==='shoe'){
 const speed=t+.17*Math.sin(t*4),travel=speed*95;
 back=`<rect width="540" height="960" fill="#688393"/><path d="M-30 530Q127 274 386 367L590 465V818H-30Z" fill="#d2af9e" stroke="#e2c7b1" stroke-width="8"/><path d="M-28 680Q167 529 567 663V812H-28Z" fill="#aa8f91" stroke="#efd6b9" stroke-width="10"/><path d="M-20 715Q251 592 559 707" fill="none" stroke="#d4b4a0" stroke-dasharray="5 8" stroke-width="3"/>`;
 art+=`<g transform="translate(${-travel%180} 0)">`;for(let i=0;i<5;i++)art+=`<circle cx="${i*180+30}" cy="422" r="12" fill="#5f6b7b" stroke="#c9bda9" stroke-width="4"/><path d="M${i*180+30} 422Q${i*180+117} 567 ${i*180+210} 422" fill="none" stroke="#eee1c8" stroke-width="10"/><path d="M${i*180+30} 422Q${i*180+117} 567 ${i*180+210} 422" fill="none" stroke="#b6b5ad" stroke-width="2" stroke-dasharray="5 5"/>`;art+='</g>';
 const bounce=Math.abs(Math.sin(speed*4));art+=nine({x:252+Math.sin(t*3)*22,y:656-bounce*80,s:.79,t,pose:'bounce',mood:'shock',r:Math.sin(t*4)*35});
 art+=`<path d="M${630-travel*.7} 565V704H${686-travel*.7}V730H${740-travel*.7}" stroke="#8a7c89" stroke-width="26" fill="none"/><g transform="translate(${713-travel} 0)"><rect x="-47" y="442" width="94" height="218" rx="45" fill="#c1d2c7" stroke="#f1d1b1" stroke-width="9"/><path d="M0 451V650" stroke="#d9b299" stroke-width="3"/><circle cx="21" cy="568" r="5" fill="#bd8d83"/></g>`;
 for(let i=0;i<8;i++)art+=`<path d="M${((i*97-t*250)%620+620)%620-40} ${548+i*20}h-41" stroke="#f2dbc1" stroke-width="2" opacity=".23"/>`;
 cam={scale:1.02,x:Math.sin(t*8)*8,y:Math.cos(t*8)*4,r:Math.sin(t*4)*4};
 }else if(id==='spa'){
 back=spaBack(t);const dip=ease(t/.7),orbit=Math.sin(t*1.3)*16;
 art+=`<ellipse cx="270" cy="695" rx="194" ry="37" fill="url(#ao)"/><path d="M94 608Q270 556 447 608L421 701Q270 755 119 701Z" fill="url(#bath)" stroke="#fff0d7" stroke-width="3"/><ellipse cx="270" cy="610" rx="176" ry="37" fill="#9dcbca" stroke="#f5e6d0" stroke-width="5"/>`;
 art+=nine({x:270+orbit,y:626+dip*30,s:.96,t,mood:'calm',foam:true});
 art+=`<path d="M101 630Q270 679 440 630L421 701Q270 755 119 701Z" fill="url(#bath)" stroke="#f4dfcf" stroke-width="3"/>`;
 for(let i=0;i<16;i++){const q=(i*.061+t*.13)%1;art+=`<circle cx="${119+(i*47)%306+Math.sin(t*3+i)*4}" cy="${647-q*107}" r="${4+i%4*2}" fill="#f9f6e5" fill-opacity=".35" stroke="#e8f6e8" stroke-width="1.5"/>`;}
 art+=duck({x:435,y:672,s:.58,t,point:true});
 const scrub=Math.sin(t*7)*24;art+=`<g transform="${tr(195+scrub,591,.6,-18)}"><rect x="-22" y="-13" width="44" height="26" rx="10" fill="#f4d6a6" stroke="#ffebca" stroke-width="2"/><circle cx="-10" cy="-3" r="3" fill="#d2ad90"/><circle cx="8" cy="5" r="2" fill="#d2ad90"/></g>`;
 if(t>1.7)art+=`<g transform="${tr(323+Math.sin(t*8)*18,578,.5,-29)}"><rect x="-83" y="-10" width="166" height="20" rx="10" fill="url(#file)" stroke="#ead8e0" stroke-width="3"/><rect x="-78" y="-6" width="156" height="12" rx="6" fill="url(#grit)"/></g>`+sparkles(t,5,[276,543,79,39]);
 cam={scale:1+.03*Math.sin(t),x:orbit*.3,r:Math.sin(t)*1};
 }else if(id==='glow'){
 back=spaBack(t);const phase=Math.min(2,Math.floor(t/.6)),orbit=smooth((t-1.2)/1.9)*Math.PI*2,view=Math.sin(orbit);
 art+=`<circle cx="270" cy="540" r="189" fill="url(#warmHalo)"/><ellipse cx="270" cy="699" rx="158" ry="32" fill="#c8b3cb" stroke="#f5e5c5" stroke-width="3"/>`;
 art+=nine({x:270+Math.sin(orbit)*16,y:646,s:1.22*(.88+.12*Math.abs(Math.cos(orbit))),t,mood:phase===2?'love':'calm',glow:phase>0?1:0,gem:phase===2?1:0,view,pose:phase===2?'cheer':'stand'});
 if(t<1.2)art+=`<g transform="${tr(lerp(110,417,(t%.6)/.6),512,.85,50)}">${T.brush(0,0,1)}<path d="M-10 0Q-32 80 2 150" fill="none" stroke="${phase===0?'#fff5e4':'#c7a0e7'}" stroke-width="21" stroke-linecap="round" opacity=".65"/></g>`;
 const sweep=((t*170)%380)-190;art+=`<path d="M${270+sweep-23} 405L${270+sweep+19} 405 ${270+sweep-78} 705 ${270+sweep-117} 705Z" fill="#fff6e8" opacity=".17"/>`;
 art+=sparkles(t,18);art+=pill(['ژل','رنگ','براقی!'][phase],270,356,136,'#ead3ee');
 cam={scale:1+.035*Math.sin(t*10),r:Math.sin(orbit)*3};
 }else if(id==='walk'){
 back=beach(t,t*19);art+=fans(t);art+=hero({x:103,y:705,s:.38,t,armor:1,bandage:.3,pose:'cheer'})+Q.rookie({x:438,y:711,s:.4,t,pose:'cheer'})+gel({x:367,y:676,s:.29,t,pose:'cheer'});
 art+=nine({x:270+Math.sin(t*2)*10,y:675+Math.sin(t*5)*4,s:1.06,t,mood:'happy',glow:1,sandals:true,pose:'wave',r:Math.sin(t*5)*2});
 for(let i=0;i<23;i++){const yy=340+(i*51+t*44)%357;art+=`<rect transform="${tr(35+(i*83)%470,yy,1,t*53+i*39)}" width="4" height="8" rx="1" fill="${['#fff1bd','#b5d7c4','#dda3b8','#bfb2dd'][i%4]}" opacity=".8"/>`;}
 cam={scale:1.08-.1*smooth(p),y:14-25*p};
 }else if(id==='heart'){
 back=beach(t);const pull=smooth(t/2.3);
 art+=`<circle cx="270" cy="533" r="126" stroke="#fff1c7" stroke-width="7" fill="url(#warmHalo)" opacity=".6"/><g opacity="${pull}"><path d="M141 688Q124 633 169 614Q195 563 235 607Q270 553 300 601Q345 575 364 620Q415 624 413 675L426 790H170Z" fill="#e7baa6" stroke="#f5d5b6" stroke-width="3"/>${[0,1,2,3].map(i=>`<ellipse cx="${327+i*28}" cy="${627+i*10}" rx="${25-i*3}" ry="${36-i*4}" fill="url(#toe)" stroke="#f4d4b9" stroke-width="2"/>`).join('')}<path d="M154 707Q279 681 417 706L426 790H170Z" fill="#8faebb" stroke="#c2d0cb" stroke-width="3"/><path d="M157 720Q279 694 419 719M160 737Q279 715 422 736" stroke="#c1d2ce" opacity=".6" stroke-width="5"/>${patch(345,750,.62)}</g>`;
 art+=nine({x:lerp(270,224,pull),y:lerp(651,666,pull),s:lerp(1.6,.82,pull),t,mood:'happy',glow:1,tear:true,pose:'hug'});art+=hearts(t,9)+sparkles(t,9);
 cam={scale:1,y:0};
 }else if(id==='tease'){
 back=beach(t);const rise=ease((t-.4)/1.5),shade=ease(t/.7);
 art+=`<path d="M540 250L540 800H0L190 600Z" fill="#4c4b66" opacity="${shade*.27}"/><circle cx="283" cy="463" r="190" fill="url(#warmHalo)"/>`;
 art+=ten({x:319,y:842-rise*157,s:1.6,t});
 art+=nine({x:89,y:725,s:.42,t,mood:'shock',glow:1})+duck({x:464,y:728,s:.36,t,wink:false});
 if(t>1.8)art+=pill('شمارهٔ ده!',270,357,184,'#efd8b4');
 cam={scale:1,x:Math.sin(t*47)*Math.exp(-t*1.7)*3,y:-rise*14};
 }else if(id==='cta'){
 back=beach(t);art+=hero({x:84,y:690,s:.4,t,armor:1,bandage:.3,pose:'point'})+Q.rookie({x:164,y:695,s:.43,t,pose:'point'})+gel({x:375,y:693,s:.46,t,pose:'point'});
 art+=nine({x:270,y:685,s:.72,t,mood:'wink',glow:1,pose:'point',sandals:true})+duck({x:466,y:700,s:.51,t,point:true});
 art+=hearts(t,6)+sparkles(t,11);art+=pill('تو هم دیده می‌شی.',270,403,232,'#eed8bd');
 art+=`<g transform="${tr(270,486+Math.sin(t*3)*3,.7)}"><circle r="36" fill="url(#gem04)"/><path d="M-18 0L20-16 8 20-2 7Z" fill="#fff5e5"/><path d="M-2 7L20-16" stroke="#9e8ca8" stroke-width="2"/></g>`;
 cam={scale:1+.025*Math.sin(t),x:Math.sin(t)*2};
 }
 return camera(back,art,cam);
}
function scene(id,p,t){
 let a=shot(id,p,t);const idx=ids.indexOf(id),q=smooth((t-(durations[idx]-.4))/.4);
 if(q>0&&idx<ids.length-1){
  const center=id==='break'?[387,575]:id==='shoe'?[315,550]:id==='glow'?[321,536]:[270,540];
  const rr=lerp(0,820,q);
  a+=`<defs><clipPath id="portal04"><circle cx="${center[0]}" cy="${center[1]}" r="${rr}"/></clipPath></defs><g clip-path="url(#portal04)">${shot(ids[idx+1],0,0)}</g><circle cx="${center[0]}" cy="${center[1]}" r="${rr}" fill="none" stroke="${id==='break'?'#a5bdc0':'#f8e5c5'}" stroke-width="${7*(1-q)}" opacity="${1-q}"/>`;
 }
 return a+T.cinema(1);
}
function endcard(p,t,brand){const loop=ease((p-.85)/.13);return `<g opacity="${1-loop}">${beach(t)}${nine({x:270,y:693,s:.71,t,glow:1,mood:'wink',pose:'cheer'})}${duck({x:426,y:702,s:.56,t})}${hero({x:106,y:697,s:.45,t,armor:1,bandage:.3,pose:'cheer'})}<rect x="58" y="330" width="424" height="183" rx="25" fill="#4c435c" stroke="#f2d8b8" stroke-width="2"/>${text('هر ناخن یه قصه داره.',270,373,28,'#ffebce')}${text('قسمت بعد: شمارهٔ ده',270,409,20,'#d8c9e7')}<text x="270" y="451" text-anchor="middle" direction="ltr" font-family="Vazirmatn" font-weight="800" font-size="28" fill="#fff0d4">${brand.handle.replace(/[<>&]/g,'')}</text>${pill('فالو کن',270,474,137,'#d8ddd0')}${T.cinema(1)}</g><g opacity="${loop}">${scene('hook',0,0)}</g>`;}
for(const id of [...ids,'__endcard'])registerScene(id,{
 mount(el){el.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 960" aria-hidden="true">${Q.defs}${extra}<g id="journey-world"></g></svg>`;},
 update(el,p,t,brand){el.querySelector('#journey-world').innerHTML=id==='__endcard'?endcard(p,t,brand):scene(id,p,t);}
});
window.Journey={defs:Q.defs+extra,nine,duck,ten,scene,shot,ids,durations,beach,text,pill};
})();
