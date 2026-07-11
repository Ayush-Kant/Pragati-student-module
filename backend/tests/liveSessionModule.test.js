import test from "node:test";
import assert from "node:assert/strict";

import express from "express";
import { validateSession, validateAttendance, validateRecording, validateParticipant, validateSchedule } from "../src/validators/index.js";
import { formatSessionResponse, calculateDurationInMinutes } from "../src/utils/liveSessionHelpers.js";
import participantModel from "../src/models/participantModel.js";
import scheduleModel from "../src/models/scheduleModel.js";
import participantRoutes from "../src/routes/participantRoutes.js";
import { pool } from "../config/db.js";

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
  assert.ok(routePaths.includes('/:id/:participantId'));
});
