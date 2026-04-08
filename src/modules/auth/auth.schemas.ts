import { z } from "zod";

const emailSchema = z.email().transform((value) => value.trim().toLowerCase());

export const registerSchema = z.object({
  email: emailSchema,
  password: z.string().min(8).max(72),
});

export const loginSchema = registerSchema;
