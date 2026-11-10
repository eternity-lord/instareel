"""Reel 05 audio-only revision: original gentle instrumental, no voice or source SFX.
Uses frozen existing caption timings; never opens or mixes a narration file.
"""
import json
import math
import subprocess
import wave
from pathlib import Path
import numpy as np
import imageio_ffmpeg
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'out/05';OUT.mkdir(parents=True,exist_ok=True)
SR=48000
TIMING=ROOT/'input/scenarios/timing-05.json'
timing=json.loads(TIMING.read_text())
TOTAL=round(sum(s['dur'] for s in timing.values())+3,6)
assert TOTAL==38
N=round(TOTAL*SR)
mix=np.zeros((N,2),dtype=np.float64)
BPM=84
beat=60/BPM

def add(a,at,gain=1,pan=0):
 i=round(at*SR)
 if i<0 or i>=N:return
 a=a[:N-i]
 if i<0 or not len(a):return
 mix[i:i+len(a),0]+=a*gain*math.sqrt((1-pan)/2)
 mix[i:i+len(a),1]+=a*gain*math.sqrt((1+pan)/2)

def piano(f,d=3.5):
 t=np.arange(round(d*SR))/SR
 # Rounded struck-string partials with soft attack and a long quiet tail.
 y=sum(np.sin(2*np.pi*f*k*t)*np.exp(-t*(1.15+k*.23))/k**2 for k in range(1,5))
 return y*np.minimum(1,t/.018)*np.minimum(1,(d-t)/.5)

chords=[[130.81,164.81,196,261.63],[110,130.81,164.81,220],[87.31,130.81,174.61,220],[98,123.47,146.83,196]]
for b in range(math.ceil(TOTAL/(8*beat))):
 at=b*8*beat;d=8*beat+1.6;t=np.arange(round(d*SR))/SR
 env=np.sin(np.pi*np.minimum(1,t/d))**1.6
 chord=chords[b%4]
 for j,f in enumerate(chord[:3]):
  add((np.sin(2*np.pi*f*t)+.08*np.sin(2*np.pi*f*2*t))*env,at,.055,pan=(j-1)*.3)
 # Spacious arpeggio, half-time feel, no drums, glass stings, speech or vowels.
 for step in range(4):
  note=chord[[0,2,1,3][step]]*2
  when=at+step*2*beat+.12
  add(piano(note),when,.18,pan=(step%2-.5)*.35)
  add(piano(note),when+.23,.032,pan=(.5-step%2)*.5)
fade_in=round(.65*SR);fade_out=round(1.25*SR)
mix[:fade_in]*=np.linspace(0,1,fade_in)[:,None]
mix[-fade_out:]*=np.linspace(1,0,fade_out)[:,None]
mix*=min(1,.8/max(1e-9,float(np.max(np.abs(mix)))))
raw=OUT/'music-unmastered.wav'
with wave.open(str(raw),'wb') as w:
 w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((mix*32767).astype('<i2').tobytes())
ff=imageio_ffmpeg.get_ffmpeg_exe()
r=subprocess.run([ff,'-hide_banner','-y','-i',str(raw),'-af','loudnorm=I=-20:TP=-3:LRA=7:print_format=json','-ar',str(SR),'-c:a','pcm_s16le',str(OUT/'mix.wav')],capture_output=True,text=True,check=True)
raw.unlink()
loudness,_=json.JSONDecoder().raw_decode(r.stderr[r.stderr.rfind('{'):])
(OUT/'timing.json').write_bytes(TIMING.read_bytes())
status=dict(duration=TOTAL,sampleRate=SR,bpm=BPM,voiceUsed=False,voiceReason='User requested narration removal; no voice file opened or mixed.',sfxUsed=False,music='Original gentle instrumental: warm sine pads and soft piano-like arpeggio, no external recording.',timingMode='Frozen original caption/scene times; visual stream unchanged, no spoken alignment',lastWordHoldMinimum=.9,mastering='-20 LUFS / -3 dBTP / LRA 7',loudness=loudness,revision='music-only')
(OUT/'audio-status.json').write_text(json.dumps(status,indent=2))
print(json.dumps(status,indent=2))
