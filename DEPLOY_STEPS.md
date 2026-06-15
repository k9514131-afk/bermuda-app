# 🚀 خطوات النشر الفعلية - Bermuda Royal Hospitality

## ⚠️ ملاحظة هامة
للنشر الفعلي على الاستضافة المجانية، تحتاج إلى إنشاء حسابات على المنصات التالية:
- GitHub (مجاني)
- Vercel (مجاني)
- Railway (مجاني)

---

## الخطوة 1: إنشاء حساب على GitHub

1. اذهب إلى https://github.com
2. اضغط "Sign up" لإنشاء حساب مجاني
3. أكمل عملية التسجيل باستخدام بريدك الإلكتروني

---

## الخطوة 2: إنشاء مستودع جديد على GitHub

1. بعد تسجيل الدخول، اضغط "+" في الزاوية العلوية
2. اختر "New repository"
3. املأ البيانات:
   - **Repository name:** `bermuda-app`
   - **Description:** `Bermuda Royal Hospitality System - Hotel Management`
   - **Public/Private:** Public (للنشر المجاني)
4. اضغط "Create repository"

---

## الخطوة 3: ربط ورفع المشروع على GitHub

بعد إنشاء المستودع، ستحصل على رابط مثل:
```
https://github.com/YOUR_USERNAME/bermuda-app.git
```

ثم قم بتنفيذ الأوامر التالية في Terminal:

```bash
cd "c:\Users\Alh16\Downloads\عبووود\Bermuda"

# استبدل YOUR_USERNAME باسم المستخدم الخاص بك على GitHub
git remote add origin https://github.com/YOUR_USERNAME/bermuda-app.git

# رفع المشروع
git push -u origin main
```

إذا طلب منك اسم المستخدم وكلمة المرور:
- **Username:** اسم مستخدم GitHub الخاص بك
- **Password:** استخدم Personal Access Token (ليس كلمة المرور العادية)

### كيفية إنشاء Personal Access Token:
1. GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. اضغط "Generate new token (classic)"
3. أعطه اسماً واختر الصلاحيات المطلوبة (repo, workflow)
4. انسخ التوكن واستخدمه ككلمة المرور

---

## الخطوة 4: النشر على Vercel

### 4.1 إنشاء حساب على Vercel
1. اذهب إلى https://vercel.com
2. اضغط "Sign Up"
3. اختر "Continue with GitHub"
4. اقبل الصلاحيات المطلوبة

### 4.2 نشر المشروع
1. بعد تسجيل الدخول، اضغط "Add New" → "Project"
2. ابحث عن مستودع `bermuda-app` في قائمة GitHub
3. اضغط "Import"

### 4.3 إعدادات النشر
سيتم اكتشاف Next.js تلقائياً. تأكد من:
- **Framework Preset:** Next.js
- **Root Directory:** `./`
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### 4.4 متغيرات البيئة
في قسم Environment Variables، أضف:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
```
(يمكنك تركه فارغاً مؤقتاً إذا لم تنشر الباك إند بعد)

### 4.5 النشر النهائي
- اضغط "Deploy"
- انتظر 2-3 دقائق
- ستحصل على رابط مثل: `https://bermuda-app.vercel.app`

---

## الخطوة 5: النشر على Railway (للباك إند)

### 5.1 إنشاء حساب على Railway
1. اذهب إلى https://railway.app
2. اضغط "Login" → "Continue with GitHub"
3. اقبل الصلاحيات المطلوبة

### 5.2 نشر الباك إند
1. اضغط "New Project" → "Deploy from GitHub"
2. اختر مستودع `bermuda-app`
3. في Root Directory، أدخل: `laravel-backend`
4. اضغط "Deploy"

### 5.3 إضافة قاعدة البيانات
1. بعد نشر الباك إند، اضغط "New Service" → "Database" → "MySQL"
2. سيتم إنشاء قاعدة بيانات MySQL مجانية

### 5.4 إعدادات البيئة
اذهب إلى Settings → Variables، وأضف:
```
APP_NAME=Bermuda Royal Hospitality
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=mysql
DB_HOST=${MYSQLHOST}
DB_PORT=${MYSQLPORT}
DB_DATABASE=${MYSQLDATABASE}
DB_USERNAME=${MYSQLUSER}
DB_PASSWORD=${MYSQLPASSWORD}
```

### 5.5 تشغيل الترحيلات
اذهب إلى Deployments → أحدث deployment → Logs
ابحث عن الأمر لتشغيل الترحيلات، أو أضف في Variables:
```
COMMAND=php artisan migrate --seed
```

### 5.6 الحصول على الرابط
اذهب إلى Settings → Domains
ستحصل على رابط مثل: `https://bermuda-backend-production.railway.app`

---

## الخطوة 6: ربط الواجهة بالباك إند

1. اذهب إلى مشروعك على Vercel
2. Settings → Environment Variables
3. عدّل `NEXT_PUBLIC_API_URL` إلى:
```
NEXT_PUBLIC_API_URL=https://bermuda-backend-production.railway.app/api
```
4. اضغط "Save"
5. اذهب إلى Deployments → أحدث deployment → Redeploy

---

## الخطوة 7: اختبار الروابط النهائية

### الواجهة الأمامية:
```
https://bermuda-app.vercel.app
```

### الباك إند:
```
https://bermuda-backend-production.railway.app/api
```

### اختبار الباك إند:
```
https://bermuda-backend-production.railway.app/api/hotels
```

---

## الروابط النهائية

بعد إتمام جميع الخطوات، ستحصل على:

| المكون | الرابط | المنصة |
|-------|--------|--------|
| الواجهة الأمامية | `https://bermuda-app.vercel.app` | Vercel (مجاني) |
| الباك إند | `https://bermuda-backend-production.railway.app/api` | Railway (مجاني) |
| قاعدة البيانات | MySQL على Railway | Railway (مجاني) |

---

## الدعم الفني

- GitHub: https://github.com/docs
- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app

---

## ملاحظات هامة

1. **الاستضافة المجانية كافية للاستخدام الشخصي والتجريب**
2. **يمكن الترقية لخطط مدفوعة للحصول على مزيد من الموارد**
3. **الروابط المجانية تحتوي على اسم المنصة (vercel.app, railway.app)**
4. **يمكن ربط دومين خاص إذا لزم الأمر**

---

**استمتع بنشر مشروع Bermuda Royal Hospitality! 🚀🏨**
