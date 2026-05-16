"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { EgyptianHorizonLogo } from '@/components/shared/horizon-logo';
import { ArrowRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * @fileOverview صفحة الخطأ 404 المخصصة لبرمودا.
 */
export default function NotFound() {
  const router = useRouter();

  return (
    <main className="h-screen bg-[#050A14] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 -z-10 blur-[120px] rounded-full scale-150" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-8 flex flex-col items-center max-w-md"
      >
        <div className="relative">
          <EgyptianHorizonLogo isStatic={true} className="w-24 h-24 opacity-20 grayscale" />
          <span className="absolute inset-0 flex items-center justify-center text-6xl font-black text-primary/40 tracking-tighter">404</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">عذراً، الوجهة غير موجودة</h1>
          <p className="text-[11px] font-bold text-white/40 uppercase tracking-[0.3em] leading-relaxed">
            يبدو أنك ضللت الطريق في أروقة برمودا الملكية. دعنا نعدك للمسار الصحيح.
          </p>
        </div>

        <button 
          onClick={() => router.push('/')}
          className="h-14 px-10 bg-primary text-white font-black text-[11px] uppercase tracking-widest rounded-[9px] shadow-2xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-4 border-b-4 border-primary/30"
        >
          العودة للرئيسية <Home size={18} />
        </button>

        <footer className="pt-12 text-[7px] font-black text-white/20 uppercase tracking-[0.4em]">
          &copy; 2026 مجموعة برمودا الملكية • نظام إدارة الأخطاء
        </footer>
      </motion.div>
    </main>
  );
}
