// Deterministic frame-by-frame renderer: Playwright -> ffmpeg. Usage: node render.mjs [--test] [--fps=30] [--out=../out/nail-reel-01.mp4]
import {chromium} from 'playwright';import {spawn,execFileSync} from 'node:child_process';
import http from 'node:http';import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const A=Object.fromEntries(process.argv.slice(2).map(a=>{const [k,v]=a.replace(/^--/,'').split('=');return [k,v??true]}));
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),FPS=+A.fps||30,OUT=path.resolve(ROOT,A.out||'out/nail-reel-01.mp4');
const MIME={'.html':'text/html','.js':'text/javascript','.json':'application/json','.woff2':'font/woff2','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.css':'text/css'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/')p='/src/index.html';
  if(p.startsWith('/node_modules/'))p='/render'+p;const f=path.join(ROOT,p);
  if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);return r.end()}
  r.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r)}).listen(0);
await new Promise(r=>srv.on('listening',r));
const browser=await chromium.launch({args:['--force-color-profile=srgb','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:540,height:960},deviceScaleFactor:2});
page.on('console',m=>console.log('[page]',m.text()));page.on('pageerror',e=>{console.error('[pageerror]',e);process.exitCode=1});
await page.goto(`http://localhost:${srv.address().port}/`);await page.evaluate(()=>window.__ready);
const dur=await page.evaluate(()=>window.__duration),secs=A.test?Math.min(3,dur):dur,N=Math.ceil(secs*FPS);
const audio=['audio/mix.wav','audio/music.mp3','audio/music.wav'].map(f=>path.join(ROOT,f)).find(fs.existsSync);
fs.mkdirSync(path.dirname(OUT),{recursive:true});
const args=['-y','-f','image2pipe','-framerate',String(FPS),'-i','-',...(audio?['-i',audio]:[]),
 '-c:v','libx264','-preset','slow','-crf','16','-profile:v','high','-pix_fmt','yuv420p','-r',String(FPS),'-movflags','+faststart',
 ...(audio?['-c:a','aac','-b:a','192k','-ar','48000','-af',`afade=t=out:st=${Math.max(0,secs-1.2)}:d=1.2`,'-t',String(secs)]:['-an']),OUT];
const ff=spawn('ffmpeg',args,{stdio:['pipe','inherit','inherit']});
const done=new Promise(r=>ff.on('close',r));
const frames=path.join(ROOT,'out/frames');fs.mkdirSync(frames,{recursive:true});
const keep=new Set([0,Math.floor(N*.5)]);const every=Math.max(1,Math.floor(N/24));
for(let f=0;f<N;f++){
  await page.evaluate(t=>window.__seek(t),f/FPS);
  const buf=await page.screenshot({type:'png'});
  if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));
  if(f%every===0)fs.writeFileSync(path.join(frames,`f${String(f).padStart(5,'0')}.png`),buf);
  if(f%60===0)console.log(`frame ${f}/${N}`);
}
ff.stdin.end();await done;await browser.close();srv.close();
try{execFileSync('ffmpeg',['-y','-pattern_type','glob','-i',path.join(frames,'f*.png'),'-vf','scale=216:-1,tile=6x4','-frames:v','1',path.join(ROOT,'out/contact-sheet.png')])}catch(e){console.error('contact sheet failed')}
try{execFileSync('ffmpeg',['-y','-ss','0.8','-i',OUT,'-frames:v','1',path.join(ROOT,'out/cover.png')])}catch(e){}
console.log('DONE ->',OUT);
