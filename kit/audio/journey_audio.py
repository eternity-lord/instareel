"""Reel 04 original warm 100 BPM score; shared synthesis vocabulary from cinematic_audio."""
import json
import math
import os
from pathlib import Path
import shutil
import subprocess
import wave
import numpy as np
from music_source import music_bed
import imageio_ffmpeg

ROOT = Path(__file__).resolve().parents[1]
SC = json.loads((ROOT/'input/scenario.json').read_text())
OUT = ROOT/'out'/'04'
OUT.mkdir(parents=True, exist_ok=True)
SR = 48000
DURS = dict(zip(['hook','tired','break','shoe','spa','glow','walk','heart','tease','cta'],[3,4.2,3,4.2,3.6,3.6,4.2,3,3.6,4.2]))
starts, timing = {}, {}
cursor = 0
for scene in SC['scenes']:
    key=scene['id'];d=DURS[key];words=scene['text'].split()
    weights=[1+min(.5,len(w)*.025)+(.4 if '...' in w else 0) for w in words]
    unit=(d-.85)/sum(weights);local=.15;tokens=[]
    for w,weight in zip(words,weights):
        tokens.append(dict(w=w,t0=round(local,5),t1=round(local+weight*unit,5)))
        local+=weight*unit
    if key=='glow':
        tokens=[dict(w=w,t0=i*.6,t1=(i+1)*.6 if i<2 else d-.7) for i,w in enumerate(words)]
    timing[key]=dict(dur=d,words=tokens);starts[key]=round(cursor,5);cursor+=d
TOTAL=round(cursor+SC.get('endCardSeconds',3),4)
N=round(TOTAL*SR)
score=np.zeros((N,2),dtype=np.float32);fx=np.zeros_like(score)
rng=np.random.default_rng(409)

def add(track, signal, at, gain=1, pan=0):
    i = round(at*SR)
    if i<0 or i>=N:
        return
    signal = signal[:N-i]
    track[i:i+len(signal), 0] += signal*gain*math.sqrt((1-pan)/2)
    track[i:i+len(signal), 1] += signal*gain*math.sqrt((1+pan)/2)

def bell(f, d=.7):
    t = np.arange(round(SR*d))/SR
    env = np.minimum(1, t/.004)
    return (np.sin(2*np.pi*f*t)*np.exp(-t*7)+.3*np.sin(2*np.pi*f*2.01*t)*np.exp(-t*11))*env

def brass(f, d=1.2):
    t = np.arange(round(SR*d))/SR
    env = np.minimum(1, t/.07)*np.minimum(1, (d-t)/.3)*np.exp(-t*.3)
    wave = sum(np.sin(2*np.pi*f*k*t + .004*np.sin(t*12)*k)/k**1.4 for k in range(1, 8))
    return wave*env*.55

def string(f, d=.3):
    t = np.arange(round(SR*d))/SR
    env = np.minimum(1, t/.012)*np.minimum(1, (d-t)/.09)*np.exp(-t*2)
    y = sum(np.sin(2*np.pi*(f*k+.22*(k%2))*t)/k**1.7 for k in range(1, 6))
    return y*env*.5

def boom(d=.7):
    t = np.arange(round(SR*d))/SR
    return (np.sin(2*np.pi*(43*t+.65*(1-np.exp(-t*23))))*np.exp(-t*7)
            +rng.standard_normal(len(t))*np.exp(-t*38)*.13)*np.minimum(1,t/.003)

def effect(k):
    if k=='whoosh':
        n=round(.48*SR);noise=np.convolve(rng.standard_normal(n),np.ones(25)/25,'same')
        return noise*np.sin(np.linspace(0,np.pi,n))*.9
    if k=='tick':
        t=np.arange(round(.045*SR))/SR
        return rng.standard_normal(len(t))*np.exp(-t*130)*.2
    if k=='pop':
        t=np.arange(round(.17*SR))/SR
        return np.sin(2*np.pi*(420*t-600*t*t))*np.exp(-t*24)*np.minimum(1,t/.003)
    if k=='error':
        # Cute suspense, not an alarm or frightening horror sting.
        return brass(146.83,.48)*.4+brass(155.56,.48)*.15
    if k=='chime':
        return bell(880,.85)+.45*bell(1318.51,.85)
    raise ValueError(k)

