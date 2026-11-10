# بازسازی ریل ۰۳ — انتقام استون

ورودی اصلی در `input/scenarios/scenario-03.json` بدون تغییر بایگانی شده است. فایل فعال `input/scenario.json` فقط سه کلید اجرایی `reelId:03`، `renderer:sequel` و `audioStyle:cinematic` اضافه دارد. متن/ترتیب/افکت‌های پیوست حفظ شده‌اند.

## ساخت

از ریشهٔ مخزن:

```bash
python3 -m venv .venv
.venv/bin/pip install -r kit/audio/requirements.txt
npm ci --prefix kit/render
.venv/bin/python kit/audio/make_audio.py
node kit/render/stills.mjs
node kit/render/render.mjs --test
node kit/render/qa.mjs
node kit/render/render.mjs
.venv/bin/python kit/render/verify_video.py
# گزارش نهایی docs/REPORT-03.md را به out/03/REPORT.md کپی کنید
node kit/render/export.mjs
node kit/render/preview-test.mjs
node kit/render/export.mjs
```

`npm start --prefix kit/render` پیش‌نمایش را روی `0.0.0.0:3000` باز می‌کند؛ همهٔ URLهای مرورگر نسبی هستند. پروژه به مرورگر سیستم نیاز ندارد؛ Chromium باندل‌شده و FFmpeg پکیج Python قابل استفاده‌اند.

## ساختار

- کاراکترهای برگشتی و دکور پایه: `src/scenes/trailer.js`؛ فایل جدید `sequel.js` بعد از آن بارگذاری می‌شود.
- شمارهٔ ۸، بطری، پنبه و نُه: SVG اختصاصی در sequel؛ بدون تصویر/صدای استوک.
- هر فریم تابع تحلیلی زمان است: جهش، powerslide، barrel roll، دوربین گردشی با ترتیب عمق، دالی‌زوم و لرزش. زیرنویس مستقل از ماتریس دوربین است.
- صوت: seed 308، پالس/باس/سازهای سنتزشده، رژه، گذر سریع، تپش و استینگ پیچش. TTS یا صدای واقعی تولید نشده؛ هایلایت متن بر مبنای زمان خواندن است.
- خروجی: `out/03/`، سپس `deliverables/reel-03/` و MP4 مستقل `deliverables/nail-reel-03.mp4`.

## نگهداری نسخه‌ها

MP4های ۰۱ و ۰۲ را بازنویسی نکنید. برای بازسازی قبلی‌ها از ورودی بایگانی‌شده استفاده کرده و metadata مطابق راهنمای مربوطه تنظیم کنید؛ پیش‌نمایش HTML در حال حاضر نسخهٔ ۰۳ را نشان می‌دهد. صرف تغییر ورودی، پیش‌نمایش را به نسخهٔ دیگری تبدیل نمی‌کند. کپشن قبلی ۰۲ در `input/scenarios/post-copy-02.md` است. جزئیات تمام تست‌ها در `docs/evidence-03/` ثبت می‌شوند.

تصویرسازی 2.5D مبتنی بر SVG است، نه ویدیوی تولیدشده توسط مدل یا رندر سه‌بعدی واقعی. نسخهٔ نُه و دیگر نماهای شیت، روبرو/سه‌رخِ سبک‌پردازی‌اند، نه مدل سه‌بعدی چرخان. هیچ ادعایی دربارهٔ مقاومت شیمیایی مواد یا تضمین وایرال‌شدن وجود ندارد.
