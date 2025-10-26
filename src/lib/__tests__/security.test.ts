import { describe, it, expect } from "vitest";
import { sanitizeInput, generateCSRFToken, validateCSRFToken, SecureLogger } from "../security";

describe("Security Utilities", () => {
  describe("sanitizeInput", () => {
    it("should remove HTML tags", () => {
      const input = "<script>alert('xss')</script>Hello";
      const result = sanitizeInput(input);
      expect(result).toBe("Hello");
    });

    it("should remove script tags", () => {
      const input = "Hello<script>alert('xss')</script>World";
      const result = sanitizeInput(input);
      expect(result).toBe("HelloWorld");
    });

    it("should remove style tags", () => {
      const input = "Hello<style>body{display:none}</style>World";
      const result = sanitizeInput(input);
      expect(result).toBe("HelloWorld");
    });

    it("should remove iframe tags", () => {
      const input = "Hello<iframe src='evil.com'></iframe>World";
      const result = sanitizeInput(input);
      expect(result).toBe("HelloWorld");
    });

    it("should encode special characters", () => {
      const input = "Hello & <World>";
      const result = sanitizeInput(input);
      expect(result).not.toContain("<");
      expect(result).not.toContain(">");
    });

    it("should handle empty strings", () => {
      const result = sanitizeInput("");
      expect(result).toBe("");
    });

    it("should handle normal text", () => {
      const input = "This is normal text";
      const result = sanitizeInput(input);
      expect(result).toBe("This is normal text");
    });
  });

  describe("CSRF Token", () => {
    it("should generate a valid CSRF token", () => {
      const token = generateCSRFToken();
      expect(token).toBeTruthy();
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });

    it("should generate unique tokens", () => {
      const token1 = generateCSRFToken();
      const token2 = generateCSRFToken();
      expect(token1).not.toBe(token2);
    });

    it("should validate correct token", () => {
      const token = generateCSRFToken();
      const isValid = validateCSRFToken(token);
      expect(isValid).toBe(true);
    });

    it("should reject invalid token", () => {
      const isValid = validateCSRFToken("invalid-token");
      expect(isValid).toBe(false);
    });

    it("should reject empty token", () => {
      const isValid = validateCSRFToken("");
      expect(isValid).toBe(false);
    });
  });

  describe("SecureLogger", () => {
    it("should redact email addresses", () => {
      const message = "User email: test@example.com";
      const redacted = SecureLogger.redactSensitiveData(message);
      expect(redacted).not.toContain("test@example.com");
      expect(redacted).toContain("[REDACTED_EMAIL]");
    });

    it("should redact phone numbers", () => {
      const message = "Phone: 1234567890";
      const redacted = SecureLogger.redactSensitiveData(message);
      expect(redacted).not.toContain("1234567890");
      expect(redacted).toContain("[REDACTED_PHONE]");
    });

    it("should redact credit card numbers", () => {
      const message = "Card: 1234-5678-9012-3456";
      const redacted = SecureLogger.redactSensitiveData(message);
      expect(redacted).not.toContain("1234-5678-9012-3456");
      expect(redacted).toContain("[REDACTED_CC]");
    });

    it("should redact Aadhaar numbers", () => {
      const message = "Aadhaar: 1234 5678 9012";
      const redacted = SecureLogger.redactSensitiveData(message);
      expect(redacted).not.toContain("1234 5678 9012");
      expect(redacted).toContain("[REDACTED_AADHAAR]");
    });

    it("should redact PAN numbers", () => {
      const message = "PAN: ABCDE1234F";
      const redacted = SecureLogger.redactSensitiveData(message);
      expect(redacted).not.toContain("ABCDE1234F");
      expect(redacted).toContain("[REDACTED_PAN]");
    });

    it("should handle multiple sensitive data types", () => {
      const message = "Email: test@example.com, Phone: 1234567890";
      const redacted = SecureLogger.redactSensitiveData(message);
      expect(redacted).toContain("[REDACTED_EMAIL]");
      expect(redacted).toContain("[REDACTED_PHONE]");
    });
  });
});
