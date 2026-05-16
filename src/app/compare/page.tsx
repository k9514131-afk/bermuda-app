"use client"

import React, { useMemo, useState, useEffect } from 'react';
import { usePortal } from '@/components/portal-provider';
import { PortalNav } from '@/components/shared/portal-nav';
import { Card } from '@/components/ui/card';
import { 
  Star, MapPin, X, ArrowRight, 
  Waves, ShieldCheck, Gem, Plus, RefreshCw, Image as ImageIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from 'framer-motion';

const HOTEL_FALLBACK = "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop";

export default function ComparePage() {
  const { isRTL, t, compareList, toggleCompare, hotels } = usePortal();
  const router = useRouter();
  const curr = t('common.currency');
  
  const [isModalOpen, setIsMapOpen] = useState(false);
  const [activeSlotIdx, setActiveSlotIdx] = useState<number | null>(null);
  const [slots, setSlots] = useState<(string | null)[]>([null, null]);

  // Gallery Modal State
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedGalleryHotel, setSelectedGalleryHotel] = useState<any>(null);

  useEffect(() => {
    if (compareList.length > 0 && !slots[0] && !slots[1]) {
      const initialSlots = [null, null] as (string | null)[];
      if (compareList[0]) initialSlots[0] = compareList[0];
      if (compareList[1]) initialSlots[1] = compareList[1];
      setSlots(initialSlots);
    }
  }, [compareList]);

  const handleSelectHotel = (hotelId: string) => {
    if (activeSlotIdx === null) return;
    
    const oldId = slots[activeSlotIdx];
    const otherId = slots[1 - activeSlotIdx];

    if (hotelId === otherId) {
      setIsMapOpen(false);
      return;
    }

    if (oldId) toggleCompare(oldId);
    toggleCompare(hotelId);

    const newSlots = [...slots];
    newSlots[activeSlotIdx] = hotelId;
    setSlots(newSlots);
    
    setIsMapOpen(false);
  };

  const handleRemoveHotel = (idx: number) => {
    const idToRemove = slots[idx];
    if (idToRemove) {
      toggleCompare(idToRemove);
      const newSlots = [...slots];
      newSlots[idx] = null;
      setSlots(newSlots);
    }
  };

  const ComparisonRow = ({ label, icon: Icon, children, className }: any) => (
    <div className={cn("grid grid-cols-1 md:grid-cols-12 border-b border-primary/20 last:border-0", className)}>
      <div className={cn(
        "md:col-span-3 bg-primary/[0.02] py-2 md:py-3 px-5 flex items-center gap-3 border-e border-primary/20",
        isRTL ? "md:text-right" : "md:text-left"
      )}>
        <Icon size={14} className="text-primary opacity-60" />
        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">{label}</span>
      </div>
      <div className="md:col-span-9 grid grid-cols-2">
        {children}
      </div>
    </div>
  );

  const ComparisonCell = ({ children }: any) => (
    <div className="py-2 md:py-3 px-4 md:px-6 border-e border-primary/20 last:border-0 flex flex-col justify-center min-h-[60px] md:min-h-[70px]">
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-background portal-transition-bg pb-20">
      <PortalNav />
      <div className="container mx-auto px-4 md:px-6 py-12 space-y-10 animate-in fade-in duration-700 pt-24 max-w-[1132px]">
        
        <header className="text-center space-y-3 max-w-2xl mx-auto pt-8">
          <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
            {t('compare.badge')}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter">{t('compare.title')}</h1>
          <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.02em] underline-offset-4" style={{ wordSpacing: '0.18em' }}>
            {t('compare.limit_msg')}
          </p>
        </header>

        <Card className="overflow-hidden rounded-[20px] border-outer bg-card/40 backdrop-blur-xl shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-primary/20">
            <div className="hidden md:block md:col-span-3 bg-muted/5 border-e border-primary/20" />
            <div className="md:col-span-9 grid grid-cols-2">
              {slots.map((slotId, idx) => {
                const hotel = slotId ? hotels.find(h => h.id === slotId) : null;
                return (
                  <div key={idx} className="relative border-e border-primary/20 last:border-0 group overflow-hidden bg-primary/[0.01] min-h-[120px] md:aspect-video flex flex-col items-center justify-center">
                    {hotel ? (
                      <>
                        {/* Desktop Image View */}
                        <div className="hidden md:block absolute inset-0">
                          <img src={hotel.image} onError={(e) => { e.currentTarget.src = HOTEL_FALLBACK; }} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                          <div className={cn("absolute top-3 flex gap-2", isRTL ? "left-3" : "right-3")}>
                            <button 
                              onClick={() => { setActiveSlotIdx(idx); setIsMapOpen(true); }}
                              className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-primary transition-all shadow-lg"
                              title={t('compare.change_hotel')}
                            >
                              <RefreshCw size={14} />
                            </button>
                            <button 
                              onClick={() => handleRemoveHotel(idx)}
                              className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-red-500 transition-all shadow-lg"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <div className="absolute bottom-3 left-4 right-4 text-white text-start">
                            <h3 className="text-[11px] font-black truncate uppercase tracking-[0.02em]" style={{ wordSpacing: '0.18em' }}>{t(hotel.nameKey)}</h3>
                          </div>
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden flex flex-col items-center justify-center p-4 text-center space-y-3 w-full h-full bg-primary/[0.02]">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.02em] leading-tight line-clamp-2 px-2 text-foreground/80" style={{ wordSpacing: '0.18em' }}>{t(hotel.nameKey)}</h3>
                          <button 
                            onClick={() => { setSelectedGalleryHotel(hotel); setIsGalleryOpen(true); }}
                            className="h-8 px-4 bg-primary/10 text-primary border border-primary/20 rounded-[10px] font-black text-[10px] uppercase tracking-[0.02em] hover:bg-primary hover:text-white active:scale-95 transition-all flex items-center gap-2" style={{ wordSpacing: '0.18em' }}
                          >
                            <ImageIcon size={12} /> {t('compare.view_photos')}
                          </button>
                          <div className="flex gap-2 pt-1">
                            <button 
                              onClick={() => { setActiveSlotIdx(idx); setIsMapOpen(true); }}
                              className="w-7 h-7 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-center text-primary/40 hover:text-primary transition-all"
                            >
                              <RefreshCw size={12} />
                            </button>
                            <button 
                              onClick={() => handleRemoveHotel(idx)}
                              className="w-7 h-7 rounded-lg bg-red-500/5 border border-red-500/20 text-red-500/60 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-4 group py-8 bg-muted/[0.03]">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/5 border-2 border-dashed border-primary/20 flex items-center justify-center text-primary/30 group-hover:scale-110 transition-transform">
                          <Plus size={24} />
                        </div>
                        <button 
                          onClick={() => { setActiveSlotIdx(idx); setIsMapOpen(true); }}
                          className="h-8 md:h-9 px-4 md:px-6 bg-primary/10 text-primary border border-primary/20 rounded-xl font-black text-[10px] uppercase tracking-[0.02em] hover:bg-primary hover:text-white transition-all shadow-inner" style={{ wordSpacing: '0.18em' }}
                        >
                          {t('compare.add_hotel')}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <ComparisonRow label={t('compare.total_price')} icon={Gem}>
            {slots.map((slotId, idx) => {
              const hotel = slotId ? hotels.find(h => h.id === slotId) : null;
              return (
                <ComparisonCell key={idx}>
                  {hotel ? (
                    <div className="text-start">
                      <span className="text-lg md:text-xl font-black text-primary tracking-[0.02em]" style={{ wordSpacing: '0.12em' }}>
                        {hotel.basePrice?.toLocaleString()} <span className="text-[10px] font-bold opacity-40 uppercase">{curr}</span>
                      </span>
                      <span className="text-[10px] font-black opacity-30 uppercase tracking-[0.02em] block" style={{ wordSpacing: '0.18em' }}>{t('compare.per_night')}</span>
                    </div>
                  ) : <span className="text-[10px] font-bold opacity-20 uppercase tracking-[0.02em]" style={{ wordSpacing: '0.18em' }}>{t('compare.empty_slot')}</span>}
                </ComparisonCell>
              );
            })}
          </ComparisonRow>

          <ComparisonRow label={t('compare.rating')} icon={Star}>
            {slots.map((slotId, idx) => {
              const hotel = slotId ? hotels.find(h => h.id === slotId) : null;
              return (
                <ComparisonCell key={idx}>
                  {hotel ? (
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5 text-amber-400">
                        {Array.from({length: 5}).map((_, i) => (
                          <Star key={i} size={9} fill={i < Math.floor(hotel.rating || 0) ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <span className="text-[10px] font-black opacity-60">{hotel.rating?.toFixed(1)}</span>
                    </div>
                  ) : <span className="text-[10px] font-bold opacity-20 uppercase">---</span>}
                </ComparisonCell>
              );
            })}
          </ComparisonRow>

          <ComparisonRow label={t('compare.location')} icon={MapPin}>
            {slots.map((slotId, idx) => {
              const hotel = slotId ? hotels.find(h => h.id === slotId) : null;
              return (
                <ComparisonCell key={idx}>
                  {hotel ? (
                    <p className="text-[10px] font-black opacity-60 leading-tight uppercase tracking-[0.02em] text-start flex items-center gap-2" style={{ wordSpacing: '0.18em' }}>
                      <MapPin size={10} className="text-primary shrink-0" /> {t(hotel.locationKey)}
                    </p>
                  ) : <span className="text-[10px] font-bold opacity-20 uppercase">---</span>}
                </ComparisonCell>
              );
            })}
          </ComparisonRow>

          <ComparisonRow label={t('compare.amenities')} icon={Waves} className="bg-primary/[0.01]">
            {slots.map((slotId, idx) => {
              const hotel = slotId ? hotels.find(h => h.id === slotId) : null;
              return (
                <ComparisonCell key={idx}>
                  {hotel ? (
                    <div className="flex flex-wrap gap-1 md:gap-1.5 justify-start">
                      {(hotel.amenities || []).slice(0, 3).map((a: string) => (
                        <Badge key={a} variant="outline" className="text-[10px] font-black border-primary/20 bg-primary/[0.03] uppercase h-4 md:h-5 px-1 md:px-2 tracking-[0.02em]" style={{ wordSpacing: '0.12em' }}>
                          {t(`amenity.${a}`).split(' ')[0]}
                        </Badge>
                      ))}
                    </div>
                  ) : <span className="text-[10px] font-bold opacity-20 uppercase">---</span>}
                </ComparisonCell>
              );
            })}
          </ComparisonRow>

          <div className="grid grid-cols-1 md:grid-cols-12 bg-primary/[0.03] border-t border-primary/20">
            <div className="hidden md:block md:col-span-3 border-e border-primary/20" />
            <div className="md:col-span-9 grid grid-cols-2">
              {slots.map((slotId, idx) => {
                const hotel = slotId ? hotels.find(h => h.id === slotId) : null;
                return (
                  <div key={idx} className="p-4 md:p-5 border-e border-primary/20 last:border-0 flex justify-center">
                    {hotel ? (
                      <button 
                        onClick={() => router.push(`/customer/hotels/${hotel.id}`)}
                        className="w-full h-10 md:h-11 bg-primary text-white rounded-[10px] md:rounded-xl font-black text-[10px] uppercase tracking-[0.02em] shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 md:gap-3 border-b-4 border-primary/30" style={{ wordSpacing: '0.18em' }}
                      >
                        {t('compare.book_now')} <ArrowRight size={14} className={isRTL ? "rotate-180" : ""} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => { setActiveSlotIdx(idx); setIsMapOpen(true); }}
                        className="w-full h-10 md:h-11 bg-muted/10 border border-primary/20 text-foreground/40 rounded-[10px] md:rounded-xl font-black text-[10px] uppercase tracking-[0.02em] hover:bg-muted/20 transition-all flex items-center justify-center gap-2" style={{ wordSpacing: '0.18em' }}
                      >
                        <Plus size={14} /> {t('compare.add_hotel')}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <div className="max-w-3xl mx-auto flex items-center gap-4 md:gap-5 p-4 md:p-5 rounded-[18px] bg-amber-500/[0.03] border border-amber-500/20 shadow-inner">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-sm shrink-0 border border-amber-500/20">
            <ShieldCheck size={20} />
          </div>
          <p className={cn("text-[10px] font-bold opacity-50 uppercase leading-relaxed tracking-[0.02em]", isRTL ? "text-right" : "text-left")} style={{ wordSpacing: '0.18em' }}>
            {t('compare.arrival_msg')}
          </p>
        </div>
      </div>

      {/* Hotel Selection Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="max-w-[850px] w-[95%] p-0 border-outer rounded-[24px] bg-card/95 backdrop-blur-3xl shadow-2xl overflow-hidden flex flex-col h-[80vh]">
          <DialogHeader className="p-6 bg-primary/5 border-b border-primary/20">
            <DialogTitle className="text-xl font-black tracking-tighter flex items-center gap-3 text-primary">
              <Gem size={24} /> {t('compare.select_hotel_title')}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-8 clean-scrollbar">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center">
              {hotels.map(hotel => {
                const isAlreadyInOtherSlot = slots.includes(hotel.id);
                return (
                  <motion.div 
                    key={hotel.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => !isAlreadyInOtherSlot && handleSelectHotel(hotel.id)}
                    className={cn(
                      "w-[120px] h-[75px] rounded-[12px] border-[1.5px] relative overflow-hidden cursor-pointer transition-all shadow-sm group",
                      isAlreadyInOtherSlot ? "opacity-40 grayscale cursor-not-allowed border-muted" : "border-primary/20 hover:border-primary shadow-md"
                    )}
                  >
                    <img src={hotel.image} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute inset-0 p-2 flex flex-col justify-end text-white text-[7px] font-black uppercase text-center leading-none">
                      <span className="truncate w-full">{t(hotel.nameKey)}</span>
                    </div>
                    {isAlreadyInOtherSlot && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <Badge className="bg-red-500 text-white text-[6px] h-4">{t('compare.selected_label')}</Badge>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          <div className="p-4 bg-muted/5 border-t border-primary/20 flex justify-center shrink-0">
            <button 
              onClick={() => setIsMapOpen(false)}
              className="h-9 px-8 bg-muted/10 border border-primary/20 text-[10px] font-black uppercase rounded-lg hover:bg-muted/20 transition-all tracking-[0.18em]"
            >
              {t('common.close')}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Gallery Modal */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-[1000px] w-[95%] p-0 border-outer rounded-[24px] bg-card/95 backdrop-blur-3xl shadow-2xl overflow-hidden flex flex-col h-[80vh]">
          <DialogHeader className="p-6 bg-primary/5 border-b border-primary/20">
            <DialogTitle className="text-sm sm:text-lg md:text-xl font-black tracking-tighter flex items-center gap-3 text-primary truncate max-w-[80%]">
              <ImageIcon size={20} className="shrink-0" /> <span className="truncate">{selectedGalleryHotel ? t(selectedGalleryHotel.nameKey) : ''}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-4 md:p-8 clean-scrollbar bg-black/5">
            <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
              {selectedGalleryHotel && [
                selectedGalleryHotel.image,
                `https://picsum.photos/seed/${selectedGalleryHotel.id}1/800/600`,
                `https://picsum.photos/seed/${selectedGalleryHotel.id}2/800/600`,
                `https://picsum.photos/seed/${selectedGalleryHotel.id}3/800/600`
              ].map((img, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-[20px] overflow-hidden shadow-2xl border border-primary/20 aspect-video relative group"
                >
                  <img src={img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </motion.div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-muted/5 border-t border-primary/20 flex justify-center shrink-0">
            <button 
              onClick={() => setIsGalleryOpen(false)}
              className="h-10 px-12 bg-primary text-white font-black text-[10px] uppercase tracking-[0.18em] rounded-xl shadow-xl active:scale-95 transition-all border-b-4 border-primary/30"
            >
              {t('common.close')}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
