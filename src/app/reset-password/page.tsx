"use client"

import React, { useState } from 'react';
import { usePortal } from '@/components/portal-provider';
import { PortalNav } from '@/components/shared/portal-nav';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, ArrowRight, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { EgyptianHorizonLogo } from '@/components/shared/horizon-logo';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * @fileOverview صفحة استعادة كلمة السر - تطبيق ظل الفورم الملوكي.
 */
export default function ResetPasswordPage() {
  const { isRTL, t } = usePortal();
  const router = useRouter();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSent(true);
      toast({
        title: t('auth.reset_password_title'),
        description: t('auth.reset_instructions'),
      });
    }, 1500);
  };

  const premiumRadius = "rounded-[9px]";

  return (
    <main className="min-h-screen bg-background portal-transition-bg relative overflow-x-hidden flex flex-col">
      <PortalNav />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 pt-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px]"
        >
          <Card className={cn("border-outer bg-card/40 backdrop-blur-3xl auth-card-shadow overflow-hidden flex flex-col p-8 md:p-10 relative", premiumRadius)}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-primary/80 to-transparent z-10" />
            
            <CardHeader className="p-0 flex flex-col items-center space-y-4 mb-8">
              <EgyptianHorizonLogo isStatic={true} className="w-14 h-14" />
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-black tracking-tighter uppercase">{t('auth.reset_password_title')}</h1>
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.12em] leading-relaxed max-w-[280px] mx-auto" style={{ wordSpacing: '0.18em' }}>
                  {t('auth.reset_instructions')}
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <AnimatePresence mode="wait">
                {isSent ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center space-y-8 py-4 text-center"
                  >
                    <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-[28px] flex items-center justify-center border-2 border-green-500/20 shadow-inner">
                      <CheckCircle2 size={40} />
                    </div>
                    <button 
                      onClick={() => router.push('/customer/login')}
                      className={cn("h-12 px-10 bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-[0.98] transition-all border-b-4 border-primary/30", premiumRadius)}
                    >
                      {t('auth.back_to_login')}
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleReset} className="space-y-8">
                    <div className="space-y-2.5">
                      <Label className="text-[11px] font-black uppercase opacity-40 px-1 flex items-center gap-2.5">
                        <Mail size={14} className="text-primary/60" /> {t('auth.email')}
                      </Label>
                      <Input 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={cn(
                          "h-12 text-[11px] font-bold bg-muted/5 focus:bg-transparent px-4 border-[1.5px] transition-all duration-300",
                          "border-[#1171a8]/50 focus:border-[#299cc2]/40",
                          premiumRadius
                        )}
                      />
                    </div>

                    <div className="space-y-4 pt-2">
                      <button 
                        type="submit" 
                        disabled={loading}
                        className={cn("w-[250px] h-10 mx-auto block bg-primary text-white font-black text-[11px] uppercase tracking-[0.15em] shadow-2xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 border-b-4 border-primary/30 outline-none", premiumRadius)}
                        style={{ wordSpacing: '0.18em' }}
                      >
                        {loading ? <Loader2 className="animate-spin" /> : <>{t('auth.send_reset')} <Send size={18} /></>}
                      </button>

                      <button 
                        type="button"
                        onClick={() => router.push('/customer/login')}
                        className="w-full flex items-center justify-center gap-2 text-[10px] font-black opacity-30 hover:opacity-100 hover:text-primary transition-all uppercase tracking-widest group"
                        style={{ wordSpacing: '0.18em' }}
                      >
                        {isRTL ? <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /> : <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />}
                        {t('auth.back_to_login')}
                      </button>
                    </div>
                  </form>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* الجملة الآن أسفل الفورم بـ 20 بيكسل وغير متداخلة */}
        <div className="mt-[20px] mb-10 text-center opacity-25 pointer-events-none">
          <p className="text-[14px] font-black uppercase tracking-[0.15em]" style={{ wordSpacing: '0.18em' }}>{t('auth.security_footer')}</p>
        </div>
      </div>
    </main>
  );
}