import { z } from "zod";

const minutesSchema = z.int().min(1).max(180);

export const createRoutineSchema = z.object({
  name: z.string().trim().min(1).max(80),
  workMinutes: minutesSchema,
  shortRestMinutes: minutesSchema,
  longRestMinutes: minutesSchema,
  cyclesBeforeLongRest: z.int().min(1).max(12),
});

export const updateRoutineSchema = createRoutineSchema
  .partial()
  .refine((value) => Object.values(value).some((item) => item !== undefined), {
    message: "At least one field must be provided.",
  });

export const upsertPlanSchema = z
  .object({
    routineId: z.string().uuid(),
    totalCycles: z.int().min(1).max(24),
    completedCycles: z.int().min(0).max(24).optional(),
  })
  .refine((value) => (value.completedCycles ?? 0) <= value.totalCycles, {
    message: "Completed cycles cannot exceed total cycles.",
    path: ["completedCycles"],
  });
