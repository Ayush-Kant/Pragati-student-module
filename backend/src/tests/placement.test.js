import test from "node:test";
import assert from "node:assert/strict";

import placementService from "../services/placementService.js";
import placementRoutes from "../routes/placementRoutes.js";
import { formatSuccessResponse, formatErrorResponse } from "../utils/placementHelpers.js";

test("getPlacementDashboard aggregates readiness score, application stats, and recommendations", async () => {
  const studentId = 101;
  const dashboard = await placementService.getPlacementDashboard(studentId);

  assert.equal(dashboard.studentId, 101);
  assert.ok(typeof dashboard.readinessScore === "number");
  assert.ok(typeof dashboard.applicationsCount === "number");
  assert.ok(typeof dashboard.interviewsCount === "number");
  assert.ok(Array.isArray(dashboard.skillReadiness));
  assert.ok(Array.isArray(dashboard.careerRecommendations));
  assert.ok(dashboard.applicationStatistics);
  assert.ok(dashboard.interviewStatistics);
});

test("formatSuccessResponse formats API payload cleanly", () => {
  const response = formatSuccessResponse({ score: 90 }, "Data fetched");
  assert.equal(response.success, true);
  assert.equal(response.message, "Data fetched");
  assert.equal(response.data.score, 90);
});

test("formatErrorResponse formats structured error output", () => {
  const response = formatErrorResponse("Invalid payload", "VALIDATION_ERROR");
  assert.equal(response.success, false);
  assert.equal(response.message, "Invalid payload");
  assert.equal(response.code, "VALIDATION_ERROR");
});

test("placementRoutes exposes all required API endpoint paths", () => {
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
