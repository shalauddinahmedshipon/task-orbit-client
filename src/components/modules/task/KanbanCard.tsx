// components/sprint-detail/KanbanCard.tsx
"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, Lock, Paperclip, MessageSquare } from "lucide-react";
import { Progress } from "@/components/ui/progress";

import { cn } from "@/lib/utils";
import { Task } from "@/types/task.types";
import { formatDate, isOverdue, priorityDot, priorityVariant, subtaskProgress } from "@/utils/task.utils";
import { AssigneeStack } from "../sprint/AssigneeStack";

interface KanbanCardProps {
  task: Task;
  isDragging?: boolean;
}

export function KanbanCard({ task, isDragging }: KanbanCardProps) {
  const router  = useRouter();
  const overdue = isOverdue(task.dueDate, task.status);
  const isDone  = task.status === "done";
  const subPct  = subtaskProgress(task.subtasks);

  return (
    <div
      onClick={() => router.push(`/dashboard/admin/tasks/${task._id}`)}
      className={cn(
        "rounded-lg border bg-card p-3 cursor-pointer select-none",
        "hover:border-primary/40 hover:shadow-sm transition-all",
        isDragging && "shadow-lg rotate-1 opacity-90 border-primary/60",
        isDone && "opacity-60"
      )}
    >
      {/* priority dot + title */}
      <div className="flex items-start gap-2 mb-2">
        <span className={cn("h-2 w-2 rounded-full shrink-0 mt-1", priorityDot[task.priority])} />
        <p className={cn("text-sm font-medium leading-snug flex-1", isDone && "line-through text-muted-foreground")}>
          {task.title}
        </p>
        {/* priority badge */}
        <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0", priorityVariant[task.priority])}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>

      {/* overdue */}
      {overdue && (
        <div className="flex items-center gap-1 text-[11px] text-red-500 mb-2">
          <AlertTriangle className="h-3 w-3" /> Overdue · {formatDate(task.dueDate)}
        </div>
      )}

      {/* subtask progress */}
      {task.subtasks.length > 0 && (
        <div className="flex items-center gap-1.5 mb-2">
          <Progress value={subPct} className="h-1 flex-1" />
          <span className="text-[10px] text-muted-foreground shrink-0">
            {task.subtasks.filter((s) => s.isComplete).length}/{task.subtasks.length}
          </span>
        </div>
      )}

      {/* review lock notice */}
      {task.status === "review" && task.reviewApproval && (
        <div className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded px-2 py-1 mb-2">
          <Lock className="h-3 w-3" /> Admin/Manager approval required
        </div>
      )}

      {/* footer */}
      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-border/60">
        <AssigneeStack assignees={task.assignees} max={3} size="sm" />

        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          {task.attachments.length > 0 && (
            <span className="flex items-center gap-0.5">
              <Paperclip className="h-3 w-3" /> {task.attachments.length}
            </span>
          )}
          {!overdue && task.dueDate && (
            <span>{formatDate(task.dueDate)}</span>
          )}
          <span>{task.estimatedHours}h</span>
        </div>
      </div>
    </div>
  );
}
