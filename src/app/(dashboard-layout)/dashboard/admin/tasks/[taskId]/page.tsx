// app/dashboard/admin/tasks/[taskId]/page.tsx
"use client";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";

// RTK
import { useGetSingleTaskQuery, useDeleteTaskMutation } from "@/store/api/task.api";
import { useGetTimeLogsByTaskQuery } from "@/store/api/timelog.api";

// Redux
import { useAppSelector } from "@/store/hooks";
import type { Task } from "@/types/task.types";
import { useState } from "react";
import { TaskDetailHeader } from "@/components/modules/task/TaskDetailHeader";
import { TaskBody } from "@/components/modules/task/TaskBody";
import { TaskTabs } from "@/components/modules/task/TaskTabs";
import { TaskSidebar } from "@/components/modules/task/TaskSidebar";
import { TaskFormModal } from "@/components/modules/task/TaskFormModal";
import { DeleteTaskDialog } from "@/components/modules/task/DeleteTaskDialog";
import { useGetProjectQuery } from "@/store/api/project.api";

export default function TaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const router     = useRouter();
  const { user }   = useAppSelector((s) => s.auth);
  const role       = user?.role ?? "member";
  const canManage  = role === "admin" || role === "manager";

  const { data: task, isLoading, isError } = useGetSingleTaskQuery(taskId);
  const { data: timeLogs = [] }            = useGetTimeLogsByTaskQuery(taskId);
  const projectId =
  typeof task?.projectId === "string"
    ? task.projectId
    : task?.projectId?._id;

const { data: project } = useGetProjectQuery(projectId!, {
  skip: !projectId,
});

const allMembers = project?.members ?? [];
  const [editOpen,   setEditOpen]   = useState(false);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);
  const [deleteMutation]            = useDeleteTaskMutation();

  const totalLogged = timeLogs.reduce((acc, l) => acc + l.hours, 0);

  // ── loading ───────────────────────────────────────────────────────────────
 if (isLoading) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-muted border-t-primary" />
          <div className="absolute inset-2 rounded-full bg-background" />
        </div>

        <p className="text-sm font-medium text-muted-foreground">
          Loading task details...
        </p>
      </div>
    </div>
  );
}

  if (isError || !task) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Task not found or failed to load.
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="p-4 sm:p-6 space-y-5 max-w-[1400px] mx-auto">

        {/* header: breadcrumb + title + badges + actions menu */}
        <TaskDetailHeader
          task={task}
          canManage={canManage}
          onEdit={() => setEditOpen(true)}
          onDelete={() => setDeleteTask(task)}
        />

        {/* two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-5 items-start">

          {/* ── left column ──────────────────────────────────────────────── */}
          <div className="space-y-5 min-w-0 lg:min-w-[500px]">
            {/* description + subtasks + attachments */}
            <TaskBody task={task} canManage={canManage} />

            {/* comments / activity / time log tabs */}
            <TaskTabs
              taskId={taskId}
              currentUserId={user?._id ?? ""}
              canManage={canManage}
            />
          </div>

          {/* ── right sidebar ─────────────────────────────────────────────── */}
          <div className="space-y-4">
            <TaskSidebar
              task={task}
              timeLogs={timeLogs}
              userRole={role}
              currentUserId={user?._id ?? ""}
              totalLogged={totalLogged}
            />
          </div>
        </div>

      </div>

      {/* modals */}
      {editOpen && (
        <TaskFormModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          task={task}
          projectId={task.projectId._id}
          sprintId={task.sprintId._id}
          allMembers={allMembers}
        />
      )}

      <DeleteTaskDialog
        task={deleteTask}
        onClose={() => {
          setDeleteTask(null);
          router.back();
        }}
      />
    </TooltipProvider>
  );
}
