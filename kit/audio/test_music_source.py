"""Offline tests for the v3 local music import; all fixtures live in temp dirs."""
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
import wave

import imageio_ffmpeg
import numpy as np
from music_source import music_bed

REPO_KIT = Path(__file__).resolve().parents[1]


class MusicSourceTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        (self.root/'audio').mkdir()
        self.configure()
        self.original = np.full((48000, 2), .03, dtype=np.float64)

    def tearDown(self):
        self.tmp.cleanup()

    def configure(self, enabled=True, volume=.16):
        (self.root/'brand.json').write_text(json.dumps({'music': {'enabled': enabled, 'volume': volume}}))

    def fixture(self, duration=.1):
        sr = 24000
        t = np.arange(round(duration * sr)) / sr
        audio = (np.sin(2*np.pi*440*t)*.25*32767).astype('<i2')
        target = self.root/'audio/music.wav'
        with wave.open(str(target), 'wb') as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
            w.writeframes(audio.tobytes())
        return target

    def test_no_file_exact_fallback(self):
        bed, info = music_bed(self.root, self.original, 48000)
        self.assertIs(bed, self.original)
        self.assertEqual(info, {'mode': 'synthesized'})

    def test_disabled_does_not_decode_broken_file(self):
        (self.root/'audio/music.mp3').write_bytes(b'not audio')
        self.configure(enabled=False)
        bed, info = music_bed(self.root, self.original, 48000)
        self.assertFalse(bed.any())
        self.assertEqual(info, {'mode': 'disabled'})

    def test_mono_loop_resample_stereo_fade_no_mutation(self):
        target = self.fixture()
        bed, info = music_bed(self.root, self.original, 48000)
        self.assertEqual(bed.shape, self.original.shape)
        np.testing.assert_array_equal(self.original, np.full((48000, 2), .03))
        np.testing.assert_array_equal(bed[:, 0], bed[:, 1])
        self.assertGreater(np.abs(bed[24000:30000]).max(), .01)
        self.assertLessEqual(np.abs(bed).max(), .16)
        self.assertTrue(np.isfinite(bed).all())
        np.testing.assert_array_equal(bed[-1], [0, 0])
        self.assertEqual(info['sha256'], hashlib.sha256(target.read_bytes()).hexdigest())
        self.assertEqual(info['mode'], 'external-local')
        self.assertEqual(info['loopedTrimmedSeconds'], 1)

    def test_long_track_trim(self):
        self.fixture(2)
        bed, _ = music_bed(self.root, self.original, 48000)
        self.assertEqual(len(bed), 48000)

    def test_compressed_formats_and_precedence(self):
        source = self.fixture()
        ff = imageio_ffmpeg.get_ffmpeg_exe()
        for extension in ['m4a', 'mp3']:
            target = source.with_suffix('.'+extension)
            subprocess.run([ff, '-v', 'error', '-y', '-i', str(source), str(target)], check=True)
        bed, info = music_bed(self.root, self.original, 48000)
        self.assertEqual(info['file'], 'audio/music.mp3')
        self.assertGreater(np.abs(bed).max(), .01)
        source.with_suffix('.mp3').unlink()
        _, info = music_bed(self.root, self.original, 48000)
        self.assertEqual(info['file'], 'audio/music.wav')
        source.unlink()
        bed, info = music_bed(self.root, self.original, 48000)
        self.assertEqual(info['file'], 'audio/music.m4a')
        self.assertGreater(np.abs(bed).max(), .01)

    def test_silent_track(self):
        source = self.fixture()
        with wave.open(str(source), 'wb') as w:
            w.setnchannels(2); w.setsampwidth(2); w.setframerate(48000)
            w.writeframes(bytes(4800 * 4))
        bed, _ = music_bed(self.root, self.original, 48000)
        self.assertFalse(bed.any())
        self.assertTrue(np.isfinite(bed).all())

    def test_invalid_volume_fails(self):
        self.fixture()
        for volume in [-1, 2, float('nan')]:
            self.configure(volume=volume)
            with self.assertRaises(ValueError):
                music_bed(self.root, self.original, 48000)

    def test_broken_file_fails_loudly(self):
        (self.root/'audio/music.wav').write_bytes(b'not audio')
        with self.assertRaises(RuntimeError):
            music_bed(self.root, self.original, 48000)

    def test_quiz_pipeline_external_track_no_voice(self):
        self.fixture()
        (self.root/'input').mkdir()
        shutil.copyfile(REPO_KIT/'input/scenarios/scenario-08-active.json', self.root/'input/scenario.json')
        for name in ['quiz_audio.py', 'music_source.py']:
            shutil.copyfile(REPO_KIT/'audio'/name, self.root/'audio'/name)
        subprocess.run([sys.executable, str(self.root/'audio/quiz_audio.py')], check=True,
                       capture_output=True, text=True, timeout=60)
        status = json.loads((self.root/'out/08/audio-status.json').read_text())
        self.assertEqual(status['musicSource']['mode'], 'external-local')
        self.assertFalse(status['voiceUsed'])
        self.assertTrue(status['sfxUsed'])
        self.assertEqual(status['duration'], 32)
        with wave.open(str(self.root/'out/08/mix.wav')) as w:
            self.assertEqual(w.getnframes(), 32*48000)
            self.assertEqual(w.getnchannels(), 2)


if __name__ == '__main__':
    unittest.main(verbosity=2)
