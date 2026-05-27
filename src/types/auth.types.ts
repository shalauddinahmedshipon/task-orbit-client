// types/auth.types.ts

export type UserRole       = "admin" | "manager" | "member";
export type UserDepartment = "FRONTEND" | "BACKEND" | "UI/UX" | "QA" | "DevOps";
export type UserStatus     = "in-progress" | "blocked";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  department: UserDepartment;
  skills: string[];
  avatarUrl?: string;
  status: UserStatus;
  needsPasswordChange: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}