import test from "node:test";
import assert from "node:assert/strict";

import applicationService from "../services/applicationService.js";
import { isValidApplicationTransition } from "../utils/placementHelpers.js";

test("isValidApplicationTransition allows valid state machine transitions", () => {
  assert.equal(isValidApplicationTransition("APPLIED", "SHORTLISTED"), true);
  assert.equal(isValidApplicationTransition("SHORTLISTED", "TECHNICAL_INTERVIEW"), true);
  assert.equal(isValidApplicationTransition("TECHNICAL_INTERVIEW", "SELECTED"), true);
  assert.equal(isValidApplicationTransition("APPLIED", "REJECTED"), true);
  assert.equal(isValidApplicationTransition("ASSESSMENT", "WITHDRAWN"), true);
});

test("isValidApplicationTransition rejects invalid state machine transitions", () => {
  assert.equal(isValidApplicationTransition("REJECTED", "SELECTED"), false);
  assert.equal(isValidApplicationTransition("WITHDRAWN", "TECHNICAL_INTERVIEW"), false);
  assert.equal(isValidApplicationTransition("SELECTED", "APPLIED"), false);
});

test("createApplication creates application and records initial history", async () => {
  const studentId = 201;
  const appData = {
    companyName: "Google",
    jobTitle: "Software Engineer",
    notes: "Applied via campus drive",
  };

  const created = await applicationService.createApplication(studentId, appData);

  assert.ok(created.id);
  assert.equal(created.studentId, 201);
  assert.equal(created.companyName, "Google");
  assert.equal(created.jobTitle, "Software Engineer");
  assert.equal(created.status, "APPLIED");
  assert.ok(Array.isArray(created.history));
  assert.equal(created.history[0].status, "APPLIED");
});

test("createApplication throws 409 conflict when duplicate application created", async () => {
  const studentId = 201;
  const appData = {
    companyName: "Google",
    jobTitle: "Software Engineer",
  };

  await assert.rejects(
    applicationService.createApplication(studentId, appData),
    (err) => {
      assert.equal(err.status, 409);
      assert.equal(err.code, "DUPLICATE_APPLICATION");
      return true;
    }
  );
});

test("updateApplicationStatus performs valid status transition and records history", async () => {
  const studentId = 202;
  const created = await applicationService.createApplication(studentId, {
    companyName: "Microsoft",
    jobTitle: "Frontend Developer",
  });

  const updated = await applicationService.updateApplicationStatus(
    studentId,
    created.id,
    "SHORTLISTED",
    "Shortlisted for technical round"
  );

  assert.equal(updated.status, "SHORTLISTED");
  assert.equal(updated.history.length, 2);
  assert.equal(updated.history[1].status, "SHORTLISTED");
});

test("updateApplicationStatus rejects invalid status transition with 400 error", async () => {
  const studentId = 203;
  const created = await applicationService.createApplication(studentId, {
    companyName: "Amazon",
    jobTitle: "Backend Developer",
  });

  await applicationService.updateApplicationStatus(studentId, created.id, "REJECTED");

  await assert.rejects(
    applicationService.updateApplicationStatus(studentId, created.id, "SELECTED"),
    (err) => {
      assert.equal(err.status, 400);
      assert.equal(err.code, "INVALID_STATUS_TRANSITION");
      return true;
    }
  );
});

test("getApplicationById throws 404 for non-existent or other student application", async () => {
  const studentId = 204;
  await assert.rejects(
    applicationService.getApplicationById(studentId, 99999),
    (err) => {
      assert.equal(err.status, 404);
      return true;
    }
  );
});

test("deleteApplication withdraws application successfully", async () => {
  const studentId = 205;
  const created = await applicationService.createApplication(studentId, {
    companyName: "Meta",
    jobTitle: "Data Engineer",
  });

  const deleteResult = await applicationService.deleteApplication(studentId, created.id);
  assert.equal(deleteResult.success, true);
});
