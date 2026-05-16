"use client"

import React, { useMemo } from 'react';
import { usePortal } from '@/components/portal-provider';
import { PortalNav } from '@/components/shared/portal-nav';
import { Card } from '@/components/ui/card';
import { MapPin, Star, Heart, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

/**
 * @fileOverview صفحة المفضلة - عرض الفنادق المختارة من قبل العميل.
 */
export default function WishlistPage() {
  const { wishlist, toggleWishlist, t, isRTL, hotels } = usePortal();
  const router = useRouter();

  const wishlistHotels = useMemo(() => {
    return hotels.filter(h => wishlist.includes(h.id));
  }, [wishlist, hotels]);

  return (
    <main className="min-h-screen bg-background portal-transition-bg pb-20 pt-28">
      <PortalNav />
      <div className="container mx-auto px-6 max-w-7xl space-y-12">
        <header className="text-start space-y-2">
          <h1 className="text-4xl font-black tracking-normal mb-[15px]">{t('nav.wishlist')}</h1>
          <p className="text-[11px] font-bold opacity-40 uppercase tracking-normal">{t('home.hero_subtitle')}</p>
        </header>

        {wishlistHotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistHotels.map((hotel, idx) => (
              <motion.div key={hotel.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <Card onClick={() => router.push(`/customer/hotels/${hotel.id}`)} className="group overflow-hidden rounded-[24px] border-outer bg-card/40 backdrop-blur-md transition-all duration-500 hover-shadow-premium cursor-pointer flex flex-col h-full border-2 hover:border-primary/40 relative shadow-sm">
                  <div className="relative aspect-[16/10] overflow-hidden shrink-0">
                    <img src={hotel.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
                    <div className={cn("absolute top-4 bg-black/40 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-white flex items-center gap-2", isRTL ? "right-4" : "left-4")}>
                      <Star size={10} className="text-amber-400 fill-amber-400" />
                      <span className="text-[11px] font-black" suppressHydrationWarning>{hotel.rating}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(hotel.id); }} 
                      className={cn("absolute top-4 w-9 h-9 rounded-xl bg-white text-red-500 flex items-center justify-center transition-all shadow-lg active:scale-90", isRTL ? "left-4" : "right-4")}
                    >
                      <Heart size={16} className="fill-red-500" />
                    </button>
                  </div>
                  <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <h3 className="text-xl md:text-2xl font-black tracking-normal group-hover:text-primary transition-colors leading-tight line-clamp-1 text-start">{t(hotel.nameKey)}</h3>
                      <div className="flex items-center gap-2 text-[10px] font-bold opacity-40 uppercase tracking-normal justify-start"><MapPin size={12} className="text-primary" /> {t(`home.city.${hotel.cityId}`)}</div>
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-border/10 flex items-center justify-between gap-4">
                      <div className="flex flex-col items-start shrink-0 min-w-fit text-start">
                        <span className="text-[10px] font-black uppercase opacity-30 tracking-normal mb-1">{t('home.starts_from')}</span>
                        <span className="text-lg md:text-xl font-black text-primary tracking-normal" suppressHydrationWarning>
                          {hotel.basePrice.toLocaleString()} 
                          <span className="text-xs font-bold opacity-40 mx-1">{t('common.currency')}</span>
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => router.push(`/customer/hotels/${hotel.id}`)}
                        className="h-10 px-5 bg-primary text-white rounded-[12px] font-black text-[10px] uppercase tracking-normal shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0 whitespace-nowrap outline-none border-b-4 border-primary/30"
                      >
                        {t('hotel.view_details')}
                        <ArrowRight size={14} className={cn(isRTL && "rotate-180")} />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-6 bg-muted/5 border-inner border-dashed border-2 rounded-[24px]">
             <Heart size={40} className="mx-auto opacity-20" />
             <div className="space-y-2">
               <h2 className="text-xl font-black opacity-30 uppercase tracking-normal">{t('search.no_results')}</h2>
               <p className="text-[10px] font-bold opacity-20 uppercase tracking-normal">قائمتك المفضلة خالية حالياً، ابدأ باستكشاف أرقى الفنادق</p>
             </div>
             <button onClick={() => router.push('/customer')} className="h-14 px-10 bg-primary text-white rounded-xl font-black text-[11px] uppercase tracking-normal shadow-xl hover:brightness-110 active:scale-[0.98] transition-all">
               {t('dashboard.explore_btn')}
             </button>
          </div>
        )}
      </div>
    </main>
  );
}