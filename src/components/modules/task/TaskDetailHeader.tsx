// components/task-detail/TaskDetailHeader.tsx
"use client";

import { format } from "date-fns";
import {
  AlertTriangle, Calendar, Clock, MoreVertical,
  Pencil, Trash2, ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { Task } from "@/types/task.types";
import { statusVariant, statusLabel, priorityVariant, isOverdue } from "@/utils/task.utils";
import { cn } from "@/lib/utils";

interface TaskDetailHeaderProps {
  task: Task;
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
}



export function TaskDetailHeader({ task, canManage, onEdit, onDelete }: TaskDetailHeaderProps) {
  const router  = useRouter();
  const overdue = isOverdue(task.dueDate, task.status);




  return (
    <div className="space-y-3">
      {/* breadcrumb */}
     {/* breadcrumb */}
<div className="flex items-center gap-2">
  <Button
    variant="ghost"
    size="icon"
    className="h-7 w-7 shrink-0"
    onClick={() => router.back()}
  >
    <ArrowLeft className="h-4 w-4" />
  </Button>

  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/dashboard/admin/projects">
          Projects
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbSeparator />

      {/* project */}
      <BreadcrumbItem>
        <BreadcrumbLink
          href={`/dashboard/admin/projects/${task.projectId._id}`}
          className="max-w-[140px] truncate"
        >
          {task.projectId.title}
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbSeparator />

      {/* sprint */}
      <BreadcrumbItem>
        <BreadcrumbLink
          href={`/dashboard/admin/projects/${task.projectId._id}/sprint/${task.sprintId._id}`}
          className="max-w-[120px] truncate"
        >
          {task.sprintId.title}
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbSeparator />

      {/* task */}
      <BreadcrumbItem>
        <BreadcrumbPage className="max-w-[220px] truncate">
          {task.title}
        </BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</div>

      {/* title + actions */}
      <div className="flex items-start gap-3 justify-between">
        <div className="space-y-2 flex-1 min-w-0">
          <h1 className="text-xl font-semibold sm:text-2xl leading-snug">{task.title}</h1>

          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", statusVariant[task.status])}>
              {statusLabel[task.status]}
            </span>
            <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", priorityVariant[task.priority])}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} priority
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> {task.estimatedHours}h estimated
            </span>
            <span className={cn("flex items-center gap-1 text-xs", overdue ? "text-red-500 font-medium" : "text-muted-foreground")}>
              {overdue && <AlertTriangle className="h-3.5 w-3.5" />}
              <Calendar className="h-3.5 w-3.5" />
              Due {format(new Date(task.dueDate), "MMM d, yyyy")}
              {overdue && " · Overdue"}
            </span>
          </div>
        </div>

        {canManage && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4" /> Edit task
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-red-600 focus:text-red-600">
                <Trash2 className="mr-2 h-4 w-4" /> Delete task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
