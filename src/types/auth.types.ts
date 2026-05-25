export type UserRole = "admin" | "manager" | "member";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;

  avatarUrl?: string;
  department?: string;
  skills?: string[];

  status: "in-progress" | "blocked";

  needsPasswordChange?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}