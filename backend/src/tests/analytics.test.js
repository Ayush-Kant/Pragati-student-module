import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import SkillReadiness from "../models/skillReadinessModel.js";
import CareerRecommendation from "../models/careerRecommendationModel.js";
import Application from "../models/applicationModel.js";
import Interview from "../models/interviewModel.js";
import sequelize from "../../config/sequelize.js";
import readinessService from "../services/readinessService.js";
import analyticsService from "../services/analyticsService.js";
import {
  calculateConversionRates,
  calculateInterviewSuccessRate,
  generateMonthlyTrends,
  calculateReadinessProgression,
} from "../utils/analyticsHelpers.js";
import { calculateOverallReadiness } from "../utils/readinessHelpers.js";

describe("Analytics & Readiness Services", () => {
  let mockTransaction;

  beforeEach(() => {
    mockTransaction = {
      commit: async () => {},
      rollback: async () => {},
      finished: false,
      LOCK: { UPDATE: "UPDATE" },
    };
    sequelize.transaction = async (arg1, arg2) => {
      const cb = typeof arg1 === "function" ? arg1 : typeof arg2 === "function" ? arg2 : null;
      if (cb) {
        try {
          const res = await cb(mockTransaction);
          await mockTransaction.commit();
          return res;
        } catch (err) {
          await mockTransaction.rollback();
          throw err;
        }
      }
      return mockTransaction;
    };
  });

  it("calculateConversionRates accurately calculates conversion metrics", () => {
    const mockApps = [
      { status: "APPLIED" },
      { status: "SHORTLISTED" },
      { status: "TECHNICAL_INTERVIEW" },
      { status: "SELECTED" },
    ];

    const conversion = calculateConversionRates(mockApps);

    assert.strictEqual(conversion.shortlistedRate, 75);
    assert.strictEqual(conversion.selectionConversionRate, 25);
  });

  it("calculateInterviewSuccessRate handles empty and non-empty interviews", () => {
    assert.strictEqual(calculateInterviewSuccessRate([]), 0);

    const mockInterviews = [
      { status: "COMPLETED" },
      { status: "COMPLETED" },
      { status: "SCHEDULED" },
      { status: "CANCELLED" },
    ];

    assert.strictEqual(calculateInterviewSuccessRate(mockInterviews), 50);
  });

  it("generateMonthlyTrends groups applications by month", () => {
    const mockApps = [
      { status: "APPLIED", appliedDate: "2026-01-15T00:00:00Z" },
      { status: "SELECTED", appliedDate: "2026-01-20T00:00:00Z" },
      { status: "SHORTLISTED", appliedDate: "2026-02-10T00:00:00Z" },
    ];

    const trends = generateMonthlyTrends(mockApps);

    assert.strictEqual(Array.isArray(trends), true);
    assert.strictEqual(trends.length, 2);
    assert.strictEqual(trends[0].month, "2026-01");
    assert.strictEqual(trends[0].total, 2);
    assert.strictEqual(trends[1].month, "2026-02");
    assert.strictEqual(trends[1].total, 1);
  });

  it("calculateReadinessProgression returns empty array when no history provided", () => {
    assert.deepStrictEqual(calculateReadinessProgression([]), []);
    assert.deepStrictEqual(calculateReadinessProgression(null), []);
  });

  it("calculateOverallReadiness returns 0 for empty skill readiness list", () => {
    assert.strictEqual(calculateOverallReadiness([], [], []), 0);
  });

  it("getSkillReadiness and getSkillGaps return structured skill metrics", async () => {
    const mockSkills = [
      { id: 1, skillName: "DSA", currentScore: 70, targetScore: 90, priority: "HIGH", toJSON: function () { return this; } },
      { id: 2, skillName: "System Design", currentScore: 80, targetScore: 85, priority: "MEDIUM", toJSON: function () { return this; } },
    ];
    SkillReadiness.findAll = async () => mockSkills;

    const studentId = 401;
    const skills = await readinessService.getSkillReadiness(studentId);
    const gaps = await readinessService.getSkillGaps(studentId);

    assert.strictEqual(Array.isArray(skills), true);
    assert.strictEqual(skills.length, 2);
    assert.strictEqual(Array.isArray(gaps), true);
    assert.ok(gaps[0].gap >= gaps[gaps.length - 1].gap);
  });

  it("getPlacementAnalytics and getCareerRecommendations generate student data", async () => {
    const studentId = 402;
    Application.findAll = async () => [];
    Interview.findAll = async () => [];
    SkillReadiness.findAll = async () => [];
    CareerRecommendation.findAll = async () => [];
    CareerRecommendation.bulkCreate = async () => [
      { title: "Expand Job Application Target Volume", priority: "MEDIUM", recommendedAction: "Apply now" }
    ];

    const analytics = await analyticsService.getPlacementAnalytics(studentId);
    const recommendations = await analyticsService.getCareerRecommendations(studentId);

    assert.strictEqual(analytics.studentId, 402);
    assert.ok(analytics.conversionRates !== undefined);
    assert.deepStrictEqual(analytics.readinessProgression, []);
    assert.strictEqual(Array.isArray(recommendations), true);
    assert.ok(recommendations.length > 0);
  });
});
