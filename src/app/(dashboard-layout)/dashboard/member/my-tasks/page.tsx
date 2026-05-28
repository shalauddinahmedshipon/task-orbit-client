// app/dashboard/member/my-tasks/page.tsx
"use client";

import { useMemo, useState } from "react";
import { ClipboardList } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

// RTK
import { useGetAllTasksQuery } from "@/store/api/task.api";
import { useGetProjectsQuery } from "@/store/api/project.api";

// Redux
import { useAppSelector } from "@/store/hooks";

import type { Task, TaskAssignee } from "@/types/task.types";

import {
  GlobalTaskFilters,
  GlobalTaskFiltersBar,
} from "@/components/modules/task/GlobalTaskFilters";

import { GlobalTaskStats } from "@/components/modules/task/GlobalTaskStats";
import { GlobalTaskTable } from "@/components/modules/task/GlobalTaskTable";

const DEFAULT_FILTERS: GlobalTaskFilters = {
  search: "",
  projectId: "all",
  status: "all",
  priority: "all",
  assignee: "all", // optional (we will ignore it in filtering)
};

export default function MemberMyTasksPage() {
  const { user } = useAppSelector((s) => s.auth);

  const currentUserId = user?._id;

  const { data: tasks = [], isLoading: tasksLoading } =
    useGetAllTasksQuery({});

  const { data: projects = [], isLoading: projectsLoading } =
    useGetProjectsQuery({});

  const [filters, setFilters] = useState<GlobalTaskFilters>(DEFAULT_FILTERS);

  const canManage = false;

  // ── all members (for filter dropdown compatibility) ─────────────────────
  const allMembers: TaskAssignee[] = useMemo(() => {
    const map = new Map<string, TaskAssignee>();
    tasks.forEach((t) =>
      t.assignees.forEach((a) => map.set(a._id, a))
    );
    return Array.from(map.values());
  }, [tasks]);

  // ── ONLY MY TASKS ───────────────────────────────────────────────────────
  const myTasks = useMemo(() => {
    if (!currentUserId) return [];

    return tasks.filter((t) =>
      t.assignees.some((a) => a._id === currentUserId)
    );
  }, [tasks, currentUserId]);

  // ── client-side filtering ───────────────────────────────────────────────
  const filteredTasks = useMemo(() => {
    return myTasks.filter((t) => {
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

      if (filters.status !== "all" && t.status !== filters.status)
        return false;

      if (filters.priority !== "all" && t.priority !== filters.priority)
        return false;

      return true;
    });
  }, [myTasks, filters]);

  const hasActiveFilters = Object.entries(filters).some(([k, v]) =>
    k === "search" ? v !== "" : v !== "all"
  );

  const isLoading = tasksLoading || projectsLoading;

  return (
    <TooltipProvider>
      <div className="p-4 sm:p-6 space-y-5 max-w-[1400px] mx-auto">

        {/* ── header ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-semibold sm:text-2xl">
              <ClipboardList className="h-5 w-5 text-muted-foreground" />
              My Tasks
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Tasks assigned to you across all projects
            </p>
          </div>
        </div>

        {/* ── stats ─────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="flex gap-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-28 rounded-lg" />
            ))}
          </div>
        ) : (
          <GlobalTaskStats tasks={filteredTasks} />
        )}

        {/* ── filters ───────────────────────────────────────────── */}
        <GlobalTaskFiltersBar
          filters={filters}
          onChange={(partial) =>
            setFilters((prev) => ({ ...prev, ...partial }))
          }
          onClear={() => setFilters(DEFAULT_FILTERS)}
          projects={projects}
          members={allMembers}
          hasActiveFilters={hasActiveFilters}
          showAssignee={false}
        />

        {/* ── table ─────────────────────────────────────────────── */}
        {isLoading ? (
          <Skeleton className="h-64 rounded-xl lg:min-w-[900px]" />
        ) : (
          <GlobalTaskTable
            tasks={filteredTasks}
            canManage={canManage}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        )}

        {/* result count */}
        {!isLoading && (
          <p className="text-xs text-muted-foreground text-right">
            Showing {filteredTasks.length} of {myTasks.length} tasks
          </p>
        )}
      </div>
    </TooltipProvider>
  );
}