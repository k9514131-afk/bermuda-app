
"use client"

import React, { useState, useMemo, useEffect, useCallback, memo } from 'react';
import { usePortal } from '@/components/portal-provider';
import { PortalNav } from '@/components/shared/portal-nav';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  User, ArrowRight, ShieldCheck, Fingerprint, Phone, Globe, Calendar as CalendarIcon,
  Banknote, Landmark, Waves, Sparkles, Dumbbell, Compass, Receipt, Info, CheckCircle2,
  Plus, Minus, CreditCard, Clock, Users, Loader2, Edit3, ChevronRight, ChevronLeft, QrCode, Smartphone, XCircle, Settings2, Globe2
} from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countryCodes } from '@/lib/translations/countries';
import { motion, AnimatePresence } from 'framer-motion';
import { EgyptianHorizonLogo } from '@/components/shared/horizon-logo';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { apiRequest } from '@/lib/api';

const ADDITIONAL_SERVICES = [
  { id: 'pool', nameKey: 'walkin.services.pool', price: 350, icon: Waves },
  { id: 'spa', nameKey: 'walkin.services.spa', price: 1200, icon: Sparkles },
  { id: 'gym', nameKey: 'walkin.services.gym', price: 250, icon: Dumbbell },
  { id: 'trips', nameKey: 'walkin.services.trips', price: 2500, icon: Compass },
];

const fieldBorder = "border-inner border-[1.2px]";

const CompanionForm = memo(({ comp, idx, t, updateCompanionField, className }: { comp: any, idx: number, t: any, updateCompanionField: any, className?: string }) => {
  const isInfant = comp.ageType === 'infant';
  const isChild = comp.ageType === 'child';
  const isAdult = comp.ageType === 'adult';
  const controlHeight = "h-10";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("p-5 border-inner bg-background/40 flex flex-col gap-4 overflow-visible rounded-[9px] relative group min-h-[220px] backdrop-blur-sm shadow-sm", fieldBorder, className)}
    >
      <div className="flex justify-between items-center border-b border-border/10 pb-2 shrink-0">
        <span className="text-[10px] font-black uppercase opacity-60 text-foreground/80 tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('walkin.companion_form.guest_label')} #{idx + 1}</span>
        <Badge className="bg-primary/10 text-primary border-none text-[10px] h-4 font-black tracking-[0.12em]">{t('walkin.companion_form.verified')}</Badge>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-8">
            <Input
              value={comp.name}
              onChange={e => updateCompanionField(comp.id, 'name', e.target.value)}
              className={cn(controlHeight, fieldBorder, "text-[10px] font-bold px-3 rounded-[9px] w-full bg-muted/5")}
              placeholder={t('walkin.companion_form.name')}
            />
          </div>
          <div className="col-span-4">
            <Select value={comp.gender} onValueChange={v => updateCompanionField(comp.id, 'gender', v)}>
              <SelectTrigger className={cn(controlHeight, fieldBorder, "text-[10px] font-bold px-2 rounded-[9px] w-full bg-muted/5")}>
                <SelectValue placeholder={t('walkin.companion_form.gender')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male" className="text-[10px] font-bold">{t('walkin.logic.male')}</SelectItem>
                <SelectItem value="female" className="text-[10px] font-bold">{t('walkin.logic.female')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-3">
          {isInfant ? (
            <div className="col-span-12">
              <div className={cn(controlHeight, "flex items-center justify-center border border-dashed border-border/20 rounded-[9px] bg-primary/5")}>
                <span className="text-[10px] font-black opacity-40 uppercase tracking-[0.18em] text-primary" style={{ wordSpacing: '0.18em' }}>{t('walkin.logic.infant_label')}</span>
              </div>
            </div>
          ) : isChild ? (
            <>
              <div className="col-span-4">
                <Select value={comp.idType || 'birth'} onValueChange={v => updateCompanionField(comp.id, 'idType', v)}>
                  <SelectTrigger className={cn(controlHeight, fieldBorder, "text-[10px] font-bold px-2 rounded-[9px] bg-muted/5")}><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="birth" className="text-[10px] font-bold">{t('walkin.companion_form.birth_cert')}</SelectItem><SelectItem value="passport" className="text-[10px] font-bold">{t('walkin.companion_form.passport')}</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="col-span-3">
                <Input type="number" value={comp.age || ''} onChange={e => updateCompanionField(comp.id, 'age', e.target.value)} className={cn(controlHeight, fieldBorder, "text-[10px] font-bold px-2 text-center rounded-[9px] bg-muted/5")} placeholder={t('walkin.companion_form.age')} />
              </div>
              <div className="col-span-5">
                <Input value={comp.identity} onChange={e => updateCompanionField(comp.id, 'identity', e.target.value)} className={cn(controlHeight, fieldBorder, "text-[10px] font-bold px-3 rounded-[9px] bg-muted/5")} placeholder={comp.idType === 'passport' ? t('walkin.companion_form.passport') : t('walkin.companion_form.birth_cert')} />
              </div>
            </>
          ) : (
            <>
              <div className="col-span-4">
                <Select value={comp.idType || 'national'} onValueChange={v => updateCompanionField(comp.id, 'idType', v)}>
                  <SelectTrigger className={cn(controlHeight, fieldBorder, "text-[10px] font-bold px-2 rounded-[9px] bg-muted/5")}><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="national" className="text-[10px] font-bold">{t('walkin.companion_form.national_id')}</SelectItem><SelectItem value="passport" className="text-[10px] font-bold">{t('walkin.companion_form.passport')}</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="col-span-8">
                <Input value={comp.identity} onChange={e => updateCompanionField(comp.id, 'identity', e.target.value)} className={cn(controlHeight, fieldBorder, "text-[10px] font-bold px-3 rounded-[9px] bg-muted/5")} placeholder={t('walkin.companion_form.id_number')} />
              </div>
            </>
          )}
        </div>
      </div>
      <div className="pt-2 border-t border-border/10">
        <Select value={comp.ageType} onValueChange={(v: any) => updateCompanionField(comp.id, 'ageType', v)}>
          <SelectTrigger className="h-8 text-[10px] font-black uppercase bg-primary/10 rounded-[9px] hover:bg-primary/20 transition-all text-primary px-3 border-none shadow-inner tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="infant" className="text-[10px] font-black">{t('walkin.logic.infant_label')}</SelectItem><SelectItem value="child" className="text-[10px] font-black">{t('walkin.logic.child_label')}</SelectItem><SelectItem value="adult" className="text-[10px] font-black">{t('walkin.logic.adult_companion')}</SelectItem></SelectContent>
        </Select>
      </div>
    </motion.div>
  );
});
CompanionForm.displayName = 'CompanionForm';

