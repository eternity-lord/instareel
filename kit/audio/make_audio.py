#!/usr/bin/env python3
"""Builds voice (optional), music bed, SFX and the final mix. Writes out/timing.json (word timings + scene durations) and audio/mix.wav.
Run from repo root:  python3 audio/make_audio.py   (pip install edge-tts numpy ; needs ffmpeg/ffprobe)
Voice = synthetic only. If TTS is unavailable it silently falls back to music+SFX and wordDuration timing."""
import json,subprocess,asyncio,os,wave,math,random
import numpy as np
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));J=lambda *a:os.path.join(R,*a)
SC=json.load(open(J('input','scenario.json'),encoding='utf-8'));BR=json.load(open(J('brand.json'),encoding='utf-8'))
HOLD=SC.get('hold',1.0);END=SC.get('endCardSeconds',3);SR=48000;WD=BR['wordDuration']
os.makedirs(J('out','audio'),exist_ok=True)
def dur(f):return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]).decode())
async def tts(text,path):
    import edge_tts
    c=edge_tts.Communicate(text,BR['voice']['voice'],rate=BR['voice'].get('rate','+0%'),boundary='WordBoundary');w=[]
    with open(path,'wb') as f:
        async for ch in c.stream():
            if ch['type']=='audio':f.write(ch['data'])
            elif ch['type']=='WordBoundary':w.append({'w':ch['text'],'t0':ch['offset']/1e7,'t1':(ch['offset']+ch['duration'])/1e7})
    return w
timing={};voices=[];t=0.0
for s in SC['scenes']:
    words=None;vf=None
    if BR['voice']['enabled']:
        try:
            vf=J('out','audio',s['id']+'.mp3');words=asyncio.run(tts(s['text'],vf));d=dur(vf)
            if not words:
                toks=s['text'].split();step=d/len(toks);words=[{'w':x,'t0':i*step,'t1':(i+1)*step} for i,x in enumerate(toks)]
            words=[{'w':x['w'],'t0':x['t0']+.15,'t1':x['t1']+.15} for x in words];sd=d+.15+HOLD
        except Exception as e:
            print('TTS unavailable ->',e);vf=None;words=None;BR['voice']['enabled']=False
    if not words:
        toks=s['text'].split();words=[{'w':x,'t0':.15+i*WD,'t1':.15+(i+1)*WD} for i,x in enumerate(toks)];sd=s.get('dur') or words[-1]['t1']+HOLD
    timing[s['id']]={'words':words,'dur':sd};voices.append((t,vf));t+=sd
total=t+END;json.dump(timing,open(J('out','timing.json'),'w'),ensure_ascii=False,indent=1)
N=int(total*SR);mix=np.zeros((N,2),dtype=np.float32)
def add(x,at,g=1.0):
    i=int(at*SR);x=x[:max(0,N-i)];mix[i:i+len(x)]+=(x[:,None]*g if x.ndim==1 else x*g)
def env(n,a=.005,r=.3):e=np.ones(n);k=int(a*SR);e[:k]=np.linspace(0,1,k);m=int(r*n);e[-m:]=np.linspace(1,0,m);return e
def tone(f,d,w='sin'):x=np.arange(int(d*SR))/SR;y=np.sin(2*math.pi*f*x);return y*env(len(y))
SFX={'pop':lambda:tone(520,.12)*np.exp(-np.arange(int(.12*SR))/SR*25),'chime':lambda:(tone(1046,.9)+.6*tone(1568,.9))*.5,
 'tick':lambda:np.random.RandomState(1).randn(int(.04*SR))*np.exp(-np.arange(int(.04*SR))/SR*120)*.6,
 'error':lambda:tone(180,.35)*np.sign(np.sin(np.arange(int(.35*SR))/SR*60)),
 'whoosh':lambda:np.convolve(np.random.RandomState(2).randn(int(.5*SR)),np.ones(60)/60,'same')*np.sin(np.linspace(0,math.pi,int(.5*SR)))*.8}
st=0.0
for s in SC['scenes']:
    for e in s.get('sfx',[]):
        if e['k'] in SFX:add(SFX[e['k']]().astype(np.float32),st+e['t'],.35)
    st+=timing[s['id']]['dur']
if BR['music']['enabled']:
    bpm=BR['music']['bpm'];beat=60/bpm;ch=[[220,277,330],[196,247,294],[175,220,262],[196,247,294]];m=np.zeros((N,2),dtype=np.float32);n=0
    while n*beat*2<total:
        for f in ch[n%4]:
            x=tone(f,beat*2.2)*.5+tone(f*2,beat*2.2)*.15;i=int(n*beat*2*SR);x=x[:max(0,N-i)];m[i:i+len(x),0]+=x;m[i:i+len(x),1]+=x
        n+=1
    k=np.zeros(int(.2*SR));k=np.sin(2*math.pi*(60+80*np.exp(-np.arange(len(k))/SR*30))*np.arange(len(k))/SR)*np.exp(-np.arange(len(k))/SR*14)
    b=0
    while b*beat<total:
        i=int(b*beat*SR);x=k[:max(0,N-i)]*.5
        if b%2==0:m[i:i+len(x),0]+=x;m[i:i+len(x),1]+=x
        b+=1
    m*=BR['music']['volume']/max(1e-6,np.abs(m).max());mix+=m
for at,vf in voices:
    if vf:
        raw=subprocess.check_output(['ffmpeg','-v','error','-i',vf,'-f','f32le','-ac','1','-ar',str(SR),'-'])
        add(np.frombuffer(raw,dtype=np.float32),at+.15,.9)
mix*=min(1,.95/max(1e-6,np.abs(mix).max()))
out=J('audio','mix.wav');w=wave.open(out,'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((mix*32767).astype('<i2').tobytes());w.close()
print('mix ->',out,'total',round(total,2),'s')
