import { z } from "zod";

const envSchema = z.object({
  VITE_SUPABASE_PROJECT_ID: z.string().min(1, "VITE_SUPABASE_PROJECT_ID is required"),
  VITE_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .min(1, "VITE_SUPABASE_PUBLISHABLE_KEY is required")
    .startsWith("eyJ", "VITE_SUPABASE_PUBLISHABLE_KEY must be a valid JWT token"),
  VITE_SUPABASE_URL: z
    .string()
    .url("VITE_SUPABASE_URL must be a valid URL")
    .refine((url) => url.includes("supabase.co") || url.includes("localhost"), {
      message: "VITE_SUPABASE_URL must be a Supabase URL",
    }),
  VITE_ANALYTICS_ID: z.string().optional(),
  VITE_SENTRY_DSN: z.string().url().optional(),
  MODE: z.enum(["development", "production", "test"]).optional(),
  DEV: z.boolean().optional(),
  PROD: z.boolean().optional(),
});

function validateEnv() {
  try {
    const parsed = envSchema.parse(import.meta.env);

    // Warn if using demo/placeholder values
    if (
      parsed.VITE_SUPABASE_PROJECT_ID === "demo" ||
      parsed.VITE_SUPABASE_PUBLISHABLE_KEY === "demo" ||
      parsed.VITE_SUPABASE_URL === "https://demo.supabase.co"
    ) {
      console.warn(
        "⚠️ Warning: Using demo Supabase credentials. Please configure proper environment variables."
      );
    }

    return parsed;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("❌ Environment validation failed:", error);
    }
    throw new Error("Invalid environment configuration. Please check your .env file.");
  }
}

export const env = validateEnv();

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>;
