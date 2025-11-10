# راهنمای دیپلوی در Cloudflare Pages

## مشکلات رایج و راه‌حل‌ها

### مشکل ۱: فایل‌های JavaScript به عنوان HTML لود می‌شوند

**علت**: کانفیگ Cloudflare Pages به اشتباه تنظیم شده است.

**راه‌حل**: از کانفیگ زیر استفاده کنید:

#### تنظیمات Build در Cloudflare Pages Dashboard:

```
Build command: (خالی بگذارید یا: echo 'No build needed')
Build output directory: . (یک نقطه)
Root directory: / (خالی بگذارید)
```

### مشکل ۲: Header و Footer نمایش داده نمی‌شوند

**علت**: فایل‌های component به درستی سرو نمی‌شوند.

**راه‌حل**: 
1. اطمینان حاصل کنید که فایل `_redirects` در root پروژه وجود دارد
2. فایل `_headers` نیز باید در root باشد
3. تنظیمات Content-Type در `_headers` باید صحیح باشد

### مشکل ۳: کارت‌ها تکراری نمایش داده می‌شوند

**علت**: JavaScript چندین بار اجرا می‌شود یا cache مرورگر مشکل دارد.

**راه‌حل**:
1. کش مرورگر را پاک کنید (Ctrl+Shift+Delete)
2. در Cloudflare Pages، کش را purge کنید

## دستورالعمل دیپلوی گام به گام

### روش ۱: دیپلوی مستقیم (بدون Build) - توصیه می‌شود

1. وارد [Cloudflare Pages Dashboard](https://dash.cloudflare.com/) شوید
2. روی "Create a project" کلیک کنید
3. مخزن GitHub را متصل کنید
4. تنظیمات Build را به صورت زیر وارد کنید:
   - **Framework preset**: None
   - **Build command**: خالی بگذارید
   - **Build output directory**: `.` (فقط یک نقطه)
   - **Root directory**: خالی بگذارید

5. روی "Save and Deploy" کلیک کنید

### روش ۲: دیپلوی با Vite Build (پیشرفته)

اگر می‌خواهید از Vite برای بهینه‌سازی استفاده کنید:

1. ابتدا در local تست کنید:
```bash
npm install
npm run build
```

2. بررسی کنید که فولدر `dist` به درستی ساخته شده است

3. در Cloudflare Pages:
   - **Framework preset**: None یا Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: خالی بگذارید
   - **Environment variables**: 
     - `NODE_VERSION`: `18`

### بررسی صحت دیپلوی

بعد از دیپلوی، موارد زیر را چک کنید:

1. ✅ صفحه اصلی به درستی لود می‌شود
2. ✅ Header و Footer نمایش داده می‌شوند
3. ✅ فایل‌های CSS و JS به درستی لود می‌شوند (بدون خطای MIME type)
4. ✅ تصاویر و فونت‌ها به درستی نمایش داده می‌شوند
5. ✅ لینک‌های داخلی کار می‌کنند
6. ✅ کارت‌ها یکبار نمایش داده می‌شوند (نه تکراری)

### اشکال‌زدایی (Debugging)

اگر مشکلی پیش آمد:

1. **بررسی Console مرورگر**:
   - F12 را فشار دهید
   - به تب Console بروید
   - خطاها را بخوانید

2. **بررسی Network Tab**:
   - در DevTools به تب Network بروید
   - Refresh کنید
   - فایل‌هایی که با خطا لود می‌شوند را پیدا کنید
   - Content-Type آنها را چک کنید

3. **بررسی Cloudflare Pages Logs**:
   - به Dashboard بروید
   - روی deployment کلیک کنید
   - لاگ‌های build را بررسی کنید

### فایل‌های مهم کانفیگ

- `.cloudflare-pages.json`: کانفیگ اصلی Cloudflare Pages
- `_headers`: تنظیمات HTTP headers
- `_redirects`: تنظیمات redirects و rewrites
- `vite.config.js`: کانفیگ Vite (در صورت استفاده از build)

### نکات امنیتی

1. فایل‌های حساس را در `.gitignore` قرار دهید
2. از Environment Variables برای API keys استفاده کنید
3. CSP headers را به درستی تنظیم کنید (در `_headers`)

## پشتیبانی

اگر همچنان مشکل دارید:

1. فایل `_redirects` را چک کنید
2. فایل `_headers` را چک کنید
3. تنظیمات Cloudflare Pages را دوباره بررسی کنید
4. کش مرورگر و CDN را پاک کنید

---

**آخرین به‌روزرسانی**: نوامبر ۲۰۲۴
