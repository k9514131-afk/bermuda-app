
"use client"

import React, { useState, useEffect } from 'react';
import { usePortal } from '@/components/portal-provider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, LogIn, Lock, Fingerprint, Loader2, AlertCircle, CheckCircle2, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { apiRequest } from '@/lib/api';

export function LoginForm({ forceRole }: { forceRole: 'customer' | 'staff' }) {
  const { setUser, isRTL, setIsLoading, t } = usePortal();
  const router = useRouter();

  const [credential, setCredential] = useState(""); 
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ credential, password })
      });

      setSuccessMessage(t('auth.success_msg'));
      
      const targetPath = response.user.role === 'staff' ? '/dashboard' : '/customer';
      finalizeLogin(response.user, targetPath);

    } catch (error: any) {
      if (error.message === 'DATABASE_OFFLINE') {
        setErrorMessage(t('auth.offline_msg'));
      } else {
        setErrorMessage(error.message || t('auth.error_msg'));
      }
      setIsSubmitting(false);
    }
  };

  const finalizeLogin = (userData: any, target: string) => {
    if (rememberMe) localStorage.setItem('bermuda_remembered', 'true');
    
    setIsLoading(true); 
    
    setTimeout(() => {
      setUser(userData);
      router.push(target);
      
      setTimeout(() => {
        setIsLoading(false);
      }, 500); 
    }, 3000);
  };

  const premiumRadius = "rounded-[9px]";

  return (
    <form onSubmit={handleSubmit} className="pt-0 pb-0 flex flex-col h-full relative">
      <div className={cn("w-full bg-transparent p-4 mb-3 mt-[65px] translate-y-[-15px]", premiumRadius)}>
        <div className="space-y-1.5">
          <Label className="font-black text-[11px] uppercase tracking-widest opacity-60 flex items-center gap-2 px-1 w-full text-right justify-start">
            {forceRole === 'staff' ? <User size={14} className="text-primary" /> : <Fingerprint size={14} className="text-primary" />}
            <span>{forceRole === 'staff' ? t('auth.username') : t('auth.id_number')}</span>
          </Label>
          <div className={cn("relative group bg-transparent overflow-hidden border border-border transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40", premiumRadius)}>
            <Input 
              type="text" 
              value={credential} 
              onChange={(e) => setCredential(e.target.value)} 
              required 
              className="h-10 border-none ring-0 focus:ring-0 bg-transparent text-[12px] px-4 text-start font-bold" 
            />
          </div>
        </div>

        <div className={cn("space-y-1.5", forceRole === 'staff' ? "mt-8" : "mt-3")}>
          <Label className="font-black text-[11px] uppercase tracking-widest opacity-60 flex items-center gap-2 px-1 w-full text-right justify-start">
            <Lock size={14} className="text-primary" /> <span>{t('auth.password')}</span>
          </Label>
          <div className={cn("relative group bg-transparent overflow-hidden border border-border transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40", premiumRadius)}>
            <Input 
              type={showPassword ? "text" : "password"} 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className={cn("h-10 border-none ring-0 focus:ring-0 bg-transparent text-[12px] text-start font-bold px-4", isRTL ? "pl-10" : "pr-10")} 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className={cn("absolute top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity", isRTL ? "left-3" : "right-3")}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 px-1">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox id="remember" checked={rememberMe} onCheckedChange={(v) => setRememberMe(!!v)} className="rounded-sm border-primary" />
            <label htmlFor="remember" className="text-[10px] font-black cursor-pointer">{t('auth.remember_me')}</label>
          </div>
          {forceRole !== 'staff' && (
            <button type="button" onClick={() => router.push('/reset-password')} className="text-[9px] font-black text-primary hover:underline">
              {t('auth.forgot_password_btn')}
            </button>
          )}
        </div>

        <div className="h-[54px] flex items-center relative !mt-[15px] overflow-hidden">
          <AnimatePresence mode="wait">
            {(errorMessage || successMessage) && (
              <motion.div 
                key={successMessage ? 'success' : 'error'}
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  "w-full p-3 rounded-[9px] flex items-center gap-3 border-[1.2px] shadow-lg backdrop-blur-md mb-[10px]",
                  successMessage ? "bg-green-500/10 border-green-500/30 text-green-500" : "bg-red-500/10 border-red-500/30 text-red-500"
                )}
              >
                {successMessage ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span className="text-[10px] font-black uppercase tracking-tight leading-tight">{successMessage || errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className={cn("mt-auto w-full pb-4 px-4 flex flex-col items-center", forceRole === 'customer' ? "translate-y-[-45px]" : "translate-y-[-15px]")}>
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className={cn("w-full max-w-[200px] h-[43px] bg-primary text-white font-black text-[11px] shadow-none active:scale-[0.98] transition-all hover:brightness-110 border-b-4 border-primary/30 outline-none mx-auto", premiumRadius)}
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : (
            <div className="flex items-center justify-center gap-2">
              <span className="tracking-widest uppercase">{t('auth.login_btn')}</span>
              <LogIn size={18} className={cn(isRTL && "rotate-180")} />
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}
