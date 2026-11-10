import * as THREE from 'three';
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
import {EffectComposer,RenderPass,EffectPass,BloomEffect,DepthOfFieldEffect,ChromaticAberrationEffect,Effect,BlendFunction} from 'postprocessing';
import {gsap} from '/render/node_modules/gsap/index.js';

// Native Three.js product cinematography. All animation is sampled by explicit time.
const W=540,H=960,clamp=v=>Math.max(0,Math.min(1,v)),ease=v=>1-(1-clamp(v))**3;
const smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
const ids=['hook','oil','skin','thick','seal','tool','fix','cta'];
const GOLD='#d9b88f',IVORY='#f4efe9';
const host=document.createElement('div');host.style.cssText='position:absolute;inset:0;background:#0b0a0c';
const renderer=new THREE.WebGLRenderer({antialias:false,alpha:false,preserveDrawingBuffer:true,powerPreference:'high-performance'});
renderer.setSize(W,H);renderer.setPixelRatio(1.25);renderer.setClearColor('#0b0a0c');renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.88;
host.append(renderer.domElement);
const overlay=document.createElement('div');overlay.className='macro-overlay';host.append(overlay);
const scene=new THREE.Scene();scene.background=new THREE.Color('#0b0a0c');scene.fog=new THREE.FogExp2('#0b0a0c',.033);
const camera=new THREE.PerspectiveCamera(32,W/H,.1,45);camera.position.set(5,5,6);camera.setViewOffset(W,H,0,-66,W,H);
// Procedural strip-light studio environment: no downloaded HDRI, artwork or textures.
const studio=new THREE.Scene();studio.background=new THREE.Color('#09080b');
function envPanel(x,y,z,sx,sy,color,rx=0,ry=0){const m=new THREE.Mesh(new THREE.PlaneGeometry(sx,sy),new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(1.7),side:THREE.DoubleSide}));m.position.set(x,y,z);m.rotation.set(rx,ry,0);studio.add(m);}
envPanel(-3,4,0,1.2,8,'#fff0dc',Math.PI/2,0);envPanel(3,2,-2,1,7,'#e9d7d7',0,-Math.PI/3);envPanel(0,3,4,6,.45,'#d9b88f',-.7,0);envPanel(-4,1,1,.7,6,'#c7d9e8',0,Math.PI/3);
const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(studio,.06,.1,20).texture;pmrem.dispose();
scene.add(new THREE.HemisphereLight('#e9d7d0','#16141b',.75));
function area(x,y,z,color,power){const l=new THREE.DirectionalLight(color,power);l.position.set(x,y,z);scene.add(l);return l;}
const key=area(-4,6,3,'#fff1dd',1.8),rim=area(4,2,-4,'#c9d9ff',1.5),fill=area(0,5,-1,'#d9b88f',.8);
const composer=new EffectComposer(renderer,{frameBufferType:THREE.HalfFloatType,multisampling:0});composer.addPass(new RenderPass(scene,camera));
const bloom=new BloomEffect({intensity:.27,luminanceThreshold:1.1,mipmapBlur:true,resolutionScale:.35});
const dof=new DepthOfFieldEffect(camera,{focusDistance:.15,focalLength:.035,bokehScale:.6,resolutionScale:.4});dof.target=new THREE.Vector3(0,0,0);
const chroma=new ChromaticAberrationEffect({offset:new THREE.Vector2(.00028,.00012),radialModulation:true,modulationOffset:.2});
const grain=new Effect('SeededEditorialGrain',`uniform float frameSeed;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){float n=fract(sin(dot(floor(uv*vec2(1080.,1920.)),vec2(12.9898,78.233))+frameSeed)*43758.5453);float v=smoothstep(.78,.18,distance(uv,vec2(.5,.52)));outputColor=vec4(inputColor.rgb*(.89+.11*v)+(n-.5)*.00065,1.);}`,{blendFunction:BlendFunction.NORMAL,uniforms:new Map([['frameSeed',new THREE.Uniform(0)]])});
composer.addPass(new EffectPass(camera,bloom,dof,chroma,grain));
const physical=(color,more={})=>new THREE.MeshPhysicalMaterial({color,metalness:.08,roughness:.14,clearcoat:1,clearcoatRoughness:.055,envMapIntensity:.85,...more});
const blush=physical('#b88198',{iridescence:.36,iridescenceIOR:1.32,iridescenceThicknessRange:[120,390]});
const ivory=physical('#9d8479',{roughness:.26});
const gel=physical('#f0c3b7',{transmission:.57,thickness:.34,ior:1.46,transparent:true,opacity:.95});
const glass=physical('#dfc39e',{transmission:.88,thickness:.7,ior:1.45,roughness:.075});
const gold=physical(GOLD,{metalness:.88,roughness:.23});const silver=physical('#a8a7ae',{metalness:.95,roughness:.19});
const milky=physical('#a599a8',{roughness:.63,transmission:.15,thickness:.5});
const blue=physical('#8aafcc',{transmission:.6,thickness:.3,roughness:.08});
const plane=new THREE.Mesh(new THREE.PlaneGeometry(80,80),physical('#0b0a0c',{metalness:.6,roughness:.17}));plane.rotation.x=-Math.PI/2;plane.position.y=-.57;scene.add(plane);
function nailGeo(){
 const shape=new THREE.Shape();shape.moveTo(0,-1.8);shape.bezierCurveTo(.35,-1.5,1.05,-.2,.84,1.1);shape.bezierCurveTo(.68,1.54,-.68,1.54,-.84,1.1);shape.bezierCurveTo(-1.05,-.2,-.35,-1.5,0,-1.8);
 const g=new THREE.ExtrudeGeometry(shape,{depth:.12,steps:1,bevelEnabled:true,bevelSegments:5,bevelSize:.12,bevelThickness:.15,curveSegments:32});g.rotateX(-Math.PI/2);const a=g.attributes.position;for(let i=0;i<a.count;i++){const x=a.getX(i),z=a.getZ(i);a.setY(i,a.getY(i)+.2*Math.max(0,1-(x/1.05)**2)*Math.max(0,1-(z/1.95)**2));}g.deleteAttribute('uv');g.deleteAttribute('normal');const welded=mergeVertices(g,.0001);welded.computeVertexNormals();return welded;
}
const ng=nailGeo();const sphere=new THREE.SphereGeometry(1,28,20);const torus=new THREE.TorusGeometry(1,.012,8,80);
function mesh(g,m,parent,x=0,y=0,z=0){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);parent.add(o);return o;}
function nail(parent,m=blush,x=0,y=0,z=0,scale=1){const o=mesh(ng,m,parent,x,y,z);o.scale.setScalar(scale);return o;}
function box(parent,m,x,y,z,sx,sy,sz){const o=mesh(new THREE.BoxGeometry(sx,sy,sz),m,parent,x,y,z);return o;}
function ball(parent,m,x,y,z,s){const o=mesh(sphere,m,parent,x,y,z);o.scale.setScalar(s);return o;}
function ring(parent,x,y,z,r,m=gold){const o=mesh(torus,m,parent,x,y,z);o.rotation.x=-Math.PI/2;o.scale.setScalar(r);return o;}
function line3(parent,pts,color=GOLD){const g=new THREE.BufferGeometry().setFromPoints(pts.map(p=>new THREE.Vector3(...p)));const o=new THREE.Line(g,new THREE.LineBasicMaterial({color,transparent:true,opacity:.75}));parent.add(o);return o;}
const groups={},actors={};
for(const id of ids){const g=new THREE.Group();g.visible=false;scene.add(g);groups[id]=g;actors[id]={};}
// 01. Droplet and glossy plate. The raised fragment is separate geometry, not a mascot.
{
 const g=groups.hook,a=actors.hook;
 a.plate=nail(g,physical('#211c24',{metalness:.25,roughness:.12}),0,-.1,0,1.1);
 a.drop=ball(g,glass,0,2,0,.3);a.rings=[.65,1,1.35].map(r=>ring(g,0,.18,0,r));
 a.corner=box(g,blush,.53,.15,1,.46,.08,.42);a.crack=line3(g,[[-.62,.21,.6],[-.25,.22,.29],[.05,.22,.46],[.18,.22,.81],[.65,.22,.99]]);
 a.tl=gsap.timeline({paused:true}).fromTo(a.drop.position,{y:2.7},{y:.35,duration:1.35,ease:'power2.in'},0).fromTo(a.drop.scale,{x:.16,y:.48,z:.16},{x:.4,y:.08,z:.4,duration:.35,ease:'power2.out'},1.35).fromTo(a.corner.rotation,{x:0},{x:-.27,duration:.7},1.65);
}
// 02. Oil islands hold the gel above the artificial nail plate.
{
 const g=groups.oil,a=actors.oil;a.base=nail(g,ivory,0,-.05,0);a.layer=nail(g,gel,0,.44,0,.96);
 a.dots=Array.from({length:18},(_,i)=>ball(g,gold,Math.sin(i*2.4)*.58,.33,-1.15+(i%7)*.36,.025+(i%3)*.012));
 a.tl=gsap.timeline({paused:true}).fromTo(a.layer.position,{y:.72},{y:.34,duration:1.1,ease:'power2.inOut'},0).to(a.layer.position,{y:.56,duration:1.1,ease:'sine.inOut'},1.1);
}
// 03. A cuticle remnant is a schematic translucent film, never photoreal skin.
{
 const g=groups.skin,a=actors.skin;a.base=nail(g,ivory,0,-.08,0);
 const filmMat=physical('#e6d1ba',{transmission:.7,thickness:.035,opacity:.52,transparent:true,side:THREE.DoubleSide});
 a.film=nail(g,filmMat,0,.16,0,.97);a.peel=new THREE.Group();g.add(a.peel);a.peel.position.set(0,.18,.9);
 a.layer=nail(a.peel,gel,0,0,-.9,.94);a.peelFilm=nail(a.peel,filmMat,0,-.06,-.9,.95);a.halo=ring(g,.5,.35,-.83,.23);
 a.tl=gsap.timeline({paused:true}).fromTo(a.peel.rotation,{x:0},{x:.27,duration:2,ease:'sine.inOut'},.3);
}
// 04. Equal footprints, exploded thin coats vs milky thick core. Not a cure-time diagram.
{
 const g=groups.thick,a=actors.thick;a.thin=[];
 for(let i=0;i<3;i++){const o=nail(g,i===0?ivory:gel,-1.12,i*.16-.05,0,.64);a.thin.push(o);}
 a.base=nail(g,ivory,1.12,-.05,0,.64);a.core=nail(g,milky,1.12,.19,0,.64);a.core.scale.y=2.3;
 a.top=nail(g,blush,1.12,.51,0,.64);
 a.bubbles=Array.from({length:11},(_,i)=>ball(g,glass,1.12+Math.sin(i*3)*.38,.34+Math.sin(i)*.08,Math.cos(i*2)*.7,.03+i%2*.02));
 a.scan=box(g,new THREE.MeshBasicMaterial({color:'#d9b88f',transparent:true,opacity:.2}),0,.65,0,3.5,.01,.14);
}
// 05. Free-edge cap and liquid path are illustrative, not a waterproof claim.
{
 const g=groups.seal,a=actors.seal;a.base=nail(g,ivory,0,-.04,0);a.layer=nail(g,gel,0,.22,0,.96);
 a.cap=box(g,gold,0,.25,1.39,1.23,.18,.055);
 a.water=Array.from({length:7},(_,i)=>ball(g,blue,(i-3)*.15,.18,1.7+i*.1,.065+i%2*.02));
 a.path=line3(g,[[0,.12,1.45],[0,.12,.8],[.12,.12,.5],[-.1,.12,.17]],'#8aafcc');
}
// 06. Metal tab, stress slit, physically lit shards.
{
 const g=groups.tool,a=actors.tool;a.nail=nail(g,blush,0,.02,0);const tab=new THREE.Group();g.add(tab);tab.position.set(0,.48,-1.1);
 a.tab=mesh(new THREE.TorusGeometry(.45,.12,10,48),silver,tab);a.tab.scale.set(1,1.45,.8);a.tab.rotation.x=Math.PI/2;
 box(tab,silver,0,0,.6,.75,.08,.3);ball(tab,silver,0,.07,.7,.105);
 a.crack=line3(g,[[-.65,.36,-.3],[-.25,.36,-.14],[.05,.36,-.33],[.2,.36,-.06],[.64,.36,.13]],'#e3b4a5');
 a.shards=Array.from({length:7},(_,i)=>{const o=mesh(new THREE.TetrahedronGeometry(.11+i%3*.02),blush,g);o.userData.index=i;return o;});
}
{
 const g=groups.fix,a=actors.fix;a.nail=nail(g,blush,0,.05,0,1.12);a.platform=mesh(new THREE.CylinderGeometry(2.2,2.2,.14,80),physical('#111016',{metalness:.7,roughness:.15}),g,0,-.4,0);
 a.halo=ring(g,0,-.3,0,2.28,gold);
}
{
 const g=groups.cta,a=actors.cta;a.nail=nail(g,blush,0,-.1,0,.8);a.ring=ring(g,0,-.3,0,1.9);
}
// Seeded cinematic dust; positions are re-derived on every seek, never integrated.
let seed=505;const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
const count=64,base=new Float32Array(count*3);for(let i=0;i<count;i++){base[i*3]=(random()-.5)*12;base[i*3+1]=random()*6-.3;base[i*3+2]=(random()-.5)*9;}
const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(base.slice(),3));const dust=new THREE.Points(pg,new THREE.PointsMaterial({color:GOLD,size:.014,transparent:true,opacity:.46,depthWrite:false}));scene.add(dust);
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const txt=(s,x,y,size=15,color=GOLD)=>`<text x="${x}" y="${y}" font-family="Vazirmatn" font-size="${size}" fill="${color}" text-anchor="middle" direction="rtl">${esc(s)}</text>`;
function path(d,p,more=''){return `<path d="${d}" fill="none" stroke="${GOLD}" stroke-width="1.1" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1-ease(p)}" ${more}/>`;}
const terms={hook:['پنج علت رایج','جداشدن ژل همیشه یک علت ندارد'],oil:['۰۱ / چربی سطح','فاصلهٔ هوا · نمای شماتیک'],skin:['۰۲ / باقی‌ماندهٔ پوست','فیلم نازک، اتصال ضعیف'],thick:['۰۳ / ضخامت و پخت','پخت مناسب به محصول و دستگاه وابسته است'],seal:['۰۴ / لبهٔ آزاد','پوشش لبه، تضمین ضدآب‌بودن نیست'],tool:['۰۵ / فشار مکانیکی','ناخن، ابزار بازکردن قوطی نیست'],fix:['اجرای اصولی، ماندگاری بهتر','نتیجه برای هر فرد و محصول متفاوت است'],cta:['ذخیره و ارسال','پنج علت رایج، نه تشخیص پزشکی']};
function technical(id,p,t){
 let a=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 960"><defs><linearGradient id="sweep05"><stop stop-color="#d9b88f" stop-opacity="0"/><stop offset=".5" stop-color="#fff1dc" stop-opacity=".18"/><stop offset="1" stop-color="#d9b88f" stop-opacity="0"/></linearGradient></defs>`;
 a+=`<g opacity="${ease(t/.4)}">${txt(terms[id][0],270,328,14)}${txt(terms[id][1],270,687,12,'#b6aaa7')}</g>`;
 if(['oil','skin','seal'].includes(id)){
  a+=`<g opacity=".48">${path('M72 605Q270 628 466 601',p*3)}${path('M77 596Q270 617 462 592',p*3-.12)}${path('M92 583Q270 599 448 576',p*3-.24)}</g>`;
  a+=path('M427 572L467 532H491',t/1.2)+txt(id==='oil'?'فاصله':id==='skin'?'جدایش':'لبه',468,519,11);
  if(id==='skin')a+=`<circle cx="410" cy="572" r="${15+Math.sin(t*3)*3}" stroke="${GOLD}" stroke-width="1" fill="none" opacity=".45"/>`;
  if(id==='seal')a+=`<path d="M392 610H${392-ease(t/1.8)*160}" stroke="#8aafcc" stroke-width="1.5" fill="none" stroke-dasharray="3 5" opacity="${1-smooth((t-2)/.6)}"/>`;
 }
 if(id==='thick')a+=txt('لایه‌های نازک',137,617,13)+txt('لایهٔ ضخیم',400,617,13)+path('M268 399V623',p*3,'opacity=".25"');
 if(id==='tool'){a+=`<g opacity="${ease(t/.7)}" stroke="#c9857e" fill="none" stroke-width="1.5"><path d="M270 397V453M259 439L270 453 281 439"/><circle cx="270" cy="508" r="${28+Math.sin(t*6)*4}" opacity=".3"/></g>`;}
 if(id==='cta'){
  a+=`<g transform="translate(123 430)">${path('M0 0H38V56L19 43 0 56Z',t/.7)}${txt('ذخیره کن',19,90,17,IVORY)}</g><g transform="translate(${366+ease((t-1.1)/1.1)*9} ${441-ease((t-1.1)/1.1)*7})">${path('M-24 3L30-16 10 37-2 15-24 3M-2 15L30-16',t/.9)}${txt('بفرست',0,78,17,IVORY)}</g>`;
 }
 const sweep=ease((p-.9)/.1);if(sweep>0)a+=`<g transform="translate(${sweep*800-130} 0) rotate(12)"><rect x="-80" y="320" width="160" height="430" fill="url(#sweep05)"/></g>`;
 return a+'</svg>';
}
function frame(id,p,t){
 for(const key of ids)groups[key].visible=key===id;
 const g=groups[id],a=actors[id];g.rotation.set(0,Math.sin(t*.45)*.04,0);g.position.set(0,0,0);
 if(a.tl)a.tl.seek(t,false);
 const angle=.45+Math.sin(p*1.6)*.14;
 camera.position.set(Math.sin(angle)*10.4,6.6-p*.25,Math.cos(angle)*10.4);camera.lookAt(0,.08,0);
 key.position.x=-4+Math.sin(t*.55)*1.1;rim.position.z=-4+Math.sin(t*.6);fill.intensity=.7+Math.sin(t*.8)*.12;
 if(id==='hook'){
  const impact=ease((t-1.35)/.55);a.drop.visible=t<1.7;
  for(let i=0;i<3;i++){a.rings[i].visible=t>=1.35;a.rings[i].scale.setScalar(.1+impact*(.5+i*.33));a.rings[i].position.y=.21-i*.005;}
  a.crack.visible=t>1.6;a.corner.visible=t>1.6;
  camera.position.multiplyScalar(1-.06*p);camera.lookAt(0,.15,0);
 }else if(id==='oil'){
  a.dots.forEach((o,i)=>{o.position.y=.31+Math.sin(t*1.2+i)*.025;o.position.x=Math.sin(i*2.4)*.58+Math.sin(t+i)*.025;});
 }else if(id==='skin'){
  a.halo.scale.setScalar(.25+Math.sin(t*3)*.025);camera.position.multiplyScalar(1-.08*p);camera.lookAt(0,.15,0);
 }else if(id==='thick'){
  const explode=Math.sin(clamp(t/3)*Math.PI)*.7;
  a.thin.forEach((o,i)=>{o.position.y=i*(.16+explode*.3)-.05;});a.top.position.y=.51+explode*.35;
  a.scan.position.z=1.5-((t*.8)%3);g.rotation.y=-.17+p*.34;
  camera.position.multiplyScalar(1.06);camera.lookAt(0,.1,0);
 }else if(id==='seal'){
  const cap=smooth((t-2)/.6);a.cap.scale.x=Math.max(.001,cap);a.path.visible=cap<.8;
  a.water.forEach((o,i)=>{const q=clamp((t-i*.1)/2);o.position.z=1.8-q*.9+cap*(.8+i*.07);o.position.y=.18+cap*Math.sin(q*Math.PI)*.5;o.scale.setScalar(.055+i%2*.025);});
  g.rotation.y=-.18+p*.1;
 }else if(id==='tool'){
  const hit=ease((t-1.3)/.3),fly=ease((t-1.45)/1.4);a.nail.rotation.x=-hit*.065;a.crack.visible=t>1.3;
  a.shards.forEach((o,i)=>{o.visible=t>1.4;o.position.set((i-3)*.15+Math.sin(i*3)*fly*.45,.3+fly*(.2+i*.08),-.4+Math.cos(i*2)*fly*.5);o.rotation.set(t*.4+i,t*.3+i,fly*i);});
  camera.position.x+=Math.sin(t*62)*Math.exp(-Math.max(0,t-1.3)*10)*(t>1.3?.045:0);
 }else if(id==='fix'){
  g.rotation.y=-.2+p*.4;camera.position.y=6.1+p*.6;camera.lookAt(0,.12,0);a.halo.rotation.z=t*.06;
 }else if(id==='cta'){
  g.rotation.y=.2+p*.2;camera.position.multiplyScalar(1.04);camera.lookAt(0,.08,0);
 }
 const pa=pg.attributes.position.array;for(let i=0;i<count;i++){pa[i*3]=base[i*3]+Math.sin(t*.13+i)*.1;pa[i*3+1]=base[i*3+1]+Math.sin(t*.17+i)*.13;pa[i*3+2]=base[i*3+2];}pg.attributes.position.needsUpdate=true;
 grain.uniforms.get('frameSeed').value=Math.floor(t*30)*.017;
 dof.target.set(0,id==='skin'?.4:.05,0);composer.render(0);renderer.getContext().finish();gsap.ticker.sleep();
 overlay.innerHTML=technical(id,p,t);
 window.__macroState={scene:id,webgl:renderer.capabilities.isWebGL2,meshes:renderer.info.render.calls,renderer:renderer.getContext().getParameter(renderer.getContext().RENDERER),pixelRatio:renderer.getPixelRatio()};
}
function endcard(p,t,brand){
 if(p>.91){frame('hook',0,0);overlay.innerHTML='';return;}
 frame('fix',p,t);
 overlay.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 960"><rect x="51" y="337" width="438" height="169" rx="3" fill="#0b0a0c" fill-opacity=".94" stroke="${GOLD}" stroke-opacity=".35"/>${txt('پنج علت رایج را به خاطر بسپار.',270,378,22,IVORY)}<text x="270" y="422" text-anchor="middle" direction="ltr" font-family="Vazirmatn" font-weight="800" font-size="29" fill="${GOLD}">${esc(brand.handle)}</text>${txt('ذخیره · ارسال · دنبال‌کردن',270,462,16)}${txt('آموزش عمومی؛ نه تشخیص یا توصیهٔ درمانی',270,685,11,'#a89d9a')}</svg>`;
}
for(const id of [...ids,'__endcard'])registerScene(id,{
 mount(el){el.replaceChildren(host);},
 update(el,p,t,brand){id==='__endcard'?endcard(p,t,brand):frame(id,p,t);}
});
window.Macro={frame,renderer,composer,scene,camera,overlay,host,ids,terms,materials:{blush,gel,glass},engine:'Three.js / MeshPhysicalMaterial / GSAP / postprocessing'};
