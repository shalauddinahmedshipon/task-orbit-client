"use client";

import Link from "next/link";
import { MoreHorizontal, FolderOpen, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import type { Project } from "@/types/project.types";
import { formatBudget, formatDateRange, getCompletionPercent } from "@/utils/project.utils";
import { ProjectStatusBadge } from "./Projectstatusbadge";
import { MemberAvatars } from "./MemberAvatars";

interface Props {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectTableView({ projects, onEdit, onDelete }: Props) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center rounded-lg border bg-card">
        <FolderOpen className="h-12 w-12 text-muted-foreground/40 mb-4" />
        <p className="text-sm font-medium text-muted-foreground">No projects found</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Try adjusting your filters or create a new project.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-[260px]">
                <button className="flex items-center gap-1 text-xs font-semibold hover:text-foreground">
                  Project <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead className="hidden sm:table-cell">Client</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden lg:table-cell w-[180px]">Progress</TableHead>
              <TableHead className="hidden xl:table-cell">Timeline</TableHead>
              <TableHead className="hidden lg:table-cell text-right">Budget</TableHead>
              <TableHead className="hidden md:table-cell">Team</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => {
              const percent = getCompletionPercent(project.taskStats);
              const total = project.taskStats?.total ?? 0;
              const completed = project.taskStats?.completed ?? 0;

              return (
                <TableRow key={project._id} className="group">
                  {/* Project name */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* Thumbnail / letter */}
                      <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center overflow-hidden shrink-0">
                        {project.thumbnail ? (
                          <img
                            src={project.thumbnail}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-bold text-muted-foreground">
                            {project.title.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/projects/${project._id}`}
                          className="text-sm font-medium hover:underline underline-offset-2 truncate block"
                        >
                          {project.title}
                        </Link>
                        {/* Client shown inline on small screens */}
                        <p className="text-xs text-muted-foreground truncate sm:hidden">
                          {project.client}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {project.client}
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    <ProjectStatusBadge status={project.status} />
                  </TableCell>

                  <TableCell className="hidden lg:table-cell">
                    <div className="space-y-1 min-w-[140px]">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{completed}/{total} tasks</span>
                        <span className="font-medium text-foreground">{percent}%</span>
                      </div>
                      <Progress value={percent} className="h-1.5" />
                    </div>
                  </TableCell>

                  <TableCell className="hidden xl:table-cell text-xs text-muted-foreground whitespace-nowrap">
                    {formatDateRange(project.startDate, project.endDate)}
                  </TableCell>

                  <TableCell className="hidden lg:table-cell text-right text-sm font-medium tabular-nums">
                    {formatBudget(project.budget)}
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    <MemberAvatars members={project.members} max={3} />
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/projects/${project._id}`}>
                            View project
                          </Link>
                        </DropdownMenuItem>
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
