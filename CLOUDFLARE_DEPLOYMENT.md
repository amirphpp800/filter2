# ☁️ راهنمای کامل Deploy روی CloudFlare Pages

این سند راهنمای جامع deploy پروژه فیلتربین روی CloudFlare Pages است.

---

## 🎯 تنظیمات CloudFlare Pages Dashboard

### Build Configuration

```
Framework preset: None (یا Vite)
Build command: npm run build
Build output directory: dist
Root directory: / (پیش‌فرض)
Environment variables: (اختیاری)
  - NODE_VERSION = 18
  - NPM_VERSION = 9
```

### ✅ تنظیمات صحیح شما

```
Build command: npm run build ✅
Build output: dist ✅ (باید مشخص شود)
Root directory: / ✅
Build comments: Enabled ✅
```

**⚠️ نکته مهم:** Build output directory را حتماً روی `dist` تنظیم کنید.

---

## 📦 فایل‌های ایجاد شده

### 1. `wrangler.toml`
پیکربندی اصلی CloudFlare Workers/Pages

### 2. `.cloudflare-pages.json`
تنظیمات Build و Deployment

### 3. `functions/_middleware.js`
Middleware برای Headers و امنیت

### 4. `public/_redirects`
تنظیمات Redirect و SPA routing

---

## 🚀 روش‌های Deploy

### روش 1: Git Integration (پیشنهادی)

#### قدم 1: Push به GitHub

```bash
git add .
git commit -m "Ready for CloudFlare Pages"
git push origin main
```

#### قدم 2: اتصال به CloudFlare Pages

1. وارد CloudFlare Dashboard شوید
2. Pages > Create a project
3. Connect to Git
4. انتخاب Repository
5. تنظیمات Build:
   ```
   Framework: Vite
   Build command: npm run build
   Build output: dist
   ```
6. Save and Deploy

### روش 2: Wrangler CLI

#### نصب Wrangler

```bash
npm install -g wrangler
```

#### Login به CloudFlare

```bash
wrangler login
```

#### Deploy

```bash
# اولین deploy
wrangler pages project create filterbin

# Deploy فایل‌ها
wrangler pages deploy dist --project-name=filterbin
```

### روش 3: Direct Upload

#### قدم 1: Build

```bash
npm run build
```

#### قدم 2: Upload

1. CloudFlare Dashboard > Pages > Create a project
2. Upload assets
3. انتخاب پوشه `dist`
4. Deploy

---

## ⚙️ تنظیمات پیشرفته

### Environment Variables

در CloudFlare Pages Dashboard:

```
Settings > Environment variables

Production:
  NODE_VERSION = 18
  VITE_API_URL = https://api.filterbin.space
  
Preview:
  NODE_VERSION = 18
  VITE_API_URL = https://preview-api.filterbin.space
```

### Custom Domain

```
Settings > Custom domains

1. Add custom domain: filterbin.space
2. Add www: www.filterbin.space
3. CloudFlare automatically configures DNS
```

### Functions (اختیاری)

برای API endpoints:

```javascript
// functions/api/hello.js
export async function onRequest(context) {
  return new Response(JSON.stringify({
    message: 'سلام از CloudFlare Pages!'
  }), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    }
  });
}
```

---

## 🔧 تنظیمات خاص CloudFlare

### Headers

Headers در 3 سطح تعریف می‌شوند:

1. **`_headers` فایل** (Static)
2. **`functions/_middleware.js`** (Dynamic)
3. **Transform Rules** (Dashboard)

### Redirects

```
# در public/_redirects
/old-url   /new-url   301
/*         /index.html   200
```

### Cache Control

CloudFlare به طور خودکار:
- Static assets را cache می‌کند
- Edge caching فعال است
- Browser cache headers را رعایت می‌کند

برای کنترل بیشتر:

```javascript
// functions/_middleware.js
export async function onRequest({ next }) {
  const response = await next();
  response.headers.set('Cache-Control', 'public, max-age=3600');
  return response;
}
```

---

## 🎨 بهینه‌سازی برای CloudFlare

### 1. استفاده از CloudFlare CDN

```javascript
// در vite.config.js
export default defineConfig({
  base: '/', // نه './'
  build: {
    // ...
  }
});
```

### 2. فعال‌سازی Features

در CloudFlare Dashboard:

- ✅ **Auto Minify**: HTML, CSS, JS
- ✅ **Brotli Compression**
- ✅ **HTTP/3 (QUIC)**
- ✅ **Early Hints**
- ✅ **Rocket Loader** (اختیاری)

### 3. Image Optimization

```html
<!-- استفاده از CloudFlare Image Resizing -->
<img src="/cdn-cgi/image/width=800,quality=85/path/to/image.jpg" alt="تصویر">
```

### 4. Analytics

```
Dashboard > Analytics > Web Analytics
```

کد را به `<head>` اضافه کنید:

```html
<script defer src='https://static.cloudflareinsights.com/beacon.min.js' 
        data-cf-beacon='{"token": "YOUR_TOKEN"}'></script>
```