# Warm felt-piano-like synthesis: struck strings, no sampled piano recording.
def piano(f,d=1.5):
    t=np.arange(round(SR*d))/SR
    return sum(np.sin(2*np.pi*f*k*t+.001*k*np.sin(t*9))*np.exp(-t*(2.5+k*.8))/k**1.8 for k in range(1,6))*np.minimum(1,t/.008)
beat=.6
chords=[[130.81,164.81,196,261.63],[110,130.81,164.81,220],[87.31,130.81,174.61,220],[98,123.47,146.83,196]]
for b in range(math.ceil(TOTAL/beat)):
    at=b*beat;chord=chords[(b//4)%4]
    lively=starts['break']<=at<starts['heart'] or at>=starts['cta']
    gain=.15 if lively else .095
    add(score,piano(chord[b%4]*2,1.5),at,gain,pan=(b%4-1.5)*.16)
    if b%4==0:
        for note in chord[:3]:add(score,string(note,2.2),at,.05 if lively else .03)
    if lively:
        add(score,piano(chord[0]/2,.5),at,.16)
        if b%2==0:add(score,boom(.25),at,.075)
        add(score,effect('tick'),at+.3,.08,pan=.3)
for scene in SC['scenes']:
    for cue in scene.get('sfx',[]):
        add(fx,effect(cue['k']),starts[scene['id']]+cue['t'],.18,pan=.15*math.sin(starts[scene['id']]))
# Three transformation beats match the three words and visual cuts exactly.
for i,note in enumerate([523.25,659.25,783.99]):
    add(score,bell(note,1.3),starts['glow']+i*.6,.17)
    add(fx,effect('whoosh'),starts['glow']+i*.6,.10)
for i in range(5):
    add(fx,effect('pop'),starts['spa']+.4+i*.5,.035,pan=math.sin(i)*.5)
for key in ['break','shoe','spa','walk']:
    add(fx,effect('whoosh'),starts[key]-.24,.11)
for i,note in enumerate([659.25,783.99,1046.5,987.77]):
    add(score,piano(note,2),starts['heart']+i*.6,.14)
# Gentle comic low note, not a horror cue.
add(score,brass(98,.9),starts['tease']+.6,.12)
for note in [130.81,164.81,196,261.63]:add(score,piano(note,2.8),TOTAL-3,.14)
score, music_source = music_bed(ROOT, score, SR)
combined=score+fx
combined*=min(1,.85/max(1e-8,float(np.abs(combined).max())))
fade=round(.03*SR)
combined[:fade]*=np.linspace(0,1,fade)[:,None]
combined[-fade:]*=np.linspace(1,0,fade)[:,None]
raw=OUT/'mix-unmastered.wav'
with wave.open(str(raw),'wb') as f:
    f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR)
    f.writeframes((combined*32767).astype('<i2').tobytes())
ffmpeg=os.getenv('FFMPEG_PATH') or shutil.which('ffmpeg') or imageio_ffmpeg.get_ffmpeg_exe()
res=subprocess.run([ffmpeg,'-hide_banner','-y','-i',str(raw),'-af','loudnorm=I=-17:TP=-2:LRA=9:print_format=json','-ar',str(SR),'-c:a','pcm_s16le','-t',str(TOTAL),str(OUT/'mix.wav')],capture_output=True,text=True,check=True)
raw.unlink()
loudness,_=json.JSONDecoder().raw_decode(res.stderr[res.stderr.rfind('{'):])
(OUT/'timing.json').write_text(json.dumps(timing,ensure_ascii=False,indent=2))
status=dict(duration=TOTAL,sampleRate=SR,seed=409,bpm=100,voiceUsed=False,voiceReason='Original instrumental edition; no human voice or TTS generated.',timingMode='reading-timing',lastWordHold=.7,glowBeats=[18,18.6,19.2],mastering='-17 LUFS / -2 dBTP / LRA 9',loudness=loudness,music='Original warm piano-like additive synthesis, plucked strings and soft percussion; no sampled recordings.')
status['musicSource'] = music_source
if music_source['mode'] != 'synthesized': status['music'] = music_source['mode']
(OUT/'audio-status.json').write_text(json.dumps(status,indent=2))
print(json.dumps(status,indent=2))
