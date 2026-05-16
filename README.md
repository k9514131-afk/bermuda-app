# 🏨 Bermuda Royal Hospitality - المنظومة الملكية المتكاملة

أهلاً بك في النسخة النهائية والأكثر تطوراً لمنظومة إدارة الفنادق (Bermuda PMS). مشروع Full-Stack حقيقي يجمع بين Next.js 15 و Laravel 11.

---

## 🚀 التشغيل السريع (Quick Start)

### 1. الباك إند (Laravel)
```bash
cd laravel-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```
السيرفر سيشتغل على: `http://localhost:8000`

### 2. الفرونت إند (Next.js)
من المجلد الرئيسي:
```bash
npm install
npm run dev
```
افتح المتصفح على: `http://localhost:9002`

### أوامر بدء سريعة
```bash
npm run dev:open   # فتح المتصفح تلقائياً ثم تشغيل dev server
npm run backend    # تشغيل Laravel backend على http://127.0.0.1:8000
```

إذا كنت تستخدم VS Code، يمكنك أيضاً تشغيل المهام من لوحة Tasks:
- Start Frontend (Next.js)
- Start Backend (Laravel)
- Open Browser to Frontend


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
**تم التطوير والإشراف الفني بواسطة برمودا الملكية 2026. جميع الحقوق محفوظة.**