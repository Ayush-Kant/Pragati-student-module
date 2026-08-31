import { describe, it, expect, jest, beforeEach } from "@jest/globals";
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
    jest.clearAllMocks();
    mockTransaction = {
      commit: jest.fn().mockResolvedValue(),
      rollback: jest.fn().mockResolvedValue(),
      finished: false,
      LOCK: { UPDATE: "UPDATE" },
    };
    jest.spyOn(sequelize, "transaction").mockImplementation(async (arg1, arg2) => {
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
    });
  });

  it("getPlacementDashboard aggregates readiness score, application stats, and recommendations", async () => {
    jest.spyOn(Application, "findAll").mockResolvedValue([]);
    jest.spyOn(Interview, "findAll").mockResolvedValue([]);
    jest.spyOn(SkillReadiness, "findAll").mockResolvedValue([]);
    jest.spyOn(CareerRecommendation, "findAll").mockResolvedValue([]);
    jest.spyOn(CareerRecommendation, "bulkCreate").mockResolvedValue([]);

    const studentId = 101;
    const dashboard = await placementService.getPlacementDashboard(studentId);

    expect(dashboard.studentId).toBe(101);
    expect(typeof dashboard.readinessScore).toBe("number");
    expect(typeof dashboard.applicationsCount).toBe("number");
    expect(typeof dashboard.interviewsCount).toBe("number");
    expect(Array.isArray(dashboard.skillReadiness)).toBe(true);
    expect(Array.isArray(dashboard.careerRecommendations)).toBe(true);
    expect(dashboard.applicationStatistics).toBeDefined();
    expect(dashboard.interviewStatistics).toBeDefined();
  });

  it("formatSuccessResponse formats API payload cleanly", () => {
    const response = formatSuccessResponse({ score: 90 }, "Data fetched");
    expect(response.success).toBe(true);
    expect(response.message).toBe("Data fetched");
    expect(response.data.score).toBe(90);
  });

  it("formatErrorResponse formats structured error output", () => {
    const response = formatErrorResponse("Invalid payload", "VALIDATION_ERROR");
    expect(response.success).toBe(false);
    expect(response.message).toBe("Invalid payload");
    expect(response.code).toBe("VALIDATION_ERROR");
  });

  it("placementRoutes exposes all required API endpoint paths", () => {
    const registeredPaths = placementRoutes.stack
      .filter((layer) => layer.route)
      .map((layer) => layer.route.path);

    expect(registeredPaths).toContain("/dashboard");
    expect(registeredPaths).toContain("/applications");
    expect(registeredPaths).toContain("/applications/:applicationId");
    expect(registeredPaths).toContain("/applications/:applicationId/status");
    expect(registeredPaths).toContain("/interviews");
    expect(registeredPaths).toContain("/interviews/:interviewId");
    expect(registeredPaths).toContain("/skills");
    expect(registeredPaths).toContain("/skills/gaps");
    expect(registeredPaths).toContain("/readiness");
    expect(registeredPaths).toContain("/analytics");
    expect(registeredPaths).toContain("/recommendations");
  });
});
