# 🚀 فیلتربین - پلتفرم تحلیل فناوری و سیاست دیجیتال

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/yourusername/filterbin)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/yourusername/filterbin)

وبسایت فیلتربین یک پلتفرم تحلیلی برای بررسی موضوعات فناوری، امنیت سایبری و سیاست‌های دیجیتال در ایران است.

## 🆕 نسخه 2.0.0 - بهبودهای جدید

- ⚡ **Performance**: Build process با Vite، Minification، Code Splitting
- 🔒 **Security**: Rate Limiting، بهبود CSP، حذف console.log
- 📱 **PWA**: بهبود Service Worker، راهنمای Icons
- 🎯 **SEO**: Sitemap به‌روز، Structured Data، SEO Enhancer
- ♿ **Accessibility**: Skip to Content، ARIA Labels، Screen Reader Support

برای جزئیات کامل: [CHANGELOG.md](CHANGELOG.md) | [IMPROVEMENTS.md](IMPROVEMENTS.md)

## 📁 ساختار پروژه

```
abzarestann3/
├── index.html                    # صفحه اصلی
├── css/
│   ├── main.css                  # استایل‌های اصلی
│   ├── article.css               # استایل مقالات
│   └── article-template.css      # استایل تمپلیت مقاله
├── js/
│   └── main.js                   # اسکریپت‌های اصلی
├── assets/
│   └── images/                   # تصاویر
├── data/
│   ├── articles/                 # مقالات HTML
│   │   ├── article-template.html # تمپلیت مقاله
│   │   ├── article-1.html
│   │   ├── article-2.html
│   │   └── README.md             # راهنمای تمپلیت
│   └── README.md                 # این فایل
└── README.md                     # راهنمای اصلی پروژه
```

## 🎨 ویژگی‌های طراحی

### استایل مدرن و تیره
- طراحی Dark Mode با رنگ‌های مدرن
- رنگ اصلی: قرمز (#9D0913)
- فونت فارسی: Vazirmatn
- انیمیشن‌های روان و جذاب

### Responsive Design
- بهینه برای Desktop، Tablet و Mobile
- Grid Layout برای نمایش مقالات
- Sticky Sidebar در صفحات مقاله

### المان‌های تعاملی
- دکمه‌های اشتراک‌گذاری (LinkedIn, WhatsApp, Telegram, X, Copy)
- مقالات مرتبط با hover effects
- برچسب‌های تعاملی
- کارت‌های مقاله با hover animations

## 🛠️ تکنولوژی‌ها

- **HTML5**: ساختار معنایی
- **CSS3**: استایل‌دهی پیشرفته با CSS Variables
- **JavaScript**: تعاملات و dynamic content
- **Responsive**: Mobile-first approach

## ایجاد مقاله جدید

برای ایجاد مقاله جدید:

1. فایل `data/articles/article-template.html` را کپی کنید
2. نام فایل را به `article-N.html` تغییر دهید
3. راهنمای کامل را در `data/articles/README.md` مطالعه کنید

## ساختار مقاله

هر مقاله شامل:
- **تصویر کاور**: در بالای کارت محتوا
- **عنوان و خلاصه**: در ابتدای محتوا
- **بدنه مقاله**: با عناوین، پاراگراف‌ها، لیست‌ها و نقل قول‌ها
- **برچسب‌ها**: در انتهای مقاله
- **سایدبار**: شامل دکمه‌های اشتراک‌گذاری و مقالات مرتبط

## 🎨 متغیرهای CSS

```css
:root {
    /* Colors */
    --primary-color: #9D0913;
    --dark-bg: #0a0a0a;
    --card-bg: #1a1a1a;
    --text-primary: #ffffff;
    --text-secondary: #b0b0b0;
    --text-muted: #808080;
    --border-color: rgba(255, 255, 255, 0.1);
    
    /* Spacing */
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 2rem;
    
    /* Border Radius */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 16px;
    --radius-xl: 24px;
    
    /* Fonts */
    --font-persian: 'Vazirmatn', sans-serif;
}
```

## 📱 Breakpoints

```css
/* Mobile */
@media (max-width: 480px) { ... }

/* Tablet */
@media (max-width: 768px) { ... }

/* Desktop */
@media (max-width: 1024px) { ... }
```

## 🚀 نصب و راه‌اندازی

### پیش‌نیازها
- Node.js 18+ و NPM
- مرورگر مدرن (Chrome, Firefox, Safari, Edge)
- ویرایشگر کد (VS Code توصیه می‌شود)

### نصب

```bash
# کلون کردن پروژه
git clone https://github.com/yourusername/filterbin.git

# ورود به پوشه پروژه
cd filterbin-main

# نصب dependencies
npm install
```

### Development

```bash
# شروع development server
npm run dev
```

سرور روی `http://localhost:3000` اجرا می‌شود.

### Production Build

```bash
# ساخت نسخه production
npm run build

# پیش‌نمایش build
npm run preview
```

فایل‌های build شده در پوشه `dist/` قرار می‌گیرند.

## 📦 ساختار فایل‌های CSS

### main.css
- متغیرهای CSS
- Reset و Base Styles
- Typography
- Layout و Grid
- Components (Cards, Buttons, etc.)

### article.css
- استایل‌های مخصوص صفحات مقاله
- Hero Section
- Content Layout
- Sidebar

### article-template.css
- استایل‌های تمپلیت مقاله
- Article Body
- Tags
- Share Buttons
- Related Articles

## 🎯 دسته‌بندی مقالات

- **تکنولوژی**: مقالات مربوط به فناوری‌های نوین
- **امنیت**: امنیت سایبری و حریم خصوصی
- **سیاست**: سیاست‌های دیجیتال و تنظیم‌گری
- **اقتصاد**: اقتصاد دیجیتال و استارت‌آپ‌ها

## ✨ ویژگی‌های کلیدی

### صفحه اصلی
- Hero Section با gradient background
- Grid مقالات با فیلتر دسته‌بندی
- مقالات ویژه (Featured)
- Footer با لینک‌های مهم

### صفحه مقاله
- تصویر کاور با فاصله از حاشیه‌ها
- محتوای غنی با عناوین، لیست‌ها و نقل قول‌ها
- Sticky Sidebar با اشتراک‌گذاری و مقالات مرتبط
- برچسب‌های تعاملی در انتها

## 🔧 سفارشی‌سازی

### تغ
