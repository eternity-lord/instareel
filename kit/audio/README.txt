Optional licensed, instrumental music: audio/music.mp3, music.wav or music.m4a.
Priority: mp3 > wav > m4a. music_source.py replaces only the instrumental bed,
loops/trims to video duration, resamples to stereo 48 kHz, applies brand.music.volume
as peak gain, and fades the last up-to-1.5 seconds. Each pipeline then applies its
normal SFX/voice mix, ducking (if any) and mastering. Provenance is recorded in
out/<reelId>/audio-status.json (out/audio-status.json for the original reel).

No file -> exact existing synthesized fallback. music.enabled=false -> no bed.
An invalid supplied file is an error, not a silent fallback. No remote music is
fetched. Check commercial-use rights and that the selected file has no vocals;
the importer does not perform rights checks or remove singing from a track.

Current owner preference: gentle instrumental, voice.enabled=false. New kit voice
prompts are references, not permission to activate narration. Existing final MP4s
are never changed just by adding a track; render/export explicitly to publish a
new edition. audio/mix.wav and out/<reelId>/mix.wav are generated outputs and will
be overwritten by audio generation; do not use them as a source-music location.

Style/BPM prompts: ../music-prompts.md. Local tests from repository root:
.venv/bin/python kit/audio/test_music_source.py
