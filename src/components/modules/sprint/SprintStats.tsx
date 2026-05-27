// components/sprint-detail/SprintStats.tsx
"use client";

import { AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Sprint } from "@/types/sprint.types";
import { Task } from "@/types/task.types";
import { getDaysLeft, sprintProgress } from "@/utils/task.utils";

interface SprintStatsProps {
  sprint: Sprint;
  tasks: Task[];
}

export function SprintStats({ sprint, tasks }: SprintStatsProps) {
  const total      = tasks.length;
  const done       = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const review     = tasks.filter((t) => t.status === "review").length;
  const todo       = tasks.filter((t) => t.status === "todo").length;
  const overdue    = tasks.filter(
    (t) => t.status !== "done" && new Date(t.dueDate) < new Date()
  ).length;
  const progress   = sprintProgress(tasks);
  const daysLeft   = getDaysLeft(sprint.endDate);
  const estHours   = tasks.reduce((acc, t) => acc + (t.estimatedHours || 0), 0);

  const stats = [
    { label: "Tasks",     value: total,    sub: `${done} done` },
    { label: "Est. hours",value: estHours, sub: "total estimate" },
    { label: "Days left", value: Math.max(0, daysLeft), sub: daysLeft < 0 ? "sprint ended" : "remaining", warn: daysLeft < 0 },
    { label: "Overdue",   value: overdue,  sub: "past due date", warn: overdue > 0 },
  ];

  return (
    <div className="space-y-4">
      {/* stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border bg-card p-3 sm:p-4"
          >
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-semibold mt-0.5 ${s.warn ? "text-red-500" : ""}`}>
              {s.value}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Sprint progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-slate-400 inline-block" />To do: {todo}</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />In progress: {inProgress}</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500 inline-block" />Review: {review}</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />Done: {done}</span>
        </div>
      </div>

      {/* overdue banner */}
      {overdue > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30 px-3 py-2 text-sm text-red-700 dark:text-red-400">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            <strong>{overdue} task{overdue > 1 ? "s are" : " is"} overdue</strong> — check the list below.
          </span>
        </div>
      )}
    </div>
  );
}
