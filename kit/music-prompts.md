> **Production integration:** these are optional style/BPM prompts, not supplied music recordings. The current approved audio is gentle, instrumental and narration-free at 84 BPM; do not automatically replace existing reels or their tempo. For a newly approved track, set the matching BPM and place the licensed local file at `audio/music.mp3`, `.wav` or `.m4a`. All production audio paths support this via `audio/music_source.py`, with provenance in `audio-status.json`. No provider or subscription is required for the synthesized fallback.

# Music prompts (Suno / Udio / any AI music site)
Rules for all: **instrumental, no vocals**, no artist names (copyright), 30-45 s, make 3 takes and pick the best.
How to use: save the best take as `audio/music.mp3` in the kit (it replaces the synthetic music automatically, looped/trimmed/faded to the video length). Keep `brand.json` -> `music.bpm` equal to the BPM below. Before commercial use, check the site's plan terms (free plans are often non-commercial).

## MASTER — relatable cartoon series (scenarios 01, 07, 08, 09)
```
Instrumental, no vocals. Playful quirky cartoon-comedy groove, 100 BPM, major key. Bouncy upright-style bass, pizzicato strings, light finger snaps and handclaps, marimba and glockenspiel sparkles, tight punchy drums, cute whistling hook. Catchy 4-note motif from the first second, no slow intro. Short playful stingers on every 4th beat, energy rises in the middle, ends with a quick cheerful button. Clean modern mix, 40 seconds.
```
Structure hints (if the site accepts them): [0-2s instant hook motif] [2-28s steady groove with stingers] [28-36s warm resolve, gentle sparkles] [button end]

## 02 / 03 — movie-trailer parody
```
Instrumental, no vocals. Epic cinematic trailer parody with a wink: low brass stings, taiko hits, ominous risers and big impacts, strings ostinato, 90 BPM, dramatic but slightly comedic. Silence-then-hit moments, builds to a heroic swell with choir-like pads, finishes on a huge hit. 40 seconds.
```

## 04 — warm underdog / glow-up
```
Instrumental, no vocals. Warm cinematic piano and soft strings, gentle glockenspiel, starts tender and a bit sad, then builds to an uplifting glow-up groove with claps and light percussion at 100 BPM, hopeful and heartwarming, final sparkle resolve. 40 seconds.
```

## 05 — cartoon educational
```
Instrumental, no vocals. Curious upbeat tech-pop, plucky synth and clicks, light bass, tiny sparkly hits, 105 BPM, clean and modern, a playful "aha!" lift in the last bars. 35 seconds.
```

## 06 — noir mystery (cartoon)
```
Instrumental, no vocals. Smoky film-noir jazz, upright bass, brushed drums, muted trumpet, vibraphone, soft rain ambience, 92 BPM, sly and playful rather than scary. A suspenseful pause, then a dramatic sting for the reveal, ends with a cheeky sax button. 40 seconds.
```

## Quiz / "which type are you" (08, 09 alternative)
```
Instrumental, no vocals. Bouncy game-show pop, whistling melody, claps, bright piano stabs, 108 BPM, fun and fast, quick "ding" stingers for each reveal, tiny drum-roll before the last reveal, happy ending button. 35 seconds.
```
