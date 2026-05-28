"use client";

import { useRouter } from "next/navigation";
import {
  AlertTriangle, ExternalLink, MoreHorizontal, Pencil, Trash2,
} from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Task } from "@/types/task.types";
import {
  statusLabel, statusVariant, priorityVariant, priorityDot,
  isOverdue, formatDate, subtaskProgress,
} from "@/utils/task.utils";
import { cn } from "@/lib/utils";
import { AssigneeStack } from "../sprint/AssigneeStack";

interface GlobalTaskTableProps {
  tasks:     Task[];
  canManage: boolean;
  onEdit:    (task: Task) => void;
  onDelete:  (task: Task) => void;
}

export function GlobalTaskTable({ tasks, canManage, onEdit, onDelete }: GlobalTaskTableProps) {
  const router = useRouter();

  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/30 py-16 text-center">
        <p className="text-sm text-muted-foreground">No tasks match your filters.</p>
      </div>
    );
  }

  const taskPath = (id: string) => `/dashboard/admin/tasks/${id}`;

  return (
    <>
      {/* ── Mobile card list (hidden on md+) ─────────────────────────── */}
      <div className="flex flex-col gap-2 md:hidden">
        {tasks.map((task) => {
          const overdue = isOverdue(task.dueDate, task.status);
          const isDone  = task.status === "done";
          const subPct  = subtaskProgress(task.subtasks);

          return (
            <div
              key={task._id}
              onClick={() => router.push(taskPath(task._id))}
              className={cn(
                "rounded-xl border bg-card p-3 cursor-pointer active:bg-muted/50 transition-colors",
                isDone && "opacity-60"
              )}
            >
              {/* Top row: priority dot + title + actions */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className={cn("h-2 w-2 rounded-full shrink-0 mt-1", priorityDot[task.priority])} />
                  <span className={cn(
                    "text-sm font-medium line-clamp-2 leading-snug",
                    isDone && "line-through text-muted-foreground"
                  )}>
                    {task.title}
                  </span>
                </div>

                {canManage && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(taskPath(task._id))}>
                          <ExternalLink className="mr-2 h-3.5 w-3.5" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(task)}>
                          <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(task)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>

              {/* Meta chips row */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {/* Project */}
                <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                  {typeof task.projectId === "object" ? (task.projectId as any).title : "—"}
                </span>

                <span className="text-muted-foreground/40 text-xs">·</span>

                {/* Status */}
                <span className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                  statusVariant[task.status]
                )}>
                  {statusLabel[task.status]}
                </span>

                {/* Priority */}
                <span className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                  priorityVariant[task.priority]
                )}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>

                {/* Due date */}
                <span className={cn(
                  "flex items-center gap-0.5 text-[10px] ml-auto",
                  overdue ? "text-red-500 font-medium" : "text-muted-foreground"
                )}>
                  {overdue && <AlertTriangle className="h-3 w-3" />}
                  {formatDate(task.dueDate)}
                </span>
              </div>

              {/* Bottom row: assignees + subtasks + hours */}
              <div className="flex items-center gap-3 mt-2">
                <AssigneeStack assignees={task.assignees} max={3} />

                {task.subtasks.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-1 max-w-[100px]">
                    <Progress value={subPct} className="h-1.5 flex-1" />
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {task.subtasks.filter((s) => s.isComplete).length}/{task.subtasks.length}
                    </span>
                  </div>
                )}

                <span className="text-[10px] text-muted-foreground ml-auto">
                  {task.estimatedHours}h est.
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Desktop table (hidden below md) ──────────────────────────── */}
      <div className="hidden md:block rounded-xl border overflow-hidden">
        {/* ✅ overflow-x-auto on the inner wrapper only — page layout stays intact */}
        <div className="overflow-x-auto">
          <Table className="min-w-[860px]">
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="min-w-[200px]">Task</TableHead>
                <TableHead className="min-w-[130px]">Project</TableHead>
                <TableHead className="min-w-[100px]">Assignees</TableHead>
                <TableHead className="w-[90px]">Priority</TableHead>
                <TableHead className="w-[110px]">Status</TableHead>
                <TableHead className="min-w-[110px]">Subtasks</TableHead>
                <TableHead className="w-[60px]">Est.</TableHead>
                <TableHead className="w-[95px]">Due</TableHead>
                {canManage && <TableHead className="w-[48px]" />}
              </TableRow>
            </TableHeader>

            <TableBody>
              {tasks.map((task) => {
                const overdue = isOverdue(task.dueDate, task.status);
                const subPct  = subtaskProgress(task.subtasks);
                const isDone  = task.status === "done";

                return (
                  <TableRow
                    key={task._id}
                    className={cn("cursor-pointer group", isDone && "opacity-60")}
                    onClick={() => router.push(taskPath(task._id))}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={cn("h-2 w-2 rounded-full shrink-0", priorityDot[task.priority])} />
                        <span className={cn(
                          "text-sm font-medium truncate max-w-[200px] block",
                          isDone && "line-through text-muted-foreground"
                        )}>
                          {task.title}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-muted-foreground truncate max-w-[130px] block">
                        {typeof task.projectId === "object" ? (task.projectId as any).title : "—"}
                      </span>
                    </TableCell>

                    <TableCell>
                      <AssigneeStack assignees={task.assignees} max={2} />
                    </TableCell>

                    <TableCell>
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
                        priorityVariant[task.priority]
                      )}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
                        statusVariant[task.status]
                      )}>
                        {statusLabel[task.status]}
                      </span>
                    </TableCell>

                    <TableCell>
                      {task.subtasks.length > 0 ? (
                        <div className="flex items-center gap-1.5 min-w-[80px]">
                          <Progress value={subPct} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {task.subtasks.filter((s) => s.isComplete).length}/{task.subtasks.length}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-muted-foreground">{task.estimatedHours}h</span>
                    </TableCell>

                    <TableCell>
                      <span className={cn(
                        "flex items-center gap-1 text-xs whitespace-nowrap",
                        overdue ? "text-red-500 font-medium" : "text-muted-foreground"
                      )}>
                        {overdue && <AlertTriangle className="h-3 w-3 shrink-0" />}
                        {formatDate(task.dueDate)}
                      </span>
                    </TableCell>

                    {canManage && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(taskPath(task._id))}>
                              <ExternalLink className="mr-2 h-3.5 w-3.5" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(task)}>
                              <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onDelete(task)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
