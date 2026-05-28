// app/dashboard/member/page.tsx
"use client";

import { useRouter } from "next/navigation";
import {
  AlertCircle, CheckCircle2, Clock, ListTodo, PlayCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";
// RTK
import { useGetAllTasksQuery }  from "@/store/api/task.api";
import { useGetMyTimeLogsQuery } from "@/store/api/timelog.api";

// Redux
import { useAppSelector } from "@/store/hooks";
import { isOverdue } from "@/utils/task.utils";
import { startOfWeek, isSameDay, addDays } from "date-fns";
import { StatCard } from "@/components/modules/dashboard/StatCard";
import { MyTodoHighlights } from "@/components/modules/dashboard/MyTodoHighlights";
import { WeeklyHoursChart } from "@/components/modules/dashboard/WeeklyHoursChart";
import { MyProjectsProgress } from "@/components/modules/dashboard/MyProjectsProgress";

export default function MemberDashboardPage() {
  const router   = useRouter();
  const { user } = useAppSelector((s) => s.auth);
  const userId   = user?._id ?? "";

  const { data: tasks   = [], isLoading: tasksLoading }   = useGetAllTasksQuery({});
  const { data: timeLogs = [], isLoading: logsLoading }   = useGetMyTimeLogsQuery();

  const isLoading = tasksLoading || logsLoading;

  // ── derived ────────────────────────────────────────────────────────────────
  const myTasks      = tasks.filter((t) => t.assignees.some((a) => a._id === userId));
  const todoCount    = myTasks.filter((t) => t.status === "todo").length;
  const inProgCount  = myTasks.filter((t) => t.status === "in-progress").length;
  const doneCount    = myTasks.filter((t) => t.status === "done").length;
  const overdueCount = myTasks.filter((t) => isOverdue(t.dueDate, t.status)).length;

  // hours this week
  const weekStart  = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays   = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weeklyHrs  = timeLogs
    .filter((l) => weekDays.some((d) => isSameDay(d, new Date(l.logDate))))
    .reduce((sum, l) => sum + l.hours, 0);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <TooltipProvider>
      <div className="p-4 sm:p-6 space-y-6 max-w-[1200px] mx-auto">

        {/* greeting */}
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl">
            {greeting()}, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here's your work summary for today.
          </p>
        </div>

        {/* stat cards */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[700px]">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              label="To Do"
              value={todoCount}
              sub="need attention"
              icon={ListTodo}
              iconBg="bg-amber-500/10"
              iconColor="text-amber-500"
              valueColor={todoCount > 0 ? "text-amber-600 dark:text-amber-400" : ""}
              onClick={() => router.push("/dashboard/member/my-tasks?status=todo")}
            />
            <StatCard
              label="In Progress"
              value={inProgCount}
              sub="active now"
              icon={PlayCircle}
              iconBg="bg-blue-500/10"
              iconColor="text-blue-500"
              onClick={() => router.push("/dashboard/member/my-tasks?status=in-progress")}
            />
            <StatCard
              label="Completed"
              value={doneCount}
              sub="tasks done"
              icon={CheckCircle2}
              iconBg="bg-emerald-500/10"
              iconColor="text-emerald-500"
              onClick={() => router.push("/dashboard/member/my-tasks?status=done")}
            />
            <StatCard
              label="Hrs This Week"
              value={`${weeklyHrs}h`}
              sub="logged so far"
              icon={Clock}
              iconBg="bg-primary/10"
              iconColor="text-primary"
              onClick={() => router.push("/dashboard/member/time-logs")}
            />
          </div>
        )}

        {/* overdue banner */}
        {!isLoading && overdueCount > 0 && (
          <div
            onClick={() => router.push("/dashboard/member/my-tasks")}
            className="flex items-center gap-3 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-3 cursor-pointer hover:bg-red-100/50 dark:hover:bg-red-950/30 transition-colors"
          >
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-400">
              <strong>{overdueCount} task{overdueCount > 1 ? "s are" : " is"} overdue</strong> — tap to review
            </p>
          </div>
        )}

        {/* main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">

          {/* left: todo highlights */}
          <MyTodoHighlights userId={userId} />

          {/* right column */}
          <div className="space-y-5">
            <WeeklyHoursChart />
            <MyProjectsProgress />
          </div>
        </div>

      </div>
    </TooltipProvider>
  );
}
