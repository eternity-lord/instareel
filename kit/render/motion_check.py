#!/usr/bin/env python3
"""Kit v4 motion diagnostic; numerical targets are editing heuristics, not reach predictions.

Run from any directory: python kit/render/motion_check.py video.mp4 --strict
Use --allow-static START:END for a documented utility card/endcard exception.
No automatic modification of existing videos. The archived upstream script is preserved.
"""
import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
FPS, W, H = 10, 108, 192


def analyse(frames, allowed=()):
    if len(frames) < 11:
        raise ValueError('At least 1.1 seconds of video required')
    d = np.abs(np.diff(frames.astype(np.float32), axis=0)).mean(axis=(1, 2))
    low = []
    for i in range(len(d) - FPS + 1):
        start, end = i / FPS, (i + FPS) / FPS
        if any(start >= a and end <= b for a, b in allowed):
            continue
        if d[i:i + FPS].mean() < 1:
            low.append((start, end))
    windows = []
    for start, end in low:
        if windows and start <= windows[-1][1]:
            windows[-1][1] = end
        else:
            windows.append([start, end])
    mean = float(d.mean())
    jumps = [round((i + 1) / FPS, 2) for i, x in enumerate(d) if x > 14]
    return {'meanMotionEnergy': mean, 'jumpSamples': jumps,
            'staticWindowsOutsideExceptions': windows, 'allowedStaticWindows': list(allowed),
            'passed': mean >= 3 and not windows,
            'limits': 'Pixel differences include captions, cuts and noise, not just character acting. '
                      'Jump samples are not distinct cuts. No Instagram performance prediction.'}


def interval(value):
    try:
        a, b = map(float, value.split(':'))
        if not np.isfinite([a, b]).all() or not 0 <= a < b:
            raise ValueError()
        return a, b
    except ValueError as exc:
        raise argparse.ArgumentTypeError('Expected finite START:END with 0 <= START < END') from exc


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('video', type=Path)
    parser.add_argument('--allow-static', type=interval, action='append', default=[])
    parser.add_argument('--strict', action='store_true', help='Exit 1 when creative targets fail')
    parser.add_argument('--report', type=Path, help='Default: out/<video-stem>-motion.json')
    args = parser.parse_args()
    ffmpeg = os.getenv('FFMPEG_PATH') or shutil.which('ffmpeg')
    if not ffmpeg:
        import imageio_ffmpeg
        ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    raw = subprocess.check_output([ffmpeg, '-v', 'error', '-nostdin', '-i', str(args.video.resolve()),
                                   '-an', '-vf', f'fps={FPS},scale={W}:{H},format=gray',
                                   '-f', 'rawvideo', '-threads', '1', '-'])
    frames = np.frombuffer(raw, dtype=np.uint8).reshape(-1, H, W)
    report = analyse(frames, args.allow_static)
    report.update(video=str(args.video), sampledDuration=len(frames) / FPS, samplingFps=FPS)
    target = args.report or ROOT / 'out' / (args.video.stem + '-motion.json')
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))
    return int(args.strict and not report['passed'])


if __name__ == '__main__':
    raise SystemExit(main())
