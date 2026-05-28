// components/admin-dashboard/ReviewQueue.tsx
"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  AlertCircle, ArrowRight, CheckCircle2,
  Clock, RotateCcw, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllTasksQuery, useApproveTaskMutation } from "@/store/api/task.api";
import { priorityVariant, priorityDot, isOverdue, formatDate } from "@/utils/task.utils";
import { cn } from "@/lib/utils";
import { AssigneeStack } from "../sprint/AssigneeStack";

export function ReviewQueue() {
  const router = useRouter();
  const { data: tasks = [], isLoading } = useGetAllTasksQuery({ status: "review" });
  const [approveTask, { isLoading: approving }] = useApproveTaskMutation();

  // Only tasks that require manager approval
  const reviewTasks = tasks.filter((t) => t.reviewApproval);

  const handleApprove = async (taskId: string, approved: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await approveTask({ id: taskId, approved }).unwrap();
      toast.success(approved ? "Task approved → Done" : "Task sent back to In Progress");
    } catch {
      toast.error("Failed to update task");
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-5 space-y-3">
        <Skeleton className="h-5 w-40" />
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-5">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <h3 className="text-sm font-semibold">Pending Review</h3>
          {reviewTasks.length > 0 && (
            <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 rounded-full px-2 py-0.5 font-medium">
              {reviewTasks.length}
            </span>
          )}
        </div>
        <Button
          variant="ghost" size="sm" className="h-7 text-xs gap-1"
          onClick={() => router.push("/dashboard/admin/tasks?status=review")}
        >
          View all <ArrowRight className="h-3 w-3" />
        </Button>
      </div>

      {reviewTasks.length === 0 ? (
        <div className="flex flex-col items-center py-8 gap-2 text-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          <p className="text-sm font-medium">All clear!</p>
          <p className="text-xs text-muted-foreground">No tasks waiting for your approval</p>
        </div>
      ) : (
        <div className="space-y-2">
          {reviewTasks.slice(0, 6).map((task) => {
            const overdue = isOverdue(task.dueDate, task.status);
            const projTitle = typeof task.projectId === "object"
              ? (task.projectId as any).title
              : "—";

            return (
              <div
                key={task._id}
                onClick={() => router.push(`/dashboard/admin/tasks/${task._id}`)}
                className="group flex items-center gap-3 rounded-lg border bg-background p-3 cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all"
              >
                {/* priority dot */}
                <span className={cn("h-2 w-2 rounded-full shrink-0", priorityDot[task.priority])} />

                {/* task info */}
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
                    {overdue && (
                      <span className="flex items-center gap-0.5 text-[10px] text-red-500 font-medium">
                        <AlertCircle className="h-3 w-3" /> overdue
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <Clock className="h-3 w-3" /> {formatDate(task.dueDate)}
                    </span>
                  </div>
                </div>

                {/* assignees */}
                <AssigneeStack assignees={task.assignees} max={2} size="sm" />

                {/* approve / reject buttons */}
                <div
                  className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    size="sm"
                    className="h-7 px-2 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={(e) => handleApprove(task._id, true, e)}
                    disabled={approving}
                  >
                    {approving ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                    <span className="ml-1 hidden sm:inline">Approve</span>
                  </Button>
                  <Button
                    size="sm" variant="outline"
                    className="h-7 px-2 text-[11px] text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800"
                    onClick={(e) => handleApprove(task._id, false, e)}
                    disabled={approving}
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span className="ml-1 hidden sm:inline">Reject</span>
                  </Button>
                </div>
              </div>
            );
          })}

          {reviewTasks.length > 6 && (
            <button
              onClick={() => router.push("/dashboard/admin/tasks?status=review")}
              className="w-full text-xs text-muted-foreground hover:text-foreground py-2 text-center transition-colors"
            >
              +{reviewTasks.length - 6} more tasks in review →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
