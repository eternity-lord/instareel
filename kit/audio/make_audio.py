#!/usr/bin/env python3
"""Original instrumental score + timed SFX; bounded optional synthetic Persian TTS.
Optional user-supplied local music bed (kit v3). Run from any directory. Audio metadata explicitly reports fallback.
"""
import asyncio
import json
import math
import os
from pathlib import Path
import shutil
import subprocess
import wave
import numpy as np
from music_source import music_bed

ROOT = Path(__file__).resolve().parents[1]
SR = 48000
SC = json.loads((ROOT / 'input/scenario.json').read_text())
if SC.get('audioStyle') in ('cinematic','journey','macro','education','quiz'):
    import runpy
    runpy.run_path(str(ROOT/('audio/quiz_audio.py' if SC.get('audioStyle')=='quiz' else 'audio/education_audio.py' if SC.get('audioStyle')=='education' else 'audio/macro_audio.py' if SC.get('audioStyle')=='macro' else 'audio/journey_audio.py' if SC.get('audioStyle')=='journey' else 'audio/cinematic_audio.py')), run_name='__main__')
    raise SystemExit(0)
BR = json.loads((ROOT / 'brand.json').read_text())
OUT = ROOT / 'out'
OUT.mkdir(exist_ok=True)
(OUT / 'audio').mkdir(exist_ok=True)
DEFAULTS = {'hook': 3.4, 'short': 4, 'simple': 5, 'hurry': 4.2,
            'photo': 4, 'trust': 4.5, 'payoff': 4, 'cta': 2.9}

def ffmpeg():
    if os.getenv('FFMPEG_PATH'):
        return os.environ['FFMPEG_PATH']
    if shutil.which('ffmpeg'):
        return shutil.which('ffmpeg')
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()

async def tts(text, path):
    import edge_tts
    communicate = edge_tts.Communicate(text, BR['voice']['voice'],
                                     rate=BR['voice'].get('rate', '+0%'), boundary='WordBoundary')
    words = []
    with open(path, 'wb') as f:
        async for chunk in communicate.stream():
            if chunk['type'] == 'audio':
                f.write(chunk['data'])
            elif chunk['type'] == 'WordBoundary':
                words.append({'w': chunk['text'], 't0': chunk['offset'] / 1e7 + .15,
                              't1': (chunk['offset'] + chunk['duration']) / 1e7 + .15})
    return words

voice_ok = BR['voice']['enabled'] and not os.getenv('NO_TTS')
voice_failure = 'disabled by configuration' if not voice_ok else None
voices = []
timing = {}
clock = 0
for scene in SC['scenes']:
    dur = scene.get('dur', DEFAULTS.get(scene['id'], max(3, len(scene['text'].split()) * .34 + .6)))
    voice = None
    words = None
    if voice_ok:
        target = OUT / 'audio' / (scene['id'] + '.mp3')
        try:
            words = asyncio.run(asyncio.wait_for(tts(scene['text'], target), timeout=8))
            raw = subprocess.check_output([ffmpeg(), '-v', 'error', '-i', str(target), '-f', 'f32le',
                                           '-ac', '1', '-ar', str(SR), '-'])
            voice = np.frombuffer(raw, dtype=np.float32)
            if not words:
                raise ValueError('No word boundaries returned')
            dur = max(dur, len(voice) / SR + .4)
        except Exception as exc:
            voice_ok = False
            voice_failure = type(exc).__name__ + ': ' + str(exc)
            print('Synthetic TTS unavailable; using disclosed instrumental fallback:', voice_failure)
            target.unlink(missing_ok=True)
            words = None
            voice = None
    if not words:
        tokens = scene['text'].split()
        weights = [1 + min(.6, len(w) * .025) + (.5 if '...' in w else 0) for w in tokens]
        step = (dur - .55) / sum(weights)
        cursor = .15
        words = []
        for word, weight in zip(tokens, weights):
            words.append({'w': word, 't0': round(cursor, 4), 't1': round(cursor + step * weight, 4)})
            cursor += step * weight
    timing[scene['id']] = {'words': words, 'dur': dur}
    voices.append((clock, voice))
    clock += dur
TOTAL = clock + SC.get('endCardSeconds', 3)
(OUT / 'timing.json').write_text(json.dumps(timing, ensure_ascii=False, indent=2))
N = round(TOTAL * SR)
music = np.zeros((N, 2), np.float32)
fx = np.zeros_like(music)
voice_track = np.zeros_like(music)
rng = np.random.default_rng(1621)

def add(track, signal, at, gain=1, pan=0):
    start = round(at * SR)
    if start < 0 or start >= N:
        return
    signal = signal[:N-start]
    track[start:start+len(signal), 0] += signal * gain * math.sqrt((1-pan)/2)
    track[start:start+len(signal), 1] += signal * gain * math.sqrt((1+pan)/2)

def pluck(freq, seconds=.55, bright=1):
    x = np.arange(round(seconds * SR)) / SR
    attack = np.minimum(1, x / .004)
    y = np.sin(2*math.pi*freq*x)*np.exp(-x*7)
    y += .24*bright*np.sin(2*math.pi*freq*2.003*x)*np.exp(-x*12)
    y += .09*bright*np.sin(2*math.pi*freq*3.98*x)*np.exp(-x*18)
    return y * attack

def softpad(freq, seconds):
    x = np.arange(round(seconds * SR)) / SR
    env = np.minimum(1, x/.12) * np.minimum(1, (seconds-x)/.3)
    return (np.sin(2*math.pi*freq*x) + .12*np.sin(2*math.pi*freq*2*x)) * env * .2

