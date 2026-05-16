
"use client"

import React, { useState, useMemo, useEffect, Suspense, memo, useRef } from 'react';
import { usePortal } from '@/components/portal-provider';
import { PortalNav } from '@/components/shared/portal-nav';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, Star, Filter, ArrowUpDown, 
  Car, Droplets, Dumbbell, Landmark, Calendar as CalendarIcon, Heart, Map as MapIcon, Layers, X, Building2, ArrowRight, Waves, Sparkles, ChevronRight, Info, Search,
  Plus, Minus, Loader2
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { format, parseISO, isValid } from 'date-fns';
import { ar, enUS, fr } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from 'framer-motion';
import { apiRequest } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from "@/components/ui/toast";

const HOTEL_FALLBACK = "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop";

const CITY_CENTERS: Record<string, [number, number]> = {
  cairo: [30.0357, 31.2330],
  giza: [29.9851, 31.1313],
  alexandria: [31.2001, 29.8972],
  matrouh: [31.3344, 27.5113],
  aswan: [24.0815, 32.8875],
  luxor: [25.7265, 32.6555],
  elgouna: [27.3986, 33.6825],
  sharm: [28.0267, 34.4361],
  dahab: [28.4834, 34.5057],
  rassudr: [29.5855, 32.7123],
  mansoura: [31.0522, 31.4012],
  sohag: [26.5570, 31.6948],
  raselbar: [31.5235, 31.8155],
  default: [26.8206, 30.8025] 
};

