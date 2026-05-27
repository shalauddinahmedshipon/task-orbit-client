"use client";
import Link from "next/link";
import { MoreHorizontal, Calendar, DollarSign, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
import { formatBudget, getCompletionPercent } from "@/utils/project.utils";
import { ProjectStatusBadge } from "./Projectstatusbadge";
import { MemberAvatars } from "./MemberAvatars";

interface Props {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: Props) {
  const percent = getCompletionPercent(project.taskStats);
  const total = project.taskStats?.total ?? 0;
  const completed = project.taskStats?.completed ?? 0;

  return (
    <Card className="group flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      {/* Thumbnail / colour band */}
      <div className="relative h-32 bg-gradient-to-br from-muted/60 to-muted overflow-hidden">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-4xl font-bold text-muted-foreground/20 select-none">
              {project.title.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}

        {/* Status badge — top right */}
        <div className="absolute top-2.5 right-2.5">
          <ProjectStatusBadge status={project.status} />
        </div>

        {/* Actions menu — top left, shown on hover */}
         {
            onEdit&&onDelete&&(
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7 shadow-sm"
                onClick={(e) => e.preventDefault()}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
          
                <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => onEdit(project)}>
                Edit project
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(project)}
              >
                Delete project
              </DropdownMenuItem>
            </DropdownMenuContent>
         
          </DropdownMenu>
        </div>

         )}
      </div>

           

      {/* Body */}
      <CardHeader className=" px-4">
        <Link
          href={`projects/${project._id}`}
          className="font-semibold text-sm leading-snug hover:underline underline-offset-2 line-clamp-1"
        >
          {project.title}
        </Link>
        <p className="text-xs text-muted-foreground ">{project.client}</p>
      </CardHeader>

      <CardContent className="px-4 pb-0 flex-1 space-y-1">
        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {completed}/{total} tasks
            </span>
            <span className="font-medium text-foreground">{percent}%</span>
          </div>
          <Progress value={percent} className="h-1.5" />
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 pt-2 gap-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 truncate">
            <DollarSign className="h-3 w-3 shrink-0" />
            {formatBudget(project.budget)}
          </span>
          <span className="flex items-center gap-1 truncate">
            <Calendar className="h-3 w-3 shrink-0" />
            {new Date(project.endDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </CardContent>

      <CardFooter className="px-4 py-3 border-t flex items-center justify-between">
        <MemberAvatars members={project.members} max={4} />
        <Link
          href={`projects/${project._id}`}
          className="text-xs font-medium text-primary hover:underline"
        >
          Open →
        </Link>
      </CardFooter>
    </Card>
  );
}
