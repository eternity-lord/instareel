import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {chromium as playwright} from 'playwright';
import chromium from '@sparticuz/chromium';
import os from 'node:os';
import {brotliDecompressSync} from 'node:zlib';
// The npm browser bundle also supplies NSS/NSPR on minimal Linux images.
const libs=path.join(os.tmpdir(),'instareel-chromium-libs');
if(process.platform==='linux'&&!fs.existsSync(path.join(libs,'lib/libnspr4.so'))){
 fs.mkdirSync(libs,{recursive:true});
 const archive=path.join(libs,'libs.tar');
 fs.writeFileSync(archive,brotliDecompressSync(fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)),'node_modules/@sparticuz/chromium/bin/al2023.tar.br'))));
 execFileSync('tar',['-xf',archive,'-C',libs]);fs.unlinkSync(archive);
}
export const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const PROJECT=JSON.parse(fs.readFileSync(path.join(ROOT,'input/scenario.json'),'utf8'));
export const REEL_ID=PROJECT.reelId||'01';
if(!/^\d{2}(?:-cartoon)?$/.test(REEL_ID))throw new Error('Invalid reelId');
export const STEM=`nail-reel-${REEL_ID}`;
export const OUTDIR=path.join(ROOT,'out',REEL_ID==='01'?'':REEL_ID);
export const AUDIO=REEL_ID==='01'?path.join(ROOT,'audio/mix.wav'):path.join(OUTDIR,'mix.wav');
export const DELIVERY=path.join(ROOT,'deliverables',REEL_ID==='01'?'':`reel-${REEL_ID}`);

export function ffmpegPath(){
 if(process.env.FFMPEG_PATH)return process.env.FFMPEG_PATH;
 try{return execFileSync('which',['ffmpeg'],{encoding:'utf8'}).trim();}catch{}
 const python=fs.existsSync(path.resolve(ROOT,'../.venv/bin/python'))?path.resolve(ROOT,'../.venv/bin/python'):'python3';
 return execFileSync(python,['-c','import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())'],{encoding:'utf8'}).trim();
}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.woff2':'font/woff2','.png':'image/png','.jpg':'image/jpeg','.mp4':'video/mp4','.wav':'audio/wav','.md':'text/plain; charset=utf-8','.css':'text/css'};
export async function serve({port=0,home='/src/index.html'}={}){
 const server=http.createServer((req,res)=>{
  let url;try{url=decodeURIComponent(new URL(req.url,'http://local').pathname);}catch{res.writeHead(400);res.end();return;}
  if(url==='/')url=home;
  const file=path.resolve(ROOT,'.'+url);
  if(!file.startsWith(ROOT+path.sep)){res.writeHead(403);res.end();return;}
  let stat;try{stat=fs.statSync(file);}catch{res.writeHead(404);res.end('Not found');return;}
  if(!stat.isFile()){res.writeHead(404);res.end();return;}
  const headers={'Content-Type':mime[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes'};
  if(req.headers.range){
   const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
   if(!match){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});res.end();return;}
   const start=match[1]?+match[1]:Math.max(0,stat.size-Number(match[2]));
   const end=match[1]?(match[2]?Math.min(+match[2],stat.size-1):stat.size-1):stat.size-1;
   if(start>end||start>=stat.size){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});res.end();return;}
   res.writeHead(206,{...headers,'Content-Length':end-start+1,'Content-Range':`bytes ${start}-${end}/${stat.size}`});
   fs.createReadStream(file,{start,end}).pipe(res);
  }else{res.writeHead(200,{...headers,'Content-Length':stat.size});fs.createReadStream(file).pipe(res);}
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'0.0.0.0',resolve);});
 return server;
}
export async function openScene(server,{width=540,height=960,scale=2}={}){
 // This project is vector-only: CPU Skia avoids the much slower SwiftShader GPU path.
 const cpu=PROJECT.renderer!=='macro'&&process.env.STUDIO_CPU_RASTER!=='0';
 const graphicsArgs=cpu?chromium.args.filter(a=>!/^--(use-|in-process-gpu|enable-unsafe-swiftshader)/.test(a)):chromium.args;
 const browser=await playwright.launch({executablePath:process.env.CHROMIUM_PATH||await chromium.executablePath(),args:[...graphicsArgs,...(cpu?['--disable-gpu','--disable-gpu-compositing']:[]),'--force-color-profile=srgb'],env:{...process.env,LD_LIBRARY_PATH:[path.join(libs,'lib'),process.env.LD_LIBRARY_PATH].filter(Boolean).join(':')},headless:true});
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:scale});
 if(PROJECT.renderer==='macro')page.setDefaultTimeout(120000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))errors.push(`${r.status()} ${r.url()}`);});
 await page.goto(`http://127.0.0.1:${server.address().port}/src/index.html`);
 await page.evaluate(()=>window.__ready);
 if(errors.length)throw new Error(errors.join('\n'));
 return {browser,page,errors};
}
