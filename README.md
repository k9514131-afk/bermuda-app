# 🏨 Bermuda Royal Hospitality - المنظومة الملكية المتكاملة

أهلاً بك في النسخة النهائية والأكثر تطوراً لمنظومة إدارة الفنادق (Bermuda PMS). مشروع Full-Stack حقيقي يجمع بين Next.js 15 و Laravel 11.

---

## 🚀 التشغيل السريع (Quick Start)

### الطريقة الأولى: زر البدء السريع ⭐
انقر مرتين على ملف `start-quick.bat` لفتح المشروع تلقائياً في المتصفح

### الطريقة الثانية: أوامر npm
```bash
npm install
npm run dev:open   # فتح المتصفح تلقائياً ثم تشغيل dev server
```

### الطريقة الثالثة: تشغيل كامل
```bash
# Terminal 1 - Backend
cd laravel-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve

# Terminal 2 - Frontend
npm run dev
```

### العناوين:
- **الواجهة الأمامية:** `http://localhost:3000`
- **الخلفية:** `http://localhost:8000`

---

## 🗄️ قاعدة البيانات (MySQL)
تعتمد المنظومة على قاعدة بيانات: **`bermuda_db`**
ملف SQL الكامل موجود في: `laravel-backend/database_export.sql`

### استيراد البيانات يدويًا:
```bash
mysql -u root -p bermuda_db < laravel-backend/database_export.sql
```
أو عبر الترحيل التلقائي:
```bash
php artisan migrate --seed
```

---

## 🧪 بيانات الاختبار المعتمدة

### 👨‍💼 حساب الموظف (Staff)
*   **Username:** `abouda7`
*   **Password:** `Abouda2004#`

### 👤 حساب العميل (Customer)
*   **Identity (ID):** `12345678901234`
*   **Password:** `123456`

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

---

## 📊 الحالة الحالية

| المكون | النسخة | الحالة |
|-------|--------|--------|
| Next.js | 15.1.11 | ✅ |
| React | 19.2.6 | ✅ |
| Laravel | 11 | ✅ |
| TypeScript | 5.7 | ✅ |
| MySQL | 8.0 | ✅ |

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
├── laravel-backend/     # Laravel backend
│   ├── app/
│   │   ├── Http/        # Controllers
│   │   ├── Models/      # Database models
│   │   └── Services/    # Business logic
│   ├── routes/          # API routes
│   ├── database/        # Migrations & seeders
│   └── config/          # Configuration
├── public/              # Static assets
└── start-quick.bat      # زر البدء السريع
```

---

---
**تم التطوير والإشراف الفني بواسطة برمودا الملكية 2026. جميع الحقوق محفوظة.**