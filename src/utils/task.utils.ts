// lib/task.utils.ts

import { PriorityStatus, TaskStatus } from "@/types/task.types";

export const statusLabel: Record<TaskStatus, string> = {
  "todo":        "To Do",
  "in-progress": "In Progress",
  "review":      "Review",
  "done":        "Done",
};

// utils/task.utils.ts

export const allowedTransitions: Record<TaskStatus, TaskStatus[]> = {
  todo: ["in-progress"],
  "in-progress": ["review"],
  review: ["done"],
  done: [],
};

export const statusVariant: Record<TaskStatus, string> = {
  "todo":        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  "in-progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "review":      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "done":        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
};

export const priorityVariant: Record<PriorityStatus, string> = {
  "high":   "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "medium": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "low":    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
};

export const priorityDot: Record<PriorityStatus, string> = {
  "high":   "bg-red-500",
  "medium": "bg-amber-500",
  "low":    "bg-emerald-500",
};

export function isOverdue(dueDate: string, status: TaskStatus): boolean {
  if (status === "done") return false;
  return new Date(dueDate) < new Date();
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function subtaskProgress(subtasks: { isComplete: boolean }[]): number {
  if (!subtasks.length) return 0;
  return Math.round(
    (subtasks.filter((s) => s.isComplete).length / subtasks.length) * 100
  );
}

export function sprintProgress(tasks: { status: TaskStatus }[]): number {
  if (!tasks.length) return 0;
  return Math.round(
    (tasks.filter((t) => t.status === "done").length / tasks.length) * 100
  );
}

export function getDaysLeft(endDate: string): number {
  const diff = new Date(endDate).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Initials from name
export function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Avatar bg color from index
const AV_COLORS = [
  "bg-violet-200 text-violet-800",
  "bg-emerald-200 text-emerald-800",
  "bg-amber-200 text-amber-800",
  "bg-blue-200 text-blue-800",
  "bg-rose-200 text-rose-800",
  "bg-cyan-200 text-cyan-800",
];
export function avatarColor(index: number): string {
  return AV_COLORS[index % AV_COLORS.length];
}