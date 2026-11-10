# Voice prompts for ElevenLabs (website) — scenario 01 and 02

## How to use
1. ElevenLabs -> **Voices -> Voice Design** (or pick a Persian-capable voice). Paste the voice prompt below, generate, keep the one you like.
2. **Text to Speech**, model **Eleven v3** (the only ElevenLabs model that lists Persian). Settings: stability **Creative/Natural**, speed default.
3. Generate **each scene separately** (copy only the line). Try 2-3 takes, pick the best. If it reads the bracket tag aloud, delete that tag.
4. Download as `<sceneId>.mp3` (ids are in each heading) and put into `audio/voice/`. `make_audio.py` picks them up automatically and syncs the yellow karaoke words to the audio.
5. Check each file: ideal length is roughly 2.5-4.5 s. Too long -> regenerate with a shorter delivery or ask for "faster".
- Synthetic voices only. Never clone a real person's voice (the page stays voiceless/faceless).
- Numbers are already written as words below, keep them that way.

---
## SCENARIO 01 — «۵ جمله‌ای که هر ناخن‌کار هر روز می‌شنوه»
**Voice design prompt (English):**
A young Persian-speaking woman, native Iranian (Tehran) accent, 20s to 30s. Bright, playful, quick-witted storyteller with great comedic timing, a smile in the voice, clear diction, medium-high energy, like a fun Instagram reel narrator. Natural, not robotic, no heavy effects.

**Lines:**
- `hook`: [excited] پنج جمله‌ای که هر ناخن‌کار هر روز می‌شنوه!
- `short`: میگه یه کم کوتاهش کن... [short pause] [sarcastic] یعنی سه سانت!
- `simple`: میگه طرح ساده می‌خوام... [short pause] [sarcastic] یعنی گل، نگین، فرنچ و خط طلایی!
- `hurry`: میگه عجله ندارم... [short pause] [sighs] ده دقیقه بعد: تموم نشد؟
- `photo`: میگه عین عکس بزن... [short pause] [laughs] عکسی که فیلتر خورده!
- `trust`: میگه هر چی خودت صلاح می‌دونی... [short pause] [panicked] نه نه! اون رنگ نه!
- `payoff`: [softly] ولی وقتی ناخن‌ها تموم می‌شه... [happy] وای عاشقشونم!
- `cta`: [playful] اینو برای ناخن‌کارت بفرست.

---
## SCENARIO 02 — «ناخن شماره ۷: ماموریت زنده‌ موندن»
**Voice design prompt (English):**
A deep, dramatic male voice, native Persian (Tehran) accent, cinematic movie-trailer narrator. Slow, resonant, gravelly gravitas with sudden playful irony, very clear Persian diction, big cinematic presence. Not a real person's clone.

**Lines:**
- `hook`: [dramatic, low voice] در دنیایی بی‌رحم... [long pause] ناخن‌ها شکننده‌ان.
- `door`: اینجا... [short pause] درِ ماشین منتظره.
- `can`: [whispers] اینجا... قوطی نوشابه کمین کرده.
- `thread`: و یه تار پشمی... [short pause] که هیچ‌کس ازش جون سالم به در نبرد.
- `hero`: [building, epic] تا اینکه... یه قهرمان از راه رسید!
- `combo`: [fast, energetic] سه لایه! یه لامپ! یه معجزه!
- `win`: [proud, slow] ناخن شماره‌ی هفت... [short pause] هنوز سرپاست.
- `cta`: [lighter, playful] تگ کن اونی رو که ناخناش همیشه می‌شکنه!

---
## SCENARIO 03 — «ناخن شماره ۸: انتقام استون» (same trailer voice as scenario 02, for continuity)
- `hook`: [dramatic, low voice] ناخن شماره‌ی هفت زنده موند... [short pause] ولی دشمن برگشته.
- `acetone`: [whispers, ominous] از اعماق یه شیشه‌ی کوچیک... [short pause] استون بیدار شد.
- `army`: [slow, menacing] پنبه‌های سفید... ارتش بی‌رحمش.
- `rookie`: [cool, upbeat] و ناخن شماره‌ی هشت... وارد شد!
- `chase`: [fast, energetic] سریع‌تر از سوهان... بدون ترمز!
- `melt`: [tense, worried] ولی استون... دست‌بردار نبود.
- `team`: [epic, building] تا اینکه شماره‌ی هفت و ژل رسیدن.
- `final`: [triumphant] یه تاپ‌کت... [short pause] و همه‌چی تموم شد!
- `twist`: [whispers, suspense] ولی صبر کن... [long pause] یکی داره از پا میاد.
- `cta`: [lighter, playful] تگ کن اونی رو که از استون می‌ترسه!

