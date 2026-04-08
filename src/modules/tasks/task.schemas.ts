import { z } from "zod";
import { taskPriorityOptions, taskStatusOptions } from "@/src/lib/contracts";

const nullableTrimmedString = z
  .string()
  .max(2000)
  .optional()
  .nullable()
  .transform((value) => {
    if (typeof value !== "string") {
      return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  });

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: nullableTrimmedString,
  priority: z.enum(taskPriorityOptions).optional().nullable(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    description: nullableTrimmedString,
    status: z.enum(taskStatusOptions).optional(),
    priority: z.enum(taskPriorityOptions).optional().nullable(),
  })
  .refine(
    (value) =>
      value.title !== undefined ||
      value.description !== undefined ||
      value.status !== undefined ||
      value.priority !== undefined,
    {
      message: "At least one field must be provided.",
    },
  );

export const createNoteSchema = z.object({
  content: z.string().trim().min(1).max(2000),
});
