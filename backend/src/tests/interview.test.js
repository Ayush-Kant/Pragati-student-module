import { describe, it, expect } from "@jest/globals";

import interviewService from "../services/interviewService.js";
import { isValidInterviewTransition } from "../utils/placementHelpers.js";

describe("Interview Service", () => {
  it("isValidInterviewTransition validates interview status flow", () => {
    expect(isValidInterviewTransition("SCHEDULED", "IN_PROGRESS")).toBe(true);
    expect(isValidInterviewTransition("IN_PROGRESS", "COMPLETED")).toBe(true);
    expect(isValidInterviewTransition("SCHEDULED", "CANCELLED")).toBe(true);
    expect(isValidInterviewTransition("COMPLETED", "SCHEDULED")).toBe(false);
  });

  it("createInterview schedules an interview with multi-round support", async () => {
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

    expect(created.id).toBeDefined();
    expect(created.studentId).toBe(301);
    expect(created.companyName).toBe("Apple");
    expect(created.status).toBe("SCHEDULED");
    expect(created.rounds.length).toBe(2);
    expect(created.rounds[0].roundName).toBe("Technical Round 1");
  });

  it("updateInterview updates status, feedback, and score", async () => {
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

    expect(updated.status).toBe("COMPLETED");
    expect(updated.score).toBe(92);
    expect(updated.feedback).toMatch(/Strong problem solving/);
  });

  it("updateInterview rejects invalid state transitions with 400 error", async () => {
    const studentId = 303;
    const created = await interviewService.createInterview(studentId, {
      companyName: "Uber",
      jobTitle: "Platform Engineer",
      dateTime: "2026-09-10T11:00:00Z",
    });

    await interviewService.updateInterview(studentId, created.id, { status: "COMPLETED" });

    await expect(
      interviewService.updateInterview(studentId, created.id, { status: "SCHEDULED" })
    ).rejects.toMatchObject({
      status: 400,
      code: "INVALID_STATUS_TRANSITION",
    });
  });

  it("getInterviewById throws 404 for non-existent interview", async () => {
    const studentId = 304;
    await expect(interviewService.getInterviewById(studentId, 99999)).rejects.toMatchObject({
      status: 404,
    });
  });
});
