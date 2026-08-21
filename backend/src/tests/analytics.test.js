import test from "node:test";
import assert from "node:assert/strict";

import readinessService from "../services/readinessService.js";
import analyticsService from "../services/analyticsService.js";
import {
  calculateConversionRates,
  calculateInterviewSuccessRate,
  generateMonthlyTrends,
} from "../utils/analyticsHelpers.js";

test("calculateConversionRates accurately calculates conversion metrics", () => {
  const mockApps = [
    { status: "APPLIED" },
    { status: "SHORTLISTED" },
    { status: "TECHNICAL_INTERVIEW" },
    { status: "SELECTED" },
  ];

  const conversion = calculateConversionRates(mockApps);

  assert.equal(conversion.shortlistedRate, 75);
  assert.equal(conversion.selectionConversionRate, 25);
});

test("calculateInterviewSuccessRate handles empty and non-empty interviews", () => {
  assert.equal(calculateInterviewSuccessRate([]), 0);

  const mockInterviews = [
    { status: "COMPLETED" },
    { status: "COMPLETED" },
    { status: "SCHEDULED" },
    { status: "CANCELLED" },
  ];

  assert.equal(calculateInterviewSuccessRate(mockInterviews), 50);
});

test("generateMonthlyTrends groups applications by month", () => {
  const mockApps = [
    { status: "APPLIED", appliedDate: "2026-01-15T00:00:00Z" },
    { status: "SELECTED", appliedDate: "2026-01-20T00:00:00Z" },
    { status: "SHORTLISTED", appliedDate: "2026-02-10T00:00:00Z" },
  ];

  const trends = generateMonthlyTrends(mockApps);

  assert.ok(Array.isArray(trends));
  assert.equal(trends.length, 2);
  assert.equal(trends[0].month, "2026-01");
  assert.equal(trends[0].total, 2);
  assert.equal(trends[1].month, "2026-02");
  assert.equal(trends[1].total, 1);
});

test("getSkillReadiness and getSkillGaps return structured skill metrics", async () => {
  const studentId = 401;
  const skills = await readinessService.getSkillReadiness(studentId);
  const gaps = await readinessService.getSkillGaps(studentId);

  assert.ok(Array.isArray(skills));
  assert.ok(skills.length > 0);
  assert.ok(Array.isArray(gaps));
  assert.ok(gaps[0].gap >= gaps[gaps.length - 1].gap);
});

test("getPlacementAnalytics and getCareerRecommendations generate student data", async () => {
  const studentId = 402;
  const analytics = await analyticsService.getPlacementAnalytics(studentId);
  const recommendations = await analyticsService.getCareerRecommendations(studentId);

  assert.equal(analytics.studentId, 402);
  assert.ok(analytics.conversionRates);
  assert.ok(Array.isArray(recommendations));
  assert.ok(recommendations.length > 0);
  assert.ok(recommendations[0].title);
  assert.ok(recommendations[0].recommendedAction);
});
