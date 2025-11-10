# PWA Icons

این پوشه باید شامل آیکون‌های PWA باشد.

## آیکون‌های مورد نیاز:

- **72x72.png** - آیکون کوچک
- **96x96.png** - آیکون متوسط
- **128x128.png** - آیکون استاندارد
- **144x144.png** - آیکون برای Windows
- **152x152.png** - آیکون برای iOS
- **192x192.png** - آیکون استاندارد اندروید
- **256x256.png** - آیکون بزرگ
- **384x384.png** - آیکون خیلی بزرگ
- **512x512.png** - آیکون splash screen

## چگونه آیکون‌ها را ایجاد کنیم؟

### روش 1: استفاده از ابزار آنلاین
1. به سایت [RealFaviconGenerator](https://realfavicongenerator.net/) بروید
2. لوگوی اصلی خود را آپلود کنید
3. تنظیمات را انجام دهید
4. فایل‌ها را دانلود و در این پوشه قرار دهید

### روش 2: استفاده از ImageMagick (خط فرمان)

```bash
# نصب ImageMagick
# Windows: choco install imagemagick
# Mac: brew install imagemagick
# Linux: sudo apt-get install imagemagick

# ایجاد تمام سایزها از یک تصویر اصلی
convert logo.png -resize 72x72 72.png
convert logo.png -resize 96x96 96.png
convert logo.png -resize 128x128 128.png
convert logo.png -resize 144x144 144.png
convert logo.png -resize 152x152 152.png
convert logo.png -resize 192x192 192.png
convert logo.png -resize 256x256 256.png
convert logo.png -resize 384x384 384.png
convert logo.png -resize 512x512 512.png
```

### روش 3: استفاده از PWA Asset Generator (NPM)

```bash
npm install -g pwa-asset-generator

# ایجاد تمام آیکون‌ها و splash screens
pwa-asset-generator logo.svg ./pwa/icons --background "#020203" --opaque false
```

## نکات مهم:

1. **فرمت**: PNG با پس‌زمینه شفاف
2. **رنگ**: پس‌زمینه شفاف یا رنگ تم (#020203)
3. **Safe Zone**: 80% از مرکز آیکون باید محتوای اصلی باشد
4. **کیفیت**: حداقل 512x512 برای ایجاد سایزهای کوچکتر

## موقتاً:

می‌توانید از لوگوی موجود در `/assets/logo/logo.svg` استفاده کنید و آن را به PNG تبدیل کنید.

```bash
# اگر لوگو SVG دارید
npx @squoosh/cli --resize '{width:512,height:512}' assets/logo/logo.svg -d pwa/icons/
```
