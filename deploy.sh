#!/bin/bash

# 🚀 سكريبت الرفع التلقائي - Bermuda Auto Deploy

echo "🔍 فحص التكوينات..."

# فحص وجود ملفات ضرورية
files_to_check=(".env" "package.json" "vercel.json" "Dockerfile")
for file in "${files_to_check[@]}"; do
    if [ ! -f "$file" ]; then
        echo "⚠️  تحذير: $file غير موجود"
    fi
done

echo "✅ فحص اكتمل"

# فحص Node.js و npm
if ! command -v node &> /dev/null; then
    echo "❌ Node.js غير مثبت. الرجاء تثبيت Node.js من nodejs.org"
    exit 1
fi

echo "📦 تثبيت التبعيات..."
npm install

echo "🔨 بناء المشروع..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ البناء نجح!"
    echo ""
    echo "🚀 المشروع جاهز للرفع!"
    echo ""
    echo "الخيارات:"
    echo "1. Vercel (الواجهة الأمامية)"
    echo "2. Railway (الخلفية + DB)"
    echo "3. Docker Compose (محلياً)"
else
    echo "❌ فشل البناء!"
    exit 1
fi
