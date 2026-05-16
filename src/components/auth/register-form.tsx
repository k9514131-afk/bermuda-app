"use client"

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { usePortal } from '@/components/portal-provider';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, User, Fingerprint, Mail, Camera, Loader2, Phone, Globe, Calendar as CalendarIcon, Heart, CheckCircle2, Plus, Minus, AlertCircle, Image as ImageIcon, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ExecutiveSilhouette } from '@/components/shared/horizon-logo';
import { countryCodes } from '@/lib/translations/countries';
import { motion, AnimatePresence } from 'framer-motion';
import { apiRequest } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import placeholderImagesData from '@/lib/placeholder-images.json';
const placeholderImages = placeholderImagesData.placeholderImages;

export function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const { isRTL, t } = usePortal();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({ 
    name: "", identity: "", email: "", phone: "", password: "", confirmPassword: "", 
    maritalStatus: "", birthDay: "", birthMonth: "", birthYear: "", 
    gender: "", nationality: ""
  });
  
  const [avatarPreview, setAvatarPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCustomSuccess, setShowCustomSuccess] = useState(false);
  const [isNationalityModalOpen, setIsNationalityModalOpen] = useState(false);
  const [isAvatarSelectorOpen, setIsAvatarSelectorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const calculatedAge = useMemo(() => {
    if (!formData.birthDay || !formData.birthMonth || !formData.birthYear) return null;
    try {
      const d = parseInt(formData.birthDay);
      const m = parseInt(formData.birthMonth);
      const y = parseInt(formData.birthYear);
      if (isNaN(d) || isNaN(m) || isNaN(y)) return null;

      const birthDate = new Date(y, m - 1, d);
      const today = new Date();
      if (birthDate > today) return null;

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
      
      if (age < 0 || age > 120) return null;
      return age;
    } catch (e) {
      return null;
    }
  }, [formData.birthDay, formData.birthMonth, formData.birthYear]);

  const ageThreshold = formData.maritalStatus === 'married' ? 18 : 21;
  const isAgeValid = calculatedAge !== null && calculatedAge >= ageThreshold;

  const dynamicMaxYear = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const baseYear = 2026;
    const baseMax = 2050;
    const cycles = Math.floor((currentYear - baseYear) / 5);
    return baseMax + (cycles > 0 ? cycles * 5 : 0);
  }, []);

  const filteredCountries = useMemo(() => {
    if (!searchTerm.trim()) return countryCodes;
    return countryCodes.filter(c => 
      t(`country.${c}`).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { toast({ variant: "destructive", title: t('auth.password_mismatch') }); return; }
    if (!isAgeValid) { 
      toast({ 
        variant: "destructive", 
        title: isRTL ? "عذراً، العمر غير مطابق لشروط التسجيل" : "Sorry, age does not meet requirements" 
      }); 
      return; 
    }

    setLoading(true);
    try {
      await apiRequest('/register', { method: 'POST', body: JSON.stringify({ ...formData, avatar: avatarPreview, role: 'customer' }) });
      setLoading(false);
      setShowCustomSuccess(true);
      setTimeout(() => { setShowCustomSuccess(false); if (onSuccess) onSuccess(); }, 2000);
    } catch (error: any) {
      setLoading(false);
      toast({ variant: "destructive", title: t('auth.error_msg') });
    }
  };

  const handleAvatarSelect = (url: string) => {
    setAvatarPreview(url);
    setIsAvatarSelectorOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setIsAvatarSelectorOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const premiumRadius = "rounded-[9px]";
  const labelClass = "text-[11px] font-black uppercase opacity-40 px-1 flex items-center gap-2.5 w-full text-start justify-start tracking-[0.02em]";
  const inputBorderClass = "border-[#2a90b5]/20 focus:border-[#2a90b5]/30 focus-within:border-[#2a90b5]/30";

  return (
    <div className="w-full flex flex-col items-center relative">
      <AnimatePresence>
        {showCustomSuccess && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] flex items-center justify-center pointer-events-none">
            <div className="w-[300px] h-auto py-10 rounded-[15px] border border-green-500/40 bg-black/30 backdrop-blur-md flex flex-col items-center justify-center gap-4 text-green-500/40 shadow-2xl">
              <CheckCircle2 size={64} />
              <span className="text-sm font-black uppercase tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('register.success_tag')}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn("w-full mx-auto border-inner bg-muted/5 h-[270px] overflow-y-auto clean-scrollbar px-4 py-4 mt-[65px] translate-y-[-15px]", premiumRadius)}>
        <form id="reg-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <div 
              onClick={() => setIsAvatarSelectorOpen(true)} 
              className={cn("w-14 h-14 border-[1.2px] bg-zinc-950 overflow-hidden shadow-xl relative cursor-pointer", premiumRadius, inputBorderClass)}
            >
              {avatarPreview ? <img src={avatarPreview} className="w-full h-full object-cover" alt="" /> : <ExecutiveSilhouette />}
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"><Camera size={14} className="text-white" /></div>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-x-4 md:gap-x-10 gap-y-5">
            
            <div className="col-span-2 md:col-span-3 order-1 md:order-1 space-y-1">
              <Label className={labelClass} style={{ wordSpacing: '0.18em' }}><User size={14} className="text-primary/60" /> {t('auth.fullname')}</Label>
              <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={cn("h-10 text-[10px] font-bold bg-transparent border-[1.2px]", premiumRadius, inputBorderClass)} />
            </div>

            <div className="col-span-2 md:col-span-3 order-2 md:order-2 space-y-1">
              <Label className={labelClass} style={{ wordSpacing: '0.18em' }}><Fingerprint size={14} className="text-primary/60" /> {t('auth.id_number')}</Label>
              <Input required value={formData.identity} onChange={e => setFormData({...formData, identity: e.target.value})} className={cn("h-10 text-[10px] font-bold bg-transparent border-[1.2px]", premiumRadius, inputBorderClass)} />
            </div>

            <div className="col-span-2 md:col-span-6 order-3 md:order-5 space-y-1">
              <Label className={labelClass} style={{ wordSpacing: '0.18em' }}><Mail size={14} className="text-primary/60" /> {t('auth.email')}</Label>
              <Input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={cn("h-10 text-[10px] font-bold bg-transparent border-[1.2px]", premiumRadius, inputBorderClass)} />
            </div>

            <div className="col-span-1 md:col-span-3 order-4 md:order-3 space-y-1">
              <Label className={labelClass} style={{ wordSpacing: '0.18em' }}><Phone size={14} className="text-primary/60" /> {t('auth.phone')}</Label>
              <Input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value.replace(/[^\d+]/g, '')})} className={cn("h-10 text-[10px] font-bold bg-transparent border-[1.2px]", premiumRadius, inputBorderClass)} />
            </div>

            <div className="col-span-1 md:col-span-2 order-4 md:order-7 space-y-1">
              <Label className={labelClass} style={{ wordSpacing: '0.18em' }}><Globe size={14} className="text-primary/60" /> {t('auth.nationality')}</Label>
              <div 
                onClick={() => setIsNationalityModalOpen(true)}
                className={cn(
                  "h-10 w-full rounded-[9px] border-[1.2px] bg-transparent px-3 flex items-center justify-between cursor-pointer text-[9px] font-bold transition-all hover:bg-muted/5",
                  premiumRadius, inputBorderClass
                )}
              >
                <span className={cn("truncate", !formData.nationality && "opacity-30")}>
                  {formData.nationality ? t(`country.${formData.nationality}`) : t('auth.nationality_placeholder')}
                </span>
                <Globe size={10} className="text-primary opacity-40" />
              </div>
            </div>

            <div className="col-span-2 md:col-span-3 order-5 md:order-4 space-y-1">
              <Label className={labelClass} style={{ wordSpacing: '0.18em' }}><CalendarIcon size={14} className="text-primary/60" /> {t('auth.birth_date')}</Label>
              <div className="flex gap-2 w-full items-start">
                <motion.div 
                  layout
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={cn(
                    "flex gap-1 p-1 transition-all duration-500 overflow-hidden bg-muted/5 shadow-none border-[1.2px]",
                    premiumRadius, inputBorderClass
                  )}
                  style={{ width: calculatedAge !== null ? "86%" : "100%" }}
                >
                  <Select value={formData.birthDay} onValueChange={v => setFormData({...formData, birthDay: v})}>
                    <SelectTrigger className="h-8 flex-1 text-[9px] font-bold border-transparent bg-transparent shadow-none px-2 focus:border-none [&_svg]:opacity-100">
                      <SelectValue placeholder={t('auth.day')} />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom" className="max-h-[200px] w-[var(--radix-select-trigger-width)] overflow-y-auto">
                      {Array.from({length:31},(_,i)=>i+1).map(d=><SelectItem key={d} value={d.toString()}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={formData.birthMonth} onValueChange={v => setFormData({...formData, birthMonth: v})}>
                    <SelectTrigger className="h-8 flex-1 text-[9px] font-bold border-transparent bg-transparent shadow-none px-2 focus:border-none [&_svg]:opacity-100">
                      <SelectValue placeholder={t('auth.month')} />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom" className="max-h-[200px] w-[var(--radix-select-trigger-width)] overflow-y-auto">
                      {Array.from({length:12},(_,i)=>i+1).map(m=><SelectItem key={m} value={m.toString()}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={formData.birthYear} onValueChange={v => setFormData({...formData, birthYear: v})}>
                    <SelectTrigger className="h-8 flex-1 text-[9px] font-bold border-transparent bg-transparent shadow-none px-2 focus:border-none [&_svg]:opacity-100">
                      <SelectValue placeholder={t('auth.year')} />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom" className="max-h-[200px] w-[var(--radix-select-trigger-width)] overflow-y-auto">
                      {Array.from({length:120},(_,i)=>dynamicMaxYear-i).map(y=><SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </motion.div>
                <AnimatePresence>
                  {calculatedAge !== null && (
                    <motion.div
                      initial={{ opacity: 0, width: 0, scale: 0.8 }}
                      animate={{ opacity: 1, width: "14%", scale: 1 }}
                      exit={{ opacity: 0, width: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className={cn(
                        "h-[42px] flex items-center justify-center border-[1.2px] transition-all duration-500 overflow-hidden shrink-0",
                        premiumRadius,
                        isAgeValid 
                          ? "border-green-500/50 bg-green-500/5 text-green-600 shadow-[inset_0_0_10px_rgba(34,197,94,0.15)]" 
                          : "border-red-500/50 bg-red-500/5 text-red-600 shadow-[inset_0_0_10px_rgba(239,68,68,0.15)]"
                      )}
                    >
                      <span className="text-[9px] font-black uppercase tracking-tighter text-center leading-none px-1">
                        {isAgeValid ? `${calculatedAge} ${t('register.years_label')}` : t('register.denied_tag')}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 order-6 md:order-8 space-y-1">
              <Label className={labelClass} style={{ wordSpacing: '0.18em' }}><Heart size={14} className="text-primary/60" /> {t('auth.marital_status')}</Label>
              <Select value={formData.maritalStatus} onValueChange={v => setFormData({...formData, maritalStatus: v})}>
                <SelectTrigger className={cn("h-10 text-[9px] font-bold bg-transparent border-[1.2px]", premiumRadius, inputBorderClass)}>
                  <SelectValue placeholder={t('auth.marital_status_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">{t('auth.status_single')}</SelectItem>
                  <SelectItem value="married">{t('auth.status_married')}</SelectItem>
                  <SelectItem value="divorced">{t('auth.status_divorced')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-1 md:col-span-2 order-6 md:order-6 space-y-1">
              <Label className={labelClass} style={{ wordSpacing: '0.18em' }}><User size={14} className="text-primary/60" /> {t('auth.gender')}</Label>
              <Select value={formData.gender} onValueChange={v => setFormData({...formData, gender: v})}>
                <SelectTrigger className={cn("h-10 text-[9px] font-bold bg-transparent border-[1.2px]", premiumRadius, inputBorderClass)}>
                  <SelectValue placeholder={t('auth.gender_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{t('auth.gender_male')}</SelectItem>
                  <SelectItem value="female">{t('auth.gender_female')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-1 md:col-span-3 order-7 md:order-9 space-y-1">
              <Label className={labelClass} style={{ wordSpacing: '0.18em' }}>{t('auth.password')}</Label>
              <div className={cn("relative group bg-transparent overflow-hidden border-[1.2px] transition-all", premiumRadius, inputBorderClass)}>
                <Input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  className={cn("h-10 text-[10px] font-bold bg-transparent border-none shadow-none px-4", isRTL ? "pl-10" : "pr-10")} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className={cn("absolute top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity", isRTL ? "left-3" : "right-3")}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="col-span-1 md:col-span-3 order-7 md:order-10 space-y-1">
              <Label className={labelClass} style={{ wordSpacing: '0.18em' }}>{t('auth.confirm_password')}</Label>
              <div className={cn("relative group bg-transparent overflow-hidden border-[1.2px] transition-all", premiumRadius, inputBorderClass)}>
                <Input 
                  type={showConfirmPassword ? "text" : "password"} 
                  required 
                  value={formData.confirmPassword} 
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                  className={cn("h-10 text-[10px] font-bold bg-transparent border-none shadow-none px-4", isRTL ? "pl-10" : "pr-10")} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  className={cn("absolute top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity", isRTL ? "left-3" : "right-3")}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

          </div>
        </form>
      </div>
      
      <div className="w-full md:px-[100px] pb-4 pt-2 translate-y-[-10px] flex justify-center">
        <Button 
          form="reg-form" 
          type="submit" 
          disabled={loading} 
          className={cn(
            "w-fit px-[15px] h-[38px] bg-primary text-white font-black text-[11px] uppercase tracking-[0.18em] shadow-xl hover:brightness-110 active:scale-[0.98] transition-all border-b-4 border-primary/30 outline-none", 
            premiumRadius
          )}
          style={{ wordSpacing: '0.18em' }}
        >
          {loading ? <Loader2 className="animate-spin" /> : <div className="flex items-center gap-2"><UserPlus size={18} /><span>{t('auth.submit_register')}</span></div>}
        </Button>
      </div>

      <Dialog open={isNationalityModalOpen} onOpenChange={(open) => { setIsNationalityModalOpen(open); if(!open) setSearchTerm(""); }}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 z-[600] bg-black/60 backdrop-blur-sm" />
          <DialogContent 
            style={{ width: '340px', height: '80vh', maxWidth: '340px', maxHeight: '80vh' }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[601] p-0 border-outer rounded-[24px] bg-card/95 backdrop-blur-3xl shadow-2xl overflow-hidden flex flex-col outline-none"
          >
            <DialogHeader className="p-4 pt-[10px] bg-primary/5 border-b border-border/10 shrink-0">
              <DialogTitle className="text-[12px] font-black uppercase tracking-[0.18em] text-primary text-center mb-4" style={{ wordSpacing: '0.18em' }}>
                {t('auth.nationality')}
              </DialogTitle>
              <div className="relative group px-[15px]">
                <Input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('auth.search_country')}
                  className={cn(
                    "h-9 bg-muted/10 border-inner text-[10px] font-bold rounded-[12px]",
                    isRTL ? "pr-9" : "pl-9"
                  )}
                />
                <Search size={14} className={cn("absolute top-1/2 -translate-y-1/2 opacity-30 text-primary", isRTL ? "right-7" : "left-7")} />
              </div>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pt-[10px] pl-[10px] pr-[10px] pb-[20px] space-y-1.5 clean-scrollbar">
              <AnimatePresence mode="popLayout">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map(c => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={c} 
                      onClick={() => { 
                        setFormData({...formData, nationality: c}); 
                        setIsNationalityModalOpen(false); 
                      }}
                      className={cn(
                        "w-full p-3 rounded-[13px] text-[10px] font-bold cursor-pointer transition-all text-start border-[1.2px]",
                        formData.nationality === c 
                          ? "bg-primary/20 border-primary text-primary shadow-inner" 
                          : "hover:bg-primary/5 border-transparent hover:border-primary/20 text-foreground/70"
                      )}
                    >
                      {t(`country.${c}`)}
                    </motion.div>
                  ))
                ) : (
                  <div className="py-20 text-center opacity-30 flex flex-col items-center gap-3">
                    <Search size={32} />
                    <span className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ wordSpacing: '0.18em' }}>{t('reception.no_results')}</span>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>

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
                        avatarPreview === img.imageUrl ? "border-primary shadow-lg shadow-primary/20" : "hover:border-primary/40"
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
                onClick={() => { setAvatarPreview(""); setIsAvatarSelectorOpen(false); }}
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
