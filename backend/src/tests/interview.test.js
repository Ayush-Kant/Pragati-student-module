import test from "node:test";
import assert from "node:assert/strict";

import interviewService from "../services/interviewService.js";
import { isValidInterviewTransition } from "../utils/placementHelpers.js";

test("isValidInterviewTransition validates interview status flow", () => {
  assert.equal(isValidInterviewTransition("SCHEDULED", "IN_PROGRESS"), true);
  assert.equal(isValidInterviewTransition("IN_PROGRESS", "COMPLETED"), true);
  assert.equal(isValidInterviewTransition("SCHEDULED", "CANCELLED"), true);
  assert.equal(isValidInterviewTransition("COMPLETED", "SCHEDULED"), false);
});

test("createInterview schedules an interview with multi-round support", async () => {
  const studentId = 301;
  const interviewData = {
    companyName: "Apple",
    jobTitle: "iOS Engineer",
    dateTime: "2026-09-01T10:00:00Z",
    location: "Google Meet",
    rounds: [
      { roundName: "Technical Round 1", roundOrder: 1, status: "SCHEDULED" },
      { roundName: "HR Round", roundOrder: 2, status: "SCHEDULED" },
    ],
  };

  const created = await interviewService.createInterview(studentId, interviewData);

  assert.ok(created.id);
  assert.equal(created.studentId, 301);
  assert.equal(created.companyName, "Apple");
  assert.equal(created.status, "SCHEDULED");
  assert.equal(created.rounds.length, 2);
  assert.equal(created.rounds[0].roundName, "Technical Round 1");
});

test("updateInterview updates status, feedback, and score", async () => {
  const studentId = 302;
  const created = await interviewService.createInterview(studentId, {
    companyName: "Netflix",
    jobTitle: "Systems Engineer",
    dateTime: "2026-09-05T14:00:00Z",
  });

  const updated = await interviewService.updateInterview(studentId, created.id, {
    status: "COMPLETED",
    feedback: "Strong problem solving skills and excellent coding style",
    score: 92,
  });

  assert.equal(updated.status, "COMPLETED");
  assert.equal(updated.score, 92);
  assert.match(updated.feedback, /Strong problem solving/);
});

test("updateInterview rejects invalid state transitions with 400 error", async () => {
  const studentId = 303;
  const created = await interviewService.createInterview(studentId, {
    companyName: "Uber",
    jobTitle: "Platform Engineer",
    dateTime: "2026-09-10T11:00:00Z",
  });

  await interviewService.updateInterview(studentId, created.id, { status: "COMPLETED" });

  await assert.rejects(
    interviewService.updateInterview(studentId, created.id, { status: "SCHEDULED" }),
    (err) => {
      assert.equal(err.status, 400);
      assert.equal(err.code, "INVALID_STATUS_TRANSITION");
      return true;
    }
  );
});

test("getInterviewById throws 404 for non-existent interview", async () => {
  const studentId = 304;
  await assert.rejects(interviewService.getInterviewById(studentId, 99999), (err) => {
    assert.equal(err.status, 404);
    return true;
  });
});
