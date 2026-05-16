/**
 * @fileOverview محرك الـ API الرسمي - Bermuda API Engine v1.5
 * يدعم الربط الحقيقي مع سيرفر Laravel مع معالجة ذكية لأخطاء الشبكة والتوثيق.
 */

function getApiBaseUrl(): string {
  // If explicitly set (e.g. local Laravel dev), use it
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  // Server-side in Vercel: use VERCEL_URL env (auto-provided by Vercel)
  if (typeof window === 'undefined' && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api`;
  }
  // Client-side on Vercel or local Next.js API routes
  if (typeof window !== 'undefined') return '/api';
  // Local dev fallback
  return 'http://127.0.0.1:8000/api';
}
const API_BASE_URL = getApiBaseUrl();

/**
 * دالة طلب البيانات المركزية
 * @param endpoint - المسار المطلوب (مثلاً /bookings)
 * @param options - إعدادات الطلب (Method, Body, Headers)
 */
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const isClient = typeof window !== 'undefined';
  
  // استرداد توكن التوثيق من التخزين المحلي
  const token = isClient ? localStorage.getItem('bermuda_token') : null;
  
  // تجهيز الهيدرز الموحدة للمنظومة
  const headers: any = {
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    // معالجة الردود غير الناجحة (4xx, 5xx)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network response was not ok' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();

    // حفظ التوكن الجديد تلقائياً في حال وجوده في الرد
    if (data && data.access_token && isClient) {
      localStorage.setItem('bermuda_token', data.access_token);
    }
    
    return data;
  } catch (error: any) {
    // تمييز أخطاء انقطاع الاتصال بالسيرفر بشكل أوسع (حسب المتصفح/البيئة)
    const message = String(error?.message || '');
    if (error instanceof TypeError || /failed to fetch|network|load failed|fetch/i.test(message)) {
      throw new Error('DATABASE_OFFLINE');
    }
    throw error;
  }
}
