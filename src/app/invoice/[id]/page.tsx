
"use client"

import React, { useMemo, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePortal } from '@/components/portal-provider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EgyptianHorizonLogo } from '@/components/shared/horizon-logo';
import { Printer, ArrowRight, ShieldCheck, MapPin, Calendar, Bed, User, Hash, Receipt, Calculator, Percent, Tag, Zap, Banknote, CreditCard, CheckCircle2, Users, Baby, PlusSquare, Utensils } from 'lucide-react';
import { format, differenceInDays, isValid } from 'date-fns';
import { ar, enUS, fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

/**
 * @fileOverview صفحة الفاتورة الرسمية الموحدة - إصدار الطباعة الاحترافي المطور.
 * تم تحديث ألوان وضع الطباعة لضمان ظهور العلامة المائية من خلف كشف الحساب.
 */
export default function InvoicePage() {
  const { id } = useParams();
  const { allBookings, isRTL, t, language, user } = usePortal();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const backPath = useMemo(() => {
    if (user?.role === 'staff') return '/dashboard';
    return '/customer/dashboard';
  }, [user]);

  const booking = useMemo(() => {
    return allBookings.find(b => b.id?.toString() === id?.toString());
  }, [allBookings, id]);

  const handlePrint = () => {
    window.print();
  };

  const getLocale = () => {
    if (language === 'ar') return ar;
    if (language === 'fr') return fr;
    return enUS;
  };

  const formatDateLocally = (dateStr: any) => {
    if (!dateStr) return t('common.loading');
    try {
      const d = new Date(dateStr);
      return isValid(d) ? format(d, 'dd MMMM yyyy', { locale: getLocale() }) : t('common.loading');
    } catch (e) { return t('common.loading'); }
  };

  const financialData = useMemo(() => {
    if (!booking) return null;
    
    const nights = (booking.checkIn && booking.checkOut) 
      ? Math.max(1, differenceInDays(new Date(booking.checkOut), new Date(booking.checkIn))) 
      : (booking.nights || 1);
    
    const total = booking.totalPrice || 0;
    const taxRate = 0.14; 
    const serviceRate = 0.10; 
    
    const subtotalWithServices = total / (1 + taxRate + serviceRate);
    const taxes = subtotalWithServices * taxRate;
    const fees = subtotalWithServices * serviceRate;
    const baseAccommodation = subtotalWithServices * 0.9;
    const extraServices = subtotalWithServices * 0.1;
    
    const nightlyRate = baseAccommodation / nights;

    return {
      nights,
      nightlyRate: Math.round(nightlyRate),
      accommodationTotal: Math.round(baseAccommodation),
      servicesTotal: Math.round(extraServices),
      feesTotal: Math.round(fees),
      taxesTotal: Math.round(taxes),
      discount: booking.discount || 0,
      deposit: booking.deposit || 0,
      grandTotal: total
    };
  }, [booking]);

  if (!mounted) return null;
  
  if (!booking || !financialData) return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4 bg-background">
      <EgyptianHorizonLogo isStatic={true} className="w-16 h-16 opacity-20" />
      <p className="text-[11px] font-black uppercase opacity-40 tracking-widest text-center px-6">{t('reception.no_results')}</p>
      <button onClick={() => router.push(backPath)} className="h-11 px-8 bg-primary text-white rounded-[9px] text-[10px] font-black uppercase shadow-lg transition-all hover:brightness-110">{t('invoice.back_btn')}</button>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#9ba1a6] dark:bg-[#050A14] py-8 px-4 print:py-0 print:px-0 print:bg-white transition-colors duration-500 flex flex-col items-center overflow-x-hidden">
      <style jsx global>{`
        footer { display: none !important; }
        @media print {
          html, body, main { background-color: white !important; background-image: none !important; height: auto !important; min-height: auto !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .no-print { display: none !important; }
          @page { size: A4; margin: 0.5cm !important; }
          .invoice-card { background: white !important; border: 1px solid #e2e8f0 !important; box-shadow: none !important; width: 100% !important; max-width: 100% !important; height: auto !important; min-height: auto !important; padding: 0 !important; margin: 0 !important; transform: scale(0.98); transform-origin: top center; }
          /* ROOT FIX: Ensuring transparency to show watermark in print */
          .financial-breakdown-box { 
            background-color: transparent !important; 
            border: 1px solid #e2e8f0 !important;
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
          }
          .print-watermark {
            opacity: 0.3 !important;
            display: block !important;
          }
          span, p, h1, h2, h3, h4, h5, h6, div, label { color: #0F172A !important; opacity: 1 !important; -webkit-print-color-adjust: exact !important; }
          .text-primary { color: #0369A1 !important; }
        }
      `}</style>

      <div className="w-full max-w-[720px] space-y-4 animate-in fade-in duration-700 print:max-w-full print:space-y-0">
        
        <div className="flex items-center justify-between no-print mb-2 bg-card/40 p-2 rounded-2xl border-inner backdrop-blur-md shadow-sm">
          <button onClick={() => router.push(backPath)} className="flex items-center gap-2 text-[9px] font-black uppercase opacity-40 hover:opacity-100 transition-all group px-2">
            <ArrowRight size={14} className={cn("transition-transform", isRTL ? "group-hover:translate-x-1" : "group-hover:-translate-x-1 rotate-180")} /> {t('invoice.back_btn')}
          </button>
          <button 
            onClick={handlePrint}
            className="h-10 px-6 bg-primary text-white rounded-[9px] font-black text-[9px] uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border-b-4 border-primary/30"
          >
            <Printer size={16} /> {t('invoice.print_btn')}
          </button>
        </div>

        <Card className="bg-white/95 dark:bg-[#0b101c]/40 backdrop-blur-3xl border-outer rounded-[9px] overflow-hidden shadow-2xl print:shadow-none relative flex flex-col h-auto min-h-fit invoice-card">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.4] pointer-events-none select-none z-0 print-watermark">
            <EgyptianHorizonLogo isStatic={true} className="w-[320px] h-[280px]" />
          </div>

          <div className="p-5 border-b border-border/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-primary/[0.02] relative z-10 print:py-3">
            <div className={cn("flex items-center gap-3", isRTL ? "flex-row-reverse" : "flex-row")}>
              <EgyptianHorizonLogo isStatic={true} className="w-12 h-12 rounded-[12px]" />
              <div className={cn("text-start space-y-0.5", isRTL ? "text-right" : "text-left")}>
                <h1 className={cn("text-lg font-black text-foreground/90", isRTL ? "tracking-normal" : "tracking-tighter uppercase")}>{t('home.brand_name')} <span className="text-primary">{language === 'ar' ? 'للضيافة' : 'Hospitality'}</span></h1>
                <p className={cn("text-[7px] font-bold opacity-40 uppercase", isRTL ? "tracking-normal" : "tracking-[0.3em]")}>{t('invoice.subtitle')}</p>
              </div>
            </div>
            <div className={cn("space-y-1", isRTL ? "text-end" : "text-start md:text-end")}>
              <Badge className="bg-primary text-white text-[7.5px] font-black px-3 py-0.5 rounded-full border-none">{t('invoice.certified')}</Badge>
              <div className="pt-1">
                <p className="text-[9px] font-black text-primary uppercase tracking-tighter" suppressHydrationWarning>{t('invoice.ref_num')}: #{booking.id.toString().toUpperCase()}</p>
                <p className="text-[7px] font-bold opacity-40 uppercase tracking-widest mt-0.5" suppressHydrationWarning>{t('invoice.date_label')}: {formatDateLocally(new Date())}</p>
              </div>
            </div>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 print:py-3">
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-border/10 pb-1.5">
                <div className="w-5 h-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><User size={10} /></div>
                <h2 className="text-[9px] font-black uppercase tracking-widest text-foreground/70">{t('invoice.guest_section')}</h2>
              </div>
              <div className="space-y-2 text-start">
                <div className="space-y-0.5"><span className="text-[6.5px] font-black uppercase opacity-30 block">{t('auth.fullname')}</span><p className="text-[10px] font-black text-foreground/90 truncate">{booking.guest?.name || t('common.loading')}</p></div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-0.5"><span className="text-[6.5px] font-black uppercase opacity-30 block truncate">{t('reception.id_number')}</span><p className="text-[9px] font-bold truncate">{booking.guest?.identity || "---"}</p></div>
                  <div className="space-y-0.5"><span className="text-[6.5px] font-black uppercase opacity-30 block truncate">{t('auth.phone')}</span><p className="text-[9px] font-bold truncate">
                    <span dir="ltr">{booking.guest?.phone || "---"}</span>
                  </p></div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-border/10 pb-1.5">
                <div className="w-5 h-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><ShieldCheck size={10} /></div>
                <h2 className="text-[9px] font-black uppercase tracking-widest text-foreground/70">{t('invoice.unit_section')}</h2>
              </div>
              <div className="space-y-2 text-start">
                <div className="space-y-0.5"><span className="text-[6.5px] font-black uppercase opacity-30 block truncate">{t('reception.details_modal.hotel')}</span><p className="text-[10px] font-black text-foreground/90 flex items-center gap-1.5 truncate"><MapPin size={9} className="text-primary" /> {t(booking.hotelName)} — {t(booking.location || '')}</p></div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-0.5"><span className="text-[6.5px] font-black uppercase opacity-30 block truncate">{t('unit_number')}</span><p className="text-[9px] font-black text-primary uppercase" suppressHydrationWarning>#{booking.roomId || "---"}</p></div>
                  <div className="space-y-0.5"><span className="text-[6.5px] font-black uppercase opacity-30 block truncate">{t('booking.room_type')}</span><p className="text-[9px] font-bold uppercase truncate">{t(`booking.${booking.roomType}`)}</p></div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 pb-2 relative z-10">
            <div className="bg-primary/[0.03] border border-primary/10 rounded-[9px] p-2 flex items-center justify-center gap-3 overflow-hidden">
              <Calendar size={12} className="text-primary opacity-60 shrink-0" />
              <p className="text-[9px] font-black text-foreground/80 uppercase truncate" suppressHydrationWarning>
                {t('invoice.stay_info')}: {formatDateLocally(booking.checkIn)} — {formatDateLocally(booking.checkOut)} 
                — <span className={cn("bg-primary/10 px-2 py-0.5 rounded-lg font-black text-[8px]", isRTL ? "ml-1" : "mr-1")}>{financialData.nights} {t('invoice.nights_label')}</span>
              </p>
            </div>
          </div>

          <div className="px-5 grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10 py-3">
            <div className="p-2.5 rounded-[9px] border border-border/5 bg-muted/5 flex items-center gap-3 overflow-hidden">
              <Users size={14} className="text-primary opacity-40 shrink-0" />
              <div className="space-y-0.5 text-start overflow-hidden"><span className="text-[6px] font-black uppercase opacity-30 block truncate">{t('booking.adults')}</span><p className="text-[9px] font-black truncate">{booking.totalPersons || 1}</p></div>
            </div>
            <div className="p-2.5 rounded-[9px] border border-border/5 bg-muted/5 flex items-center gap-3 overflow-hidden">
              <Baby size={14} className="text-primary opacity-40 shrink-0" />
              <div className="space-y-0.5 text-start overflow-hidden"><span className="text-[6px] font-black uppercase opacity-30 block truncate">{t('invoice.children_count')}</span><p className="text-[9px] font-black truncate" suppressHydrationWarning>{booking.children > 0 ? booking.children : "0"}</p></div>
            </div>
            <div className="p-2.5 rounded-[9px] border border-border/5 bg-muted/5 flex items-center gap-3 overflow-hidden">
              <Utensils size={14} className="text-primary opacity-40 shrink-0" />
              <div className="space-y-0.5 text-start overflow-hidden"><span className="text-[6px] font-black uppercase opacity-30 block truncate">{t('meal.plan_title')}</span><p className="text-[9px] font-black truncate">{t(`meal.${booking.mealPlan}`)}</p></div>
            </div>
            <div className="p-2.5 rounded-[9px] border border-border/5 bg-muted/5 flex items-center gap-3 overflow-hidden">
              <PlusSquare size={14} className="text-primary opacity-40 shrink-0" />
              <div className="space-y-0.5 text-start overflow-hidden"><span className="text-[6px] font-black uppercase opacity-30 block truncate">{t('invoice.extra_beds')}</span><p className="text-[9px] font-black truncate" suppressHydrationWarning>{booking.extraBeds > 0 ? booking.extraBeds : "0"}</p></div>
            </div>
          </div>

          <div className="px-5 pb-6 relative z-10">
            {/* Integrated Breakdown Box - Transparent Background to match Card exactly */}
            <div className="financial-breakdown-box border border-border/20 rounded-[12px] overflow-hidden bg-transparent">
              <div className="p-3 bg-primary/5 border-b border-border/10 flex items-center gap-3">
                <Calculator size={14} className="text-primary" />
                <h3 className="text-[9px] font-black uppercase tracking-widest text-foreground/80 truncate">{t('invoice.breakdown.title')}</h3>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-1 border-b border-primary/5">
                      <Bed size={12} className="text-primary/60" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-primary/70 truncate">{t('invoice.breakdown.accommodation')}</span>
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center text-start">
                        <span className="text-[9px] font-bold text-foreground/50 truncate">{t('invoice.breakdown.night_rate')}</span>
                        <span className="text-[10px] font-black whitespace-nowrap" suppressHydrationWarning>{financialData.nightlyRate?.toLocaleString()} {t('common.currency')}</span>
                      </div>
                      <div className="flex justify-between items-center text-start">
                        <span className="text-[9px] font-bold text-foreground/50 truncate" suppressHydrationWarning>{t('invoice.breakdown.total_stay')} ({financialData.nights})</span>
                        <span className="text-[10px] font-black whitespace-nowrap" suppressHydrationWarning>{financialData.accommodationTotal?.toLocaleString()} {t('common.currency')}</span>
                      </div>
                      <div className="flex justify-between items-center text-start">
                        <span className="text-[9px] font-bold text-foreground/50 flex items-center gap-1.5 truncate"><Zap size={10} className="text-amber-500" /> {t('invoice.breakdown.extra_services')}</span>
                        <span className="text-[10px] font-black text-amber-600 whitespace-nowrap" suppressHydrationWarning>+{financialData.servicesTotal?.toLocaleString()} {t('common.currency')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-1 border-b border-primary/5">
                      <Percent size={12} className="text-primary/60" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-primary/70 truncate">{t('invoice.breakdown.taxes_fees')}</span>
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center text-start">
                        <span className="text-[9px] font-bold text-foreground/50 truncate">{t('invoice.breakdown.service_fees')}</span>
                        <span className="text-[10px] font-black whitespace-nowrap" suppressHydrationWarning>{financialData.feesTotal?.toLocaleString()} {t('common.currency')}</span>
                      </div>
                      <div className="flex justify-between items-center text-start">
                        <span className="text-[9px] font-bold text-foreground/50 truncate">{t('invoice.breakdown.vat')}</span>
                        <span className="text-[10px] font-black whitespace-nowrap" suppressHydrationWarning>{financialData.taxesTotal?.toLocaleString()} {t('common.currency')}</span>
                      </div>
                      {financialData.discount > 0 && (
                        <div className="flex justify-between items-center text-start bg-green-500/5 px-2 py-1 rounded-lg">
                          <span className="text-[9px] font-bold text-green-600 flex items-center gap-1.5 truncate"><Tag size={10} /> {t('invoice.breakdown.discount')}</span>
                          <span className="text-[10px] font-black text-green-600 whitespace-nowrap" suppressHydrationWarning>-{financialData.discount?.toLocaleString()} {t('common.currency')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-5 w-full md:w-auto">
                    {financialData.deposit > 0 && (
                      <div className="bg-green-500/5 border border-green-500/10 p-2.5 rounded-xl flex flex-col text-start min-w-[140px]">
                        <span className="text-[7px] font-black uppercase text-green-700/50 mb-0.5 truncate">{t('invoice.breakdown.deposit')}</span>
                        <span className="text-[11px] font-black text-green-700 whitespace-nowrap" suppressHydrationWarning>-{financialData.deposit?.toLocaleString()} {t('common.currency')}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-[14px] bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0"><Banknote size={24} /></div>
                      <div className="flex flex-col text-start">
                        <span className="text-[8px] font-black uppercase opacity-40 tracking-widest mb-0.5 truncate">{t('invoice.breakdown.grand_total')}</span>
                        <div className="flex items-baseline gap-1 leading-none">
                          <span className="text-3xl font-black text-primary tracking-tighter" suppressHydrationWarning>
                            {(financialData.grandTotal - financialData.deposit).toLocaleString()}
                          </span>
                          <span className="text-[10px] font-black text-primary opacity-60 uppercase">{t('common.currency')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-5 py-2.5 bg-muted/5 border border-border/5 rounded-[12px] w-full md:w-auto justify-center md:justify-start">
                    <div className="flex flex-col text-start overflow-hidden">
                      <span className="text-[7px] font-black uppercase opacity-30 tracking-widest truncate">{t('invoice.breakdown.payment_method')}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        {booking.isPaid ? <CreditCard size={12} className="text-primary" /> : <Banknote size={12} className="text-primary" />}
                        <span className="text-[9px] font-black text-foreground/80 uppercase truncate">
                          {booking.isPaid ? t('payment.pay_online') : t('payment.pay_arrival')}
                        </span>
                      </div>
                    </div>
                    {booking.isPaid && <div className={cn("w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 shrink-0", isRTL ? "ml-2" : "mr-2")}>
                      <CheckCircle2 size={14} />
                    </div>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-border/10 bg-muted/5 flex flex-col items-center justify-center space-y-1 text-center mt-auto relative z-10 print:py-2">
            <div className="flex flex-col items-center justify-center">
              <h4 className="text-[16px] font-black text-primary tracking-tighter drop-shadow-[0_0_8px_rgba(110,198,217,0.3)]">{t('invoice.title')}</h4>
              <p className={cn("text-[7px] font-bold opacity-40 uppercase", isRTL ? "tracking-normal" : "tracking-[0.3em]")}>{t('invoice.subtitle')}</p>
            </div>
            <div className="pt-1 flex flex-col items-center gap-0.5 opacity-30">
              <EgyptianHorizonLogo isStatic={true} className="w-5 h-5 opacity-30 grayscale" />
              <p className="text-[5.5px] font-bold tracking-widest uppercase">{t('invoice.footer_msg')}</p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
