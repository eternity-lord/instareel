# بازتولید نسخهٔ کارتونی ۰۵

## منابع

- اصل پیوست: `kit/input/scenarios/scenario-05-cartoon.json`، بدون تغییر
- سناریوی اجرایی فعال: `kit/input/scenario.json`، renderer/audioStyle=`education`، reelId=`05-cartoon`
- سناریوی اجرایی ماکروی قبلی: `kit/input/scenarios/scenario-05-macro-active.json`؛ این فایل فقط آرشیو تنظیمات قبلی است، MP4 قبلی دست‌نخورده می‌ماند.
- استوری‌بورد: `kit/docs/storyboard-05-cartoon.md`
- صحنه‌ها: `kit/src/scenes/education.js` + helperهای `studio.js`
- صوت: `kit/audio/education_audio.py`؛ پد و آرپژ اصل + افکت‌های سناریو، هیچ صدای گوینده
- زمان‌بندی خواندن ۵۷ واژه: `kit/input/scenarios/timing-05.json`؛ با متن اجرایی مطابقت دارد، زمان گفتار نیست.

## اجرا از ریشهٔ مخزن

```bash
npm ci --prefix kit/render
python3 -m venv .venv
.venv/bin/pip install -r kit/audio/requirements.txt
.venv/bin/python kit/audio/make_audio.py
node kit/render/stills.mjs
node kit/render/qa.mjs
node kit/render/education-test.mjs
node kit/render/render.mjs --test
node kit/render/render.mjs
.venv/bin/python kit/render/verify_video.py
node kit/render/export.mjs
node kit/render/preview-test.mjs
node kit/render/export.mjs
```

`education-test.mjs` علاوه‌بر SVG و عدم نریشن، hash همهٔ فایل‌های قدیمی را بررسی می‌کند. QAهای قبلی برای renderer خود همچنان قابل‌استفاده‌اند. rendererهای دیگر تغییر تصویری/صوتی نکرده‌اند.

## پیش‌نمایش

```bash
node kit/render/serve.mjs
```

سرور روی `0.0.0.0`؛ مسیر اصلی پیش‌نمایش کارتونی، `/preview-macro-05.html` پیش‌نمایش قدیمی ماکرو و `/src/index.html` صحنهٔ قابل‌seek. پیش‌نمایش قدیمی برای PNGهای جانبی نیاز به خروجی exportشدهٔ نسخهٔ قدیمی دارد؛ MP4 ماکرو همواره داخل گیت موجود است. پیش‌نمایش هیچ سرویس یا فراخوانی localhost در مرورگر ندارد.

## خروجی و نگهداری

خروجی موقت `kit/out/05-cartoon/` و بستهٔ کامل `kit/deliverables/reel-05-cartoon/` طبق سیاست مخزن ignored است. MP4 اصلی مستقل و شواهد سبک گزارش در گیت نگهداری می‌شوند؛ تمام فایل‌های MP4 ۰۱–۰۵ پیشین محفوظ‌اند. نیازی به API صدا، توکن، فایل اینترنتی موسیقی یا download هنگام رندر نیست. Chromium/فونت از وابستگی npm و FFmpeg از venv تأمین می‌شود.
