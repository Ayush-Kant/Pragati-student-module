import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import Interview from "../models/interviewModel.js";
import InterviewRound from "../models/interviewRoundModel.js";
import Application from "../models/applicationModel.js";
import sequelize from "../../config/sequelize.js";
import interviewService from "../services/interviewService.js";
import { isValidInterviewTransition } from "../utils/placementHelpers.js";

describe("Interview Service", () => {
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

  it("isValidInterviewTransition validates interview status flow", () => {
    expect(isValidInterviewTransition("SCHEDULED", "IN_PROGRESS")).toBe(true);
    expect(isValidInterviewTransition("IN_PROGRESS", "COMPLETED")).toBe(true);
    expect(isValidInterviewTransition("SCHEDULED", "CANCELLED")).toBe(true);
    expect(isValidInterviewTransition("COMPLETED", "SCHEDULED")).toBe(false);
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

    jest.spyOn(Interview, "create").mockResolvedValue(mockInterview);
    jest.spyOn(InterviewRound, "create").mockResolvedValue(mockRound);

    const interviewData = {
      companyName: "Apple",
      jobTitle: "iOS Engineer",
      dateTime: "2026-09-01T10:00:00Z",
      location: "Google Meet",
      rounds: [{ roundName: "Technical Round 1", roundOrder: 1, status: "SCHEDULED" }],
    };

    const created = await interviewService.createInterview(301, interviewData);

    expect(created.id).toBe(5);
    expect(created.status).toBe("SCHEDULED");
    expect(created.rounds.length).toBe(1);
    expect(mockTransaction.commit).toHaveBeenCalled();
  });

  it("createInterview rejects invalid or unowned applicationId", async () => {
    jest.spyOn(Application, "findOne").mockResolvedValue(null);

    await expect(
      interviewService.createInterview(305, {
        companyName: "Stripe",
        applicationId: 999,
        dateTime: "2026-09-02T10:00:00Z",
      })
    ).rejects.toMatchObject({
      status: 404,
    });
  });

  it("updateInterview updates status, feedback, and score", async () => {
    const dbInterview = {
      id: 8,
      studentId: 302,
      status: "SCHEDULED",
      save: jest.fn().mockResolvedValue(),
      toJSON: function () {
        return this;
      },
    };
    jest.spyOn(Interview, "findOne").mockResolvedValue(dbInterview);

    const updated = await interviewService.updateInterview(302, 8, {
      status: "COMPLETED",
      feedback: "Strong problem solving skills",
      score: 92,
    });

    expect(updated.status).toBe("COMPLETED");
    expect(updated.score).toBe(92);
    expect(dbInterview.save).toHaveBeenCalled();
    expect(mockTransaction.commit).toHaveBeenCalled();
  });

  it("updateInterview rejects invalid state transitions with 400 error", async () => {
    const dbInterview = {
      id: 9,
      studentId: 303,
      status: "COMPLETED",
    };
    jest.spyOn(Interview, "findOne").mockResolvedValue(dbInterview);

    await expect(
      interviewService.updateInterview(303, 9, { status: "SCHEDULED" })
    ).rejects.toMatchObject({
      status: 400,
      code: "INVALID_STATUS_TRANSITION",
    });
    expect(mockTransaction.rollback).toHaveBeenCalled();
  });

  it("getInterviewById throws 404 for non-existent interview", async () => {
    jest.spyOn(Interview, "findOne").mockResolvedValue(null);

    await expect(interviewService.getInterviewById(304, 99999)).rejects.toMatchObject({
      status: 404,
    });
  });
});
