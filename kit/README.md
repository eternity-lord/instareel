> **کیت جدید (v3) فعال است.** منبع: `nail-reel-kit (2).zip` از commit `73ae644cf861954c6c20d75d41aea51c56592424`؛ نسخهٔ خام کامل در `reference/kit-v3/` و جزئیات در [گزارش ادغام](docs/kit-v3-update.md). ZIP بعد از استخراج و بررسی حذف شده است.
>
> **اولویت‌های این پروژه:** فعلاً سناریوی مستقل ۰۸ (`renderer=quiz`) و خروجی‌های قبلی محفوظ‌اند؛ نمونهٔ سناریوی ۰۱ داخل ZIP جایگزین ورودی فعلی نشده است. درخواست قبلی مالک همچنان برقرار است: **بدون گوینده، موسیقی ملایم** (`voice.enabled=false`، BPM فعلی 84). پرامپت صدا مجوز فعال‌کردن نریشن نیست. عنوان اضافه بالای زیرنویس هم نباید برگردد. راهنمای اجرای فعلی: [reel-08-guide.md](docs/reel-08-guide.md).
>
> **موسیقی محلی:** [music-prompts.md](music-prompts.md) جدید است. با قرار دادن `audio/music.mp3` یا `.wav` یا `.m4a`، ترک محلی در تمام مسیرهای صوتی جایگزین *موسیقی زمینه* می‌شود، نه صدا/افکت. اولویت mp3 سپس wav سپس m4a؛ loop/trim، stereo 48kHz، gain از `brand.music.volume` و fade-out تا 1.5s، سپس مستر و ducking همان مسیر. فایل خراب خطای صریح می‌دهد؛ نبود فایل دقیقاً fallback قبلی را نگه می‌دارد. هیچ سرویس موسیقی به‌صورت خودکار فراخوانی نمی‌شود؛ مجوز تجاری و بی‌کلام‌بودن ترک انتخابی را بررسی کنید.
>
> **تطبیق قرارداد عمومی زیر با موتور تولید موجود:** خروجی‌ها برای هر ریل مستقل در `out/<reelId>/` و `deliverables/` هستند، نه بازنویسی ریل ۰۱. نصب: `npm ci --prefix kit/render` و venv مطابق راهنمای ریل؛ سپس `.venv/bin/python kit/audio/make_audio.py` و `node kit/render/...`. `run.sh` و lockfile سخت‌گیرانهٔ موجود حفظ شده‌اند. هایلایت بدون گوینده «زمان خواندن» است، نه هم‌ترازی گفتار. متنِ `style` در سناریو بر راهنمای عمومی کارتونی اولویت دارد. قواعد احتیاطی/accuracy در سناریو و اصلاح قبلیِ حذف وعدهٔ مدت ثابت ماندگاری بر پرامپت‌های نمونه اولویت دارند.

# nail-reel-kit — studio brief for the coding agent

The owner gives you **scenes** (`input/scenario.json`) and **reference video/images** (`input/refs/`). **Everything else is yours**: story expansion, characters, illustration, animation, sound, rendering. Do not ask questions; decide, build, verify, and report. Target: the most professional result you can produce. The reel is for **@ayda.nailroom** (Instagram) and must be able to earn views.

## Inputs
- `input/scenario.json`: only `text` per scene is required. `idea`, `mood`, `sfx`, `words`, `dur`, `cast` are hints; invent whatever is missing. Format notes: `input/README.txt`.
- `input/refs/*`: study first (`ffmpeg -i ref.mp4 -vf fps=1,scale=360:-1 refs_%02d.jpg`). Extract and match the **style system**: background treatment, palette, round-blob proportions, flat-shaded character construction, face construction, line/shape weight, caption position and the yellow word-highlight, pacing, composition. **Do not trace or reuse the reference's actual characters, logos or marks**: create an original cast in the same family (the owner wants this look, at a much higher production quality).
- `input/post_copy.md`, `brand.json`: handle, palette, fonts, safe zones, voice/music switches.

- **Style override**: if `scenario.json` has a `style` field, it OVERRIDES the cartoon/blob guidance above (and the cartoon look of `input/refs`). Follow `style` exactly (e.g. photoreal-leaning 3D macro, no mascots). SFX kinds available: pop, whoosh, chime, tick, error, drip, swish, click, shimmer.

## Style override
If `input/scenario.json` has a `style` block, it **overrides** every cartoon/blob/character direction in this README (cast, plush shading, mascots). Follow `style.look/tools/typography/motion/audio` and `accuracy` exactly. Quality bar, pipeline gates, engine contract, karaoke subtitles, safe zones, handle and render rules still apply.

## Hard constraints
- Output `out/nail-reel-01.mp4` (1080x1920, 30 fps, H.264 High, yuv420p, AAC 48 kHz, faststart), plus `out/cover.png`, `out/style-frame.png`, `out/character-sheet.png`, `out/contact-sheet.png`, `out/REPORT.md`.
- **Faceless page**: no real human face or real person's voice. Cartoon characters are fine. Voice, if any, is synthetic (see Audio).
- Handle **@ayda.nailroom**: small watermark on every scene + end-card (last 3 s). Nothing important in the top 250 px / bottom 380 px of the 1920 frame.
- Persian RTL, local Vazirmatn font, keep ZWNJ. **No emoji glyphs** (draw icons). No downloaded copyrighted music/images.
- `brand.json.frame`: `"none"` = full-bleed (default); `"chalkboard"` = wood frame + chalk board house style around the art.

