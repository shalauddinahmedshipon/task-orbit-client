// components/member-dashboard/MyTodoHighlights.tsx
"use client";

import { useRouter } from "next/navigation";
import {
  AlertTriangle, ArrowRight, CheckCircle2, Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllTasksQuery } from "@/store/api/task.api";
import { priorityDot, priorityVariant, isOverdue, formatDate } from "@/utils/task.utils";
import { cn } from "@/lib/utils";

interface MyTodoHighlightsProps {
  userId: string;
}

export function MyTodoHighlights({ userId }: MyTodoHighlightsProps) {
  const router = useRouter();
  const { data: tasks = [], isLoading } = useGetAllTasksQuery({ status: "todo" });

  // Only assigned to me, sorted: overdue first, then high priority
  const myTodos = tasks
    .filter((t) => t.assignees.some((a) => a._id === userId))
    .sort((a, b) => {
      const aOver = isOverdue(a.dueDate, a.status) ? -1 : 0;
      const bOver = isOverdue(b.dueDate, b.status) ? -1 : 0;
      if (aOver !== bOver) return aOver - bOver;
      const pri = { high: 0, medium: 1, low: 2 };
      return pri[a.priority] - pri[b.priority];
    });

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-5 space-y-3">
        <Skeleton className="h-5 w-32" />
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-semibold">To Do</h3>
          {myTodos.length > 0 && (
            <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 rounded-full px-2 py-0.5 font-medium">
              {myTodos.length}
            </span>
          )}
        </div>
        <Button
          variant="ghost" size="sm" className="h-7 text-xs gap-1"
          onClick={() => router.push("/dashboard/member/my-tasks?status=todo")}
        >
          View all <ArrowRight className="h-3 w-3" />
        </Button>
      </div>

      {myTodos.length === 0 ? (
        <div className="flex flex-col items-center py-8 gap-2 text-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          <p className="text-sm font-medium">All caught up!</p>
          <p className="text-xs text-muted-foreground">No to-do tasks assigned to you</p>
        </div>
      ) : (
        <div className="space-y-2">
          {myTodos.slice(0, 7).map((task) => {
            const overdue   = isOverdue(task.dueDate, task.status);
            const projTitle = typeof task.projectId === "object"
              ? (task.projectId as any).title
              : "—";
            const isHighPri = task.priority === "high";

            return (
              <div
                key={task._id}
                onClick={() => router.push(`/dashboard/admin/tasks/${task._id}`)}
                className={cn(
                  "group flex items-center gap-3 rounded-lg border p-3 cursor-pointer",
                  "hover:border-primary/40 hover:shadow-sm transition-all",
                  overdue
                    ? "bg-red-50/50 dark:bg-red-950/10 border-red-200 dark:border-red-900"
                    : isHighPri
                    ? "bg-amber-50/50 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900"
                    : "bg-background"
                )}
              >
                <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", priorityDot[task.priority])} />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs text-muted-foreground truncate">{projTitle}</span>
                    <span className={cn(
                      "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                      priorityVariant[task.priority]
                    )}>
                      {task.priority}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className={cn(
                    "flex items-center gap-1 text-[10px] font-medium whitespace-nowrap",
                    overdue ? "text-red-500" : "text-muted-foreground"
                  )}>
                    {overdue && <AlertTriangle className="h-3 w-3" />}
                    {formatDate(task.dueDate)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{task.estimatedHours}h est.</span>
                </div>
              </div>
            );
          })}

          {myTodos.length > 7 && (
            <button
              onClick={() => router.push("/dashboard/member/my-tasks?status=todo")}
              className="w-full text-xs text-muted-foreground hover:text-foreground py-2 text-center transition-colors"
            >
              +{myTodos.length - 7} more →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
