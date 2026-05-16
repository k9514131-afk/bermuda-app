# 🚀 دليل الرفع على الاستضافة

## الخيار الأول: Vercel (الواجهة الأمامية) - ⭐ الأفضل والأسهل

### الخطوات:
1. اذهب إلى [vercel.com](https://vercel.com) وسجل حساب
2. اضغط "New Project"
3. اختر "Continue with GitHub" (أو GitLab)
4. ربط مستودعك
5. اختر المشروع وسيتم الرفع تلقائياً
6. ستحصل على رابط مثل: `https://your-project.vercel.app`

### تحديث متغيرات البيئة:
في لوحة Vercel، اذهب إلى Settings → Environment Variables وأضف:
```
NEXT_PUBLIC_API_URL=https://your-backend.com/api
```

---

## الخيار الثاني: Railway (الخلفية - Laravel)

### الخطوات:
1. اذهب إلى [railway.app](https://railway.app)
2. اضغط "Create New Project"
3. اختر "Deploy from GitHub"
4. حدد المستودع و `laravel-backend` كـ root directory
5. أضف MySQL من Database
6. عيّن متغيرات البيئة من `.env.example`

---

## الخيار الثالث: Render (خيار بديل للخلفية)

### الخطوات:
1. اذهب إلى [render.com](https://render.com)
2. اختر "New +" ثم "Web Service"
3. ربط GitHub
4. اختر الفرع والمسار: `laravel-backend`
5. بيئة التشغيل: Docker
6. أضف خدمة MySQL منفصلة

---

## الخيار الرابع: Heroku (بديل لـ Railway)

### الخطوات:
1. ثبّت Heroku CLI
2. شغّل الأوامر:
```bash
heroku login
cd laravel-backend
heroku create your-app-name
heroku addons:create cleardb:ignite
git push heroku main
```

---

## الخيار الخامس: استضافة محلية (Self-Hosting)

### عبر Docker:
```bash
# بناء Docker image
docker build -t bermuda-app .

# تشغيل:
docker run -p 3000:3000 -p 8000:8000 bermuda-app
```

---

## 📋 متغيرات البيئة المطلوبة

### للواجهة الأمامية (.env.local):
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
NEXT_PUBLIC_APP_NAME=Bermuda
```

### للخلفية (laravel-backend/.env):
```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-backend-url.com
DB_CONNECTION=mysql
DB_HOST=your-mysql-host
DB_PORT=3306
DB_DATABASE=bermuda_db
DB_USERNAME=your_user
DB_PASSWORD=your_password
```

---

## ✅ بعد الرفع

1. تحديث `NEXT_PUBLIC_API_URL` في Vercel
2. اختبار الواجهة من الرابط المباشر
3. التأكد من اتصال API من الواجهة إلى الخلفية
4. مشاركة الرابط مع المستخدمين

---

## 🔗 روابط سريعة

- Vercel: https://vercel.com
- Railway: https://railway.app
- Render: https://render.com
- Heroku: https://heroku.com
- Docker: https://docker.com