## Pipeline (gates in order; verify with your own eyes via screenshots)
1. **Storyboard**: expand each scene into `out/storyboard.md` (shot, camera, characters, props, motion beats, transition, sound). Keep total length 25-45 s unless the scenario demands more: speed up word timing and trim holds if needed (retention matters).
2. **Style frame** of the strongest scene at full quality -> `out/style-frame.png`. If it looks flat, clip-art or template-like, iterate. Gate: do not continue until it would pass as a studio-made reel.
3. **Cast**: original round-blob characters (see below) -> `out/character-sheet.png` (front, 3/4, 8 expressions, 6 poses).
4. **Scenes**: build with the toolchain you judge best (layered SVG + GSAP, PixiJS, Three.js, Lottie/Rive...). **Hard rule: pure function of time**. Everything must be driven by `window.__seek(t)` (GSAP paused timelines, manual physics from `t`); no CSS animations, no real-time timers, seeded randomness only. WebGL works in headless Chromium via SwiftShader (already enabled).
5. **Audio** (`audio/make_audio.py`) -> `out/timing.json` + `audio/mix.wav`. Improve it as you see fit.
6. **Render** `render/run.sh` (test with `--test` first). Inspect contact sheet and individual frames, fix, re-render. Run the QA list.

## Visual quality bar (professional illustration)
- Characters: soft plush-like shading (base + core shadow + rim light + soft AO/contact shadow), big glossy eyes with specular highlights, expressive brows/lids, mouth visemes, tiny limbs with rounded ends, small signature accessory each. Original designs per `cast` (e.g. hero "Nailie": pink blob, nail-brush antenna with gel-drop tip). Glossy almond nails with animated specular sweeps/sparkles appear in close-ups as the hero product.
- Worlds: 3 depth layers + parallax, gradient lighting with scene-specific mood (window light, phone glow, mirror bloom), bokeh/dust particles, soft vignette, subtle film grain, depth-of-field on far layers. Props are polished vector/3D objects with highlights and shadows, never flat clip-art.
- Motion: anticipation -> action -> overshoot -> settle; squash & stretch; overlap/follow-through on antenna/limbs; eased curves only; camera moves in every scene; motivated transitions (match cut, object wipe, iris); every scene has a distinct entrance and at least 3 independently moving elements. No static frame > 0.5 s.
- Typography: captions top-center, 34px at 540-wide design space, white with soft shadow; **karaoke**: the word being spoken gets a yellow (#f5b73b) background pill with a tiny scale pop, moving word by word in sync with the audio.

## Audio
- Run `python3 audio/make_audio.py` (`pip install edge-tts numpy`). With network + edge-tts it makes a **synthetic Persian voice** (`brand.json.voice`) and uses its word boundaries for the karaoke timing; scene durations follow the voice. Without TTS it falls back to music + SFX and `wordDuration` timing. If you can do better (better voice, forced alignment with Whisper, richer music/SFX, ducking) do it, but keep the output contract: `out/timing.json` = `{sceneId:{words:[{w,t0,t1}],dur}}` and `audio/mix.wav`.
- Mix: voice clear, music bed ~ -18 dB ducked under voice, SFX per `sfx` hints and your own judgment. Say in `out/REPORT.md` which voice/music path was used.

## Making it earn views (apply, do not just list)
Hook in the first 1.0-1.5 s (motion + the most relatable line first); a visual pattern-interrupt every ~2-3 s; relatable moment people tag friends in; last frame flows back to the first (loop); cover frame readable at thumbnail size; end-card CTA "فالو کن" + handle; keep under ~45 s; `input/post_copy.md` caption with keywords. State honestly in the report that views cannot be guaranteed.

## Engine contract (`src/index.html`)
`window.__ready` (Promise), `window.__duration` (s), `window.__seek(t)` (sync, idempotent). `registerScene(id,{mount(el,scene),update(el,p,t)})` in `src/scenes/*.js` (add script tags), optional `registerScene('__endcard')`. Reads `/input/scenario.json`, `/brand.json`, optional `/out/timing.json`. Design space 540x960 CSS px, rendered x2.

## Render
```
cd render && npm i && npx playwright install chromium --with-deps   # once
./run.sh --test     # 3 s smoke test
./run.sh            # full render (also runs the audio step)
```

## QA checklist (all must pass)
- [ ] Persian shaping/RTL correct, readable on a phone, no clipped text.
- [ ] Karaoke pill follows the audio within ~0.15 s.
- [ ] Safe zones respected; watermark + end-card present; no emoji; no placeholders.
- [ ] Style/characters consistent across all scenes; style-frame quality held everywhere.
- [ ] Audio in sync, no clipping; MP4 plays, 1080x1920, < 100 MB.
- [ ] `out/REPORT.md` lists what was built, known flaws, how to edit text/timing.

## Active edition: scenario 08 research-informed recut

The current input is `08-recut` (29s, no voice, gentle instrumental), made after the research and playbook were saved.
- [Research and evidence limits](docs/research/reel-attention-research.md)
- [Reusable editing playbook](docs/EDITING-PLAYBOOK.md)
- [Build report](docs/REPORT-08-recut.md) / [publication and measurement guide](docs/reel-08-recut-guide.md)
- New MP4: `deliverables/nail-reel-08-recut.mp4`; original `nail-reel-08.mp4` remains byte-identical.
- Original executable quiz renderer and audio module are preserved. Active edition uses `quiz-recut.js` / `quiz_recut_audio.py`.
- Original attachment: `input/scenarios/scenario-08.json`; original active snapshot: `scenario-08-active.json`; recut snapshot: `scenario-08-recut-active.json`.
- Preview defaults to recut; previous preview preserved at `preview-08-original.html`.
- Edition-specific test: `node kit/render/quiz-recut-test.mjs` from repository root. `quiz-test.mjs` is for the original edition, not this input.

No platform publication or audience Insights were accessed; Explore distribution is not guaranteed.
