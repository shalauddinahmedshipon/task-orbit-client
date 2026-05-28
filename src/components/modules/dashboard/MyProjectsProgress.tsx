// components/member-dashboard/MyProjectsProgress.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, FolderKanban } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useGetProjectsQuery } from "@/store/api/project.api";

const STATUS_DOT: Record<string, string> = {
  active:   "bg-emerald-500",
  planned:  "bg-blue-500",
  complete: "bg-slate-400",
  archive:  "bg-orange-400",
};

export function MyProjectsProgress() {
  const router = useRouter();
  const { data: projects = [], isLoading } = useGetProjectsQuery({});

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-5 space-y-3">
        <Skeleton className="h-5 w-36" />
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">My Projects</h3>
          <span className="text-xs text-muted-foreground border rounded-full px-2 py-0.5">
            {projects.length}
          </span>
        </div>
        <Button
          variant="ghost" size="sm" className="h-7 text-xs gap-1"
          onClick={() => router.push("/dashboard/member/projects")}
        >
          View all <ArrowRight className="h-3 w-3" />
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          You haven't been added to any projects yet.
        </p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => {
            const stats = (project as any).taskStats ?? { total: 0, completed: 0 };
            const pct   = stats.total > 0
              ? Math.round((stats.completed / stats.total) * 100)
              : 0;

            return (
              <div
                key={project._id}
                className="cursor-pointer group"
                onClick={() => router.push(`/dashboard/member/projects/${project._id}`)}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={cn("h-2 w-2 rounded-full shrink-0", STATUS_DOT[project.status] ?? "bg-slate-400")} />
                    <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                      {project.title}
                    </span>
                  </div>
                  <span className="text-xs font-medium tabular-nums ml-2 shrink-0">{pct}%</span>
                </div>
                <Progress value={pct} className="h-1.5" />
                <p className="text-[10px] text-muted-foreground mt-1">
                  {stats.completed}/{stats.total} tasks
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
