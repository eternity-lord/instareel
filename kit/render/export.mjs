// Copy final, shareable outputs out of scratch out/ (excluded from workspace snapshots).
import fs from 'node:fs';
import path from 'node:path';
import {ROOT} from './lib.mjs';
const target=path.join(ROOT,'deliverables');fs.mkdirSync(target,{recursive:true});
const files=['nail-reel-01.mp4','cover.png','style-frame.png','character-sheet.png','contact-sheet.png','end-card.png','REPORT.md','storyboard.md','timing.json','audio-status.json','qa.json','render-manifest.json','video-qa.json'];
for(const name of files){
 const source=path.join(ROOT,'out',name);
 if(!fs.existsSync(source))throw new Error('Missing final artifact: '+name);
 fs.copyFileSync(source,path.join(target,name));
}
const previewQA=path.join(ROOT,'out/preview-qa.json');
if(fs.existsSync(previewQA))fs.copyFileSync(previewQA,path.join(target,'preview-qa.json'));
fs.copyFileSync(path.join(ROOT,'input/post_copy.md'),path.join(target,'post_copy.md'));
fs.copyFileSync(path.join(ROOT,'audio/mix.wav'),path.join(target,'mix.wav'));
console.log('Exported final deliverables:',target);
