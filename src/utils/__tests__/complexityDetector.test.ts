import { describe, it, expect } from "vitest";
import { analyzeComplexity, isEmergency, getLawyerRecommendation } from "../complexityDetector";

describe("Complexity Detector", () => {
  describe("analyzeComplexity", () => {
    it("should detect low complexity for simple queries", () => {
      const query = "How do I file an FIR?";
      const result = analyzeComplexity(query);

      expect(result.score).toBeLessThan(40);
      expect(result.urgency).toBe("low");
    });

    it("should detect high complexity for murder cases", () => {
      const query = "I am accused of murder and need legal help";
      const result = analyzeComplexity(query);

      expect(result.score).toBeGreaterThan(40);
      expect(result.reasons).toContain("High stakes case detected");
    });

    it("should detect emergency situations", () => {
      const query = "Someone is threatening to kill me right now";
      const result = analyzeComplexity(query);

      expect(result.urgency).toBe("emergency");
      expect(result.score).toBeGreaterThan(60);
    });

    it("should detect multiple legal domains", () => {
      const query = "I have a property dispute and also facing criminal charges";
      const result = analyzeComplexity(query);

      expect(result.score).toBeGreaterThan(30);
      expect(result.reasons.some((r) => r.includes("Multiple legal domains"))).toBe(true);
    });

    it("should detect urgent matters", () => {
      const query = "I need bail immediately";
      const result = analyzeComplexity(query);

      expect(result.score).toBeGreaterThan(20);
      expect(result.urgency).not.toBe("low");
    });

    it("should handle empty queries", () => {
      const query = "";
      const result = analyzeComplexity(query);

      expect(result.score).toBe(0);
      expect(result.urgency).toBe("low");
    });
  });

  describe("isEmergency", () => {
    it("should return true for emergency situations", () => {
      const analysis = {
        score: 80,
        urgency: "emergency" as const,
        reasons: ["Life-threatening situation"],
        needsLawyer: true,
      };

      expect(isEmergency(analysis)).toBe(true);
    });

    it("should return false for non-emergency situations", () => {
      const analysis = {
        score: 20,
        urgency: "low" as const,
        reasons: [],
        needsLawyer: false,
      };

      expect(isEmergency(analysis)).toBe(false);
    });
  });

  describe("getLawyerRecommendation", () => {
    it("should recommend lawyer for complex cases", () => {
      const analysis = {
        score: 50,
        urgency: "high" as const,
        reasons: ["High stakes case"],
        needsLawyer: true,
      };

      const recommendation = getLawyerRecommendation(analysis);

      expect(recommendation).toBeTruthy();
      expect(recommendation).toContain("lawyer");
      expect(recommendation).toContain("NALSA");
    });

    it("should not recommend lawyer for simple cases", () => {
      const analysis = {
        score: 20,
        urgency: "low" as const,
        reasons: [],
        needsLawyer: false,
      };

      const recommendation = getLawyerRecommendation(analysis);

      expect(recommendation).toBe("");
    });

    it("should include emergency contacts for urgent cases", () => {
      const analysis = {
        score: 70,
        urgency: "emergency" as const,
        reasons: ["Life-threatening"],
        needsLawyer: true,
      };

      const recommendation = getLawyerRecommendation(analysis);

      expect(recommendation).toContain("112");
    });
  });
});
