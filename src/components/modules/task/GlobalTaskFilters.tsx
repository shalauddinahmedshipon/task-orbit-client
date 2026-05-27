// components/global-tasks/GlobalTaskFilters.tsx
"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { Project } from "@/types/project.types";
import type { TaskAssignee } from "@/types/task.types";

export interface GlobalTaskFilters {
  search:    string;
  projectId: string;
  status:    string;
  priority:  string;
  assignee:  string;
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
  filters, onChange, onClear,
  projects, members, hasActiveFilters,showAssignee=true
}: GlobalTaskFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* search */}
      <div className="relative flex-1 min-w-[160px]">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          className="pl-8 h-9 text-sm"
          placeholder="Search tasks…"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </div>

      {/* project */}
      <Select value={filters.projectId} onValueChange={(v) => onChange({ projectId: v })}>
        <SelectTrigger className="h-9 w-[150px] text-sm">
          <SelectValue placeholder="All projects" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All projects</SelectItem>
          {projects.map((p) => (
            <SelectItem key={p._id} value={p._id}>{p.title}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* status */}
      <Select value={filters.status} onValueChange={(v) => onChange({ status: v })}>
        <SelectTrigger className="h-9 w-[130px] text-sm">
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

      {/* priority */}
      <Select value={filters.priority} onValueChange={(v) => onChange({ priority: v })}>
        <SelectTrigger className="h-9 w-[130px] text-sm">
          <SelectValue placeholder="All priorities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      {/* assignee */}
    {showAssignee !== false && (
  <Select value={filters.assignee} onValueChange={(v) => onChange({ assignee: v })}>
    <SelectTrigger className="h-9 w-[140px] text-sm">
      <SelectValue placeholder="All assignees" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="all">All assignees</SelectItem>
      {members.map((m) => (
        <SelectItem key={m._id} value={m._id}>
          {m.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)}

      {/* clear */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" className="h-9 text-xs gap-1.5" onClick={onClear}>
          <X className="h-3.5 w-3.5" /> Clear
        </Button>
      )}
    </div>
  );
}
