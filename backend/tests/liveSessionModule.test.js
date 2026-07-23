import test from "node:test";
import assert from "node:assert/strict";

import { validateAttendance, validateParticipant } from "../src/validators/index.js";
import participantModel from "../src/models/participantModel.js";
import scheduleModel from "../src/models/scheduleModel.js";
import participantRoutes from "../src/routes/participantRoutes.js";
import { pool } from "../config/db.js";

test("attendance validator rejects an invalid attendance payload", () => {
  const { error } = validateAttendance.validate({ status: "Unknown" });

  assert.ok(error);
});

test("participant validator accepts a numeric student id", () => {
  const { error, value } = validateParticipant.validate({ studentId: 101 });

  assert.equal(error, undefined);
  assert.equal(value.studentId, 101);
});

test("participant model reads the full_name column from users", async () => {
  const originalQuery = pool.query;
  let capturedQuery = "";

  pool.query = async (text) => {
    capturedQuery = text;
    return { rows: [] };
  };

  try {
    await participantModel.getParticipants(42);
  } finally {
    pool.query = originalQuery;
  }

  assert.match(capturedQuery, /u\.full_name/);
  assert.doesNotMatch(capturedQuery, /u\.name/);
});

test("schedule model reads schedule data directly from session_schedules", async () => {
  const originalQuery = pool.query;
  let capturedQuery = "";

  pool.query = async (text) => {
    capturedQuery = text;
    return { rows: [] };
  };

  try {
    await scheduleModel.getSchedules();
  } finally {
    pool.query = originalQuery;
  }

  assert.match(capturedQuery, /FROM session_schedules ss/);
  assert.doesNotMatch(capturedQuery, /JOIN live_sessions ls/);
});

test("participant routes expose clean participant endpoints", () => {
  const stack = participantRoutes.stack || [];
  const routePaths = stack
    .filter((layer) => layer.route)
    .map((layer) => layer.route.path);

  assert.ok(routePaths.includes('/:id'));
  assert.ok(routePaths.includes('/:id/:studentId'));
});
