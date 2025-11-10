# 🚀 راهنمای استقرار (Deployment)

این سند راهنمای کامل استقرار پروژه فیلتربین را شرح می‌دهد.

---

## 📋 پیش‌نیازها

قبل از استقرار، اطمینان حاصل کنید که موارد زیر را انجام داده‌اید:

- ✅ Node.js 18+ نصب شده باشد
- ✅ NPM یا Yarn نصب شده باشد
- ✅ Git نصب شده باشد
- ✅ دسترسی به سرویس هاستینگ (Netlify، Vercel، CloudFlare Pages، etc.)

---

## 🔨 آماده‌سازی برای Production

### ۱. نصب Dependencies

```bash
npm install
```

### ۲. ایجاد آیکون‌های PWA

```bash
# گزینه ۱: استفاده از PWA Asset Generator
npm install -g pwa-asset-generator
pwa-asset-generator assets/logo/logo.svg ./pwa/icons --background "#020203" --opaque false

# گزینه ۲: دستی
# طبق راهنمای pwa/icons/README.md عمل کنید
```

### ۳. Build Project

```bash
npm run build
```

فایل‌های نهایی در پوشه `dist/` ایجاد می‌شوند.

### ۴. تست Local

```bash
npm run preview
```

سایت را در `http://localhost:4173` مشاهده کنید.

---

## 🌐 استقرار روی Netlify

### روش ۱: Netlify CLI

```bash
# نصب Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# استقرار
netlify deploy --prod --dir=dist
```

### روش ۲: Git Integration

1. Repository را به GitHub push کنید
2. به Netlify.com بروید
3. "New site from Git" را انتخاب کنید
4. Repository را انتخاب کنید
5. تنظیمات Build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### تنظیمات Netlify

فایل `netlify.toml` ایجاد کنید:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://platform.twitter.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https:; frame-src https://platform.twitter.com"
```

---

## ☁️ استقرار روی Vercel

### روش ۱: Vercel CLI

```bash
# نصب Vercel CLI
npm install -g vercel

# Login
vercel login

# استقرار
vercel --prod
```

### روش ۲: Git Integration

1. Repository را به GitHub push کنید
2. به Vercel.com بروید
3. "New Project" را انتخاب کنید
4. Repository را انتخاب کنید
5. تنظیمات خودکار شناسایی می‌شوند

### تنظیمات Vercel

فایل `vercel.json` ایجاد کنید:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## 🔷 استقرار روی CloudFlare Pages

### روش ۱: Wrangler CLI

```bash
# نصب Wrangler
npm install -g wrangler

# Login
wrangler login

# استقرار
wrangler pages publish dist --project-name=filterbin
```

### روش ۲: Git Integration

1. Repository را به GitHub push کنید
2. به CloudFlare Dashboard بروید
3. Pages > Create a project
4. Repository را متصل کنید
5. تنظیمات Build:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`

---

## 🐳 استقرار با Docker

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Build و Run

```bash
# Build image
docker build -t filterbin:latest .

# Run container
docker run -d -p 80:80 --name filterbin filterbin:latest
```

---

## ✅ Checklist قبل از استقرار

### Performance
- [ ] `npm run build` بدون خطا اجرا شود
- [ ] حجم bundle‌ها بررسی شود (< 500KB)
- [ ] تصاویر بهینه‌سازی شده باشند
- [ ] Lazy loading فعال باشد

### امنیت
- [ ] تمام console.log ها حذف شده باشند
- [ ] Environment variables تنظیم شده باشند
- [ ] Security headers فعال باشند
- [ ] HTTPS فعال باشد

### SEO
- [ ] Sitemap.xml به‌روز باشد
- [ ] robots.txt صحیح باشد
- [ ] Meta tags تمام صفحات تنظیم شده باشند
- [ ] Structured data اضافه شده باشد

### PWA
- [ ] آیکون‌های PWA ایجاد شده باشند
- [ ] manifest.json صحیح باشد
- [ ] Service Worker فعال باشد

### Accessibility
- [ ] تمام تصاویر alt text داشته باشند
- [ ] Keyboard navigation کار کند
- [ ] Color contrast مناسب باشد
- [ ] ARIA labels تنظیم شده باشند

---

## 🔍 بررسی بعد از استقرار

### Performance Testing

```bash
# Lighthouse
lighthouse https://yoursite.com --view

# PageSpeed Insights
# https://pagespeed.web.dev/
```

**هدف:**
- Performance Score: > 90
- Accessibility Score: > 95
- Best Practices Score: > 95
- SEO Score: > 95

### Security Testing

```bash
# Security Headers
curl -I https://yoursite.com | grep -i "x-"

# SSL Labs
# https://www.ssllabs.com/ssltest/
```

**هدف:**
- Security Headers: A+
- SSL/TLS: A+

### Functionality Testing

- [ ] تمام صفحات لود می‌شوند
- [ ] فرم‌ها کار می‌کنند
- [ ] جستجو کار می‌کند
- [ ] PWA نصب می‌شود
- [ ] حالت Offline کار می‌کند

---

## 🔄 CI/CD Pipeline

### GitHub Actions

فایل `.github/workflows/deploy.yml` ایجاد کنید:

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Netlify
      uses: netlify/actions/cli@master
      with:
        args: deploy --prod --dir=dist
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 📞 پشتیبانی

در صورت بروز مشکل:
1. لاگ‌ها را بررسی کنید
2. در GitHub Issues سوال بپرسید
3. با تیم پشتیبانی تماس بگیرید

---

**آخرین به‌روزرسانی:** ۲۰۲۵-۰۲-۰۶
