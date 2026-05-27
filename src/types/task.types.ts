export type TaskStatus = "todo" | "in-progress" | "review" | "done";
export type PriorityStatus = "low" | "medium" | "high";

export interface Subtask {
  _id?: string;
  title: string;
  isComplete: boolean;
}

export interface Attachment {
  url: string;
  publicId: string;
  type: string;
  fileName: string;
  size: string;
}

export interface TaskAssignee {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  sprintId: string;
  projectId: string;
  assignees: TaskAssignee[];
  estimatedHours: number;
  status: TaskStatus;
  attachments: Attachment[];
  subtasks: Subtask[];
  priority: PriorityStatus;
  reviewApproval: boolean;
  dueDate: string;
  createdBy: string | TaskAssignee;
  createdAt: string;
  updatedAt: string;
}


export interface CreateTaskPayload {
  title: string;
  description?: string;
  sprintId: string;
  projectId?: string;
  assignees?: string[];
  estimatedHours?: number;
  status: TaskStatus;
  priority: PriorityStatus;
  reviewApproval?: boolean;
  dueDate: string;
}

export interface UpdateTaskPayload
  extends Partial<CreateTaskPayload> {}


export interface KanbanColumn {
  id: TaskStatus;
  label: string;
  color: string;
  dotColor: string;
}
 
export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: "todo",        label: "To Do",       color: "bg-muted/60",               dotColor: "bg-slate-400"  },
  { id: "in-progress", label: "In Progress", color: "bg-blue-50 dark:bg-blue-950/20",  dotColor: "bg-blue-500"   },
  { id: "review",      label: "Review",      color: "bg-amber-50 dark:bg-amber-950/20", dotColor: "bg-amber-500"  },
  { id: "done",        label: "Done",        color: "bg-emerald-50 dark:bg-emerald-950/20", dotColor: "bg-emerald-500" },
];