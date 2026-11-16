"""Scenario 10: original locally synthesized acoustic-inspired score, no vocals/TTS.
96 BPM, playful -> tender -> uplifting. Not an external AI-generated music recording.
"""
import json
import math
from pathlib import Path
import subprocess
import wave

import imageio_ffmpeg
import numpy as np
from music_source import music_bed

ROOT = Path(__file__).resolve().parents[1]
SC = json.loads((ROOT / 'input/scenario.json').read_text())
BR = json.loads((ROOT / 'brand.json').read_text())
OUT = ROOT / 'out/10'
OUT.mkdir(parents=True, exist_ok=True)
SR, BPM = 48000, BR['music']['bpm']
assert SC['renderer'] == 'ink' and BPM == 96 and not BR['voice']['enabled']
durations = SC['editDurations']
timing, starts, at = {}, {}, 0
for scene, duration in zip(SC['scenes'], durations, strict=True):
    hold = scene.get('hold', SC.get('hold', .7))
    begin = .05 if scene['id'] == 'hook' else .1
    tokens = scene['text'].split()
    weights = [max(2, len(word.replace('‌', ''))) for word in tokens]
    step = (duration - hold - begin) / sum(weights)
    assert step > 0
    words, cursor = [], begin
    for word, weight in zip(tokens, weights):
        end = cursor + weight * step
        words.append(dict(w=word, t0=round(cursor, 6), t1=round(end, 6)))
        cursor = end
    timing[scene['id']] = dict(dur=duration, words=words, hold=hold)
    starts[scene['id']] = round(at, 6)
    at += duration
TOTAL = round(at + SC['endCardSeconds'], 6)
assert TOTAL == 44
N = round(TOTAL * SR)
mix = np.zeros((N, 2), np.float64)
rng = np.random.default_rng(10096)
beat = 60 / BPM


def add(signal, when, gain=1, pan=0):
    start = round(when * SR)
    if start < 0 or start >= N:
        return
    signal = signal[:N-start]
    mix[start:start+len(signal), 0] += signal * gain * math.sqrt((1-pan)/2)
    mix[start:start+len(signal), 1] += signal * gain * math.sqrt((1+pan)/2)


def pluck(f, duration=.8, soft=False):
    t = np.arange(round(duration * SR)) / SR
    tone = sum(np.sin(2*np.pi*f*k*t + .03*k) / k**(2 if soft else 1.65)
               * np.exp(-t*(2.8+k*.65)) for k in range(1, 6))
    return tone * np.minimum(1, t/.008) * np.minimum(1, (duration-t)/.06)


chords = [[130.81, 164.81, 196, 261.63], [110, 130.81, 164.81, 220],
          [87.31, 130.81, 174.61, 220], [98, 123.47, 146.83, 196]]
# Acoustic-inspired plucked chords and brushed noise, not sampled instruments.
for b in range(math.ceil(TOTAL / (4*beat))):
    when = b*4*beat
    chord = chords[b % 4]
    tender = starts['hush'] <= when < starts['payoff']
    uplifting = when >= starts['payoff']
    if tender:
        d = 3.6
        tt = np.arange(round(d*SR))/SR
        env = np.sin(np.pi*tt/d)**1.5
        for j, f in enumerate(chord[:3]):
            add(np.sin(2*np.pi*f*tt)*env, when, .035, (j-1)*.35)
        for j in range(2):
            add(pluck(chord[j*2]*2, 2.5, True), when+j*2*beat, .13, -.12+j*.24)
    else:
        for j in range(8):
            strike = when+j*.5*beat
            # Up/down offbeat strum; tiny offsets keep attacks rounded.
            for k, f in enumerate(chord[1:]):
                add(pluck(f*2), strike+k*.014, .031 if j % 2 else .047, (k-1)*.3)
            add(pluck(chord[0], .65, True), strike, .085 if j%2==0 else .025, -.05)
        for j in range(4):
            d = .14
            tt = np.arange(round(d*SR))/SR
            brush = np.convolve(rng.standard_normal(len(tt)), np.ones(15)/15, 'same')
            brush *= np.sin(np.pi*tt/d)*np.exp(-tt*9)
            add(brush, when+j*beat, .055, .15)
        motif = [2, 1, 3, 2] if uplifting else [0, 2, 1, 3]
        for j, index in enumerate(motif):
            add(pluck(chord[index]*4, 1.1, True), when+j*beat+.04, .07, -.3+j*.18)
