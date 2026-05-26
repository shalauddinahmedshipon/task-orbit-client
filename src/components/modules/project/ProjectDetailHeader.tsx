"use client";

import Link from "next/link";
import {
  ChevronLeft,
  Calendar,
  DollarSign,
  User,
  MoreHorizontal,
  Pencil,
  Trash2,
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


import type { Project } from "@/types/project.types";
import { formatBudget, formatDateRange, getCompletionPercent } from "@/utils/project.utils";
import { ProjectStatusBadge } from "./Projectstatusbadge";

interface Props {
  project: Project;
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProjectDetailHeader({
  project,
  canManage,
  onEdit,
  onDelete,
}: Props) {
  const percent = getCompletionPercent(project.taskStats);
  const total = project.taskStats?.total ?? 0;
  const completed = project.taskStats?.completed ?? 0;

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* Thumbnail / colour band */}
      <div className="relative h-36 sm:h-44 bg-gradient-to-br from-muted/80 to-muted">
        {project.thumbnail && (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        )}
        {/* Gradient overlay so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Back link */}
        <div className="absolute top-3 left-3">
          <Button
            variant="secondary"
            size="sm"
            className="h-7 gap-1 text-xs"
            asChild
          >
            <Link href="/dashboard/admin/projects">
              <ChevronLeft className="h-3.5 w-3.5" />
              Projects
            </Link>
          </Button>
        </div>

        {/* Actions — top right */}
        {canManage && (
          <div className="absolute top-3 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit} className="gap-2">
                  <Pencil className="h-3.5 w-3.5" /> Edit project
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onDelete}
                  className="gap-2 text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Title block pinned to bottom */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <ProjectStatusBadge status={project.status} />
            </div>
            <h1 className="text-lg sm:text-2xl font-bold text-white leading-tight line-clamp-1">
              {project.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Meta row */}
      <div className="px-4 py-4 space-y-4">
        {/* Description */}
        {project.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Key facts grid */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <User className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{project.client}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <DollarSign className="h-3.5 w-3.5 shrink-0" />
            <span>{formatBudget(project.budget)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground col-span-2 sm:col-span-2">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>{formatDateRange(project.startDate, project.endDate)}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {completed}/{total} tasks completed
            </span>
            <span className="font-semibold text-foreground">{percent}%</span>
          </div>
          <Progress value={percent} className="h-2" />
        </div>

        {/* Quick stat chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            {
              label: "Total",
              val: project.taskStats?.total ?? 0,
              color: "bg-muted text-muted-foreground",
            },
            {
              label: "Done",
              val: project.taskStats?.completed ?? 0,
              color:
                "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
            },
            {
              label: "In Progress",
              val: project.taskStats?.inProgress ?? 0,
              color:
                "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
            },
            {
              label: "Review",
              val: project.taskStats?.review ?? 0,
              color:
                "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
            },
          ].map(({ label, val, color }) => (
            <div
              key={label}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}
            >
              {label}: {val}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
