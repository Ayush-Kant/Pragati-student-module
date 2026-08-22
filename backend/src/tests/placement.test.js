import { describe, it, expect } from "@jest/globals";

import placementService from "../services/placementService.js";
import placementRoutes from "../routes/placementRoutes.js";
import { formatSuccessResponse, formatErrorResponse } from "../utils/placementHelpers.js";

describe("Placement Service & Routes", () => {
  it("getPlacementDashboard aggregates readiness score, application stats, and recommendations", async () => {
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
