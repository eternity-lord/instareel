#!/usr/bin/env python3
"""Original synthesized trailer score, not an orchestral recording or sampled music."""
import json
import math
import os
from pathlib import Path
import shutil
import subprocess
import wave
import numpy as np
import imageio_ffmpeg

ROOT = Path(__file__).resolve().parents[1]
SC = json.loads((ROOT/'input/scenario.json').read_text())
OUT = ROOT/'out'/SC.get('reelId', '02')
OUT.mkdir(parents=True, exist_ok=True)
SR = 48000
SEQUEL = SC.get('reelId') == '03'
DURS = ({'hook':3.7,'acetone':3.8,'army':2.7,'rookie':3.2,'chase':4.5,'melt':3.1,'team':3.7,'final':3.8,'twist':3.6,'cta':3.9}
        if SEQUEL else {'hook':3.2, 'door':3.2, 'can':3.2, 'thread':5., 'hero':3.6, 'combo':4.4, 'win':3.8, 'cta':4.6})
HERO,WIN,LAYER,IMPACT,FOG,TENSION = ('team','final','final','rookie','acetone','melt') if SEQUEL else ('hero','win','combo','door','can','thread')
SEED = 308 if SEQUEL else 207
timing = {}
starts = {}
cursor = 0
for scene in SC['scenes']:
    d = float(scene.get('dur', DURS[scene['id']]))
    tokens = scene['text'].split()
    weights = [1 + min(.5, len(w)*.025) + (.55 if '...' in w else 0) for w in tokens]
    unit = (d-.55)/sum(weights)
    local = .15
    words = []
    for w, weight in zip(tokens, weights):
        words.append({'w':w, 't0':round(local, 5), 't1':round(local+unit*weight, 5)})
        local += unit*weight
    timing[scene['id']] = {'dur':d, 'words':words}
    starts[scene['id']] = cursor
    cursor += d
TOTAL = round(cursor + SC.get('endCardSeconds', 3), 4)
N = round(TOTAL*SR)
score = np.zeros((N, 2), dtype=np.float32)
fx = np.zeros_like(score)
rng = np.random.default_rng(SEED)

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

# D-minor trailer pulse -> D-major hero lift. No borrowed melody or recording.
beat = .6
chords = [[146.83,174.61,220],[116.54,146.83,174.61],[98,116.54,146.83],[110,146.83,164.81]]
bar = 0
while bar*4*beat<TOTAL:
    at=bar*4*beat
    heroic=at>=starts[HERO]
    chord=([146.83,185,220] if bar%2==0 else [130.81,164.81,196]) if heroic else chords[bar%4]
    gain=.09 if heroic else .055
    for note in chord:
        add(score,brass(note,2.5),at,gain,pan=-.15)
    for step in range(8):
        note=chord[[0,2,1,2,0,2,1,2][step]]*2
        add(score,string(note,.32),at+step*beat/2,.13 if heroic else .075,pan=.35 if step%2 else -.35)
    for step in [0,2]:
        add(score,boom(.5),at+step*beat,.16 if heroic else .11)
    bar+=1
# Distinct cue points align the score with cuts, not just a generic loop bed.
for key,notes in [('hook',[73.42,110]),(IMPACT,[73.42,87.31]),(TENSION,[98,146.83]),
                  (HERO,[146.83,185,220,293.66]),(WIN,[146.83,185,220,369.99])]:
    for j,f in enumerate(notes):
        add(score,brass(f,1.35),starts[key]+j*.018,.13 if key in (HERO,WIN) else .1,pan=(j-1)*.2)
for scene in SC['scenes']:
    for cue in scene.get('sfx',[]):
        add(fx,effect(cue['k']),starts[scene['id']]+cue['t'],.26,pan=.18*math.sin(starts[scene['id']]))
# Motivated foley: soft slam, fizz, lasso, three coat strikes and shield bounces.
add(fx,boom(),starts[IMPACT]+2.18,.42)
fizz=np.convolve(rng.standard_normal(round(1.9*SR)),np.ones(9)/9,'same')
add(fx,fizz*np.sin(np.linspace(0,np.pi,len(fizz))),starts[FOG]+.65,.025,pan=.25)
for i in range(3):
    add(fx,effect('whoosh'),starts[LAYER]+i*.8,.19,pan=(i-1)*.3)
    add(fx,boom(.35),starts[LAYER]+.16+i*.8,.14)
    add(fx,effect('pop'),starts[WIN]+.3+i*.75,.17)
for i,note in enumerate([587.33,739.99,880,1174.66]):
    add(score,bell(note,1),starts[HERO]+.2+i*.13,.11,pan=(i-1.5)*.2)
    add(score,bell(note,1),starts[LAYER]+2.4+i*.1,.10)
# A gently comic #8 tease, followed by an end-card resolution.
for i,note in enumerate([440,493.88,415.3]):
    add(score,string(note,.4),starts['cta']+2+i*.23,.13)
for note in [146.83,185,220,293.66]:
    add(score,brass(note,2.5),TOTAL-3,.08)
if SEQUEL:
    # March, fast skate chase, heartbeat and a quiet-before-kaiju reveal.
    for i in range(6):
        add(fx,effect('tick'),starts['army']+i*.4,.12,pan=(-.25 if i%2 else .25))
    for i in range(4):
        add(fx,effect('whoosh'),starts['chase']+i*1.05,.19,pan=(i%2-.5)*.7)
    for i in range(4):
        add(fx,boom(.24),starts['melt']+i*.68,.16)
    quiet=round(starts['twist']*SR);end=min(N,quiet+round(.68*SR))
    score[quiet:end]*=.15
    add(fx,boom(1.2),starts['twist']+.8,.24)
    for i,note in enumerate([110,146.83,174.61]):
        add(score,brass(note,1.4),starts['twist']+1.15+i*.04,.1)
combined=score+fx
combined*=min(1,.88/max(1e-8,float(np.abs(combined).max())))
fade=round(.025*SR)
combined[:fade]*=np.linspace(0,1,fade)[:,None]
combined[-fade:]*=np.linspace(1,0,fade)[:,None]
raw=OUT/'mix-unmastered.wav'
with wave.open(str(raw),'wb') as f:
    f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR)
    f.writeframes((combined*32767).astype('<i2').tobytes())
ffmpeg=os.getenv('FFMPEG_PATH') or shutil.which('ffmpeg') or imageio_ffmpeg.get_ffmpeg_exe()
res=subprocess.run([ffmpeg,'-hide_banner','-y','-i',str(raw),'-af',
                    'loudnorm=I=-17:TP=-2:LRA=9:print_format=json','-ar',str(SR),'-c:a','pcm_s16le',
                    '-t',str(TOTAL),str(OUT/'mix.wav')],capture_output=True,text=True,check=True)
raw.unlink()
loudness,_=json.JSONDecoder().raw_decode(res.stderr[res.stderr.rfind('{'):])
(OUT/'timing.json').write_text(json.dumps(timing,ensure_ascii=False,indent=2))
status={'duration':TOTAL,'sampleRate':SR,'seed':SEED,'voiceUsed':False,
        'voiceReason':'Instrumental cinematic edition. No TTS generated or real voice used.',
        'timingMode':'reading-timing','mastering':'-17 LUFS / -2 dBTP / LRA 9','loudness':loudness,
        'music':'Original deterministic brass-like/strings-like synthesis, ostinato and tuned percussion; no samples or external recording.'}
(OUT/'audio-status.json').write_text(json.dumps(status,ensure_ascii=False,indent=2))
print(json.dumps(status,ensure_ascii=False,indent=2))
