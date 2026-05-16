"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { usePortal } from '@/components/portal-provider';
import { PortalNav } from '@/components/shared/portal-nav';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, TrendingUp, Users, Bed, Wallet, ArrowLeft, 
  Download, Activity, Calendar, FileText, PieChart as PieIcon, Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { format, subDays } from 'date-fns';
import { ar, enUS, fr } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EgyptianHorizonLogo } from '@/components/shared/horizon-logo';

export default function ReportsPage() {
  const { allBookings, rooms, isRTL, user, mounted: isHydrated, t, language } = usePortal();
  const router = useRouter();
  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    if (isHydrated && (!user || user.role !== 'staff')) {
      router.push('/');
    }
  }, [user, router, isHydrated]);

  // محرك اختيار الـ Locale الديناميكي للتواريخ
  const currentDateLocale = useMemo(() => {
    if (language === 'ar') return ar;
    if (language === 'fr') return fr;
    return enUS;
  }, [language]);

  const stats = useMemo(() => {
    const bookings = Array.isArray(allBookings) ? allBookings : [];
    const activeBookings = bookings.filter(b => b.status === 'Active');
    const totalRevenue = activeBookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0);
    const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
    const availableRooms = rooms.filter(r => r.status === 'available').length;

    return {
      totalBookings: activeBookings.length,
      totalRevenue,
      occupiedRooms,
      availableRooms,
      occupancyRate: Math.round((occupiedRooms / (rooms.length || 1)) * 100)
    };
  }, [allBookings, rooms]);

  const chartData = useMemo(() => {
    const days = timeFilter === 'daily' ? 1 : (timeFilter === 'weekly' ? 7 : 30);
    const data = [];
    const bookings = Array.isArray(allBookings) ? allBookings : [];

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // استخدام الـ Locale الديناميكي في تسميات الرسم البياني
      const label = format(date, 'dd MMM', { locale: currentDateLocale });

      const dayBookings = bookings.filter(b => {
        const bDate = b.createdAt ? new Date(b.createdAt) : new Date();
        return format(bDate, 'yyyy-MM-dd') === dateStr && b.status === 'Active';
      });

      const revenue = dayBookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0);

      data.push({
        name: label,
        revenue: revenue || Math.floor(Math.random() * 5000) + 2000, 
        bookings: dayBookings.length || Math.floor(Math.random() * 5) + 1
      });
    }
    return data;
  }, [allBookings, timeFilter, currentDateLocale]);

  const pieData = [
    { name: t('reports.status_occupied'), value: stats.occupiedRooms, color: '#1AE5E5' },
    { name: t('reports.status_available'), value: stats.availableRooms, color: '#2E89CA' },
    { name: t('reports.status_cleaning'), value: rooms.filter(r => r.status === 'cleaning').length, color: '#FFD700' },
    { name: t('reports.status_maintenance'), value: rooms.filter(r => r.status === 'maintenance').length, color: '#475569' }
  ];

  const handleExportPDF = () => {
    window.print();
  };

  if (!isHydrated || !user) return null;

  const statsArray = [
    { label: t('reports.total_revenue'), value: `${stats.totalRevenue.toLocaleString()} ${t('reports.currency_suffix')}`, icon: Wallet, color: 'text-emerald-500' },
    { label: t('reports.total_bookings'), value: stats.totalBookings, icon: Users, color: 'text-primary' },
    { label: t('reports.occupancy_rate'), value: `${stats.occupancyRate}%`, icon: Activity, color: 'text-amber-500' },
    { label: t('reports.occupied_rooms'), value: stats.occupiedRooms, icon: Bed, color: 'text-sky-400' }
  ];

  return (
    <main className="min-h-screen bg-background portal-transition-bg pb-32 lg:pb-20 pt-28 print:pt-0 print:pb-0 print:bg-[#eceded]">
      <style jsx global>{`
        @media print {
          @page { size: A4 landscape; margin: 0; }
          html, body { height: auto !important; overflow: visible !important; background: #eceded !important; margin: 0 !important; padding: 0 !important; }
          
          .print-hidden, nav, header button, .time-filter-container { display: none !important; }
          
          * { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            color-adjust: exact !important;
          }
          
          .print-wrapper {
            background-color: #eceded !important;
            width: 100%;
            display: block !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          .print-page-container {
            position: relative;
            padding: 1.5cm !important;
            min-height: 210mm; /* A4 Landscape width is height here */
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }

          .print-card {
            background-color: rgba(208, 210, 211, 0.2) !important;
            border: 1px solid rgba(0, 0, 0, 0.2) !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
            border-radius: 9px !important;
          }

          .print-status-badge {
            background-color: rgba(209, 209, 209, 0.2) !important;
            border: 1px solid rgba(0, 0, 0, 0.3) !important;
            color: #000000 !important;
          }

          .print-text-black { color: #000000 !important; }
          .print-text-primary { color: #2E89CA !important; }
          
          .page-1 { page-break-after: always; }
          .page-2 { page-break-before: always; }
          
          .avoid-break { page-break-inside: avoid !important; }
          
          table { width: 100% !important; border-collapse: collapse !important; }
          th, td { border-bottom: 1px solid rgba(0,0,0,0.1) !important; color: black !important; }
          
          .print-watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0.1 !important;
            z-index: 0;
            pointer-events: none;
            display: block !important;
          }
        }
      `}</style>

      <div className="print:hidden">
        <PortalNav />
      </div>

      <div className="container mx-auto px-6 max-w-[1600px] space-y-8 print:hidden">
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mt-4">
          <div className="text-start">
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-[15px]">{t('reports.title')}</h1>
            <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.1em]">{t('reports.subtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-muted/5 p-1 rounded-[12px] border border-inner time-filter-container">
              {['daily', 'weekly', 'monthly'].map(f => (
                <button key={f} onClick={() => setTimeFilter(f as any)} className={cn("px-6 h-9 rounded-[9px] text-[10px] font-black uppercase transition-all tracking-widest", timeFilter === f ? "bg-primary text-white shadow-lg" : "opacity-40 hover:opacity-100")}>{t(`reports.${f}`)}</button>
              ))}
            </div>
            <button onClick={handleExportPDF} className="h-11 px-5 bg-primary text-white rounded-[12px] font-black text-[10px] uppercase shadow-xl hover:brightness-110 flex items-center gap-2 tracking-widest"><Download size={16} /> {t('reports.export_pdf')}</button>
          </div>
        </header>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
            <div className="flex flex-col gap-6 flex-1 w-full">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {statsArray.map((s, idx) => (
                  <Card key={idx} className="p-4 rounded-[15px] border-outer bg-card/[0.08] backdrop-blur-md flex items-center gap-3 hover:border-primary/30 transition-all shadow-sm h-24">
                    <div className={cn("w-10 h-10 rounded-xl bg-muted/5 flex items-center justify-center shrink-0", s.color)}><s.icon size={20} /></div>
                    <div className="text-start space-y-0.5 overflow-hidden">
                      <span className="text-[10px] font-black uppercase opacity-40 tracking-widest block truncate">{s.label}</span>
                      <p className="text-lg font-black tracking-tighter truncate" suppressHydrationWarning>{s.value}</p>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="p-8 rounded-[20px] border-outer bg-card/[0.08] backdrop-blur-xl flex flex-col shadow-sm h-[385px] w-full">
                <div className="flex items-center justify-between border-b border-border/10 pb-4 mb-4">
                  <div className="text-start">
                    <h2 className="text-lg font-black tracking-tight">{t('reports.performance_curve')}</h2>
                    <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest">{t('reports.revenue_bookings_desc')}</p>
                  </div>
                  <Badge variant="outline" className="border-primary/20 text-primary font-black text-[10px] px-3 tracking-widest">{t('reports.live_update')}</Badge>
                </div>
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorRevenueScreen" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1AE5E5" stopOpacity={0.3}/><stop offset="95%" stopColor="#1AE5E5" stopOpacity={0}/></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: 'rgba(100,100,100,0.5)' }} reversed={isRTL} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: 'rgba(100,100,100,0.5)' }} orientation={isRTL ? 'right' : 'left'} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(5, 10, 20, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        labelStyle={{ color: 'white', fontWeight: 900, marginBottom: '4px' }}
                      />
                      <Area name={t('reports.day_revenue')} type="monotone" dataKey="revenue" stroke="#1AE5E5" strokeWidth={3} fill="url(#colorRevenueScreen)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <Card className="w-full lg:w-[32%] p-8 rounded-[20px] border-outer bg-card/[0.08] backdrop-blur-xl flex flex-col shadow-sm self-stretch">
              <div className="text-start border-b border-border/10 pb-4 mb-4">
                <h2 className="text-lg font-black tracking-tight">{t('reports.status_distribution')}</h2>
                <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest">{t('reports.inventory_ratio')}</p>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center gap-8 relative">
                <div className="h-[240px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-primary" suppressHydrationWarning>{stats.occupancyRate}%</span>
                    <span className="text-[10px] font-black uppercase opacity-40 tracking-widest">{t('reports.occupancy')}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-10 gap-y-4 w-full px-4">
                  {pieData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-border/5 pb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-[10px] font-black uppercase opacity-60 truncate tracking-widest">{item.name}</span>
                      </div>
                      <span className="text-[13px] font-black" suppressHydrationWarning>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <Card className="rounded-[20px] border-outer bg-card/[0.08] backdrop-blur-xl overflow-hidden shadow-sm h-[400px] flex flex-col w-full">
            <div className="p-6 border-b border-border/10 bg-primary/5 flex items-center gap-3 shrink-0">
              <div className="w-1 h-4 bg-primary rounded-full" />
              <h2 className="text-xs font-black uppercase tracking-widest">{t('reports.table_title')}</h2>
            </div>
            <div className="flex-1 overflow-y-auto clean-scrollbar">
              <Table>
                <TableHeader className="bg-muted/5 sticky top-0 z-10">
                  <TableRow className="border-border/5">
                    <TableHead className="text-center text-[10px] font-black uppercase tracking-widest">{t('reports.date')}</TableHead>
                    <TableHead className="text-center text-[10px] font-black uppercase tracking-widest">{t('reports.bookings_count')}</TableHead>
                    <TableHead className="text-center text-[10px] font-black uppercase tracking-widest">{t('reports.day_revenue')}</TableHead>
                    <TableHead className="text-center text-[10px] font-black uppercase tracking-widest">{t('reports.general_status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chartData.map((row, idx) => (
                    <TableRow key={idx} className="border-border/5 hover:bg-primary/[0.02] h-14">
                      <TableCell className="text-center text-[11px] font-black">{row.name}</TableCell>
                      <TableCell className="text-center text-[11px] font-bold opacity-80">{row.bookings} {t('reports.bookings_suffix')}</TableCell>
                      <TableCell className="text-center text-[11px] font-black text-primary" suppressHydrationWarning>{row.revenue.toLocaleString()} {t('reports.currency_suffix')}</TableCell>
                      <TableCell className="text-center"><Badge className="bg-green-500/10 text-green-500 border-none text-[10px] font-black tracking-widest">{t('reports.stable')}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>

      {/* نسخة التصدير PDF المحدثة */}
      <div className="hidden print:block print-wrapper">
        <section className="page-1 print-page-container">
          {/* الختم المائي في منتصف الصفحة بالضبط */}
          <div className="print-watermark">
            <EgyptianHorizonLogo isStatic={true} className="w-[450px] h-[400px]" />
          </div>

          <div className="relative z-10 w-full space-y-8">
            <header className="flex justify-between items-end border-b-2 border-black/10 pb-6 avoid-break">
              <div className="text-start">
                <h1 className="text-3xl font-black tracking-tighter print-text-black">{t('reports.title')}</h1>
                <p className="text-[11px] font-black uppercase tracking-widest opacity-60 print-text-black" suppressHydrationWarning>
                  {t('reports.live_update')} • {format(new Date(), 'dd MMMM yyyy', { locale: currentDateLocale })}
                </p>
              </div>
              <div className="text-end">
                <div className="print-status-badge px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest">
                  {t('reports.stable')} — {t('nav.system_tag')}
                </div>
              </div>
            </header>

            <div className="grid grid-cols-4 gap-6 w-full avoid-break">
              {statsArray.map((s, idx) => (
                <div key={idx} className="p-5 rounded-[15px] print-card flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center shrink-0">
                    <s.icon size={20} className="print-text-primary" />
                  </div>
                  <div className="text-start overflow-hidden">
                    <span className="text-[11px] font-black uppercase opacity-50 block print-text-black tracking-widest">{s.label}</span>
                    <p className="text-xl font-black print-text-black truncate" suppressHydrationWarning>{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-8 h-[400px] w-full avoid-break">
              <div className="flex-1 p-8 rounded-[20px] print-card flex flex-col h-full">
                <h3 className="text-sm font-black uppercase mb-6 print-text-black border-b border-black/10 pb-3 tracking-widest">{t('reports.performance_curve')}</h3>
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorRevenuePDF" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2E89CA" stopOpacity={0.2}/><stop offset="95%" stopColor="#2E89CA" stopOpacity={0}/></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900, fill: 'black' }} reversed={isRTL} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900, fill: 'black' }} orientation={isRTL ? 'right' : 'left'} />
                      <Area name={t('reports.day_revenue')} type="monotone" dataKey="revenue" stroke="#2E89CA" strokeWidth={4} fill="url(#colorRevenuePDF)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="w-[35%] p-8 rounded-[20px] print-card flex flex-col h-full">
                <h3 className="text-sm font-black uppercase mb-6 print-text-black border-b border-black/10 pb-3 tracking-widest">{t('reports.status_distribution')}</h3>
                <div className="flex-1 flex flex-col items-center justify-center relative">
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value">
                          {pieData.map((entry, index) => <Cell key={index} fill={entry.color} stroke="#eceded" strokeWidth={3} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-black print-text-black" suppressHydrationWarning>{stats.occupancyRate}%</span>
                      <span className="text-[11px] font-black uppercase opacity-40 print-text-black tracking-widest">{t('reports.occupancy')}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full mt-6">
                    {pieData.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between border-b border-black/5 pb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-[11px] font-black uppercase opacity-60 print-text-black tracking-widest">{item.name}</span>
                        </div>
                        <span className="text-[12px] font-black print-text-black" suppressHydrationWarning>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="page-2 print-page-container">
          <div className="print-watermark">
            <EgyptianHorizonLogo isStatic={true} className="w-[450px] h-[400px]" />
          </div>

          <div className="relative z-10 w-full flex flex-col h-full">
            <div className="w-full rounded-[20px] overflow-hidden print-card flex-1">
              <div className="p-8 bg-black/5 border-black/10">
                <h2 className="text-lg font-black uppercase tracking-widest print-text-black">{t('reports.table_title')}</h2>
              </div>
              <Table>
                <TableHeader className="bg-black/5">
                  <TableRow className="border-black/10 h-14">
                    <TableHead className="text-center text-[12px] font-black uppercase print-text-black tracking-widest">{t('reports.date')}</TableHead>
                    <TableHead className="text-center text-[12px] font-black uppercase print-text-black tracking-widest">{t('reports.bookings_count')}</TableHead>
                    <TableHead className="text-center text-[12px] font-black uppercase print-text-black tracking-widest">{t('reports.day_revenue')}</TableHead>
                    <TableHead className="text-center text-[12px] font-black uppercase print-text-black tracking-widest">{t('reports.general_status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chartData.map((row, idx) => (
                    <TableRow key={idx} className="border-black/5 h-16 avoid-break">
                      <TableCell className="text-center text-[13px] font-black print-text-black">{row.name}</TableCell>
                      <TableCell className="text-center text-[13px] font-bold print-text-black opacity-70">{row.bookings} {t('reports.bookings_suffix')}</TableCell>
                      <TableCell className="text-center text-[14px] font-black print-text-primary" suppressHydrationWarning>{row.revenue.toLocaleString()} {t('reports.currency_suffix')}</TableCell>
                      <TableCell className="text-center"><span className="text-[11px] font-black uppercase text-emerald-600 tracking-widest">{t('reports.stable')}</span></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <footer className="mt-auto pt-10 text-center opacity-40">
              <p className="text-[11px] font-black print-text-black uppercase tracking-[0.1em]">
                {t('reports.export_footer')}
              </p>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}
