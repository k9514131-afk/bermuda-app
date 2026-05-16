
"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePortal as usePortalHook } from '@/components/portal-provider';
import { PortalNav } from '@/components/shared/portal-nav';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { 
  MapPin, Star, ChevronLeft, ChevronRight, Compass, 
  Calendar as CalendarIcon, ArrowRight, ChevronDown, LayoutGrid, Heart, Layers, X 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from "@/components/ui/toast";

export default function CustomerHomePage() {
  const { t, isRTL, wishlist, toggleWishlist, compareList, setCompareList, toggleCompare, hotels, cities } = usePortalHook();
  const router = useRouter();
  const { toast } = useToast();
  const [activeCityId, setActiveCityId] = useState('all');
  
  const [searchLocation, setSearchLocation] = useState("");
  const [searchDate, setSearchDate] = useState<Date | undefined>(undefined);

  // Native Scroll Logic
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollStart, setCanScrollStart] = useState(false);
  const [canScrollEnd, setCanScrollEnd] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      
      if (isRTL) {
        setCanScrollStart(scrollLeft < -10);
        setCanScrollEnd(Math.abs(scrollLeft) < scrollWidth - clientWidth - 10);
      } else {
        setCanScrollStart(scrollLeft > 10);
        setCanScrollEnd(scrollLeft < scrollWidth - clientWidth - 10);
      }
    }
  }, [isRTL]);

  const handleScrollAction = useCallback((direction: 'forward' | 'backward') => {
    const el = scrollRef.current;
    if (el) {
      const step = 280;
      const { scrollLeft } = el;
      let target;

      if (isRTL) {
        target = direction === 'forward' ? scrollLeft - step : scrollLeft + step;
      } else {
        target = direction === 'forward' ? scrollLeft + step : scrollLeft - step;
      }

      el.scrollTo({ left: target, behavior: 'smooth' });
      setTimeout(checkScroll, 500);
    }
  }, [isRTL, checkScroll]);

  useEffect(() => {
    setSearchDate(new Date());
    const timer = setTimeout(checkScroll, 300);
    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  useEffect(() => {
    checkScroll();
  }, [activeCityId, checkScroll]);

  const activeHotels = activeCityId === 'all' 
    ? hotels 
    : hotels.filter(h => h.cityId === activeCityId);

  const handleClearComparison = (e: React.MouseEvent) => {
    e.stopPropagation();
    const backup = [...compareList];
    setCompareList([]);
    
    toast({
      title: t('search.compare_cleared'),
      action: (
        <ToastAction 
          altText={t('search.undo')} 
          onClick={() => setCompareList(backup)}
          className="bg-primary text-white hover:bg-primary/90 border-none h-8 text-[10px] font-black uppercase px-4 rounded-lg shadow-lg tracking-[0.02em]"
          style={{ wordSpacing: '0.18em' }}
        >
          {t('search.undo')}
        </ToastAction>
      ),
    });
  };

  return (
    <main className="min-h-screen bg-background portal-transition-bg pb-32 relative overflow-x-hidden">
      <PortalNav />
      
      <section className="relative h-[40vh] md:h-[45vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden mt-20">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 md:space-y-6 max-w-5xl relative z-10">
          <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-[0.02em]" style={{ wordSpacing: '0.18em' }}>{t('home.hero_badge')}</Badge>
          <h1 className="text-lg md:text-[30px] lg:text-[38px] font-black tracking-[0.02em] leading-tight md:leading-relaxed mb-[10px] md:mb-[20px] px-4" style={{ wordSpacing: '0.18em' }}>
            {t('home.hero_title')}
          </h1>
          <p className="text-[10px] md:text-sm font-bold opacity-40 uppercase tracking-[0.02em]" style={{ wordSpacing: '0.18em' }}>{t('home.hero_subtitle')}</p>
        </motion.div>
      </section>

      <div className="max-w-4xl mx-auto w-full mt-[5px] md:mt-[55px] mb-12 md:mb-16 px-6 relative z-20">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-4 md:p-5 rounded-[9px] border-outer bg-card/60 backdrop-blur-3xl shadow-2xl flex flex-col md:flex-row items-center gap-4 md:gap-6 auth-card-shadow">
            <div className="flex-1 w-full space-y-2">
              <Label className="text-[10px] font-black uppercase opacity-40 px-1 flex items-center gap-2 justify-start tracking-[0.02em]" style={{ wordSpacing: '0.18em' }}>
                <MapPin size={12} className="text-primary" /> {t('home.search_where')}
              </Label>
              <Input 
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder={t('home.search_placeholder')} 
                className="h-11 md:h-12 rounded-[9px] bg-muted/5 border-inner font-bold text-[12px] placeholder:opacity-30 tracking-[0.02em]"
                style={{ wordSpacing: '0.18em' }}
              />
            </div>
            
            <div className="flex-1 w-full space-y-2">
              <Label className="text-[10px] font-black uppercase opacity-40 px-1 flex items-center gap-2 justify-start tracking-[0.02em]" style={{ wordSpacing: '0.18em' }}>
                <CalendarIcon size={12} className="text-primary" /> {t('home.search_checkin')}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="h-11 md:h-12 w-full rounded-[9px] bg-muted/5 border border-inner font-bold text-start px-4 text-[12px] flex items-center justify-between group hover:border-primary/30 transition-all outline-none tracking-[0.02em]" style={{ wordSpacing: '0.18em' }}>
                    <span className={cn(!searchDate && "opacity-30")} suppressHydrationWarning>
                      {searchDate ? format(searchDate, 'dd MMM yyyy') : "اختر التاريخ"}
                    </span>
                    <ChevronDown size={16} className="opacity-30 group-hover:text-primary transition-colors" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[200] border-outer rounded-[9px]">
                  <Calendar 
                    selected={searchDate} 
                    onSelect={(date) => setSearchDate(date)} 
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="md:pt-6 w-full md:w-auto">
              <button 
                onClick={() => router.push(`/search?location=${searchLocation}&date=${searchDate?.toISOString()}`)}
                className="h-11 md:h-12 px-10 bg-primary text-white font-black text-[13px] uppercase tracking-[0.02em] rounded-[9px] shadow-xl hover:brightness-110 active:scale-[0.98] transition-all w-full flex items-center justify-center gap-3 border-b-4 border-primary/30 outline-none" style={{ wordSpacing: '0.18em' }}
              >
                {t('home.search_btn')} <ArrowRight size={18} className={cn(isRTL && "rotate-180")} />
              </button>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 md:px-6 space-y-12 md:space-y-16 mt-8 max-w-7xl">
        <section className="space-y-6 md:space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <h2 className="text-xl md:text-2xl font-black tracking-[0.02em] flex items-center gap-4" style={{ wordSpacing: '0.18em' }}>
              <div className="w-1.5 h-6 md:w-2 md:h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(110,198,217,0.5)]" />
              {t('home.destinations_title')}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 opacity-40 text-[10px] font-black uppercase tracking-[0.02em] hidden md:flex" style={{ wordSpacing: '0.18em' }}>
                <Compass size={14} className="animate-spin-slow" /> {t('home.browse_cities')}
              </div>
            </div>
          </div>
          
          <div className="relative group/nav px-12 md:px-14">
            <button 
              onClick={() => handleScrollAction('backward')}
              disabled={!canScrollStart}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all rounded-[9px] z-50 flex items-center justify-center pointer-events-auto shadow-lg backdrop-blur-md",
                "disabled:opacity-20 disabled:cursor-not-allowed",
                isRTL ? "right-0 md:right-1" : "left-0 md:left-1"
              )}
            >
              {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

            <button 
              onClick={() => handleScrollAction('forward')}
              disabled={!canScrollEnd}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all rounded-[9px] z-50 flex items-center justify-center pointer-events-auto shadow-lg backdrop-blur-md",
                "disabled:opacity-20 disabled:cursor-not-allowed",
                isRTL ? "left-0 md:left-1" : "right-0 md:right-1"
              )}
            >
              {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>

            <div 
              ref={scrollRef}
              onScroll={checkScroll}
              dir={isRTL ? "rtl" : "ltr"}
              className="flex items-center gap-3 overflow-x-auto scrollbar-hide scroll-smooth py-4"
            >
              <button 
                onClick={() => setActiveCityId('all')} 
                className={cn(
                  "px-8 py-3.5 rounded-[12px] border-[1.5px] font-black text-[10px] md:text-[11px] uppercase tracking-[0.02em] whitespace-nowrap transition-all duration-300 flex items-center gap-3 outline-none shrink-0", 
                  activeCityId === 'all' ? "bg-primary text-white border-primary shadow-xl scale-[1.02]" : "bg-muted/5 border-inner opacity-40 hover:opacity-100"
                )}
                style={{ wordSpacing: '0.18em' }}
              >
                <LayoutGrid size={16} /> {t('home.all_destinations')}
              </button>

              {cities.map(city => (
                <button 
                  key={(city as any).slug || city.id}
                  onClick={() => setActiveCityId((city as any).slug || String(city.id))} 
                  className={cn(
                    "px-8 py-3.5 rounded-[12px] border-[1.5px] font-black text-[10px] md:text-[11px] uppercase tracking-[0.02em] whitespace-nowrap transition-all duration-300 outline-none shrink-0", 
                    activeCityId === ((city as any).slug || String(city.id)) ? "bg-primary text-white border-primary shadow-xl scale-[1.02]" : "bg-muted/5 border-inner opacity-40 hover:opacity-100"
                  )}
                  style={{ wordSpacing: '0.18em' }}
                >
                  {(city as any).name_ar || (city as any).name_en || String(city.id)}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
          {activeHotels.map((hotel, idx) => (
            <motion.div key={hotel.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} layout>
              <Card onClick={() => router.push(`/customer/hotels/${hotel.id}`)} className="group overflow-hidden rounded-[24px] border-outer bg-card/40 backdrop-blur-md transition-all duration-500 hover-shadow-premium cursor-pointer flex flex-col h-full border-2 hover:border-primary/40 relative shadow-sm">
                <div className="relative aspect-[16/10] overflow-hidden shrink-0">
                  <img src={hotel.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className={cn("absolute top-2 md:top-4 bg-black/40 backdrop-blur-md border border-white/20 px-2 md:px-4 py-1 md:py-2 rounded-full text-white flex items-center gap-1 md:gap-2", isRTL ? "right-2 md:right-4" : "left-2 md:left-4")}>
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    <span className="text-[10px] md:text-[11px] font-black tracking-[0.02em]" suppressHydrationWarning>{hotel.rating}</span>
                  </div>
                  
                  <div className={cn("absolute top-2 md:top-4 flex gap-1 md:gap-2 z-[30]", isRTL ? "left-2 md:left-4" : "right-2 md:right-4")}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleCompare(hotel.id); }} 
                      className={cn(
                        "w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-primary transition-all active:scale-90 shadow-lg",
                        compareList.includes(hotel.id) && "bg-primary border-primary"
                      )}
                    >
                      <Layers size={14} className="md:size-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(hotel.id); }} 
                      className={cn(
                        "w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-red-500 transition-all active:scale-90 shadow-lg", 
                        wishlist.includes(hotel.id) && "bg-white text-red-500"
                      )}
                    >
                      <Heart size={14} className={cn(wishlist.includes(hotel.id) ? "fill-red-500" : "", "md:size-4")} />
                    </button>
                  </div>
                </div>
                <div className="p-5 sm:p-6 md:p-8 space-y-4 md:space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-2 md:space-y-4">
                    <h3 className="text-lg md:text-2xl font-black tracking-[0.02em] group-hover:text-primary transition-colors leading-tight line-clamp-1 text-start" style={{ wordSpacing: '0.18em' }}>{t(hotel.nameKey)}</h3>
                    <div className="flex items-center gap-1.5 md:gap-2 text-[10px] font-bold opacity-40 uppercase tracking-[0.02em] justify-start" style={{ wordSpacing: '0.18em' }}>
                      <MapPin size={10} className="text-primary" /> {t(`home.city.${hotel.cityId}`)}
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-5 md:pt-6 border-t border-border/10 flex items-center justify-between gap-4">
                    <div className="flex flex-col shrink-0 min-w-fit text-start">
                      <span className="text-[9px] md:text-[10px] font-black uppercase opacity-30 tracking-[0.02em] mb-0.5 md:mb-1" style={{ wordSpacing: '0.12em' }}>{t('home.starts_from')}</span>
                      <span className="text-sm md:text-xl font-black text-primary tracking-[0.02em]" suppressHydrationWarning style={{ wordSpacing: '0.12em' }}>
                        {hotel.basePrice.toLocaleString()} 
                        <span className="text-[10px] md:text-xs font-bold opacity-40 mx-1">{t('common.currency')}</span>
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => router.push(`/customer/hotels/${hotel.id}`)}
                      className="h-10 px-5 bg-primary text-white rounded-[12px] font-black text-[10px] uppercase tracking-[0.02em] shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0 whitespace-nowrap outline-none border-b-4 border-primary/30" style={{ wordSpacing: '0.18em' }}
                    >
                      {t('hotel.view_details')}
                      <ArrowRight size={14} className={cn("transition-transform group-hover:translate-x-0.5", isRTL && "rotate-180")} />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </section>
      </div>

      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div 
            initial={{ y: 40, opacity: 0, x: '-50%' }} 
            animate={{ y: 0, opacity: 1, x: '-50%' }} 
            exit={{ y: 40, opacity: 0, x: '-50%' }} 
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-20 md:bottom-10 left-1/2 z-[200] w-[90%] max-w-[440px]"
          >
            <Card className="p-1.5 md:p-3 h-[56px] md:h-[80px] rounded-full md:rounded-[32px] shadow-2xl flex items-center justify-between border-[1.5px] border-primary/20 bg-card/90 backdrop-blur-2xl overflow-hidden">
              <div className="flex items-center gap-2 md:gap-4 px-2 md:px-4">
                <button 
                  onClick={handleClearComparison}
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-muted/10 hover:bg-red-500/10 hover:text-red-500 transition-all flex items-center justify-center shrink-0 border border-transparent hover:border-red-500/20 outline-none active:scale-90"
                >
                  <X size={14} className="md:size-4" />
                </button>
                <div className="w-9 h-9 md:w-14 md:h-14 rounded-full md:rounded-[20px] bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-xs md:text-2xl shadow-inner shrink-0 tracking-[0.02em]" suppressHydrationWarning>{compareList.length}</div>
                <div className="text-start flex flex-col justify-center leading-tight">
                  <p className="text-[10px] md:text-[13px] font-black uppercase tracking-[0.02em] text-foreground" style={{ wordSpacing: '0.18em' }}>{t('search.compare')}</p>
                </div>
              </div>
              <button onClick={() => router.push('/compare')} className="h-9 md:h-12 px-4 md:px-8 bg-primary text-white rounded-full md:rounded-[20px] font-black text-[9px] md:text-[11px] uppercase tracking-[0.02em] hover:brightness-110 active:scale-[0.97] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 md:gap-3 shrink-0 outline-none border-b-2 md:border-b-4 border-primary/30" style={{ wordSpacing: '0.18em' }}>
                {t('search.compare_now')} <ArrowRight size={12} className={cn("md:size-4", isRTL ? "rotate-180" : "")} />
              </button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
