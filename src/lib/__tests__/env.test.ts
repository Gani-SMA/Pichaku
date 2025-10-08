import { describe, it, expect, beforeEach, afterEach } from "vitest";

describe("Environment Validation", () => {
  const originalEnv = import.meta.env;

  beforeEach(() => {
    // Reset environment
    Object.defineProperty(import.meta, "env", {
      value: { ...originalEnv },
      writable: true,
    });
  });

  afterEach(() => {
    // Restore original environment
    Object.defineProperty(import.meta, "env", {
      value: originalEnv,
      writable: true,
    });
  });

  it("should validate required environment variables", async () => {
    // Set valid environment variables
    Object.defineProperty(import.meta, "env", {
      value: {
        VITE_SUPABASE_PROJECT_ID: "test-project-id",
        VITE_SUPABASE_PUBLISHABLE_KEY: "test-key",
        VITE_SUPABASE_URL: "https://test.supabase.co",
      },
      writable: true,
    });

    // Dynamic import to get fresh validation
    const { env } = await import("../env");
    
    expect(env.VITE_SUPABASE_PROJECT_ID).toBe("test-project-id");
    expect(env.VITE_SUPABASE_PUBLISHABLE_KEY).toBe("test-key");
    expect(env.VITE_SUPABASE_URL).toBe("https://test.supabase.co");
  });

  it("should throw error for missing required variables", async () => {
    // Set invalid environment
    Object.defineProperty(import.meta, "env", {
      value: {
        VITE_SUPABASE_PROJECT_ID: "",
        VITE_SUPABASE_PUBLISHABLE_KEY: "test-key",
        VITE_SUPABASE_URL: "https://test.supabase.co",
      },
      writable: true,
    });

    // Clear module cache to force re-evaluation
    delete require.cache[require.resolve("../env")];

    await expect(async () => {
      await import("../env?t=" + Date.now());
    }).rejects.toThrow("Invalid environment configuration");
  });
});