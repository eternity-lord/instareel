#!/usr/bin/env python3
"""Fully decode MP4 and validate format without requiring a separate ffprobe binary."""
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import struct
import subprocess
import imageio_ffmpeg

ROOT = Path(__file__).resolve().parents[1]
scenario = json.loads((ROOT/'input/scenario.json').read_text())
reel_id = scenario.get('reelId', '01')
assert re.fullmatch(r'\d{2}', reel_id)
OUT = ROOT/'out'/('' if reel_id == '01' else reel_id)
video = OUT/f'nail-reel-{reel_id}.mp4'
ffmpeg = os.getenv('FFMPEG_PATH') or shutil.which('ffmpeg') or imageio_ffmpeg.get_ffmpeg_exe()
result = subprocess.run([ffmpeg, '-hide_banner', '-nostats', '-err_detect', 'explode',
                         '-threads', '2', '-i', str(video), '-map', '0:v:0', '-map', '0:a:0',
                         '-af', 'volumedetect', '-progress', 'pipe:1', '-f', 'null', '-'],
                        capture_output=True, text=True, check=True)
log = result.stderr
assert 'Video: h264 (High)' in log, log
assert '1080x1920' in log and 'yuv420p' in log and '30 fps' in log, log
assert re.search(r'Audio: aac .*48000 Hz, stereo', log), log
frames = int(re.findall(r'^frame=(\d+)', result.stdout, re.M)[-1])
manifest = json.loads((OUT / 'render-manifest.json').read_text())
assert frames == manifest['frames'] == round(manifest['duration']*30), frames
assert (32 if scenario.get('renderer')=='sequel' else 28) <= manifest['duration'] <= (40 if scenario.get('renderer')=='sequel' else 38)
assert video.stat().st_size < 100_000_000
peak = float(re.search(r'max_volume: ([\-\d.]+) dB', log).group(1))
mean = float(re.search(r'mean_volume: ([\-\d.]+) dB', log).group(1))
assert peak < -1, peak
# Inspect top-level MP4 atoms to ensure moov precedes mdat (faststart).
atoms = []
with video.open('rb') as f:
    while f.tell() < video.stat().st_size:
        start = f.tell()
        raw = f.read(8)
        if len(raw) < 8:
            break
        size, kind = struct.unpack('>I4s', raw)
        if size == 1:
            size = struct.unpack('>Q', f.read(8))[0]
        if size == 0:
            size = video.stat().st_size - start
        assert size >= 8
        atoms.append(kind.decode('ascii'))
        f.seek(start + size)
assert atoms.index('moov') < atoms.index('mdat'), atoms
status = {'passed': True, 'decodedFrames': frames, 'duration': manifest['duration'],
          'width': 1080, 'height': 1920, 'fps': 30, 'codec': 'H.264 High',
          'pixelFormat': 'yuv420p', 'audio': 'AAC stereo / 48000 Hz',
          'aacPeakDbFS': peak, 'aacMeanDbFS': mean, 'faststart': True,
          'bytes': video.stat().st_size, 'sha256': hashlib.sha256(video.read_bytes()).hexdigest()}
(OUT / 'video-qa.json').write_text(json.dumps(status, indent=2))
(OUT / 'decode-log.txt').write_text(log)
print(json.dumps(status, indent=2))
