import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {ROOT,OUTDIR,serve,openScene,PROJECT} from './lib.mjs';
assert.equal(PROJECT.renderer,'macro');
const original=JSON.parse(fs.readFileSync(path.join(ROOT,'input/scenarios/scenario-05.json')));
const {reelId,renderer,audioStyle,...actual}=PROJECT;
const expected=structuredClone(original);expected.scenes.find(s=>s.id==='fix').text='اجرای درست، به ماندگاری بیشتر کمک می‌کنه';assert.deepEqual(actual,expected);
const prior={
 '01':'e898dc46419c97566494254064d92515e7d2cdc93240918605944f0a1ee4e19c',
 '02':'90736f21a9ef457c7f5db2182a32faec9ab366c993a7bf0093be0dcfb5dc9be9',
 '03':'32afdd2525605388535f14ffa48c89ef0d3c2dacb3f365d98a53e8f6d7555de3',
 '04':'8228407802df67ab8a7e91076d23c30435e1c4a25206a1105829e53b245775f6'
};
for(const [id,sha] of Object.entries(prior))assert.equal(createHash('sha256').update(fs.readFileSync(path.join(ROOT,`deliverables/nail-reel-${id}.mp4`))).digest('hex'),sha);
const status=JSON.parse(fs.readFileSync(path.join(OUTDIR,'audio-status.json')));assert.equal(status.voiceUsed,true);assert.equal(status.bpm,84);assert.equal(status.duration,38);
const timing=JSON.parse(fs.readFileSync(path.join(OUTDIR,'timing.json')));
for(const s of Object.values(timing))assert.ok(s.dur-s.words.at(-1).t1>=.8999);
const server=await serve();let browser;
try{
 const session=await openScene(server);browser=session.browser;const {page}=session;
 const state=await page.evaluate(()=>{
  const M=window.Macro,gl=M.renderer.getContext(),ext=gl.getExtension('WEBGL_debug_renderer_info');
  const materials=Object.fromEntries(Object.entries(M.materials).map(([k,m])=>[k,{type:m.type,transmission:m.transmission,clearcoat:m.clearcoat,iridescence:m.iridescence,thickness:m.thickness}]));
  const controls=window.__scenes.map(s=>{
   window.__seek(s.start+.3);const first={position:M.camera.position.toArray(),matrix:M.scene.matrixWorld.toArray(),png:M.renderer.domElement.toDataURL()};
   window.__seek(s.start+s.dur*.75);return {scene:s.id,cameraMoves:JSON.stringify(first.position)!==JSON.stringify(M.camera.position.toArray()),imageMoves:first.png!==M.renderer.domElement.toDataURL(),canvasCount:document.querySelectorAll('#scene canvas').length};
  });
  return {engine:M.engine,webgl2:M.renderer.capabilities.isWebGL2,unmaskedRenderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),canvas:{width:M.renderer.domElement.width,height:M.renderer.domElement.height},postprocessingPasses:M.composer.passes.length,materials,controls};
 });
 assert.equal(state.webgl2,true);assert.equal(state.postprocessingPasses,2);
 assert.equal(state.materials.blush.type,'MeshPhysicalMaterial');assert.ok(state.materials.gel.transmission>0);assert.ok(state.materials.blush.iridescence>0);
 for(const c of state.controls){assert.ok(c.cameraMoves,c.scene);assert.ok(c.imageMoves,c.scene);assert.equal(c.canvasCount,1);}
 assert.deepEqual(session.errors,[]);
 const report={passed:true,originalScenarioArchived:true,accuracyEditOnly:'fix line removes fixed-duration promise',kitZipSha256:'aea211c12fb01261701357f23877a29a82ad45a14541279899901f44085e58fd',kitArchive:'reference/kit-v2/',priorVideoSha256:prior,voiceUsed:true,timingMode:status.timingMode,lastWordHoldMinimum:.9,bpm:84,...state,browserErrors:session.errors};
 fs.writeFileSync(path.join(OUTDIR,'macro-qa.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser?.close();server.close();}
