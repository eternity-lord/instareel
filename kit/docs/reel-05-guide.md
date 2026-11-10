# ساخت ریل ۰۵ با کیت جدید — پنج علت رایج جداشدن ژل

## منشأ کیت و اولویت‌ها

فایل `nail-reel-kit (1).zip` از آپلود GitHub در commit `9060f3c5a73d1a22775aa8409c66221f4f8540f1` گرفته شد. مسیرهای داخل ZIP قبل از استخراج بررسی شدند. محتوای اصلی در `kit/reference/kit-v2/kit/` حفظ شده و ZIP پس از استخراج از شاخه حذف شده است. SHA256 ZIP: `aea211c12fb01261701357f23877a29a82ad45a14541279899901f44085e58fd`.

راهنمای فعال `kit/README.md` و `kit/voice-prompts.md` از کیت جدید هستند. بخش **آموزشی** سناریوی ۰۵ در voice-prompts انتخاب شده، نه بخش جداگانهٔ «کوچک‌ترین بوم دنیا». style override، جهت کارتونی قبلی را برای این ریل لغو می‌کند. سورس و گزارش نسخه‌های قبلی حفظ شده‌اند؛ فایل‌های نمونهٔ کیت جدید روی renderer توسعه‌یافتهٔ موجود کپی نشده‌اند تا پشتیبانی پنج خروجی از بین نرود.

## ورودی و دقت

`input/scenarios/scenario-05.json` نسخهٔ دست‌نخوردهٔ پیوست است. فایل فعال سه metadata با مقدارهای `reelId:05`، `renderer:macro` و `audioStyle:macro` اضافه دارد. تنها تغییر محتوایی این است که جملهٔ fix از وعدهٔ «هفته‌ها» به «اجرای درست، به ماندگاری بیشتر کمک می‌کنه» تبدیل شده؛ این تغییر برای رعایت accuracy خود سناریوست. ماندگاری ثابت، تشخیص پزشکی، زمان پخت یا ضدآب‌بودن تضمین نشده است.

## بازسازی از ریشهٔ مخزن

```bash
python3 -m venv .venv
.venv/bin/pip install -r kit/audio/requirements.txt
npm ci --prefix kit/render
.venv/bin/python kit/audio/make_audio.py
node kit/render/stills.mjs
node kit/render/qa.mjs
node kit/render/macro-test.mjs
node kit/render/render.mjs --test
node kit/render/render.mjs
.venv/bin/python kit/render/verify_video.py
cp kit/docs/REPORT-05.md kit/out/05/REPORT.md
node kit/render/export.mjs
node kit/render/preview-test.mjs
node kit/render/export.mjs
npm start --prefix kit/render
```

Node 22+، Python 3.11+ و Linux x64 لازم‌اند. Chromium همراه npm، NSS همراه bundle و FFmpeg پکیج Python پشتیبانی می‌شوند. `CHROMIUM_PATH` و `FFMPEG_PATH` اختیاری‌اند. پیش‌نمایش روی `0.0.0.0:3000` است؛ همهٔ URLهای مرورگر نسبی‌اند و Range/seek پشتیبانی می‌شود. هنگام رندر SwiftShader، پایان هر فریم با `gl.finish()` همگام می‌شود تا صف GPU پس از seekهای فراوان، screenshot را timeout نکند. برای SVGهای قبلی CPU Skia همچنان پیش‌فرض است.

## تصویر

`src/scenes/macro.js` یک ماژول ESM است؛ import map بسته‌های محلی Three.js/postprocessing را وصل می‌کند. `gsap` محلی و timelineها paused هستند؛ ticker پس از seek خاموش می‌شود. animation با زمان واقعی یا RNG غیرseeded نداریم. یک canvas مشترک بین ۸ صحنه جابه‌جا می‌شود و منابع مجدداً ساخته نمی‌شوند.

