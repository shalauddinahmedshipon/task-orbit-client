// app/dashboard/admin/projects/[id]/sprint/[sprintId]/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";


// RTK Query
import { useDeleteSprintMutation, useGetSprintQuery, useGetSprintsQuery } from "@/store/api/sprint.api";
import { useGetAllTasksQuery } from "@/store/api/task.api";

// Redux
import { useAppSelector } from "@/store/hooks";


import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TaskFilters, TaskToolbar, ViewMode } from "@/components/modules/task/TaskToolbar";
import { Task, TaskAssignee } from "@/types/task.types";
import { SprintHeader } from "@/components/modules/sprint/SprintHeader";
import { SprintSwitcher } from "@/components/modules/sprint/SprintSwitcher";
import { SprintStats } from "@/components/modules/sprint/SprintStats";
import { TaskTable } from "@/components/modules/task/TaskTable";
import { KanbanBoard } from "@/components/modules/task/KanbanBoard";
import { TaskFormModal } from "@/components/modules/task/TaskFormModal";
import { DeleteTaskDialog } from "@/components/modules/task/DeleteTaskDialog";
import { SprintFormModal } from "@/components/modules/sprint/SprintFormModal";
import { useGetProjectQuery } from "@/store/api/project.api";
import { ProjectMember } from "@/types/project.types";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SprintDetailPage() {
  const {  projectId, sprintId } = useParams<{ projectId: string; sprintId: string }>();
  const router = useRouter();

  // auth
  const { user } = useAppSelector((s) => s.auth);
  const role      = user?.role ?? "member";
  const canManage = role === "admin" || role === "manager";

  // ── data fetching ────────────────────────────────────────────────────────
  const {
    data: sprint,
    isLoading: sprintLoading,
    isError: sprintError,
  } = useGetSprintQuery(sprintId);

  const { data: allSprints = [], isLoading: sprintsLoading } =
    useGetSprintsQuery({ projectId });
  const { data: project, isLoading: projectLoading } =
    useGetProjectQuery(projectId);

  const {
    data: rawTasks = [],
    isLoading: tasksLoading,
  } = useGetAllTasksQuery({ sprintId, projectId });

  // ── local UI state ───────────────────────────────────────────────────────
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filters, setFilters]   = useState<TaskFilters>({
    search:   "",
    assignee: "all",
    status:   "all",
    priority: "all",
  });

  // modals
  const [taskModal,   setTaskModal]   = useState<{ open: boolean; task?: Task | null }>({ open: false });
  const [deleteTask,  setDeleteTask]  = useState<Task | null>(null);
  const [sprintModal, setSprintModal] = useState<{ open: boolean; editing?: boolean }>({ open: false });

  // ── derived data ─────────────────────────────────────────────────────────
  // unique assignees for filter dropdown
  const allMembers: ProjectMember[] = project?.members ?? [];
  // const allMembers: TaskAssignee[] = useMemo(() => {
  //   const map = new Map<string, TaskAssignee>();
  //   rawTasks.forEach((t) =>
  //     t.assignees.forEach((a) => map.set(a._id, a))
  //   );
  //   return Array.from(map.values());
  // }, [rawTasks]);

  // filtered tasks
  const filteredTasks = useMemo(() => {
    return rawTasks.filter((t) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!t.title.toLowerCase().includes(q) && !t.description?.toLowerCase().includes(q)) return false;
      }
      if (filters.assignee !== "all") {
        if (!t.assignees.some((a) => a._id === filters.assignee)) return false;
      }
      if (filters.status !== "all" && t.status !== filters.status) return false;
      if (filters.priority !== "all" && t.priority !== filters.priority) return false;
      return true;
    });
  }, [rawTasks, filters]);

  // ── sprint delete ────────────────────────────────────────────────────────
  const [deleteSprint] = useDeleteSprintMutation();
  const handleDeleteSprint = async () => {
    if (!sprint) return;
    try {
      await deleteSprint(sprint._id).unwrap();
      toast.success("Sprint deleted");
      router.push(`/dashboard/admin/projects/${projectId}`);
    } catch {
      toast.error("Failed to delete sprint");
    }
  };

  // ── loading state ─────────────────────────────────────────────────────────
  if (sprintLoading || sprintsLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-8 w-80" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (sprintError || !sprint) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Sprint not found or failed to load.
      </div>
    );
  }

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <TooltipProvider>
      <div className="p-4 sm:p-6 space-y-5 max-w-[1600px] mx-auto">

        {/* header: breadcrumb + title + actions */}
       {
        !projectLoading&&
        <SprintHeader
          sprint={sprint}
          projectId={projectId}
          projectTitle={project!.title} 
          canManage={canManage}
          onEdit={() => setSprintModal({ open: true, editing: true })}
          onDelete={handleDeleteSprint}
        />
       }
        

        {/* sprint switcher strip */}
        <SprintSwitcher
          sprints={allSprints}
          activeSprint={sprint}
          projectId={projectId}
          canManage={canManage}
          onCreateSprint={() => setSprintModal({ open: true, editing: false })}
        />

        {/* stats row + progress bar + overdue banner */}
        <SprintStats sprint={sprint} tasks={rawTasks} />

        {/* toolbar: search + filters + view toggle + add task */}
        <TaskToolbar
          filters={filters}
          onFiltersChange={(partial) => setFilters((prev) => ({ ...prev, ...partial }))}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          assignees={allMembers}
          canManage={canManage}
          onAddTask={() => setTaskModal({ open: true, task: null })}
        />

        {/* list or kanban */}
        {tasksLoading ? (
          <Skeleton className="h-64 rounded-xl" />
        ) : viewMode === "list" ? (
          <TaskTable
            tasks={filteredTasks}
            canManage={canManage}
            onEdit={(task) => setTaskModal({ open: true, task })}
            onDelete={(task) => setDeleteTask(task)}
            onAddTask={() => setTaskModal({ open: true, task: null })}
          />
        ) : (
          <KanbanBoard
            tasks={filteredTasks}
            userRole={role}
            canManage={canManage}
            onAddTask={() => setTaskModal({ open: true, task: null })}
          />
        )}

      </div>

      {/* ── modals ─────────────────────────────────────────────────────── */}

      <TaskFormModal
        open={taskModal.open}
        onClose={() => setTaskModal({ open: false })}
        task={taskModal.task}
        projectId={projectId}
        sprintId={sprintId}
        allMembers={allMembers}
      />

      <DeleteTaskDialog
        task={deleteTask}
        onClose={() => setDeleteTask(null)}
      />

      <SprintFormModal
        open={sprintModal.open}
        onClose={() => setSprintModal({ open: false })}
        sprint={sprintModal.editing ? sprint : null}
        projectId={projectId}
      />

    </TooltipProvider>
  );
}
