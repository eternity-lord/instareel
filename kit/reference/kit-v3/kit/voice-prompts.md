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
## SCENARIO 05 — «چرا ژل ناخن زود می‌پره؟» (cartoon, educational)
**Voice design prompt (English):**
A young Persian-speaking woman, native Iranian (Tehran) accent, 20s to 30s. Bright, witty and clear, like a fun-but-smart beauty-tips narrator, comedic timing, a smile in the voice, medium-high energy, natural and not robotic. Not a real person's clone.

**Lines:**
- `hook`: [curious, dramatic] ژل ناخنت چرا زود می‌پره؟
- `oil`: دلیل اول: [short pause] چربی نامرئی روی سطح ناخن.
- `skin`: دلیل دوم: [short pause] پوست نازکی که روی ناخن می‌مونه.
- `thick`: دلیل سوم: [short pause] لایه‌ی ضخیم و کم‌پخت.
- `seal`: [whispers, sneaky] دلیل چهارم: [short pause] لبه‌ی ناخن که سیل نشده.
- `tool`: [panicked] دلیل پنجم: [short pause] استفاده از ناخن به‌جای ابزار!
- `fix`: [warm, happy] درست انجام بشه... [short pause] هفته‌ها می‌درخشه.
- `cta`: [playful] ذخیره کن... و برای کسی بفرست که ناخنش همیشه می‌پره.

---
## SCENARIO 06 — «پرونده‌ی ناخن: مقصر کیه؟» (noir mystery)
**Voice design prompt (English):**
A raspy, world-weary male film-noir detective narrator, native Persian (Tehran) accent, 40s. Low, smoky, dry sarcasm with sudden comic timing, clear Persian diction, slow-medium pace, jazz-club atmosphere. Not a real person's clone.

**Lines:**
- `hook`: [low, gravelly] ناخن شماره‌ی هفت ترک خورد... [short pause] و یکی مقصره.
- `detective`: [dry, cool] پرونده رسید دست... کارآگاه نایلی.
- `door`: [interrogating] مظنون اول: درِ ماشین. [short pause] [sarcastic] میگه: من فقط بسته شدم!
- `can`: [suspicious] مظنون دوم: قوطی نوشابه... [short pause] عرق می‌ریزه.
- `thread`: [unimpressed] مظنون سوم: تار پشمی... [short pause] آلیبی نداره.
- `clue`: [whispers, intense] ولی یه سرنخ... همه‌چی رو عوض کرد.
- `reveal`: [dramatic pause] مقصر... [long pause] [loud, accusing] همونیه که ناخن رو ابزار می‌کنه!
- `cta`: [smug, playful] آره... [short pause] تو! حالا تگ کن همدستت رو.

---
## SCENARIO 07 — «۵ جمله‌ای که هر مشتری از ناخن‌کار می‌شنوه (قسمت ۲)» (same voice as scenario 01)
Use the same voice as scenario 01 for continuity.

**Lines:**
- `hook`: [excited] پنج جمله‌ای که هر مشتری از ناخن‌کار می‌شنوه!
- `clock`: میگه ده دقیقه دیگه تمومه... [short pause] [sarcastic] یعنی یه ساعت!
- `good`: میگه ناخن‌هات خوبه... [short pause] [sarcastic] یعنی با اینا چی کار کردی؟!
- `dry`: میگه دست نزن تا خشک بشه... [short pause] [panicked] تو بلافاصله گوشیت رو برمی‌داری!
- `return`: میگه دو هفته بعد بیا... [short pause] [laughs] تو دو ماه بعد میای!
- `heat`: میگه فقط یه ذره گرم می‌شه... [short pause] [sarcastic] یعنی دستت رو بیرون می‌کشی!
- `payoff`: [softly] ولی وقتی میگی عاشقشونم... [happy] همه‌چی بخشیده می‌شه!
- `cta`: [playful] تگ کن ناخن‌کارت رو که همیشه اینا رو میگه.

---
## SCENARIO 08 — «۵ نشونه‌ی اینکه ناخن‌کارت واقعاً دوستت داره» (same voice as scenario 01, warmer)
**Lines:**
- `sign1`: [warm, quick] نوبتش پر بود... [short pause] [happy] ولی برات جا باز کرد!
- `sign2`: [dramatic] ناخنت شکست؟ [short pause] [warm] میگه بیا درستش کنم.
- `sign3`: [softly, surprised] رنگ مورد علاقه‌ت... یادشه.
- `sign4`: [playful] ناخنت رو تو استوری می‌بینه... [short pause] اول از همه لایک می‌کنه.
- `sign5`: [warm, smiling] و وقتی میگی عاشقشونم... [short pause] [giggles] ذوق می‌کنه.
- `cta`: [playful] ناخن‌کارت رو کامنت تگ کن... [short pause] ببین چی میگه!

---
## SCENARIO 08 — «۴ تیپ مشتری ناخن: تو کدومی؟» (same voice as scenario 01)
Use the same voice as scenario 01 for continuity.

**Lines:**
- `hook`: [curious, playful] ناخن‌کارت تو دلش... تو رو چی صدا می‌کنه؟
- `late`: تیپ اول: ساعت‌نشناس... [short pause] [sarcastic] چهل دقیقه دیر میاد!
- `shots`: تیپ دوم: اسکرین‌شات‌باز... [short pause] [laughs] چهل تا عکس، ولی میگه عین همین!
- `friend`: تیپ سوم: دوست‌آورنده... [short pause] [fast] هر دو دقیقه یه نظر جدید!
- `tool`: تیپ چهارم: ناخن به‌جای ابزار... [short pause] [innocent] و بعد میگه: خودش شکست!
- `payoff`: ولی یه تیپ پنجم هم هست... [short pause] [warm, happy] که میگه: دستت درد نکنه!
- `card`: [clear, friendly] ذخیره کن: وقت‌شناس باش... یه عکس بیار... دست نزن.
- `cta`: [playful] تو کدوم تیپی؟ با ایموجیش جواب بده... و تیپ سه رو تگ کن!

---
## SCENARIO 09 — «۵ تیپ ناخن‌کار» (same voice as scenario 01)
Use the same voice as scenario 01 for continuity.

**Lines:**
- `hook`: [curious, playful] ناخن‌کارها هم تیپ دارن... [short pause] تیپ آخر رو باور نمی‌کنی!
- `talker`: تیپ اول: پرحرف... [short pause] [laughs] آخرش همه‌ی فامیلش رو می‌شناسی!
- `perfectionist`: تیپ دوم: وسواسی... [short pause] [exasperated] یه ذره رو پنج بار دوباره می‌کنه!
- `dm`: تیپ سوم: دایرکت‌جواب‌ده... [short pause] [fast] یه دست ناخن، یه دست دایرکت!
- `legend`: [proud, epic] تیپ چهارم: افسانه‌ای... بیست دقیقه و تموم!
- `twist`: و تیپ پنجم: [short pause] [deadpan] ناخن‌کاری که ناخن خودش همیشه نصفه‌ست!
- `thanks`: [warm, softly] دستتون درد نکنه ناخن‌کارها!
- `card`: [clear, friendly] ذخیره کن: قبل از رزرو... سه تا سوال بپرس.
- `cta`: [playful] تیپ ناخن‌کارت کدومه؟ ایموجی بزن... و تیپ پنج رو تگ کن!
