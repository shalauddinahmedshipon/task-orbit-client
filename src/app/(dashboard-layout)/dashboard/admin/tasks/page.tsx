// app/dashboard/admin/tasks/page.tsx
"use client";

import { useMemo, useState } from "react";
import { ClipboardList } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";



// RTK
import { useGetAllTasksQuery } from "@/store/api/task.api";

// Redux
import { useAppSelector } from "@/store/hooks";
import type { Task, TaskAssignee } from "@/types/task.types";
import { GlobalTaskFilters, GlobalTaskFiltersBar } from "@/components/modules/task/GlobalTaskFilters";
import { useGetProjectsQuery } from "@/store/api/project.api";
import { GlobalTaskStats } from "@/components/modules/task/GlobalTaskStats";
import { GlobalTaskTable } from "@/components/modules/task/GlobalTaskTable";
import { TaskFormModal } from "@/components/modules/task/TaskFormModal";
import { DeleteTaskDialog } from "@/components/modules/task/DeleteTaskDialog";

const DEFAULT_FILTERS: GlobalTaskFilters = {
  search:    "",
  projectId: "all",
  status:    "all",
  priority:  "all",
  assignee:  "all",
};

export default function GlobalTasksPage() {
  const { user }  = useAppSelector((s) => s.auth);
  const role      = user?.role ?? "member";
  const canManage = role === "admin" || role === "manager";

  const { data: tasks    = [], isLoading: tasksLoading }    = useGetAllTasksQuery({});
  const { data: projects = [], isLoading: projectsLoading } = useGetProjectsQuery({});

  const [filters, setFilters]   = useState<GlobalTaskFilters>(DEFAULT_FILTERS);
  const [editTask,   setEditTask]   = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);

  // ── unique members across all tasks ──────────────────────────────────────
  const allMembers: TaskAssignee[] = useMemo(() => {
    const map = new Map<string, TaskAssignee>();
    tasks.forEach((t) => t.assignees.forEach((a) => map.set(a._id, a)));
    return Array.from(map.values());
  }, [tasks]);

  // ── client-side filtering ─────────────────────────────────────────────────
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!t.title.toLowerCase().includes(q)) return false;
      }
      if (filters.projectId !== "all") {
        const projectId =
          t.projectId && typeof t.projectId === "object"
            ? (t.projectId as { _id: string })._id
            : t.projectId;

        if (projectId !== filters.projectId) return false;
      }
      if (filters.status   !== "all" && t.status   !== filters.status)    return false;
      if (filters.priority !== "all" && t.priority !== filters.priority)  return false;
      if (filters.assignee !== "all") {
        if (!t.assignees.some((a) => a._id === filters.assignee)) return false;
      }
      return true;
    });
  }, [tasks, filters]);

  const hasActiveFilters = Object.entries(filters).some(
    ([k, v]) => k === "search" ? v !== "" : v !== "all"
  );

  const isLoading = tasksLoading || projectsLoading;

  return (
    <TooltipProvider>
      <div className="p-4 sm:p-6 space-y-5 max-w-[1400px] mx-auto">

        {/* ── page header ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-semibold sm:text-2xl">
              <ClipboardList className="h-5 w-5 text-muted-foreground" />
              All Tasks
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Cross-project view — all tasks you have access to
            </p>
          </div>
        </div>

        {/* ── stat chips ──────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="flex gap-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-28 rounded-lg" />)}
          </div>
        ) : (
          <GlobalTaskStats tasks={filteredTasks} />
        )}

        {/* ── filters ─────────────────────────────────────────────────── */}
        <GlobalTaskFiltersBar
          filters={filters}
          onChange={(partial) => setFilters((prev) => ({ ...prev, ...partial }))}
          onClear={() => setFilters(DEFAULT_FILTERS)}
          projects={projects}
          members={allMembers}
          hasActiveFilters={hasActiveFilters}
        />

        {/* ── table ───────────────────────────────────────────────────── */}
        {isLoading ? (
          <Skeleton className="h-64 rounded-xl lg:min-w-[900px]" />
        ) : (
          <GlobalTaskTable
            tasks={filteredTasks}
            canManage={canManage}
            onEdit={(task) => setEditTask(task)}
            onDelete={(task) => setDeleteTask(task)}
          />
        )}

        {/* result count */}
        {!isLoading && (
          <p className="text-xs text-muted-foreground text-right">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </p>
        )}

      </div>

      {/* ── modals ──────────────────────────────────────────────────────── */}
      {editTask && (
        <TaskFormModal
          open={!!editTask}
          onClose={() => setEditTask(null)}
          task={editTask}
          projectId={editTask.projectId._id}
          sprintId={editTask.sprintId._id}
          allMembers={editTask.assignees}
        />
      )}

      <DeleteTaskDialog
        task={deleteTask}
        onClose={() => setDeleteTask(null)}
      />
    </TooltipProvider>
  );
}
