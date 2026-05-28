// components/member-dashboard/WeeklyHoursChart.tsx
"use client";

import { startOfWeek, addDays, format, isSameDay } from "date-fns";
import { Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyTimeLogsQuery } from "@/store/api/timelog.api";
import { cn } from "@/lib/utils";

export function WeeklyHoursChart() {
  const { data: logs = [], isLoading } = useGetMyTimeLogsQuery();

  // Build Mon–Sun of current week
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => {
    const date    = addDays(weekStart, i);
    const dayLogs = logs.filter((l) => isSameDay(new Date(l.logDate), date));
    const hours   = dayLogs.reduce((sum, l) => sum + l.hours, 0);
    return { date, hours, label: format(date, "EEE"), isToday: isSameDay(date, new Date()) };
  });

  const totalWeek = days.reduce((sum, d) => sum + d.hours, 0);
  const maxHours  = Math.max(...days.map((d) => d.hours), 1);

  if (isLoading) return <Skeleton className="h-32 rounded-xl" />;

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">This week</h3>
        </div>
        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
          {totalWeek}h logged
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1.5 items-end h-20">
        {days.map((d) => {
          const pct = maxHours > 0 ? (d.hours / maxHours) * 100 : 0;
          return (
            <div key={d.label} className="flex flex-col items-center gap-1">
              <div className="w-full flex items-end justify-center h-14">
                <div
                  className={cn(
                    "w-full rounded-t-sm transition-all",
                    d.isToday ? "bg-blue-500" : "bg-blue-200 dark:bg-blue-900/50",
                    d.hours === 0 && "opacity-30"
                  )}
                  style={{ height: `${Math.max(pct, d.hours > 0 ? 8 : 4)}%` }}
                />
              </div>
              <span className={cn(
                "text-[10px] font-medium",
                d.isToday ? "text-blue-500" : "text-muted-foreground"
              )}>
                {d.label}
              </span>
              {d.hours > 0 && (
                <span className="text-[9px] text-muted-foreground">{d.hours}h</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
