
"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { usePortal } from '@/components/portal-provider';
import { PortalNav } from '@/components/shared/portal-nav';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { mockHotels } from '@/lib/mock-data';
import { apiRequest } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  MapPin, Bed, Users, Plus, Minus, ArrowRight, 
  ShieldCheck, Waves, Sparkles, Calendar as CalendarIcon,
  Receipt, Droplets, Utensils, Car, Dumbbell, Landmark, Clock,
  ChevronLeft, ChevronRight, Edit3, CheckCircle2, User, Info, Baby
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function HotelDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { t, isRTL } = usePortal();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [nights, setNights] = useState(1);
  const [roomTypeId, setRoomTypeId] = useState('double');
  const [mealPlanId, setMealPlanId] = useState('none');
  const [extraServices, setExtraServices] = useState<string[]>([]);
  const [companions, setCompanions] = useState<any[]>([]);
  const [isCompanionsPopupOpen, setIsCompanionsPopupOpen] = useState(false);
  const [currentCompanionPage, setCurrentCompanionPage] = useState(0);
  const [hotelData, setHotelData] = useState<any | null>(null);
  const [isLoadingHotel, setIsLoadingHotel] = useState(true);

  const hotel = useMemo(() => {
    if (hotelData) return hotelData;
    return mockHotels.find(h => h.id === id) || null;
  }, [id, hotelData]);

  useEffect(() => {
    let disposed = false;

    const loadHotel = async () => {
      setIsLoadingHotel(true);
      try {
        const data = await apiRequest(`/hotels/${id}`);
        if (!disposed && data) {
          setHotelData(data);
        }
      } catch {
        if (!disposed) {
          setHotelData(null);
        }
      } finally {
        if (!disposed) {
          setIsLoadingHotel(false);
        }
      }
    };

    loadHotel();

    return () => {
      disposed = true;
    };
  }, [id]);
  
  const hotelImages = useMemo(() => {
    if (!hotel) return [];
    return [
      hotel.image,
      `https://picsum.photos/seed/${hotel.id}room/1200/600`,
      `https://picsum.photos/seed/${hotel.id}pool/1200/600`,
      `https://picsum.photos/seed/${hotel.id}spa/1200/600`,
    ];
  }, [hotel]);

  const checkOut = useMemo(() => { 
    if (!checkIn) return undefined; 
    return addDays(checkIn, nights); 
  }, [checkIn, nights]);

  const selectedRoom = useMemo(() => {
    if (!hotel) return null;
    return hotel.rooms.find((r: any) => r.id === roomTypeId) || hotel.rooms[0];
  }, [hotel, roomTypeId]);

  const servicePrices: Record<string, number> = {
    pool: 350,
    spa: 1200,
    gym: 250,
    trips: 2500
  };

  const pricingBreakdown = useMemo(() => {
    if (!selectedRoom || !hotel) return { adults: 1, children: 0, infants: 0, total: 0, adultPrice: 0, childPrice: 0, mealTotal: 0 };
    
    const baseP = selectedRoom.basePrice;
    let adults = 1; 
    let children = 0;
    let infants = 0;

    companions.forEach(c => {
      const ageNum = parseInt(c.age);
      if (isNaN(ageNum)) {
        adults++;
      } else {
        if (ageNum >= 15) adults++;
        else if (ageNum >= 6) children++;
        else infants++;
      }
    });

    const selectedMeal = hotel.mealPlans.find((m: any) => m.id === mealPlanId) || hotel.mealPlans[0];
    const mealPricePerPerson = selectedMeal.pricePerPerson || 0;
    
    const mealTotal = (adults * mealPricePerPerson + children * (mealPricePerPerson * 0.5)) * nights;

    const adultRoomTotal = adults * baseP;
    const childRoomTotal = children * (baseP * 0.5); 

    const accommodationTotal = (adultRoomTotal + childRoomTotal) * nights;
    const servicesTotal = extraServices.reduce((acc, id) => acc + (servicePrices[id] || 0), 0);
    
    return {
      adults,
      children,
      infants,
      adultPrice: baseP,
      childPrice: baseP * 0.5,
      mealTotal,
      total: accommodationTotal + mealTotal + servicesTotal
    };
  }, [selectedRoom, hotel, companions, nights, extraServices, mealPlanId]);

  const paginatedCompanions = useMemo(() => {
    const start = currentCompanionPage * itemsPerPage;
    return companions.slice(start, start + itemsPerPage);
  }, [companions, currentCompanionPage, itemsPerPage]);

  const totalCompanionPages = Math.ceil(companions.length / itemsPerPage);

  useEffect(() => {
    setMounted(true);
    setCheckIn(new Date());
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      if (width < 768) setItemsPerPage(6);
      else if (width < 1024) setItemsPerPage(12);
      else setItemsPerPage(15);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    const timer = setInterval(() => { if (hotelImages.length > 0) setCurrentSlide(prev => (prev + 1) % hotelImages.length); }, 5000);
    return () => { clearInterval(timer); window.removeEventListener('resize', handleResize); };
  }, [hotelImages.length]);

  if (!mounted || isLoadingHotel) return null;
  if (!hotel) return null;

  const fieldBorder = "border-inner border-[1.2px]";
  const amenitiesIcons: any = { wifi: Waves, pool: Droplets, spa: Sparkles, gym: Dumbbell, parking: Car, landmark: Landmark, restaurant: Utensils };
  const totalPrice = pricingBreakdown.total;

  const updateCompanion = (compId: number, field: string, value: any) => { 
    setCompanions(prev => prev.map(c => {
      if (c.id === compId) {
        const updated = { ...c, [field]: value };
        if (field === 'age') {
          const ageNum = parseInt(value);
          if (isNaN(ageNum) || value === '') {
            updated.ageType = 'pending';
            updated.idType = ''; 
          } else if (ageNum >= 15) {
            updated.ageType = 'adult';
            if (updated.idType === 'birth' || !updated.idType) {
              updated.idType = 'national';
            }
          } else {
            updated.ageType = ageNum >= 6 ? 'child' : 'infant';
            if (updated.idType === 'national' || !updated.idType) {
              updated.idType = 'birth';
            }
          }
        }
        return updated;
      }
      return c;
    })); 
  };

  const addCompanion = () => { 
    if (companions.length < 50) {
      setCompanions([...companions, { 
        id: Date.now(), 
        ageType: 'pending',
        name: '', 
        gender: 'male', 
        idType: '', 
        idNumber: '', 
        age: '' 
      }]); 
    }
  };

  const removeCompanion = () => { if (companions.length > 0) setCompanions(companions.slice(0, -1)); };

  const handleProceed = () => {
    const bookingData = { 
      hotelId: hotel.id, 
      hotelName: hotel.nameKey, 
      nights, 
      totalPersons: companions.length + 1, 
      companions, 
      roomType: roomTypeId, 
      totalPrice, 
      image: hotel.image, 
      location: hotel.locationKey, 
      checkIn: checkIn?.toISOString(), 
      checkOut: checkOut?.toISOString(), 
      mealPlan: mealPlanId,
      extraServices: extraServices,
      breakdown: pricingBreakdown
    };
    localStorage.setItem('bermuda_pending_booking', JSON.stringify(bookingData));
    router.push('/customer/checkout');
  };

  const renderCompanionFields = (comp: any) => {
    const isAgeSet = comp.ageType && comp.ageType !== 'pending';
    
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <div className="space-y-1 text-start col-span-2">
          <Label className="text-[11px] font-black uppercase opacity-60 px-1 tracking-[0.02em]" style={{ wordSpacing: '0.18em' }}>{t('walkin.companion_form.name')}</Label>
          <Input value={comp.name} onChange={e => updateCompanion(comp.id, 'name', e.target.value)} className={cn("h-8 text-[10px] font-bold bg-muted/5", fieldBorder)} />
        </div>
        <div className="space-y-1 text-start">
          <Label className="text-[11px] font-black uppercase opacity-60 px-1 tracking-[0.02em]" style={{ wordSpacing: '0.18em' }}>{t('walkin.companion_form.age')}</Label>
          <Input 
            type="number" 
            value={comp.age} 
            onChange={e => updateCompanion(comp.id, 'age', e.target.value)} 
            className={cn("h-8 text-[10px] font-bold bg-muted/5", fieldBorder)} 
            placeholder={isRTL ? "مثال: 10" : "Ex: 10"}
          />
        </div>
        <div className="space-y-1 text-start">
          <Label className="text-[11px] font-black uppercase opacity-60 px-1 tracking-[0.02em]" style={{ wordSpacing: '0.18em' }}>{t('auth.gender')}</Label>
          <Select value={comp.gender} onValueChange={v => updateCompanion(comp.id, 'gender', v)}>
            <SelectTrigger className={cn("h-8 text-[10px] font-bold bg-muted/5", fieldBorder)}><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male" className="text-[10px] font-bold">{t('auth.gender_male')}</SelectItem>
              <SelectItem value="female" className="text-[10px] font-bold">{t('auth.gender_female')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1 text-start">
          <Label className="text-[11px] font-black uppercase opacity-60 px-1 tracking-[0.02em]" style={{ wordSpacing: '0.18em' }}>{t('walkin.companion_form.id_type')}</Label>
          <Select 
            value={comp.idType} 
            onValueChange={v => updateCompanion(comp.id, 'idType', v)}
            disabled={!isAgeSet}
          >
            <SelectTrigger className={cn("h-8 text-[10px] font-bold bg-muted/5 transition-all", fieldBorder, !isAgeSet && "opacity-50 cursor-not-allowed")}>
              <SelectValue placeholder={!isAgeSet ? t('walkin.logic.pending_age_msg') : t('walkin.companion_form.id_type')} />
            </SelectTrigger>
            <SelectContent>
              {!isAgeSet ? (
                <SelectItem value="none" disabled className="text-[10px] font-bold">{t('walkin.logic.pending_age_msg')}</SelectItem>
              ) : (
                <>
                  {comp.ageType === 'adult' && (
                    <SelectItem value="national" className="text-[10px] font-bold">{t('walkin.companion_form.national_id')}</SelectItem>
                  )}
                  <SelectItem value="passport" className="text-[10px] font-bold">{t('walkin.companion_form.passport')}</SelectItem>
                  {(comp.ageType === 'child' || comp.ageType === 'infant') && (
                    <SelectItem value="birth" className="text-[10px] font-bold">{t('walkin.companion_form.birth_cert')}</SelectItem>
                  )}
                </>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1 text-start">
          <Label className="text-[11px] font-black uppercase opacity-60 px-1 tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('walkin.companion_form.id_number')}</Label>
          <Input value={comp.idNumber} onChange={e => updateCompanion(comp.id, 'idNumber', e.target.value)} className={cn("h-8 text-[10px] font-bold bg-muted/5", fieldBorder)} />
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-background portal-transition-bg pb-20 relative overflow-x-hidden hotel-details-page">
      <PortalNav />
      <section className="relative h-[55vh] md:h-[65vh] w-full mt-20 overflow-hidden group shadow-2xl">
        <AnimatePresence mode="wait"><motion.div key={currentSlide} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 1.2 }} className="absolute inset-0"><img src={hotelImages[currentSlide]} className="w-full h-full object-cover" alt={t(hotel.nameKey)} /></motion.div></AnimatePresence>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: -20 }} className="text-center flex flex-col items-center w-full">
            <Badge className="bg-primary/20 backdrop-blur-md text-primary border-primary/30 text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-[0.02em]" style={{ wordSpacing: '0.18em' }}>{t('hotel.royal_luxury')}</Badge>
            <h1 className="text-3xl md:text-[60px] font-black tracking-tighter text-white mt-[30px] mb-[20px] drop-shadow-xl">{t(hotel.nameKey)}</h1>
            <div className="flex items-center justify-center gap-3 text-white/90 font-bold uppercase tracking-[0.18em] text-[10px]" style={{ wordSpacing: '0.18em' }}><MapPin size={16} className="text-primary" /> {t(hotel.locationKey)}</div>
          </motion.div>
        </div>
      </section>

      <div className="w-[94%] max-w-[1600px] mx-auto -mt-[34px] relative z-30">
        <Card className="rounded-[24px] border-outer bg-card/85 backdrop-blur-3xl shadow-2xl p-7 flex flex-col">
          <div className="p-5 md:p-7 space-y-6">
            <header className="space-y-3 text-start border-b border-border/5 pb-5">
              <h2 className="text-[18px] font-black uppercase tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('hotel.about_title')}</h2>
              <p className="text-[14px] font-medium leading-relaxed opacity-70 tracking-[0.02em]" style={{ wordSpacing: '0.18em' }}>{t(hotel.descriptionKey)}</p>
              <div className="flex flex-wrap gap-2.5 pt-1">{hotel.amenities.map((a: string) => { const Icon = amenitiesIcons[a] || Waves; return <div key={a} className="flex items-center gap-2 px-2.5 py-1.5 rounded-[10px] bg-primary/5 border border-primary/10 transition-all hover:bg-primary/10"><Icon size={12} className="text-primary" /><span className="text-[10px] font-black uppercase tracking-[0.02em] opacity-60" style={{ wordSpacing: '0.18em' }}>{t(`amenity.${a}`)}</span></div>; })}</div>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 items-end">
              <div className="space-y-1.5 text-start">
                <Label className="text-[11px] font-black uppercase opacity-60 px-1 flex items-center gap-2 tracking-[0.02em]" style={{ wordSpacing: '0.18em' }}><CalendarIcon size={10} /> {t('hotel.checkin')}</Label>
                <Popover><PopoverTrigger asChild><button className={cn("h-10 w-full rounded-[10px] bg-muted/5 font-bold text-[10px]", fieldBorder)}>{checkIn ? format(checkIn, 'dd MMM') : '---'}</button></PopoverTrigger><PopoverContent className="w-auto p-0 z-[200] border-outer rounded-[18px]"><Calendar selected={checkIn} onSelect={(d) => d && setCheckIn(d)} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} /></PopoverContent></Popover>
              </div>
              <div className="space-y-1.5 text-start">
                <Label className="text-[11px] font-black uppercase opacity-60 px-1 flex items-center gap-2 tracking-[0.02em]" style={{ wordSpacing: '0.18em' }}><Clock size={10} /> {t('hotel.nights_label')}</Label>
                <div className={cn("flex items-center justify-between p-1 rounded-[10px] bg-muted/5 h-10", fieldBorder)}><button onClick={() => setNights(Math.max(1, nights - 1))} className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Minus size={10} /></button><span className="text-[11px] font-black">{nights}</span><button onClick={() => setNights(nights + 1)} className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Plus size={10} /></button></div>
              </div>
              <div className="space-y-1.5 text-start">
                <Label className="text-[11px] font-black uppercase opacity-60 px-1 tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('hotel.room_category')}</Label>
                <Select value={roomTypeId} onValueChange={setRoomTypeId}><SelectTrigger className={cn("h-10 rounded-[10px] font-bold bg-muted/5 text-[10px]", fieldBorder)}><SelectValue /></SelectTrigger><SelectContent className="z-[200]">{hotel.rooms.map((r: any) => <SelectItem key={r.id} value={r.id} className="text-[10px] font-bold">{t(r.nameKey)}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="space-y-1.5 text-start">
                <Label className="text-[11px] font-black uppercase opacity-60 px-1 tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('hotel.meal_plan')}</Label>
                <Select value={mealPlanId} onValueChange={setMealPlanId}><SelectTrigger className={cn("h-10 rounded-[10px] font-bold bg-muted/5 text-[10px]", fieldBorder)}><SelectValue /></SelectTrigger><SelectContent className="z-[200]">{hotel.mealPlans.map((m: any) => <SelectItem key={m.id} value={m.id} className="text-[10px] font-bold">{t(m.nameKey)}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="space-y-1.5 text-start col-span-2 md:col-span-1">
                <Label className="text-[11px] font-black uppercase opacity-60 px-1 block w-full text-center mb-[8px] tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('hotel.extra_services_label')}</Label>
                <div className="grid grid-cols-2 gap-1.5 h-10 content-center mt-[7px]">
                  {Object.keys(servicePrices).map((svcId) => (
                    <button
                      key={svcId}
                      type="button"
                      onClick={() => {
                        setExtraServices(prev => 
                          prev.includes(svcId) ? prev.filter(s => s !== svcId) : [...prev, svcId]
                        );
                      }}
                      className={cn(
                        "w-full h-[26px] rounded-[6px] text-[10px] font-black uppercase transition-all flex items-center justify-center border-inner border-[1.2px] whitespace-nowrap tracking-[0.02em]",
                        extraServices.includes(svcId)
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-muted/5 opacity-40 hover:opacity-100"
                      )}
                      style={{ wordSpacing: '0.12em' }}
                    >
                      {t(`amenity.${svcId}`).split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-border/5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Users size={18} /></div><div className="text-start"><h3 className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('walkin.logic.companion_count')}</h3><p className="text-[10px] font-bold opacity-60 uppercase tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('walkin.logic.companion_details')}</p></div></div>
                <div className={cn("flex items-center gap-3 bg-muted/5 p-1 rounded-xl", fieldBorder)}><button onClick={removeCompanion} className="w-8 h-8 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-all flex items-center justify-center"><Minus size={14} /></button><span className="text-[12px] font-black min-w-[30px] text-center" suppressHydrationWarning>{companions.length}</span><button onClick={addCompanion} className="w-8 h-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center"><Plus size={14} /></button></div>
              </div>
              {companions.length > 0 && <div className="flex flex-col items-center justify-center py-4 space-y-4"><div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20"><Edit3 size={24} /></div><button onClick={() => setIsCompanionsPopupOpen(true)} className="h-10 px-8 bg-primary/10 text-primary border border-primary/20 rounded-xl font-black text-[10px] uppercase tracking-[0.18em] hover:bg-primary hover:text-white transition-all shadow-lg" style={{ wordSpacing: '0.18em' }}>{t('walkin.companion_form.edit_btn')} ({companions.length})</button></div>}
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-4 border-t border-border/5">
              <div className={cn("flex items-center gap-4 md:gap-8 bg-primary/[0.03] px-4 md:px-8 py-3 rounded-[18px] flex-1 w-full", fieldBorder)}>
                <div className="flex items-center gap-3 shrink-0"><Receipt size={18} className="text-primary opacity-60" /><div className="flex flex-col text-start overflow-hidden"><span className="text-[10px] font-black uppercase opacity-60 tracking-[0.18em] truncate" style={{ wordSpacing: '0.18em' }}>{t('hotel.summary_title')}</span><div className="flex gap-4 mt-1">
                  <div className="flex items-center gap-1 opacity-60"><User size={10} /><span className="text-[9px] font-black">×{pricingBreakdown.adults}</span></div>
                  {pricingBreakdown.children > 0 && <div className="flex items-center gap-1 opacity-60"><Baby size={10} /><span className="text-[9px] font-black">×{pricingBreakdown.children}</span></div>}
                  <div className="h-4 w-px bg-border/20 mx-1" />
                  <div className="flex items-center gap-1 text-primary/80"><Utensils size={10} /><span className="text-[9px] font-black">{t(`meal.${mealPlanId}`)}</span></div>
                </div></div></div>
                <div className="h-8 w-px bg-primary/10" /><div className="flex flex-col text-start flex-1 overflow-hidden"><span className="text-[10px] font-black uppercase opacity-60 tracking-tighter truncate" style={{ wordSpacing: '0.18em' }}>{t('hotel.total_price')}</span><div className="flex items-baseline gap-1"><span className="text-xl md:text-2xl font-black text-primary tracking-tighter" suppressHydrationWarning>{totalPrice.toLocaleString()}</span><span className="text-[10px] font-bold text-primary opacity-60 uppercase tracking-[0.18em]">{t('common.currency')}</span></div></div>
              </div>
              <button onClick={handleProceed} className="w-full lg:w-[300px] h-[56px] bg-primary text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-[15px] shadow-2xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-4 border-b-4 border-primary/30 outline-none" style={{ wordSpacing: '0.18em' }}>{t('hotel.confirm_btn')} <ArrowRight size={18} className={cn(isRTL && "rotate-180")} /></button>
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={isCompanionsPopupOpen} onOpenChange={(open) => { setIsCompanionsPopupOpen(open); if (open) setCurrentCompanionPage(0); }}>
        <DialogContent 
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="max-w-[1300px] w-[95%] p-0 border-outer rounded-[24px] bg-card/95 backdrop-blur-3xl shadow-2xl flex flex-col transition-none outline-none"
        >
          <DialogHeader className="p-6 bg-primary/5 border-b border-border/10">
            <DialogTitle className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-4 text-primary"><Users size={32} /> {t('walkin.companion_form.popup_title')} <Badge className="bg-primary text-white text-[10px] font-black h-6 px-4" suppressHydrationWarning>{companions.length}</Badge></DialogTitle>
          </DialogHeader>
          <div className="flex-1 p-6 md:p-10 relative flex flex-col items-center overflow-y-auto clean-scrollbar bg-background/20">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div 
                key={currentCompanionPage}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-wrap justify-center gap-[1.3%] w-full"
              >
                {paginatedCompanions.map((comp, idx) => (
                  <Card key={comp.id} className={cn("p-5 rounded-[20px] bg-background/40 flex flex-col shadow-sm mb-4 w-full md:w-[49%] lg:w-[32%] min-h-[220px]", fieldBorder)}>
                    <div className="flex justify-between items-center pb-2 border-b border-border/10">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black opacity-60 text-foreground/80">#{(currentCompanionPage * itemsPerPage) + idx + 1}</span>
                        <Badge variant="outline" className={cn(
                          "text-[10px] font-black border-primary/20 uppercase h-5 tracking-[0.02em]", 
                          comp.ageType === 'infant' ? "text-green-500" : (comp.ageType === 'pending' ? "text-amber-500 animate-pulse" : "text-primary")
                        )}>
                          {t(`walkin.logic.${comp.ageType || 'pending'}_label`)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex-1 pt-4">{renderCompanionFields(comp)}</div>
                  </Card>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="p-6 bg-primary/5 border-t border-border/10 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {totalCompanionPages > 1 && (
                <div className="flex items-center gap-2">
                  <button 
                    disabled={currentCompanionPage === 0} 
                    onClick={() => setCurrentCompanionPage(p => p - 1)}
                    className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center text-primary disabled:opacity-20 hover:bg-primary/10 transition-all active:scale-90"
                  >
                    <ChevronRight className={isRTL ? "" : "rotate-180"} />
                  </button>
                  <span className="text-[10px] font-black uppercase opacity-60 tracking-[0.18em]" suppressHydrationWarning style={{ wordSpacing: '0.18em' }}>
                    {t('walkin.companion_form.page_info').replace('{current}', (currentCompanionPage + 1).toString()).replace('{total}', totalCompanionPages.toString())}
                  </span>
                  <button 
                    disabled={currentCompanionPage === totalCompanionPages - 1} 
                    onClick={() => setCurrentCompanionPage(p => p + 1)}
                    className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center text-primary disabled:opacity-20 hover:bg-primary/10 transition-all active:scale-90"
                  >
                    <ChevronLeft className={isRTL ? "" : "rotate-180"} />
                  </button>
                </div>
              )}
            </div>
            <button onClick={() => setIsCompanionsPopupOpen(false)} className="h-[42px] w-[140px] mr-[30px] md:w-auto md:mr-0 px-0 md:px-16 bg-primary text-white font-black text-[11px] uppercase tracking-[0.18em] shadow-xl border-b-4 border-primary/30 rounded-[10px] flex items-center justify-center gap-3 transition-all hover:brightness-110 active:scale-[0.98] whitespace-nowrap" style={{ wordSpacing: '0.18em' }}>
              <div className="flex items-center gap-3 leading-none">
                {t('walkin.companion_form.save_btn')} <CheckCircle2 size={18} />
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
