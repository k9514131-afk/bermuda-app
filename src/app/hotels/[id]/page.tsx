"use client"

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { usePortal } from '@/components/portal-provider';
import { PortalNav } from '@/components/shared/portal-nav';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { format, differenceInDays, isValid } from 'date-fns';
import { ar, enUS, de, zhCN } from 'date-fns/locale';
import { 
  MapPin, Bed, Calendar as CalendarIcon, 
  CheckCircle2, ArrowRight, Sparkles, ChevronLeft, ChevronRight, ArrowLeft, Loader2, ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { apiRequest } from '@/lib/api';

const HOTEL_FALLBACK = "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop";

function HotelBookingContent() {
  const params = useParams();
  const idStr = params.id as string;
  const { language, isRTL, t, createBooking, rooms, updateRoomStatus, getHotelAvailableRooms, hotels: globalHotels, setIsLoading, refreshData } = usePortal();
  const router = useRouter();
  const { toast } = useToast();
  
  const [mounted, setMounted] = useState(false);
  const [hotel, setHotel] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'hotel' | 'online' | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [roomTypeId, setRoomType] = useState('double');
  const [mealPlanId, setMealPlan] = useState('none');

  useEffect(() => {
    setMounted(true);
    refreshData();
    const today = new Date();
    setCheckIn(today);
    setCheckOut(new Date(new Date().setDate(today.getDate() + 2)));
  }, [refreshData]);

  useEffect(() => {
    if (!idStr) return;
    const loadHotel = async () => {
      setLoading(true);
      try {
        const data = await apiRequest(`/hotels/${idStr}`);
        setHotel(data || globalHotels.find(h => h.id === idStr));
      } catch (e) {
        setHotel(globalHotels.find(h => h.id === idStr));
      } finally {
        setLoading(false);
      }
    };
    loadHotel();
  }, [idStr, globalHotels]);

  const hotelImages = useMemo(() => {
    if (!hotel) return [];
    return [
      { url: hotel.image, title: 'gallery.exterior' },
      { url: `https://picsum.photos/seed/${hotel.id}1/800/600`, title: 'gallery.room' },
      { url: `https://picsum.photos/seed/${hotel.id}2/800/600`, title: 'gallery.pool' }
    ];
  }, [hotel]);

  const selectedRoom = useMemo(() => hotel?.rooms?.find((r: any) => r.id === roomTypeId) || hotel?.rooms?.[0], [hotel, roomTypeId]);
  const currentMealPlan = useMemo(() => hotel?.mealPlans?.find((m: any) => m.id === mealPlanId) || hotel?.mealPlans?.[0], [hotel, mealPlanId]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = differenceInDays(checkOut, checkIn);
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  const availableRoomsCount = useMemo(() => {
    if (!hotel) return 0;
    return getHotelAvailableRooms(hotel.id, roomTypeId);
  }, [hotel, roomTypeId, rooms, getHotelAvailableRooms]);

  const priceCalc = useMemo(() => {
    if (!selectedRoom || nights <= 0) return { total: 0 };
    const roomTotal = selectedRoom.basePrice * nights;
    let mealTotal = 0;
    if (currentMealPlan && !currentMealPlan.isIncluded) {
      mealTotal = currentMealPlan.pricePerPerson * 2 * nights;
    }
    return { total: roomTotal + mealTotal };
  }, [selectedRoom, nights, currentMealPlan]);

  const handleFinalConfirmation = async () => {
    if (!paymentMethod) { toast({ variant: "destructive", description: t('payment.method_desc') }); return; }
    setIsConfirming(true);
    setIsLoading(true);

    const targetRoom = rooms.find(r => r.hotelId === hotel?.id && r.type === roomTypeId && r.status === 'available');
    if (!targetRoom) { toast({ variant: "destructive", description: t('hotel.sold_out') }); setIsConfirming(false); setIsLoading(false); return; }

    const bookingData = {
      hotelId: hotel.id,
      hotelName: hotel.nameKey,
      hotelImage: hotel.image,
      location: hotel.locationKey,
      roomType: selectedRoom.nameKey,
      roomId: targetRoom.number,
      roomPhysicalId: targetRoom.id,
      dates: `${format(checkIn!, 'dd MMM yyyy')} - ${format(checkOut!, 'dd MMM yyyy')}`,
      nights, totalPrice: priceCalc.total,
      status: 'Active',
      isPaid: paymentMethod === 'online'
    };

    if (paymentMethod === 'online') {
      localStorage.setItem('horizon_pending_booking', JSON.stringify(bookingData));
      router.push('/checkout');
    } else {
      await createBooking(bookingData);
      await updateRoomStatus(targetRoom.id, 'occupied', 'SIM-ID');
      setTimeout(() => { setStep('success'); setIsLoading(false); setIsConfirming(false); }, 1500);
    }
  };

  if (!mounted || loading || !hotel) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>;

  const getDateLocale = () => { if (language === 'ar') return ar; return enUS; };
  const safeFormat = (date: Date | undefined) => date && isValid(date) ? format(date, 'dd MMM yyyy', { locale: getDateLocale() }) : '---';

  return (
    <div className="min-h-screen bg-background pb-20">
      <PortalNav />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <AnimatePresence mode="wait">
          {step === 'details' && (
            <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <header className="space-y-2 text-start pt-24">
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{t('hotel.royal_luxury')}</Badge>
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter">{hotel.nameKey}</h1>
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.3em] flex items-center gap-2"><MapPin size={12} className="text-primary" /> {t(hotel.locationKey)}</p>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                  <div className="aspect-video rounded-[32px] overflow-hidden border-outer relative group">
                    <img src={hotelImages[currentImgIdx]?.url} className="w-full h-full object-cover" alt="" />
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between">
                       <Badge className="bg-black/40 backdrop-blur-md text-white border-white/20">{t(hotelImages[currentImgIdx]?.title)}</Badge>
                       <div className="flex gap-2">
                         <button onClick={() => setCurrentImgIdx(p => (p > 0 ? p - 1 : 2))} className="w-10 h-10 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-primary transition-all"><ChevronLeft size={20} /></button>
                         <button onClick={() => setCurrentImgIdx(p => (p < 2 ? p + 1 : 0))} className="w-10 h-10 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-primary transition-all"><ChevronRight size={20} /></button>
                       </div>
                    </div>
                  </div>

                  <Card className="p-8 rounded-[32px] border-outer bg-card/40 backdrop-blur-3xl space-y-8">
                    <div className="flex items-center gap-3 border-b border-border/10 pb-4"><Sparkles className="text-primary" size={20} /><h2 className="text-sm font-black uppercase">{t('meal.plan_title')}</h2></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {hotel.mealPlans?.map((plan: any) => (
                        <button key={plan.id} onClick={() => setMealPlan(plan.id)} className={cn("p-4 rounded-[20px] border-[1.2px] transition-all flex flex-col items-center gap-2", mealPlanId === plan.id ? "bg-primary text-white border-primary shadow-lg" : "bg-muted/5 border-inner opacity-60")}>
                          <span className="text-[10px] font-black uppercase">{t(plan.nameKey)}</span>
                          {!plan.isIncluded && <span className="text-[8px] opacity-60">+{plan.pricePerPerson} {t('common.currency')}</span>}
                        </button>
                      ))}
                    </div>
                  </Card>
                </div>

                <div className="lg:col-span-4 space-y-6">
                  <Card className="p-6 rounded-[36px] border-outer bg-card/60 backdrop-blur-3xl sticky top-24 border-primary/20">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5 text-start"><Label className="text-[8px] font-black uppercase opacity-40">{t('search.checkin')}</Label><Popover><PopoverTrigger asChild><button className="h-11 w-full rounded-[14px] bg-primary/5 border border-primary/10 font-black text-[10px]">{safeFormat(checkIn)}</button></PopoverTrigger><PopoverContent className="w-auto p-0 z-[150]"><Calendar selected={checkIn} onSelect={(d) => setCheckIn(d)} disabled={d => d < new Date()} /></PopoverContent></Popover></div>
                        <div className="space-y-1.5 text-start"><Label className="text-[8px] font-black uppercase opacity-40">{t('search.checkout')}</Label><Popover><PopoverTrigger asChild><button className="h-11 w-full rounded-[14px] bg-primary/5 border border-primary/10 font-black text-[10px]">{safeFormat(checkOut)}</button></PopoverTrigger><PopoverContent className="w-auto p-0 z-[150]"><Calendar selected={checkOut} onSelect={(d) => setCheckOut(d)} disabled={d => checkIn ? d <= checkIn : d < new Date()} /></PopoverContent></Popover></div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[8px] font-black uppercase opacity-40 block text-start">{t('booking.room_selection')}</Label>
                        <RadioGroup value={roomTypeId} onValueChange={setRoomType} className="grid grid-cols-1 gap-2">
                          {hotel.rooms?.map((r: any) => (
                            <Label key={r.id} className={cn("flex items-center justify-between p-4 rounded-[18px] border-[1.2px] cursor-pointer transition-all", roomTypeId === r.id ? "bg-primary/10 border-primary" : "bg-muted/5 border-inner opacity-60")}>
                              <div className="flex flex-col text-start"><span className="text-[10px] font-black uppercase">{t(r.nameKey)}</span><span className="text-[8px] opacity-40">{r.basePrice?.toLocaleString()} {t('common.currency')}</span></div>
                              <RadioGroupItem value={r.id} className="sr-only" />
                              {roomTypeId === r.id && <CheckCircle2 size={16} className="text-primary" />}
                            </Label>
                          ))}
                        </RadioGroup>
                      </div>

                      <div className="p-4 bg-primary/5 rounded-[24px] border-inner space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase opacity-40"><span>{t('booking.total_price')}</span><span>{nights} {t('booking.nights_count')}</span></div>
                        <div className="text-3xl font-black text-primary tracking-tighter text-start">{priceCalc.total.toLocaleString()} <span className="text-xs">{t('common.currency')}</span></div>
                      </div>

                      <button onClick={() => setStep('payment')} disabled={availableRoomsCount === 0} className="w-full h-14 bg-primary text-white rounded-[20px] font-black text-xs uppercase shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-3">
                        {availableRoomsCount === 0 ? t('hotel.sold_out') : <>{t('hotel.book_now')} <ArrowRight size={18} /></>}
                      </button>
                    </div>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-4xl mx-auto space-y-10 pt-24">
              <header className="text-center space-y-4">
                <button onClick={() => setStep('details')} className="flex items-center gap-2 text-[10px] font-black uppercase opacity-40 hover:opacity-100 mx-auto group"><ArrowLeft size={14} /> {t('common.cancel')}</button>
                <h1 className="text-4xl font-black tracking-tighter">{t('payment.method_title')}</h1>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[ { id: 'online', label: 'payment.online', icon: ShieldCheck }, { id: 'hotel', label: 'payment.at_hotel', icon: ShieldCheck } ].map(pm => (
                  <Card key={pm.id} onClick={() => setPaymentMethod(pm.id as any)} className={cn("p-6 rounded-[28px] border-outer cursor-pointer transition-all flex items-center gap-4", paymentMethod === pm.id ? "bg-primary/10 border-primary" : "hover:bg-primary/5")}>
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", paymentMethod === pm.id ? "bg-primary text-white" : "bg-primary/5 text-primary")}><ShieldCheck size={24} /></div>
                    <div className="text-start"><h3 className="text-sm font-black uppercase">{t(pm.label)}</h3></div>
                    {paymentMethod === pm.id && <CheckCircle2 className="text-primary ml-auto" />}
                  </Card>
                ))}
              </div>
              <button onClick={handleFinalConfirmation} disabled={isConfirming} className="w-full h-16 bg-primary text-white rounded-[24px] font-black text-sm uppercase shadow-2xl hover:brightness-110 transition-all flex items-center justify-center gap-3">
                {isConfirming ? <Loader2 className="animate-spin" /> : t('payment.confirm_btn')}
              </button>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center space-y-8 py-20 pt-32">
              <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-[40px] flex items-center justify-center border-4 border-green-500/20 animate-bounce"><CheckCircle2 size={48} /></div>
              <h1 className="text-5xl font-black tracking-tighter">{t('checkout.success_title')}</h1>
              <button onClick={() => router.push('/dashboard')} className="h-14 px-10 bg-primary text-white rounded-[20px] font-black text-xs uppercase shadow-xl hover:brightness-110 transition-all">{t('nav.my_bookings')}</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function HotelBookingPage() {
  return <Suspense fallback={null}><HotelBookingContent /></Suspense>;
}
