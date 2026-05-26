import { FolderKanban, Play, CheckCheck, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Project } from "@/types/project.types";

interface Props {
  projects: Project[];
  isLoading: boolean;
}

export function ProjectStatsRow({ projects, isLoading }: Props) {
  const total = projects.length;
  const active = projects.filter((p) => p.status === "active").length;
  const completed = projects.filter((p) => p.status === "completed").length;
  const totalTasks = projects.reduce(
    (acc, p) => acc + (p.taskStats?.total ?? 0),
    0
  );
  const openTasks = projects.reduce(
    (acc, p) =>
      acc +
      (p.taskStats
        ? p.taskStats.total - p.taskStats.completed
        : 0),
    0
  );

  const stats = [
    {
      label: "Total Projects",
      value: total,
      icon: FolderKanban,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/40",
    },
    {
      label: "Active",
      value: active,
      icon: Play,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCheck,
      color: "text-sky-500",
      bg: "bg-sky-50 dark:bg-sky-950/40",
    },
    {
      label: "Open Tasks",
      value: openTasks,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/40",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, color, bg }) => (
        <Card key={label}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`rounded-lg p-2 shrink-0 ${bg}`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">{label}</p>
              {isLoading ? (
                <Skeleton className="h-6 w-10 mt-0.5" />
              ) : (
                <p className="text-xl font-bold leading-tight">{value}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
