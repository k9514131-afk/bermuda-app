# 🚀 دليل النشر على الاستضافة المجانية

## الخيار الأفضل: Vercel (مجاني بالكامل) ⭐

### الخطوات البسيطة:

#### 1. إنشاء حساب على GitHub
- اذهب إلى https://github.com
- أنشئ حساب جديد إذا لم يكن لديك

#### 2. رفع المشروع على GitHub
```bash
# من مجلد المشروع
git init
git add .
git commit -m "Initial commit - Bermuda Royal Hospitality"
git branch -M main

# أنشئ مستودع جديد على GitHub ثم:
git remote add origin https://github.com/YOUR_USERNAME/bermuda-app.git
git push -u origin main
```

#### 3. النشر على Vercel
1. اذهب إلى https://vercel.com
2. سجل حساب مجاني باستخدام GitHub
3. اضغط "Add New" → "Project"
4. اختر مستودع `bermuda-app` من GitHub
5. اضغط "Import"

#### 4. إعدادات النشر
- **Framework Preset:** Next.js (سيتم اكتشافه تلقائياً)
- **Root Directory:** `./` (ترك كما هو)
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

#### 5. متغيرات البيئة (Environment Variables)
في قسم Environment Variables، أضف:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
```

#### 6. النشر النهائي
- اضغط "Deploy"
- انتظر 2-3 دقائق
- ستحصل على رابط مثل: `https://bermuda-app.vercel.app`

---

## الخيار الثاني: Railway (للباك إند) 🔵

### نشر Laravel Backend على Railway

#### 1. إنشاء حساب على Railway
- اذهب إلى https://railway.app
- سجل حساب مجاني باستخدام GitHub

#### 2. نشر الباك إند
1. اضغط "New Project" → "Deploy from GitHub"
2. اختر مستودع `bermuda-app`
3. في Root Directory، أدخل: `laravel-backend`
4. اضغط "Deploy"

#### 3. إضافة قاعدة البيانات
1. اضغط "New Service" → "Database" → "MySQL"
2. سيتم إنشاء قاعدة بيانات MySQL مجانية

#### 4. إعدادات البيئة
في قسم Variables، أضف:
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

#### 5. الحصول على الرابط
- اذهب إلى Settings → Domains
- ستحصل على رابط مثل: `https://bermuda-backend-production.railway.app`

---

## ربط الواجهة بالباك إند

### تحديث متغيرات Vercel
1. اذهب إلى مشروعك على Vercel
2. Settings → Environment Variables
3. عدّل `NEXT_PUBLIC_API_URL` إلى:
```
NEXT_PUBLIC_API_URL=https://bermuda-backend-production.railway.app/api
```
4. اضغط "Save" ثم "Redeploy"

---

## الروابط النهائية

بعد إتمام جميع الخطوات، ستحصل على:

| المكون | الرابط | المنصة |
|-------|--------|--------|
| الواجهة الأمامية | `https://bermuda-app.vercel.app` | Vercel (مجاني) |
| الباك إند | `https://bermuda-backend-production.railway.app` | Railway (مجاني) |
| قاعدة البيانات | MySQL على Railway | Railway (مجاني) |

---

## الميزات المجانية

### Vercel (مجاني):
- ✅ 100GB bandwidth شهرياً
- ✅ نشر تلقائي من GitHub
- ✅ SSL/HTTPS مجاني
- ✅ CDN عالمي
- ✅ Domain مخصص مجاني (.vercel.app)

### Railway (مجاني):
- ✅ $5 رصيد شهري مجاني
- ✅ قاعدة بيانات MySQL مجانية
- ✅ SSL/HTTPS مجاني
- ✅ نشر تلقائي من GitHub

---

## الدعم الفني

- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app
- GitHub: https://github.com/docs

---

## ملاحظات هامة

1. **الاستضافة المجانية كافية للاستخدام الشخصي والتجريب**
2. **يمكن الترقية لخطط مدفوعة للحصول على مزيد من الموارد**
3. **الروابط المجانية تحتوي على اسم المنصة (vercel.app, railway.app)**
4. **يمكن ربط دومين خاص إذا لزم الأمر**

---

**استمتع بنشر مشروع Bermuda Royal Hospitality! 🚀🏨**
