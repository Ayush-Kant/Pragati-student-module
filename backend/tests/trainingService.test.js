import TrainingService from "../services/trainingService.js";
import Training from "../src/models/Training.js";
import TrainingProgress from "../src/models/TrainingProgress.js";
import MentorFeedback from "../src/models/MentorFeedback.js";
import Mentor from "../src/models/Mentor.js";
import Student from "../src/models/Student.js";
import Company from "../src/models/Company.js";
import sequelize from "../config/sequelize.js";
import { execSync } from "child_process";

describe("TrainingService Unit Tests", () => {
  beforeAll(async () => {
    // Re-seed the database
    execSync("node scripts/seed.js");
    // Sync models if needed
    await sequelize.authenticate();
  });

  describe("getTrainingPrograms", () => {
    it("should return array of trainings with pagination and mentor details", async () => {
      const result = await TrainingService.getTrainingPrograms(1, { limit: 10, offset: 0 });
      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("pagination");
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0]).toHaveProperty("trainingId");
      expect(result.data[0]).toHaveProperty("mentor");
      expect(result.data[0]).toHaveProperty("candidatesEnrolled");
    });

    it("should apply status filter correctly", async () => {
      const result = await TrainingService.getTrainingPrograms(1, { status: "ACTIVE" });
      expect(result.data.every((t) => t.status === "ACTIVE")).toBe(true);
    });

    it("should handle limit and offset pagination", async () => {
      const result = await TrainingService.getTrainingPrograms(1, { limit: 1, offset: 0 });
      expect(result.data.length).toBe(1);
    });
  });

  describe("getTrainingById", () => {
    it("should return training by ID with correct fields and mentor", async () => {
      const result = await TrainingService.getTrainingById("T101", 1);
      expect(result).toHaveProperty("trainingId", "T101");
      expect(result).toHaveProperty("title", "React Bootcamp");
      expect(result).toHaveProperty("curriculum");
      expect(Array.isArray(result.curriculum)).toBe(true);
    });

    it("should throw error if training not found or belongs to another company", async () => {
      await expect(TrainingService.getTrainingById("INVALID_ID", 1)).rejects.toThrow(
        "Training not found"
      );
    });
  });

  describe("assignMentor", () => {
    it("should assign mentor successfully and update training record", async () => {
      // Create a test training and check assignment
      const newTraining = await Training.create({
        title: "Test Assignment Bootcamp",
        companyId: 1,
        duration: 10,
        startDate: new Date(),
        endDate: new Date(),
        status: "ACTIVE",
      });

      const res = await TrainingService.assignMentor(newTraining.trainingId, 1, 1);
      expect(res.success).toBe(true);

      const updated = await Training.findByPk(newTraining.trainingId);
      expect(updated.mentorId).toBe(1);

      // Cleanup
      await newTraining.destroy();
    });

    it("should throw error if mentor not found", async () => {
      await expect(TrainingService.assignMentor("T101", 99999, 1)).rejects.toThrow(
        "Mentor not found"
      );
    });

    it("should throw error if training not found", async () => {
      await expect(TrainingService.assignMentor("INVALID_TID", 1, 1)).rejects.toThrow(
        "Training not found"
      );
    });
  });

  describe("calculateReadinessScore", () => {
    it("should apply formula correctly and update database record", async () => {
      // Readiness Score = (Attendance × 0.3) + (Assignment Score × 0.4) + (Engagement Score × 0.3)
      // For Alice TP101: attendance=90, assignment_score=85, engagement_score=4.5
      // 90 * 0.3 = 27
      // 85 * 0.4 = 34
      // 4.5 * 0.3 = 1.35
      // Total = 27 + 34 + 1.35 = 62.35 -> Rounded to 62
      const score = await TrainingService.calculateReadinessScore(1, "T101");
      expect(score).toBe(62);

      const progress = await TrainingProgress.findOne({ where: { candidateId: 1, trainingId: "T101" } });
      expect(progress.readinessScore).toBe(62);
    });

    it("should throw error if progress record does not exist", async () => {
      await expect(TrainingService.calculateReadinessScore(9999, "T101")).rejects.toThrow(
        "Training progress not found"
      );
    });
  });

  describe("updateCandidateProgress", () => {
    it("should update candidate progress record and auto-recalculate readiness score", async () => {
      const res = await TrainingService.updateCandidateProgress(1, "T101", {
        attendance: 100,
        assignmentScore: 100,
        engagementScore: 5.0,
      });

      expect(res.success).toBe(true);

      const progress = await TrainingProgress.findOne({ where: { candidateId: 1, trainingId: "T101" } });
      // 100 * 0.3 = 30
      // 100 * 0.4 = 40
      // 5 * 0.3 = 1.5
      // Total = 30 + 40 + 1.5 = 71.5 -> Rounded to 72 (or 71 depending on float handling, Math.round(71.5) = 72)
      expect(progress.readinessScore).toBe(72);
      expect(progress.attendance).toBe(100);
      expect(progress.assignmentScore).toBe(100);
    });

    it("should throw error if progress not found", async () => {
      await expect(
        TrainingService.updateCandidateProgress(999, "T101", { attendance: 80 })
      ).rejects.toThrow("Progress record not found");
    });
  });

  describe("getProgressAnalytics", () => {
    it("should calculate all metrics correctly", async () => {
      const stats = await TrainingService.getProgressAnalytics("T101", 1);
      expect(stats).toHaveProperty("totalCandidates", 1);
      expect(stats).toHaveProperty("completionPercentage");
      expect(stats).toHaveProperty("attendanceRate");
      expect(stats).toHaveProperty("engagementScore");
      expect(stats).toHaveProperty("performanceMetrics");
      expect(stats.performanceMetrics).toHaveProperty("average");
      expect(stats.performanceMetrics).toHaveProperty("highest");
      expect(stats.performanceMetrics).toHaveProperty("lowest");
      expect(Array.isArray(stats.atRiskCandidates)).toBe(true);
    });

    it("should throw error if training not found", async () => {
      await expect(TrainingService.getProgressAnalytics("INVALID", 1)).rejects.toThrow(
        "Training not found"
      );
    });
  });
});
