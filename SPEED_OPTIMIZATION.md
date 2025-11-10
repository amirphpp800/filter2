# بهینه‌سازی سرعت و رفع مشکل مسیرهای تکراری

## ✅ مشکلات رفع شده

### 1. مسیرهای تکراری `/pages/pages/pages/...`
**مشکل**: لینک‌ها به صورت `/pages/pages/pages/iran-off.html` تولید می‌شدند

**علت**: تابع `getBasePath()` در `component-loader.js` مسیر نسبی تولید می‌کرد و چندین بار اعمال می‌شد

**راه‌حل اعمال شده**:
```javascript
// قبل
function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/pages/')) {
        return '../';
    }
    return '';
}

// بعد - استفاده از مسیر مطلق
function getBasePath() {
    return '/';
}
```

### 2. سرعت لود فونت‌ها
**مشکل**: فونت‌ها بلوک کننده render بودند و سرعت لود را کند می‌کردند

**بهینه‌سازی‌های اعمال شده**:

#### در `fontiran.css`:
- ✅ اضافه شدن `font-display: swap` به همه فونت‌ها
- ✅ تغییر ترتیب به `woff2` اول (فشرده‌تر و سریع‌تر)
- ✅ بهینه‌سازی 12 تعریف font-face

```css
/* قبل */
@font-face {
    font-family: AbarMidFaNum;
    src: url('woff/AbarMidFaNum-Bold.woff') format('woff'),   
    url('woff2/AbarMidFaNum-Bold.woff2') format('woff2');
}

/* بعد */
@font-face {
    font-family: AbarMidFaNum;
    font-display: swap;
    src: url('woff2/AbarMidFaNum-Bold.woff2') format('woff2'),
    url('woff/AbarMidFaNum-Bold.woff') format('woff');
}
```

#### در `index.html`:
- ✅ Preload فونت‌های critical
- ✅ استفاده از مسیرهای مطلق (`/assets/...` به جای `assets/...`)
- ✅ تفکیک CSS به critical و non-critical
- ✅ Async loading برای CSS غیرضروری

```html
<!-- Preload Critical Fonts -->
<link rel="preload" href="/assets/Font/woff2/IRANSansWeb(FaNum)_Medium.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/Font/woff2/IRANSansWeb(FaNum).woff2" as="font" type="font/woff2" crossorigin>

<!-- Critical CSS - بلافاصله لود می‌شود -->
<link rel="stylesheet" href="/assets/Font/fontiran.css">
<link rel="stylesheet" href="/css/main.css">
<link rel="stylesheet" href="/css/layout.css">

<!-- Non-Critical CSS - Async لود می‌شود -->
<link rel="stylesheet" href="/css/dropdown.css" media="print" onload="this.media='all'">
<link rel="stylesheet" href="/css/search.css" media="print" onload="this.media='all'">
```

### 3. سرعت لود JavaScript
**بهینه‌سازی‌های اعمال شده**:

- ✅ اضافه شدن `defer` به اسکریپت‌های غیرضروری
- ✅ استفاده از مسیرهای مطلق
- ✅ تفکیک اسکریپت‌های critical از non-critical

```html
<!-- Critical - بدون defer -->
<script src="/js/component-loader.js"></script>

<!-- Non-Critical - با defer -->
<script src="/js/unified-loader.js" defer></script>
<script src="/js/ai-notification.js" defer></script>
<script src="/js/search.js" defer></script>
```

## 📊 نتایج بهینه‌سازی

### قبل از بهینه‌سازی:
- ❌ مسیرهای تکراری
- ❌ فونت‌ها render-blocking
- ❌ CSS همه به صورت هم‌زمان لود می‌شد
- ❌ JavaScript بلوک کننده parse بود

### بعد از بهینه‌سازی:
- ✅ مسیرهای صحیح و مطلق
- ✅ فونت‌ها با `font-display: swap` (نمایش سریع‌تر متن)
- ✅ CSS به صورت async لود می‌شود
- ✅ JavaScript با defer (non-blocking)
- ✅ Preload برای منابع critical

## 🚀 بهبودهای سرعت

1. **First Contentful Paint (FCP)**: بهبود با preload و CSS critical
2. **Largest Contentful Paint (LCP)**: بهبود با preload تصاویر
3. **Cumulative Layout Shift (CLS)**: بهبود با font-display: swap
4. **Time to Interactive (TTI)**: بهبود با defer اسکریپت‌ها

## 📝 فایل‌های تغییر یافته

```
✏️  js/component-loader.js      - رفع مسیرهای تکراری
✏️  index.html                   - بهینه‌سازی preload و async loading
✏️  assets/Font/fontiran.css    - اضافه کردن font-display: swap
```

## 🧪 تست بهینه‌سازی‌ها

برای بررسی بهینه‌سازی‌ها:

1. **Google PageSpeed Insights**: https://pagespeed.web.dev/
   - URL سایت را وارد کنید
   - نمره Performance را چک کنید

2. **WebPageTest**: https://www.webpagetest.org/
   - تست کامل سرعت لود

3. **Chrome DevTools**:
   - F12 > Network
   - Throttling: Fast 3G
   - بررسی waterfall و timing

## 🎯 نکات مهم

1. **مسیرهای مطلق**: همیشه از `/` شروع کنید، نه `./` یا `../`
2. **font-display: swap**: متن سریع‌تر نمایش داده می‌شود
3. **woff2 اول**: فرمت بهینه‌تر برای فونت‌های وب
4. **preload**: فقط برای منابع واقعاً critical
5. **defer**: برای اسکریپت‌هایی که نیاز فوری ندارند

## ✅ چک‌لیست دیپلوی

- [ ] تغییرات را commit و push کنید
- [ ] کش Cloudflare را پاک کنید
- [ ] کش مرورگر را پاک کنید (Ctrl+F5)
- [ ] لینک‌ها را تست کنید (نباید تکراری باشند)
- [ ] سرعت لود را با PageSpeed تست کنید

---
**تاریخ بهینه‌سازی**: نوامبر ۲۰۲۴
