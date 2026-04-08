import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(32),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export function getServerEnv() {
  return serverEnvSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  });
}
