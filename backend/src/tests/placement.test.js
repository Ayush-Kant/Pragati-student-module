import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import Application from "../models/applicationModel.js";
import Interview from "../models/interviewModel.js";
import SkillReadiness from "../models/skillReadinessModel.js";
import CareerRecommendation from "../models/careerRecommendationModel.js";
import sequelize from "../../config/sequelize.js";
import placementService from "../services/placementService.js";
import placementRoutes from "../routes/placementRoutes.js";
import { formatSuccessResponse, formatErrorResponse } from "../utils/placementHelpers.js";

describe("Placement Service & Routes", () => {
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

  it("getPlacementDashboard aggregates readiness score, application stats, and recommendations", async () => {
    Application.findAll = async () => [];
    Interview.findAll = async () => [];
    SkillReadiness.findAll = async () => [];
    CareerRecommendation.findAll = async () => [];
    CareerRecommendation.bulkCreate = async () => [];

    const studentId = 101;
    const dashboard = await placementService.getPlacementDashboard(studentId);

    assert.strictEqual(dashboard.studentId, 101);
    assert.strictEqual(typeof dashboard.readinessScore, "number");
    assert.strictEqual(typeof dashboard.applicationsCount, "number");
    assert.strictEqual(typeof dashboard.interviewsCount, "number");
    assert.strictEqual(Array.isArray(dashboard.skillReadiness), true);
    assert.strictEqual(Array.isArray(dashboard.careerRecommendations), true);
    assert.ok(dashboard.applicationStatistics !== undefined);
    assert.ok(dashboard.interviewStatistics !== undefined);
  });

  it("formatSuccessResponse formats API payload cleanly", () => {
    const response = formatSuccessResponse({ score: 90 }, "Data fetched");
    assert.strictEqual(response.success, true);
    assert.strictEqual(response.message, "Data fetched");
    assert.strictEqual(response.data.score, 90);
  });

  it("formatErrorResponse formats structured error output", () => {
    const response = formatErrorResponse("Invalid payload", "VALIDATION_ERROR");
    assert.strictEqual(response.success, false);
    assert.strictEqual(response.message, "Invalid payload");
    assert.strictEqual(response.code, "VALIDATION_ERROR");
  });

  it("placementRoutes exposes all required API endpoint paths", () => {
    const registeredPaths = placementRoutes.stack
      .filter((layer) => layer.route)
      .map((layer) => layer.route.path);

    assert.ok(registeredPaths.includes("/dashboard"));
    assert.ok(registeredPaths.includes("/applications"));
    assert.ok(registeredPaths.includes("/applications/:applicationId"));
    assert.ok(registeredPaths.includes("/applications/:applicationId/status"));
    assert.ok(registeredPaths.includes("/interviews"));
    assert.ok(registeredPaths.includes("/interviews/:interviewId"));
    assert.ok(registeredPaths.includes("/skills"));
    assert.ok(registeredPaths.includes("/skills/gaps"));
    assert.ok(registeredPaths.includes("/readiness"));
    assert.ok(registeredPaths.includes("/analytics"));
    assert.ok(registeredPaths.includes("/recommendations"));
  });
});
