import { z } from "zod";

/* ----------------------------------------
   Base Schema
----------------------------------------- */
const projectBaseSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100),

  client: z
    .string()
    .min(2, "Client name is required")
    .max(100),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000),

  startDate: z.string().min(1, "Start date is required"),

  endDate: z.string().min(1, "End date is required"),

  budget: z
    .number({
      error: "Budget must be a number",
    })
    .positive("Budget must be positive"),

  status: z.enum([
    "planned",
    "active",
    "completed",
    "archived",
  ]),
  thumbnail: z.any().optional(),
});

/* ----------------------------------------
   Create Schema
----------------------------------------- */
export const createProjectSchema =
  projectBaseSchema.refine(
    (data) =>
      new Date(data.endDate) >
      new Date(data.startDate),
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

export type CreateProjectInput =
  z.infer<typeof createProjectSchema>;

/* ----------------------------------------
   Update Schema
----------------------------------------- */
export const updateProjectSchema =
  projectBaseSchema.partial();

export type UpdateProjectInput =
  z.infer<typeof updateProjectSchema>;