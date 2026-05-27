// components/global-tasks/GlobalTaskTable.tsx
"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, ExternalLink, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Task } from "@/types/task.types";
import {
  statusLabel, statusVariant, priorityVariant,
  priorityDot, isOverdue, formatDate, subtaskProgress,
} from "@/utils/task.utils";
import { cn } from "@/lib/utils";
import { AssigneeStack } from "../sprint/AssigneeStack";

interface GlobalTaskTableProps {
  tasks: Task[];
  canManage: boolean;
  onEdit:   (task: Task) => void;
  onDelete: (task: Task) => void;
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

  return (
    <div className="rounded-xl border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="min-w-[220px]">Task</TableHead>
              <TableHead className="min-w-[130px]">Project</TableHead>
              <TableHead className="min-w-[100px]">Assignees</TableHead>
              <TableHead className="w-[90px]">Priority</TableHead>
              <TableHead className="w-[110px]">Status</TableHead>
              <TableHead className="w-[90px]">Subtasks</TableHead>
              <TableHead className="w-[70px]">Est.</TableHead>
              <TableHead className="w-[90px]">Due</TableHead>
              {canManage && <TableHead className="w-[52px]" />}
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
                  onClick={() => router.push(`/dashboard/admin/tasks/${task._id}`)}
                >
                  {/* title */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full shrink-0", priorityDot[task.priority])} />
                      <span className={cn("text-sm font-medium line-clamp-1", isDone && "line-through text-muted-foreground")}>
                        {task.title.length<20?task.title:`${task.title.slice(0,20)}...`}
                      </span>
                    </div>
                  </TableCell>

                  {/* project name — task.projectId is a string ID so we show it truncated */}
                  <TableCell>
                    <span className="text-xs text-muted-foreground truncate max-w-[120px] inline-block">
                      {/* Ideally pass project title map; fallback to ID */}
                      {typeof task.projectId === "object"
                        ? (task.projectId as any).title
                        : "—"}
                    </span>
                  </TableCell>

                  {/* assignees */}
                  <TableCell>
                    <AssigneeStack assignees={task.assignees} max={2} />
                  </TableCell>

                  {/* priority */}
                  <TableCell>
                    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", priorityVariant[task.priority])}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </TableCell>

                  {/* status */}
                  <TableCell>
                    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", statusVariant[task.status])}>
                      {statusLabel[task.status]}
                    </span>
                  </TableCell>

                  {/* subtasks */}
                  <TableCell>
                    {task.subtasks.length > 0 ? (
                      <div className="flex items-center gap-1.5 min-w-[60px]">
                        <Progress value={subPct} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {task.subtasks.filter((s) => s.isComplete).length}/{task.subtasks.length}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* est. hours */}
                  <TableCell>
                    <span className="text-xs text-muted-foreground">{task.estimatedHours}h</span>
                  </TableCell>

                  {/* due date */}
                  <TableCell>
                    <span className={cn("flex items-center gap-1 text-xs whitespace-nowrap",
                      overdue ? "text-red-500 font-medium" : "text-muted-foreground"
                    )}>
                      {overdue && <AlertTriangle className="h-3 w-3" />}
                      {formatDate(task.dueDate)}
                    </span>
                  </TableCell>

                  {/* actions */}
                  {canManage && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/tasks/${task._id}`)}>
                            <ExternalLink className="mr-2 h-3.5 w-3.5" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(task)}>
                            <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onDelete(task)} className="text-red-600 focus:text-red-600">
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
  );
}
