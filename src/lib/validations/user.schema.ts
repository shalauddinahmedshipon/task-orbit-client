// lib/validations/user.schema.ts
import { z } from "zod";

export const DEPARTMENTS = ["FRONTEND", "BACKEND", "UI/UX", "QA", "DevOps"] as const;
export const ROLES = ["admin", "manager", "member"] as const;

// ─── Create user ─────────────────────────────────────────────────────────────

export const createUserSchema = z.object({
  name:       z.string().min(2, "Name must be at least 2 characters"),
  email:      z.string().email("Invalid email address"),
  password:   z.string().min(6, "Password must be at least 6 characters"),
  role:       z.enum(ROLES, { error: "Role is required" }),
  department: z.enum(DEPARTMENTS, { error: "Department is required" }),
  skills:     z.string().optional(), // comma-separated, split on submit
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

// ─── Update user by admin ─────────────────────────────────────────────────────

export const updateUserByAdminSchema = z.object({
  name:       z.string().min(2).optional(),
  role:       z.enum(ROLES).optional(),
  department: z.enum(DEPARTMENTS).optional(),
  skills:     z.string().optional(),
  status:     z.enum(["in-progress", "blocked"]).optional(),
});

export type UpdateUserByAdminInput = z.infer<typeof updateUserByAdminSchema>;

// ─── Change password ──────────────────────────────────────────────────────────

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, "Old password required"),
    newPassword: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
