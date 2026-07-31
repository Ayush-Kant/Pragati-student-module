<<<<<<< HEAD
// ─────────────────────────────────────────────────────────────────────────────
//  src/tests/project.test.js
//  Unit and Integration tests for Projects Backend Module
// ─────────────────────────────────────────────────────────────────────────────

import { jest, describe, it, expect, afterEach } from "@jest/globals";
import {
  validateGithubUrl,
  validateDeploymentUrl,
  validatePdfReport,
  validateProgressNotes,
  validateDeadline,
} from "../validations/projectValidation.js";
import { ApiError, isDeadlinePassed } from "../utils/projectHelpers.js";
import projectService from "../services/projectService.js";
import { StudentProject, ProjectMilestone, ActivitySubmission } from "../models/projectModel.js";
import { PROJECT_STATUS, SUBMISSION_STATUS } from "../constants/projectConstants.js";
import sequelize from "../../config/sequelize.js";

// Mock AWS S3 Helper
jest.mock("../config/aws.js", () => ({
  uploadReport: jest.fn().mockResolvedValue({
    url: "https://pragati-projects-uploads.s3.us-east-1.amazonaws.com/test-report.pdf",
    key: "test-key.pdf",
  }),
  deleteReport: jest.fn().mockResolvedValue(true),
  generateFileName: jest.fn().mockReturnValue("test-key.pdf"),
}));

describe("Projects Backend Module - Validation Unit Tests", () => {
  describe("validateGithubUrl", () => {
    it("should accept valid GitHub repository URL", () => {
      const validUrl = "https://github.com/maithriannam/pragati-backend";
      expect(validateGithubUrl(validUrl)).toBe(validUrl);
    });

    it("should throw ApiError if GitHub URL is missing", () => {
      expect(() => validateGithubUrl("")).toThrow(ApiError);
      expect(() => validateGithubUrl("")).toThrow("GitHub URL is required");
    });

    it("should throw ApiError if URL does not begin with https://github.com/", () => {
      expect(() => validateGithubUrl("https://gitlab.com/user/repo")).toThrow(
        "Invalid GitHub URL. Must begin with 'https://github.com/'"
      );
      expect(() => validateGithubUrl("http://github.com/user/repo")).toThrow(ApiError);
    });

    it("should throw ApiError if GitHub URL lacks repository path", () => {
      expect(() => validateGithubUrl("https://github.com/onlyuser")).toThrow(
        "Invalid GitHub URL format. Expected github.com/owner/repository"
      );
    });
  });

  describe("validateDeploymentUrl", () => {
    it("should accept valid HTTPS deployment URL", () => {
      const validUrl = "https://my-app.vercel.app";
      expect(validateDeploymentUrl(validUrl)).toBe(validUrl);
    });

    it("should return null if optional deployment URL is empty", () => {
      expect(validateDeploymentUrl("", false)).toBeNull();
      expect(validateDeploymentUrl(null, false)).toBeNull();
    });

    it("should throw ApiError if deployment URL is missing when required", () => {
      expect(() => validateDeploymentUrl("", true)).toThrow("Deployment URL is required");
    });

    it("should throw ApiError if deployment URL does not use HTTPS", () => {
      expect(() => validateDeploymentUrl("http://my-app.vercel.app")).toThrow(
        "Invalid Deployment URL. Must begin with 'https://'"
      );
    });
  });

  describe("validatePdfReport", () => {
    it("should accept valid PDF file under 20MB limit", () => {
      const file = {
        originalname: "project_report.pdf",
        mimetype: "application/pdf",
        size: 5 * 1024 * 1024, // 5MB
      };
      expect(validatePdfReport(file)).toBe(file);
    });

    it("should reject non-PDF files", () => {
      const file = {
        originalname: "project_report.docx",
        mimetype: "application/msword",
        size: 1024 * 1024,
      };
      expect(() => validatePdfReport(file)).toThrow("Invalid file type. Only PDF reports are allowed");
    });

    it("should reject PDF files exceeding 20MB limit", () => {
      const file = {
        originalname: "huge_report.pdf",
        mimetype: "application/pdf",
        size: 25 * 1024 * 1024, // 25MB
      };
      expect(() => validatePdfReport(file)).toThrow("PDF report file size exceeds maximum limit of 20MB");
    });
  });

  describe("validateProgressNotes", () => {
    it("should accept valid progress notes up to 1000 characters", () => {
      const notes = "Completed setup and API integration.";
      expect(validateProgressNotes(notes)).toBe(notes);
    });

    it("should throw ApiError if progress notes exceed 1000 characters", () => {
      const longNotes = "a".repeat(1001);
      expect(() => validateProgressNotes(longNotes)).toThrow(
        "Progress notes must not exceed 1000 characters"
      );
    });
  });

  describe("validateDeadline & isDeadlinePassed", () => {
    it("should pass for future deadline date", () => {
      const futureDate = new Date(Date.now() + 86400000); // +1 day
      expect(() => validateDeadline(futureDate)).not.toThrow();
      expect(isDeadlinePassed(futureDate)).toBe(false);
    });

    it("should throw ApiError for past deadline date", () => {
      const pastDate = new Date(Date.now() - 86400000); // -1 day
      expect(() => validateDeadline(pastDate)).toThrow("Deadline exceeded");
      expect(isDeadlinePassed(pastDate)).toBe(true);
    });
  });
});

