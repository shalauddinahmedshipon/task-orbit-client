export interface Sprint {
  _id: string;
  title: string;
  sprintNumber: number;
  startDate: string;
  endDate: string;
  projectId: string | { _id: string; title: string };
  order: number;
  createdAt: string;
  updatedAt: string;
  taskStats?: {
    total: number;
    completed: number;
    inProgress: number;
    review: number;
    todo: number;
  };
}

export interface CreateSprintPayload {
  title: string;
  startDate: string;
  endDate: string;
  projectId: string;
  order?: number;
}

export interface UpdateSprintPayload {
  title?: string;
  startDate?: string;
  endDate?: string;
  order?: number;
}

export interface SprintsQueryParams {
  projectId?: string;
}