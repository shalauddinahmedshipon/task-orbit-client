"use client";

import {
  ListTodo,
  PlayCircle,
  Eye,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { Task } from "@/types/task.types";

interface GlobalTaskStatsProps {
  tasks: Task[];
}

export function GlobalTaskStats({ tasks }: GlobalTaskStatsProps) {
  const total = tasks.length;

  const todo = tasks.filter((t) => t.status === "todo").length;

  const inProgress = tasks.filter(
    (t) => t.status === "in-progress"
  ).length;

  const review = tasks.filter(
    (t) => t.status === "review"
  ).length;

  const done = tasks.filter(
    (t) => t.status === "done"
  ).length;

  const overdue = tasks.filter(
    (t) =>
      t.status !== "done" &&
      t.dueDate &&
      new Date(t.dueDate) < new Date()
  ).length;

  const stats = [
    {
      label: "Total Tasks",
      value: total,
      icon: ListTodo,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/40",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: PlayCircle,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/40",
    },
    {
      label: "Review",
      value: review,
      icon: Eye,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950/40",
    },
    {
      label: "Completed",
      value: done,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      label: "Overdue",
      value: overdue,
      icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-50 dark:bg-red-950/40",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {stats.map(({ label, value, icon: Icon, color, bg }) => (
        <Card key={label}>
          <CardContent className="flex items-center gap-3 p-4">
            <div className={`rounded-lg p-2 shrink-0 ${bg}`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs text-muted-foreground">
                {label}
              </p>

              <p className="text-xl font-bold leading-tight">
                {value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}