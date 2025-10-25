// Security utilities and configurations

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim();
}

/**
 * Validate and sanitize URLs
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);

    // Only allow http and https protocols
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Invalid protocol");
    }

    return parsedUrl.toString();
  } catch {
    return "";
  }
}

/**
 * Content Security Policy configuration
 * Note: 'unsafe-inline' and 'unsafe-eval' are only for development
 * In production builds, these should be removed
 */
export const getCSPConfig = () => {
  const isDev = import.meta.env.DEV;

  return {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      ...(isDev ? ["'unsafe-inline'", "'unsafe-eval'"] : []), // Only in development
      "https://fonts.googleapis.com",
      "https://www.googletagmanager.com",
    ],
    "style-src": [
      "'self'",
      "'unsafe-inline'", // Required for styled components
      "https://fonts.googleapis.com",
    ],
    "font-src": ["'self'", "https://fonts.gstatic.com"],
    "img-src": ["'self'", "data:", "https:"],
    "connect-src": ["'self'", "https://*.supabase.co", "https://generativelanguage.googleapis.com"],
    "frame-ancestors": ["'none'"],
  };
};

// Export static config for backwards compatibility
export const CSP_CONFIG = getCSPConfig();

/**
 * Rate limiting for API calls
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  constructor(
    private maxRequests: number = 10,
    private windowMs: number = 60000 // 1 minute
  ) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];

    // Remove old requests outside the window
    const validRequests = requests.filter((time) => now - time < this.windowMs);

    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(identifier, validRequests);

    return true;
  }

  getRemainingRequests(identifier: string): number {
    const requests = this.requests.get(identifier) || [];
    const now = Date.now();
    const validRequests = requests.filter((time) => now - time < this.windowMs);

    return Math.max(0, this.maxRequests - validRequests.length);
  }
}

/**
 * Session storage wrapper with Web Crypto API encryption
 * Note: This provides encryption at rest in sessionStorage, but keys are still in memory
 * For truly sensitive data, consider server-side storage only
 */
export class SecureStorage {
  private static readonly ENCRYPTION_KEY_NAME = "app_encryption_key";

  private static async getOrCreateKey(): Promise<CryptoKey> {
    // Try to get existing key from sessionStorage
    const storedKey = sessionStorage.getItem(this.ENCRYPTION_KEY_NAME);

    if (storedKey) {
      try {
        const keyData = JSON.parse(storedKey);
        return await crypto.subtle.importKey(
          "jwk",
          keyData,
          { name: "AES-GCM", length: 256 },
          true,
          ["encrypt", "decrypt"]
        );
      } catch {
        // If import fails, generate new key
      }
    }

    // Generate new key
    const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
      "encrypt",
      "decrypt",
    ]);

    // Store key for session
    const exportedKey = await crypto.subtle.exportKey("jwk", key);
    sessionStorage.setItem(this.ENCRYPTION_KEY_NAME, JSON.stringify(exportedKey));

    return key;
  }

  private static async encrypt(data: string): Promise<string> {
    const key = await this.getOrCreateKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(data);

    const encryptedData = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encodedData);

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedData), iv.length);

    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
  }

  private static async decrypt(encryptedData: string): Promise<string> {
    const key = await this.getOrCreateKey();
    const combined = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0));

    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decryptedData = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);

    return new TextDecoder().decode(decryptedData);
  }

  static async setItem(key: string, value: string): Promise<void> {
    try {
      const encrypted = await this.encrypt(value);
      sessionStorage.setItem(key, encrypted);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Failed to store data securely:", error);
      }
    }
  }

  static async getItem(key: string): Promise<string | null> {
    try {
      const encrypted = sessionStorage.getItem(key);
      if (!encrypted) return null;

      return await this.decrypt(encrypted);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Failed to retrieve data securely:", error);
      }
      return null;
    }
  }

  static removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  static clear(): void {
    sessionStorage.clear();
  }
}
