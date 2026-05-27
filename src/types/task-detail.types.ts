// types/task-detail.types.ts

import type { TaskAssignee } from "@/types/task.types";

// ─── Comment ─────────────────────────────────────────────────────────────────

export interface Comment {
  _id: string;
  taskId: string;
  userId: TaskAssignee;   // populated
  message: string;
  createdAt: string;
  updatedAt: string;
}

// ─── TimeLog ─────────────────────────────────────────────────────────────────

export interface TimeLog {
  _id: string;
  taskId: string;
  userId: TaskAssignee;   // populated
  hours: number;
  logDate: string;
  description?: string;
  createdAt: string;
}

// ─── ActivityLog ─────────────────────────────────────────────────────────────

export interface ActivityLog {
  _id: string;
  taskId: string;
  userId: TaskAssignee;   // populated
  action: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}

// ─── Sidebar tab ─────────────────────────────────────────────────────────────

export type TaskDetailTab = "comments" | "activity" | "timelog";