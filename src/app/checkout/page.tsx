"use client"

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { usePortal } from '@/components/portal-provider';
import { PortalNav } from '@/components/shared/portal-nav';
import { LoadingScreen } from '@/components/shared/loading-screen';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, ShieldCheck, CheckCircle2, ArrowRight, User, 
  MapPin, Building, Mailbox, Phone, Lock, Plus, Trash2, 
  History, Info, Receipt, Globe, AlertTriangle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

function CheckoutContent() {
  const { isRTL, t, createBooking, savedCards, addSavedCard, deleteSavedCard, updateRoomStatus, verifySavedCardCVV, setIsLoading } = usePortal();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessingLocal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<any>(null);
  
  const [paymentMode, setPaymentMode] = useState<'saved' | 'new' | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [cvv, setCvv] = useState('');
  const [cvvError, setCvvError] = useState<string | null>(null);
  
  const yearInputRef = useRef<HTMLInputElement>(null);
  const cvvInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    cardHolder: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvv: "",
    country: "",
    city: "",
    address: "",
    zip: "",
    phone: ""
  });

  const curr = t('common.currency');

  useEffect(() => {
    const saved = localStorage.getItem('horizon_pending_booking');
    if (saved) {
      setPendingBooking(JSON.parse(saved));
      if (savedCards.length > 0) {
        setPaymentMode('saved');
        setSelectedCardId(savedCards[0].id);
      } else {
        setPaymentMode('new');
      }
    } else {
      router.push('/');
    }
  }, [router, savedCards]);

  const handleMonthChange = (val: string) => {
    const numeric = val.replace(/\D/g, '').slice(0, 2);
    if (!numeric) { setFormData({ ...formData, expMonth: "" }); return; }
    if (numeric[0] === '1') {
      setFormData({ ...formData, expMonth: numeric });
      if (numeric.length === 2) yearInputRef.current?.focus();
    } else if (parseInt(numeric[0]) >= 2 && numeric.length === 1) {
      setFormData({ ...formData, expMonth: '0' + numeric });
      yearInputRef.current?.focus();
    } else {
      setFormData({ ...formData, expMonth: numeric });
      if (numeric.length === 2) yearInputRef.current?.focus();
    }
  };

  const finalizeBooking = async () => {
    if (!pendingBooking) return;
    setIsProcessingLocal(true);
    setIsLoading(true);

    try {
      const bookingData = { 
        ...pendingBooking, 
        isPaid: true, 
        status: 'Active',
        paidAt: new Date().toISOString()
      };
      
      await createBooking(bookingData);
      await updateRoomStatus(pendingBooking.roomPhysicalId, 'occupied', pendingBooking.id);
      
      localStorage.removeItem('horizon_pending_booking');
      
      setTimeout(() => {
        setIsProcessingLocal(false);
        setIsLoading(false);
        setIsSuccess(true);
        toast({ title: t('notification.payment_online_success') });
        setTimeout(() => router.push('/dashboard'), 3000);
      }, 3000);

    } catch (e) {
      setIsProcessingLocal(false);
      setIsLoading(false);
      toast({ variant: "destructive", description: "Payment confirmation failed" });
    }
  };

  const handleFinalPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingBooking) return;

    if (paymentMode === 'new') {
      const required = ['cardHolder', 'cardNumber', 'expMonth', 'expYear', 'cvv', 'country', 'city', 'address', 'zip', 'phone'];
      if (required.some(k => !formData[k as keyof typeof formData])) {
        toast({ variant: "destructive", description: t('error.invalid_id') });
        return;
      }
      
      setIsLoading(true);
      setTimeout(() => {
        addSavedCard({
          holderName: formData.cardHolder,
          lastFour: formData.cardNumber.slice(-4),
          expMonth: formData.expMonth,
          expYear: formData.expYear,
          brand: 'Visa',
          cvv: formData.cvv 
        });
        finalizeBooking();
      }, 1000);
    } else {
      if (!selectedCardId || !cvv || cvv.length < 3) {
        setCvvError(isRTL ? "من فضلك أدخل رمز الأمان" : "Please enter security code");
        return;
      }

      const result = verifySavedCardCVV(selectedCardId, cvv);
      
      if (result.success) {
        setCvvError(null);
        finalizeBooking();
      } else {
        if (result.isLocked) {
          setCvvError(isRTL 
            ? "تم قفل هذه البطاقة مؤقتاً لمدة 24 ساعة بسبب تجاوز عدد المحاولات." 
            : "Card locked for 24h due to too many failed attempts.");
        } else if (result.remainingAttempts !== undefined) {
          setCvvError(isRTL 
            ? `رمز الأمان غير صحيح. أمامك ${result.remainingAttempts} محاولات متبقية` 
            : `Security code incorrect. ${result.remainingAttempts} attempts remaining`);
        } else {
          setCvvError(isRTL ? "رمز الأمان غير صحيح" : "Security code is incorrect");
        }
      }
    }
  };

  if (isProcessing) return null;

  return (
    <div className="min-h-screen bg-background portal-transition-bg pb-20">
      <PortalNav />
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center space-y-8 py-20">
              <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-[40px] flex items-center justify-center border-4 border-green-500/20 shadow-2xl animate-bounce"><CheckCircle2 size={48} /></div>
              <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tighter">{t('checkout.success_title')}</h1>
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.3em]">{t('checkout.redirect_msg')}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              <div className="lg:col-span-5 space-y-6">
                <Card className="p-6 rounded-[32px] border-outer bg-card space-y-6 block-shadow relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary/30" />
                  <div className={cn("flex items-center gap-3 border-b border-border/5 pb-4", isRTL ? "flex-row-reverse" : "flex-row")}>
                    <Receipt size={18} className="text-primary" />
                    <h2 className="text-xs font-black uppercase tracking-widest">{t('booking.summary')}</h2>
                  </div>

                  <div className="space-y-5">
                    <div className="flex gap-4 items-center bg-muted/5 p-4 rounded-[20px] border-inner border-opacity-30">
                      <div className="w-16 h-16 rounded-[16px] overflow-hidden border-inner shrink-0 shadow-md">
                        <img src={pendingBooking?.hotelImage} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="space-y-1 text-start overflow-hidden">
                        <p className="text-sm font-black truncate tracking-tight">{t(pendingBooking?.hotelName || '')}</p>
                        <p className="text-[9px] font-bold opacity-40 uppercase flex items-center gap-1.5"><MapPin size={10} className="text-primary" /> {t(pendingBooking?.location || '')}</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-[10px] font-black border-t border-border/5 pt-5">
                      <div className="flex justify-between items-center"><span className="opacity-40 uppercase tracking-widest">{t('booking.room_type')}</span><span>{t(pendingBooking?.roomType || '')}</span></div>
                      <div className="flex justify-between items-center"><span className="opacity-40 uppercase tracking-widest">{t('booking.dates')}</span><Badge variant="outline" className="border-primary/20 text-primary h-6 px-3 rounded-lg font-black">{pendingBooking?.dates}</Badge></div>
                    </div>

                    <div className="p-5 bg-primary/5 rounded-[24px] border-inner flex items-center justify-between shadow-inner mt-4">
                      <div className="space-y-0.5 text-start">
                        <span className="text-[9px] font-black uppercase opacity-40 block tracking-widest">{t('booking.total_price')}</span>
                        <span className="text-3xl font-black text-primary tracking-tighter leading-none">{pendingBooking?.totalPrice?.toLocaleString()} <span className="text-xs font-bold ml-0.5">{curr}</span></span>
                      </div>
                      <ShieldCheck size={28} className="text-primary opacity-20" />
                    </div>
                  </div>
                </Card>

                <div className="bg-green-500/5 p-5 rounded-[24px] border border-green-500/10 flex items-center gap-4">
                  <ShieldCheck className="text-green-500 shrink-0" size={24} />
                  <p className="text-[10px] font-black text-green-500/80 uppercase tracking-widest text-start leading-relaxed">{t('checkout.secure_msg')}</p>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <header className={cn("text-start space-y-1 mb-2")}>
                  <h1 className="text-3xl font-black tracking-tighter">{t('payment.method_title')}</h1>
                  <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.3em]">{t('payment.online_desc')}</p>
                </header>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button type="button" onClick={() => { setPaymentMode('saved'); setCvvError(null); if(savedCards.length > 0) setSelectedCardId(savedCards[0].id); }} className={cn("h-12 rounded-[18px] border-[1.5px] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3", paymentMode === 'saved' ? "bg-primary text-white border-primary shadow-lg" : "bg-muted/5 border-inner opacity-40 hover:opacity-100")}><History size={16} /> {isRTL ? "البطاقات المسجلة" : "Saved Cards"}</button>
                  <button type="button" onClick={() => { setPaymentMode('new'); setCvvError(null); }} className={cn("h-12 rounded-[18px] border-[1.5px] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3", paymentMode === 'new' ? "bg-primary text-white border-primary shadow-lg" : "bg-muted/5 border-inner opacity-40 hover:opacity-100")}><Plus size={16} /> {isRTL ? "بطاقة جديدة" : "New Card"}</button>
                </div>

                <form onSubmit={handleFinalPayment} className="space-y-6">
                  <AnimatePresence mode="wait">
                    {paymentMode === 'saved' && (
                      <motion.div key="saved-cards" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                        {savedCards.length > 0 ? (
                          <div className="grid grid-cols-1 gap-3">
                            {savedCards.map(card => {
                              const isLocked = card.lockUntil && new Date(card.lockUntil) > new Date();
                              return (
                                <div key={card.id} className="space-y-2">
                                  <Card 
                                    onClick={() => { if(!isLocked) { setSelectedCardId(card.id); setCvvError(null); } }} 
                                    className={cn(
                                      "p-5 rounded-[28px] border-outer cursor-pointer transition-all flex items-center gap-4 group relative overflow-hidden", 
                                      selectedCardId === card.id ? "bg-primary/10 border-primary shadow-md" : "bg-card hover:bg-muted/5 border-opacity-40",
                                      isLocked && "opacity-50 grayscale cursor-not-allowed border-red-500/30"
                                    )}
                                  >
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-inner", selectedCardId === card.id ? "bg-primary text-white" : "bg-primary/5 text-primary")}>
                                      {isLocked ? <Lock size={20} className="text-red-500" /> : <CreditCard size={20} />}
                                    </div>
                                    <div className="flex-1 text-start">
                                      <p className="text-xs font-black tracking-tight">Visa **** **** **** {card.lastFour}</p>
                                      <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{card.holderName} • Exp {card.expMonth}/{card.expYear}</p>
                                    </div>
                                    {selectedCardId === card.id && !isLocked && (
                                      <div className="w-[80px] space-y-1 animate-in zoom-in duration-300">
                                        <Label className="text-[10px] font-black uppercase opacity-40 text-center block">CVV</Label>
                                        <Input required value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))} placeholder="123" className="h-8 text-center text-[10px] font-black rounded-lg bg-background dark:bg-muted/10 border-inner" />
                                      </div>
                                    )}
                                    <button type="button" onClick={(e) => { e.stopPropagation(); deleteSavedCard(card.id); }} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"><Trash2 size={14} /></button>
                                  </Card>
                                  {isLocked && selectedCardId === card.id && (
                                    <div className="flex items-center gap-3 p-3 bg-red-500/5 border border-red-500/20 rounded-[15px] text-red-500 animate-in slide-in-from-top-2">
                                      <AlertTriangle size={14} />
                                      <p className="text-[10px] font-black uppercase leading-tight">{isRTL ? "البطاقة مقفلة مؤقتاً لمدة 24 ساعة. يرجى الانتظار أو استخدام بطاقة أخرى." : "Card locked for 24h. Please wait or use another card."}</p>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="py-12 text-center space-y-4 bg-muted/5 rounded-[32px] border-inner border-dashed border-2">
                            <Info size={32} className="mx-auto opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-widest">{t('reception.no_results')}</p>
                            <button type="button" onClick={() => setPaymentMode('new')} className="h-9 px-6 bg-primary/10 text-primary border border-primary/20 rounded-xl font-black text-[10px] uppercase hover:bg-primary hover:text-white transition-all">{isRTL ? "إضافة بطاقة جديدة" : "Add New Card"}</button>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {paymentMode === 'new' && (
                      <motion.div key="new-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                        <Card className="p-6 rounded-[32px] border-outer bg-card space-y-6 border-opacity-40">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-border/10"><CreditCard className="text-primary" size={14} /><span className="text-[10px] font-black uppercase tracking-widest text-primary">{t('checkout.payment_details')}</span></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5 text-start col-span-1 md:col-span-2"><Label className="text-[10px] font-black uppercase opacity-40 px-1">{t('checkout.cardholder')}</Label><div className="relative group"><Input value={formData.cardHolder} onChange={e => setFormData({...formData, cardHolder: e.target.value})} className="h-11 rounded-[12px] px-10 text-[10px] font-bold bg-background dark:bg-muted/10 border-inner" /><User className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30 text-primary" size={14} /></div></div>
                              <div className="space-y-1.5 text-start col-span-1 md:col-span-2"><Label className="text-[10px] font-black uppercase opacity-40 px-1">{t('checkout.card_number')}</Label><div className="relative group"><Input value={formData.cardNumber} maxLength={16} onChange={e => setFormData({...formData, cardNumber: e.target.value.replace(/\D/g, '')})} className="h-11 rounded-[12px] px-10 text-[10px] font-bold bg-background dark:bg-muted/10 border-inner" /><CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30 text-primary" size={14} /></div></div>
                              
                              <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 text-start"><Label className="text-[10px] font-black uppercase opacity-40 px-1">{t('checkout.expiry')}</Label><div className="flex gap-2"><Input value={formData.expMonth} onChange={e => handleMonthChange(e.target.value)} placeholder="MM" className="h-11 rounded-[12px] text-center text-[10px] font-bold bg-background dark:bg-muted/10 border-inner w-16" /><Input ref={yearInputRef} value={formData.expYear} onChange={e => { const val = e.target.value.replace(/\D/g, '').slice(0, 2); setFormData({...formData, expYear: val}); if(val.length === 2) cvvInputRef.current?.focus(); }} placeholder="YY" className="h-11 rounded-[12px] text-center text-[10px] font-bold bg-background dark:bg-muted/10 border-inner w-16" /></div></div>
                                <div className="space-y-1.5 text-start"><Label className="text-[10px] font-black uppercase opacity-40 px-1">{t('checkout.cvv')}</Label><div className="relative group"><Input ref={cvvInputRef} value={formData.cvv} onChange={e => setFormData({...formData, cvv: e.target.value.replace(/\D/g, '').slice(0, 3)})} placeholder="123" className="h-11 rounded-[12px] px-10 text-[10px] font-bold bg-background dark:bg-muted/10 border-inner text-center" /><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30 text-primary" size={14} /></div></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4 pt-4 border-t border-border/10">
                            <div className="flex items-center gap-2 pb-2 border-b border-border/10"><Building className="text-primary" size={14} /><span className="text-[10px] font-black uppercase tracking-widest text-primary">{t('checkout.billing_info')}</span></div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5 text-start"><Label className="text-[10px] font-black uppercase opacity-40 px-1">{t('auth.nationality')}</Label><div className="relative"><Input value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="h-11 rounded-[12px] px-10 text-[10px] font-bold bg-background dark:bg-muted/10 border-inner" /><Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30" size={14} /></div></div>
                              <div className="space-y-1.5 text-start"><Label className="text-[10px] font-black uppercase opacity-40 px-1">{t('checkout.city')}</Label><div className="relative"><Input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="h-11 rounded-[12px] px-10 text-[10px] font-bold bg-background dark:bg-muted/10 border-inner" /><Building className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30" size={14} /></div></div>
                              <div className="space-y-1.5 text-start"><Label className="text-[10px] font-black uppercase opacity-40 px-1">{t('checkout.address')}</Label><div className="relative"><Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="h-11 rounded-[12px] px-10 text-[10px] font-bold bg-background dark:bg-muted/10 border-inner" /><MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30" size={14} /></div></div>
                              <div className="space-y-1.5 text-start"><Label className="text-[10px] font-black uppercase opacity-40 px-1">{t('checkout.postal')}</Label><div className="relative"><Input value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} className="h-11 rounded-[12px] px-10 text-[10px] font-bold bg-background dark:bg-muted/10 border-inner" /><Mailbox className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30" size={14} /></div></div>
                              <div className="space-y-1.5 text-start col-span-2"><Label className="text-[10px] font-black uppercase opacity-40 px-1">{t('auth.phone')}</Label><div className="relative"><Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="h-11 rounded-[12px] px-10 text-[10px] font-bold bg-background dark:bg-muted/10 border-inner" /><Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30" size={14} /></div></div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-4">
                    <AnimatePresence>
                      {cvvError && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-[20px] flex items-center gap-3 text-red-500">
                          <AlertTriangle size={18} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{cvvError}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button 
                      type="submit" 
                      disabled={Boolean(!paymentMode || (paymentMode === 'saved' && selectedCardId && savedCards.find(c => c.id === selectedCardId)?.lockUntil && new Date(savedCards.find(c => c.id === selectedCardId)!.lockUntil!) > new Date()))}
                      className={cn(
                        "w-full h-16 text-white font-black text-sm uppercase tracking-[0.2em] rounded-[24px] shadow-2xl transition-all flex items-center justify-center gap-4 border-b-4",
                        !paymentMode ? "bg-muted cursor-not-allowed opacity-50" : "bg-primary hover:brightness-110 active:scale-[0.98] border-primary/30"
                      )}
                    >
                      {t('checkout.pay_now')} {pendingBooking?.totalPrice?.toLocaleString()} {curr}
                      <ArrowRight className={cn("transition-transform group-hover:translate-x-2", isRTL && "rotate-180")} size={20} />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <CheckoutContent />
    </Suspense>
  );
}