def sfx(kind):
    if kind in ('pop', 'tap'):
        x=np.arange(round(.14*SR))/SR
        return np.sin(2*np.pi*(520*x-900*x*x))*np.exp(-x*32)*np.minimum(1,x/.002)
    if kind=='tick':
        x=np.arange(round(.055*SR))/SR
        return rng.standard_normal(len(x))*np.exp(-x*130)*.35
    if kind=='whoosh':
        x=np.arange(round(.38*SR))/SR
        noise=np.convolve(rng.standard_normal(len(x)),np.ones(35)/35,mode='same')
        return noise*np.sin(np.linspace(0,np.pi,len(x)))
    if kind=='error':
        x=np.arange(round(.32*SR))/SR
        f=np.where(x<.14,246.94,196)
        return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-x*6)*np.minimum(1,x/.006)*.5
    if kind=='chime':
        return pluck(1046.5,.8,.8)+.55*pluck(1567.98,.8,.8)
    raise ValueError('Unknown SFX '+kind)

# Original light bossa / music-box bed, Amaj7–F#m7–Dmaj7–E6, 100 bpm.
beat = 60 / BR['music']['bpm']
chords = [[220,277.18,329.63,415.3], [185,220,277.18,329.63],
          [146.83,185,220,277.18], [164.81,207.65,246.94,329.63]]
if BR['music']['enabled']:
    bar=0
    while bar*4*beat<TOTAL:
        at=bar*4*beat
        chord=chords[bar%4]
        for note in chord:
            add(music,softpad(note,4*beat+.3),at,.12,pan=.15)
        for b in range(8):
            note=chord[[0,2,1,3,2,1,3,2][b]]*2
            add(music,pluck(note,.7),at+b*beat/2,.12,pan=(-.4 if b%2 else .4))
        for b in (0,2):
            add(music,pluck(chord[0]/2,.9,.1),at+b*beat,.23)
        bar+=1
    b=0
    while b*beat<TOTAL:
        x=np.arange(round(.2*SR))/SR
        kick=np.sin(2*np.pi*(52*x + .4*(1-np.exp(-x*50))))*np.exp(-x*25)
        if b%2==0:
            add(music,kick,b*beat,.15)
        else:
            brush=rng.standard_normal(len(x))*np.exp(-x*40)*np.minimum(1,x/.004)
            add(music,brush,b*beat,.018,pan=.2)
        b+=1
    music *= BR['music']['volume'] / max(1e-6, float(np.max(np.abs(music))))
music, music_source = music_bed(ROOT, music, SR)
clock=0
for scene in SC['scenes']:
    for effect in scene.get('sfx', []):
        add(fx,sfx(effect['k']),clock+effect['t'],.25,pan=.12*math.sin(clock))
    # A quiet page-turn click makes reading rhythm tangible without mimicking speech.
    add(fx,sfx('tick'),clock,.04)
    clock+=timing[scene['id']]['dur']
for at,voice in voices:
    if voice is not None:
        add(voice_track,voice,at+.15,1.15)
        start=round((at+.1)*SR);stop=min(N,start+len(voice)+round(.3*SR))
        music[start:stop]*=.34
# Uplift for the warm payoff, not a downloaded recording.
payoff=sum(timing[s['id']]['dur'] for s in SC['scenes'][:6])
for i,note in enumerate([659.25,830.61,987.77,1318.51]):
    add(fx,pluck(note,1.1),payoff+i*.1,.12,pan=(i-1.5)*.2)
combined=music+fx+voice_track
combined*=min(1, .89/max(1e-6,float(np.max(np.abs(combined)))))
# Tiny boundary ramps avoid digital clicks, without a long dead fade.
fade=round(.025*SR)
combined[:fade]*=np.linspace(0,1,fade)[:,None]
combined[-fade:]*=np.linspace(1,0,fade)[:,None]
with wave.open(str(ROOT/'audio/mix.wav'),'wb') as f:
    f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR)
    f.writeframes((combined*32767).astype('<i2').tobytes())
# Broadcast-style loudness master. This is original synthesized music, not an external asset.
master = ROOT/'audio/mix-master.wav'
mastering = subprocess.run([ffmpeg(), '-hide_banner', '-loglevel', 'info', '-y',
                           '-i', str(ROOT/'audio/mix.wav'), '-af',
                           'loudnorm=I=-18:TP=-1.5:LRA=7:print_format=json',
                           '-ar', str(SR), '-c:a', 'pcm_s16le', '-t', str(TOTAL), str(master)],
                          capture_output=True, text=True, check=True)
os.replace(master, ROOT/'audio/mix.wav')
with wave.open(str(ROOT/'audio/mix.wav'), 'rb') as f:
    mastered = np.frombuffer(f.readframes(f.getnframes()), dtype='<i2').astype(np.float32)/32768
loudness, _ = json.JSONDecoder().raw_decode(mastering.stderr[mastering.stderr.rfind('{'):])
metadata={'duration':TOTAL,'sampleRate':SR,'peakDbFS':round(20*math.log10(max(1e-9,float(np.max(np.abs(mastered))))),2),
          'mastering':'FFmpeg loudnorm: -18 LUFS / -1.5 dBTP / LRA 7','loudness':loudness,
          'voiceUsed':any(v is not None for _,v in voices),'voiceFailure':voice_failure,
          'timingMode':'tts-boundaries' if all(v is not None for _,v in voices) else 'reading-timing',
          'music':'Original deterministic synthesized bossa/music-box; no external recordings',
          'seed':1621}
metadata['musicSource'] = music_source
if music_source['mode'] != 'synthesized': metadata['music'] = music_source['mode']
(OUT/'audio-status.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2))
print(json.dumps(metadata,ensure_ascii=False,indent=2))
