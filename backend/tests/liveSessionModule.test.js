import test from "node:test";
import assert from "node:assert/strict";

import { validateSession, validateAttendance, validateRecording, validateParticipant, validateSchedule } from "../src/validators/index.js";
import { formatSessionResponse, calculateDurationInMinutes } from "../src/utils/liveSessionHelpers.js";

test("session validator accepts a valid live session payload", () => {
  const { error, value } = validateSession.validate({
    title: "React Fundamentals",
    trainer: "John Doe",
    date: "2026-08-15",
    time: "10:00 AM",
    duration: "2 Hours",
  });

  assert.equal(error, undefined);
  assert.equal(value.title, "React Fundamentals");
});

test("attendance validator rejects an invalid attendance payload", () => {
  const { error } = validateAttendance.validate({ status: "Unknown" });

  assert.ok(error);
});

test("recording validator requires a recording URL", () => {
  const { error } = validateRecording.validate({
    title: "Demo",
    duration: "30 Minutes",
  });

  assert.ok(error);
});

test("participant validator accepts a numeric student id", () => {
  const { error, value } = validateParticipant.validate({ studentId: 101 });

  assert.equal(error, undefined);
  assert.equal(value.studentId, 101);
});

test("schedule validator accepts a valid schedule payload", () => {
  const { error } = validateSchedule.validate({
    title: "Node.js Backend",
    trainer: "Jane Smith",
    date: "2026-08-18",
    time: "2:00 PM",
    duration: "90 Minutes",
  });

  assert.equal(error, undefined);
});

test("helper functions format and calculate durations", () => {
  const session = formatSessionResponse({ scheduledAt: "2026-08-15T10:00:00.000Z" });
  assert.ok(session.formattedScheduledAt);
  assert.equal(calculateDurationInMinutes("2 Hours"), 120);
});
