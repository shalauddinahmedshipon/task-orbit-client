"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";

import { useAppSelector } from "@/store/hooks";
import { useGetSprintQuery, useGetSprintsQuery } from "@/store/api/sprint.api";
import { useGetAllTasksQuery } from "@/store/api/task.api";
import { useGetProjectQuery } from "@/store/api/project.api";

import { SprintHeader } from "@/components/modules/sprint/SprintHeader";
import { SprintSwitcher } from "@/components/modules/sprint/SprintSwitcher";
import { SprintStats } from "@/components/modules/sprint/SprintStats";
import { TaskTable } from "@/components/modules/task/TaskTable";
import { TaskToolbar, TaskFilters, ViewMode } from "@/components/modules/task/TaskToolbar";

export default function MemberSprintDetailPage() {
  const { projectId, sprintId } = useParams<{ projectId: string; sprintId: string }>();
  const router = useRouter();

  // auth
  const user = useAppSelector((s) => s.auth.user);
  const role = user?.role ?? "member";
  const canManage = false; // IMPORTANT: force read-only

  // data
  const { data: sprint, isLoading: sprintLoading } = useGetSprintQuery(sprintId);
  const { data: sprints = [], isLoading: sprintsLoading } = useGetSprintsQuery({ projectId });
  const { data: project } = useGetProjectQuery(projectId);
  const { data: rawTasks = [], isLoading: tasksLoading } =
    useGetAllTasksQuery({ sprintId, projectId });

  // UI state
  const [filters, setFilters] = useState<TaskFilters>({
    search: "",
    assignee: "all",
    status: "all",
    priority: "all",
  });

  const [viewMode] = useState<ViewMode>("list"); // FORCE LIST ONLY (no kanban)

  // filter tasks
  const filteredTasks = useMemo(() => {
    return rawTasks.filter((t) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!t.title.toLowerCase().includes(q) &&
            !t.description?.toLowerCase().includes(q)) return false;
      }
      if (filters.status !== "all" && t.status !== filters.status) return false;
      if (filters.priority !== "all" && t.priority !== filters.priority) return false;
      return true;
    });
  }, [rawTasks, filters]);

  if (sprintLoading || sprintsLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!sprint) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Sprint not found or access denied.
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="p-4 sm:p-6 space-y-5 max-w-[1400px] mx-auto">

        {/* HEADER (READ ONLY) */}
        <SprintHeader
          sprint={sprint}
          projectId={projectId}
          projectTitle={project?.title ?? ""}
          canManage={false}
          onEdit={() => {}}
          onDelete={() => {}}
        />

        {/* SPRINT SWITCHER (VIEW ONLY) */}
        <SprintSwitcher
          sprints={sprints}
          activeSprint={sprint}
          projectId={projectId}
          canManage={false}
          onCreateSprint={() => {}}
        />

        {/* STATS */}
        <SprintStats sprint={sprint} tasks={rawTasks} />

        {/* FILTER BAR (READ ONLY) */}
        <TaskToolbar
          filters={filters}
          onFiltersChange={(p) => setFilters((prev) => ({ ...prev, ...p }))}
          viewMode={viewMode}
          onViewModeChange={() => {}}
          assignees={[]} // optional: skip or pass project members
          canManage={false}
          onAddTask={() => {}}
        />

        {/* TASK LIST ONLY */}
        {tasksLoading ? (
          <Skeleton className="h-64 rounded-xl" />
        ) : (
          <TaskTable
            tasks={filteredTasks}
            canManage={false}
            onEdit={() => {}}
            onDelete={() => {}}
            onAddTask={() => {}}
          />
        )}

      </div>
    </TooltipProvider>
  );
}