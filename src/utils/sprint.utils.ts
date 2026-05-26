import type { Sprint } from "@/types/sprint.types";
import type { Task } from "@/types/task.types";

export function getSprintStatus(sprint: Sprint): "upcoming" | "active" | "completed" {
  const now = new Date();
  const start = new Date(sprint.startDate);
  const end = new Date(sprint.endDate);
  if (now < start) return "upcoming";
  if (now > end) return "completed";
  return "active";
}

export const SPRINT_STATUS_CONFIG = {
  active: {
    label: "Active",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
  },
  upcoming: {
    label: "Upcoming",
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
  },
  completed: {
    label: "Completed",
    className:
      "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800",
  },
};

/** Build taskStats for a sprint from a flat task array */
export function buildSprintTaskStats(tasks: Task[]) {
  return {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "done").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    review: tasks.filter((t) => t.status === "review").length,
    todo: tasks.filter((t) => t.status === "todo").length,
  };
}

export function sprintCompletionPercent(stats?: Sprint["taskStats"]): number {
  if (!stats || stats.total === 0) return 0;
  return Math.round((stats.completed / stats.total) * 100);
}

export function formatSprintDuration(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const days = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
  return `${days} days`;
}