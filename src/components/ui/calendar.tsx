"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays 
} from "date-fns"
import { ar, enUS } from "date-fns/locale"
import { usePortal } from "@/components/portal-provider"
import { cn } from "@/lib/utils"

export type CalendarProps = {
  selected?: Date | Date[] | undefined;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
}

/**
 * @component Calendar
 * @description مكوّن تقويم ملكي مخصص بالكامل (Custom Built) لضمان أقصى درجات الأناقة والنعومة.
 * تم التحديث: دعم الوضع النهاري وتلوين الأيام الماضية بالرمادي الفاتح في الوضع النهاري فقط.
 */
export function Calendar({ selected, onSelect, disabled, className }: CalendarProps) {
  const { language, isRTL, theme } = usePortal();
  const [currentMonth, setCurrentMonth] = React.useState(
    Array.isArray(selected) ? selected[0] || new Date() : selected || new Date()
  );

  const locale = language === 'ar' ? ar : enUS;

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // مصفوفة أيام الأسبوع بالترتيب الصحيح (RTL)
  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentMonth, { locale });
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-muted-foreground/40 font-black text-[10px] uppercase text-center tracking-widest py-2">
          {format(addDays(startDate, i), "eee", { locale })}
        </div>
      );
    }
    return <div className="grid grid-cols-7 border-b border-border/10 mb-1">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale });
    const endDate = endOfWeek(monthEnd, { locale });

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        const isSelected = selected instanceof Date && isSameDay(day, selected);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isDisabled = disabled ? disabled(day) : false;

        days.push(
          <div
            key={day.toString()}
            className="h-8 w-full flex items-center justify-center"
          >
            <button
              type="button"
              onClick={() => !isDisabled && onSelect?.(cloneDay)}
              disabled={isDisabled}
              className={cn(
                "h-7 w-7 text-[10.5px] font-bold rounded-[9px] transition-all duration-300 flex items-center justify-center outline-none",
                !isCurrentMonth && "text-muted-foreground/10 pointer-events-none",
                isCurrentMonth && !isSelected && !isDisabled && "text-foreground/80 hover:bg-primary/10 hover:text-primary",
                isSelected && "bg-primary text-white shadow-lg shadow-primary/20 scale-110",
                // تعديل الأيام الماضية: رمادي فاتح في الوضع النهاري، وشفاف في الوضع الليلي كما كان
                isDisabled && (
                  theme === 'light' 
                    ? "text-slate-300 cursor-not-allowed" 
                    : "text-white/10 cursor-not-allowed"
                )
              )}
            >
              {formattedDate}
            </button>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-0.5">{rows}</div>;
  };

  return (
    <div 
      className={cn(
        "p-3 w-[320px] bg-popover backdrop-blur-3xl border border-border rounded-[13px] shadow-2xl overflow-hidden select-none animate-in fade-in zoom-in-95 duration-300",
        className
      )} 
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-1 mb-2">
        <button
          type="button"
          onClick={isRTL ? nextMonth : prevMonth}
          className="p-1.5 rounded-full hover:bg-primary/10 text-primary transition-all active:scale-90"
        >
          {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-foreground/90">
          {format(currentMonth, "MMMM yyyy", { locale })}
        </span>
        <button
          type="button"
          onClick={isRTL ? prevMonth : nextMonth}
          className="p-1.5 rounded-full hover:bg-primary/10 text-primary transition-all active:scale-90"
        >
          {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {renderDays()}
      {renderCells()}
    </div>
  );
}