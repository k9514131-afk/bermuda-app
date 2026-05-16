
"use client"

import React, { useEffect } from 'react';
import { usePortal } from '@/components/portal-provider';
import { useRouter } from 'next/navigation';
import { AuthContainer } from '@/components/auth/auth-container';
import { PortalNav } from '@/components/shared/portal-nav';

/**
 * @fileOverview صفحة دخول الضيوف (Customer Login) - مع تحصين ضد الوميض
 */
export default function CustomerLoginPage() {
  const { user, mounted } = usePortal();
  const router = useRouter();

  // تحويل فوري إذا كان المستخدم مسجل دخول بالفعل
  useEffect(() => {
    if (mounted && user && user.role === 'customer') {
      router.replace('/customer');
    }
  }, [user, mounted, router]);

  // لا تظهر أي شيء إذا كان المستخدم مسجل دخول أو النظام لم يكتمل تحميله
  if (!mounted || user) return null;

  return (
    <main className="h-screen bg-background flex flex-col overflow-hidden relative transition-colors duration-500">
      <PortalNav />
      <div className="flex-1 flex items-center justify-center p-4 w-full pt-20">
        <div className="transform translate-y-[8px] w-full flex justify-center">
          <AuthContainer forceMode="customer" />
        </div>
      </div>
    </main>
  );
}
