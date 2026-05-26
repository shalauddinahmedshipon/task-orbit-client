import { z } from "zod";

const sprintBaseSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

export const createSprintSchema = sprintBaseSchema.refine(
  (d) => new Date(d.endDate) > new Date(d.startDate),
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
);

export type CreateSprintInput = z.infer<typeof createSprintSchema>;

export const updateSprintSchema = sprintBaseSchema.partial();

export type UpdateSprintInput = z.infer<typeof updateSprintSchema>;