---
## SCENARIO 04 — «ناخن شماره ۹: از پا تا اوج»
**Voice design prompt (English):**
A warm, gentle Persian storyteller, native Iranian (Tehran) accent, 30s. Soft, cozy and emotional like an animated-movie narrator, with a hint of humor and a smile in the voice, clear diction, slow-medium pace. Not a real person's clone.

**Lines:**
- `hook`: [softly, sad] هیچ‌کس ناخن پا رو نمی‌بینه...
- `tired`: [sighs] شماره‌ی نُه خسته بود... [short pause] خسته از تو جوراب بودن.
- `break`: [determined] پس یه تصمیم گرفت: [excited] بیرون زدن!
- `shoe`: [playful, fast] از لابه‌لای کفش... [short pause] تا رسید به یه جای عجیب.
- `spa`: [relaxed, dreamy] آب گرم... سوهان... و یه کم ناز.
- `glow`: [fast, punchy] ژل! رنگ! براقی!
- `walk`: [proud, warm] و برای اولین بار... [short pause] همه برگشتن نگاش کنن.
- `heart`: [softly, emotional] شماره‌ی نُه... دیگه نامرئی نبود.
- `tease`: [whispers, suspense] ولی یه سایه‌ی بزرگ‌تر داره میاد... [short pause] شماره‌ی ده!
- `cta`: [lighter, playful] تگ کن اونی رو که ناخن پاش رو نادیده می‌گیره!

---
## SCENARIO 05 — «کوچک‌ترین بوم دنیا» (mature / luxury, no cartoon)
**Voice design prompt (English):**
A calm, intimate, luxurious Persian female voice, native Iranian (Tehran) accent, late 20s to 30s. Low, soft, almost-whispered but perfectly clear, slow pace with deliberate pauses, like a high-end beauty brand film narrator. Confident and elegant, no giggles, no exaggerated energy. Not a real person's clone.

**Lines (one scene per generation):**
- `hook`: [softly] کوچک‌ترین بوم دنیا... [long pause] روی نوک انگشته.
- `precision`: [whispers] جایی که هیچ اشتباهی... کوچیک نیست.
- `color`: [softly, dreamy] رنگ... مثل مه‌ای که تو نور شهر حل می‌شه.
- `chrome`: [low, confident] کروم... [short pause] وقتی نور تصمیم می‌گیره.
- `cateye`: [whispers] کت‌آی... [short pause] جادوی یه آهنربا.
- `foil`: [slow, precise] ورق طلا... با دقت جراح.
- `top`: [softly] یه لایه‌ی آخر... [short pause] و همه‌چی عمیق می‌شه.
- `reveal`: [warm, low] ناخن تموم می‌شه... [long pause] ولی حسش نه.
- `cta`: [intimate] طرح بعدی... مال توئه.

---
## SCENARIO 05 — «چرا ژل ناخن زود می‌پره؟» (non-cartoon, educational)
**Voice design prompt (English):**
A calm, confident Persian-speaking woman, native Iranian (Tehran) accent, 30s. Smooth, intimate, authoritative like a premium beauty-expert voiceover, slightly ASMR-soft, clear diction, medium-slow pace, no cartoonish energy. Not a real person's clone.

**Lines:**
- `hook`: [serious, intriguing] ژل ناخنت چرا زود می‌پره؟
- `oil`: دلیل اول: [short pause] چربی نامرئی روی سطح ناخن.
- `skin`: دلیل دوم: [short pause] پوست نازکی که روی ناخن می‌مونه.
- `thick`: دلیل سوم: [short pause] لایه‌ی ضخیم و کم‌پخت.
- `seal`: دلیل چهارم: [short pause] لبه‌ی ناخن که سیل نشده.
- `tool`: [firm] دلیل پنجم: [short pause] استفاده از ناخن به‌جای ابزار.
- `fix`: [warm, satisfied] درست انجام بشه... [short pause] هفته‌ها می‌درخشه.
- `cta`: [inviting] ذخیره کن... و برای کسی بفرست که ناخنش همیشه می‌پره.
