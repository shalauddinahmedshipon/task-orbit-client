// components/sprint-detail/TaskToolbar.tsx
"use client";

import { Search, LayoutList, Columns2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TaskAssignee } from "@/types/task.types";

export type ViewMode = "list" | "kanban";

export interface TaskFilters {
  search: string;
  assignee: string;
  status: string;
  priority: string;
}

interface TaskToolbarProps {
  filters: TaskFilters;
  onFiltersChange: (f: Partial<TaskFilters>) => void;
  viewMode: ViewMode;
  onViewModeChange: (v: ViewMode) => void;
  assignees: TaskAssignee[];
  canManage: boolean;
  onAddTask: () => void;
}

export function TaskToolbar({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  assignees,
  canManage,
  onAddTask,
}: TaskToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* search */}
      <div className="relative flex-1 min-w-[160px]">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          className="pl-8 h-9 text-sm"
          placeholder="Search tasks…"
          value={filters.search}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
        />
      </div>

      {/* assignee filter */}
      <Select
        value={filters.assignee}
        onValueChange={(v) => onFiltersChange({ assignee: v })}
      >
        <SelectTrigger className="h-9 w-[140px] text-sm">
          <SelectValue placeholder="All assignees" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          {assignees.map((a) => (
            <SelectItem key={a._id} value={a._id}>
              {a.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* status filter - hidden on kanban (columns are statuses) */}
      {viewMode === "list" && (
        <Select
          value={filters.status}
          onValueChange={(v) => onFiltersChange({ status: v })}
        >
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
      )}

      {/* priority filter */}
      <Select
        value={filters.priority}
        onValueChange={(v) => onFiltersChange({ priority: v })}
      >
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

      {/* view toggle */}
      <ToggleGroup
        type="single"
        value={viewMode}
        onValueChange={(v) => v && onViewModeChange(v as ViewMode)}
        className="border rounded-md h-9"
      >
        <ToggleGroupItem value="list" className="h-9 px-3 text-sm gap-1.5">
          <LayoutList className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">List</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="kanban" className="h-9 px-3 text-sm gap-1.5">
          <Columns2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Kanban</span>
        </ToggleGroupItem>
      </ToggleGroup>

      {/* add task */}
      {canManage && (
        <Button size="sm" className="h-9" onClick={onAddTask}>
          <Plus className="h-3.5 w-3.5 mr-1.5" /> Add task
        </Button>
      )}
    </div>
  );
}
