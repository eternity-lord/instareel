# راهنمای اجرای ریلز ۰۸

## منابع

- پیوست اصلی: `kit/input/scenarios/scenario-08.json`؛ دقیقاً بایت‌های فایل کاربر.
- اجرایی: `kit/input/scenario.json` و کپی `kit/input/scenarios/scenario-08-active.json`، reelId=`08`، renderer/audioStyle=`quiz`.
- تصویر: `kit/src/scenes/quiz.js` و ابزار شخصیت/صحنهٔ `studio.js`؛ حرکت‌ها تابع زمان‌اند.
- صوت و زمان‌بندی خواندن: `kit/audio/quiz_audio.py`؛ ۳۲ ثانیه با 84 BPM، بدون بازکردن/میکس هیچ فایل نریشن.
- متن پست و کامنت پین: `kit/input/post_copy.md` و نسخهٔ بایگانی `kit/input/scenarios/post-copy-08.md`.
- استوری‌بورد و ملاحظات: `kit/docs/storyboard-08.md`.

## بازتولید از ریشه

```bash
npm ci --prefix kit/render
python3 -m venv .venv
.venv/bin/pip install -r kit/audio/requirements.txt
.venv/bin/python kit/audio/make_audio.py
node kit/render/stills.mjs
node kit/render/qa.mjs
node kit/render/quiz-test.mjs
node kit/render/render.mjs --test
node kit/render/render.mjs
.venv/bin/python kit/render/verify_video.py
node kit/render/export.mjs
node kit/render/preview-test.mjs
node kit/render/export.mjs
```

سرور پیش‌نمایش: `node kit/render/serve.mjs`، روی `0.0.0.0:3000`؛ مرورگر فقط URL نسبی استفاده می‌کند. اجرای `window.__seek(t)` در `/src/index.html` امکان مرور تصادفی نماها را می‌دهد. فونت/Chromium از npm و FFmpeg از venv تأمین می‌شوند؛ هیچ سرویس ساخت صدای آنلاین نیاز نیست.

## خروجی

MP4 نهایی: `kit/deliverables/nail-reel-08.mp4`. فایل‌های جانبی پس از export در `kit/deliverables/reel-08/`: کاور، style frame، شیت سه شخصیت و چهار نشان، کارت مشتری ایده‌آل، ۲۴ فریم، end card، mix WAV، متن پست، گزارش و QA.

مطابق سیاست پروژه، scratch در `kit/out/08/` و بستهٔ جانبی ignored هستند. MP4، منابع و شواهد سبک در `kit/docs/evidence-08/` داخل گیت‌اند. خروجی‌های قبلی دست‌نخورده‌اند. صفحهٔ قبلی `preview-cartoon-05.html` حفظ شده؛ نمایش PNGهای قدیمی نیاز به export قبلی دارد ولی MP4های قدیمی همچنان در گیت‌اند.

حرکت‌ها در محیط ثابت deterministic هستند؛ همسانی بیت‌به‌بیت encoder/مرورگرهای متفاوت تضمین نمی‌شود. هایلایت‌ها زمان خواندن‌اند، نه alignment گفتار. صدا صرفاً موسیقی اصل و افکت‌های نرم است. این کار فایل آمادهٔ انتشار تولید می‌کند، نه انتشار اینستاگرامی، پین‌کردن واقعی یا زمان‌بندی هفتگی.
