/* Educational comedy / scenario 05 cartoon edition. Pure time-sampled SVG. */
(() => {
'use strict';
const S=window.Studio,{character,label,pill,star}=S;
const C=v=>Math.max(0,Math.min(1,v)),E=v=>1-(1-C(v))**3,P=v=>v<=0?0:1-Math.exp(-7*v)*Math.cos(v*10);
const SM=v=>{v=C(v);return v*v*(3-2*v);};
const L=(a,b,p)=>a+(b-a)*p,tr=(x,y,s=1,r=0)=>`translate(${x} ${y}) rotate(${r}) scale(${s})`;
const ids=['hook','oil','skin','thick','seal','tool','fix','cta'];
const more=`<defs>
<radialGradient id="edAmber" cx="28%" cy="18%" r="90%"><stop stop-color="#fff3c6"/><stop offset=".35" stop-color="#fbd991" stop-opacity=".95"/><stop offset=".67" stop-color="#d89d58" stop-opacity=".88"/><stop offset="1" stop-color="#996679" stop-opacity=".95"/></radialGradient>
<radialGradient id="edOil" cx="26%" cy="20%"><stop stop-color="#fff5b5"/><stop offset=".5" stop-color="#e8ca62"/><stop offset="1" stop-color="#ac865b"/></radialGradient>
<linearGradient id="edFilm" x2="1" y2=".6"><stop stop-color="#d8f0f3" stop-opacity=".65"/><stop offset=".4" stop-color="#a8bce5" stop-opacity=".2"/><stop offset="1" stop-color="#d9d1ef" stop-opacity=".6"/></linearGradient>
<radialGradient id="edBlue" cx="30%" cy="20%"><stop stop-color="#e4ffff"/><stop offset=".4" stop-color="#87cdda"/><stop offset="1" stop-color="#526ca6"/></radialGradient>
<radialGradient id="edJelly" cx="30%" cy="25%"><stop stop-color="#f8cee1"/><stop offset=".5" stop-color="#c8a4d5"/><stop offset="1" stop-color="#826caa"/></radialGradient>
<linearGradient id="edMetal" x2="1" y2=".6"><stop stop-color="#4f7c8b"/><stop offset=".3" stop-color="#c0dddd"/><stop offset=".6" stop-color="#668d9e"/><stop offset="1" stop-color="#384d70"/></linearGradient>
<linearGradient id="edRainbow" x2="1" y2=".3"><stop stop-color="#b6daca"/><stop offset=".3" stop-color="#e3c699"/><stop offset=".55" stop-color="#d1aedc"/><stop offset=".8" stop-color="#9bc5d4"/><stop offset="1" stop-color="#f1d7b3"/></linearGradient>
<linearGradient id="edSky" x2="0" y2="1"><stop stop-color="#293650"/><stop offset=".5" stop-color="#45335c"/><stop offset="1" stop-color="#665477"/></linearGradient>
</defs>`;
function face({t=0,mood='happy',y=-42,look=0}={}){
 let a='';for(const side of [-1,1]){const x=side*20+look*5,blink=(Math.cos(t*1.6)>.998&&side===-1)||mood==='calm'||(mood==='wink'&&side===1);
 if(blink)a+=`<path d="M${x-11} ${y}Q${x} ${y-8} ${x+11} ${y}" stroke="#3d354c" stroke-width="4" fill="none" stroke-linecap="round"/>`;
 else a+=`<ellipse cx="${x}" cy="${y}" rx="14" ry="${mood==='shock'?21:18}" fill="#fff8ee"/><ellipse cx="${x+look*3}" cy="${y+2}" rx="9" ry="13" fill="url(#eye)"/><ellipse cx="${x-3}" cy="${y-6}" rx="4" ry="5" fill="#fff"/><circle cx="${x+4}" cy="${y+8}" r="2" fill="#ccd9e4"/>`;
 }
 const b=mood==='angry'?'M-33-69L-9-62M9-62L33-69':mood==='shock'?'M-33-73Q-20-84-9-73M9-73Q20-84 33-73':'M-33-67Q-21-74-9-67M9-67Q21-74 33-67';
 a+=`<g transform="translate(0 ${y+42})"><path d="${b}" stroke="#66506a" stroke-width="3" fill="none" stroke-linecap="round"/>`;
 a+=mood==='shock'?'<ellipse cy="-14" rx="8" ry="10" fill="#66455a"/>':mood==='angry'?'<path d="M-9-12Q0-19 9-12" fill="none" stroke="#66455a" stroke-width="3"/>':'<path d="M-12-21Q0-13 12-21Q9-3 0-5Q-9-3-12-21Z" fill="#66455a"/><path d="M-6-8Q0-12 6-8" stroke="#ee9fa8" stroke-width="3" stroke-linecap="round"/>';
 return a+'</g>';
}
function blob({x=0,y=0,s=1,t=0,r=0,type='gely',mood='happy',pose='stand',look=0,cutaway=false}={}){
 const mat=type==='oily'?'edOil':type==='drippy'?'edBlue':type==='thicc'?'edJelly':'edAmber';
 const round=type==='oily'||type==='thicc';
 const body=round?'M-64 5Q-77-17-65-55Q-58-84-17-87Q32-99 60-68Q76-45 65 8Q0 42-64 5Z':'M-48 10Q-63-16-40-65L-4-117Q0-127 6-116L43-64Q65-13 47 11Q0 37-48 10Z';
 let a=`<g transform="${tr(x,y+Math.sin(t*3.1)*2,s,r)}"><ellipse cy="31" rx="75" ry="15" fill="url(#ao)"/>`;
 const arms=pose==='panic'?[93,-93]:pose==='hug'?[47,-47]:pose==='point'?[15,-68]:pose==='cheer'?[60,-60]:[Math.sin(t*4)*8,-Math.sin(t*4+.7)*8];
 for(let i=0;i<2;i++){const side=i?1:-1;a+=`<g transform="rotate(${arms[i]} ${side*44} -9)"><path d="M${side*44}-9L${side*71} 3" stroke="url(#${mat})" stroke-width="13" stroke-linecap="round"/><circle cx="${side*71}" cy="3" r="8" fill="url(#${mat})"/></g>`;}
 a+=`<ellipse cx="-24" cy="25" rx="16" ry="8" fill="url(#${mat})"/><ellipse cx="24" cy="25" rx="16" ry="8" fill="url(#${mat})"/><path d="${body}" fill="url(#${mat})" stroke="#f7e0ce" stroke-opacity=".6" stroke-width="1.6"/><path d="M-40-11Q-51-53-14-${round?74:93}" fill="none" stroke="#fff9df" stroke-opacity=".6" stroke-width="5" stroke-linecap="round"/>`;
 if(type==='thicc'){
  for(let i=0;i<9;i++)a+=`<circle cx="${-48+i*12}" cy="${-45-Math.sin(i)*22}" r="${3+i%3}" fill="#eae1ed" fill-opacity=".1" stroke="#eed6eb" opacity=".6"/>`;
  if(cutaway)a+='<path d="M-54-12Q0-39 54-12L49 13Q0 35-49 13Z" fill="#f4d6c7" stroke="#f6d8d3" stroke-width="2"/><path d="M-43 4Q0-8 43 4" stroke="#cba3b7" stroke-width="3" fill="none" stroke-dasharray="4 5"/>';
 }
 a+=face({t,mood,y:round?-39:-42,look});
 if(type==='drippy')a+='<path d="M-37-60Q0-69 38-60L35-43Q0-32-35-43Z" fill="#263e63"/><ellipse cx="-19" cy="-49" rx="8" ry="4" fill="#d4eff2"/><ellipse cx="19" cy="-49" rx="8" ry="4" fill="#d4eff2"/><path d="M35-54L63-47 51-35 34-45Z" fill="#33547d"/>';
 if(type==='oily')a+=`<path d="M-42 8Q0 24 43 7" fill="none" stroke="url(#edRainbow)" stroke-width="4"/>`;
 return a+'</g>';
}
function skinny({x=0,y=0,s=1,t=0,r=0,mood='happy'}={}){
 return `<g transform="${tr(x,y,s,r)}"><ellipse cy="28" rx="73" ry="15" fill="url(#ao)"/><path d="M-61 11Q-70-42-43-86Q-9-113 31-92Q66-76 63-22L58 20 37 8 18 26-4 12-26 27-42 11Z" fill="url(#edFilm)" stroke="#d9e4f1" stroke-width="2" stroke-opacity=".75"/><path d="M-49-10Q-55-60-26-84" stroke="#fff" stroke-width="5" opacity=".4" fill="none" stroke-linecap="round"/>${face({t,mood,y:-44})}<path d="M-55-2L-77 10M58-3L79 2" stroke="#c9dbee" stroke-width="9" stroke-linecap="round"/><path d="M36 10L58 20 55-6" fill="#e6e8f7" opacity=".4"/></g>`;
}
function can({x=0,y=0,s=1,t=0,r=0,mood='wink'}={}){
 return `<g transform="${tr(x,y,s,r)}"><ellipse cy="28" rx="82" ry="17" fill="url(#ao)"/><path d="M-57-127H57V7Q0 39-57 7Z" fill="url(#edMetal)" stroke="#c6dedc" stroke-width="2"/><ellipse cy="-127" rx="57" ry="20" fill="#b3d0cf" stroke="#e7e7da" stroke-width="3"/><ellipse cy="-127" rx="45" ry="12" fill="#4c6378"/><g transform="rotate(${Math.sin(t*3)*5} 0 -127)"><ellipse cy="-129" rx="12" ry="22" fill="#d9dfd9" stroke="#597688" stroke-width="3"/><ellipse cy="-133" rx="5" ry="8" fill="#52697a"/></g><path d="M-42-103V-17" stroke="#dfede6" opacity=".4" stroke-width="5" stroke-linecap="round"/>${face({t,mood,y:-49})}<path d="M-46-15Q0-3 46-15" stroke="#d7b6c5" stroke-width="4" fill="none"/></g>`;
}
const nailie=(o={})=>character({type:'hero',...o});
function surface(t,{split=false}={}){
 return `<ellipse cx="270" cy="710" rx="210" ry="42" fill="url(#ao)"/><path d="M59 676Q270 592 483 676L472 704Q270 756 71 704Z" fill="url(#table)" stroke="#f7daca" stroke-width="3"/><path d="M62 676Q270 614 480 676" stroke="#fff0d9" stroke-width="7" opacity=".75" fill="none"/><path d="M93 691Q270 729 449 691" stroke="#997b9a" stroke-width="2" opacity=".3" fill="none"/>${split?'<path d="M383 670L390 685 380 694 402 711" stroke="#71526e" stroke-width="3" fill="none"/>':''}`;
}
function calendar(t,x=433,y=391,s=.7){let flip=(t*2.4)%1;return `<g transform="${tr(x,y,s,-4)}"><rect x="-44" y="-49" width="88" height="91" rx="8" fill="#e1d5de" stroke="#fff0df" stroke-width="2"/><path d="M-44-25H44" stroke="#a188ad" stroke-width="17"/><path d="M-21-58V-43M21-58V-43" stroke="#efd39a" stroke-width="5" stroke-linecap="round"/><path d="M-29 0H-5M8 0H29M-29 17H-5M8 17H29" stroke="#a99bb5" stroke-width="6"/><path d="M-40-16H40L${40-22*flip} ${40-71*flip}L-40-16Z" fill="#faf0dd" opacity="${Math.sin(flip*Math.PI)*.8}"/></g>`;}
function dust(t,n=9,color='#f9dca7'){let a='';for(let i=0;i<n;i++)a+=star(67+(i*83)%412,410+(i*41)%245,.13+.16*(.5+.5*Math.sin(t*4+i)),color,t*20+i*29);return a;}
function lines(t){let a='';for(let i=0;i<10;i++)a+=`<path d="M${((i*97-t*260)%700+700)%700-80} ${452+i*22}h-42" stroke="#ead6bd" stroke-width="2" opacity=".17"/>`;return a;}
function back(t,warm=0){return `<rect width="540" height="960" fill="url(#edSky)"/><g opacity=".5" transform="translate(${Math.sin(t*.45)*6} 0)">${S.room(t,warm?'warm':'night')}</g><rect width="540" height="960" fill="#1a2244" opacity="${.2-warm*.08}"/><circle cx="${335+Math.sin(t*.6)*12}" cy="497" r="216" fill="url(#light)"/>`;}
const notes={oil:'چربی، اتصال رو سخت می‌کنه.',skin:'ژل باید به سطح درست بچسبه.',thick:'شماتیک؛ پخت به محصول و دستگاه وابسته است.',seal:'پوشش لبه، تضمین ضدآب‌بودن نیست.',tool:'ناخن، ابزار نیست.',fix:'ماندگاری برای همه یکسان نیست.'};
function shot(id,p,t){
 let a='',b=back(t,id==='fix'?.8:0),cam={s:1+.035*p,x:0,y:0,r:0};
 const gely=o=>blob({type:'gely',t,...o});
 if(id==='hook'){
  const stick=E(t/.5),peel=SM((t-1.3)/.8),fall=E((t-2)/.7),whip=E((t-3.2)/.4);
  a+=surface(t)+calendar(t);
  a+=nailie({x:147,y:654,s:.72,t,mood:t>1.6?'shock':'happy',pose:t<1.3?'wave':'panic'});
  a+=gely({x:309+peel*55,y:646-(1-stick)*100+fall*78,s:.78,r:peel*38+fall*80,mood:peel>.3?'shock':'happy',pose:peel>.3?'panic':'cheer'});
  if(t<1.35)a+=star(240,556,.5+.2*Math.sin(t*6),'#ffe4a7',t*60);
  a+=pill('اتصال خوب… یا یک پرش ناگهانی؟',270,345,334,'#dfc7e4');
  cam={s:1+.04*stick,x:-whip*540,y:Math.sin(t*48)*Math.exp(-Math.max(0,t-1.65)*10)*(t>1.65?3:0),r:whip*6};
 }else if(id==='oil'){
  const slide=E((t-.5)/1.9),sx=L(130,429,slide);
  a+=surface(t)+`<ellipse cx="280" cy="661" rx="126" ry="18" fill="url(#edRainbow)" opacity=".5"/><ellipse cx="284" cy="658" rx="88" ry="9" fill="#f3df99" opacity=".3"/>`;
  a+=blob({x:255,y:646,s:.67,t,type:'oily',mood:'wink',r:Math.sin(t)*4,pose:'stand'});
  a+=gely({x:sx,y:675-Math.sin(slide*Math.PI)*16,s:.63,r:slide*52,mood:'shock',pose:'panic'});
  a+=nailie({x:97,y:694,s:.43,t,mood:'shock',pose:'point'});
  a+=`<g transform="${tr(105,620,.65,-19)}"><rect x="-23" y="-12" width="46" height="24" rx="10" fill="#eee7eb" stroke="#b5bed7" stroke-width="2"/><path d="M-11-8V8M0-9V9M11-8V8" stroke="#c4c9db"/></g>`;
  a+=lines(t);cam={s:1.02,x:-slide*21,y:Math.sin(t)*3,r:Math.sin(t*.7)*1.5};
 }else if(id==='skin'){
  const lift=SM((t-.7)/1.8),wave=Math.sin(t*4);
  a+=surface(t);a+=nailie({x:105,y:685,s:.51,t,mood:'shock',pose:'point'});
  a+=`<g transform="${tr(300,653-lift*126,1,-lift*17+wave*lift*3)}">${skinny({x:0,y:0,s:1.12,t,mood:lift>.4?'shock':'happy'})}${gely({x:21+lift*32,y:-61,s:.56,r:lift*21,mood:lift>.4?'shock':'happy',pose:'hug'})}<path d="M48 6Q${70+wave*8} 54 96 16" stroke="#d5e1f1" stroke-width="2" fill="none" opacity=".7"/></g>`;
  a+=dust(t,7,'#d6e5f2');cam={s:1+.07*p,x:-p*12,y:lift*22,r:Math.sin(t)*1.5};
 }else if(id==='thick'){
  const collapse=E((t-1.9)/.9),wobble=Math.sin(t*9)*(1-collapse);
  a+=surface(t);a+=`<g transform="${tr(285,645,1,0)}"><g transform="scale(${1+collapse*.6+wobble*.015} ${1-collapse*.55})">${blob({x:0,y:0,s:1.23,t,type:'thicc',mood:t>1.8?'shock':'calm',cutaway:true})}</g></g>`;
  a+=`<g transform="${tr(277,400,.83)}"><path d="M-104 34Q-93-41-48-49H48Q93-41 104 34Z" fill="url(#apron)" stroke="#d0b9e1" stroke-width="3"/><path d="M-75 30Q0-4 75 30" stroke="#c0e1ed" stroke-width="9" fill="none"/><path d="M-70 42L-95 143H94L70 42" fill="#b7c7f1" opacity=".1"/><path d="M-57 52L-63 135M0 46V138M57 52L63 135" stroke="#e3d8fb" stroke-width="2" opacity="${.28+.12*Math.sin(t*5)}" stroke-dasharray="4 7"/>${label('نور لامپ',0,-12,19,'#ece3fb')}</g>`;
  a+=nailie({x:95,y:697,s:.48,t,mood:'shock',pose:'panic'});
  for(let i=0;i<10;i++){let q=((t*.4+i*.1)%1);a+=`<circle cx="${189+i*20}" cy="${650-q*130}" r="${2+q*4}" fill="none" stroke="#ecd3e7" opacity="${(1-q)*collapse}"/>`;}
  cam={s:1+.04*p,x:Math.sin(t*8)*collapse*2,y:0,r:Math.sin(t)*1};
 }else if(id==='seal'){
  const close=E((t-1.5)/.7),sneak=SM(t/1.7),bounce=E((t-2.2)/.8);
  a+=surface(t,{split:true});a+=gely({x:283,y:647,s:.68,mood:'shock',pose:'panic'});
  a+=`<path d="M374 665L447 682 443 721 377 707Z" fill="#313b5e" stroke="#b7b4cf" stroke-width="2"/><path d="M${374+close*70} 663L${411+close*33} 680 445 720 377 704Z" fill="url(#gold)" opacity="${close}"/>`;
  a+=blob({x:462-sneak*45+bounce*48,y:704-bounce*28,s:.43,t,type:'drippy',mood:'angry',pose:'point',r:bounce*48});
  a+=nailie({x:109,y:678,s:.68,t,mood:'brave',pose:'point'});
  a+=`<path d="M178 633Q${218+close*119} 590 ${260+close*157} 674" fill="none" stroke="#f9d28b" stroke-width="${2+close*3}" opacity="${Math.sin(close*Math.PI)}"/>`;
  a+=`<path d="M410 410L${369+Math.sin(t*2)*30} 717 515 731Z" fill="#d6e3eb" opacity=".06"/>`;cam={s:1+.06*p,x:-p*9,y:0,r:0};
 }else if(id==='tool'){
  const hit=SM((t-1.2)/.3),burst=E((t-1.5)/1),fade=1-E((t-1.7)/.4);
  a+=surface(t,{split:true});a+=can({x:388,y:626,s:.82,t});
  a+=`<g transform="${tr(269,672,1,-hit*10)}"><path d="M-77 5L109-53 120-35-64 23Z" fill="url(#nail)" stroke="#f9c4d7" stroke-width="2"/><path d="M-61 6L102-44" stroke="#ffe0df" stroke-opacity=".5" stroke-width="4"/></g>`;
  a+=`<g opacity="${fade}">${gely({x:269,y:642,s:.64,mood:'shock',pose:'panic'})}<path d="M249 570L266 592 257 610 281 634" stroke="#fff2cc" stroke-width="3" fill="none" opacity="${hit}"/></g>`;
  if(t>1.45)for(let i=0;i<12;i++){let angle=i*2.4;a+=star(267+Math.cos(angle)*burst*(40+i*7),602+Math.sin(angle)*burst*(30+i*4),.25*(1-burst*.6),'#f8d09e',t*40+i*22);}
  a+=nailie({x:95,y:695,s:.51,t,mood:'tired',pose:'hug'});
  a+=`<path d="M84 626Q76 645 84 647Q92 645 84 626Z" fill="#b7dde7"/><path d="M321 540L307 560M345 552L327 571M351 582L330 584" stroke="#e49a9e" stroke-width="3" opacity="${hit}"/>`;
  cam={s:1+.03*p,x:Math.sin(t*53)*Math.exp(-Math.max(0,t-1.3)*10)*(t>1.3?4:0),y:0,r:-hit*2};
 }else if(id==='fix'){
  a+=surface(t)+calendar(t,442,400,.6);a+=nailie({x:143,y:664,s:.76,t,mood:'happy',pose:'wave'});
  a+=gely({x:326,y:649,s:.92,mood:'wink',pose:'hug'});
  a+=`<path d="M256 663Q326 687 396 663" stroke="#e3d3ee" stroke-width="5" fill="none"/><path d="M${267+(t*43)%112} 536L${238+(t*43)%112} 649" stroke="#fff8e1" stroke-width="10" opacity=".22" stroke-linecap="round"/>`;
  a+=dust(t,14);cam={s:1+.025*p,x:Math.sin(t)*3,y:-p*11,r:0};
 }else if(id==='cta'){
  a+=surface(t);a+=nailie({x:157,y:675,s:.82,t,pose:'point',mood:'wink'});a+=gely({x:373,y:658,s:.85,mood:'happy',pose:'point'});
  a+=`<g transform="${tr(201,456+Math.sin(t*3)*4,.9,-4)}"><path d="M-23-36H23V30L0 13-23 30Z" fill="#dfc3e9" stroke="#f2d7e9" stroke-width="3"/></g><g transform="${tr(344+E((t-1.6)/1)*65,462-E((t-1.6)/1)*74,.9,t*3)}"><path d="M-30-5L33-30 9 38-5 9Z" fill="url(#gold)" stroke="#f8e2b4" stroke-width="2"/><path d="M-5 9L33-30" stroke="#b8916a" stroke-width="2"/></g>`;
  a+=pill('ذخیره کن؛ برای رفیقت بفرست.',270,355,330,'#ddc5e5')+dust(t);cam={s:1+.02*Math.sin(t),x:Math.sin(t*.8)*4,y:0,r:0};
 }
 let art=`<g transform="translate(270 520) scale(${1+.009*p}) translate(-270 -520)">${b}</g><g transform="translate(${270+cam.x} ${520+cam.y}) rotate(${cam.r}) scale(${cam.s}) translate(-270 -520)">${a}</g>`;
 if(notes[id])art+=`<rect x="34" y="687" width="472" height="26" rx="8" fill="#292541" fill-opacity=".72"/>`+label(notes[id],270,705,12,'#f1e2ec',500);
 return art+`<rect width="540" height="960" fill="url(#grain)"/><rect width="540" height="86" fill="#17172d"/><rect y="808" width="540" height="152" fill="#17172d"/>`;
}
function endcard(p,t,brand){let loop=E((p-.86)/.12);return `<g opacity="${1-loop}">${back(t,1)}${surface(t)}${nailie({x:150,y:684,s:.66,t,pose:'wave'})}${blob({x:373,y:674,s:.72,t,pose:'cheer'})}<rect x="63" y="331" width="414" height="184" rx="22" fill="#292541" stroke="#ba9fc5" stroke-opacity=".5"/>${label('پنج علت رایج، نه یک تشخیص',270,373,25,'#f1d9b4')}<text x="270" y="421" direction="ltr" text-anchor="middle" font-family="Vazirmatn" font-weight="800" font-size="28" fill="#f7e8de">${brand.handle.replace(/[<>&]/g,'')}</text>${pill('ذخیره · ارسال · فالو',270,449,241,'#dec7e4')}<rect width="540" height="86" fill="#17172d"/><rect y="808" width="540" height="152" fill="#17172d"/></g><g opacity="${loop}">${shot('hook',0,0)}</g>`;}
for(const id of [...ids,'__endcard'])registerScene(id,{mount(el){el.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 960" aria-hidden="true">${S.defs}${more}<g id="education-world"></g></svg>`;},update(el,p,t,brand){el.querySelector('#education-world').innerHTML=id==='__endcard'?endcard(p,t,brand):shot(id,p,t);}});
window.Education={defs:S.defs+more,nailie,blob,skinny,can,shot,label,pill,ids};
})();
