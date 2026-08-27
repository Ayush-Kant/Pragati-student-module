import { describe, it, expect } from "@jest/globals";

import readinessService from "../services/readinessService.js";
import analyticsService from "../services/analyticsService.js";
import {
  calculateConversionRates,
  calculateInterviewSuccessRate,
  generateMonthlyTrends,
  calculateReadinessProgression,
} from "../utils/analyticsHelpers.js";

describe("Analytics & Readiness Services", () => {
  it("calculateConversionRates accurately calculates conversion metrics", () => {
    const mockApps = [
      { status: "APPLIED" },
      { status: "SHORTLISTED" },
      { status: "TECHNICAL_INTERVIEW" },
      { status: "SELECTED" },
    ];

    const conversion = calculateConversionRates(mockApps);

    expect(conversion.shortlistedRate).toBe(75);
    expect(conversion.selectionConversionRate).toBe(25);
  });

  it("calculateInterviewSuccessRate handles empty and non-empty interviews", () => {
    expect(calculateInterviewSuccessRate([])).toBe(0);

    const mockInterviews = [
      { status: "COMPLETED" },
      { status: "COMPLETED" },
      { status: "SCHEDULED" },
      { status: "CANCELLED" },
    ];

    expect(calculateInterviewSuccessRate(mockInterviews)).toBe(50);
  });

  it("generateMonthlyTrends groups applications by month", () => {
    const mockApps = [
      { status: "APPLIED", appliedDate: "2026-01-15T00:00:00Z" },
      { status: "SELECTED", appliedDate: "2026-01-20T00:00:00Z" },
      { status: "SHORTLISTED", appliedDate: "2026-02-10T00:00:00Z" },
    ];

    const trends = generateMonthlyTrends(mockApps);

    expect(Array.isArray(trends)).toBe(true);
    expect(trends.length).toBe(2);
    expect(trends[0].month).toBe("2026-01");
    expect(trends[0].total).toBe(2);
    expect(trends[1].month).toBe("2026-02");
    expect(trends[1].total).toBe(1);
  });

  it("calculateReadinessProgression returns empty array when no history provided", () => {
    expect(calculateReadinessProgression([])).toEqual([]);
    expect(calculateReadinessProgression(null)).toEqual([]);
  });

  it("getSkillReadiness and getSkillGaps return structured skill metrics", async () => {
    const studentId = 401;
    const skills = await readinessService.getSkillReadiness(studentId);
    const gaps = await readinessService.getSkillGaps(studentId);

    expect(Array.isArray(skills)).toBe(true);
    expect(skills.length).toBeGreaterThan(0);
    expect(Array.isArray(gaps)).toBe(true);
    expect(gaps[0].gap).toBeGreaterThanOrEqual(gaps[gaps.length - 1].gap);
  });

  it("getPlacementAnalytics and getCareerRecommendations generate student data", async () => {
    const studentId = 402;
    const analytics = await analyticsService.getPlacementAnalytics(studentId);
    const recommendations = await analyticsService.getCareerRecommendations(studentId);

    expect(analytics.studentId).toBe(402);
    expect(analytics.conversionRates).toBeDefined();
    expect(analytics.readinessProgression).toEqual([]);
    expect(Array.isArray(recommendations)).toBe(true);
    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0].title).toBeDefined();
    expect(recommendations[0].recommendedAction).toBeDefined();
  });
});
