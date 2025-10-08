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
 */
export const CSP_CONFIG = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'", // Required for Vite in development
    "'unsafe-eval'", // Required for Vite in development
    "https://fonts.googleapis.com",
  ],
  "style-src": [
    "'self'",
    "'unsafe-inline'",
    "https://fonts.googleapis.com",
  ],
  "font-src": [
    "'self'",
    "https://fonts.gstatic.com",
  ],
  "img-src": [
    "'self'",
    "data:",
    "https:",
  ],
  "connect-src": [
    "'self'",
    "https://*.supabase.co",
    "https://generativelanguage.googleapis.com",
  ],
  "frame-ancestors": ["'none'"],
};

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
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
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
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }
}

/**
 * Secure session storage wrapper
 */
export class SecureStorage {
  private static encrypt(data: string): string {
    // In a real implementation, use proper encryption
    return btoa(data);
  }
  
  private static decrypt(data: string): string {
    try {
      return atob(data);
    } catch {
      return "";
    }
  }
  
  static setItem(key: string, value: string): void {
    try {
      const encrypted = this.encrypt(value);
      sessionStorage.setItem(key, encrypted);
    } catch (error) {
      console.error("Failed to store data securely:", error);
    }
  }
  
  static getItem(key: string): string | null {
    try {
      const encrypted = sessionStorage.getItem(key);
      if (!encrypted) return null;
      
      return this.decrypt(encrypted);
    } catch (error) {
      console.error("Failed to retrieve data securely:", error);
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