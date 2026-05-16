"use client"

import React from 'react';
import { usePortal } from '@/components/portal-provider';
import { PortalNav } from '@/components/shared/portal-nav';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Clock, User, Activity } from 'lucide-react';
import { format } from 'date-fns';

export default function AuditLogsPage() {
  const { auditLogs, t, user } = usePortal();

  if (!user || user.role !== 'staff') return null;

  /**
   * @function formatLogMessage
   * @description محرك صياغة السجلات الذكي - يقوم بتفكيك بروتوكول Pipe وبناء الجملة المترجمة
   */
  const formatLogMessage = (raw: string) => {
    if (!raw) return raw;
    
    // إذا لم يكن النص يتبع بروتوكول الـ Pipe، نعامله كسجل قديم ونترجمه مباشرة
    if (!raw.includes('|')) {
      return t(raw);
    }

    const parts = raw.split('|');
    const key = parts[0];
    const params = parts.slice(1);
    
    let translated = t(key);
    
    // محرك استبدال الرموز (Placeholders Engine)
    if (key === 'audit.log.walkin') {
      translated = translated.replace('{name}', params[0]).replace('{id}', params[1]);
    } else if (key === 'audit.log.cancel') {
      translated = translated.replace('{id}', params[0]);
    } else if (key === 'audit.log.status_update') {
      translated = translated.replace('{id}', params[0])
                             .replace('{status}', t(`reception.status.${params[1].toLowerCase()}`));
    } else if (key === 'audit.log.edit') {
      translated = translated.replace('{id}', params[0]);
    }
    
    return translated;
  };

  return (
    <main className="min-h-screen bg-background portal-transition-bg pb-32 lg:pb-20 pt-28">
      <PortalNav />
      <div className="container mx-auto px-6 space-y-8 max-w-[1400px]">
        <header className="text-start space-y-2">
          <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3 mb-[15px]">
            <FileText className="text-primary" /> {t('audit.title')}
          </h1>
          <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.1em]">{t('audit.subtitle')}</p>
        </header>

        <Card className="border-outer bg-card/40 backdrop-blur-xl rounded-[15px] overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-border/10 bg-primary/5 flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-[0.1em]">{t('audit.table_title')}</h2>
            <Badge variant="outline" className="border-primary/20 text-primary font-black text-[9px] tracking-widest">
              {auditLogs.length} {t('audit.count_label')}
            </Badge>
          </div>
          
          <ScrollArea className="h-[65vh]">
            <Table>
              <TableHeader className="bg-muted/5 sticky top-0 z-10">
                <TableRow className="border-border/5">
                  <TableHead className="text-center text-[9px] font-black uppercase tracking-widest">{t('audit.header_time')}</TableHead>
                  <TableHead className="text-center text-[9px] font-black uppercase tracking-widest">{t('audit.header_user')}</TableHead>
                  <TableHead className="text-center text-[9px] font-black uppercase tracking-widest">{t('audit.header_action')}</TableHead>
                  <TableHead className="text-center text-[9px] font-black uppercase tracking-widest">{t('audit.header_details')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log: any) => (
                  <TableRow key={log.id} className="border-border/5 hover:bg-primary/[0.02]">
                    <TableCell className="text-[10px] font-bold text-center opacity-60">
                      <div className="flex items-center justify-center gap-2">
                        <Clock size={12} className="text-primary" />
                        <span suppressHydrationWarning>{format(new Date(log.timestamp), 'dd/MM HH:mm')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[10px] font-black text-center">
                      <div className="flex items-center justify-center gap-2">
                        <User size={12} className="text-primary" />
                        {log.user}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest">
                        {t(log.action)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[10px] font-medium opacity-80 text-start px-8">
                      <div className="flex items-center gap-2">
                        <Activity size={10} className="text-primary/40" />
                        {formatLogMessage(log.details)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
      </div>
    </main>
  );
}
