# بازسازی ریل ۰۴ — از پا تا اوج

ورودی پیوست در `input/scenarios/scenario-04.json` بایگانی شده و فایل فعال فقط metadataهای `reelId:04`، `renderer:journey` و `audioStyle:journey` اضافه دارد. صحنه، متن، cast و SFX تغییر نکرده‌اند. کپشن ریل ۰۳ در `input/scenarios/post-copy-03.md` حفظ شده است.

## اجرای کامل از ریشهٔ مخزن

```bash
python3 -m venv .venv
.venv/bin/pip install -r kit/audio/requirements.txt
npm ci --prefix kit/render
.venv/bin/python kit/audio/make_audio.py
node kit/render/stills.mjs
node kit/render/render.mjs --test
node kit/render/qa.mjs
node kit/render/journey-test.mjs
node kit/render/render.mjs
.venv/bin/python kit/render/verify_video.py
# اگر گزارش پس از رندر به‌روز شد:
cp kit/docs/REPORT-04.md kit/out/04/REPORT.md
node kit/render/export.mjs
node kit/render/preview-test.mjs
node kit/render/export.mjs
npm start --prefix kit/render
```

Node 22+، Python 3.11+، Linux x64؛ Chromium و FFmpeg پکیج‌ها استفاده می‌شوند. سرور پیش‌نمایش روی `0.0.0.0:3000` است؛ URLهای مرورگر نسبی و Range/seek پشتیبانی می‌شوند. `PORT`، `CHROMIUM_PATH` و `FFMPEG_PATH` قابل تنظیم‌اند.

## معماری

- ترتیب بارگذاری: `trailer.js` → `sequel.js` → `journey.js`. فایل‌های قبلی helper و کاراکترهای برگشتی را فراهم می‌کنند؛ journey صحنه‌های فعال را ثبت می‌کند.
- مسیرهای جوراب/کفش/اسپا/ساحل و اردک و شست جدیدند. نُه تناسب‌های قبلی را حفظ می‌کند؛ پوشش یاسی، نگین، ژست‌ها، صندل و اشک اضافه شده‌اند.
- این تصویرسازی SVG/2.5D است؛ orbit با جابه‌جایی/تغییر مقیاس/نگاه و لایه‌بندی تصویرسازی می‌شود، نه مدل واقعی سه‌بعدی. اتصال پورتال‌ها توهم سفر یک‌تکه است، نه فضای پیوستهٔ سه‌بعدی یا برداشت واقعی دوربین. تغییر ظاهر عمداً مونتاژ ضربی است.
- زمان‌بندی 100 BPM: هر ضرب 0.6s، شروع glow در 18s، سه مرحله در 18/18.6/19.2. 0.7s hold خواندن آخرین کلمه؛ 36.6s داستان + 3s endcard = 39.6s / 1188 فریم.
- صوت `journey_audio.py`: seed 409، پیانومانند additive، زهی زخمه‌ای و percussion نرم. بدون نمونهٔ ضبط‌شده یا TTS؛ هایلایت متن با گفتار هم‌تراز نیست چون گفتاری وجود ندارد.
- تغییر رنگ متن برای نماهای روشن و زیرلایهٔ واترمارک فقط در renderer جدید اعمال می‌شود؛ عنوان کوچک بالای فیلم خالی است.

## خروجی و نسخه‌ها

خروجی کاری `out/04/` موقتی است. export مجموعهٔ کامل را به `deliverables/reel-04/` و MP4 مستقل را به `deliverables/nail-reel-04.mp4` کپی می‌کند. فقط MP4 نهایی و مدارک متنی/JSON در Git ثبت می‌شوند؛ تصاویر/صوت همراه با اجرای فوق بازسازی می‌شوند. شواهد پایدار در `docs/evidence-04/` هستند.

MP4های ۰۱/۰۲/۰۳ را بازنویسی نکنید؛ journey-test هش هر سه را کنترل می‌کند. برای بازسازی نسخه‌های قدیمی از راهنمای همان نسخه و ورودی‌های بایگانی‌شده استفاده کنید. `preview.html` اکنون نسخهٔ ۰۴ را نشان می‌دهد؛ تغییر ورودی به‌تنهایی محتوای صفحهٔ تحویل را عوض نمی‌کند. گزارش و راهنمای قدیمی حفظ شده‌اند.

این ماجرا دستور استفاده از مواد/درمان نیست. شکل قبل از تغییر هم ارزشمند است؛ دیده‌شدن به ظاهر وابسته نیست. بازدید یا وایرال‌شدن تضمین‌پذیر نیست.
