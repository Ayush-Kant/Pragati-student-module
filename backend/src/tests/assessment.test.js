import { jest } from "@jest/globals";
import request from "supertest";
import jwt from "jsonwebtoken";
import express from "express";

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

jest.unstable_mockModule("../services/assessmentService.js", () => {
  class ServiceError extends Error {
    constructor(statusCode, message) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  return {
    ServiceError,
    getAvailableAssessments: jest.fn(),
    getAssessmentDetails: jest.fn(),
    startAssessment: jest.fn(),
    submitAssessment: jest.fn(),
    getAssessmentResult: jest.fn(),
    getAssessmentHistory: jest.fn(),
  };
});

const assessmentService = await import("../services/assessmentService.js");
const { default: assessmentRoutes } = await import("../routes/assessmentRoutes.js");

const app = express();
app.use(express.json());
app.use("/api/student/assessments", assessmentRoutes);
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ success: false, message: err.message || "Server error" });
});

const studentToken = jwt.sign({ id: 1, role: "student" }, process.env.JWT_SECRET);

const assessmentId = 42;

describe("Assessments Backend", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/student/assessments", () => {
    it("rejects requests without a token", async () => {
      const res = await request(app).get("/api/student/assessments");
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("returns available assessments for an authenticated student", async () => {
      assessmentService.getAvailableAssessments.mockResolvedValue([
        { id: assessmentId, title: "JS Fundamentals" },
      ]);

      const res = await request(app)
        .get("/api/student/assessments")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe("GET /api/student/assessments/:assessmentId", () => {
    it("returns 404 when the assessment does not exist", async () => {
      assessmentService.getAssessmentDetails.mockRejectedValue(
        new assessmentService.ServiceError(404, "Assessment not found.")
      );

      const res = await request(app)
        .get(`/api/student/assessments/${assessmentId}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("rejects a malformed assessment id", async () => {
      const res = await request(app)
        .get("/api/student/assessments/not-a-number")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/student/assessments/:assessmentId/start", () => {
    it("starts a new attempt", async () => {
      assessmentService.startAssessment.mockResolvedValue({ id: 7, status: "in_progress" });

      const res = await request(app)
        .post(`/api/student/assessments/${assessmentId}/start`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(201);
      expect(res.body.data.status).toBe("in_progress");
    });
  });

  describe("POST /api/student/assessments/:assessmentId/submit", () => {
    const attemptId = 7;
    const questionId = 3;

    it("rejects a submission with no answers", async () => {
      const res = await request(app)
        .post(`/api/student/assessments/${assessmentId}/submit`)
        .set("Authorization", `Bearer ${studentToken}`)
        .send({ attemptId, answers: [] });

      expect(res.status).toBe(400);
    });

    it("submits and scores an assessment", async () => {
      assessmentService.submitAssessment.mockResolvedValue({ id: 9, percentage: 100, status: "passed" });

      const res = await request(app)
        .post(`/api/student/assessments/${assessmentId}/submit`)
        .set("Authorization", `Bearer ${studentToken}`)
        .send({ attemptId, answers: [{ questionId, selectedOption: 0 }] });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("passed");
    });

    it("returns 409 when the attempt was already submitted", async () => {
      assessmentService.submitAssessment.mockRejectedValue(
        new assessmentService.ServiceError(409, "This assessment attempt has already been submitted.")
      );

      const res = await request(app)
        .post(`/api/student/assessments/${assessmentId}/submit`)
        .set("Authorization", `Bearer ${studentToken}`)
        .send({ attemptId, answers: [{ questionId, selectedOption: 0 }] });

      expect(res.status).toBe(409);
    });
  });

  describe("GET /api/student/assessments/:assessmentId/result", () => {
    it("returns the result for the assessment", async () => {
      assessmentService.getAssessmentResult.mockResolvedValue({ percentage: 80, status: "passed" });

      const res = await request(app)
        .get(`/api/student/assessments/${assessmentId}/result`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.percentage).toBe(80);
    });
  });

  describe("GET /api/student/assessments/history", () => {
    it("returns paginated history", async () => {
      assessmentService.getAssessmentHistory.mockResolvedValue({
        attempts: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
      });

      const res = await request(app)
        .get("/api/student/assessments/history?page=1&limit=10")
        .set("Authorization", `Bearer ${studentToken}`);expect(res.status).toBe(200);
      expect(res.body.data.pagination.total).toBe(0);
    });
  });
});