import { CSRFProtection, SecureLogger } from "./security";

interface RequestConfig extends RequestInit {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
}

interface ApiError extends Error {
  status?: number;
  code?: string;
}

export class ApiClient {
  private baseUrl: string;
  private defaultRetries: number = 3;
  private defaultRetryDelay: number = 1000;
  private defaultTimeout: number = 30000;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Exponential backoff delay calculation
   */
  private getRetryDelay(attempt: number, baseDelay: number): number {
    return baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: ApiError): boolean {
    // Retry on network errors
    if (!error.status) return true;

    // Retry on specific status codes
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    return retryableStatuses.includes(error.status);
  }

  /**
   * Make HTTP request with retry logic
   */
  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const {
      retries = this.defaultRetries,
      retryDelay = this.defaultRetryDelay,
      timeout = this.defaultTimeout,
      headers = {},
      ...fetchConfig
    } = config;

    const url = `${this.baseUrl}${endpoint}`;
    let lastError: ApiError | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        // Add CSRF token to headers for state-changing operations
        const requestHeaders = ["POST", "PUT", "DELETE", "PATCH"].includes(
          fetchConfig.method || "GET"
        )
          ? CSRFProtection.addTokenToHeaders(headers)
          : headers;

        const response = await fetch(url, {
          ...fetchConfig,
          headers: {
            "Content-Type": "application/json",
            ...requestHeaders,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle non-2xx responses
        if (!response.ok) {
          const error: ApiError = new Error(`HTTP ${response.status}: ${response.statusText}`);
          error.status = response.status;

          // Try to parse error response
          try {
            const errorData = await response.json();
            error.message = errorData.message || error.message;
            error.code = errorData.code;
          } catch {
            // Response is not JSON, use status text
          }

          throw error;
        }

        // Parse response
        const data = await response.json();

        SecureLogger.log("info", `API request successful: ${endpoint}`);
        return data as T;
      } catch (error) {
        lastError = error as ApiError;

        // Don't retry on client errors (4xx except 408, 429)
        if (lastError.status && lastError.status >= 400 && lastError.status < 500) {
          if (![408, 429].includes(lastError.status)) {
            throw lastError;
          }
        }

        // Don't retry if not retryable or last attempt
        if (!this.isRetryableError(lastError) || attempt === retries) {
          SecureLogger.log("error", `API request failed: ${endpoint}`, lastError);
          throw lastError;
        }

        // Wait before retrying
        const delay = this.getRetryDelay(attempt, retryDelay);
        SecureLogger.log(
          "warn",
          `Retrying request (attempt ${attempt + 1}/${retries}) after ${delay}ms`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError || new Error("Request failed");
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }
}

// Create API client instance
export const apiClient = new ApiClient(import.meta.env.VITE_SUPABASE_URL || "");