describe("Projects Backend Module - Service Layer Unit Tests", () => {
  let mockTransaction;

  beforeEach(() => {
    mockTransaction = {
      commit: jest.fn().mockResolvedValue(true),
      rollback: jest.fn().mockResolvedValue(true),
    };
    jest.spyOn(sequelize, "transaction").mockResolvedValue(mockTransaction);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("fetchProjectDetails", () => {
    it("should return formatted project details when student owns project", async () => {
      const mockProject = {
        id: 1,
        studentId: 101,
        title: "AI Chatbot Platform",
        description: "Building an AI assistant",
        repositoryUrl: "https://github.com/student/chatbot",
        deploymentUrl: "https://chatbot.vercel.app",
        reportUrl: null,
        status: PROJECT_STATUS.IN_PROGRESS,
        deadline: new Date(Date.now() + 86400000).toISOString(),
        milestones: [
          {
            id: 1,
            title: "Milestone 1: Backend Architecture",
            deadline: new Date(Date.now() + 86400000).toISOString(),
            status: "SUBMITTED",
            weightage: 50.0,
          },
        ],
        submissions: [],
      };

      jest.spyOn(StudentProject, "findOne").mockResolvedValue(mockProject);

      const result = await projectService.fetchProjectDetails(101, 1);

      expect(result.id).toBe(1);
      expect(result.studentId).toBe(101);
      expect(result.title).toBe("AI Chatbot Platform");
      expect(result.milestones.length).toBe(1);
    });

    it("should throw 404 ApiError if project is not found", async () => {
      jest.spyOn(StudentProject, "findOne").mockResolvedValue(null);

      await expect(projectService.fetchProjectDetails(101, 999)).rejects.toThrow("Project not found");
    });

    it("should throw 403 ApiError if student does not own project", async () => {
      const mockProject = {
        id: 1,
        studentId: 999, // Owned by another student
        title: "Private Project",
      };

      jest.spyOn(StudentProject, "findOne").mockResolvedValue(mockProject);

      await expect(projectService.fetchProjectDetails(101, 1)).rejects.toThrow(
        "Access denied: You do not own this project"
      );
    });
  });

  describe("createMilestoneSubmission", () => {
    it("should create milestone submission successfully", async () => {
      const mockProject = { id: 1, studentId: 101, status: "PENDING", update: jest.fn().mockResolvedValue(true) };
      const mockMilestone = {
        id: 10,
        projectId: 1,
        deadline: new Date(Date.now() + 86400000).toISOString(),
        update: jest.fn().mockResolvedValue(true),
      };
      const mockSubmission = {
        id: 50,
        projectId: 1,
        milestoneId: 10,
        githubUrl: "https://github.com/student/milestone1",
        deploymentUrl: "https://milestone1.vercel.app",
        progressNotes: "Done API setup",
        status: SUBMISSION_STATUS.SUBMITTED,
        submittedAt: new Date(),
      };

      jest.spyOn(StudentProject, "findOne").mockResolvedValue(mockProject);
      jest.spyOn(ProjectMilestone, "findOne").mockResolvedValue(mockMilestone);
      jest.spyOn(ActivitySubmission, "create").mockResolvedValue(mockSubmission);

      const payload = {
        githubUrl: "https://github.com/student/milestone1",
        deploymentUrl: "https://milestone1.vercel.app",
        progressNotes: "Done API setup",
      };

      const result = await projectService.createMilestoneSubmission(101, 1, 10, payload);

      expect(result.submissionId).toBe(50);
      expect(result.status).toBe(SUBMISSION_STATUS.SUBMITTED);
      expect(mockMilestone.update).toHaveBeenCalledWith(
        { status: "SUBMITTED" },
        expect.anything()
      );
      expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it("should reject milestone submission if deadline exceeded", async () => {
      const mockProject = { id: 1, studentId: 101 };
      const expiredMilestone = {
        id: 10,
        projectId: 1,
        deadline: new Date(Date.now() - 86400000).toISOString(), // Past deadline
      };

      jest.spyOn(StudentProject, "findOne").mockResolvedValue(mockProject);
      jest.spyOn(ProjectMilestone, "findOne").mockResolvedValue(expiredMilestone);

      const payload = {
        githubUrl: "https://github.com/student/milestone1",
      };

      await expect(
        projectService.createMilestoneSubmission(101, 1, 10, payload)
      ).rejects.toThrow("Deadline exceeded");
    });
  });

  describe("createFinalSubmission", () => {
    it("should submit final project with repo URL and optional PDF report", async () => {
      const mockProject = {
        id: 1,
        studentId: 101,
        deadline: new Date(Date.now() + 86400000).toISOString(),
        update: jest.fn().mockResolvedValue(true),
      };
      const mockSubmission = {
        id: 99,
        projectId: 1,
        githubUrl: "https://github.com/student/final-project",
        deploymentUrl: "https://final-project.vercel.app",
        reportUrl: "https://pragati-projects-uploads.s3.us-east-1.amazonaws.com/test-report.pdf",
        status: SUBMISSION_STATUS.SUBMITTED,
        submittedAt: new Date(),
      };

      jest.spyOn(StudentProject, "findOne").mockResolvedValue(mockProject);
      jest.spyOn(ActivitySubmission, "create").mockResolvedValue(mockSubmission);

      const payload = {
        githubUrl: "https://github.com/student/final-project",
        deploymentUrl: "https://final-project.vercel.app",
      };

      const pdfFile = {
        originalname: "final_report.pdf",
        mimetype: "application/pdf",
        size: 2 * 1024 * 1024,
      };

      const result = await projectService.createFinalSubmission(101, 1, payload, pdfFile);

      expect(result.submissionId).toBe(99);
      expect(mockProject.update).toHaveBeenCalledWith(
        expect.objectContaining({
          repositoryUrl: "https://github.com/student/final-project",
          status: PROJECT_STATUS.SUBMITTED,
        }),
        expect.anything()
      );
      expect(mockTransaction.commit).toHaveBeenCalled();
=======
import assert from "assert";
import { test, describe } from "node:test";
import {
  calculateProjectProgress,
  isValidGitHubUrl,
  generateProjectInsights,
} from "../utils/projectHelpers.js";
import {
  createProjectSchema,
  createMilestoneSchema,
  createTaskSchema,
  submitProjectSchema,
} from "../validations/projectValidation.js";

describe("Projects Backend Unit Tests", () => {
  describe("Helper Utilities", () => {
    test("calculateProjectProgress returns correct percentage", () => {
      const milestones = [
        { status: "COMPLETED" },
        { status: "PENDING" },
      ];
      const tasks = [
        { status: "COMPLETED" },
        { status: "COMPLETED" },
        { status: "TODO" },
        { status: "TODO" },
      ];

      // 50% milestone score (weight 0.4) = 20
      // 50% task score (weight 0.6) = 30
      // Total = 50%
      const progress = calculateProjectProgress(milestones, tasks);
      assert.strictEqual(progress, 50);
    });

    test("calculateProjectProgress returns 0 for empty arrays", () => {
      const progress = calculateProjectProgress([], []);
      assert.strictEqual(progress, 0);
    });

    test("isValidGitHubUrl validates GitHub URLs correctly", () => {
      assert.strictEqual(isValidGitHubUrl("https://github.com/user/repo"), true);
      assert.strictEqual(isValidGitHubUrl("http://github.com/user/repo/"), true);
      assert.strictEqual(isValidGitHubUrl("https://gitlab.com/user/repo"), false);
      assert.strictEqual(isValidGitHubUrl("not-a-url"), false);
    });

    test("generateProjectInsights returns structured analytics", () => {
      const projectData = {
        milestones: [{ status: "COMPLETED" }, { status: "PENDING" }],
        tasks: [{ status: "COMPLETED" }, { status: "IN_PROGRESS" }],
        submissions: [{ id: 1 }],
        reviews: [{ score: 85 }],
      };

      const insights = generateProjectInsights(projectData);
      assert.strictEqual(insights.completionRate, 50);
      assert.strictEqual(insights.taskBreakdown.total, 2);
      assert.strictEqual(insights.taskBreakdown.completed, 1);
      assert.strictEqual(insights.submissionCount, 1);
      assert.strictEqual(insights.latestEvaluationScore, 85);
    });
  });

  describe("Validation Schemas", () => {
    test("createProjectSchema validates valid project input", () => {
      const validPayload = {
        title: "Smart Placement System",
        description: "AI-driven placement portal",
        category: "Web Development",
        githubRepoUrl: "https://github.com/org/repo",
        teamMembers: [{ studentId: 101, role: "MEMBER" }],
      };

      const { error } = createProjectSchema.validate(validPayload);
      assert.strictEqual(error, undefined);
    });

    test("createProjectSchema rejects invalid GitHub URL", () => {
      const invalidPayload = {
        title: "Smart Placement System",
        githubRepoUrl: "invalid-url",
      };

      const { error } = createProjectSchema.validate(invalidPayload);
      assert.notStrictEqual(error, undefined);
    });

    test("createMilestoneSchema validates milestone payload", () => {
      const validPayload = {
        title: "Frontend Prototype",
        description: "Complete UI mockups and component hierarchy",
      };

      const { error } = createMilestoneSchema.validate(validPayload);
      assert.strictEqual(error, undefined);
    });

    test("createTaskSchema validates task payload", () => {
      const validPayload = {
        title: "Setup PostgreSQL Database",
        priority: "HIGH",
        assignedTo: 42,
      };

      const { error } = createTaskSchema.validate(validPayload);
      assert.strictEqual(error, undefined);
    });

    test("submitProjectSchema requires valid GitHub repository URL", () => {
      const validSubmission = {
        repositoryUrl: "https://github.com/student/final-project",
        branchName: "main",
        submissionNotes: "Final project submission for review",
      };

      const { error } = submitProjectSchema.validate(validSubmission);
      assert.strictEqual(error, undefined);
>>>>>>> b58e0407 (feat: projects backend implementation)
    });
  });
});
