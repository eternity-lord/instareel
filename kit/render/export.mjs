// Copy final, shareable outputs out of scratch out/ (excluded from workspace snapshots).
import fs from 'node:fs';
import path from 'node:path';
import {ROOT,OUTDIR,DELIVERY,AUDIO,STEM} from './lib.mjs';
const target=DELIVERY;fs.mkdirSync(target,{recursive:true});
const files=[STEM+'.mp4','cover.png','style-frame.png','character-sheet.png','contact-sheet.png','end-card.png','REPORT.md','storyboard.md','timing.json','audio-status.json','qa.json','render-manifest.json','video-qa.json'];
for(const name of files){
 const source=path.join(OUTDIR,name);
 if(!fs.existsSync(source))throw new Error('Missing final artifact: '+name);
 fs.copyFileSync(source,path.join(target,name));
}
const previewQA=path.join(OUTDIR,'preview-qa.json');
if(fs.existsSync(previewQA))fs.copyFileSync(previewQA,path.join(target,'preview-qa.json'));
fs.copyFileSync(path.join(ROOT,'input/post_copy.md'),path.join(target,'post_copy.md'));
fs.copyFileSync(AUDIO,path.join(target,'mix.wav'));
fs.copyFileSync(path.join(OUTDIR,STEM+'.mp4'),path.join(ROOT,'deliverables',STEM+'.mp4'));
console.log('Exported final deliverables:',target);
