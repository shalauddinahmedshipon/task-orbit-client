// app/dashboard/admin/page.tsx
"use client";

import { useRouter } from "next/navigation";
import {
  AlertCircle, BarChart3, Clock,
  FolderKanban, ListTodo, Users,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";

// components

// RTK
import { useGetAllTasksQuery }    from "@/store/api/task.api";
import { useGetProjectsQuery } from "@/store/api/project.api";
import { useGetUsersQuery }       from "@/store/api/user.api";

// Redux
import { useAppSelector } from "@/store/hooks";
import { isOverdue } from "@/utils/task.utils";
import { StatCard } from "@/components/modules/dashboard/StatCard";
import { ReviewQueue } from "@/components/modules/dashboard/ReviewQueue";
import { ProjectProgressList } from "@/components/modules/dashboard/ProjectProgressList";

export default function AdminDashboardPage() {
  const router    = useRouter();
  const { user }  = useAppSelector((s) => s.auth);

  const { data: allTasks    = [], isLoading: tasksLoading }    = useGetAllTasksQuery({});
  const { data: projects    = [], isLoading: projectsLoading } = useGetProjectsQuery({});
  const { data: users       = [], isLoading: usersLoading }    = useGetUsersQuery();

  const isLoading = tasksLoading || projectsLoading || usersLoading;

  // ── derived stats ─────────────────────────────────────────────────────────
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const tasksInReview  = allTasks.filter((t) => t.status === "review" && t.reviewApproval).length;
  const overdueTasks   = allTasks.filter((t) => isOverdue(t.dueDate, t.status)).length;
  const doneTasks      = allTasks.filter((t) => t.status === "done").length;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <TooltipProvider>
      <div className="p-4 sm:p-6 space-y-6 max-w-[1400px] mx-auto">

        {/* ── greeting ──────────────────────────────────────────────── */}
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl">
            {greeting()}, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here's what's happening across your projects today.
          </p>
        </div>

        {/* ── stat cards ────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:min-w-[900px]">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <StatCard
              label="Projects"
              value={projects.length}
              sub={`${activeProjects} active`}
              icon={FolderKanban}
              iconBg="bg-blue-500/10"
              iconColor="text-blue-500"
              onClick={() => router.push("/dashboard/admin/projects")}
            />
            <StatCard
              label="Total Tasks"
              value={allTasks.length}
              sub={`${doneTasks} done`}
              icon={ListTodo}
              iconBg="bg-emerald-500/10"
              iconColor="text-emerald-500"
              onClick={() => router.push("/dashboard/admin/tasks")}
            />
            <StatCard
              label="Team Members"
              value={users.length}
              sub="across all depts"
              icon={Users}
              iconBg="bg-violet-500/10"
              iconColor="text-violet-500"
              onClick={() => router.push("/dashboard/admin/users")}
            />
            <StatCard
              label="Pending Review"
              value={tasksInReview}
              sub="need your approval"
              icon={Clock}
              iconBg="bg-amber-500/10"
              iconColor="text-amber-500"
              valueColor={tasksInReview > 0 ? "text-amber-600 dark:text-amber-400" : ""}
              onClick={() => router.push("/dashboard/admin/tasks?status=review")}
            />
            <StatCard
              label="Overdue"
              value={overdueTasks}
              sub="past due date"
              icon={AlertCircle}
              iconBg={overdueTasks > 0 ? "bg-red-500/10" : "bg-muted"}
              iconColor={overdueTasks > 0 ? "text-red-500" : "text-muted-foreground"}
              valueColor={overdueTasks > 0 ? "text-red-500" : ""}
              onClick={() => router.push("/dashboard/admin/tasks")}
            />
            <StatCard
              label="Reports"
              value="View"
              sub="project & user stats"
              icon={BarChart3}
              iconBg="bg-primary/10"
              iconColor="text-primary"
              onClick={() => router.push("/dashboard/admin/reports")}
            />
          </div>
        )}

        {/* ── main content: review queue + project progress ──────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 items-start">

          {/* review queue — main focus */}
          <ReviewQueue />

          {/* project progress sidebar */}
          <ProjectProgressList />
        </div>

      </div>
    </TooltipProvider>
  );
}
