
"use client"

import React, { useMemo, useState, useEffect } from 'react';
import { usePortal } from '@/components/portal-provider';
import { PortalNav } from '@/components/shared/portal-nav';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, ShieldCheck, Bed, 
  ChevronRight, Trash2, Calendar, Receipt, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

export default function CustomerDashboardPage() {
  const { allBookings, setAllBookings, t, isRTL, updateRoomStatus, addAuditLog, setIsLoading, user, mounted, refreshData } = usePortal();
  const router = useRouter();
  const { toast } = useToast();

  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

  useEffect(() => {
    if (mounted) {
      if (!user) {
        router.push('/customer/login');
      } else {
        // نضمن تحديث البيانات فور دخول هذه الصفحة
        refreshData();
      }
    }
  }, [user, router, mounted, refreshData]);

  const myBookings = useMemo(() => {
    const bookings = Array.isArray(allBookings) ? allBookings : [];
    // الـ backend يُعيد فقط حجوزات المستخدم الحالي بناءً على user_id
    // لا داعي لفلتر إضافي في الـ frontend
    return bookings;
  }, [allBookings]);

  const handleCancelBooking = () => {
    if (!selectedBooking) return;
    
    const targetId = selectedBooking.id;
    const roomPhysId = selectedBooking.roomPhysicalId;

    setIsCancelConfirmOpen(false);
    setIsDetailsOpen(false);
    setIsLoading(false); 

    const updated = allBookings.map(b => b.id === targetId ? { ...b, status: 'Cancelled' } : b);
    setAllBookings(updated);
    
    if (roomPhysId) {
      updateRoomStatus(roomPhysId, 'available');
    }

    addAuditLog('audit.action.cancel', `audit.log.cancel|${targetId}`);
    
    toast({ 
      title: t('notification.booking_cancelled'),
      variant: "default" 
    });

    setTimeout(() => {
      if (typeof document !== 'undefined') {
        document.body.style.pointerEvents = 'auto';
        document.body.style.overflow = 'auto';
        document.documentElement.style.pointerEvents = 'auto';
        document.documentElement.style.overflow = 'auto';
      }
    }, 300);
  };

  const premiumRadius = "rounded-[9px]";

  if (!mounted || !user) return null;

  return (
    <main className="min-h-screen bg-background portal-transition-bg pb-20 pt-28">
      <PortalNav />
      <div className="container mx-auto px-4 md:px-6 py-12 space-y-12 max-w-[1600px]">
        <header className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
          <div className="text-start">
            <h1 className="text-4xl font-black tracking-tighter mb-[15px]">{t('dashboard.title')}</h1>
            <p className="text-[11px] font-bold opacity-40 uppercase tracking-[0.12em]">{t('dashboard.subtitle')}</p>
          </div>

          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center justify-center">
            <Card className={cn("h-[45px] px-4 min-w-[112px] bg-primary/5 border-inner flex items-center justify-center gap-2", premiumRadius)}>
              <span className="text-2xl font-black text-primary tracking-tighter" suppressHydrationWarning>{myBookings.length}</span>
              <span className="text-[10px] font-black uppercase opacity-40 tracking-widest">{t('dashboard.total_bookings')}</span>
            </Card>
          </div>

          <div className="flex gap-4 items-center">
            <Card className={cn("lg:hidden h-[45px] px-4 min-w-[112px] bg-primary/5 border-inner flex items-center justify-center gap-2", premiumRadius)}>
              <span className="text-2xl font-black text-primary tracking-tighter" suppressHydrationWarning>{myBookings.length}</span>
              <span className="text-[10px] font-black uppercase opacity-40 tracking-widest">{t('dashboard.total_bookings')}</span>
            </Card>
            
            <button 
              onClick={() => router.push('/customer')} 
              className={cn(
                "h-[45px] px-[10px] md:px-10 bg-primary text-white font-black text-[11px] uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 border-b-4 border-primary/30", 
                premiumRadius
              )}
            >
              {t('dashboard.explore_btn')} <Plus size={18} />
            </button>
          </div>
        </header>

        {myBookings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {myBookings.map((b, idx) => (
              <motion.div key={b.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <Card className={cn("group overflow-hidden border-outer bg-card/40 backdrop-blur-md transition-all duration-500 hover-shadow-2xl border-2 hover:border-primary/30 flex flex-col h-full relative", premiumRadius)}>
                  <div className={cn(
                    "absolute top-4 w-2.5 h-2.5 rounded-full z-10 shadow-sm transition-all duration-500",
                    isRTL ? "left-4" : "right-4",
                    b.status === 'Active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                  )} />

                  <div className="p-5 border-b border-border/5 space-y-2">
                    <h3 className={cn(
                      "text-lg font-black uppercase leading-tight truncate text-start",
                      isRTL ? "pl-5" : "pr-5"
                    )}>
                      {t(b.hotelName)}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-60 uppercase tracking-widest truncate text-start">
                      <MapPin size={12} className="text-primary shrink-0" /> {t(b.location || '')}
                    </div>
                  </div>

                  <div className="p-5 space-y-5 flex-1">
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-black uppercase opacity-40 tracking-widest block text-start">{t('dashboard.stay_period')}</span>
                      <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-[12px] border-inner border-opacity-10" dir="ltr">
                        <Calendar size={14} className="text-primary/60 shrink-0" />
                        <span className="text-[11px] font-black tracking-tight" suppressHydrationWarning>
                          {b.checkIn ? format(new Date(b.checkIn), 'dd/MM/yy') : '--'} → {b.checkOut ? format(new Date(b.checkOut), 'dd/MM/yy') : '--'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col text-start space-y-1.5">
                        <span className="text-[9px] font-black uppercase opacity-40 tracking-widest">{t('dashboard.room_type')}</span>
                        <div className="flex items-center gap-2">
                          < Bed size={14} className="text-primary/60" />
                          <span className="text-[11px] font-black truncate">{t(`booking.${b.roomType}`)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col text-start space-y-1.5">
                        <span className="text-[9px] font-black uppercase opacity-40 tracking-widest">{t('dashboard.unit_number')}</span>
                        <Badge className="bg-primary text-white h-7 px-3 rounded-[8px] font-black text-[12px] shadow-lg border-none flex items-center justify-center" suppressHydrationWarning>
                          #{b.roomId || '---'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 border-t border-border/5 bg-primary/[0.03] mt-auto">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-end">
                        <div className="text-start flex flex-col">
                          <span className="text-[9px] font-black uppercase opacity-40 tracking-widest">{t('dashboard.total_price')}</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-primary tracking-tighter" suppressHydrationWarning>
                              {b.totalPrice?.toLocaleString()}
                            </span>
                            <span className="text-[10px] font-bold opacity-60 uppercase">{t('dashboard.currency')}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-primary/20 text-primary text-[8px] font-black uppercase bg-background/50 h-5 tracking-widest">
                          {b.isPaid ? t('dashboard.paid_online') : t('dashboard.paid_arrival')}
                        </Badge>
                      </div>

                      <button 
                        onClick={() => { setSelectedBooking(b); setIsDetailsOpen(true); }} 
                        className="w-full h-11 bg-primary/20 text-primary border-2 border-primary/30 rounded-[9px] font-black text-[10px] uppercase hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.98] tracking-widest"
                      >
                        {t('dashboard.details_btn')} <ChevronRight size={16} className={cn(isRTL && "rotate-180")} />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-8 bg-muted/5 border-inner border-dashed border-2 rounded-[24px]">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto opacity-20"><Bed size={40} className="text-primary" /></div>
            <div className="space-y-2"><h2 className="text-2xl font-black opacity-30 uppercase tracking-widest">{t('dashboard.no_bookings')}</h2><p className="text-[10px] font-bold opacity-20 uppercase tracking-[0.12em]">{t('dashboard.explore_desc')}</p></div>
            <button onClick={() => router.push('/customer')} className="h-14 px-10 bg-primary text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-[0.98] transition-all">{t('dashboard.explore_btn')}</button>
          </div>
        )}
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent 
          className="max-w-[480px] p-0 border-outer rounded-[13px] bg-card/95 backdrop-blur-3xl overflow-hidden shadow-2xl"
        >
          <DialogHeader className="p-6 bg-primary/5 border-b border-border/10 flex flex-col items-center">
            <DialogTitle className="text-lg font-black flex items-center gap-2 tracking-tighter"><ShieldCheck className="text-primary" /> {t('dashboard.modal_title')}</DialogTitle>
            <Badge variant="outline" className="mt-2 font-mono text-primary text-[10px] border-primary/20">#{selectedBooking?.id?.toUpperCase()}</Badge>
          </DialogHeader>
          <div className="p-6 space-y-6 flex-1 overflow-y-auto clean-scrollbar">
            <div className="flex flex-col gap-1 text-start bg-muted/5 p-4 rounded-[12px] border-inner border-opacity-30">
              <h3 className="text-sm font-black truncate">{t(selectedBooking?.hotelName || '')}</h3>
              <p className="text-[9px] font-bold opacity-60 uppercase flex items-center gap-1.5 tracking-widest"><MapPin size={10} className="text-primary" /> {t(selectedBooking?.location || '')}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/5 rounded-[12px] border-inner border-opacity-20 text-center"><span className="text-[10px] font-black uppercase opacity-40 block mb-1 tracking-widest">{t('dashboard.stay_period')}</span><p className="text-[10px] font-black" suppressHydrationWarning>{selectedBooking?.checkIn ? format(new Date(selectedBooking.checkIn), 'dd/MM/yy') : '---'} - {selectedBooking?.checkOut ? format(new Date(selectedBooking.checkOut), 'dd/MM/yy') : '---'}</p></div>
              <div className="p-3 bg-muted/5 rounded-[12px] border-inner border-opacity-20 text-center"><span className="text-[10px] font-black uppercase opacity-40 block mb-1 tracking-widest">{t('dashboard.unit_info')}</span><p className="text-[10px] font-black" suppressHydrationWarning>{t(`booking.${selectedBooking?.roomType}`)} (#{selectedBooking?.roomId || '---'})</p></div>
            </div>
            <div className="p-5 bg-primary/5 border border-primary/10 rounded-[12px] flex justify-between items-center">
              <div className="text-start"><span className="text-[10px] font-black uppercase opacity-40 block tracking-widest">{t('dashboard.final_total')}</span><p className="text-2xl font-black text-primary tracking-tighter" suppressHydrationWarning>{selectedBooking?.totalPrice?.toLocaleString()} <span className="text-xs">{t('common.currency')}</span></p></div>
              <Badge className="bg-primary/10 text-primary border-none text-[10px] h-6 font-black uppercase tracking-widest">{selectedBooking?.isPaid ? t('dashboard.paid_online') : t('dashboard.paid_arrival')}</Badge>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => router.push(`/invoice/${selectedBooking.id}`)} className="flex-1 h-11 bg-muted/10 border-inner text-foreground/80 rounded-[10px] font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 tracking-widest"><Receipt size={14} /> {t('nav.invoice')}</button>
              <button onClick={() => setIsCancelConfirmOpen(true)} disabled={selectedBooking?.status === 'Cancelled'} className="flex-1 h-11 bg-red-500/5 text-red-500 border border-red-500/20 rounded-[10px] font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white disabled:opacity-30 disabled:grayscale tracking-widest"><Trash2 size={14} /> {t('dashboard.cancel_booking')}</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isCancelConfirmOpen} onOpenChange={setIsCancelConfirmOpen}>
        <AlertDialogContent className="rounded-[13px] border-outer bg-card/95 backdrop-blur-3xl p-8 max-w-[420px] text-center shadow-2xl">
          <AlertDialogHeader className="space-y-3">
            <AlertDialogTitle className="text-xl font-black tracking-tighter text-center">{t('dashboard.cancel_confirm_title')}</AlertDialogTitle>
            <AlertDialogDescription className="text-xs font-bold opacity-60 text-center leading-relaxed">{t('dashboard.cancel_confirm_desc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={cn("flex items-center justify-center gap-3 mt-6", isRTL ? "flex-row" : "flex-row")}>
            <AlertDialogCancel asChild><button className="h-11 w-1/2 rounded-[10px] bg-muted/10 border-inner font-black text-[10px] uppercase transition-all tracking-widest">{t('dashboard.confirm_no')}</button></AlertDialogCancel>
            <AlertDialogAction asChild><button onClick={handleCancelBooking} className="h-11 w-1/2 rounded-[10px] bg-red-500 text-white font-black text-[10px] uppercase shadow-lg transition-all tracking-widest">{t('dashboard.confirm_yes')}</button></AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
