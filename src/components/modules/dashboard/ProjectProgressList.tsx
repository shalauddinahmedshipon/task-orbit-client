// components/admin-dashboard/ProjectProgressList.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProjectsQuery } from "@/store/api/project.api";
import { cn } from "@/lib/utils";

const STATUS_DOT: Record<string, string> = {
  active:    "bg-emerald-500",
  planned:   "bg-blue-500",
  complete:  "bg-slate-400",
  completed: "bg-slate-400",
  archive:   "bg-orange-400",
};

const STATUS_LABEL: Record<string, string> = {
  active:    "Active",
  planned:   "Planned",
  complete:  "Complete",
  completed: "Complete",
  archive:   "Archived",
};

export function ProjectProgressList() {
  const router = useRouter();
  const { data: projects = [], isLoading } = useGetProjectsQuery({});

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-5 space-y-3">
        <Skeleton className="h-5 w-40" />
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
      </div>
    );
  }

  const active = projects.filter((p) => p.status === "active" || p.status === "planned");

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Project Progress</h3>
        <Button
          variant="ghost" size="sm" className="h-7 text-xs gap-1"
          onClick={() => router.push("/dashboard/admin/reports")}
        >
          Full report <ArrowRight className="h-3 w-3" />
        </Button>
      </div>

      {active.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">No active projects</p>
      ) : (
        <div className="space-y-4">
          {active.slice(0, 5).map((project) => {
            const stats = (project as any).taskStats ?? { total: 0, completed: 0 };
            const pct   = stats.total > 0
              ? Math.round((stats.completed / stats.total) * 100)
              : 0;

            return (
              <div
                key={project._id}
                className="cursor-pointer group"
                onClick={() => router.push(`/dashboard/admin/projects/${project._id}`)}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={cn("h-2 w-2 rounded-full shrink-0", STATUS_DOT[project.status] ?? "bg-slate-400")} />
                    <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                      {project.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {STATUS_LABEL[project.status]}
                    </span>
                  </div>
                  <span className="text-xs font-medium tabular-nums ml-2 shrink-0">{pct}%</span>
                </div>
                <Progress value={pct} className="h-1.5" />
                <p className="text-[10px] text-muted-foreground mt-1">
                  {stats.completed}/{stats.total} tasks · {project.client}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
