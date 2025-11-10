# 🖥️ راهنمای اجرای سرور محلی

## 🚀 روش اجرا

### قدم 1: نصب Dependencies (اگر نصب نشده)

```bash
npm install
```

### قدم 2: اجرای سرور Development

```bash
npm run dev
```

سرور روی **http://localhost:3000** اجرا می‌شود و به صورت خودکار مرورگر باز می‌شود.

---

## 🔧 دستورات موجود

### Development

```bash
npm run dev
```
- سرور development با Hot Module Replacement (HMR)
- تغییرات به صورت لحظه‌ای اعمال می‌شود
- پورت: 3000

### Build

```bash
npm run build
```
- ساخت نسخه Production
- فایل‌ها در پوشه `dist/` قرار می‌گیرند
- Minification و Optimization فعال

### Preview

```bash
npm run preview
```
- پیش‌نمایش build شده
- برای تست قبل از deploy
- پورت: 4173

### Optimize Images (اختیاری)

```bash
npm run optimize-images
```

---

## 🌐 آدرس‌های دسترسی

بعد از اجرا:

- **Local:** http://localhost:3000
- **Network:** http://192.168.x.x:3000 (برای دستگاه‌های دیگر در شبکه)

---

## 🐛 رفع مشکلات رایج

### مشکل 1: پورت 3000 در حال استفاده

```bash
# تغییر پورت
npm run dev -- --port 3001
```

### مشکل 2: Dependencies نصب نشده

```bash
# حذف و نصب مجدد
rm -rf node_modules package-lock.json
npm install
```

### مشکل 3: Cache مشکل دارد

```bash
# پاک کردن cache
npm cache clean --force
rm -rf node_modules .vite
npm install
```

### مشکل 4: Permission Error (Windows)

```powershell
# اجرا به عنوان Administrator
# یا
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

---

## 📱 تست روی موبایل

### قدم 1: پیدا کردن IP محلی

**Windows:**
```bash
ipconfig
```

**Mac/Linux:**
```bash
ifconfig
```

### قدم 2: باز کردن در موبایل

```
http://YOUR_LOCAL_IP:3000
```

مثال: `http://192.168.1.100:3000`

---

## 🔥 Hot Module Replacement (HMR)

Vite به صورت پیش‌فرض HMR فعال دارد:

- ✅ تغییرات CSS بلافاصله اعمال می‌شود
- ✅ تغییرات JavaScript بدون refresh
- ✅ State حفظ می‌شود

---

## 💡 نکات مهم

### Performance

در حالت Development:
- Minification خاموش است
- Source maps فعال است
- Console.log ها نمایش داده می‌شوند

در حالت Production (build):
- Minification فعال است
- Console.log ها حذف می‌شوند
- Size بهینه است

### Environment Variables

در صورت نیاز، فایل `.env.local` ایجاد کنید:

```env
VITE_API_URL=http://localhost:3001
VITE_APP_TITLE=فیلتربین
```

استفاده در کد:

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 🎨 ساختار پروژه در Development

```
filterbin-main/
├── index.html              # Entry point
├── css/                    # Stylesheets
├── js/                     # JavaScript
├── assets/                 # Images, fonts
├── components/             # HTML components
├── pages/                  # Additional pages
├── pwa/                    # PWA files
└── node_modules/           # Dependencies
```

---

## 📊 Monitoring Development

### Vite Dev Server

```
  VITE v5.0.0  ready in 523 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.100:3000/
  ➜  press h to show help
```

### کلیدهای میانبر

در terminal:

- `h` - نمایش راهنما
- `r` - restart server
- `u` - نمایش URL
- `o` - باز کردن در مرورگر
- `c` - پاک کردن console
- `q` - خروج

---

## 🔍 Debugging

### Browser DevTools

1. باز کردن DevTools (F12)
2. Sources tab
3. Network tab برای بررسی requests
4. Console برای logs

### VS Code

فایل `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

---

## 📦 Build برای Production

### قدم 1: Build

```bash
npm run build
```

### قدم 2: Preview

```bash
npm run preview
```

### قدم 3: بررسی فایل‌های dist

```
dist/
├── index.html
├── assets/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── fonts/
├── _headers
├── _redirects
└── ...
```

### قدم 4: تست

```bash
# Size check
du -sh dist/

# File count
find dist/ -type f | wc -l

# Lighthouse test
lighthouse http://localhost:4173 --view
```

---

## 🚀 آماده Deploy

بعد از تست موفق:

```bash
# Commit changes
git add .
git commit -m "Ready for production"
git push origin main
```

CloudFlare Pages به صورت خودکار deploy می‌کند!

---

## 📞 پشتیبانی

در صورت بروز مشکل:

1. بررسی Console در browser
2. بررسی Terminal output
3. چک کردن `package.json` scripts
4. مطالعه [Vite Docs](https://vitejs.dev/)

---

**نکته:** همیشه قبل از deploy، یکبار `npm run build` و `npm run preview` را اجرا کنید!
