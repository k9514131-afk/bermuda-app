<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * خدمة إدارة الصور والملفات
 */
class FileService 
{
    /**
     * رفع صورة وحفظ مسارها
     */
    public function uploadImage($file, $folder = 'general')
    {
        // 1. التحقق من أمان الملف
        $extension = $file->getClientOriginalExtension();
        $allowed = ['jpg', 'jpeg', 'png', 'webp'];
        
        if (!in_array(strtolower($extension), $allowed)) {
            throw new \Exception("نوع الملف غير مدعوم.");
        }

        // 2. توليد اسم فريد
        $fileName = Str::uuid() . '.' . $extension;
        
        // 3. التخزين في المجلد العام (Public)
        $path = $file->storeAs("public/images/{$folder}", $fileName);

        // 4. إرجاع الرابط القابل للوصول
        return Storage::url($path);
    }

    /**
     * حذف صورة من القرص
     */
    public function deleteImage($url)
    {
        $path = str_replace('/storage/', 'public/', $url);
        if (Storage::exists($path)) {
            Storage::delete($path);
        }
    }
}
