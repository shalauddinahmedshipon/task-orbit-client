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
      <div className="p-24 space-y-4 max-w-7xl mx-auto">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-60 w-full" />
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