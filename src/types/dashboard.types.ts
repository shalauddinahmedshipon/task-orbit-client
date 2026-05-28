// types/dashboard.types.ts

export interface AdminDashboardStats {
  totalProjects:   number;
  activeProjects:  number;
  totalTasks:      number;
  totalMembers:    number;
  tasksInReview:   number;
  overdueTask:     number;
  totalHoursLogged: number;
}

export interface ReviewTask {
  _id:          string;
  title:        string;
  priority:     "low" | "medium" | "high";
  projectId:    { _id: string; title: string } | string;
  sprintId:     { _id: string; title: string } | string;
  assignees:    { _id: string; name: string; avatarUrl?: string }[];
  dueDate:      string;
  reviewApproval: boolean;
  updatedAt:    string;
}

export interface TodoTask {
  _id:       string;
  title:     string;
  priority:  "low" | "medium" | "high";
  projectId: { _id: string; title: string } | string;
  sprintId:  { _id: string; title: string } | string;
  dueDate:   string;
  estimatedHours: number;
  assignees: { _id: string; name: string; avatarUrl?: string }[];
}

export interface MemberDashboardData {
  myTodoTasks:      TodoTask[];
  myInProgressTasks: TodoTask[];
  myReviewTasks:    TodoTask[];
  weeklyHours:      number;
  totalProjects:    number;
}