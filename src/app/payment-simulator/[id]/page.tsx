
"use client"

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { usePortal } from '@/components/portal-provider';
import { EgyptianHorizonLogo } from '@/components/shared/horizon-logo';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, CheckCircle2, XCircle, CreditCard, User, Hash, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiRequest } from '@/lib/api';
import { cn } from '@/lib/utils';

/**
 * @fileOverview صفحة محاكي الدفع - واجهة العميل على الهاتف (مترجمة بالكامل)
 */
export default function PaymentSimulatorPage() {
  const { id } = useParams();
  const { t } = usePortal();
  const [request, setRequest] = useState<any>(null);
  const [status, setStatus] = useState<'pending' | 'approving' | 'rejecting' | 'approved' | 'rejected'>('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const data = await apiRequest(`/payment-simulator/${id}`);
        setRequest(data);
        if (data.status !== 'pending') setStatus(data.status);
      } catch (e) {
        console.error("Failed to load payment request");
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  const handleAction = async (nextStatus: 'approved' | 'rejected') => {
    setStatus(nextStatus === 'approved' ? 'approving' : 'rejecting');
    try {
      await apiRequest(`/payment-simulator/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus })
      });
      setTimeout(() => setStatus(nextStatus), 1500);
    } catch (e) {
      setStatus('pending');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050A14] flex flex-col items-center justify-center space-y-6">
      <Loader2 className="animate-spin text-primary" size={48} />
      <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{t('simulator.securing')}</p>
    </div>
  );

  if (!request) return (
    <div className="min-h-screen bg-[#050A14] flex flex-col items-center justify-center p-8 text-center space-y-6">
      <AlertTriangle size={64} className="text-amber-500" />
      <h1 className="text-xl font-black text-white">{t('simulator.not_found')}</h1>
      <p className="text-[11px] text-white/40 uppercase tracking-widest leading-relaxed">{t('simulator.not_found_desc')}</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050A14] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[400px] space-y-8 relative z-10">
        <header className="text-center space-y-4">
          <EgyptianHorizonLogo isStatic={true} className="w-16 h-16 mx-auto shadow-2xl" />
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase">{t('simulator.title')}</h1>
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.3em]">{t('simulator.subtitle')}</p>
          </div>
        </header>

        <Card className="bg-white/[0.03] backdrop-blur-3xl border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner"><CreditCard size={20} /></div>
                 <div className="text-start">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">{t('simulator.request_label')}</p>
                    <p className="text-[11px] font-black text-white uppercase">{request.booking_reference || request.temp_reference}</p>
                 </div>
               </div>
               <Badge className="bg-primary/20 text-primary border-none text-[8px] font-black uppercase px-3 h-6">{t('simulator.live_link')}</Badge>
            </div>

            <div className="text-center space-y-2 py-4">
               <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em]">{t('simulator.total_due')}</p>
               <div className="flex items-baseline justify-center gap-2 leading-none">
                 <span className="text-5xl font-black text-white tracking-tighter">{Number(request.amount).toLocaleString()}</span>
                 <span className="text-xs font-bold text-primary uppercase">{t('simulator.currency')}</span>
               </div>
            </div>

            <div className="space-y-4 bg-black/20 p-6 rounded-[24px] border border-white/5 shadow-inner">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2 opacity-40"><User size={12} className="text-primary"/><span className="text-[10px] font-black uppercase tracking-widest">{t('simulator.customer')}</span></div>
                 <span className="text-[11px] font-black text-white">{request.customer_name}</span>
               </div>
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2 opacity-40"><Hash size={12} className="text-primary"/><span className="text-[10px] font-black uppercase tracking-widest">{t('simulator.transaction_id')}</span></div>
                 <span className="text-[10px] font-mono text-white/60 truncate max-w-[150px]">{request.id}</span>
               </div>
            </div>

            <AnimatePresence mode="wait">
              {status === 'pending' || status === 'approving' || status === 'rejecting' ? (
                <div key="actions" className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleAction('rejected')}
                    disabled={status !== 'pending'}
                    className="h-14 rounded-[20px] bg-red-500/10 text-red-500 border border-red-500/20 font-black text-[11px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-40"
                  >
                    {status === 'rejecting' ? <Loader2 className="animate-spin" size={16} /> : <><XCircle size={18} /> {t('simulator.reject_btn')}</>}
                  </button>
                  <button 
                    onClick={() => handleAction('approved')}
                    disabled={status !== 'pending'}
                    className="h-14 rounded-[20px] bg-primary text-[#050A14] font-black text-[11px] uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-40"
                  >
                    {status === 'approving' ? <Loader2 className="animate-spin" size={16} /> : <><ShieldCheck size={18} /> {t('simulator.approve_btn')}</>}
                  </button>
                </div>
              ) : (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={cn("p-8 rounded-[24px] text-center space-y-4", status === 'approved' ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20")}>
                  <div className={cn("w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-2xl", status === 'approved' ? "bg-green-500 text-white" : "bg-red-500 text-white")}>
                    {status === 'approved' ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                  </div>
                  <div className="space-y-1">
                    <h3 className={cn("text-xl font-black uppercase tracking-tight", status === 'approved' ? "text-green-500" : "text-red-500")}>
                      {status === 'approved' ? t('simulator.success_title') : t('simulator.failed_title')}
                    </h3>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      {status === 'approved' ? t('simulator.success_desc') : t('simulator.failed_desc')}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>

        <footer className="text-center space-y-2 opacity-20">
           <p className="text-[8px] font-black uppercase tracking-[0.4em]">Secure Payment Node 7.1.4</p>
           <p className="text-[7px] font-bold uppercase tracking-[0.2em]">Bermuda Royal Hospitality • Project Simulation</p>
        </footer>
      </motion.div>
    </main>
  );
}
