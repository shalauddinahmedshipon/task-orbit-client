export type ProjectStatus = "planned" | "active" | "completed" | "archived";

export interface ProjectMember {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
}

export interface Project {
  _id: string;
  title: string;
  thumbnail?: string;
  client: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: ProjectStatus;
  members: ProjectMember[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  // aggregated stats (from backend populate/virtual)
  taskStats?: {
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
    review: number;
  };
}

export interface CreateProjectPayload {
  title: string;
  client: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: ProjectStatus;
  thumbnail?: File;
}

export interface UpdateProjectPayload extends Partial<CreateProjectPayload> {
  projectId: string;
}

export interface ProjectsQueryParams {
  status?: ProjectStatus | "";
  client?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ProjectsResponse {
  success: boolean;
  message: string;
  data: Project[];
}