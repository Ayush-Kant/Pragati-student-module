import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../server.js";
import sequelize from "../config/sequelize.js";
import { execSync } from "child_process";

describe("Training Coordination API Integration Tests", () => {
  let companyToken;
  let adminToken;
  let invalidToken = "Bearer invalid_token_xyz";

  beforeAll(async () => {
    // Re-seed the database
    execSync("node scripts/seed.js");
    await sequelize.authenticate();
    // Generate valid tokens
    const secret = process.env.JWT_SECRET || "super_secret_for_testing";
    companyToken =
      "Bearer " +
      jwt.sign(
        { userId: "uuid-company-1", email: "hr@google.com", role: "company" },
        secret,
        { expiresIn: "1h" }
      );
    adminToken =
      "Bearer " +
      jwt.sign(
        { userId: "uuid-admin-1", email: "admin@example.com", role: "admin" },
        secret,
        { expiresIn: "1h" }
      );
  });

  describe("GET /api/v1/company/training", () => {
    it("should return 200 with training programs for authenticated company user", async () => {
      const res = await request(app)
        .get("/api/v1/company/training")
        .set("Authorization", companyToken);

      console.log("GET /api/v1/company/training response text:", res.text);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.pagination).toBeDefined();
    });

    it("should support status filtering", async () => {
      const res = await request(app)
        .get("/api/v1/company/training?status=ACTIVE")
        .set("Authorization", companyToken);

      expect(res.status).toBe(200);
      expect(res.body.data.every((t) => t.status === "ACTIVE")).toBe(true);
    });

    it("should return 401 for invalid JWT token", async () => {
      const res = await request(app)
        .get("/api/v1/company/training")
        .set("Authorization", invalidToken);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/v1/company/training/:id", () => {
    it("should return 200 with detailed training info", async () => {
      const res = await request(app)
        .get("/api/v1/company/training/T101")
        .set("Authorization", companyToken);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.trainingId).toBe("T101");
      expect(res.body.data.title).toBe("React Bootcamp");
      expect(res.body.data.mentor).toBeDefined();
    });

    it("should return 404 for non-existent training program", async () => {
      const res = await request(app)
        .get("/api/v1/company/training/T99999")
        .set("Authorization", companyToken);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe("PATCH /api/v1/company/training/:id/assign-mentor", () => {
    it("should return 200 on successful mentor assignment", async () => {
      const res = await request(app)
        .patch("/api/v1/company/training/T101/assign-mentor")
        .set("Authorization", companyToken)
        .send({ mentorId: "M1" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Mentor assigned successfully");
    });

    it("should return 400 if mentorId is missing", async () => {
      const res = await request(app)
        .patch("/api/v1/company/training/T101/assign-mentor")
        .set("Authorization", companyToken)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 404 if mentor does not exist", async () => {
      const res = await request(app)
        .patch("/api/v1/company/training/T101/assign-mentor")
        .set("Authorization", companyToken)
        .send({ mentorId: "M9999" });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/v1/company/training/:id/progress", () => {
    it("should return 200 with training progress and analytics", async () => {
      const res = await request(app)
        .get("/api/v1/company/training/T101/progress")
        .set("Authorization", companyToken);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.trainingId).toBe("T101");
      expect(res.body.data.completionPercentage).toBeDefined();
      expect(res.body.data.attendanceRate).toBeDefined();
      expect(res.body.data.atRiskCandidates).toBeDefined();
    });

    it("should return 404 for analytics of non-existent training", async () => {
      const res = await request(app)
        .get("/api/v1/company/training/T99999/progress")
        .set("Authorization", companyToken);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
