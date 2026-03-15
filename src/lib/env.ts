import { z } from "zod";

// Server-side environment variable validation
// This file should only be imported from server-side code (Server Components, API Routes, Server Actions)
const serverEnvSchema = z.object({
  NOTION_API_KEY: z
    .string()
    .min(1, "NOTION_API_KEY is required"),
  NOTION_DATABASE_ID: z.string().min(1, "NOTION_DATABASE_ID is required"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

// Client-side environment variables (must be prefixed with NEXT_PUBLIC_)
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

function validateServerEnv() {
  const result = serverEnvSchema.safeParse(process.env);
  if (!result.success) {
    const formatted = result.error.flatten().fieldErrors;
    throw new Error(
      `Invalid environment variables:\n${JSON.stringify(formatted, null, 2)}`
    );
  }
  return result.data;
}

// Lazily validate to avoid errors during build when env vars aren't available
let _serverEnv: z.infer<typeof serverEnvSchema> | undefined;

export function getServerEnv() {
  if (!_serverEnv) {
    _serverEnv = validateServerEnv();
  }
  return _serverEnv;
}

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