export default function WalkInBookingPage() {
  const { t, user, rooms, hotels, createBooking, addAuditLog, updateRoomStatus, isRTL, mounted: isHydrated } = usePortal();
  const router = useRouter();
  const { toast } = useToast();

  const defaultHotelId = "cairo-1";
  const [roomTypeId, setRoomTypeId] = useState("");
  const [mealPlanId, setMealPlanId] = useState("");
  const [checkIn, setCheckIn] = useState<Date>(new Date());
  const [checkOut, setCheckOut] = useState<Date>(addDays(new Date(), 1));
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [hasDeposit, setHasDeposit] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "visa">("visa");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companions, setCompanions] = useState<any[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [currentCompanionPage, setCurrentCompanionPage] = useState(0);
  const companionsPerPage = 18;

  const [isWaitingForPayment, setIsWaitingForPayment] = useState(false);
  const [currentPaymentId, setCurrentPaymentId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const [localIp, setLocalIp] = useState<string>(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('bermuda_local_ip') || "";
    return "";
  });
  const [showIpSettings, setShowIpSettings] = useState(false);

  useEffect(() => {
    if (isHydrated) {
      if (!user || user.role !== 'staff') router.push('/');
    }
  }, [user, router, isHydrated]);

  const totalPersons = companions.length + 1;
  const selectedHotel = useMemo(() => hotels.find(h => h.id === defaultHotelId), [hotels, defaultHotelId]);
  const nights = useMemo(() => Math.max(1, differenceInDays(checkOut, checkIn)), [checkIn, checkOut]);

  const roomBasePrice = useMemo(() => selectedHotel?.rooms.find((r: any) => r.id === roomTypeId)?.basePrice || 5000, [selectedHotel, roomTypeId]);
  const extraBedPrice = useMemo(() => selectedHotel?.rooms.find((r: any) => r.id === roomTypeId)?.extraBedPrice || 500, [selectedHotel, roomTypeId]);

  const mealPricePerPerson = useMemo(() => {
    const plan = selectedHotel?.mealPlans.find((m: any) => m.id === mealPlanId);
    return plan?.pricePerPerson || 0;
  }, [selectedHotel, mealPlanId]);

  const servicesTotal = useMemo(() => selectedServices.reduce((acc, sid) => acc + (ADDITIONAL_SERVICES.find(s => s.id === sid)?.price || 0), 0), [selectedServices]);

  const roomCapacities = { single: 1, double: 2, family: 4, suite: 2 };
  const roomsNeeded = Math.ceil(totalPersons / (roomCapacities[roomTypeId as keyof typeof roomCapacities] || 2));
  const extraBedsNeeded = Math.max(0, totalPersons - (roomsNeeded * (roomCapacities[roomTypeId as keyof typeof roomCapacities] || 2)));

  const accommodationTotal = (roomsNeeded * roomBasePrice * nights) + (extraBedsNeeded * extraBedPrice * nights);
  const mealTotal = (totalPersons * mealPricePerPerson * nights);
  const totalPrice = accommodationTotal + servicesTotal + mealTotal;

  const depositValue = hasDeposit ? (parseFloat(depositAmount) || 0) : 0;

  const toggleService = (id: string) => setSelectedServices(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  const updateCompanionField = useCallback((id: number, field: string, value: any) => {
    setCompanions(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  }, []);

  const [guestInfo, setGuestInfo] = useState({ name: "", identity: "", phone: "", nationality: "", birthDay: "", birthMonth: "", birthYear: "", gender: "" });
  const updateGuestInfo = useCallback((field: string, value: string) => {
    setGuestInfo(prev => {
      if ((prev as any)[field] === value) return prev;
      return { ...prev, [field]: value };
    });
  }, []);

  const executeFinalBooking = async (bookingData: any) => {
    try {
      await createBooking(bookingData);
      await updateRoomStatus(bookingData.roomPhysicalId, 'occupied', bookingData.id);
      addAuditLog('audit.action.walkin', `audit.log.walkin|${guestInfo.name}|${bookingData.id}`);
      toast({ title: t('walkin.success_msg') });
      setTimeout(() => router.push(`/invoice/${bookingData.id}`), 1000);
    } catch (e) {
      setIsSubmitting(false);
      toast({ variant: "destructive", description: "فشل تأكيد الحجز، يرجى مراجعة الاتصال بقاعدة البيانات." });
    }
  };

  const handleBooking = async () => {
    if (isSubmitting) return;
    if (!guestInfo.name || !guestInfo.identity) { toast({ variant: "destructive", description: t('walkin.error_missing') }); return; }

    const targetRoom = rooms.find((r: any) =>
      String(r.hotelId || r.hotel_id) === '1' &&
      r.status === 'available' &&
      r.type === roomTypeId
    );
    if (!targetRoom) { toast({ variant: "destructive", description: t('walkin.error_no_rooms') }); return; }

    setIsSubmitting(true);
    setPaymentError(null);

    const bId = `BER-${Math.random().toString(36).substr(2, 7).toUpperCase()}`;
    const birthDate = `${guestInfo.birthDay}/${guestInfo.birthMonth}/${guestInfo.birthYear}`;

    const finalData = {
      id: bId, hotelId: targetRoom.hotel_id ?? targetRoom.hotelId ?? 1, hotelName: selectedHotel?.nameKey, location: selectedHotel?.locationKey,
      roomType: roomTypeId, roomId: targetRoom.number, roomPhysicalId: targetRoom.id, checkIn: checkIn.toISOString(), checkOut: checkOut.toISOString(),
      totalPrice, deposit: depositValue, paymentMethod: paymentMethod === 'visa' ? t('walkin.guest_form.visa') : t('walkin.guest_form.cash'),
      totalPersons, roomsCount: roomsNeeded, extraBeds: extraBedsNeeded, status: 'Active', source: 'staff', createdAt: new Date().toISOString(),
      guest: { name: guestInfo.name, identity: guestInfo.identity, phone: guestInfo.phone, nationality: guestInfo.nationality, birthDate, email: "walkin@bermuda.eg" },
      companions,
      isPaid: paymentMethod === 'visa'
    };

    if (paymentMethod === 'visa') {
      try {
        const sim = await apiRequest('/payment-simulator', {
          method: 'POST',
          body: JSON.stringify({
            customer_name: guestInfo.name,
            amount: totalPrice,
            booking_reference: bId,
            payload: finalData
          })
        });
        setCurrentPaymentId(sim.id);
        setIsWaitingForPayment(true);
      } catch (e) {
        setIsSubmitting(false);
        toast({ variant: "destructive", description: "Failed to initiate payment simulation." });
      }
    } else {
      await executeFinalBooking(finalData);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isWaitingForPayment && currentPaymentId) {
      interval = setInterval(async () => {
        try {
          const sim = await apiRequest(`/payment-simulator/${currentPaymentId}`);
          if (sim.status === 'approved') {
            clearInterval(interval);
            setIsWaitingForPayment(false);
            await executeFinalBooking(sim.payload);
          } else if (sim.status === 'rejected') {
            clearInterval(interval);
            setIsWaitingForPayment(false);
            setIsSubmitting(false);
            setPaymentError(t('notification.payment_rejected'));
            toast({
              variant: "destructive",
              title: t('common.failed'),
              description: t('notification.payment_rejected')
            });
          }
        } catch (e) {
          console.warn("Polling payment status failed");
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isWaitingForPayment, currentPaymentId, t]);

  const SectionHeader = ({ icon: Icon, title, subtitle }: any) => (
    <div className="flex items-center gap-2 border-b border-border/5 pb-1 mb-1.5">
      <div className={cn("w-6 h-6 bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0 rounded-md", fieldBorder)}><Icon size={12} /></div>
      <div className="text-start"><h2 className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{title}</h2>{subtitle && <p className="text-[7px] font-bold opacity-40 uppercase tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{subtitle}</p>}</div>
    </div>
  );

  const DynamicCurrentYear = new Date().getFullYear();
  const totalPages = Math.ceil(companions.length / companionsPerPage);
  const paginatedCompanions = useMemo(() => {
    const start = currentCompanionPage * companionsPerPage;
    return companions.slice(start, start + companionsPerPage);
  }, [companions, currentCompanionPage]);

  const simulatorUrl = useMemo(() => {
    if (typeof window === 'undefined') return "";
    let origin = window.location.origin;
    if (localIp && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
      origin = origin.replace('localhost', localIp).replace('127.0.0.1', localIp);
    }
    return `${origin}/payment-simulator/${currentPaymentId}`;
  }, [currentPaymentId, localIp]);

  const saveLocalIp = (val: string) => {
    setLocalIp(val);
    localStorage.setItem('bermuda_local_ip', val);
  };

  return (
    <main className="min-h-screen bg-background portal-transition-bg relative flex flex-col items-center pt-24 pb-32 lg:pb-10 px-4">
      <PortalNav />
      <div className="w-full max-w-[1100px] mt-16 lg:mt-20">
        <Card className={cn(
          "border-outer bg-card/40 backdrop-blur-xl auth-card-shadow relative flex flex-col overflow-hidden",
          "rounded-[16px] min-h-[520px]"
        )}>
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent z-10" />

          <div className="flex items-center justify-between p-4 pb-2 shrink-0">
            <div className="flex items-center gap-3">
              <EgyptianHorizonLogo isStatic={true} className="w-10 h-10" />
              <div className="text-start">
                <h1 className="text-lg font-black tracking-tighter text-foreground/90 uppercase leading-none" style={{ wordSpacing: '0.18em' }}>
                  {t('walkin.unified_form')}
                </h1>
                <p className="text-[9px] font-bold opacity-40 uppercase tracking-[0.18em] mt-1" style={{ wordSpacing: '0.18em' }}>
                  {t('walkin.subtitle')}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[9px] font-black border-primary/20 text-primary uppercase px-3 h-7 flex items-center tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>
              <CheckCircle2 size={12} className={cn(isRTL ? "ml-1.5" : "mr-1.5")} />
              {t('reception.walkin_btn')}
            </Badge>
          </div>

          <div className="flex-1 p-4 pt-2 space-y-6 overflow-visible">
            {paymentError && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-[12px] flex items-center gap-3 text-red-500 mb-2">
                <XCircle size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">{paymentError}</span>
              </motion.div>
            )}

            <section className="space-y-4">
              <SectionHeader icon={User} title={t('walkin.guest_form.title')} subtitle={t('walkin.guest_form.subtitle')} />
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1 text-start">
                    <Label className="text-[9px] font-black uppercase opacity-60 px-1 tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>
                      {t('walkin.guest_form.name')}
                    </Label>
                    <Input
                      value={guestInfo.name}
                      onChange={e => updateGuestInfo('name', e.target.value)}
                      onKeyDown={(e) => {
                        if (e.repeat) e.preventDefault();
                      }}
                      className={cn("h-9 text-[10px] font-bold bg-muted/5 rounded-[9px]", fieldBorder)}
                    />
                  </div>

                  <div className="space-y-1 text-start">
                    <Label className="text-[9px] font-black uppercase opacity-60 px-1 tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>
                      {t('walkin.guest_form.identity')}
                    </Label>
                    <Input
                      value={guestInfo.identity}
                      onChange={e => updateGuestInfo('identity', e.target.value)}
                      onKeyDown={(e) => {
                        if (e.repeat) e.preventDefault();
                      }}
                      className={cn("h-9 text-[10px] font-bold bg-muted/5 rounded-[9px]", fieldBorder)}
                    />
                  </div>

                  <div className="space-y-1 text-start">
                    <Label className="text-[9px] font-black uppercase opacity-60 px-1 tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>
                      {t('walkin.guest_form.phone')}
                    </Label>
                    <Input
                      value={guestInfo.phone}
                      onChange={e => updateGuestInfo('phone', e.target.value.replace(/[^\d+]/g, ''))}
                      onKeyDown={(e) => {
                        if (e.repeat) e.preventDefault();
                      }}
                      className={cn("h-9 text-[10px] font-bold bg-muted/5 rounded-[9px]", fieldBorder)}
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="w-full md:w-[27%] space-y-1 text-start">
                    <Label className="text-[9px] font-black uppercase opacity-60 px-1 tracking-[0.18em] truncate block" style={{ wordSpacing: '0.18em' }}>{t('walkin.guest_form.gender')}</Label>
                    <Select value={guestInfo.gender} onValueChange={v => setGuestInfo({ ...guestInfo, gender: v })}><SelectTrigger className={cn("h-9 text-[10px] font-bold bg-muted/5 rounded-[9px]", fieldBorder)}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="male" className="text-[10px]">{t('walkin.logic.male')}</SelectItem><SelectItem value="female" className="text-[10px]">{t('walkin.logic.female')}</SelectItem></SelectContent></Select>
                  </div>

                  <div className="w-full md:w-[27%] space-y-1 text-start">
                    <Label className="text-[9px] font-black uppercase opacity-60 px-1 tracking-[0.18em] truncate block" style={{ wordSpacing: '0.18em' }}>{t('walkin.guest_form.nationality')}</Label>
                    <Select value={guestInfo.nationality} onValueChange={v => setGuestInfo({ ...guestInfo, nationality: v })}>
                      <SelectTrigger className={cn("h-9 text-[10px] font-bold bg-muted/5 rounded-[9px]", fieldBorder)}><SelectValue /></SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {countryCodes.map(c => <SelectItem key={c} value={c} className="text-[10px]">{t(`country.${c}`)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full md:w-[27%] space-y-1 text-start">
                    <Label className="text-[9px] font-black uppercase opacity-60 px-1 tracking-[0.18em] truncate block" style={{ wordSpacing: '0.18em' }}>{t('walkin.guest_form.birth')}</Label>
                    <div className="grid grid-cols-3 gap-1">
                      <Select value={guestInfo.birthDay} onValueChange={v => setGuestInfo({ ...guestInfo, birthDay: v })}>
                        <SelectTrigger className={cn("h-9 text-[9px] font-bold bg-muted/5 px-1 rounded-[9px] justify-center relative [&>span]:w-full [&>span]:text-center [&_svg]:absolute", isRTL ? "[&_svg]:left-2" : "[&_svg]:right-2", fieldBorder)}>
                          <SelectValue placeholder={t('walkin.logic.day')} />
                        </SelectTrigger>
                        <SelectContent className="max-h-[250px] overflow-y-auto">
                          {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <SelectItem key={d} value={d.toString()} className="justify-center pl-2 pr-2">{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Select value={guestInfo.birthMonth} onValueChange={v => setGuestInfo({ ...guestInfo, birthMonth: v })}>
                        <SelectTrigger className={cn("h-9 text-[9px] font-bold bg-muted/5 px-1 rounded-[9px] justify-center relative [&>span]:w-full [&>span]:text-center [&_svg]:absolute", isRTL ? "[&_svg]:left-2" : "[&_svg]:right-2", fieldBorder)}>
                          <SelectValue placeholder={t('walkin.logic.month')} />
                        </SelectTrigger>
                        <SelectContent className="max-h-[250px] overflow-y-auto">
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <SelectItem key={m} value={m.toString()} className="justify-center pl-2 pr-2">{m}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Select value={guestInfo.birthYear} onValueChange={v => setGuestInfo({ ...guestInfo, birthYear: v })}>
                        <SelectTrigger className={cn("h-9 text-[9px] font-bold bg-muted/5 px-1 rounded-[9px] justify-center relative [&>span]:w-full [&>span]:text-center [&_svg]:absolute", isRTL ? "[&_svg]:left-2" : "[&_svg]:right-2", fieldBorder)}>
                          <SelectValue placeholder={t('walkin.logic.year')} />
                        </SelectTrigger>
                        <SelectContent className="max-h-[250px] overflow-y-auto">
                          {Array.from({ length: 135 }, (_, i) => (DynamicCurrentYear + 15) - i).map(y => <SelectItem key={y} value={y.toString()} className="justify-center pl-2 pr-2">{y}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="w-full md:w-[19%] space-y-1 text-start">
                    <Label className="text-[9px] font-black uppercase opacity-60 px-1 tracking-[0.18em] truncate block" style={{ wordSpacing: '0.18em' }}>{t('walkin.logic.companion_count')}</Label>
                    <div className={cn("h-9 flex items-center justify-between px-1 bg-primary/5 rounded-full transition-all hover:bg-primary/10", fieldBorder)}>
                      <div className="flex items-center w-full gap-1">
                        <button type="button" onClick={() => companions.length > 0 && setCompanions(p => p.slice(0, -1))} className="w-7 h-7 rounded-full bg-background/80 flex items-center justify-center text-primary/60 hover:text-red-500 hover:bg-white shadow-sm transition-all active:scale-90"><Minus size={12} strokeWidth={3} /></button>
                        <div className="flex-1 flex items-center justify-center font-black text-[12px] text-primary tracking-tighter" suppressHydrationWarning>{companions.length}</div>
                        <button type="button" onClick={() => setCompanions(p => [...p, { id: Date.now(), ageType: 'adult', name: "", identity: "", gender: "" }])} className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20 hover:brightness-110 transition-all active:scale-90"><Plus size={12} strokeWidth={3} /></button>
                      </div>
                      {companions.length > 0 && <div className="h-6 w-px bg-primary/20 mx-1" />}
                      {companions.length > 0 && <button type="button" onClick={() => { setIsPopupOpen(true); setCurrentCompanionPage(0); }} className="w-7 h-7 rounded-full flex items-center justify-center text-primary/40 hover:text-primary transition-all active:scale-90 shrink-0" title={t('walkin.companion_form.edit_btn')}><Edit3 size={12} /></button>}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-2">
                <SectionHeader icon={CalendarIcon} title={t('walkin.sidebar_title')} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-1 text-start">
                    <Label className="text-[9px] font-black uppercase opacity-60 px-1 tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>
                      {t('walkin.fields.check_in')}
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className={cn("h-9 w-full rounded-[9px] bg-muted/20 border border-border/10 text-[10px] font-bold px-2 flex items-center gap-2", fieldBorder)}>
                          <CalendarIcon size={12} className="opacity-50 shrink-0" />
                          {checkIn ? format(checkIn, 'dd/MM/yyyy') : t('walkin.fields.check_in')}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-[200]">
                        <Calendar selected={checkIn} onSelect={(d) => { if (d) setCheckIn(d); }} disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))} />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-1 text-start">
                    <Label className="text-[9px] font-black uppercase opacity-60 px-1 tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>
                      {t('walkin.fields.check_out')}
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className={cn("h-9 w-full rounded-[9px] bg-muted/20 border border-border/10 text-[10px] font-bold px-2 flex items-center gap-2", fieldBorder)}>
                          <CalendarIcon size={12} className="opacity-50 shrink-0" />
                          {checkOut ? format(checkOut, 'dd/MM/yyyy') : t('walkin.fields.check_out')}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-[200]">
                        <Calendar selected={checkOut} onSelect={(d) => { if (d) setCheckOut(d); }} disabled={(d) => d <= (checkIn ?? new Date(new Date().setHours(0,0,0,0)))} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-1 text-start"><Label className="text-[9px] font-black uppercase opacity-60 px-1 tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('walkin.fields.room_type')}</Label><Select value={roomTypeId} onValueChange={setRoomTypeId}><SelectTrigger className={cn("h-9 bg-muted/20 text-[10px] font-bold rounded-[9px] border-border/10")}><SelectValue placeholder="اختر نوع الغرفة" /></SelectTrigger><SelectContent>
                    <SelectItem value="single" className="text-[10px]">{t('booking.single')}</SelectItem>
                    <SelectItem value="double" className="text-[10px]">{t('booking.double')}</SelectItem>
                    <SelectItem value="suite" className="text-[10px]">{t('booking.suite')}</SelectItem>
                    <SelectItem value="family" className="text-[10px]">{t('booking.family')}</SelectItem>
                  </SelectContent></Select></div>
                  <div className="space-y-1 text-start"><Label className="text-[9px] font-black uppercase opacity-60 px-1 tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('walkin.fields.meal_plan')}</Label><Select value={mealPlanId} onValueChange={setMealPlanId}><SelectTrigger className={cn("h-9 bg-muted/20 text-[10px] font-bold rounded-[9px] border-border/10")}><SelectValue placeholder="اختر نظام الإقامة" /></SelectTrigger><SelectContent>
                    <SelectItem value="none" className="text-[10px]">بدون وجبات</SelectItem>
                    <SelectItem value="breakfast" className="text-[10px]">{t('meal.breakfast')}</SelectItem>
                    <SelectItem value="half_board" className="text-[10px]">{t('meal.half_board')}</SelectItem>
                    <SelectItem value="full_board" className="text-[10px]">{t('meal.full_board')}</SelectItem>
                  </SelectContent></Select></div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-2">
                <SectionHeader icon={Banknote} title={t('walkin.financial_section')} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid grid-cols-2 gap-1.5 h-full content-start">
                    {ADDITIONAL_SERVICES.map((s) => (
                      <button key={s.id} type="button" onClick={() => toggleService(s.id)} className={cn("flex items-center gap-2 px-2 border-[1.2px] transition-all rounded-[8px] h-9 overflow-hidden", selectedServices.includes(s.id) ? "bg-primary/20 border-primary text-foreground" : "bg-muted/5 border-border/5 opacity-60")}>
                        <s.icon size={14} className={cn(selectedServices.includes(s.id) ? "text-primary" : "opacity-40")} />
                        <span className="text-[7.5px] font-black uppercase truncate tracking-[0.02em]" style={{ wordSpacing: '0.12em' }}>{t(s.nameKey).split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                  <div className={cn("p-3 bg-primary/[0.02] border border-primary/5 rounded-[12px] flex flex-col justify-center gap-3")}>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col text-start">
                        <span className="text-[9px] font-black uppercase opacity-60 tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('walkin.fields.deposit')}</span>
                        {hasDeposit && <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="mt-1"><Input value={depositAmount} onChange={e => setDepositAmount(e.target.value.replace(/\D/g, ''))} className={cn("h-7 bg-muted/10 text-center font-bold text-[9px] rounded-md max-w-[80px]", fieldBorder)} /></motion.div>}
                      </div>
                      <Switch checked={hasDeposit} onCheckedChange={setHasDeposit} className="scale-75 origin-right" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label className="text-[9px] font-black uppercase opacity-60 text-start tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('walkin.guest_form.payment')}</Label>
                      <div className="flex gap-1">
                        <button type="button" onClick={() => setPaymentMethod('cash')} className={cn("flex-1 h-7 border-[1.2px] text-[8px] font-black uppercase rounded-md transition-all flex items-center justify-center gap-1.5 tracking-[0.12em]", paymentMethod === 'cash' ? "bg-primary text-white border-primary shadow-sm" : "bg-muted/10 border-border/5 opacity-50")} style={{ wordSpacing: '0.12em' }}><Banknote size={12} /> {t('walkin.guest_form.cash')}</button>
                        <button type="button" onClick={() => setPaymentMethod('visa')} className={cn("flex-1 h-7 border-[1.2px] text-[8px] font-black uppercase rounded-md transition-all flex items-center justify-center gap-1.5 tracking-[0.12em]", paymentMethod === 'visa' ? "bg-primary text-white border-primary shadow-sm" : "bg-muted/10 border-border/5 opacity-50")} style={{ wordSpacing: '0.12em' }}><CreditCard size={12} /> {t('walkin.guest_form.visa')}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 p-4 border-t border-border/10 bg-primary/[0.02] mt-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-6 lg:gap-10">
                <div className="text-start">
                  <span className="text-[8px] font-bold opacity-40 uppercase block tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('walkin.summary.units_needed')}</span>
                  <p className="text-[12px] font-black text-primary leading-tight tracking-[0.02em]" suppressHydrationWarning style={{ wordSpacing: '0.18em' }}>{roomsNeeded} {t('walkin.logic.unit')}</p>
                </div>
                <div className="text-start">
                  <span className="text-[8px] font-bold opacity-40 uppercase block tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('walkin.logic.person_count')}</span>
                  <p className="text-[12px] font-black text-primary leading-tight tracking-[0.02em]" suppressHydrationWarning style={{ wordSpacing: '0.18em' }}>{totalPersons} {t('search.guests')}</p>
                </div>
                <div className="h-8 w-[1px] bg-primary/10 hidden md:block" />
                <div className="text-start">
                  <span className="text-[8px] font-black uppercase opacity-50 block tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('walkin.summary.total')}</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black tracking-tighter" suppressHydrationWarning>{totalPrice.toLocaleString()}</span>
                    <span className="text-[10px] font-bold opacity-40 uppercase tracking-[0.18em]">{t('common.currency')}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={isSubmitting}
                className={cn(
                  "h-12 px-12 bg-primary text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-4 border-b-4 border-primary/30 rounded-[12px] w-full md:w-auto shrink-0 outline-none",
                  isSubmitting && "opacity-70 cursor-wait"
                )}
                style={{ wordSpacing: '0.18em' }}
              >
                {isSubmitting ? (
                  <React.Fragment><Loader2 className="animate-spin" size={18} /> {t('walkin.processing')}</React.Fragment>
                ) : (
                  <React.Fragment>{t('walkin.submit_btn')} <ArrowRight size={20} className={cn(isRTL && "rotate-180")} /></React.Fragment>
                )}
              </button>
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={isWaitingForPayment} onOpenChange={(open) => { if (!open && isWaitingForPayment) { setIsWaitingForPayment(false); setIsSubmitting(false); } }}>
        <DialogContent className="max-w-[480px] p-0 border-outer rounded-[24px] bg-card/95 backdrop-blur-3xl shadow-2xl flex flex-col outline-none overflow-hidden z-[400]">
          <DialogHeader className="p-8 bg-primary/5 border-b border-border/10 flex flex-col items-center gap-4 shrink-0 relative">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner border-2 border-primary/20"><Smartphone size={32} className="animate-bounce" /></div>
            <DialogTitle className="text-2xl font-black tracking-tighter text-center uppercase">{t('walkin.waiting_payment')}</DialogTitle>

            <button
              onClick={() => setShowIpSettings(!showIpSettings)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-muted/10 text-foreground/40 hover:bg-primary/10 hover:text-primary transition-all"
            >
              <Settings2 size={16} />
            </button>
          </DialogHeader>

          <div className="p-6 flex flex-col items-center text-center space-y-6">
            <AnimatePresence>
              {showIpSettings && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="w-full space-y-3 bg-muted/5 p-4 rounded-xl border border-inner mb-2">
                  <div className="flex items-center gap-2 mb-2"><Globe2 size={14} className="text-primary" /><span className="text-[10px] font-black uppercase tracking-widest">{t('walkin.local_network_settings')}</span></div>
                  <div className="space-y-1 text-start">
                    <Label className="text-[9px] font-bold opacity-40 uppercase">{t('walkin.laptop_ip')}</Label>
                    <div className="flex gap-2">
                      <Input value={localIp} onChange={e => saveLocalIp(e.target.value)} placeholder="e.g. 192.168.1.5" className="h-9 text-[11px] font-mono" />
                      <button onClick={() => setShowIpSettings(false)} className="h-9 px-4 bg-primary text-white rounded-lg font-black text-[10px] uppercase">Save</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-4 bg-white rounded-2xl shadow-inner border border-border/10 relative group">
              <div className="w-48 h-48 bg-muted/5 flex items-center justify-center relative overflow-hidden rounded-lg">
                <QrCode size={180} className="text-foreground/80 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-2xl backdrop-blur-[2px]">
                <button onClick={() => window.open(simulatorUrl, '_blank')} className="h-9 px-5 bg-white text-black font-black text-[9px] uppercase rounded-full shadow-xl">Open Link</button>
              </div>
            </div>

            <div className="space-y-3 w-full">
              <p className="text-[10px] font-bold opacity-60 uppercase tracking-[0.18em] leading-relaxed">
                {t('walkin.scan_qr_msg')}
              </p>

              <div className="p-3 bg-muted/10 rounded-xl border border-inner text-[10px] font-mono text-primary break-all select-all flex flex-col gap-2">
                <span className="opacity-40 text-[8px] uppercase">{t('walkin.direct_link')}</span>
                <span className="font-bold">{simulatorUrl}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3 text-primary/40">
              <Loader2 className="animate-spin" size={14} />
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">{t('walkin.waiting_bank')}</span>
            </div>
          </div>
          <div className="p-4 bg-muted/10 border-t border-border/10 flex justify-center shrink-0">
            <button onClick={() => { setIsWaitingForPayment(false); setIsSubmitting(false); }} className="text-[9px] font-black uppercase text-foreground/40 hover:text-red-500 transition-all">{t('common.cancel')}</button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <DialogContent onPointerDownOutside={e => e.preventDefault()} className="max-w-[1200px] w-[95%] p-0 border-outer rounded-[20px] bg-card/95 backdrop-blur-3xl shadow-2xl flex flex-col h-[85vh] z-[350]">
          <DialogHeader className="p-6 bg-primary/5 border-b border-border/10 shrink-0">
            <div className="flex items-center justify-between w-full">
              <DialogTitle className="text-xl md:text-2xl font-black flex items-center gap-4 text-primary">
                <Users size={32} />
                {t('walkin.companion_form.popup_title')}
                <Badge className="bg-primary text-white text-[12px] font-black h-7 px-4 shadow-lg tracking-[0.02em]" suppressHydrationWarning>{companions.length}</Badge>
              </DialogTitle>

              {totalPages > 1 && (
                <div className="flex items-center gap-3 bg-muted/10 p-1.5 rounded-xl border border-inner translate-x-[60px]">
                  <button
                    disabled={currentCompanionPage === 0}
                    onClick={() => setCurrentCompanionPage(p => p - 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-primary disabled:opacity-20 hover:bg-primary/10 transition-all active:scale-90"
                  >
                    {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                  </button>
                  <span className="text-[10px] font-black uppercase opacity-60 tracking-[0.18em] px-2" suppressHydrationWarning style={{ wordSpacing: '0.18em' }}>
                    {t('walkin.companion_form.page_info').replace('{current}', (currentCompanionPage + 1).toString()).replace('{total}', totalPages.toString())}
                  </span>
                  <button
                    disabled={currentCompanionPage === totalPages - 1}
                    onClick={() => setCurrentCompanionPage(p => p + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-primary disabled:opacity-20 hover:bg-primary/10 transition-all active:scale-90"
                  >
                    {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                  </button>
                </div>
              )}
            </div>
          </DialogHeader>
          <div className="flex-1 p-6 overflow-y-auto clean-scrollbar bg-background/20">
            <div className="flex flex-wrap justify-center gap-6 w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCompanionPage}
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-wrap justify-center gap-6 w-full"
                >
                  {paginatedCompanions.map((comp, idx) => (
                    <CompanionForm
                      key={comp.id}
                      comp={comp}
                      idx={(currentCompanionPage * companionsPerPage) + idx}
                      t={t}
                      updateCompanionField={updateCompanionField}
                      className="w-full md:w-[48%] lg:w-[31%]"
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className="p-6 bg-primary/5 border-t border-border/10 shrink-0 flex justify-center">
            <button
              onClick={() => setIsPopupOpen(false)}
              className={cn("h-12 px-20 bg-primary text-white font-black text-[12px] uppercase tracking-[0.18em] shadow-xl border-b-4 border-primary/30 rounded-[12px] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 outline-none")}
              style={{ wordSpacing: '0.18em' }}
            >
              {t('walkin.companion_form.save_btn')} <CheckCircle2 size={18} />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
