"use client"

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePortal } from '@/components/portal-provider';
import { cn } from '@/lib/utils';

/**
 * @fileOverview شاشة التحميل المحدثة - تم ضبط التوسيط الهندسي المطلق للفندق وتثبيت محور الحركة.
 */
export function LoadingScreen() {
  const { theme, t } = usePortal();

  // توقيتات الأجزاء
  const progressBarDuration = 2.7;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden", 
        theme === 'dark' ? "bg-[#050A14]" : "bg-[#F8F9FA]"
      )}
    >
      <div className="flex flex-col items-center justify-center space-y-8 max-w-[400px] w-full px-6">
        
        {/* 1. اللوجو (120x120) */}
        <div className="relative w-[120px] h-[120px] flex items-center justify-center shrink-0">
          <svg viewBox="0 0 160 160" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="shieldGradLoad" x1="80" y1="10" x2="80" y2="135" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#41E9E9" />
                <stop offset="100%" stopColor="#1E6EA8" />
              </linearGradient>
              <linearGradient id="towerShadowLoad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#EBFDFF" />
              </linearGradient>
              <linearGradient id="wingShadowLoad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stopColor="#2E89CA" />
                <stop offset="50%" stopColor="#1B5E91" />
              </linearGradient>
              
              {/* تأثير المسحة الضوئية الناعمة */}
              <linearGradient id="shineEffect" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="50%" stopColor="white" stopOpacity="0.25" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>

              <clipPath id="triangleMask">
                <path d="M80 12C84 12 87.5 14.2 89.5 17.8L148 118C151 123 147.5 130 142 130H18C12.5 130 9 123 12 118L70.5 17.8C72.5 14.2 76 12 80 12Z" />
              </clipPath>
            </defs>

            {/* المثلث الملكي - ثابت تماماً مع مسحة ضوئية فقط */}
            <g style={{ transformOrigin: "80px 71px" }}>
              <path 
                d="M80 12C84 12 87.5 14.2 89.5 17.8L148 118C151 123 147.5 130 142 130H18C12.5 130 9 123 12 118L70.5 17.8C72.5 14.2 76 12 80 12Z" 
                fill="url(#shieldGradLoad)"
              />

              <motion.rect
                x="-120"
                y="0"
                width="120"
                height="160"
                fill="url(#shineEffect)"
                clipPath="url(#triangleMask)"
                animate={{ x: [-120, 320] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.2
                }}
              />
            </g>

            {/* مجموعة الفندق - تم ضبط الإزاحة (5.0, 8.0) للتوسيط الهندسي المطلق وتثبيت المركز (75, 74) */}
            <motion.g 
              initial={{ x: 5.0, y: 8.0, scale: 0.9, originX: "75px", originY: "74px" }}
              animate={{ 
                y: [8.0, 8.6, 8.0],
                scale: [0.9, 0.905, 0.9]
              }}
              transition={{ 
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* أولاً: المباني الجانبية والشبابيك */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <rect x="10" y="70" width="45" height="50" fill="url(#wingShadowLoad)" rx="5" ry="5" />
                <rect x="95" y="70" width="45" height="50" fill="url(#wingShadowLoad)" rx="5" ry="5" />

                {[18, 35, 103, 120].map((x) => (
                  <React.Fragment key={x}>
                    <path d={`M${x} 82 A 4 4 0 0 1 ${x+7} 82 V 92 H${x} Z`} fill="#051A33" opacity="0.85" />
                    <path d={`M${x} 100 A 4 4 0 0 1 ${x+7} 100 V 110 H${x} Z`} fill="#051A33" opacity="0.85" />
                  </React.Fragment>
                ))}
              </motion.g>

              {/* ثانياً: البرج المركزي - يظهر أولاً في المقدمة بارزاً ومنظماً */}
              <motion.g
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <rect x="45" y="45" width="60" height="75" fill="url(#towerShadowLoad)" rx="5" ry="5" />
                <path d="M60 45 A 15 15 0 0 1 90 45" fill="white" />
                <rect x="73.5" y="28" width="3" height="17" fill="#051A33" rx="1.5" />
                <circle cx="75" cy="36" r="4.5" fill="white" />

                {/* شبابيك البرج الأوسط (معايرة التماثل بدقة) */}
                {[56, 86].map((x) => (
                  <React.Fragment key={x}>
                    <path d={`M${x} 58 A 4 4 0 0 1 ${x+8} 58 V 68 H${x} Z`} fill="#051A33" opacity="0.85" />
                    <path d={`M${x} 78 A 4 4 0 0 1 ${x+8} 78 V 88 H${x} Z`} fill="#051A33" opacity="0.85" />
                  </React.Fragment>
                ))}

                <path d="M62 120 V 102 A 13 13 0 0 1 88 102 V 120 Z" fill="#FFD700" />
                <path d="M68 120 V 108 A 7 7 0 0 1 82 108 V 120 Z" fill="#051A33" />
              </motion.g>
            </motion.g>
          </svg>
        </div>

        {/* 2. النصوص (اسم الفندق + الجملة التعريفية) */}
        <div className="flex flex-col items-center text-center space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-1000">
          <h2 className="text-3xl font-black tracking-[0.02em] text-foreground uppercase leading-none" style={{ wordSpacing: '0.18em' }}>
            {t('home.brand_name')}
          </h2>
          <p className="text-[11px] font-bold opacity-40 uppercase tracking-[0.02em] leading-relaxed max-w-[280px]" style={{ wordSpacing: '0.18em' }}>
            {t('loading.phrase')}
          </p>
        </div>

        {/* 3. شريط التحميل (2.7 ثانية) */}
        <div className="w-[200px] h-[1.5px] bg-primary/10 rounded-full overflow-hidden relative shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: progressBarDuration, 
              ease: "linear" 
            }}
            className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_10px_rgba(65,233,233,0.5)]"
          />
        </div>

      </div>
    </motion.div>
  );
}