---

## 🔍 Preview Deployments

هر Push به branch غیر از main:

```
Branch: feature-x
Preview URL: https://feature-x.filterbin.pages.dev
```

### تنظیمات Preview

```
Settings > Builds & deployments

Preview deployments: Enabled
Branch deployments: All branches
```

---

## 🚨 Troubleshooting

### مشکل 1: Build Failed

**علت:** Dependencies نصب نشده

**راه حل:**
```bash
# حذف node_modules و lock file
rm -rf node_modules package-lock.json

# نصب مجدد
npm install

# تست local
npm run build
```

### مشکل 2: 404 Errors

**علت:** Routing اشتباه

**راه حل:**
```
# در public/_redirects
/*    /index.html   200
```

### مشکل 3: Headers کار نمی‌کند

**راه حل:** از Functions Middleware استفاده کنید:

```javascript
// functions/_middleware.js
export async function onRequest({ next }) {
  const response = await next();
  response.headers.set('X-Custom-Header', 'Value');
  return response;
}
```

### مشکل 4: Assets لود نمی‌شوند

**علت:** Base path اشتباه

**راه حل:**
```javascript
// vite.config.js
export default defineConfig({
  base: '/', // نه './'
});
```

---

## 📊 Performance Testing

بعد از Deploy:

### Lighthouse

```bash
lighthouse https://filterbin.pages.dev --view
```

### CloudFlare Speed Test

```
Dashboard > Speed > Test
```

### WebPageTest

```
https://www.webpagetest.org/
Test URL: https://filterbin.pages.dev
```

---

## 🔐 Security Best Practices

### 1. Security Headers

تمام headers در `_headers` و `functions/_middleware.js` تنظیم شده

### 2. HTTPS

CloudFlare به طور خودکار HTTPS فعال می‌کند

### 3. DDoS Protection

CloudFlare به طور پیش‌فرض محافظت می‌کند

### 4. Firewall Rules

```
Security > WAF

- Challenge bad bots
- Block countries (اختیاری)
- Rate limiting
```

---

## 📈 Monitoring

### Analytics

```
Dashboard > Analytics

- Page views
- Unique visitors
- Bandwidth
- Requests
```

### Logs

```
Dashboard > Real-time Logs

- HTTP requests
- Errors
- Performance metrics
```

### Alerts

```
Notifications > Add

- Deploy failed
- Site down
- High traffic
```

---

## 🔄 Rollback

در صورت مشکل:

```
Deployments > [Select deployment] > Rollback
```

یا با Git:

```bash
git revert HEAD
git push origin main
```

---

## 💡 نکات مهم

### ✅ انجام دهید

- همیشه تست local قبل از push
- Environment variables را جدا نگه دارید
- از Preview deployments برای تست استفاده کنید
- Performance را monitor کنید
- Backup از Database بگیرید (اگر دارید)

### ❌ انجام ندهید

- API keys را commit نکنید
- بدون تست deploy نکنید
- از `.env` فایل‌ها برای Production استفاده نکنید
- Cache را نادیده نگیرید
- Security headers را حذف نکنید

---

## 📚 منابع

### CloudFlare Docs

- [Pages Docs](https://developers.cloudflare.com/pages/)
- [Functions](https://developers.cloudflare.com/functions/)
- [Build Configuration](https://developers.cloudflare.com/configuration/)

### مستندات پروژه

- [README.md](README.md) - معرفی پروژه و راهنمای استفاده
- [DEPLOYMENT.md](DEPLOYMENT.md) - راهنمای عمومی Deploy
- [CHANGELOG.md](CHANGELOG.md) - تاریخچه تغییرات
- [CLOUDFLARE_READY.md](CLOUDFLARE_READY.md) - شروع سریع CloudFlare

---

## 🎯 Checklist Deploy

قبل از Deploy:

- [ ] `npm run build` بدون خطا
- [ ] تست در `npm run preview`
- [ ] Environment variables تنظیم شده
- [ ] Git repository آماده
- [ ] `.gitignore` صحیح
- [ ] `_headers` و `_redirects` موجود
- [ ] Security headers بررسی شده

بعد از Deploy:

- [ ] سایت لود می‌شود
- [ ] تمام صفحات کار می‌کنند
- [ ] Assets لود می‌شوند
- [ ] Headers صحیح است
- [ ] Performance خوب است (Lighthouse > 90)
- [ ] Mobile responsive است
- [ ] PWA نصب می‌شود

---

## 🎉 موفقیت!

اگر همه چیز درست کار کرد:

```
✅ Build: Success
✅ Deploy: Success  
✅ URL: https://filterbin.pages.dev
✅ Custom Domain: https://filterbin.space
```

---

**آخرین به‌روزرسانی:** ۲۰۲۵-۰۲-۰۶  
**سازگاری:** CloudFlare Pages (Workers)  
**وضعیت:** Production Ready ✅
