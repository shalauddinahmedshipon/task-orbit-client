import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["todo", "in-progress", "review", "done"]),
  estimatedHours: z
    .union([
      z.number().min(0),
      z.literal("").transform(() => undefined),
      z.undefined(),
      z.nan().transform(() => undefined),
    ])
    .optional() as z.ZodType<number | undefined>,
  dueDate: z.string().min(1, "Due date is required"),
  assignees: z.array(z.string()).optional(),
  reviewApproval: z.boolean().optional(),
});

export type TaskFormInput = z.infer<typeof taskSchema>;