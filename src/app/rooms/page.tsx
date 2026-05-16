"use client"

import React, { useState, useMemo, Suspense, useEffect } from 'react';
import { usePortal, PhysicalRoom } from '@/components/portal-provider';
import { PortalNav } from '@/components/shared/portal-nav';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bed, CheckCircle2, Clock, Hammer, Hash, ArrowRight, Loader2, Plus, Edit3, Trash2, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

function RoomsContent() {
  const { t, isRTL, rooms, updateRoomStatus, manageRoom, user, refreshData, mounted: isHydrated, isNavVisible } = usePortal();
  const { toast } = useToast();
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<'add' | 'edit' | null>(null);
  const [roomForm, setRoomForm] = useState<Partial<PhysicalRoom>>({ number: '', type: 'double', floor: 1, status: 'available' });
  const [apiRooms, setApiRooms] = useState<PhysicalRoom[]>([]);

  useEffect(() => {
  if (!isHydrated) return;

  const loadRooms = async () => {
    try {

      const res = await fetch('http://127.0.0.1:8000/api/rooms');
      const data = await res.json();

      const normalizedRooms = Array.isArray(data)
        ? data.map((room: any) => ({
            ...room,
            id: String(room.id),
            floor: Number(room.floor),
            number: String(room.number || room.room_number || ''),
            status: room.status || 'available',
            type: room.type || 'single',
          }))
        : [];

      setApiRooms(normalizedRooms);
    } catch (error) {
      console.error('Failed to load rooms from API:', error);
    }
  };

  loadRooms();
}, [refreshData, isHydrated]);

 const displayedRooms = useMemo(() => {
  return [...(apiRooms.length ? apiRooms : rooms)]
    .map((room: any) => ({
      ...room,
      id: String(room.id),
      floor: Number(room.floor),
      number: String(room.number || room.room_number || ''),
      status: room.status || 'available',
      type: room.type || 'single',
    }))
    .sort((a, b) => Number(a.number) - Number(b.number));
}, [apiRooms, rooms]);

const floors = useMemo(() => {
  const uniqueFloors = Array.from(
    new Set(displayedRooms.map(r => Number(r.floor)))
  ).sort((a, b) => a - b);

  return uniqueFloors.length > 0 ? uniqueFloors : [1];
}, [displayedRooms]);

  const handleOpenAdd = () => {
    setRoomForm({ number: '', type: 'double', floor: 1, status: 'available' });
    setEditMode('add');
    setIsManageModalOpen(true);
  };

  const handleOpenEdit = (r: PhysicalRoom) => {
    setRoomForm(r);
    setEditMode('edit');
    setIsManageModalOpen(true);
  };

  const handleSaveRoom = async (customForm?: Partial<PhysicalRoom>) => {
    const finalForm = customForm || roomForm;
    // لتغيير الحالة نسمح حتى لو كان رقم الغرفة فارغاً
    if (editMode === 'add' && !finalForm.number) return;
    
if (editMode === 'edit' && finalForm.id) {
  const res = await fetch(`http://127.0.0.1:8000/api/rooms/${finalForm.id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: finalForm.status }),
  });

  const updatedRoom = await res.json();

  setApiRooms(prev =>
    prev.map(room =>
      String(room.id) === String(updatedRoom.id)
        ? { ...room, ...updatedRoom }
        : room
    )
  );
} else {
  manageRoom(editMode!, finalForm);
}
    
    setIsManageModalOpen(false);
    toast({ title: t('notification.booking_updated') });
  };

  if (!isHydrated || !user || user.role !== 'staff') return null;

  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-20">
      <PortalNav />
      <div className="container mx-auto px-4 py-8 space-y-12 animate-in fade-in duration-700 pt-28 max-w-[1500px]">
        
        <header className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-start">
            <h1 className="text-4xl font-black tracking-tighter text-foreground/90 mb-[15px]">{t('rooms.title')}</h1>
            <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('rooms.subtitle')}</p>
          </div>
          <button onClick={handleOpenAdd} className="h-11 px-8 bg-primary text-white font-black text-[10px] uppercase rounded-[12px] shadow-xl hover:brightness-110 flex items-center gap-2 tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}><Plus size={18} /> إضافة غرفة جديدة</button>
        </header>

        <section className="space-y-16">
          {floors.map(floor => (
            <div key={floor} className="space-y-8">
              <div className="flex items-center gap-6 px-4">
                <h2 className="text-[12px] font-black uppercase tracking-[0.18em] text-primary whitespace-nowrap" style={{ wordSpacing: '0.18em' }}>الطابق {floor}</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-4">
                {displayedRooms.filter(r => Number(r.floor) === Number(floor)).map(room => (
                  <Card key={room.id} className={cn(
                    "p-4 rounded-[18px] border-inner border-[1.5px] transition-all hover:scale-105 group relative flex flex-col items-center justify-center gap-2 h-32 cursor-pointer shadow-sm overflow-hidden",
                   room.status === 'available' ? 'bg-emerald-500/[0.03] border-emerald-500/40' :
                   room.status === 'occupied' ? 'bg-red-400/[0.08] border-red-400/50' :
                   room.status === 'cleaning' ? 'bg-amber-500/[0.06] border-amber-500/50' :
                   room.status === 'maintenance' ? 'bg-red-900/[0.18] border-red-900/60' :
                   room.status === 'out_of_service' ? 'bg-slate-600/[0.12] border-slate-500/50' :
                   'bg-slate-500/[0.05] border-slate-500/40'
                  )}>
                    {/* Status Dot Indicator - Top Right */}
                    <div className={cn(
                      "absolute top-3 right-3 w-2 h-2 rounded-full z-20 shadow-sm",
                      room.status === 'available' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' :
                      room.status === 'occupied' ? 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.45)]' :
                      room.status === 'cleaning' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' :
                      room.status === 'maintenance' ? 'bg-red-900 shadow-[0_0_8px_rgba(127,29,29,0.55)]' :
                      room.status === 'out_of_service' ? 'bg-slate-500 shadow-[0_0_8px_rgba(100,116,139,0.45)]' :
                      'bg-slate-600 shadow-[0_0_8px_rgba(71,85,105,0.4)]'
                    )} />

                    {/* Suite Gold Point - Top Center */}
                    {room.type === 'suite' && (
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-500/60 shadow-[0_0_5px_rgba(245,158,11,0.5)] z-10" />
                    )}

                    {/* Room Type Label */}
                    <div className={cn(
                      "absolute top-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted/10",
                      isRTL ? "right-14" : "left-14"
                    )}>
                      <span className="text-[7.5px] font-black uppercase tracking-[0.02em] text-foreground/40" style={{ wordSpacing: '0.12em' }}>
                        {t(`rooms.types.${room.type}`)}
                      </span>
                    </div>

                    <span className="text-[22px] font-black tracking-tighter mb-1">{room.number}</span>
                    
                    <Badge variant="outline" className={cn(
                      "text-[7.5px] font-black h-5 px-3 rounded-[7px] uppercase border-none shadow-sm tracking-[0.02em]", 
                     room.status === 'available' ? 'bg-emerald-500/10 text-emerald-600' :
                     room.status === 'occupied' ? 'bg-red-400/10 text-red-400' :
                     room.status === 'cleaning' ? 'bg-amber-500/10 text-amber-500' :
                     room.status === 'maintenance' ? 'bg-red-900/20 text-red-300' :
                     room.status === 'out_of_service' ? 'bg-slate-500/10 text-slate-400' :
                     'bg-slate-500/10 text-slate-600'
                    )} style={{ wordSpacing: '0.12em' }}>
                      {t(`rooms.status.${room.status}`)}
                    </Badge>

                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-[18px]">
                      <button onClick={() => handleOpenEdit(room)} className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-primary transition-all shadow-lg"><Edit3 size={18} /></button>
                      <button onClick={() => { if(confirm('حذف الغرفة؟')) manageRoom('delete', room); }} className="w-10 h-10 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg"><Trash2 size={18} /></button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>

      <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
        <DialogContent 
          style={{ 
            height: isNavVisible ? 'calc(95vh - 80px)' : '95vh',
            top: isNavVisible ? 'calc(50% + 40px)' : '50%',
            maxHeight: isNavVisible ? 'calc(95vh - 80px)' : '95vh',
            transform: 'translate(-50%, -50%)'
          }}
          className="max-w-[420px] p-0 border-outer rounded-[24px] bg-card/95 backdrop-blur-3xl shadow-2xl flex flex-col"
        >
          <DialogHeader className="p-8 bg-primary/5 border-b border-border/10">
            <DialogTitle className="text-[21px] font-black tracking-tighter flex items-center gap-3 whitespace-nowrap">
              {editMode === 'add' ? <Plus className="text-primary" /> : <Edit3 className="text-primary" />}
              {editMode === 'add' ? 'إضافة غرفة جديدة' : t('rooms.modal.update_label')}
            </DialogTitle>
          </DialogHeader>
          <div className="p-8 space-y-6 overflow-y-auto clean-scrollbar flex-1">
            {editMode === 'add' ? (
              <div className="space-y-4">
                <div className="space-y-1.5 text-start">
                  <Label className="text-[10px] font-black uppercase opacity-40 tracking-[0.02em]" style={{ wordSpacing: '0.18em' }}>رقم الغرفة</Label>
                  <Input value={roomForm.number} onChange={e => setRoomForm({...roomForm, number: e.target.value})} className="h-11 font-bold text-center" placeholder="مثلاً: 101" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-start">
                    <Label className="text-[10px] font-black uppercase opacity-40 tracking-[0.02em]" style={{ wordSpacing: '0.18em' }}>الفئة</Label>
                    <Select value={roomForm.type} onValueChange={v => setRoomForm({...roomForm, type: v as any})}>
                      <SelectTrigger className="h-11 font-bold"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">فردية</SelectItem><SelectItem value="double">مزدوجة</SelectItem><SelectItem value="suite">جناح ملكي</SelectItem><SelectItem value="family">عائلية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5 text-start">
                    <Label className="text-[10px] font-black uppercase opacity-40 tracking-[0.02em]" style={{ wordSpacing: '0.18em' }}>الطابق</Label>
                    <Input type="number" value={roomForm.floor} onChange={e => setRoomForm({...roomForm, floor: parseInt(e.target.value)})} className="h-11 font-bold text-center" />
                  </div>
                </div>
                <button onClick={() => handleSaveRoom()} className="w-full h-12 bg-primary text-white rounded-[12px] font-black text-[11px] uppercase tracking-[0.18em] shadow-xl flex items-center justify-center gap-3 border-b-4 border-primary/30 outline-none" style={{ wordSpacing: '0.18em' }}>
                  حفظ البيانات <Save size={18} />
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Status-specific Action Buttons */}
                <div className="flex flex-col items-center gap-3 pb-6 border-b border-border/10">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-black shadow-inner">
                    {roomForm.number}
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase opacity-40 tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t(`rooms.types.${roomForm.type}`)}</p>
                    <Badge variant="outline" className="mt-1 h-5 text-[8px] font-black uppercase border-primary/20 text-primary tracking-[0.02em]" style={{ wordSpacing: '0.12em' }}>
                      {t('rooms.status.' + roomForm.status)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'available', icon: CheckCircle2, color: 'bg-emerald-500', hover: 'hover:bg-emerald-600', light: 'bg-emerald-500/10', text: 'text-emerald-600', label: 'rooms.modal.available_btn' },
                    { id: 'cleaning', icon: Clock, color: 'bg-amber-500', hover: 'hover:bg-amber-600', light: 'bg-amber-500/10', text: 'text-amber-600', label: 'rooms.modal.cleaning_btn' },
                    { id: 'maintenance', icon: Hammer, color: 'bg-red-500', hover: 'hover:bg-red-600', light: 'bg-red-500/10', text: 'text-red-600', label: 'rooms.modal.maintenance_btn' },
                    { id: 'out_of_service', icon: X, color: 'bg-slate-700', hover: 'hover:bg-slate-800', light: 'bg-slate-500/10', text: 'text-slate-700', label: 'rooms.modal.out_of_service_btn' }
                  ].map((action) => (
                    <button
                      key={action.id}
                      onClick={() => {
                        handleSaveRoom({...roomForm, status: action.id as any});
                      }}
                      className={cn(
                        "h-12 w-full rounded-xl border-[1.5px] font-black text-[10px] uppercase flex items-center justify-between px-5 transition-all group tracking-[0.02em]",
                        roomForm.status === action.id
                          ? `${action.color} text-white border-transparent shadow-lg scale-[1.02]`
                          : `${action.light} ${action.text} border-transparent hover:brightness-95 opacity-80 hover:opacity-100`
                      )}
                      style={{ wordSpacing: '0.18em' }}
                    >
                      <div className="flex items-center gap-3">
                        <action.icon size={14} />
                        {t(action.label)}
                      </div>
                      {roomForm.status === action.id }
                    </button>
                  ))}
                </div>
                
                <button onClick={() => setIsManageModalOpen(false)} className="w-full h-10 bg-muted/10 rounded-xl font-black text-[9px] uppercase tracking-[0.18em] opacity-40 hover:opacity-100 transition-all outline-none" style={{ wordSpacing: '0.18em' }}>
                  {t('common.cancel')}
                </button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function RoomsPage() {
  return <Suspense fallback={<Loader2 className="animate-spin" />}><RoomsContent /></Suspense>;
}
