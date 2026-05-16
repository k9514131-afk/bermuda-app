
"use client"

import React, { useState, useEffect, useRef } from 'react';
import { usePortal } from '@/components/portal-provider';
import {
  LayoutDashboard, Home, User, LogOut, Bed, Sun, Moon,
  ClipboardList, Bell, FileText, Globe, Check, Heart, Layers, Menu, ArrowRight,
  ChevronLeft, ChevronRight, BarChart3
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { EgyptianHorizonLogo } from './horizon-logo';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

/**
 * @fileOverview النافبار الملكي الموحد - Bermuda Nav Center
 * تم التحديث: حصر زر الإحصائيات داخل صفحة السجل فقط وإزالته من كافة أشرطة التنقل.
 */
export function PortalNav() {
  const {
    user, setUser, theme, setTheme, language, setLanguage,
    mounted, t, isRTL, isNavVisible, setIsNavVisible,
    notifications, clearNotifications, isLogoutDialogOpen, setIsLogoutDialogOpen,
    isBackGuardOpen, setIsBackGuardOpen,
    wishlist, compareList
  } = usePortal();
  const router = useRouter();
  const pathname = usePathname();

  const lastScrollY = useRef(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);

  const isAuthPage = pathname === '/' && !user || pathname?.includes('/login') || pathname === '/reset-password';

  // 🛡️ محرك حماية التنقل المطور
  useEffect(() => {
    if (!mounted || !user) return;

    const isStaff = user.role === 'staff';
    const isCustomer = user.role === 'customer';

    const isRegistryHub = (isStaff && pathname === '/dashboard') || (isCustomer && pathname === '/customer');

    const isStaffInternal = isStaff && (
      pathname === '/walk-in' ||
      pathname === '/rooms' ||
      pathname === '/audit-logs' ||
      pathname === '/reports' ||
      pathname === '/profile' ||
      pathname?.startsWith('/invoice/')
    );

    if (!isRegistryHub && !isStaffInternal) return;

    const pushTrap = () => {
      if (typeof window !== 'undefined' && !(window.history.state && window.history.state.trap)) {
        window.history.pushState({ trap: true }, "", window.location.href);
      }
    };

    pushTrap();

    const handlePopState = (event: PopStateEvent) => {
      if (isRegistryHub) {
        window.history.pushState({ trap: true }, "", window.location.href);
        setIsBackGuardOpen(true);
      } else if (isStaffInternal) {
        router.push('/dashboard');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [mounted, user, pathname, setIsBackGuardOpen, router]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      let nextVisible = isNavVisible;
      if (currentScrollY < lastScrollY.current || currentScrollY < 50) nextVisible = true;
      else if (currentScrollY > lastScrollY.current && currentScrollY > 100) nextVisible = false;
      if (nextVisible !== isNavVisible) setIsNavVisible(nextVisible);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isNavVisible, setIsNavVisible]);

  // تحديث: إزالة الإحصائيات من القائمة العلوية للموظف
  const navItems = user?.role === 'staff' ? [
    { id: 'dashboard', icon: LayoutDashboard, label: t('nav.bookings'), path: '/dashboard' },
    { id: 'rooms', icon: Bed, label: t('nav.rooms'), path: '/rooms' },
    { id: 'audit', icon: FileText, label: t('nav.audit_logs'), path: '/audit-logs' },
    { id: 'profile', icon: User, label: t('nav.profile'), path: '/profile' },
  ] : [
    { id: 'home', icon: Home, label: t('nav.home'), path: '/customer' },
    { id: 'bookings', icon: ClipboardList, label: t('nav.bookings'), path: '/customer/dashboard' },
    { id: 'profile', icon: User, label: t('nav.profile'), path: '/profile' },
  ];

  const languages = [
    { code: 'ar', label: 'العربية', flag: '🇪🇬' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ];

  const handleLogout = () => {
    const role = user?.role;
    setIsLogoutDialogOpen(false);
    setUser(null);
    localStorage.removeItem('bermuda_token');
    if (role === 'staff') router.push('/employee/login');
    else router.push('/customer/login');
  };

  const handleConfirmExitPage = () => {
    const role = user?.role;
    setIsBackGuardOpen(false);
    setUser(null);
    localStorage.removeItem('bermuda_token');
    if (role === 'staff') router.push('/employee/login');
    else router.push('/customer/login');
  };

  const actionButtonStyle = "w-10 h-10 rounded-[11px] bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all border border-primary/20 outline-none shadow-sm shrink-0";
  const navBorderColor = theme === 'dark' ? '204, 176, 73' : '99, 98, 94';

  const NotificationGroup = ({ className, showLabel = false }: { className?: string; showLabel?: boolean }) => (
    <Popover>
      <PopoverTrigger asChild>
        <button className={cn(actionButtonStyle, className, showLabel && "h-16 flex-col gap-2")}>
          <div className="relative">
            <Bell size={showLabel ? 20 : 18} className={cn(showLabel ? "text-amber-500/70" : "text-primary")} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[7px] font-black rounded-full flex items-center justify-center border-2 border-background">
                {notifications.length}
              </span>
            )}
          </div>
          {showLabel && <span className="text-[9px] font-black uppercase tracking-[0.1em] text-foreground/60">{t('nav.notifications')}</span>}
        </button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="center" className="w-80 p-0 border-outer bg-card/95 backdrop-blur-3xl rounded-[15px] shadow-2xl z-[500]">
        <div className="p-4 border-b border-border/10 flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-normal">{t('nav.notifications')}</h3>
          <button onClick={clearNotifications} className="text-[8px] font-black uppercase text-primary hover:underline">
            {t('nav.clear_all')}
          </button>
        </div>
        <div className="max-h-[300px] overflow-y-auto clean-scrollbar p-2">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div key={n.id} className="p-3 rounded-[10px] hover:bg-primary/5 transition-all border-b border-border/5 last:border-0 text-start">
                <p className="text-[10px] font-black">{n.title}</p>
                <p className="text-[9px] font-bold opacity-60 mt-0.5">{n.msg}</p>
              </div>
            ))
          ) : (
            <div className="py-8 text-center opacity-30">
              <Bell size={24} className="mx-auto mb-2" />
              <p className="text-[9px] font-black uppercase tracking-normal">{t('notifications.empty')}</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );

  const EliteUtilities = () => (
    <>
      <div className={cn("items-center gap-2", user?.role === 'staff' ? "flex" : "hidden lg:flex")}>
        <NotificationGroup />
        {user?.role === 'customer' && (
          <>
            <Link href="/customer/wishlist" className={actionButtonStyle}>
              <Heart size={18} />
            </Link>
            <Link href="/compare" className={cn(actionButtonStyle, "relative")}>
              <Layers size={18} />
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-background">
                  {compareList.length}
                </span>
              )}
            </Link>
          </>
        )}
      </div>
    </>
  );

  const BottomNav = () => {
    if (isAuthPage || !user) return null;

    // واجهة الموظف على التابلت
    if (user.role === 'staff') {
      const items = [
        { id: 'dashboard', icon: LayoutDashboard, label: t('nav.bookings'), path: '/dashboard' },
        { id: 'rooms', icon: Bed, label: t('nav.rooms'), path: '/rooms' },
        { id: 'audit', icon: FileText, label: t('nav.audit_logs'), path: '/audit-logs' },
      ];

      return (
        <motion.div
          initial={false}
          animate={{ y: 0 }}
          className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] h-[72px] bg-background/80 backdrop-blur-2xl border-t border-border/10 flex items-center justify-around px-4 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
        >
          {items.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.id}
                href={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 flex-1 transition-all",
                  isActive ? "text-primary" : "text-foreground/40"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-[12px] flex items-center justify-center transition-all",
                  isActive ? "bg-primary/10 shadow-inner" : ""
                )}>
                  <item.icon size={22} className={cn(isActive ? "stroke-[2.5px]" : "stroke-[1.5px]")} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-normal">
                  {item.label}
                </span>
              </Link>
            );
          })}

          <Popover>
            <PopoverTrigger asChild>
              <button className="flex flex-col items-center justify-center gap-1.5 flex-1 text-foreground/40 outline-none">
                <div className="w-10 h-10 rounded-[12px] flex items-center justify-center">
                  <Menu size={22} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-normal">{t('nav.main_menu')}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent side="top" align="center" className="w-56 p-1 border-outer bg-card/95 backdrop-blur-3xl rounded-[15px] shadow-2xl mb-2 z-[200]">
              <button onClick={() => { router.push('/profile'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] text-[10px] font-black uppercase hover:bg-primary/10 text-foreground/80 transition-all outline-none">
                <User size={18} className="text-primary" /> {t('nav.profile')}
              </button>
              <div className="h-px bg-border/5 my-1" />
              <button onClick={() => setIsLogoutDialogOpen(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] text-[10px] font-black uppercase text-red-500 hover:bg-red-500/10 transition-all outline-none">
                <LogOut size={18} /> {t('nav.logout')}
              </button>
            </PopoverContent>
          </Popover>
        </motion.div>
      );
    }

    // واجهة العميل (كما هي)
    const items = [
      { id: 'bookings', icon: ClipboardList, label: t('nav.bookings'), path: '/customer/dashboard' },
      { id: 'home', icon: Home, label: t('nav.home'), path: '/customer' },
      { id: 'profile', icon: User, label: t('nav.profile'), path: '/profile' },
    ];

    return (
      <motion.div
        initial={false}
        animate={{ y: 0 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] h-[72px] bg-background/80 backdrop-blur-2xl border-t border-border/10 flex items-center justify-around px-4 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
      >
        {items.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.id}
              href={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 flex-1 transition-all relative",
                isActive ? "text-primary" : "text-foreground/40"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-[12px] flex items-center justify-center transition-all",
                isActive ? "bg-primary/10 shadow-inner" : ""
              )}>
                <item.icon size={22} className={cn(isActive ? "stroke-[2.5px]" : "stroke-[1.5px]")} />
              </div>
              <span className={cn("text-[9px] font-black uppercase tracking-normal", isActive ? "opacity-100" : "opacity-60")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </motion.div>
    );
  };

  if (!mounted) return null;

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: isNavVisible ? 0 : -100 }}
        className="fixed top-0 left-0 right-0 z-[100] h-20 bg-background/80 backdrop-blur-2xl flex items-center justify-between px-4 md:px-8 transition-colors duration-500"
      >
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] pointer-events-none transition-all duration-500" style={{ background: `linear-gradient(90deg, rgba(${navBorderColor}, 0) 0%, rgba(${navBorderColor}, 0.2) 20%, rgba(${navBorderColor}, 0.9) 50%, rgba(${navBorderColor}, 0.2) 80%, rgba(${navBorderColor}, 0) 100%)` }} />

        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 z-[110] pointer-events-none translate-y-1/2">
          <motion.div
            animate={{ rotate: 720 }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut", delay: 1.5 }}
            style={{ originX: "50%", originY: "50%" }}
            className="w-10 h-10 flex items-center justify-center"
          >
            <svg viewBox="0 0 100 100" className="w-7 h-7 filter drop-shadow-[0_3px_9px_rgba(0,0,0,0.35)]" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 50,15.36 L 80,67.32 L 20,67.32 Z" fill={theme === 'dark' ? "#ccb049" : "#63625e"} stroke={theme === 'dark' ? "#ccb049" : "#63625e"} strokeWidth="6" strokeLinejoin="round" className="transition-colors duration-500" />
            </svg>
          </motion.div>
        </div>

        <div className="flex items-center gap-2 group outline-none z-10 md:flex-none">
          <Link href={user?.role === 'staff' ? '/dashboard' : (user ? '/customer' : '/')} className={cn("flex items-center gap-2 group outline-none", isRTL ? "flex-row-reverse" : "flex-row")}>
            <EgyptianHorizonLogo isStatic={true} className="w-[40px] h-[40px] md:w-[46px] md:h-[46px] transition-transform group-hover:scale-105" />
            <div className={cn("flex flex-col leading-none items-start", isRTL ? "text-right" : "text-left")}>
              <span className={cn("text-base md:text-[26px] font-black text-primary leading-tight", isRTL ? "tracking-normal" : "tracking-normal uppercase")}>{t('home.brand_name')}</span>
              <span className={cn("text-[6px] md:text-[9px] font-bold opacity-60", isRTL ? "tracking-normal" : "tracking-normal uppercase")}>{t('home.brand_subtitle')}</span>
            </div>
          </Link>
        </div>

        {!isAuthPage && user && (
          <div className="hidden lg:flex absolute inset-y-0 left-1/2 -translate-x-1/2 items-center gap-[60px] xl:gap-[80px]">
            {navItems.map(item => {
              const isActive = pathname === item.path;
              return (
                <Link key={item.id} href={item.path} className={cn("flex flex-col items-center justify-center h-full transition-all group outline-none relative px-2", isActive ? "text-primary" : "opacity-90 hover:opacity-100 hover:text-primary")}>
                  <div className="relative flex items-center justify-center">
                    <item.icon size={20} className="relative z-10 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-normal mt-1.5">{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-2 md:gap-3 z-10">
          <div className="flex items-center gap-2">
            <Popover open={isMobileLangOpen} onOpenChange={setIsMobileLangOpen}>
              <PopoverTrigger asChild><button className={actionButtonStyle}><Globe size={18} /></button></PopoverTrigger>
              <PopoverContent align="center" className="w-40 p-1 border-outer bg-card/95 backdrop-blur-3xl rounded-[15px] shadow-2xl z-[200]">
                {languages.map((lang) => (
                  <button key={lang.code} onClick={() => { setLanguage(lang.code); setIsMobileLangOpen(false); }} className={cn("w-full flex items-center justify-between px-3 py-2.5 rounded-[10px] text-[10px] font-black uppercase transition-all outline-none", language === lang.code ? "bg-primary text-white" : "hover:bg-primary/10 text-foreground/60")}><span className="flex items-center gap-2"><span>{lang.flag}</span> {lang.label}</span>{language === lang.code && <Check size={12} />}</button>
                ))}
              </PopoverContent>
            </Popover>

            {!isAuthPage && user && <EliteUtilities />}

            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={actionButtonStyle}>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className={cn(actionButtonStyle, "lg:hidden group relative overflow-hidden", user?.role === 'staff' && "hidden")}>
                  <div className="flex flex-col gap-1 items-center">
                    <span className="w-5 h-0.5 bg-primary rounded-full transition-all group-hover:w-3" />
                    <span className="w-5 h-0.5 bg-primary rounded-full" />
                    <span className="w-5 h-0.5 bg-primary rounded-full transition-all group-hover:w-3" />
                  </div>
                </button>
              </SheetTrigger>
              <SheetContent side={isRTL ? "right" : "left"} className="w-[300px] p-0 border-none bg-background/95 backdrop-blur-3xl shadow-2xl flex flex-col z-[300]">
                  <SheetHeader className="p-8 bg-primary/5 border-b border-border/10">
                    <SheetTitle className="text-start">
                      <div className={cn("flex items-center gap-4", isRTL ? "flex-row-reverse" : "flex-row")}>
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shadow-inner"><EgyptianHorizonLogo isStatic={true} className="w-8 h-8" /></div>
                        <div className={cn("flex flex-col", isRTL ? "text-right" : "text-left")}>
                          <span className={cn("text-xl font-black text-primary leading-tight", isRTL ? "tracking-normal" : "tracking-normal uppercase")}>{t('home.brand_name')}</span>
                          <span className={cn("text-[9px] font-bold opacity-40 uppercase", isRTL ? "tracking-normal" : "tracking-normal")}>{t('nav.system_tag').split('•')[0]}</span>
                        </div>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto clean-scrollbar p-6 space-y-8">
                    {user?.role === 'customer' && (
                      <div className="space-y-4 mb-6">
                        <p className="text-[8px] font-black uppercase tracking-normal opacity-30 px-3 text-start">{t('nav.elite_features')}</p>
                        <div className="grid grid-cols-3 gap-2.5">
                          <button
                            onClick={() => { setIsMobileMenuOpen(false); router.push('/customer/wishlist'); }}
                            className="h-16 rounded-[18px] bg-muted/10 border-inner flex flex-col items-center justify-center gap-2 group transition-all active:scale-95"
                          >
                            <Heart size={20} className="text-red-500/60 group-hover:scale-110 transition-transform" />
                            <span className="text-[8.5px] font-black uppercase tracking-tight">{t('nav.wishlist')}</span>
                          </button>
                          <NotificationGroup showLabel={true} className="w-full h-16 bg-muted/10 rounded-[18px] border-inner shadow-none border-1.2 active:scale-95" />
                          <button
                            onClick={() => { setIsMobileMenuOpen(false); router.push('/compare'); }}
                            className="h-16 rounded-[18px] bg-muted/10 border-inner flex flex-col items-center justify-center gap-2 group transition-all active:scale-95"
                          >
                            <Layers size={20} className="text-primary/60 group-hover:scale-110 transition-transform" />
                            <span className="text-[8.5px] font-black uppercase tracking-tight">{t('search.compare')}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-[8px] font-black uppercase tracking-normal opacity-30 px-3 mb-4 text-start">{t('nav.main_menu')}</p>
                      {navItems.map(item => {
                        const Icon = item.icon;
                        return (
                          <button key={item.id} onClick={() => { setIsMobileMenuOpen(false); router.push(item.path); }} className={cn("w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300", pathname === item.path ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" : "hover:bg-primary/10 text-foreground/70")}>
                            <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center transition-colors", pathname === item.path ? "bg-white/20" : "bg-primary/5")}>
                              <Icon size={18} />
                            </div>
                            <span className="text-sm font-black uppercase tracking-normal">{item.label}</span>
                            {pathname === item.path && <ArrowRight size={14} className={cn(isRTL ? "mr-auto" : "ml-auto", isRTL && "rotate-180")} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="p-6 bg-primary/[0.02] border-t border-border/5">
                    <button onClick={() => setIsLogoutDialogOpen(true)} className="w-full h-14 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 font-black text-[11px] uppercase tracking-normal flex items-center justify-center gap-4 hover:bg-destructive hover:text-white transition-all duration-500 shadow-lg shadow-destructive/5"><LogOut size={18} /> {t('nav.logout')}</button>
                  </div>
                </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.nav>

      <BottomNav />

      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent className="rounded-[24px] border-outer bg-card/95 backdrop-blur-3xl p-10 max-w-[460px] text-center shadow-2xl">
          <AlertDialogHeader className="text-center space-y-4">
            <AlertDialogTitle className="text-2xl font-black tracking-normal text-center">{t('nav.logout_confirm_title')}</AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-bold opacity-70 text-center">{t('nav.logout_confirm_msg')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center justify-center gap-4 mt-8 flex-row sm:flex-row">
            <AlertDialogCancel asChild>
              <button className="h-12 w-1/2 rounded-[11px] border-2 !border-emerald-500 text-emerald-500 bg-transparent font-black text-[10px] uppercase transition-all outline-none hover:bg-emerald-500 hover:text-white hover:!border-transparent active:bg-emerald-600 active:!border-transparent">
                {t('nav.logout_no')}
              </button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <button onClick={handleLogout} className="h-12 w-1/2 rounded-[11px] border-2 !border-red-500 text-red-500 bg-transparent font-black text-[10px] uppercase transition-all outline-none hover:bg-red-500 hover:text-white hover:!border-transparent active:bg-red-600 active:!border-transparent">
                {t('nav.logout_yes')}
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isBackGuardOpen} onOpenChange={setIsBackGuardOpen}>
        <AlertDialogContent className="rounded-[24px] border-outer bg-card/95 backdrop-blur-3xl p-10 max-w-[460px] text-center shadow-2xl">
          <AlertDialogHeader className="text-center space-y-4">
            <AlertDialogTitle className="text-2xl font-black tracking-normal text-center">{t('nav.exit_page_title')}</AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-bold opacity-70 text-center">{t('nav.exit_page_msg')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center justify-center gap-4 mt-8 flex-row sm:flex-row">
            <AlertDialogCancel asChild>
              <button className="h-12 w-1/2 rounded-[11px] border-2 !border-emerald-500 text-emerald-500 bg-transparent font-black text-[10px] uppercase transition-all outline-none hover:bg-emerald-500 hover:text-white hover:!border-transparent active:bg-emerald-600 active:!border-transparent">
                {t('nav.logout_no')}
              </button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <button onClick={handleConfirmExitPage} className="h-12 w-1/2 rounded-[11px] border-2 !border-red-500 text-red-500 bg-transparent font-black text-[10px] uppercase transition-all outline-none hover:bg-red-500 hover:text-white hover:!border-transparent active:bg-red-600 active:!border-transparent">
                {t('nav.exit_page_yes')}
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