# A soft resolution rather than an abrupt music stop.
for j, f in enumerate([130.81, 196, 261.63, 329.63]):
    add(pluck(f, 3, True), TOTAL-2.1+j*.04, .08, (j-1.5)*.15)
mix, source = music_bed(ROOT, mix, SR)
for scene in SC['scenes']:
    for cue in scene.get('sfx', []):
        when = starts[scene['id']] + cue['t']
        kind = cue['k']
        emotional = scene['id'] in ('hush', 'turn', 'friend', 'payoff')
        gain = .026 if emotional else .043
        d = .3 if kind == 'whoosh' else .5 if kind == 'chime' else .12
        tt = np.arange(round(d*SR))/SR
        if kind == 'whoosh':
            signal = np.convolve(rng.standard_normal(len(tt)), np.ones(29)/29, 'same')
            signal *= np.sin(np.pi*tt/d)
        else:
            freq = dict(pop=520, tick=1460, chime=1046.5, error=185)[kind]
            signal = np.sin(2*np.pi*freq*tt) * np.exp(-tt*(8 if kind=='chime' else 27))
            signal *= np.minimum(1, tt/.005)
        add(signal, when, gain, math.sin(when)*.25)
    if scene['id'] not in ('turn', 'friend', 'payoff'):
        # Quiet pen/paper textures on motivated entrances, not a constant scratch loop.
        d = .19
        tt = np.arange(round(d*SR))/SR
        scratch = np.convolve(rng.standard_normal(len(tt)), np.ones(5)/5, 'same')
        scratch *= np.sin(np.pi*tt/d)*(.55+.45*np.sin(tt*180)**2)
        add(scratch, starts[scene['id']]+.12, .017)
mix[:round(.025*SR)] *= np.linspace(0, 1, round(.025*SR))[:, None]
mix[-round(.55*SR):] *= np.linspace(1, 0, round(.55*SR))[:, None]
mix *= min(1, .85/max(1e-9, float(abs(mix).max())))
raw = OUT / 'unmastered.wav'
with wave.open(str(raw), 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix*32767).astype('<i2').tobytes())
result = subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), '-hide_banner', '-y', '-i', str(raw),
                         '-af', 'loudnorm=I=-19:TP=-3:LRA=9:print_format=json',
                         '-ar', str(SR), '-c:a', 'pcm_s16le', str(OUT/'mix.wav')],
                        capture_output=True, text=True, check=True)
raw.unlink()
loudness, _ = json.JSONDecoder().raw_decode(result.stderr[result.stderr.rfind('{'):])
status = dict(duration=TOTAL, sampleRate=SR, bpm=BPM, voiceUsed=False,
              voiceReason='Standing no-narration preference. No TTS/voice files opened.',
              sfxUsed=True, musicSource=source,
              music='Original local acoustic-inspired synthesis: plucked strings, soft piano-like tones, brush noise and warm pads. No external recording/provider.',
              sections=dict(playful=[0, starts['hush']], tender=[starts['hush'], starts['payoff']],
                            uplifting=[starts['payoff'], TOTAL]),
              timingMode='Reading-timed Persian captions, not speech alignment; per-scene holds honored',
              loudness=loudness, mastering='-19 LUFS, -3 dBTP, LRA 9',
              audioLoop='Deliberate short fade, not claimed seamless')
(OUT/'timing.json').write_text(json.dumps(timing, ensure_ascii=False, indent=2)+'\n')
(OUT/'audio-status.json').write_text(json.dumps(status, indent=2)+'\n')
print(json.dumps(status, indent=2))
