# 📖 README - Bermuda Royal Hospitality System

## 🏨 نظام إدارة الفنادق المتكامل

تطبيق Full-Stack حديث لإدارة الفنادق والحجوزات والغرف والعملاء والموظفين.

---

## 🎯 المميزات الرئيسية

✅ **نظام مصادقة متقدم** - موظفين وعملاء  
✅ **إدارة الفنادق والغرف** - CRUD كامل  
✅ **نظام الحجوزات الذكي** - مع حساب الأسعار التلقائي  
✅ **معالج الدفع** - محاكاة الدفع الآمنة  
✅ **التقارير والإحصائيات** - رسوم بيانية متقدمة  
✅ **سجلات التدقيق** - تتبع جميع العمليات  
✅ **واجهة سهلة الاستخدام** - RTL عربي

---

## 🛠️ التكنولوجيا المستخدمة

### الواجهة الأمامية
- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Mantine UI** - Component library
- **Framer Motion** - Animations

### الخلفية
- **Laravel 11** - PHP framework
- **MySQL** - Database
- **PHP 8.3** - Server language

### الخدمات المتكاملة
- **Firebase** - Authentication
- **Google Genkit** - AI/ML

---

## 📊 الحالة الحالية

| المكون | النسخة | الحالة |
|-------|--------|--------|
| Next.js | 15.1.11 | ✅ |
| React | 19.2.6 | ✅ |
| Laravel | 11 | ✅ |
| PHP | 8.3 | ✅ |
| TypeScript | 5.7 | ✅ |
| MySQL | 8.0 | ✅ |

---

## 🚀 البدء السريع

### تشغيل محلي
```bash
# الواجهة الأمامية
npm run dev

# الخلفية (في terminal منفصل)
npm run backend

# أو استخدم F5 في VS Code لتشغيل الاثنين معاً
```

### زيارة التطبيق
- الواجهة: http://localhost:9002
- الخلفية: http://localhost:8000

---

## 📁 بنية المشروع

```
bermuda/
├── src/
│   ├── app/              # Next.js pages & routes
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities & configs
│   └── ai/              # Genkit AI flows
│
├── laravel-backend/     # Laravel backend
│   ├── app/
│   │   ├── Http/        # Controllers
│   │   ├── Models/      # Database models
│   │   └── Services/    # Business logic
│   ├── routes/          # API routes
│   ├── database/        # Migrations & seeders
│   └── config/          # Configuration
│
├── public/              # Static assets
└── .next/              # Build output
```

---

## 🔒 حسابات الاختبار

### موظف
```
Username: abouda7
Password: Abouda2004#
```

### عميل
```
ID: 12345678901234
Password: 123456
```

---

## 📋 قائمة المسارات

### الصفحات الثابتة
- `/` - الصفحة الرئيسية
- `/audit-logs` - سجلات التدقيق
- `/checkout` - الدفع
- `/customer` - تفاصيل العميل
- `/dashboard` - لوحة التحكم
- `/reports` - التقارير
- و 14 صفحة أخرى

### الصفحات الديناميكية
- `/cities/[id]` - تفاصيل المدينة
- `/hotels/[id]` - تفاصيل الفندق
- `/invoice/[id]` - تفاصيل الفاتورة
- و 4 مسارات ديناميكية أخرى

---

## 🌐 الرفع على الاستضافة

### الخيار الأول: Vercel + Railway
```bash
# 1. أنشئ مستودع GitHub
git init && git add . && git commit -m "Initial commit"

# 2. ارفعه إلى GitHub
git remote add origin https://github.com/YOUR_USERNAME/bermuda-app.git
git push -u origin main

# 3. اذهب إلى Vercel.com وربط GitHub
# 4. اذهب إلى Railway.app وأضف الخلفية وقاعدة البيانات
```

### الروابط الحية
- **الواجهة:** https://bermuda-app.vercel.app
- **الخلفية:** https://bermuda-backend.railway.app
- **الحالة:** 🟢 Live

للتفاصيل، اقرأ [LIVE_DEPLOYMENT.md](./LIVE_DEPLOYMENT.md)

---

## 📦 متطلبات التشغيل

### محلي
- Node.js 20+
- PHP 8.3+
- MySQL 8.0+
- Composer
- npm

### على الاستضافة
- Vercel (مجاني)
- Railway (مجاني مع $5 رصيد)
- GitHub (لإدارة الكود)

---

## 📊 الأداء

- **Build Size:** 105 kB (First Load JS)
- **Pages:** 26 صفحة محسنة
- **CDN:** Vercel Global CDN
- **Database:** MySQL auto-scaling

---

## 🔐 الأمان

✅ TypeScript للتحقق من الأنواع  
✅ XSS Protection  
✅ CSRF Protection  
✅ SQL Injection Prevention  
✅ Environment Variables  
✅ HTTPS على الاستضافة

---

## 🤝 المساهمة

هذا المشروع مفتوح للمساهمة! يمكنك:
1. Fork المستودع
2. Create feature branch
3. Commit تغييراتك
4. Push وفتح Pull Request

---

## 📞 الدعم

- الوثائق: اقرأ ملفات MD في المشروع
- المشاكل: افتح GitHub Issue
- البريد: support@bermuda.app

---

## 📜 الترخيص

جميع الحقوق محفوظة © 2026 Bermuda Royal

---

## 🎯 الخطوات التالية

1. ✅ [قراءة QUICK_START.md](./QUICK_START.md)
2. ✅ [اتباع LIVE_DEPLOYMENT.md](./LIVE_DEPLOYMENT.md)
3. ✅ [استكشاف DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

**استمتع بـ Bermuda! 🚀🏨**
