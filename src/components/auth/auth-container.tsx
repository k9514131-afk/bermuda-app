"use client"

import React, { useState, useEffect } from 'react';
import { usePortal } from '@/components/portal-provider';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';
import { cn } from '@/lib/utils';
import { EgyptianHorizonLogo } from '@/components/shared/horizon-logo';
import { motion, AnimatePresence } from 'framer-motion';
import type { Transition } from 'framer-motion';

interface AuthContainerProps {
  forceMode?: 'customer' | 'staff';
}

export function AuthContainer({ forceMode = 'customer' }: AuthContainerProps) {
  const { isRTL, t } = usePortal();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 700);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const transitionConfig: Transition = {
    duration: 0.6, 
    type: "spring",
    stiffness: 260,
    damping: 20
  };

  const premiumRadius = "rounded-[9px]";

  return (
    <div className={cn("flex w-full items-center justify-center px-4 overflow-visible transition-all duration-700")}>
      <motion.div 
        layout 
        initial={false} 
        animate={{ maxWidth: activeTab === 'login' ? 400 : (isMobile ? '100%' : 770) }} 
        transition={transitionConfig} 
        className="w-full overflow-visible flex justify-center items-center"
      >
        <Card className={cn(
          "w-full overflow-hidden bg-card/95 backdrop-blur-3xl border-outer auth-card-shadow relative flex flex-col h-[480px] transition-all duration-500",
          premiumRadius
        )}>
          <CardHeader className="text-center flex flex-col items-center px-5 shrink-0 pb-[5px] pt-[12px]">
            <div className="w-full flex justify-center mb-1.5"><EgyptianHorizonLogo className="w-10 h-10" isStatic={true} /></div>
            <CardDescription className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50 px-2 leading-relaxed mb-2">
              {forceMode === 'staff' ? t('auth.staff_login_msg') : t('auth.customer_msg')}
            </CardDescription>
            
            {forceMode === 'customer' && (
              <div className="w-full flex justify-center mt-[55px] translate-y-[10px]">
                <div 
                  dir={isRTL ? "rtl" : "ltr"}
                  className={cn(
                    "relative h-[38px] w-full max-w-[320px] bg-muted/20 p-[2px] border-inner flex items-center overflow-hidden",
                    premiumRadius
                  )}
                >
                  <div className="relative flex w-full h-full">
                    {/* شريط التحديد الملوكي - تم ضبط المنطق ليتناسب مع الترتيب الجديد */}
                    <motion.div 
                      layout 
                      transition={{ type: "spring", stiffness: 300, damping: 30 }} 
                      className={cn("absolute top-0 bottom-0 w-1/2 z-0 bg-primary border-[1.6px] border-border/60", premiumRadius)} 
                      style={{ 
                        left: isRTL 
                          ? (activeTab === 'login' ? '50%' : '0%') 
                          : (activeTab === 'login' ? '0%' : '50%') 
                      }} 
                    />
                    
                    {/* الترتيب القياسي: تسجيل الدخول أولاً */}
                    <button 
                      onClick={() => setActiveTab("login")} 
                      className={cn(
                        "flex-1 z-10 font-black text-[9px] uppercase transition-colors duration-500 outline-none", 
                        activeTab === 'login' ? "text-white" : "text-foreground/40"
                      )}
                    >
                      {t('auth.login_tab')}
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab("register")} 
                      className={cn(
                        "flex-1 z-10 font-black text-[9px] uppercase transition-colors duration-500 outline-none", 
                        activeTab === 'register' ? "text-white" : "text-foreground/40"
                      )}
                    >
                      {t('auth.register_tab')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </CardHeader>
          
          <CardContent className="px-5 md:px-6 pb-4 flex-1 overflow-hidden flex flex-col justify-center">
            <AnimatePresence mode="popLayout" initial={false}>
              {activeTab === 'login' ? (
                <motion.div 
                  key="login" 
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: isRTL ? -20 : 20 }} 
                  transition={transitionConfig} 
                  className="max-w-[360px] mx-auto w-full"
                >
                  <LoginForm forceRole={forceMode} />
                </motion.div>
              ) : (
                <motion.div 
                  key="register" 
                  initial={{ opacity: 0, x: isRTL ? -20 : 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: isRTL ? 20 : -20 }} 
                  transition={transitionConfig} 
                  className="w-full"
                >
                  <RegisterForm onSuccess={() => setActiveTab("login")} />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
