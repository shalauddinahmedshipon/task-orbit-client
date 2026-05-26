"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Sprint } from "@/types/sprint.types";
import { formatSprintDuration, sprintCompletionPercent } from "@/utils/sprint.utils";
import { SprintStatusBadge } from "./SprintStatusBadge";

interface Props {
  sprint: Sprint;
  projectId: string;
  canManage: boolean;
  onEdit: (sprint: Sprint) => void;
  onDelete: (sprint: Sprint) => void;
  /** Whether to start expanded */
  defaultOpen?: boolean;
}

export function SprintCard({
  sprint,
  projectId,
  canManage,
  onEdit,
  onDelete,
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const stats = sprint.taskStats;
  const percent = sprintCompletionPercent(stats);
  const total = stats?.total ?? 0;
  const completed = stats?.completed ?? 0;

  const formattedStart = new Date(sprint.startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const formattedEnd = new Date(sprint.endDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Header row */}
      <div
        className="flex items-center gap-3 p-3 sm:p-4 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        {/* Expand/collapse icon */}
        <button
          className="text-muted-foreground shrink-0"
          tabIndex={-1}
          aria-label={open ? "Collapse" : "Expand"}
        >
          {open ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        {/* Sprint number badge */}
        <div className="h-7 w-7 rounded-md bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
          S{sprint.sprintNumber}
        </div>

        {/* Title + dates */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold truncate">{sprint.title}</span>
            <SprintStatusBadge sprint={sprint} />
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formattedStart} – {formattedEnd}
            </span>
            <span className="flex items-center gap-1 hidden sm:flex">
              <Clock className="h-3 w-3" />
              {formatSprintDuration(sprint.startDate, sprint.endDate)}
            </span>
          </div>
        </div>

        {/* Progress mini + task count */}
        <div className="hidden sm:flex flex-col items-end gap-1 shrink-0 w-32">
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <span>{completed}/{total} tasks</span>
            <span className="font-medium text-foreground">{percent}%</span>
          </div>
          <Progress value={percent} className="h-1.5 w-full" />
        </div>

        {/* Actions */}
        <div
          className="shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {canManage ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => onEdit(sprint)}
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit sprint
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="gap-2">
                  <Link href={`/projects/${projectId}/sprints/${sprint._id}`}>
                    <ArrowRight className="h-3.5 w-3.5" /> Open sprint board
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 text-destructive focus:text-destructive"
                  onClick={() => onDelete(sprint)}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete sprint
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" asChild>
              <Link href={`/projects/${projectId}/sprints/${sprint._id}`}>
                Open <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Expanded: stat chips + open button */}
      {open && (
        <div className="border-t px-4 py-3 bg-muted/20 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex flex-wrap gap-2">
            {[
              {
                label: "To Do",
                val: stats?.todo ?? 0,
                color: "bg-muted text-muted-foreground",
              },
              {
                label: "In Progress",
                val: stats?.inProgress ?? 0,
                color:
                  "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
              },
              {
                label: "Review",
                val: stats?.review ?? 0,
                color:
                  "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
              },
              {
                label: "Done",
                val: stats?.completed ?? 0,
                color:
                  "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
              },
            ].map(({ label, val, color }) => (
              <span
                key={label}
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}
              >
                {label}: {val}
              </span>
            ))}
          </div>

          {/* Progress on mobile (hidden in header) */}
          <div className="sm:hidden w-full space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{completed}/{total} tasks</span>
              <span className="font-medium text-foreground">{percent}%</span>
            </div>
            <Progress value={percent} className="h-1.5" />
          </div>

          <Button size="sm" variant="outline" className="h-7 gap-1 text-xs shrink-0" asChild>
            <Link href={`/projects/${projectId}/sprints/${sprint._id}`}>
              Open Board <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
