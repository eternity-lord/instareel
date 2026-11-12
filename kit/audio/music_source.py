"""Optional local music-bed replacement shared by every production audio path.
No remote downloads. Selection order matches kit v3: mp3, wav, m4a.
"""
import hashlib
import math
import os
from pathlib import Path
import shutil
import subprocess

import numpy as np


def music_bed(root, synthesized, sample_rate):
    """Return (bed, provenance). Never modifies the supplied synthesized array.

    Music disabled -> silence; no file -> exact original array; supplied file ->
    loop/trim to sample count, normalize peak to brand volume and fade the tail.
    Voice and SFX are separate and must be mixed *after* this function.
    """
    import json
    root = Path(root)
    config = json.loads((root / 'brand.json').read_text())['music']
    if not config.get('enabled', True):
        return np.zeros_like(synthesized), {'mode': 'disabled'}
    selected = next((root / 'audio' / ('music.' + ext)
                     for ext in ('mp3', 'wav', 'm4a')
                     if (root / 'audio' / ('music.' + ext)).is_file()), None)
    if selected is None:
        return synthesized, {'mode': 'synthesized'}
    count = len(synthesized)
    if synthesized.ndim != 2 or synthesized.shape[1] != 2:
        raise ValueError('Music bed must be N x 2 stereo')
    if not 0 < sample_rate <= 192000 or not 0 < count <= sample_rate * 600:
        raise ValueError('Music replacement requires a positive duration <= 600 seconds')
    volume = float(config.get('volume', .16))
    if not math.isfinite(volume) or not 0 <= volume <= 1:
        raise ValueError('music.volume must be a finite peak gain between 0 and 1')
    ffmpeg = os.getenv('FFMPEG_PATH') or shutil.which('ffmpeg')
    if not ffmpeg:
        import imageio_ffmpeg
        ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    command = [ffmpeg, '-nostdin', '-v', 'error', '-protocol_whitelist', 'file,pipe',
               '-stream_loop', '-1', '-i', str(selected), '-vn', '-sn', '-dn',
               '-t', str(count / sample_rate), '-f', 'f32le', '-ac', '2',
               '-ar', str(sample_rate), 'pipe:1']
    try:
        result = subprocess.run(command, capture_output=True, check=True, timeout=60)
    except subprocess.CalledProcessError as exc:
        raise RuntimeError(f'Cannot decode {selected.name}: '
                           f'{exc.stderr.decode(errors="replace")[-1200:]}') from exc
    samples = np.frombuffer(result.stdout, dtype='<f4')
    if not len(samples) or len(samples) % 2 or not np.isfinite(samples).all():
        raise ValueError(f'Invalid audio samples in {selected.name}')
    decoded = samples.reshape(-1, 2)
    # FFmpeg can round the final sample differently for compressed formats.
    bed = np.zeros(synthesized.shape, dtype=synthesized.dtype)
    length = min(count, len(decoded))
    bed[:length] = decoded[:length]
    peak = float(np.max(np.abs(bed)))
    if peak:
        bed *= volume / peak
    fade = min(count, round(1.5 * sample_rate))
    bed[-fade:] *= np.linspace(1, 0, fade)[:, None]
    return bed, {
        'mode': 'external-local', 'file': str(selected.relative_to(root)),
        'sha256': hashlib.sha256(selected.read_bytes()).hexdigest(),
        'loopedTrimmedSeconds': count / sample_rate,
        'sampleRate': sample_rate, 'channels': 2, 'peakGain': volume,
        'fadeOutSeconds': fade / sample_rate,
        'licensing': 'User-supplied track; check commercial-use rights before publishing.',
    }
