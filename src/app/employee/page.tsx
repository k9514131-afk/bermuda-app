"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePortal } from '@/components/portal-provider';

/**
 * @fileOverview صفحة التحويل الذكي لبوابة الموظف.
 * تم التأكد من انتظار حالة الارتواء قبل التحويل.
 */
export default function EmployeeRootPage() {
  const router = useRouter();
  const { user, mounted: isHydrated } = usePortal();

  useEffect(() => {
    if (!isHydrated) return;

    if (user && user.role === 'staff') {
      router.push('/employee/dashboard');
    } else {
      router.push('/employee/login');
    }
  }, [user, router, isHydrated]);

  return (
    <div className="h-screen bg-[#050A14] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );
}