import { redirect } from 'next/navigation';

/**
 * @fileOverview صفحة التحويل - تم دمجها مع سجل الحجوزات الموحد لضمان صفحة رسمية واحدة.
 */
export default function EmployeeDashboardRedirect() {
  redirect('/dashboard');
}