const FilterContent = memo(({ priceRange, setPriceRange, selectedAmenities, setSelectedAmenities, t, curr }: any) => {
  const generalAmenities = [
    { id: 'pool', icon: Droplets },
    { id: 'gym', icon: Dumbbell },
    { id: 'parking', icon: Car },
    { id: 'landmark', icon: Landmark },
    { id: 'wifi', icon: Waves },
    { id: 'spa', icon: Sparkles },
  ];

  return (
    <div className="space-y-3 lg:space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] font-black uppercase tracking-[0.02em] text-primary" style={{ wordSpacing: '0.18em' }}>{t('search.price_range')}</Label>
          <Badge variant="outline" className="text-[9px] font-mono border-primary/20 text-primary h-5 px-2 tracking-[0.02em]" suppressHydrationWarning style={{ wordSpacing: '0.12em' }}>
            {priceRange[1].toLocaleString()} {curr}
          </Badge>
        </div>
        <div className="px-1 pt-0.5">
          <Slider min={500} max={30000} step={100} value={priceRange} onValueChange={setPriceRange} className="cursor-pointer" />
          <div className="flex justify-between mt-1.5 font-black text-[10px] opacity-40 tracking-[0.02em]" style={{ wordSpacing: '0.12em' }}>
            <span dir="ltr">{priceRange[0].toLocaleString()} {curr}</span>
            <span dir="ltr">{priceRange[1].toLocaleString()} {curr}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-3 lg:pt-4 border-t border-border/10">
        <Label className="text-[10px] font-black uppercase tracking-[0.02em] text-primary block text-start" style={{ wordSpacing: '0.18em' }}>{t('hotel.amenities_label')}</Label>
        <div className="grid grid-cols-6 lg:grid-cols-3 gap-1.5">
          {generalAmenities.map((amenity) => (
            <div 
              key={amenity.id} 
              onClick={() => {
                if (selectedAmenities.includes(amenity.id)) {
                  setSelectedAmenities(selectedAmenities.filter((a: string) => a !== amenity.id));
                } else {
                  setSelectedAmenities([...selectedAmenities, amenity.id]);
                }
              }}
              className={cn(
                "flex flex-col items-center justify-center gap-1 p-1 rounded-[10px] border-[1.2px] cursor-pointer transition-all group overflow-hidden h-[46px] lg:h-14",
                selectedAmenities.includes(amenity.id) 
                  ? "bg-primary/10 border-primary text-primary" 
                  : "bg-muted/5 border-transparent hover:border-border/20"
              )}
            >
              <div className={cn(
                "w-4 h-4 lg:w-6 lg:h-6 rounded-lg flex items-center justify-center transition-all shrink-0",
                selectedAmenities.includes(amenity.id) ? "bg-primary text-white" : "bg-muted/10 opacity-40 group-hover:opacity-100"
              )}>
                <amenity.icon size={11} className="lg:size-[11px]" />
              </div>
              <span className="text-[6.5px] lg:text-[8px] font-bold uppercase tracking-[0.02em] truncate leading-none text-center px-0.5" style={{ wordSpacing: '0.12em' }}>
                {t(`amenity.${amenity.id}`).split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 lg:pt-4 border-t border-border/10 flex flex-row gap-1.5">
        <button className="flex-1 h-8 lg:h-9 bg-primary text-white font-black text-[9px] uppercase tracking-[0.18em] rounded-[10px] hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/10 outline-none" style={{ wordSpacing: '0.18em' }}>
          {t('search.apply')}
        </button>
        <button 
          onClick={() => { setPriceRange([500, 30000]); setSelectedAmenities([]); }} 
          className="flex-1 h-8 lg:h-9 bg-muted/5 text-foreground/30 font-black text-[9px] uppercase tracking-[0.18em] rounded-[10px] hover:bg-muted/10 transition-all outline-none border border-border/5" style={{ wordSpacing: '0.18em' }}
        >
          {t('search.reset')}
        </button>
      </div>
    </div>
  );
});
FilterContent.displayName = 'FilterContent';

const InteractiveMap = ({ hotels, currentCityId, t, isRTL, router, locale }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    import('leaflet').then((Leaflet) => {
      setL(Leaflet.default || Leaflet);
    });
  }, []);

  useEffect(() => {
    if (!L || !containerRef.current || mapInstanceRef.current) return;

    const center = CITY_CENTERS[currentCityId] || CITY_CENTERS.default;
    const map = L.map(containerRef.current, {
      center: center,
      zoom: currentCityId === 'default' ? 6 : 14,
      zoomControl: false,
      scrollWheelZoom: true,
      fadeAnimation: true,
      markerZoomAnimation: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off(); 
        mapInstanceRef.current.remove(); 
        mapInstanceRef.current = null;
      }
    };
  }, [L, currentCityId]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !L) return;

    const center = CITY_CENTERS[currentCityId] || CITY_CENTERS.default;
    map.setView(center, map.getzoom(), { animate: true });

    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    hotels.forEach((hotel: any) => {
      const position: [number, number] = [hotel.lat, hotel.lng];
      const curr = t('common.currency');

      const customIcon = L.divIcon({
        className: 'custom-marker-wrapper',
        html: `
          <div class="w-8 h-8 bg-card border-2 border-primary rounded-full flex items-center justify-center text-primary shadow-2xl transition-all duration-300 hover:scale-125 hover:bg-primary hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      const popupDiv = document.createElement('div');
      popupDiv.className = 'w-[220px] p-0 overflow-hidden bg-card rounded-xl shadow-2xl border-outer';
      popupDiv.innerHTML = `
        <div class="h-28 w-full bg-muted relative">
          <img src="${hotel.image || HOTEL_FALLBACK}" class="w-full h-full object-cover" alt="" />
          <div class="absolute top-2 right-2 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-white text-[9px] font-black flex items-center gap-1">
            <span class="text-amber-400">★</span> ${hotel.rating}
          </div>
        </div>
        <div class="p-3 space-y-2 text-start">
          <h3 class="text-[11px] font-black uppercase tracking-tight truncate text-foreground/90">${t(hotel.nameKey)}</h3>
          <div class="flex items-center justify-between pt-1 border-t border-border/5">
            <div class="flex flex-col">
              <span class="text-[7px] font-black uppercase opacity-40">${t('search.price_per_night')}</span>
              <span class="text-[11px] font-black text-primary">${hotel.basePrice?.toLocaleString()} ${curr}</span>
            </div>
            <button id="map-btn-${hotel.id}" class="h-7 px-3 bg-primary text-white rounded-lg text-[8px] font-black uppercase hover:brightness-110 active:scale-95 transition-all">
              ${t('hotel.view_details')}
            </button>
          </div>
        </div>
      `;

      const marker = L.marker(position, { icon: customIcon }).addTo(map);
      marker.bindPopup(popupDiv, { 
        closeButton: false, 
        className: 'custom-leaflet-popup',
        offset: [0, -10]
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`map-btn-${hotel.id}`);
        if (btn) btn.onclick = (e) => { e.preventDefault(); router.push(`/customer/hotels/${hotel.id}`); };
      });
    });

  }, [hotels, currentCityId, L, t, router]);

  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} className="w-full h-full z-0 outline-none bg-[#050A14]" />
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[10] no-print pointer-events-none">
        <Badge className="bg-black/60 backdrop-blur-md border-white/10 text-white/80 text-[8px] font-black uppercase px-6 py-2.5 rounded-full tracking-[0.12em] flex items-center gap-3 shadow-2xl border-b-2 border-primary/30" style={{ wordSpacing: '0.18em' }}>
          <MapIcon size={14} className="text-primary animate-pulse" /> {t('search.map_hotels_nearby')}
        </Badge>
      </div>
      {!L && (
        <div className="absolute inset-0 bg-[#050A14] flex flex-col items-center justify-center space-y-6 z-50">
          <Loader2 className="animate-spin text-primary" size={48} />
          <div className="text-center space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/60 block" style={{ wordSpacing: '0.18em' }}>{t('loading.processing')}</span>
          </div>
        </div>
      )}
    </div>
  );
};

function SearchResultsContent() {
  const { language, isRTL, t, wishlist, toggleWishlist, compareList, setCompareList, toggleCompare, hotels: globalHotels, isNavVisible } = usePortal();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [priceRange, setPriceRange] = useState([500, 30000]);
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [dbHotels, setDbHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const curr = t('common.currency');
  const queryLocation = searchParams.get('location') || "";
  const [queryDate, setQueryDate] = useState<Date | undefined>(undefined);

  const localesDict: Record<string, any> = { ar, en: enUS, fr };
  const currentLocale = localesDict[language] || enUS;

  const currentCityId = useMemo(() => {
    if (!queryLocation) return 'default';
    const normalize = (text: string) => text.trim().toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/\s+/g, ' ');
    const q = normalize(queryLocation);
    const found = Object.keys(CITY_CENTERS).find(key => {
      const cityKey = `city.${key}`;
      return normalize(t(cityKey)).includes(q) || key.includes(q);
    });
    return found || 'default';
  }, [queryLocation, t]);
  
  useEffect(() => {
    const dateStr = searchParams.get('date');
    if (dateStr) {
      const parsed = parseISO(dateStr);
      if (isValid(parsed)) setQueryDate(parsed);
    } else {
      setQueryDate(new Date());
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const results = await apiRequest(`/hotels`);
        if (Array.isArray(results) && results.length > 0) {
          setDbHotels(results);
        } else {
          setDbHotels(globalHotels);
        }
      } catch (e) {
        setDbHotels(globalHotels);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [globalHotels, searchParams]);

  const normalizeStr = (text: string) => {
    if (!text) return "";
    return text.trim().toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/\s+/g, ' ');
  };

  const filteredResults = useMemo(() => {
    const normalizedQuery = normalizeStr(queryLocation);
    let results = [...dbHotels].filter(h => h.basePrice >= priceRange[0] && h.basePrice <= priceRange[1]);
    
    if (normalizedQuery) {
      results = results.filter(hotel => {
        const hotelName = normalizeStr(t(hotel.nameKey));
        const locationName = normalizeStr(t(hotel.locationKey)); 
        const cityId = normalizeStr(hotel.cityId);
        return hotelName.includes(normalizedQuery) || locationName.includes(normalizedQuery) || cityId.includes(normalizedQuery);
      });
    }
    
    if (sortBy === 'low_price') results.sort((a, b) => a.basePrice - b.basePrice);
    if (sortBy === 'high_rating') results.sort((a, b) => b.rating - a.rating);
    
    return results;
  }, [priceRange, sortBy, queryLocation, dbHotels, t]);

  const handleClearComparison = (e: React.MouseEvent) => {
    e.stopPropagation();
    const backup = [...compareList];
    setCompareList([]);
    toast({
      title: t('search.compare_cleared'),
      action: <ToastAction altText={t('search.undo')} onClick={() => setCompareList(backup)} className="bg-primary text-white hover:bg-primary/90 border-none h-8 text-[10px] font-black uppercase px-4 rounded-lg shadow-lg tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('search.undo')}</ToastAction>,
    });
  };

  return (
    <div className="min-h-screen bg-background portal-transition-bg pb-20 pt-[75px]">
      <PortalNav />
      
      <div className="bg-card/80 backdrop-blur-2xl border-b border-border/10 transition-all shadow-sm relative z-40">
        <div className="container mx-auto max-w-[1600px] px-4 md:px-6 py-3 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="w-full lg:w-auto grid grid-cols-2 lg:flex lg:items-center gap-2 lg:gap-8">
            <div className="flex items-center gap-3 group p-2 rounded-xl bg-primary/[0.03] lg:bg-transparent">
              <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0"><MapPin size={14} className="text-primary" /></div>
              <div className="text-start overflow-hidden">
                <span className="text-[10px] font-black uppercase opacity-30 block tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('search.where')}</span>
                <span className="text-[10px] font-black text-foreground/90 leading-none truncate block tracking-[0.02em]" style={{ wordSpacing: '0.12em' }}>{queryLocation || (currentCityId === 'default' ? t('search.city_default') : t(`city.${currentCityId}`))}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 group p-2 rounded-xl bg-primary/[0.03] lg:bg-transparent border-s lg:border-s-0 border-border/5 lg:ps-0">
              <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0"><CalendarIcon size={14} className="text-primary" /></div>
              <div className="text-start overflow-hidden">
                <span className="text-[10px] font-black uppercase opacity-30 block tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('search.checkin')}</span>
                <span className="text-[10px] font-black text-foreground/90 leading-none truncate block tracking-[0.02em]" suppressHydrationWarning style={{ wordSpacing: '0.12em' }}>{queryDate ? format(queryDate, 'dd MMM yyyy', { locale: currentLocale }) : '---'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <button onClick={() => router.push('/')} className="flex-1 lg:flex-none h-10 px-5 bg-muted/10 border-inner text-foreground/60 font-black text-[10px] uppercase tracking-[0.18em] rounded-[12px] hover:bg-muted/20 transition-all outline-none" style={{ wordSpacing: '0.18em' }}>
              {t('search.edit')}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-[1600px] px-6 pt-2 pb-12">
        <div className="flex flex-col lg:flex-row gap-10 items-start relative">
          
          <aside 
            style={{ 
              position: 'sticky',
              top: isNavVisible ? 'calc(50% + 85px)' : 'calc(50% + 45px)',
              transform: 'translateY(-50%)',
              transition: 'top 0.3s ease-in-out'
            }}
            className="hidden lg:block w-[260px] lg:w-[280px] shrink-0 z-20 lg:mt-[22px]"
          >
            <Card className="bg-card/40 backdrop-blur-xl p-4 rounded-[24px] border-outer border-opacity-40 shadow-sm overflow-hidden h-fit">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('search.filters')}</h2>
                <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center text-primary"><Filter size={12} /></div>
              </div>
              <FilterContent 
                priceRange={priceRange} 
                setPriceRange={setPriceRange} 
                selectedAmenities={selectedAmenities} 
                setSelectedAmenities={setSelectedAmenities} 
                t={t} 
                curr={curr} 
              />
            </Card>
          </aside>

          <main className="flex-1 space-y-8 w-full relative z-10">
            <div className="lg:hidden w-full max-w-4xl mx-auto mb-2 animate-in fade-in slide-in-from-top-4 duration-700">
              <Card className="bg-card/40 backdrop-blur-xl p-4 rounded-[24px] border-outer border-opacity-40 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Filter size={14} /></div>
                    <h2 className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('search.filters')}</h2>
                  </div>
                </div>
                <FilterContent priceRange={priceRange} setPriceRange={setPriceRange} selectedAmenities={selectedAmenities} setSelectedAmenities={setSelectedAmenities} t={t} curr={curr} />
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/5 p-4 rounded-[20px] border-inner border-opacity-30">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <span className="text-xl font-black text-primary tracking-[0.02em]" suppressHydrationWarning style={{ wordSpacing: '0.18em' }}>{filteredResults.length}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('search.results_count')}</span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-11 w-full sm:w-[200px] rounded-[12px] border-inner bg-card font-black text-[10px] uppercase tracking-[0.18em] shadow-sm outline-none" style={{ wordSpacing: '0.18em' }}>
                    <div className="flex items-center gap-2"><ArrowUpDown size={14} className="text-primary opacity-60" /><SelectValue placeholder={t('search.sort_by')} /></div>
                  </SelectTrigger>
                  <SelectContent className="z-[500] rounded-[18px]">
                    <SelectItem value="relevance" className="font-bold text-[10px] uppercase tracking-normal" style={{ wordSpacing: '0.12em' }}>{t('search.sort_relevance')}</SelectItem>
                    <SelectItem value="low_price" className="font-bold text-[10px] uppercase tracking-normal" style={{ wordSpacing: '0.12em' }}>{t('search.sort_low_price')}</SelectItem>
                    <SelectItem value="high_rating" className="font-bold text-[10px] uppercase tracking-normal" style={{ wordSpacing: '0.12em' }}>{t('search.sort_high_rating')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="min-h-[400px] relative">
              {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] opacity-40" style={{ wordSpacing: '0.18em' }}>{t('loading.processing')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  <AnimatePresence mode="popLayout">
                    {filteredResults.length > 0 ? (
                      filteredResults.map((hotel, idx) => (
                        <motion.div 
                          key={hotel.id} 
                          layout
                          initial={{ opacity: 0, y: 20 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <Card className="group h-full overflow-hidden rounded-[24px] border-outer bg-card/40 backdrop-blur-md transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl flex flex-col border-2 hover:border-primary/30 relative">
                            <div className="relative aspect-video overflow-hidden shrink-0">
                              <img src={hotel.image} onError={(e) => { e.currentTarget.src = HOTEL_FALLBACK; }} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                              <div className={cn("absolute top-3 md:top-4 bg-black/40 backdrop-blur-md border border-white/20 px-3 py-1.5 md:px-3.5 md:py-1.5 rounded-full text-white flex items-center gap-1.5 md:gap-2 shadow-xl", isRTL ? "right-3 md:right-4" : "left-3 md:left-4")}>
                                <Star size={10} className="text-amber-400 fill-amber-400" />
                                <span className="text-[10px] md:text-[11px] font-black tracking-[0.02em]" suppressHydrationWarning style={{ wordSpacing: '0.12em' }}>{Number(hotel.rating).toFixed(1)}</span>
                              </div>
                              <div className={cn("absolute top-3 md:top-4 flex gap-2 z-30", isRTL ? "left-3 md:left-4" : "right-3 md:right-4")}>
                                <button onClick={(e) => { e.stopPropagation(); toggleCompare(hotel.id); }} className={cn("w-8 h-8 md:w-9 md:h-9 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-primary transition-all shadow-lg outline-none", compareList.includes(hotel.id) && "bg-primary border-primary")}><Layers size={14} className="md:size-[16px]" /></button>
                                <button onClick={(e) => { e.stopPropagation(); toggleWishlist(hotel.id); }} className={cn("w-8 h-8 md:w-9 md:h-9 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-red-500 transition-all shadow-lg outline-none", wishlist.includes(hotel.id) && "bg-white text-red-500")}><Heart size={14} className={cn(wishlist.includes(hotel.id) ? "fill-red-500" : "", "md:size-[16px]")} /></button>
                              </div>
                            </div>
                            <div className="p-5 sm:p-6 flex flex-col flex-1">
                              <div className="space-y-3.5 flex-1">
                                <div className="space-y-1">
                                  <h3 className="text-lg sm:text-lg font-black group-hover:text-primary transition-colors tracking-[0.02em] leading-tight line-clamp-1 text-start" style={{ wordSpacing: '0.18em' }}>{t(hotel.nameKey)}</h3>
                                  <div className="flex items-center gap-1.5 md:gap-2 text-[10px] font-bold opacity-40 uppercase tracking-[0.18em] justify-start" style={{ wordSpacing: '0.18em' }}><MapPin size={12} className="text-primary" />{t(hotel.locationKey)}</div>
                                </div>
                                <p className="text-[11px] sm:text-[11px] font-medium opacity-50 leading-relaxed line-clamp-2 text-start min-h-[32px] tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t(hotel.descriptionKey)}</p>
                                <div className="flex flex-wrap gap-1.5 pt-0.5 justify-start">
                                  {(hotel.amenities || []).slice(0, 3).map((a: string) => (
                                    <Badge key={a} variant="outline" className="h-5 md:h-6 px-2.5 rounded-lg border-inner border-opacity-20 bg-muted/5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.12em] opacity-60" style={{ wordSpacing: '0.12em' }}>{t(`amenity.${a}`).split(' ')[0]}</Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="mt-5 pt-4 border-t border-border/5 flex items-center justify-between gap-4">
                                <div className="flex flex-col items-start shrink-0 min-w-fit text-start">
                                  <span className="text-[9px] md:text-[10px] font-black uppercase opacity-30 tracking-[0.12em] mb-0.5 truncate" style={{ wordSpacing: '0.12em' }}>{t('search.price_per_night')}</span>
                                  <div className="flex items-baseline gap-1"><span className="text-lg md:text-xl font-black text-primary tracking-[0.12em]" suppressHydrationWarning style={{ wordSpacing: '0.12em' }}>{hotel.basePrice?.toLocaleString()}</span><span className="text-[10px] font-black opacity-40 uppercase tracking-[0.18em]">{curr}</span></div>
                                </div>
                                
                                <button 
                                  onClick={() => router.push(`/customer/hotels/${hotel.id}`)} 
                                  className="h-10 px-5 bg-primary text-white rounded-[12px] font-black text-[10px] uppercase tracking-[0.18em] shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0 whitespace-nowrap outline-none border-b-4 border-primary/30" style={{ wordSpacing: '0.18em' }}
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
                      <div className="col-span-full py-32 text-center space-y-6 bg-muted/5 rounded-[32px] border-inner border-dashed border-2">
                        <div className="w-20 h-20 bg-muted/10 rounded-3xl flex items-center justify-center mx-auto opacity-20"><Building2 size={40} /></div>
                        <div className="space-y-2"><h2 className="text-xl font-black opacity-30 uppercase tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('search.no_results')}</h2></div>
                        <button onClick={() => { setPriceRange([500, 30000]); setSelectedAmenities([]); }} className="h-11 px-8 bg-primary/10 text-primary border border-primary/20 rounded-2xl font-black text-[10px] uppercase tracking-[0.18em] hover:bg-primary hover:text-white transition-all outline-none" style={{ wordSpacing: '0.18em' }}>{t('search.reset')}</button>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div initial={{ y: 40, opacity: 0, x: '-50%' }} animate={{ y: 0, opacity: 1, x: '-50%' }} exit={{ y: 40, opacity: 0, x: '-50%' }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed bottom-20 md:bottom-10 left-1/2 z-[200] w-[90%] max-w-[440px]">
            <Card className="p-1.5 md:p-3 h-[56px] md:h-[80px] rounded-full md:rounded-[32px] shadow-2xl flex items-center justify-between border-[1.5px] border-primary/20 bg-card/90 backdrop-blur-2xl overflow-hidden">
              <div className="flex items-center gap-2 md:gap-4 px-2 md:px-4">
                <button onClick={handleClearComparison} className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-muted/10 hover:bg-red-500/10 hover:text-red-500 transition-all flex items-center justify-center shrink-0 border border-transparent hover:border-red-500/20 outline-none active:scale-90"><X size={14} className="md:size-4" /></button>
                <div className="w-9 h-9 md:w-14 md:h-14 rounded-full md:rounded-[20px] bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-xs md:text-2xl shadow-inner shrink-0 tracking-[0.02em]" suppressHydrationWarning style={{ wordSpacing: '0.12em' }}>{compareList.length}</div>
                <div className="text-start flex flex-col justify-center leading-tight">
                  <p className="text-[10px] md:text-[13px] font-black uppercase tracking-[0.18em] text-foreground" style={{ wordSpacing: '0.18em' }}>{t('search.compare')}</p>
                </div>
              </div>
              <button onClick={() => router.push('/compare')} className="h-9 md:h-12 px-4 md:px-8 bg-primary text-white rounded-full md:rounded-[20px] font-black text-[9px] md:text-[11px] uppercase tracking-[0.18em] hover:brightness-110 active:scale-[0.97] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 md:gap-3 shrink-0 outline-none border-b-2 md:border-b-4 border-primary/30" style={{ wordSpacing: '0.18em' }}>{t('search.compare_now')} <ArrowRight size={12} className={cn("md:size-4", isRTL ? "rotate-180" : "")} /></button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-6">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-[9px] font-black uppercase tracking-[0.18em] opacity-40" style={{ wordSpacing: '0.18em' }}>جاري تحميل النتائج ملوكي...</p>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
