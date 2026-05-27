// components/task-detail/TaskSidebar.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Bolt, Calendar, CheckCircle2, Clock, FolderKanban,
  Lock, RotateCcw, User, Users, XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUpdateTaskMutation, useUpdateTaskStatusMutation, useApproveTaskMutation } from "@/store/api/task.api";
import type { Task, TaskStatus } from "@/types/task.types";
import type { TimeLog } from "@/types/task-detail.types";
import { statusLabel, statusVariant, initials, avatarColor } from "@/utils/task.utils";
import { cn } from "@/lib/utils";

interface TaskSidebarProps {
  task: Task;
  timeLogs: TimeLog[];
  userRole: "admin" | "manager" | "member";
  currentUserId: string;
  totalLogged: number;
}

const META_ROW = "flex flex-col gap-1 py-3 border-b last:border-0";
const META_LABEL = "text-[11px] font-medium text-muted-foreground uppercase tracking-wide";

export function TaskSidebar({ task, timeLogs, userRole, currentUserId, totalLogged }: TaskSidebarProps) {
  const canManage = userRole === "admin" || userRole === "manager";
  const [updateTask]       = useUpdateTaskMutation();
  const [updateStatus]     = useUpdateTaskStatusMutation();
  const [approveTask, { isLoading: approving }] = useApproveTaskMutation();

const memberStatusOptions: Record<TaskStatus, TaskStatus[]> = {
  todo: ["in-progress"],

  // if approval required → go to review
  // otherwise → directly done
  "in-progress": task.reviewApproval
    ? ["review"]
    : ["done"],

  review: task.reviewApproval
    ? []
    : ["done"],

  done: [],
};

  const logPct = task.estimatedHours
    ? Math.min(100, Math.round((totalLogged / task.estimatedHours) * 100))
    : 0;
  const overBudget = totalLogged > task.estimatedHours;

  // ── status change ────────────────────────────────────────────────────────
  const handleStatusChange = async (status: TaskStatus) => {
    if (status === "done" && task.reviewApproval) {
      toast.warning("This task requires manager approval before moving to Done.");
      return;
    }
    try {
      if (canManage) {
        await updateTask({ id: task._id, data: { status } }).unwrap();
      } else {
        await updateStatus({ id: task._id, status }).unwrap();
      }
      toast.success(`Status updated to ${statusLabel[status]}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  // ── approval ─────────────────────────────────────────────────────────────
  const handleApprove = async (approved: boolean) => {
    try {
      await approveTask({ id: task._id, approved }).unwrap();
      toast.success(approved ? "Task approved and moved to Done" : "Task sent back to In Progress");
    } catch {
      toast.error("Failed to update task");
    }
  };

  return (
    <div className="rounded-xl border bg-card p-4 space-y-0 divide-y-0">

      {/* ── status ──────────────────────────────────────────────────────── */}
      <div className={META_ROW}>
        <span className={META_LABEL}>Status</span>
        {canManage || userRole === "member" ? (
          <Select value={task.status} onValueChange={(v) => handleStatusChange(v as TaskStatus)}>
            <SelectTrigger className="h-8 text-sm mt-1">
              <SelectValue />
            </SelectTrigger>
            {/* <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
             
              {(canManage || !task.reviewApproval) && (
                <SelectItem value="done">Done</SelectItem>
              )}
            </SelectContent> */}
         <SelectContent>
  {canManage ? (
    <>
      <SelectItem value="todo">To Do</SelectItem>
      <SelectItem value="in-progress">In Progress</SelectItem>
      <SelectItem value="review">Review</SelectItem>

      {/* admin/manager always see done */}
      <SelectItem value="done">Done</SelectItem>
    </>
  ) : (
    <>
      {/* current status */}
      <SelectItem value={task.status}>
        {statusLabel[task.status]}
      </SelectItem>

      {/* allowed next statuses */}
      {memberStatusOptions[task.status].map((status) => (
        <SelectItem key={status} value={status}>
          {statusLabel[status]}
        </SelectItem>
      ))}
    </>
  )}
</SelectContent>
          </Select>
        ) : (
          <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium w-fit mt-1", statusVariant[task.status])}>
            {statusLabel[task.status]}
          </span>
        )}
      </div>

      {/* ── assignees ───────────────────────────────────────────────────── */}
<div className={META_ROW}>
  <span className={META_LABEL}>Assignees</span>

  <div className="flex flex-wrap gap-2 mt-1.5">
    {task.assignees.length > 0 ? (
      task.assignees.map((a, i) => (
        <Tooltip key={a._id}>
          <TooltipTrigger asChild>
            {a.avatarUrl ? (
              <img
                src={a.avatarUrl}
                alt={a.name}
                className="h-7 w-7 rounded-full object-cover border-2 border-background"
              />
            ) : (
              <div
                className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-semibold border-2 border-background",
                  avatarColor(i)
                )}
              >
                {initials(a.name)}
              </div>
            )}
          </TooltipTrigger>

          <TooltipContent side="top">
            <p className="font-medium">{a.name}</p>

            {/* role (optional, if backend provides it) */}
            {a.role && (
              <p className="text-[10px] text-muted-foreground capitalize">
                {a.role}
              </p>
            )}

            <p className="text-xs text-muted-foreground">{a.email}</p>
          </TooltipContent>
        </Tooltip>
      ))
    ) : (
      <span className="text-xs text-muted-foreground">Unassigned</span>
    )}
  </div>
</div>




      {/* ── sprint / project ─────────────────────────────────────────────── */}
      {/* ── project ───────────────────────────────────────────────────── */}
<div className={META_ROW}>
  <span className={META_LABEL}>Project</span>

  <div className="flex items-start gap-2 mt-1">
    <FolderKanban className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />

    <div className="min-w-0">
      <p className="text-sm font-medium leading-none truncate">
        {task.projectId.title}
      </p>

      {task.projectId.client && (
        <p className="text-xs text-muted-foreground mt-1">
          Client: {task.projectId.client}
        </p>
      )}
    </div>
  </div>
</div>

{/* ── sprint ───────────────────────────────────────────────────── */}
<div className={META_ROW}>
  <span className={META_LABEL}>Sprint</span>

  <div className="flex items-start gap-2 mt-1">
    <Bolt className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />

    <div className="min-w-0">
      <p className="text-sm font-medium leading-none">
        {task.sprintId.title}
      </p>

      <p className="text-xs text-muted-foreground mt-1">
        Sprint #{task.sprintId.sprintNumber}
      </p>

      <p className="text-xs text-muted-foreground">
        {format(new Date(task.sprintId.startDate!), "MMM d")} —{" "}
        {format(new Date(task.sprintId.endDate!), "MMM d, yyyy")}
      </p>
    </div>
  </div>
</div>

      <div className={META_ROW}>
        <span className={META_LABEL}>Due date</span>
        <span className="flex items-center gap-1.5 text-sm mt-1 text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          {format(new Date(task.dueDate), "MMM d, yyyy")}
        </span>
      </div>

      <div className={META_ROW}>
        <span className={META_LABEL}>Estimated hours</span>
        <span className="flex items-center gap-1.5 text-sm mt-1 text-muted-foreground">
          <Clock className="h-3.5 w-3.5" /> {task.estimatedHours}h
        </span>
      </div>

      {task.reviewApproval && (
        <div className={META_ROW}>
          <span className={META_LABEL}>Review approval</span>
          <span className="flex items-center gap-1.5 text-xs mt-1 text-amber-600 dark:text-amber-400">
            <Lock className="h-3.5 w-3.5" /> Required before Done
          </span>
        </div>
      )}

      {/* ── time log summary ─────────────────────────────────────────────── */}
      <div className="pt-3">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className={META_LABEL}>Time logged</span>
          <span className={cn("font-medium", overBudget ? "text-red-500" : "text-muted-foreground")}>
            {totalLogged}h / {task.estimatedHours}h
          </span>
        </div>
        <Progress
          value={logPct}
          className={cn("h-1.5", overBudget && "[&>div]:bg-red-500")}
        />
        {timeLogs.slice(0, 3).map((log, i) => (
          <div key={log._id} className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <div className={cn("h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-semibold shrink-0", avatarColor(i))}>
              {initials(log.userId.name)}
            </div>
            <span className="flex-1 truncate">{log.userId.name}</span>
            <span className="font-medium text-foreground">{log.hours}h</span>
            <span>{format(new Date(log.logDate), "MMM d")}</span>
          </div>
        ))}
      </div>


      {/* ── created by ─────────────────────────────────────────────────── */}
<div className={META_ROW}>
  <span className={META_LABEL}>Created by</span>

  <div className="flex items-center gap-2 mt-1.5">
    {task.createdBy.avatarUrl ? (
      <img
        src={task.createdBy.avatarUrl}
        alt={task.createdBy.name}
        className="h-8 w-8 rounded-full object-cover border shrink-0"
      />
    ) : (
      <div
        className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0",
          avatarColor(999)
        )}
      >
        {initials(task.createdBy.name)}
      </div>
    )}

    <div className="min-w-0">
      <p className="text-sm font-medium truncate">
        {task.createdBy.name}
      </p>

      <div className="flex items-center gap-2 flex-wrap mt-0.5">
        {task.createdBy.role && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {task.createdBy.role}
          </span>
        )}

        <span className="text-xs text-muted-foreground truncate">
          {task.createdBy.email}
        </span>
      </div>
    </div>
  </div>
</div>

      {/* ── manager approval panel ───────────────────────────────────────── */}
      {canManage && task.status === "review" && task.reviewApproval && (
        <div className="pt-3 space-y-2">
          <Separator />
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-3">
            <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Manager approval required
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Review this task and approve to move it to Done, or send it back for rework.
            </p>
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-8"
                onClick={() => handleApprove(true)}
                disabled={approving}
              >
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Approve & mark done
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30"
                onClick={() => handleApprove(false)}
                disabled={approving}
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Send back to In Progress
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
