// components/users/UserStats.tsx
"use client";

import type { User } from "@/types/auth.types";

interface UserStatsProps {
  users: User[];
}

export function UserStats({ users }: UserStatsProps) {
  const total    = users.length;
  const admins   = users.filter((u) => u.role === "admin").length;
  const managers = users.filter((u) => u.role === "manager").length;
  const members  = users.filter((u) => u.role === "member").length;
  const blocked  = users.filter((u) => u.status === "blocked").length;

  const stats = [
    { label: "Total",    value: total,    color: "" },
    { label: "Admins",   value: admins,   color: "text-violet-600 dark:text-violet-400" },
    { label: "Managers", value: managers, color: "text-blue-600 dark:text-blue-400" },
    { label: "Members",  value: members,  color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Blocked",  value: blocked,  color: blocked > 0 ? "text-red-500" : "" },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex items-center gap-2.5 rounded-lg border bg-card px-3 py-2.5"
        >
          <span className={`text-xl font-semibold tabular-nums ${s.color}`}>
            {s.value}
          </span>
          <span className="text-xs text-muted-foreground">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
