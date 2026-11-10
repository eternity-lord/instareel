"""Selected synthetic Persian speech + original 84 BPM pad; envelope-estimated word timing."""
import json, math, wave, subprocess
from pathlib import Path
import numpy as np
import imageio_ffmpeg
ROOT=Path(__file__).resolve().parents[1]
SC=json.loads((ROOT/'input/scenario.json').read_text());OUT=ROOT/'out/05';OUT.mkdir(parents=True,exist_ok=True)
SR=48000;FF=imageio_ffmpeg.get_ffmpeg_exe();rng=np.random.default_rng(505)
def load(p):
 raw=subprocess.check_output([FF,'-v','error','-i',str(p),'-f','f32le','-ac','1','-ar',str(SR),'-'])
 return np.frombuffer(raw,'<f4').copy()
def energy(a,hop=480):
 n=len(a)//hop;return np.sqrt(np.mean(a[:n*hop].reshape(n,hop)**2,axis=1)+1e-12)
def write(p,a):
 with wave.open(str(p),'wb') as w:
  w.setnchannels(1 if a.ndim==1 else a.shape[1]);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(a,-1,1)*32767).astype('<i2').tobytes())
clips=[];original=[]
for sc in SC['scenes']:
 a=load(ROOT/'audio/voice/05'/f"{sc['id']}.wav");e=energy(a);active=np.where(e>max(.004,float(e.max())*.025))[0]
 start=max(0,active[0]*480-960);end=min(len(a),(active[-1]+1)*480+1920)
 clips.append(a[start:end]);original.append(dict(scene=sc['id'],trimStart=start/SR,trimEnd=end/SR,rawDuration=len(a)/SR))
# At most 38s inclusive of holds/endcard. Pitch-preserving atempo is deterministic.
rate=max(1,sum(len(a)/SR for a in clips)/(34.8-len(clips)*1.0))
rate=math.ceil(rate*1000)/1000
prepared=[];timing={};cursor=0
for sc,a,info in zip(SC['scenes'],clips,original):
 tmp=OUT/'voice-trim.wav';write(tmp,a)
 b=np.frombuffer(subprocess.check_output([FF,'-v','error','-i',str(tmp),'-af',f'atempo={rate}','-f','f32le','-ac','1','-ar',str(SR),'-']),'<f4').copy()
 tmp.unlink();b*=.62/max(.001,float(np.max(np.abs(b))))
 length=len(b)/SR;d=math.ceil((length+1)*30)/30
 # Envelope mass favors speech over pauses. Lexical weights approximate word boundaries, not ASR.
 words=sc['text'].split();weights=np.array([max(1,len(w.replace('،','').replace(':','')))**.68 for w in words]);weights/=weights.sum()
 env=energy(b);mass=np.cumsum(np.maximum(env-.007,0)**.45+.012);mass/=mass[-1]
 times=np.interp(np.r_[0,np.cumsum(weights)],mass,np.arange(len(env))*.01)
 tokens=[dict(w=w,t0=round(.1+times[i],5),t1=round(.1+(times[i+1] if i<len(words)-1 else length),5)) for i,w in enumerate(words)]
 timing[sc['id']]=dict(dur=round(d,8),words=tokens)
 prepared.append((round(cursor*SR)+4800,b));info.update(atempo=rate,processedDuration=length,sceneDuration=d);cursor+=d
TOTAL=round(cursor+3,8);N=round(TOTAL*SR);voice=np.zeros(N,np.float32)
for i,a in prepared:voice[i:i+len(a)]+=a
bed=np.zeros((N,2),np.float32);fx=np.zeros_like(bed)
def add(track,a,at,gain=1,pan=0):
 i=round(at*SR);a=a[:max(0,N-i)]
 if i<0 or not len(a):return
 track[i:i+len(a),0]+=a*gain*math.sqrt((1-pan)/2);track[i:i+len(a),1]+=a*gain*math.sqrt((1+pan)/2)
def glass(f,d):
 t=np.arange(round(d*SR))/SR;return (np.sin(2*np.pi*f*t)*np.exp(-t*8)+.2*np.sin(2*np.pi*f*2.7*t)*np.exp(-t*13))*np.minimum(1,t/.008)
beat=60/84
for bar in range(math.ceil(TOTAL/(4*beat))):
 at=bar*4*beat;d=4*beat+.5;t=np.arange(round(d*SR))/SR;env=np.sin(np.pi*np.minimum(1,t/d))**1.5
 chord=([130.81,164.81,196],[110,130.81,164.81],[87.31,110,130.81],[98,123.47,146.83])[bar%4]
 for f in chord:add(bed,(np.sin(2*np.pi*f*t)+.12*np.sin(2*np.pi*f*2*t))*env,at,.026,pan=math.sin(f)*.3)
for i in range(math.ceil(TOTAL/beat)):
 t=np.arange(round(.2*SR))/SR;add(bed,np.sin(2*np.pi*63*t)*np.exp(-t*22)*np.minimum(1,t/.012),i*beat,.04)
starts={};at=0
for sc in SC['scenes']:
 starts[sc['id']]=at
 for cue in sc.get('sfx',[]):
  k=cue['k'];when=at+cue['t']
  if k=='whoosh':
   t=np.arange(round(.4*SR))/SR;n=np.convolve(rng.standard_normal(len(t)),np.ones(41)/41,'same');a=n*np.sin(np.pi*t/.4);gain=.12
  elif k=='error':a=glass(155.56,.5)+glass(164.81,.5)*.25;gain=.065
  elif k=='tick':a=glass(2400,.06);gain=.055
  elif k=='chime':a=glass(1046.5,.8);gain=.055
  else:a=glass(520,.3);gain=.075
  add(fx,a,when,gain,pan=math.sin(when)*.25)
 at+=timing[sc['id']]['dur']
# Smooth ducking from speech envelope, avoiding frame-dependent sidechain state.
chunks=energy(voice);activity=np.interp(np.arange(N)/SR,np.arange(len(chunks))*.01,chunks)
duck=1-.72*np.clip(activity/.035,0,1)
mix=voice[:,None]*np.ones((1,2))*.86+bed*duck[:,None]+fx
fade=round(.03*SR);mix[:fade]*=np.linspace(0,1,fade)[:,None];mix[-fade:]*=np.linspace(1,0,fade)[:,None]
raw=OUT/'mix-unmastered.wav';write(raw,mix)
r=subprocess.run([FF,'-hide_banner','-y','-i',str(raw),'-af','loudnorm=I=-17:TP=-2:LRA=9:print_format=json','-ar',str(SR),'-c:a','pcm_s16le',str(OUT/'mix.wav')],capture_output=True,text=True,check=True);raw.unlink()
loudness,_=json.JSONDecoder().raw_decode(r.stderr[r.stderr.rfind('{'):])
(OUT/'timing.json').write_text(json.dumps(timing,ensure_ascii=False,indent=2))
status=dict(duration=TOTAL,sampleRate=SR,seed=505,bpm=84,voiceUsed=True,voice='User-selected voice-00, synthetic Persian feminine',timingMode='speech-envelope weighted estimate; not forced alignment; no fixed 150ms guarantee',lastWordHoldMinimum=.9,atempo=rate,clips=original,mastering='-17 LUFS / -2 dBTP / LRA 9',loudness=loudness,music='Original deterministic ambient sine pad and soft pulse, no external music')
(OUT/'audio-status.json').write_text(json.dumps(status,indent=2));print(json.dumps(status,indent=2))
