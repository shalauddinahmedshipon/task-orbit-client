// app/dashboard/admin/reports/page.tsx
"use client";

import { useState } from "react";
import { BarChart3, FolderKanban, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useGetProjectsQuery } from "@/store/api/project.api";
import { useGetProjectReportQuery, useGetUserReportQuery } from "@/store/api/report.api";
import { useGetUsersQuery } from "@/store/api/user.api";
import { cn } from "@/lib/utils";

// ─── Project report tab ───────────────────────────────────────────────────────

function ProjectReportTab() {
  const { data: projects = [], isLoading: projLoading } = useGetProjectsQuery({});
  const [selectedId, setSelectedId] = useState<string>("");

  const projectId = selectedId || projects[0]?._id || "";
  const { data: report, isLoading: reportLoading } = useGetProjectReportQuery(projectId, {
    skip: !projectId,
  });

  const isLoading = projLoading || reportLoading;

  const bars = report ? [
    { label: "Done",        value: report.tasksByStatus.done,       color: "bg-emerald-500", pct: report.totalTasks > 0 ? Math.round(report.tasksByStatus.done / report.totalTasks * 100) : 0 },
    { label: "In Progress", value: report.tasksByStatus.inProgress, color: "bg-blue-500",    pct: report.totalTasks > 0 ? Math.round(report.tasksByStatus.inProgress / report.totalTasks * 100) : 0 },
    { label: "Review",      value: report.tasksByStatus.review,     color: "bg-amber-500",   pct: report.totalTasks > 0 ? Math.round(report.tasksByStatus.review / report.totalTasks * 100) : 0 },
    { label: "To Do",       value: report.tasksByStatus.todo,       color: "bg-slate-400",   pct: report.totalTasks > 0 ? Math.round(report.tasksByStatus.todo / report.totalTasks * 100) : 0 },
  ] : [];

  return (
    <div className="space-y-5">
      {/* project picker */}
      <Select value={selectedId || projectId} onValueChange={setSelectedId}>
        <SelectTrigger className="h-9 w-full sm:w-[280px] text-sm">
          <SelectValue placeholder="Select project" />
        </SelectTrigger>
        <SelectContent>
          {projects.map((p) => (
            <SelectItem key={p._id} value={p._id}>{p.title}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:min-w-[500px]">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : report ? (
        <>
          {/* stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Tasks",    value: report.totalTasks,       sub: `${report.tasksByStatus.done} done`, color: "" },
              { label: "% Complete",     value: `${report.percentComplete}%`, sub: "overall progress", color: report.percentComplete >= 70 ? "text-emerald-600 dark:text-emerald-400" : "" },
              { label: "Hours Logged",   value: report.totalHoursLogged, sub: "across all tasks",    color: "text-blue-600 dark:text-blue-400" },
              { label: "Total Sprints",  value: report.totalSprints,     sub: "milestones",           color: "" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border bg-card p-4">
                <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                <p className={cn("text-2xl font-semibold", s.color)}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* overall progress bar */}
          <div className="rounded-xl border bg-card p-4 sm:p-5">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Overall completion</span>
              <span className="font-semibold">{report.percentComplete}%</span>
            </div>
            <Progress value={report.percentComplete} className="h-3 mb-4" />

            {/* status breakdown */}
            <div className="space-y-2.5">
              {bars.map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{b.label}</span>
                    <span>{b.value} ({b.pct}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all", b.color)} style={{ width: `${b.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* tasks remaining */}
          <div className="rounded-xl border bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 p-4">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              {report.totalTasks - report.tasksByStatus.done} tasks remaining
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
              {report.tasksByStatus.review} in review · {report.tasksByStatus.inProgress} in progress · {report.tasksByStatus.todo} not started
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}

// ─── User report tab ──────────────────────────────────────────────────────────

function UserReportTab() {
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const userId = selectedUserId || users[0]?._id || "";
  const { data: report, isLoading: reportLoading } = useGetUserReportQuery(userId, {
    skip: !userId,
  });

  const isLoading = usersLoading || reportLoading;
  const selectedUser = users.find((u) => u._id === userId);

  return (
    <div className="space-y-5">
      {/* user picker */}
      <Select value={selectedUserId || userId} onValueChange={setSelectedUserId}>
        <SelectTrigger className="h-9 w-full sm:w-[280px] text-sm">
          <SelectValue placeholder="Select team member" />
        </SelectTrigger>
        <SelectContent>
          {users.map((u) => (
            <SelectItem key={u._id} value={u._id}>
              {u.name} · {u.role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:min-w-[500px]">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : report && selectedUser ? (
        <>
          {/* user badge */}
          <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
              {selectedUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{selectedUser.name}</p>
              <p className="text-xs text-muted-foreground">{selectedUser.email} · {selectedUser.department}</p>
            </div>
          </div>

          {/* stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Tasks",   value: report.taskStats.total,        sub: "assigned",        color: "" },
              { label: "Completed",     value: report.taskStats.completed,    sub: `${report.taskStats.total > 0 ? Math.round(report.taskStats.completed / report.taskStats.total * 100) : 0}% rate`, color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Remaining",     value: report.taskStats.remaining,    sub: "open tasks",      color: report.taskStats.remaining > 5 ? "text-amber-600 dark:text-amber-400" : "" },
              { label: "Hours Logged",  value: report.totalHoursLogged,       sub: "total",           color: "text-blue-600 dark:text-blue-400" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border bg-card p-4">
                <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                <p className={cn("text-2xl font-semibold", s.color)}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* task breakdown */}
          <div className="rounded-xl border bg-card p-4 sm:p-5">
            <p className="text-sm font-medium mb-3">Task breakdown</p>
            <div className="space-y-2.5">
              {[
                { label: "Done",        value: report.taskStats.byStatus["done"],         color: "bg-emerald-500" },
                { label: "In Progress", value: report.taskStats.byStatus["in-progress"],  color: "bg-blue-500" },
                { label: "Review",      value: report.taskStats.byStatus["review"],        color: "bg-amber-500" },
                { label: "To Do",       value: report.taskStats.byStatus["todo"],          color: "bg-slate-400" },
              ].map((row) => {
                const pct = report.taskStats.total > 0
                  ? Math.round((row.value / report.taskStats.total) * 100)
                  : 0;
                return (
                  <div key={row.label}>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{row.label}</span>
                      <span>{row.value} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all", row.color)} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1200px] mx-auto">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-semibold sm:text-2xl">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
          Reports
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Project progress and per-member time summaries
        </p>
      </div>

      <Tabs defaultValue="project">
        <TabsList className="mb-5">
          <TabsTrigger value="project" className="gap-1.5">
            <FolderKanban className="h-4 w-4" /> By project
          </TabsTrigger>
          <TabsTrigger value="user" className="gap-1.5">
            <User className="h-4 w-4" /> By member
          </TabsTrigger>
        </TabsList>
        <TabsContent value="project"><ProjectReportTab /></TabsContent>
        <TabsContent value="user"><UserReportTab /></TabsContent>
      </Tabs>
    </div>
  );
}
