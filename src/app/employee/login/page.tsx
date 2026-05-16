
"use client"

import React, { useEffect } from 'react';
import { usePortal } from '@/components/portal-provider';
import { useRouter } from 'next/navigation';
import { AuthContainer } from '@/components/auth/auth-container';
import { PortalNav } from '@/components/shared/portal-nav';

/**
 * @fileOverview صفحة دخول الموظفين (Staff Login) - مع تحصين ضد الوميض
 */
export default function StaffLoginPage() {
  const { user, mounted } = usePortal();
  const router = useRouter();

  // تحويل فوري إذا كان الموظف مسجل دخول بالفعل
  useEffect(() => {
    if (mounted && user && user.role === 'staff') {
      router.replace('/dashboard');
    }
  }, [user, mounted, router]);

  // لا تظهر أي شيء إذا كان الموظف مسجل دخول أو النظام لم يكتمل تحميله
  if (!mounted || user) return null;

  return (
    <main className="h-screen bg-background flex flex-col overflow-hidden relative transition-colors duration-500">
      <PortalNav />
      <div className="flex-1 flex items-center justify-center p-4 w-full pt-20">
        <div className="transform translate-y-[8px] w-full flex justify-center">
          <AuthContainer forceMode="staff" />
        </div>
      </div>
    </main>
  );
}