- MeshPhysicalMaterial: transmission، thickness، clearcoat و iridescence روی اشیای مصنوعی؛ هیچ پوست، چهره، ماسکات یا شخصیت وجود ندارد.
- محیط استودیویی با پنل‌های نور ساخته‌شده با کد و PMREM؛ بدون HDRI یا تصویر خارجی.
- postprocessing واقعی: Bloom، DepthOfField، ChromaticAberration بسیار کم و grain اختصاصی seedشده.
- geometry ناخن: شکل almond با bevel، تحدب و normals هموار؛ ژل/فیلم/قطره/حباب/تب قوطی/قطعات، هندسهٔ واقعی‌اند. نمودار فنی و leaderها SVG با stroke-dash draw-on هستند.
- دوربین هر صحنه در حرکت است؛ لایه‌های مستقل شامل ماده/شیء، نور، ذرات و overlay هستند. دیاگرام‌های نفوذ/پخت شماتیک‌اند، نه شبیه‌سازی فیزیک مواد.
- canvas سه‌بعدی **675×1200** است که در خروجی **1080×1920** upsample و با متن/SVG با وضوح Full HD ترکیب می‌شود. بنابراین لایهٔ سه‌بعدی native 1080 نیست. کیفیت/زمان رندر SwiftShader دلیل انتخاب این اندازه است. `renderer.setPixelRatio(1.25)` را می‌توان تغییر داد ولی QA و رندر باید دوباره اجرا شوند.
- هیچ عنوان کوچک اضافه‌ای بالای فیلم درج نمی‌شود. شیت `character-sheet.png` برای حفظ نام قرارداد خروجی، **مطالعهٔ متریال و هشت نما** است، نه شیت کاراکتر.

## نریشن و زمان‌بندی

کاربر در audition فارسی صدای زنانهٔ `voice-00` را انتخاب کرد. هشت فایل WAV مصنوعی با همان صدا در `audio/voice/05/` ثبت شده‌اند؛ صدای شخص واقعی یا clone نیستند. فایل‌های ورودی برای بازسازی ثابت‌اند؛ ابزار تولید صدا برای rerender لازم نیست.

`macro_audio.py` سکوت ابتدا/انتها را trim می‌کند و با **atempo 1.422** بدون تغییر pitch، گفتار را در محدودیت مدت قرار می‌دهد. نتیجه ۳۵ ثانیهٔ صحنه‌ها + ۳ ثانیهٔ پایان = **۳۸ ثانیه / ۱۱۴۰ فریم** است. حداقل hold آخرین واژه 0.9s. موسیقی اصل/seed 505، pad و pulse با **84 BPM** و ducking زیر نریشن؛ SFX ورودی همگی ترکیب شده‌اند.

**هایلایت ۵۷ کلمه تخمینی است**: envelope صوت و وزن طول کلمات، نه forced alignment/ASR. دقت ثابت ±150ms ادعا نمی‌شود؛ برای اصلاح دقیق، `out/05/timing.json` را به‌صورت دستی پس از گوش‌دادن ویرایش و بدون اجرای مجدد audio رندر کنید. جایگزینی WAVها نیاز به تولید دوبارهٔ timing و تمام تست‌ها دارد. `brand.json` برای ریل ۰۵ BPM84 و مشخصات صدای منتخب را ثبت می‌کند.

## خروجی و نگهداری نسخه‌ها

خروجی کاری `out/05/` موقت است. export، مجموعهٔ همراه را به `deliverables/reel-05/` و MP4 مستقل را به `deliverables/nail-reel-05.mp4` کپی می‌کند. شواهد پایدار در `docs/evidence-05/` ثبت می‌شوند. همراه‌های تصویری/مستر صوت ignored هستند؛ هشت فایل منبع نریشن برای بازسازی در Git قرار دارند.

`macro-test.mjs` هش چهار MP4 قبلی، تنها تغییر آموزشی ورودی، BPM/وجود نریشن، hold، WebGL2/SwiftShader، متریال فیزیکی، postprocessing، حرکت دوربین/تصویر و تک‌canvasبودن را کنترل می‌کند. برای بازسازی ریل‌های قبلی، ورودی و راهنمای همان ریل و metadata مربوطه را استفاده کنید؛ `preview.html` اکنون ۰۵ را نشان می‌دهد. تغییر ورودی به‌تنهایی صفحهٔ تحویل را عوض نمی‌کند. تضمینی برای بازدید یا وایرال‌شدن وجود ندارد.
