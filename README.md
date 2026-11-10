# instareel · آیدا نیل‌روم

دو ریل اختصاصی فارسی برای **@ayda.nailroom**، بر اساس سناریوهای کاربر. تمام تصویرسازی‌ها و موسیقی‌ها با کد ساخته شده‌اند؛ منبع خارجیِ تصویر/آهنگ یا صدای انسان واقعی استفاده نشده است.

## ریل ۰۲ — ناخن شمارهٔ ۷: مأموریت زنده‌موندن

یک تریلر سینماییِ کمدی با ناخن صورتیِ بانداژشده، شوالیهٔ ژلی آبی و سه دشمن روزمره: درِ ماشین، قوطی نوشابه و یک تار پشمی.

**۳۴ ثانیه، 1080×1920، 30fps، H.264 High / yuv420p، AAC stereo 48kHz.** نسخهٔ موسیقی و افکت، بدون گوینده؛ هایلایت ۵۲ کلمه بر اساس زمان خواندن است، نه هم‌ترازی با گفتار.

- [دانلود مستقیم ریل ۰۲ از GitHub](https://github.com/eternity-lord/instareel/raw/refs/heads/main/kit/deliverables/nail-reel-02.mp4)
- [صفحهٔ فایل ریل ۰۲](https://github.com/eternity-lord/instareel/blob/main/kit/deliverables/nail-reel-02.mp4)
- [استوری‌بورد](kit/docs/storyboard-02.md) · [راهنمای ساخت](kit/docs/reel-02-guide.md) · [گزارش کنترل کیفیت](kit/docs/REPORT-02.md)

فانتزیِ کارتونی است؛ ژل ناخن را شکست‌ناپذیر نمی‌کند. مونتاژ سه لایه/لامپ، آموزش مواد یا زمان تابش UV نیست. میزان بازدید قابل تضمین نیست.

## ریل ۰۱ — پنج جمله، یک عالمه صبر

فایل ویدیوی اول **بدون تغییر حفظ شده است**: ۳۵ ثانیه، Full HD عمودی، ۳۰ فریم، موسیقی اختصاصی و افکت، بدون گوینده.

- [دانلود مستقیم ریل ۰۱](https://github.com/eternity-lord/instareel/raw/refs/heads/main/kit/deliverables/nail-reel-01.mp4)
- [گزارش ریل ۰۱](kit/docs/REPORT.md) · [راهنمای قبلی](kit/docs/reel-01-guide.md)

## اجرای پروژهٔ فعال (۰۲)

نیازمندی‌ها: Node.js 22+، Python 3.11+ و Linux x64 برای Chromium باندل‌شده. `CHROMIUM_PATH` و `FFMPEG_PATH` در صورت نیاز قابل تنظیم‌اند. در نبود FFmpeg سیستم از باینری پکیج `imageio-ffmpeg` استفاده می‌شود.

```bash
python3 -m venv .venv
.venv/bin/pip install -r kit/audio/requirements.txt
cd kit/render
npm ci
./run.sh --test          # ساخت صوت + تست ۳ثانیه‌ای
npm run stills          # کاور، فریم واقعی، شیت کاراکتر، تصاویر صحنه‌ها
npm test                # seek، تمام کلمات، safe zone و لوپ
./run.sh                # رندر کامل ۱۰۲۰ فریم و contact sheet
../../.venv/bin/python verify_video.py
npm run export          # خروجی قابل‌تحویل، بدون بازنویسی ریل اول
npm run test:web        # پخش/متادیتا، Range، دانلودها، گالری و موبایل
npm start               # پیش‌نمایش 0.0.0.0:3000؛ قابل تغییر با PORT
```

- خروجی کاری: `kit/out/02/` (scratch و خارج از Git).
- تصاویر، صوت، گزارش و شواهد تست: `kit/deliverables/reel-02/` (تولیدشده و خارج از Git).
- MP4 نهایی قابل‌دانلود: `kit/deliverables/nail-reel-02.mp4` (بنا به درخواست کاربر در Git).
- گزارش و استوری‌بورد ماندگار: `kit/docs/`.
- پیش‌نمایش از URL نسبی استفاده می‌کند و سرور Range requests برای seek را می‌پذیرد؛ کد مرورگر به localhost سرویس دیگری درخواست نمی‌دهد.

ورودی اصلی هر دو ریل در `kit/input/scenarios/` بایگانی شده است. `kit/input/scenario.json` ورودی فعال است و برای ریل دوم سه کلید `reelId`، `renderer` و `audioStyle` اضافه دارد؛ متن صحنه‌های پیوست کاربر دست‌نخورده است. جزئیات ویرایش و بازسازی نسخهٔ اول در راهنمای ریل دوم توضیح داده شده‌اند.

## معماری و مجوز

تصویرسازی SVG و کاراکترها در `kit/src/scenes/`، موتور زیرنویس در `kit/src/index.html`، سنتز صدا در `kit/audio/` و رندر/تست‌ها در `kit/render/` هستند. صحنه تابع خالص `window.__seek(t)` است؛ animation CSS یا تایمر زمان‌واقعی نداریم. مسیر پیش‌فرض CPU Skia برای SVG انتخاب شده تا رندر سریع و قابل‌تکرار باشد؛ `STUDIO_CPU_RASTER=0` مسیر SwiftShader را فعال می‌کند.

فونت **محلی** Vazirmatn تحت مجوز OFL در `kit/assets/fonts/OFL.txt` است. شرح اولیهٔ کیت در `kit/README.md` و prototype قدیمی در `kit/reference/` حفظ شده‌اند؛ prototype جزو خروجی نهایی نیست.
