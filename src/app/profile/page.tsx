"use client"

import React, { useState, useEffect, useRef } from 'react';
import { usePortal } from '@/components/portal-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, Mail, Globe, Heart, Phone, LogOut,
  Edit, Fingerprint, Save, X, Clock, ShieldCheck, Lock, Key, Gem, TrendingUp, Wallet, Image as ImageIcon, Camera, Trash2, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { LoadingScreen } from '@/components/shared/loading-screen';
import { useToast } from '@/hooks/use-toast';
import { PortalNav } from '@/components/shared/portal-nav';
import { ExecutiveSilhouette } from '@/components/shared/horizon-logo';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import placeholderImagesData from '@/lib/placeholder-images.json';
const placeholderImages = placeholderImagesData.placeholderImages;

const Field = ({ 
  icon: Icon, 
  label, 
  value, 
  editable = false, 
  type = 'text', 
  fieldKey, 
  options, 
  className,
  isEditing,
  formData,
  setFormData,
  t,
  isRTL
}: any) => {
  let displayValue = value || '';
  if (fieldKey === 'maritalStatus' && value) displayValue = t(`auth.status_${value}`);
  else if (fieldKey === 'gender' && value) displayValue = value === 'male' ? t('auth.gender_male') : t('auth.gender_female');
  else if (fieldKey === 'nationality' && value) displayValue = t(`country.${value}`);

  const fieldBorder = "border-inner border-[1.2px]";

  return (
    <motion.div layout className={cn("flex flex-col gap-0.5 group w-full", className)}>
      <Label className="text-[10px] font-black uppercase tracking-[0.02em] opacity-30 flex items-center gap-1.5 mb-0.5 w-full text-start" style={{ wordSpacing: '0.18em' }}>
        <Icon size={10} className="text-primary" /> <span>{label}</span>
      </Label>
      <div className="relative h-9">
        <AnimatePresence mode="wait">
          {isEditing && editable ? (
            <motion.div key="edit" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="w-full h-full">
              {type === 'select' ? (
                <Select value={formData[fieldKey]} onValueChange={(v) => setFormData({ ...formData, [fieldKey]: v })}>
                  <SelectTrigger className={cn("h-9 w-full rounded-[10px] bg-muted/5 font-bold text-[10px] outline-none", fieldBorder)}><SelectValue /></SelectTrigger>
                  <SelectContent className="border-outer rounded-[18px] shadow-2xl z-[200]">{options.map((opt: any) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
                </Select>
              ) : (
                <Input 
                  value={formData[fieldKey] || ''} 
                  onChange={(e) => {
                    let val = e.target.value;
                    if (fieldKey === 'phone') {
                      val = val.replace(/[^\d+]/g, '');
                    }
                    setFormData({ ...formData, [fieldKey]: val });
                  }} 
                  className={cn("h-9 w-full rounded-[10px] bg-muted/5 text-[10px] font-bold shadow-none", fieldBorder, isRTL ? "text-right" : "text-left")} 
                />
              )}
            </motion.div>
          ) : (
            <motion.div key="view" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className={cn("h-9 w-full flex items-center px-3 rounded-[10px] transition-all text-start", fieldBorder, (isEditing && !editable) ? "bg-muted/5 opacity-40 grayscale" : "bg-muted/5 group-hover:bg-muted/10")}>
              <span className="text-[10px] font-black truncate tracking-[0.02em]" style={{ wordSpacing: '0.12em' }}>{displayValue}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default function ProfilePage() {
  const { user, setUser, isRTL, t, mounted: isHydrated, setIsLogoutDialogOpen } = usePortal();
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isAvatarSelectorOpen, setIsAvatarSelectorOpen] = useState(false);
  
  const [formData, setFormData] = useState<any>({});

  const isStaff = user?.role === 'staff';

  useEffect(() => {
    if (isHydrated && !isEditing) {
      if (!user) router.push('/');
      else setFormData(user);
    }
  }, [user, router, isHydrated, isEditing]);

  const handleUpdateProfile = () => {
    if (isStaff) return;
    setIsSaving(true);
    setTimeout(() => {
      const updatedUser = { 
        ...user, 
        email: formData.email, 
        phone: formData.phone, 
        maritalStatus: formData.maritalStatus
      };
      setUser(updatedUser as any);
      setIsSaving(false);
      setIsEditing(false);
      toast({ title: t('profile.update_success') });
    }, 1200);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData(user);
    setImgError(false);
  };

  const handleAvatarSelect = (url: string) => {
    if (isStaff) return;
    const updatedUser = { ...user, avatar: url };
    setUser(updatedUser as any);
    setIsAvatarSelectorOpen(false);
    setImgError(false);
    toast({ title: t('profile.update_success') });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isStaff) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        const updatedUser = { ...user, avatar: url };
        setUser(updatedUser as any);
        setIsAvatarSelectorOpen(false);
        setImgError(false);
        toast({ title: t('profile.update_success') });
      };
      reader.readAsDataURL(file);
    }
  };

  const premiumRadius = "rounded-[9px]";

  if (!isHydrated || !user) return <LoadingScreen />;

  const displayAvatar = user?.avatar;
  const useSilhouette = !displayAvatar || displayAvatar === "default-silhouette" || imgError;

  return (
    <div className="min-h-screen bg-background portal-transition-bg overflow-x-hidden pb-32 lg:pb-20">
      <PortalNav />
      <div className="container mx-auto px-4 pt-32 pb-12">
        <div className="max-w-[1100px] mx-auto space-y-10 flex flex-col items-center">
          <header className="flex flex-col md:flex-row items-center justify-between gap-6 px-4 w-full max-w-[940px]">
             <div className={cn("flex flex-col md:flex-row items-center gap-6", isRTL ? "md:flex-row-reverse" : "md:flex-row")}>
                <div className="relative">
                  {!isStaff && <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />}
                  <div 
                    onClick={() => !isStaff && isEditing && setIsAvatarSelectorOpen(true)} 
                    className={cn(
                      "w-24 h-24 rounded-[32px] border-[1.5px] shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-500 relative bg-zinc-950",
                      (!isStaff && isEditing) 
                        ? "cursor-pointer hover:scale-[1.05] border-primary shadow-primary/20" 
                        : "cursor-default border-zinc-200 dark:border-zinc-800"
                    )}
                  >
                    {!useSilhouette ? <img src={displayAvatar} onError={() => setImgError(true)} className="w-full h-full object-cover" alt="" /> : <ExecutiveSilhouette />}
                    
                    <AnimatePresence>
                      {!isStaff && isEditing && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px] transition-opacity"
                        >
                          <Camera className="text-white animate-pulse" size={24} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className={cn("flex flex-col justify-center items-start text-start")}>
                  <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight">{t('profile.title')}</h1>
                  
                  <div className="flex flex-col mt-1">
                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.02em] block leading-none mb-1.5" style={{ wordSpacing: '0.18em' }}>
                      {t('profile.guest_type')}
                    </p>
                    
                    {isStaff && (
                      <div className="flex items-center gap-1.5 text-primary/70">
                        <ShieldCheck size={11} />
                        <span className="text-[8.5px] font-black uppercase tracking-[0.1em] leading-none">
                          {t('profile.managed_by_admin')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
             </div>
             <button onClick={() => setIsLogoutDialogOpen(true)} className="h-9 px-5 bg-destructive/5 text-destructive font-black text-[9px] uppercase rounded-[18px] border border-destructive/20 hover:bg-destructive hover:text-white transition-all flex items-center gap-2 outline-none tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>
                <LogOut size={13} /> {t('profile.logout_btn')}
             </button>
          </header>

          <div className="flex flex-col md:flex-row lg:grid lg:grid-cols-12 gap-6 lg:gap-8 w-full items-start">
            <div className="w-full md:w-[69%] lg:w-auto lg:col-span-8 space-y-8">
              <Card className="rounded-[32px] border-outer shadow-none bg-card/60 backdrop-blur-3xl overflow-hidden relative h-auto md:h-[445px]">
                <AnimatePresence>{isSaving && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-white/40 dark:bg-black/40 backdrop-blur-md flex items-center justify-center rounded-[32px]"><div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></motion.div>)}</AnimatePresence>
                <CardContent className="px-6 md:px-10 pb-8 pt-12 relative">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-4">
                    <Field icon={User} label={t('auth.fullname')} value={formData.name} editable={false} isEditing={isEditing} formData={formData} setFormData={setFormData} t={t} isRTL={isRTL} className="col-span-2 md:col-span-1" />
                    <Field icon={Fingerprint} label={t('auth.id_number')} value={formData.identity} editable={false} isEditing={isEditing} formData={formData} setFormData={setFormData} t={t} isRTL={isRTL} className="col-span-1 md:col-span-1" />
                    <Field icon={Phone} label={t('auth.phone')} value={formData.phone} editable={!isStaff} fieldKey="phone" isEditing={isEditing} formData={formData} setFormData={setFormData} t={t} isRTL={isRTL} className="col-span-1 md:col-span-1" />
                    <Field icon={Globe} label={t('auth.nationality')} value={formData.nationality} editable={false} fieldKey="nationality" isEditing={isEditing} formData={formData} setFormData={setFormData} t={t} isRTL={isRTL} className="col-span-1 md:col-span-1" />
                    <Field icon={User} label={t('auth.gender')} value={formData.gender} editable={false} fieldKey="gender" isEditing={isEditing} formData={formData} setFormData={setFormData} t={t} isRTL={isRTL} className="col-span-1 md:col-span-1" />
                    <Field icon={Heart} label={t('auth.marital_status')} value={formData.maritalStatus} editable={!isStaff} fieldKey="maritalStatus" type="select" options={[{label: t('auth.status_single'), value:'single'}, {label: t('auth.status_married'), value:'married'}, {label: t('auth.status_divorced'), value:'divorced'}]} isEditing={isEditing} formData={formData} setFormData={setFormData} t={t} isRTL={isRTL} className="col-span-1 md:col-span-1" />
                    <Field icon={Clock} label={t('auth.birth_date')} value={(formData.birthDay && formData.birthMonth && formData.birthYear) ? `${formData.birthDay}/${formData.birthMonth}/${formData.birthYear}` : ''} editable={false} isEditing={isEditing} formData={formData} setFormData={setFormData} t={t} isRTL={isRTL} className="col-span-1 md:col-span-1" />
                    <Field icon={Mail} label={t('auth.email')} value={formData.email} editable={!isStaff} fieldKey="email" className="col-span-2 md:col-span-2" isEditing={isEditing} formData={formData} setFormData={setFormData} t={t} isRTL={isRTL} />
                  </div>
                  
                  {!isStaff && (
                    <div className="pt-10 border-t border-border/10 mt-10">
                      <AnimatePresence mode="wait">
                        {isEditing ? (
                          <div key="edit-btns" className="flex gap-4 w-full">
                            <button onClick={handleCancelEdit} className="flex-1 h-9 rounded-[15px] font-black text-foreground/60 bg-muted/10 border-inner hover:bg-muted/20 transition-all flex items-center justify-center gap-2 outline-none tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}><X size={15} /> {t('profile.cancel_btn')}</button>
                            <button onClick={handleUpdateProfile} className="flex-[2] h-9 rounded-[15px] bg-primary text-white font-black text-[10px] shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 outline-none tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}><Save size={15} /> {t('profile.save_btn')}</button>
                          </div>
                        ) : (
                          <button key="view-btn" onClick={() => setIsEditing(true)} className="w-full h-9 bg-primary/10 text-primary border border-primary/20 font-black text-[10px] rounded-[15px] hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-3 group outline-none tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}><Edit size={16} /> {t('profile.edit_btn')}</button>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {isStaff && (
                    <div className="mt-12 pt-6 border-t border-border/10 flex items-center justify-center gap-3 opacity-30 grayscale pointer-events-none">
                      <ShieldAlert size={14} className="text-primary" />
                      <p className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ wordSpacing: '0.18em' }}>{t('profile.managed_by_admin')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="w-full md:w-[30%] lg:w-auto lg:col-span-4">
              <Card className="rounded-[32px] border-outer bg-card/60 backdrop-blur-3xl overflow-hidden relative shadow-2xl h-[445px]">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/30" />
                <CardHeader className="pb-2"><CardTitle className="text-[11px] font-black uppercase tracking-[0.18em] flex items-center gap-2 opacity-40 justify-start" style={{ wordSpacing: '0.18em' }}><Gem size={14} className="text-primary" /> {t('profile.points_title')}</CardTitle></CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div className="flex flex-col items-center justify-center py-4 space-y-4">
                    <div className="relative"><div className="w-28 h-28 rounded-full border-4 border-primary/10 flex items-center justify-center"><Wallet size={36} className="text-primary opacity-40" /></div><div className="absolute inset-0 border-t-4 border-primary rounded-full animate-[spin_3s_linear_infinite]" /></div>
                    <div className="text-center"><p className="text-4xl font-black text-primary tracking-tighter">4,850</p><p className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-40" style={{ wordSpacing: '0.18em' }}>{t('profile.points_balance')}</p></div>
                  </div>
                  <div className="space-y-3 pt-6 border-t border-border/10">
                    <div className={cn("flex justify-between items-center bg-primary/5 p-3 rounded-[12px] border-inner", isRTL ? "flex-row-reverse" : "flex-row")}>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-70 tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}><TrendingUp size={12} className="text-primary" /> {t('profile.points_level')}</div>
                      <Badge className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-lg shadow-sm tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('profile.points_gold')}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isAvatarSelectorOpen} onOpenChange={setIsAvatarSelectorOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 z-[600] bg-black/60 backdrop-blur-sm" />
          <DialogContent 
            style={{ width: '450px', maxWidth: '450px', height: 'auto', maxHeight: '90vh' }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[601] p-0 border-outer rounded-[24px] bg-card/95 backdrop-blur-3xl shadow-2xl overflow-hidden flex flex-col outline-none w-[95%]"
          >
            <DialogHeader className="p-6 bg-primary/5 border-b border-border/10 shrink-0">
              <DialogTitle className="text-[14px] font-black uppercase tracking-[0.18em] text-primary text-center flex items-center justify-center gap-3" style={{ wordSpacing: '0.18em' }}>
                <Camera size={20} /> {t('auth.avatar_modal_title')}
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 p-8 space-y-8 overflow-hidden flex flex-col items-center justify-center">
              <div className="space-y-4 w-full">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className={cn("w-full h-20 border-2 border-dashed border-primary/20 bg-primary/5 rounded-[20px] flex flex-col items-center justify-center gap-2 hover:bg-primary/10 transition-all text-primary outline-none", premiumRadius)}
                >
                  <ImageIcon size={24} className="opacity-60" />
                  <span className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('auth.upload_from_device')}</span>
                </button>
              </div>

              <div className="space-y-4 w-full">
                <p className="text-[9px] font-black uppercase opacity-40 text-center tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('auth.select_preset_avatar')}</p>
                <div className="grid grid-cols-5 gap-3 justify-items-center">
                  {placeholderImages.map((img, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleAvatarSelect(img.imageUrl)}
                      className={cn(
                        "aspect-square w-14 h-14 rounded-[10px] overflow-hidden border-[1.5px] cursor-pointer transition-all hover:scale-110 relative group bg-zinc-950 border-border/10",
                        user?.avatar === img.imageUrl ? "border-primary shadow-lg shadow-primary/20" : "hover:border-primary/40"
                      )}
                    >
                      <img src={img.imageUrl} className="w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <CheckCircle2 className="text-white" size={20} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-primary/5 border-t border-border/10 flex justify-center gap-3 shrink-0">
              <button 
                type="button"
                onClick={() => handleAvatarSelect("")}
                className={cn("h-10 px-8 bg-red-500/10 text-red-500 font-black text-[10px] uppercase tracking-[0.18em] rounded-[12px] hover:bg-red-500 hover:text-white transition-all outline-none border border-red-500/20", premiumRadius)}
                style={{ wordSpacing: '0.18em' }}
              >
                <div className="flex items-center gap-2">
                  <Trash2 size={14} />
                  {t('auth.remove_photo')}
                </div>
              </button>
              <button onClick={() => setIsAvatarSelectorOpen(false)} className="h-10 px-8 bg-muted/10 text-foreground/40 font-black text-[10px] uppercase tracking-[0.18em] rounded-[12px] hover:bg-muted/20 transition-all outline-none border border-border/40" style={{ wordSpacing: '0.18em' }}>
                {t('common.cancel')}
              </button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
