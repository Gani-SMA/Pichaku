import { z } from "zod";

const envSchema = z.object({
  VITE_SUPABASE_PROJECT_ID: z.string().min(1, "Supabase Project ID is required"),
  VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1, "Supabase Publishable Key is required"),
  VITE_SUPABASE_URL: z.string().url("Supabase URL must be a valid URL"),
  VITE_ANALYTICS_ID: z.string().optional(),
  VITE_SENTRY_DSN: z.string().url().optional(),
});

function validateEnv() {
  try {
    return envSchema.parse(import.meta.env);
  } catch (error) {
    console.error("❌ Environment validation failed:", error);
    throw new Error("Invalid environment configuration. Please check your .env file.");
  }
}

export const env = validateEnv();

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>;