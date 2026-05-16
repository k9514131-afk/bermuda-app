
"use client"

import React, { useState, useEffect } from 'react';
import { usePortal } from '@/components/portal-provider';
import { PortalNav } from '@/components/shared/portal-nav';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { MapPin, Star, Heart, Waves, Droplets, Sparkles, Dumbbell, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { apiRequest } from '@/lib/api';

const HOTEL_FALLBACK = "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop";

export default function CityDetailsPage() {
  const params = useParams();
  const id = params.id;
  const { isRTL, t, wishlist, toggleWishlist, cities } = usePortal();
  const router = useRouter();
  
  const [city, setCity] = useState<any>(null);
  const [cityHotels, setCityHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const curr = t('common.currency');

  useEffect(() => {
    if (!id) return;
    
    const loadCityData = async () => {
      setLoading(true);
      try {
        // جلب المدينة المحددة من الحالة العالمية أو API
        const foundCity = cities.find(c => c.id === id);
        if (foundCity) setCity(foundCity);

        // جلب الفنادق المرتبطة بهذه المدينة حصرياً من الباك إند
        const hotels = await apiRequest(`/hotels?city_id=${id}`);
        if (Array.isArray(hotels)) {
          setCityHotels(hotels.filter(h => h.cityId === id));
        }
      } catch (e) {
        console.error("Failed to load city hotels");
      } finally {
        setLoading(false);
      }
    };

    loadCityData();
  }, [id, cities]);

  const handleHotelClick = (hotelId: string) => {
    router.push(`/customer/hotels/${hotelId}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background portal-transition-bg pb-20">
      <PortalNav />
      
      <section className="relative h-[35vh] md:h-[45vh] overflow-hidden">
        <img src={city?.image} className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-6">
          <div className="text-center space-y-6 max-w-5xl animate-in slide-in-from-bottom duration-1000">
             <Badge className="bg-primary/20 text-primary border-primary/30 text-[9px] font-black px-5 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md">{t(city?.descKey || '')}</Badge>
             <h1 className="text-[23px] md:text-[53px] font-black tracking-tighter text-foreground leading-none whitespace-nowrap">{t('search.hotels_in')} {t(city?.nameKey || '')}</h1>
             <p className="text-[10px] md:text-xs font-bold opacity-50 uppercase tracking-[0.25em] max-w-2xl mx-auto pt-2">{t(city?.tagKey || '')}</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {cityHotels.length > 0 ? (
            cityHotels.map((hotel, idx) => (
              <motion.div key={hotel.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                <Card className="group relative overflow-hidden rounded-[24px] border-outer bg-card/40 backdrop-blur-sm transition-all duration-500 hover-shadow-premium hover:-translate-y-1.5 cursor-pointer flex flex-col h-full shadow-sm" onClick={() => handleHotelClick(hotel.id)}>
                  <div className="relative aspect-[4/3] overflow-hidden shrink-0">
                    <img src={hotel.image} onError={(e) => { e.currentTarget.src = HOTEL_FALLBACK; }} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                    <div className={cn("absolute top-4 flex items-center gap-2", isRTL ? "right-4" : "left-4")}><div className="bg-black/40 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full text-white flex items-center gap-1.5"><Star size={10} className="text-amber-400 fill-amber-400" /><span className="text-[10px] font-black">{Number(hotel.rating).toFixed(1)}</span></div></div>
                    <button onClick={(e) => { e.stopPropagation(); toggleWishlist(hotel.id); }} className={cn("absolute top-4 w-9 h-9 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-white hover:text-red-500 transition-all active:scale-90", isRTL ? "left-4" : "right-4", wishlist.includes(hotel.id) && "bg-white text-red-500")}><Heart size={16} className={wishlist.includes(hotel.id) ? "fill-red-500" : ""} /></button>
                  </div>
                  <div className="p-6 p-6 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className={cn("space-y-1 text-start")}><h3 className="text-lg font-black group-hover:text-primary transition-colors truncate tracking-tight">{t(hotel.nameKey)}</h3><div className={cn("flex items-center gap-1.5 text-[9px] font-bold opacity-40 uppercase tracking-widest")}><MapPin size={12} className="text-primary" /> {t(hotel.locationKey)}</div></div>
                      <p className={cn("text-[10px] font-bold opacity-50 leading-relaxed line-clamp-2 text-start")}>{t(hotel.descriptionKey)}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1 justify-start">
                        {(hotel.amenities || []).slice(0, 3).map((a: string) => (<div key={a} className="w-7 h-7 rounded-lg bg-muted/10 border-inner flex items-center justify-center text-primary/40 group-hover:text-primary transition-colors" title={t(a)}>{a.includes('wifi') && <Waves size={14} />}{a.includes('pool') && <Droplets size={14} />}{a.includes('spa') && <Sparkles size={14} />}{a.includes('gym') && <Dumbbell size={14} />}</div>))}
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-5 border-t border-border/10 flex items-center justify-between gap-4">
                      <div className="flex flex-col text-start shrink-0 min-w-fit">
                        <span className="text-lg font-black text-primary tracking-tighter leading-none">{hotel.basePrice?.toLocaleString()} <span className="text-xs font-bold mx-1">{curr}</span></span>
                        <span className="text-[7px] font-black uppercase opacity-30 tracking-widest mt-1">{t('search.price_per_night')}</span>
                      </div>
                      
                      <button 
                        className="h-10 px-5 bg-primary text-white rounded-[12px] font-black text-[10px] uppercase tracking-widest shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0 whitespace-nowrap outline-none border-b-4 border-primary/30"
                      >
                        {t('hotel.view_details')}
                        <ArrowRight size={14} className={cn(isRTL && "rotate-180")} />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-32 text-center space-y-6 bg-muted/5 rounded-[48px] border-inner border-dashed border-2">
              <div className="w-16 h-16 bg-muted/10 rounded-full flex items-center justify-center mx-auto opacity-20"><MapPin size={32} /></div>
              <div className="space-y-2"><h2 className="text-xl font-black opacity-30 uppercase tracking-widest">{t('search.no_results')}</h2><p className="text-[9px] font-bold opacity-20 uppercase tracking-[0.3em]">نعمل على إضافة أرقى الفنادق في هذه المدينة قريباً</p></div>
              <button onClick={() => router.push('/')} className="h-11 px-8 bg-primary/10 text-primary border border-primary/20 rounded-[15px] font-black text-[9px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-3">
                {isRTL ? <ArrowLeft size={14} /> : <ArrowLeft size={14} />} {t('auth.back_to_login').split(' ')[0]} {t('nav.home')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
