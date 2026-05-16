"use client"

import React from 'react';
import { usePortal } from '@/components/portal-provider';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { EgyptianHorizonLogo } from './horizon-logo';
import { cn } from '@/lib/utils';

/**
 * @component Footer
 * @description الفوتر الموحد للمنظومة - تم تنظيمه ليختفي في الصفحات الحساسة والتشغيلية لضمان التركيز.
 */
export function Footer() {
  const { user, isRTL, t } = usePortal();
  const pathname = usePathname();

  // الصفحات التشغيلية (واجهة الموظف)
  const isStaffArea = pathname?.startsWith('/dashboard') || 
                     pathname?.startsWith('/rooms') || 
                     pathname?.startsWith('/walk-in') || 
                     pathname?.startsWith('/reports') || 
                     pathname?.startsWith('/audit-logs') || 
                     pathname?.startsWith('/employee');

  // صفحات المصادقة (دخول، إنشاء حساب، استعادة كلمة السر)
  const isAuthPage = pathname === '/' || 
                     pathname?.includes('/login') || 
                     pathname?.includes('/register') || 
                     pathname === '/reset-password';

  // صفحات التدفق الحساس (الدفع، الفواتير، تعديل البيانات الشخصية)
  // يتم إخفاء الفوتر هنا لضمان أعلى درجات التركيز ومنع التشتت أثناء العمليات الحرجة
  const isSensitiveFlow = pathname?.includes('/checkout') || 
                         pathname?.includes('/invoice') ||
                         pathname === '/profile';

  // إخفاء الفوتر في الحالات المذكورة لضمان تجربة مستخدم احترافية
  if (!user || isStaffArea || isAuthPage || isSensitiveFlow) return null;

  return (
    <footer className="bg-card border-t border-border/50 py-8 md:py-16 relative z-10">
      <div className="container mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 sm:gap-6 md:gap-12 text-start">
        
        {/* Column 1: Logo & Description */}
        <div className="space-y-3 md:space-y-6 col-span-1 flex flex-col items-start">
          <div className={cn("flex items-center gap-3", isRTL ? "flex-row-reverse" : "flex-row")}>
             <EgyptianHorizonLogo isStatic={true} className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 shadow-none scale-100 rounded-[6px] md:rounded-[12px]" />
             <span className={cn("text-lg md:text-2xl font-black text-foreground/90", isRTL ? "tracking-normal" : "tracking-normal uppercase")}>
               {t('home.brand_name')}
             </span>
          </div>
          <p 
            className={cn(
              "text-[10px] sm:text-[11px] font-bold opacity-60 leading-relaxed max-w-full text-start",
              isRTL ? "tracking-normal" : "uppercase tracking-normal"
            )}
          >
            {t('footer.description')}
          </p>
          <div className="flex pt-1 md:pt-2">
            <button className="h-5 sm:h-8 md:h-10 px-2 sm:px-4 md:px-6 bg-primary/10 text-primary border border-primary/20 rounded-[6px] md:rounded-[15px] font-black text-[10px] uppercase tracking-normal hover:bg-primary hover:text-white transition-all outline-none">
              {t('footer.about_btn')}
            </button>
          </div>
        </div>

        {/* Column 2: Links */}
        <div className="space-y-3 md:space-y-6 col-span-1 flex flex-col items-start">
          <h4 className={cn("text-[10px] font-black opacity-40", isRTL ? "tracking-normal" : "uppercase tracking-normal")}>{t('footer.about_title')}</h4>
          <ul className="space-y-2 md:space-y-4 text-[10px] sm:text-xs font-bold opacity-70">
             <li className="hover:text-primary cursor-pointer transition-colors whitespace-nowrap">{t('footer.about_title')}</li>
             <li className="hover:text-primary cursor-pointer transition-colors whitespace-nowrap">{t('footer.privacy')}</li>
             <li className="hover:text-primary cursor-pointer transition-colors whitespace-nowrap">{t('footer.terms')}</li>
             <li className="hover:text-primary cursor-pointer transition-colors whitespace-nowrap">{t('footer.jobs')}</li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div className="space-y-3 md:space-y-6 col-span-1 flex flex-col items-start">
          <h4 className={cn("text-[10px] font-black opacity-40", isRTL ? "tracking-normal" : "uppercase tracking-normal")}>{t('footer.contact_title')}</h4>
          <ul className="space-y-2 md:space-y-4 text-[10px] sm:text-xs font-bold opacity-70">
             <li className="flex items-center gap-1 md:gap-3">
               <MapPin size={8} className="text-primary shrink-0 sm:size-3 md:size-[14px]" />
               <span className="truncate">{t('footer.location_val')}</span>
             </li>
             <li className="flex items-center gap-1 md:gap-3">
               <Phone size={8} className="text-primary shrink-0 sm:size-3 md:size-[14px]" />
               <span className="whitespace-nowrap" dir="ltr">+20 123 456 789</span>
             </li>
             <li className="flex items-center gap-1 md:gap-3">
               <Mail size={8} className="text-primary shrink-0 sm:size-3 md:size-[14px]" />
               <span className="truncate">contact@bermuda.eg</span>
             </li>
          </ul>
        </div>

        {/* Column 4: Social */}
        <div className="space-y-3 md:space-y-6 col-span-1 flex flex-col items-start">
          <h4 className={cn("text-[10px] font-black opacity-40", isRTL ? "tracking-normal" : "uppercase tracking-normal")}>{t('footer.follow_title')}</h4>
          <div className="flex gap-1.5 sm:gap-2 md:gap-4">
             <div className="w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-md md:rounded-xl bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"><Facebook size={10} className="sm:size-4 md:size-[18px]" /></div>
             <div className="w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-md md:rounded-xl bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"><Instagram size={10} className="sm:size-4 md:size-[18px]" /></div>
             <div className="w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-md md:rounded-xl bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"><Twitter size={10} className="sm:size-4 md:size-[18px]" /></div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 pt-8 md:pt-16 mt-8 md:mt-16 border-t border-border/10 text-center">
        <p className="text-[10px] font-black uppercase tracking-normal opacity-40">
          © 2026 {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
}