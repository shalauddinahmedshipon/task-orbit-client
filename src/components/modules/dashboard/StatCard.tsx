// components/shared/StatCard.tsx
"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label:     string;
  value:     string | number;
  sub?:      string;
  icon:      LucideIcon;
  iconColor?: string;
  iconBg?:   string;
  valueColor?: string;
  onClick?:  () => void;
}

export function StatCard({
  label, value, sub, icon: Icon,
  iconColor = "text-primary",
  iconBg    = "bg-primary/10",
  valueColor = "",
  onClick,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border bg-card p-4 sm:p-5 space-y-3",
        onClick && "cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all"
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", iconBg)}>
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
      </div>
      <div>
        <p className={cn("text-2xl font-semibold tabular-nums", valueColor)}>{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
