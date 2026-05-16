
"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { usePortal } from '@/components/portal-provider';
import { PortalNav } from '@/components/shared/portal-nav';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, Save, Calendar as CalendarIcon, 
  Bed, Users, Plus, Minus, 
  MapPin, Clock, ShieldCheck, CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';


export default function EditBookingPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { t, isRTL, allBookings, setAllBookings, addAuditLog, setIsLoading, mounted, hotels } = usePortal();
  const router = useRouter();
  const { toast } = useToast();

  const [booking, setBooking] = useState<any>(null);
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [nights, setNights] = useState(1);
  const [roomTypeId, setRoomTypeId] = useState('double');
  const [mealPlanId, setMealPlanId] = useState('breakfast');
  const [companions, setCompanions] = useState<any[]>([]);

  useEffect(() => {
    if (!mounted) return;

    const found = allBookings.find(b => b.id === id);
    if (found) {
      setBooking(found);
      setCheckIn(found.checkIn ? new Date(found.checkIn) : new Date());
      setNights(found.nights || 1);
      setRoomTypeId(found.roomType || 'double');
      setMealPlanId(found.mealPlan || 'breakfast');
      setCompanions(found.companions || []);
    } else {
      router.push('/customer/dashboard');
    }
  }, [id, allBookings, router, mounted]);

  const hotel = useMemo(() => 
    hotels.find(h => h.id === booking?.hotelId || h.nameKey === booking?.hotelName), 
  [hotels, booking]);

  const checkOut = useMemo(() => {
    if (!checkIn) return undefined;
    return addDays(checkIn, nights);
  }, [checkIn, nights]);

  const selectedRoomConfig = useMemo(() => 
    hotel?.rooms.find((r: any) => r.id === roomTypeId) || hotel?.rooms[0], 
  [hotel, roomTypeId]);

  const newTotalPrice = useMemo(() => {
    if (!selectedRoomConfig) return 0;
    return selectedRoomConfig.basePrice * nights;
  }, [selectedRoomConfig, nights]);

  const handleUpdateCompanion = (compId: number, field: string, value: string) => {
    setCompanions(prev => prev.map(c => c.id === compId ? { ...c, [field]: value } : c));
  };

  const handleSaveChanges = async () => {
    if (!booking) return;
    setIsLoading(true);

    setTimeout(() => {
      const updatedBooking = {
        ...booking,
        checkIn: checkIn?.toISOString(),
        checkOut: checkOut?.toISOString(),
        nights,
        roomType: roomTypeId,
        mealPlan: mealPlanId,
        totalPrice: newTotalPrice,
        companions,
        totalPersons: companions.length + 1
      };

      const updatedAll = allBookings.map(b => b.id === booking.id ? updatedBooking : b);
      setAllBookings(updatedAll);
      
      // التخزين بنظام المفتاح والبارامترات
      addAuditLog(
        'audit.action.edit', 
        `audit.log.edit|${booking.id}`
      );

      setIsLoading(false);
      toast({ title: t('edit_page.success_msg') });
      router.push('/customer/dashboard');
    }, 1500);
  };

  if (!mounted || !booking || !hotel) return null;

  return (
    <main className="min-h-screen bg-background portal-transition-bg pb-20 pt-28">
      <PortalNav />
      <div className="container mx-auto px-6 max-w-[1000px] space-y-10">
        <header className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-start space-y-2">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] font-black uppercase opacity-40 hover:opacity-100 mb-4">
              <ArrowLeft size={14} className={cn(isRTL && "rotate-180")} /> {t('edit_page.back_to_dashboard')}
            </button>
            <h1 className="text-4xl font-black tracking-tighter">{t('edit_page.title')}</h1>
            <p className="text-[11px] font-bold opacity-40 uppercase tracking-[0.3em]">{t('edit_page.subtitle')}</p>
          </div>
          <Badge variant="outline" className="h-8 px-4 border-primary/20 text-primary font-mono text-[11px]">#{booking.id.toUpperCase()}</Badge>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-8 rounded-[24px] border-outer bg-card/40 backdrop-blur-xl space-y-8">
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border/10 pb-4">
                  <CalendarIcon className="text-primary" size={18} />
                  <h2 className="text-xs font-black uppercase tracking-widest">{t('edit_page.modify_dates')}</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 text-start">
                    <Label className="text-[10px] font-black uppercase opacity-40">{t('hotel.checkin')}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="h-12 w-full bg-muted/5 border border-inner rounded-[12px] text-[11px] font-bold flex items-center justify-center gap-2">
                          <CalendarIcon size={14} className="text-primary/40" />
                          {checkIn ? format(checkIn, 'dd/MM/yyyy') : '---'}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-[250]"><Calendar selected={checkIn} onSelect={(date) => setCheckIn(date)} disabled={d => d < new Date(new Date().setHours(0,0,0,0))} /></PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2 text-start">
                    <Label className="text-[10px] font-black uppercase opacity-40">{t('hotel.nights_label')}</Label>
                    <div className="flex items-center justify-between h-12 bg-muted/5 border border-inner rounded-[12px] px-2">
                      <button onClick={() => setNights(Math.max(1, nights - 1))} className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Minus size={14} /></button>
                      <span className="text-[12px] font-black">{nights}</span>
                      <button onClick={() => setNights(nights + 1)} className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Plus size={14} /></button>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border/10 pb-4">
                  <Bed className="text-primary" size={18} />
                  <h2 className="text-xs font-black uppercase tracking-widest">{t('edit_page.modify_room')}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 text-start">
                    <Label className="text-[10px] font-black uppercase opacity-40">{t('booking.room_type')}</Label>
                    <Select value={roomTypeId} onValueChange={setRoomTypeId}>
                      <SelectTrigger className="h-12 bg-muted/5 border-inner rounded-[12px] text-[11px] font-bold"><SelectValue /></SelectTrigger>
                      <SelectContent className="z-[250]">
                        {hotel.rooms.map((r: any) => <SelectItem key={r.id} value={r.id}>{t(r.nameKey)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-border/10 pb-4">
                  <div className="flex items-center gap-3">
                    <Users className="text-primary" size={18} />
                    <h2 className="text-xs font-black uppercase tracking-widest">{t('edit_page.modify_companions')}</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setCompanions(prev => prev.slice(0, -1))} className="w-7 h-7 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center"><Minus size={14} /></button>
                    <span className="text-[11px] font-black w-6 text-center">{companions.length}</span>
                    <button onClick={() => setCompanions(prev => [...prev, { id: Date.now(), name: "", identity: "", gender: "male" }])} className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Plus size={14} /></button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {companions.map((comp, idx) => (
                    <div key={comp.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-[15px] border-inner bg-muted/5">
                      <div className="space-y-1 text-start">
                        <Label className="text-[10px] font-black uppercase opacity-30">{t('walkin.companion_form.name')} #{idx + 1}</Label>
                        <Input value={comp.name} onChange={e => handleUpdateCompanion(comp.id, 'name', e.target.value)} className="h-9 text-[10px] font-bold rounded-[9px]" />
                      </div>
                      <div className="space-y-1 text-start">
                        <Label className="text-[10px] font-black uppercase opacity-30">{t('walkin.companion_form.id_number')}</Label>
                        <Input value={comp.identity} onChange={e => handleUpdateCompanion(comp.id, 'identity', e.target.value)} className="h-9 text-[10px] font-bold rounded-[9px]" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 rounded-[24px] border-outer bg-card/60 backdrop-blur-3xl sticky top-28 space-y-6 border-primary/20">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <img src={booking.image} className="w-12 h-12 rounded-xl object-cover shadow-md" alt="" />
                  <div className="text-start">
                    <h3 className="text-[13px] font-black">{t(booking.hotelName)}</h3>
                    <p className="text-[9px] font-bold opacity-40 flex items-center gap-1"><MapPin size={10} className="text-primary" /> {t(booking.location || '')}</p>
                  </div>
                </div>

                <div className="p-5 bg-primary/5 rounded-[20px] border-inner border-primary/10 space-y-4">
                  <div className="flex items-center gap-2 border-b border-primary/10 pb-3">
                    <ShieldCheck className="text-primary" size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{t('edit_page.updated_summary')}</span>
                  </div>
                  
                  <div className="space-y-2.5 text-[11px] font-black">
                    <div className="flex justify-between items-center"><span className="opacity-40 uppercase text-[10px]">{t('hotel.checkin')}</span><span>{checkIn ? format(checkIn, 'dd MMM yyyy') : '---'}</span></div>
                    <div className="flex justify-between items-center"><span className="opacity-40 uppercase text-[10px]">{t('booking.room_type')}</span><span>{t(`booking.${roomTypeId}`)}</span></div>
                    <div className="flex justify-between items-center border-t border-primary/10 pt-3">
                      <div className="flex flex-col text-start">
                        <span className="text-[10px] font-black uppercase opacity-40 mb-1">{t('edit_page.total_new_price')}</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-primary tracking-tighter">{newTotalPrice.toLocaleString()}</span>
                          <span className="text-[10px] font-bold text-primary/60 uppercase">{t('common.currency')}</span>
                        </div>
                      </div>
                      <Badge className="bg-primary/10 text-primary border-none h-6 px-3 text-[10px] font-black">{nights} {t('edit_page.nights_count')}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <button onClick={handleSaveChanges} className="w-full h-14 bg-primary text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-[15px] shadow-2xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 border-b-4 border-primary/30">
                {t('edit_page.save_changes')} <CheckCircle2 size={18} />
              </button>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
