# ✅ پروژه شما آماده CloudFlare Pages است!

## 🎯 تنظیمات فعلی شما

### ✅ تنظیمات صحیح
```
Build command: npm run build ✅
Root directory: / ✅
Build comments: Enabled ✅
```

### ⚠️ باید اضافه کنید
```
Build output directory: dist
```

**مهم:** در قسمت Build output directory حتماً `dist` را وارد کنید!

---

## 📦 فایل‌های ایجاد شده

برای CloudFlare Pages:

| فایل | توضیحات | وضعیت |
|------|---------|-------|
| `wrangler.toml` | پیکربندی CloudFlare | ✅ |
| `.cloudflare-pages.json` | تنظیمات Build | ✅ |
| `functions/_middleware.js` | Headers و امنیت | ✅ |
| `public/_redirects` | Redirects و SPA | ✅ |
| `vite.config.js` | بهینه‌سازی شده | ✅ |
| `_headers` | Security Headers | ✅ |

---

## 🚀 راه‌اندازی سرور محلی

### دستورات دقیق (در Terminal اجرا کنید):

```powershell
# قدم 1: رفتن به پوشه پروژه
cd C:\Users\GRC\Desktop\filterbin-main

# قدم 2: نصب Dependencies (اولین بار)
npm install

# قدم 3: اجرای سرور Development
npm run dev
```

**نتیجه:** سرور روی `http://localhost:3000` اجرا می‌شود و مرورگر خودکار باز می‌شود.

---

## 🌐 دسترسی به سرور محلی

بعد از اجرای `npm run dev`:

### از همان کامپیوتر:
```
http://localhost:3000
```

### از موبایل/تبلت (همان شبکه):
```powershell
# ابتدا IP خود را پیدا کنید:
ipconfig

# سپس در موبایل:
http://YOUR_IP:3000
# مثال: http://192.168.1.5:3000
```

---

## 📋 مراحل Deploy به CloudFlare Pages

### روش 1: از طریق Git (پیشنهادی)

#### قدم 1: Commit و Push

```powershell
git add .
git commit -m "Ready for CloudFlare Pages"
git push origin main
```

#### قدم 2: در CloudFlare Dashboard

1. وارد **CloudFlare Dashboard** شوید
2. برو به **Pages** > **Create a project**
3. **Connect to Git**
4. Repository خود را انتخاب کنید
5. تنظیمات Build:

```
Framework preset: Vite
Build command: npm run build
Build output directory: dist    ← مهم!
Root directory: /
Environment variables:
  NODE_VERSION = 18
```

6. **Save and Deploy**

### روش 2: Direct Upload (سریع)

```powershell
# قدم 1: Build
npm run build

# قدم 2: در CloudFlare Dashboard
# Pages > Upload assets
# انتخاب پوشه dist
# Deploy
```

---

## 🔍 بررسی نهایی قبل از Deploy

### چک‌لیست سریع:

```powershell
# تست Build
npm run build
# باید بدون خطا تمام شود

# تست Preview
npm run preview
# باز می‌شود: http://localhost:4173

# بررسی پوشه dist
ls dist/
# باید شامل: index.html, assets/, _headers, ...
```

اگر همه موارد بالا کار کرد، آماده Deploy هستید! ✅

---

## 📊 نتیجه Deploy

بعد از Deploy موفق:

```
✅ Production URL: https://filterbin.pages.dev
✅ Build Time: ~2-3 دقیقه
✅ Auto-deploy: هر Push = Deploy جدید
```

---

## 🐛 مشکلات رایج و راه‌حل

### مشکل 1: npm: command not found

**راه‌حل:**
```powershell
# نصب Node.js از:
https://nodejs.org/
# نسخه 18 یا بالاتر
```

### مشکل 2: پورت 3000 در حال استفاده

**راه‌حل:**
```powershell
npm run dev -- --port 3001
```

### مشکل 3: Build Failed

**راه‌حل:**
```powershell
# پاک کردن و نصب مجدد
rm -r node_modules
npm install
npm run build
```

### مشکل 4: سایت در CloudFlare کار نمی‌کند

**بررسی کنید:**
- [ ] Build output directory = `dist`
- [ ] Branch = `main`
- [ ] Build command = `npm run build`

---

## 📚 مستندات کامل

برای اطلاعات بیشتر:

1. **[CLOUDFLARE_DEPLOYMENT.md](CLOUDFLARE_DEPLOYMENT.md)** - راهنمای کامل Deploy
2. **[CLOUDFLARE_CHECKLIST.md](CLOUDFLARE_CHECKLIST.md)** - چک‌لیست جامع
3. **[START_LOCAL_SERVER.md](START_LOCAL_SERVER.md)** - راهنمای سرور محلی

---

## 🎯 دستورات سریع

### Development
```powershell
npm run dev          # سرور محلی
```

### Production
```powershell
npm run build        # ساخت فایل‌های نهایی
npm run preview      # پیش‌نمایش build
```

### Deploy
```powershell
git add .
git commit -m "Deploy"
git push origin main
```

---

## ✅ وضعیت نهایی

```
📦 فایل‌ها: ✅ آماده
⚙️ تنظیمات: ✅ صحیح
🚀 Deploy: ✅ آماده
📱 Mobile: ✅ Responsive
🔒 Security: ✅ فعال
⚡ Performance: ✅ بهینه
```

---

## 🎉 شروع کنید!

### برای دیدن سایت در Local:

```powershell
cd C:\Users\GRC\Desktop\filterbin-main
npm install
npm run dev
```

### برای Deploy:

1. تنظیم **Build output directory: dist** در CloudFlare
2. Push به Git
3. منتظر بمانید (~2-3 دقیقه)
4. لذت ببرید! 🎊

---

**نکته مهم:** اگر اولین بار است که `npm` استفاده می‌کنید، ابتدا [Node.js](https://nodejs.org/) را نصب کنید.

**پشتیبانی:** در صورت بروز مشکل، فایل‌های راهنمای بالا را مطالعه کنید.

---

**آخرین به‌روزرسانی:** ۲۰۲۵-۰۲-۰۶  
**وضعیت:** 🟢 Production Ready
