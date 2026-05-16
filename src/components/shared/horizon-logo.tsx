"use client"

import React from 'react';
import { cn } from '@/lib/utils';
import { usePortal } from '@/components/portal-provider';

/**
 * @component EgyptianHorizonLogo
 * @description النسخة الرقمية المطابقة 100% للصورة المرجعية (Bermuda Branding).
 * تم التحديث: جعل النصوص ديناميكية حسب اللغة المختارة.
 */
export const EgyptianHorizonLogo = ({ className, isStatic = false, showText = false }: { className?: string; isStatic?: boolean; showText?: boolean }) => {
  const { t, isRTL } = usePortal();

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative w-full aspect-square flex items-center justify-center">
        {/* الهالة الضوئية الخلفية (Outer Glow) لبروز المثلث */}
        <div className="absolute inset-0 bg-[#41E9E9]/20 blur-[25px] rounded-full opacity-40" />
        
        <svg viewBox="0 0 160 160" className="w-full h-full relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* تدرج المثلث الممتلئ - مطابق للصورة المرجعية */}
            <linearGradient id="shieldGradient" x1="80" y1="10" x2="80" y2="135" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#41E9E9" />
              <stop offset="100%" stopColor="#1E6EA8" />
            </linearGradient>

            {/* ظلال الفندق المحدثة (Refined Split Shading) */}
            <linearGradient id="towerShadow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#EBFDFF" />
            </linearGradient>
            
            <linearGradient id="wingShadow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="50%" stopColor="#2E89CA" />
              <stop offset="50%" stopColor="#1B5E91" />
            </linearGradient>
          </defs>

          {/* 1. المثلث الملكي - متماثل هندسياً حول المحور 80 */}
          <g transform="translate(80, 71) scale(1.1) translate(-80, -71)">
            <path 
              d="M80 12C84 12 87.5 14.2 89.5 17.8L148 118C151 123 147.5 130 142 130H18C12.5 130 9 123 12 118L70.5 17.8C72.5 14.2 76 12 80 12Z" 
              fill="url(#shieldGradient)" 
              className={cn(!isStatic && "animate-pulse")}
            />
          </g>

          {/* 2. أيقونة الفندق - تم إنزالها بمقدار 12px بناءً على الطلب (من 3.5 إلى 15.5) */}
          <g transform="translate(11.0, 15.5) scale(0.9)">
            
            {/* الأفق السفلي المنحني الخفيف */}
            <path d="M-10 125 Q 75 118 160 125" stroke="white" strokeWidth="2.5" fill="none" opacity="0.3" />

            {/* أولاً: المباني الجانبية (خلف البرج) */}
            <rect x="10" y="70" width="45" height="50" fill="url(#wingShadow)" rx="5" ry="5" />
            <rect x="95" y="70" width="45" height="50" fill="url(#wingShadow)" rx="5" ry="5" />

            {/* ثانياً: البرج المركزي (في المقدمة) */}
            <rect x="45" y="45" width="60" height="75" fill="url(#towerShadow)" rx="5" ry="5" />
            
            {/* القبة والإبرة (القمة) */}
            <path d="M60 45 A 15 15 0 0 1 90 45" fill="white" />
            <rect x="73.5" y="28" width="3" height="17" fill="#051A33" rx="1.5" />
            <circle cx="75" cy="36" r="4.5" fill="white" />

            {/* الشبابيك الجانبية المقوسة */}
            {[18, 35, 103, 120].map((x) => (
              <React.Fragment key={x}>
                <path d={`M${x} 82 A 4 4 0 0 1 ${x+7} 82 V 92 H${x} Z`} fill="#051A33" opacity="0.85" />
                <path d={`M${x} 100 A 4 4 0 0 1 ${x+7} 100 V 110 H${x} Z`} fill="#051A33" opacity="0.85" />
              </React.Fragment>
            ))}

            {/* شبابيك البرج الأوسط (تمت معايرة التماثل عند 56 و 86) */}
            {[56, 86].map((x) => (
              <React.Fragment key={x}>
                <path d={`M${x} 58 A 4 4 0 0 1 ${x+8} 58 V 68 H${x} Z`} fill="#051A33" opacity="0.85" />
                <path d={`M${x} 78 A 4 4 0 0 1 ${x+8} 78 V 88 H${x} Z`} fill="#051A33" opacity="0.85" />
              </React.Fragment>
            ))}

            {/* البوابة الذهبية المقوسة */}
            <path d="M62 120 V 102 A 13 13 0 0 1 88 102 V 120 Z" fill="#FFD700" />
            <path d="M68 120 V 108 A 7 7 0 0 1 82 108 V 120 Z" fill="#051A33" />
          </g>
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col items-start mt-6 animate-in fade-in slide-in-from-bottom-2 duration-1000">
          <span className={cn("text-[32px] font-black text-white leading-none", isRTL ? "tracking-normal" : "tracking-tight uppercase")}>{t('home.brand_name')}</span>
          <span className={cn("text-[11px] font-black text-white/50 mt-2.5 leading-none", isRTL ? "tracking-normal" : "tracking-[0.3em] uppercase")}>{t('home.brand_subtitle')}</span>
        </div>
      )}
    </div>
  );
};

export const ExecutiveSilhouette = () => (
  <div className="w-full h-full bg-zinc-950 flex items-center justify-center relative overflow-hidden">
    <svg viewBox="0 0 100 100" className="w-full h-full p-2.5 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pearlGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="34" r="15" fill="url(#pearlGradient)" />
      <path d="M24 85 C 24 68, 34 58, 50 58 C 66 58, 76 68, 76 85 L 76 100 L 24 100 Z" fill="url(#pearlGradient)" />
    </svg>
    <div className="absolute inset-0 bg-white/[0.03] pointer-events-none" />
  </div>
);
