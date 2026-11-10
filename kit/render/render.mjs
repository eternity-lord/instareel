// Deterministic seek -> screenshot -> checked ffmpeg stream. No wall-clock capture.
import {spawn,execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {once} from 'node:events';
import {ROOT,serve,openScene,ffmpegPath,REEL_ID,STEM,OUTDIR,AUDIO} from './lib.mjs';
const args=Object.fromEntries(process.argv.slice(2).map(a=>{const [k,v]=a.replace(/^--/,'').split('=');return[k,v??true];}));
const FPS=Number(args.fps||30);
if(!Number.isFinite(FPS)||FPS<1||FPS>60)throw new Error('FPS must be 1–60');
const OUT=args.out?path.resolve(ROOT,args.out):path.join(OUTDIR,`${args.test?'smoke-test':STEM}.mp4`);
const FFMPEG=ffmpegPath(),server=await serve();let browser,ff;
fs.mkdirSync(OUTDIR,{recursive:true});
for(const name of ['storyboard.md','REPORT.md']){const source=path.join(ROOT,'docs',REEL_ID==='01'?name:name.replace('.md',`-${REEL_ID}.md`));if(fs.existsSync(source))fs.copyFileSync(source,path.join(OUTDIR,name));}
try{
 const session=await openScene(server);browser=session.browser;const {page,errors}=session;
 const cdp=await page.context().newCDPSession(page);
 const duration=await page.evaluate(()=>window.__duration),secs=args.test?Math.min(3,duration):duration;
 const frames=Math.ceil(secs*FPS);
 const audio=AUDIO;
 if(!fs.existsSync(audio))throw new Error(`Missing ${audio}. Run audio/make_audio.py first.`);
 fs.mkdirSync(path.dirname(OUT),{recursive:true});
 const command=['-hide_banner','-loglevel','warning','-y','-f','image2pipe','-framerate',String(FPS),'-i','-',
  '-i',audio,'-map','0:v:0','-map','1:a:0','-c:v','libx264','-preset','medium','-threads','2','-crf','18',
  '-profile:v','high','-level:v','4.2','-pix_fmt','yuv420p','-r',String(FPS),
  '-vf','scale=iw:ih:in_range=full:out_range=limited:out_color_matrix=bt709,format=yuv420p,sidedata=mode=delete:type=ICC_PROFILE','-color_range','tv',
  '-x264-params','colorprim=bt709:transfer=bt709:colormatrix=bt709:fullrange=off','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709',
  '-c:a','aac','-b:a','192k','-ar','48000','-t',String(secs),'-movflags','+faststart',OUT];
 ff=spawn(FFMPEG,command,{stdio:['pipe','ignore','pipe']});
 let stderr='';ff.stderr.on('data',b=>{stderr+=b;});
 let spawnError;ff.on('error',e=>{spawnError=e;});
 const done=new Promise(resolve=>ff.once('close',(code)=>resolve(code)));
 const pipeErrors=[];ff.stdin.on('error',e=>pipeErrors.push(e));
 const sampled=[];const sampleDir=path.join(OUTDIR,args.test?'smoke-frames':'frames');
 fs.mkdirSync(sampleDir,{recursive:true});
 for(const f of fs.readdirSync(sampleDir))if(/^f\d+\.jpg$/.test(f))fs.unlinkSync(path.join(sampleDir,f));
 const sampleAt=new Set(Array.from({length:24},(_,i)=>Math.min(frames-1,Math.round(i*(frames-1)/23))));
 for(let f=0;f<frames;f++){
  if(spawnError)throw spawnError;
  if(ff.exitCode!==null||pipeErrors.length)throw new Error('Encoder exited early: '+stderr);
  await page.evaluate(t=>window.__seek(t),f/FPS);
  const capture=await cdp.send('Page.captureScreenshot',{format:'jpeg',quality:96,fromSurface:true,clip:{x:0,y:0,width:540,height:960,scale:2},optimizeForSpeed:true});
  const buf=Buffer.from(capture.data,'base64');
  if(sampleAt.has(f)){const file=path.join(sampleDir,`f${String(f).padStart(5,'0')}.jpg`);fs.writeFileSync(file,buf);sampled.push(file);}
  if(!ff.stdin.write(buf))await Promise.race([once(ff.stdin,'drain'),done.then(c=>{throw new Error(`Encoder stopped ${c}: ${stderr}`);})]);
  if(f%90===0)console.log(`frame ${f}/${frames} (${(100*f/frames).toFixed(0)}%)`);
 }
 ff.stdin.end();const code=await done;
 if(code!==0)throw new Error(`ffmpeg exit ${code}: ${stderr}`);
 if(errors.length)throw new Error(errors.join('\n'));
 if(!args.test){
  execFileSync(FFMPEG,['-hide_banner','-loglevel','error','-y','-framerate','1','-pattern_type','glob','-i',path.join(sampleDir,'f*.jpg'),
   '-vf','scale=216:384,tile=6x4:padding=8:margin=8:color=0x211c33','-frames:v','1',path.join(OUTDIR,'contact-sheet.png')]);
 }
 const manifest={file:path.relative(ROOT,OUT),duration:secs,fps:FPS,frames,width:1080,height:1920,bytes:fs.statSync(OUT).size,codec:'H.264 High / yuv420p',audio:'AAC stereo 48 kHz',samples:sampled.map(f=>path.relative(ROOT,f))};
 fs.writeFileSync(path.join(OUTDIR,args.test?'smoke-render.json':'render-manifest.json'),JSON.stringify(manifest,null,2));
 console.log('DONE',JSON.stringify(manifest,null,2));
}finally{if(ff&&ff.exitCode===null)ff.kill('SIGTERM');await browser?.close();await new Promise(r=>server.close(r));}
