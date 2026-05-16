"use client"

import React, { useEffect } from 'react';
import { usePortal } from '@/components/portal-provider';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { User, ShieldCheck, ArrowRight } from 'lucide-react';
import { EgyptianHorizonLogo } from '@/components/shared/horizon-logo';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

/**
 * @fileOverview صفحة اختيار الدخول - تم تعريبها بالكامل بشكل ثابت (Permanent Arabic).
 * لا تتأثر بتبديل اللغة لضمان استقرار واجهة الترحيب الأولى.
 */
export default function GlobalEntryPage() {
  const { user, mounted, t, isRTL } = usePortal();
  const router = useRouter();

  useEffect(() => {
    if (mounted && user) {
      if (user.role === 'staff') {
        router.push('/employee/dashboard');
      } else {
        router.push('/customer');
      }
    }
  }, [user, router, mounted]);

  const apps = [
    {
      id: 'customer',
      title: 'بوابة برمودا للضيوف',
      subtitle: 'حجز فندقي فاخر وإدارة إقامتك النخبوية المتميزة في قلب مصر',
      icon: User,
      color: 'bg-[#1AE5E5]',
      path: '/customer/login'
    },
    {
      id: 'employee',
      title: 'مركز برمودا للعمليات',
      subtitle: 'إدارة الحجوزات، عمليات التسكين الفوري، والتقارير المالية والتشغيلية',
      icon: ShieldCheck,
      color: 'bg-[#2E89CA]',
      path: '/employee/login'
    }
  ];

  const premiumRadius = "rounded-[9px]";

  if (!mounted) return null;

  return (
    <main dir="rtl" className="h-screen bg-[#050A14] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center w-full z-10 flex flex-col items-center"
      >
        <div className="flex flex-col items-center translate-y-[20px]">
          <EgyptianHorizonLogo isStatic={true} showText={false} className="w-24 h-24" />
          
          <div className="flex flex-col items-center text-center mt-3">
            <h1 className={cn("text-[32px] font-black text-white leading-none tracking-[0.02em] text-center")} style={{ wordSpacing: '0.18em' }}>
              {t('home.brand_name')}
            </h1> 
            
            <p className={cn("text-[11px] font-black text-white/50 leading-none mt-2 uppercase tracking-[0.02em] text-center")} style={{ wordSpacing: '0.18em' }}>
              {t('home.brand_subtitle')}
            </p>
            
            <p className="text-[11px] font-bold text-white/30 leading-none mt-2 uppercase tracking-[0.02em] text-center" style={{ wordSpacing: '0.18em' }}>
              {t('home.hero_subtitle')}
            </p>
          </div>
          
          <p className="text-[16px] font-bold text-white/30 uppercase tracking-[0.02em] mt-[16px]" style={{ wordSpacing: '0.18em' }}>
            {t('home.system_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-[24px] w-full max-w-2xl px-4">
          {apps.map((app, idx) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ delay: 0.1 * idx }}
            >
              <Card 
                onClick={() => router.push(app.path)}
                className={cn("group cursor-pointer border-white/5 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.05] transition-all duration-500 overflow-hidden border-2 hover:border-primary/30 shadow-2xl h-auto", premiumRadius)}
              >
                <CardHeader className="p-7 flex flex-col items-center text-center space-y-3">
                  <div className={cn("w-14 h-14 rounded-[9px] flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform duration-500", app.color)}>
                    <app.icon size={28} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-lg font-black text-white tracking-[0.02em]" style={{ wordSpacing: '0.18em' }}>{app.title}</h2>
                    <p className="text-[9px] font-medium text-white/40 leading-relaxed px-2 tracking-[0.02em]" style={{ wordSpacing: '0.18em' }}>{app.subtitle}</p>
                  </div>
                </CardHeader>
                <CardContent className="px-7 pb-7">
                  <button className={cn("w-full h-11 bg-white/5 border border-white/10 text-white font-black text-[9px] uppercase tracking-[0.02em] flex items-center justify-center gap-3 group-hover:bg-primary group-hover:text-white transition-all outline-none", premiumRadius)} style={{ wordSpacing: '0.18em' }}>
                    دخول المنظومة <ArrowRight size={14} className="rotate-180" />
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <footer className="pt-8 text-[7px] font-black text-white/20 uppercase tracking-[0.02em]" style={{ wordSpacing: '0.18em' }}>
          &copy; 2026 مجموعة برمودا الملكية • منصة الإدارة المتكاملة
        </footer>
      </motion.div>
    </main>
  );
}