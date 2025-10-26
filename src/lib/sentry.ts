import * as Sentry from "@sentry/react";
import { env } from "./env";

/**
 * Initialize Sentry for error tracking and performance monitoring
 */
export function initSentry() {
  // Only initialize in production or if DSN is provided
  if (env.MODE === "development" && !env.VITE_SENTRY_DSN) {
    console.log("Sentry not initialized in development mode");
    return;
  }

  Sentry.init({
    dsn: env.VITE_SENTRY_DSN,
    environment: env.MODE,

    // Performance Monitoring
    tracesSampleRate: env.MODE === "production" ? 0.1 : 1.0, // 10% in production, 100% in dev

    // Session Replay
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

    // Integrations
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Release tracking
    release: env.VITE_APP_VERSION || "unknown",

    // Error filtering
    beforeSend(event, hint) {
      // Filter out errors from browser extensions
      if (event.exception) {
        const error = hint.originalException;
        if (error && typeof error === "object" && "message" in error) {
          const message = String(error.message);
          if (message.includes("chrome-extension://") || message.includes("moz-extension://")) {
            return null;
          }
        }
      }

      // Don't send events in development unless explicitly enabled
      if (env.MODE === "development" && !env.VITE_SENTRY_DEBUG) {
        return null;
      }

      return event;
    },

    // Ignore certain errors
    ignoreErrors: [
      // Browser extensions
      "top.GLOBALS",
      "chrome-extension://",
      "moz-extension://",
      // Network errors
      "NetworkError",
      "Failed to fetch",
      "Load failed",
      // User cancellations
      "AbortError",
      "The user aborted a request",
    ],
  });
}

/**
 * Set user context for Sentry
 */
export function setSentryUser(user: { id: string; email?: string } | null) {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
    });
  } else {
    Sentry.setUser(null);
  }
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  category: string,
  level: "info" | "warning" | "error" = "info",
  data?: Record<string, unknown>
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Capture exception manually
 */
export function captureException(error: Error, context?: Record<string, unknown>) {
  if (context) {
    Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value as Record<string, unknown>);
      });
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
}

/**
 * Capture message manually
 */
export function captureMessage(
  message: string,
  level: "info" | "warning" | "error" = "info",
  context?: Record<string, unknown>
) {
  if (context) {
    Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value as Record<string, unknown>);
      });
      Sentry.captureMessage(message, level);
    });
  } else {
    Sentry.captureMessage(message, level);
  }
}

/**
 * Start a performance span
 */
export function startSpan(name: string, op: string) {
  return Sentry.startSpan(
    {
      name,
      op,
    },
    () => {
      // Span callback
    }
  );
}

/**
 * Set tag for filtering in Sentry
 */
export function setTag(key: string, value: string) {
  Sentry.setTag(key, value);
}

/**
 * Set context for additional debugging info
 */
export function setContext(name: string, context: Record<string, unknown>) {
  Sentry.setContext(name, context);
}
