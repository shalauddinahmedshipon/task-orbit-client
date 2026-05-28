"use client";

import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Project } from "@/types/project.types";
import type { TaskAssignee } from "@/types/task.types";

export interface GlobalTaskFilters {
  search: string;
  projectId: string;
  status: string;
  priority: string;
  assignee: string;
}

interface GlobalTaskFiltersProps {
  filters: GlobalTaskFilters;
  onChange: (partial: Partial<GlobalTaskFilters>) => void;
  onClear: () => void;
  projects: Project[];
  members: TaskAssignee[];
  hasActiveFilters: boolean;
  showAssignee?: boolean;
}

export function GlobalTaskFiltersBar({
  filters,
  onChange,
  onClear,
  projects,
  members,
  hasActiveFilters,
  showAssignee = true,
}: GlobalTaskFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 w-full">
      {/* Search */}
      <div className="relative w-full sm:flex-1 sm:min-w-[220px]">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />

        <Input
          placeholder="Search tasks…"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          className="h-9 pl-8 text-sm w-full"
        />
      </div>

      {/* Project */}
      <Select
        value={filters.projectId}
        onValueChange={(v) => onChange({ projectId: v })}
      >
        <SelectTrigger className="h-9 w-full sm:w-[150px] text-sm">
          <SelectValue placeholder="All projects" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All projects</SelectItem>

          {projects.map((project) => (
            <SelectItem key={project._id} value={project._id}>
              {project.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status */}
      <Select
        value={filters.status}
        onValueChange={(v) => onChange({ status: v })}
      >
        <SelectTrigger className="h-9 w-full sm:w-[130px] text-sm">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="todo">To Do</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="review">Review</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </SelectContent>
      </Select>

      {/* Priority */}
      <Select
        value={filters.priority}
        onValueChange={(v) => onChange({ priority: v })}
      >
        <SelectTrigger className="h-9 w-full sm:w-[130px] text-sm">
          <SelectValue placeholder="All priorities" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      {/* Assignee */}
      {showAssignee !== false && (
        <Select
          value={filters.assignee}
          onValueChange={(v) => onChange({ assignee: v })}
        >
          <SelectTrigger className="h-9 w-full sm:w-[140px] text-sm">
            <SelectValue placeholder="All assignees" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All assignees</SelectItem>

            {members.map((member) => (
              <SelectItem key={member._id} value={member._id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Clear */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-9 w-full sm:w-auto text-xs gap-1.5"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
}