import { z } from "zod";
import {
  isStrongPassword,
  isValidEmailAddress,
  passwordMinLength,
} from "@/src/modules/auth/auth.rules";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .refine((value) => isValidEmailAddress(value), {
    message: "Enter a valid email address.",
  })
  .transform((value) => value.toLowerCase());

export const registerSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(
      passwordMinLength,
      `Password must be at least ${passwordMinLength} characters.`,
    )
    .max(72, "Password must be 72 characters or less.")
    .refine((value) => isStrongPassword(value), {
      message:
        "Password must include one uppercase letter, one number, and one special character.",
    }),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, "Password is required.")
    .max(72, "Password must be 72 characters or less."),
});
