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