// app/dashboard/member/tasks/[taskId]/page.tsx
"use client";


import { useParams } from "next/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";


// Components (REUSED from admin)
import { TaskDetailHeader } from "@/components/modules/task/TaskDetailHeader";
import { TaskBody } from "@/components/modules/task/TaskBody";
import { CommentsPanel } from "@/components/modules/task/CommentsPanel";
import { ActivityPanel } from "@/components/modules/task/ActivityPanel";
import { TimeLogPanel } from "@/components/modules/task/TimeLogPanel";
import { TaskSidebar } from "@/components/modules/task/TaskSidebar";
import { useGetSingleTaskQuery } from "@/store/api/task.api";

export default function MemberTaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>();

  const { data: task, isLoading } = useGetSingleTaskQuery(taskId);

  const canManage = false;

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

  if (!task) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Task not found
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:p-6 max-w-[1400px] mx-auto">

        {/* ── MAIN CONTENT ───────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Header (read-only mode) */}
          <TaskDetailHeader
            task={task}
            canManage={canManage}
          />

          {/* Body (subtasks + attachments + status update allowed) */}
          <TaskBody
            task={task}
            canManage={true}
          />

          {/* Comments (fully allowed) */}
          <CommentsPanel taskId={task._id} />

          {/* Activity log (read-only) */}
          <ActivityPanel taskId={task._id} />

        </div>

        {/* ── SIDEBAR ───────────────────────────────────────── */}
        <div className="space-y-5">

         <TaskSidebar
  task={task}
  timeLogs={[]}
  userRole="member"
  currentUserId=""
  totalLogged={0}
/>
          {/* Time tracking (allowed for members) */}
          <TimeLogPanel taskId={task._id} />

        </div>

      </div>
    </TooltipProvider>
  );
}