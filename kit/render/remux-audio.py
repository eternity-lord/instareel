"""Replace reel 05 audio without re-encoding or changing a single video packet.
Run audio/make_audio.py first. Optional first argument: an original MP4 path.
"""
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import imageio_ffmpeg
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'out/05';OUT.mkdir(parents=True,exist_ok=True)
source=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else ROOT/'deliverables/nail-reel-05.mp4'
target=OUT/'nail-reel-05.mp4'
assert source.resolve()!=target.resolve()
FF=imageio_ffmpeg.get_ffmpeg_exe()
status=json.loads((OUT/'audio-status.json').read_text());assert status['voiceUsed'] is False
subprocess.run([FF,'-hide_banner','-loglevel','error','-y','-i',str(source),'-i',str(OUT/'mix.wav'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-t',str(status['duration']),'-movflags','+faststart',str(target)],check=True)
def streamhash(p):
 return subprocess.check_output([FF,'-v','error','-i',str(p),'-map','0:v:0','-c:v','copy','-f','hash','-hash','sha256','-'],text=True).strip()
a,b=streamhash(source),streamhash(target);assert a==b
manifest=json.loads((ROOT/'docs/evidence-05/render-manifest.json').read_text());manifest.update(bytes=target.stat().st_size,revision='Music only; original encoded H.264 stream copied without re-encoding')
(OUT/'render-manifest.json').write_text(json.dumps(manifest,indent=2))
report=dict(passed=True,voiceRemoved=True,musicOnly=True,videoReencoded=False,originalVideoStreamHash=a,revisedVideoStreamHash=b,captionTimingUnchanged=True,originalMp4Sha256=hashlib.sha256(source.read_bytes()).hexdigest(),revisedMp4Sha256=hashlib.sha256(target.read_bytes()).hexdigest())
(OUT/'revision-qa.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
