import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import Interview from "../models/interviewModel.js";
import InterviewRound from "../models/interviewRoundModel.js";
import Application from "../models/applicationModel.js";
import sequelize from "../../config/sequelize.js";
import interviewService from "../services/interviewService.js";
import { isValidInterviewTransition } from "../utils/placementHelpers.js";

describe("Interview Service", () => {
  let mockTransaction;
  let committed = false;
  let rolledBack = false;

  beforeEach(() => {
    committed = false;
    rolledBack = false;
    mockTransaction = {
      commit: async () => { committed = true; },
      rollback: async () => { rolledBack = true; },
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

  it("isValidInterviewTransition validates interview status flow", () => {
    assert.strictEqual(isValidInterviewTransition("SCHEDULED", "IN_PROGRESS"), true);
    assert.strictEqual(isValidInterviewTransition("IN_PROGRESS", "COMPLETED"), true);
    assert.strictEqual(isValidInterviewTransition("SCHEDULED", "CANCELLED"), true);
    assert.strictEqual(isValidInterviewTransition("COMPLETED", "SCHEDULED"), false);
  });

  it("createInterview schedules an interview with multi-round support", async () => {
    const mockInterview = {
      id: 5,
      studentId: 301,
      companyName: "Apple",
      jobTitle: "iOS Engineer",
      status: "SCHEDULED",
      toJSON: function () {
        return this;
      },
    };
    const mockRound = {
      id: 1,
      interviewId: 5,
      roundName: "Technical Round 1",
      status: "SCHEDULED",
      toJSON: function () {
        return this;
      },
    };

    Interview.create = async () => mockInterview;
    InterviewRound.create = async () => mockRound;

    const interviewData = {
      companyName: "Apple",
      jobTitle: "iOS Engineer",
      dateTime: "2026-09-01T10:00:00Z",
      location: "Google Meet",
      rounds: [{ roundName: "Technical Round 1", roundOrder: 1, status: "SCHEDULED" }],
    };

    const created = await interviewService.createInterview(301, interviewData);

    assert.strictEqual(created.id, 5);
    assert.strictEqual(created.status, "SCHEDULED");
    assert.strictEqual(created.rounds.length, 1);
    assert.strictEqual(committed, true);
  });

  it("createInterview rejects invalid or unowned applicationId", async () => {
    Application.findOne = async () => null;

    await assert.rejects(
      async () => {
        await interviewService.createInterview(305, {
          companyName: "Stripe",
          applicationId: 999,
          dateTime: "2026-09-02T10:00:00Z",
        });
      },
      (err) => err.status === 404
    );
  });

  it("updateInterview updates status, feedback, and score", async () => {
    let saved = false;
    const dbInterview = {
      id: 8,
      studentId: 302,
      status: "SCHEDULED",
      save: async function () { saved = true; },
      toJSON: function () {
        return this;
      },
    };
    Interview.findOne = async () => dbInterview;

    const updated = await interviewService.updateInterview(302, 8, {
      status: "COMPLETED",
      feedback: "Strong problem solving skills",
      score: 92,
    });

    assert.strictEqual(updated.status, "COMPLETED");
    assert.strictEqual(updated.score, 92);
    assert.strictEqual(saved, true);
    assert.strictEqual(committed, true);
  });

  it("updateInterview rejects invalid state transitions with 400 error", async () => {
    const dbInterview = {
      id: 9,
      studentId: 303,
      status: "COMPLETED",
    };
    Interview.findOne = async () => dbInterview;

    await assert.rejects(
      async () => {
        await interviewService.updateInterview(303, 9, { status: "SCHEDULED" });
      },
      (err) => err.status === 400 && err.code === "INVALID_STATUS_TRANSITION"
    );
    assert.strictEqual(rolledBack, true);
  });

  it("getInterviewById throws 404 for non-existent interview", async () => {
    Interview.findOne = async () => null;

    await assert.rejects(
      async () => {
        await interviewService.getInterviewById(304, 99999);
      },
      (err) => err.status === 404
    );
  });
});
