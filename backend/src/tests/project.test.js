
// ─────────────────────────────────────────────────────────────────────────────
//  src/tests/project.test.js
//  Unit and Integration tests for Projects Backend Module
// ─────────────────────────────────────────────────────────────────────────────

import { jest, describe, it, expect, afterEach, beforeEach } from "@jest/globals";
import assert from "assert";

import {
  calculateProjectProgress,
  isValidGitHubUrl,
  generateProjectInsights,
  calculateTeamStats,
} from "../utils/projectHelpers.js";
import {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
  updateMemberRoleSchema,
  createMilestoneSchema,
  updateMilestoneSchema,
  createTaskSchema,
  updateTaskSchema,
  submitProjectSchema,
  updateSubmissionSchema,
  updateRepositorySchema,
  createMentorReviewSchema,
  updateMentorReviewSchema,
} from "../validations/projectValidation.js";
import {
  PROJECT_STATUS,
  PROJECT_ROLE,
  MILESTONE_STATUS,
  TASK_STATUS,
  TASK_PRIORITY,
  SUBMISSION_STATUS,
  ACTIVITY_TYPE,
  MESSAGES,
} from "../constants/projectConstants.js";

// ─── Helper Utilities ─────────────────────────────────────────────────────────

describe("Projects Backend Unit Tests", () => {
  describe("calculateProjectProgress", () => {
    test("returns 0 for empty arrays", () => {
      assert.strictEqual(calculateProjectProgress([], []), 0);
    });

    test("returns correct weighted percentage with milestones and tasks", () => {
      const milestones = [{ status: "COMPLETED" }, { status: "PENDING" }];
      const tasks = [
        { status: "COMPLETED" },
        { status: "COMPLETED" },
        { status: "TODO" },
        { status: "TODO" },
      ];
      // milestone: 1/2 * 100 * 0.4 = 20
      // task:      2/4 * 100 * 0.6 = 30
      // total = 50
      assert.strictEqual(calculateProjectProgress(milestones, tasks), 50);
    });

    test("uses 100% task weight when no milestones exist", () => {
      const tasks = [{ status: "COMPLETED" }, { status: "TODO" }];
      assert.strictEqual(calculateProjectProgress([], tasks), 50);
    });

    test("uses 100% milestone weight when no tasks exist", () => {
      const milestones = [{ status: "COMPLETED" }, { status: "COMPLETED" }];
      assert.strictEqual(calculateProjectProgress(milestones, []), 100);
    });

    test("clamps result between 0 and 100", () => {
      const all = [
        { status: "COMPLETED" },
        { status: "COMPLETED" },
        { status: "COMPLETED" },
      ];
      const p = calculateProjectProgress(all, all);
      assert.ok(p >= 0 && p <= 100);
    });
  });

  describe("isValidGitHubUrl", () => {
    test("accepts valid GitHub HTTPS URLs", () => {
      assert.strictEqual(isValidGitHubUrl("https://github.com/user/repo"), true);
      assert.strictEqual(isValidGitHubUrl("https://github.com/org/my-repo"), true);
      assert.strictEqual(isValidGitHubUrl("http://github.com/user/repo/"), true);
    });

    test("rejects invalid URLs", () => {
      assert.strictEqual(isValidGitHubUrl("https://gitlab.com/user/repo"), false);
      assert.strictEqual(isValidGitHubUrl("not-a-url"), false);
      assert.strictEqual(isValidGitHubUrl(""), false);
      assert.strictEqual(isValidGitHubUrl(null), false);
      assert.strictEqual(isValidGitHubUrl(undefined), false);
    });
  });

  describe("generateProjectInsights", () => {
    test("returns structured analytics with correct values", () => {
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
      assert.strictEqual(insights.taskBreakdown.inProgress, 1);
      assert.strictEqual(insights.milestoneBreakdown.total, 2);
      assert.strictEqual(insights.milestoneBreakdown.completed, 1);
      assert.strictEqual(insights.submissionCount, 1);
      assert.strictEqual(insights.latestEvaluationScore, 85);
    });

    test("returns null score when no reviews exist", () => {
      const insights = generateProjectInsights({ milestones: [], tasks: [], submissions: [], reviews: [] });
      assert.strictEqual(insights.latestEvaluationScore, null);
      assert.strictEqual(insights.completionRate, 0);
    });

    test("sets overallHealth to EXCELLENT when 75%+ tasks completed", () => {
      const tasks = [
        { status: "COMPLETED" },
        { status: "COMPLETED" },
        { status: "COMPLETED" },
        { status: "TODO" },
      ];
      const insights = generateProjectInsights({ milestones: [], tasks, submissions: [], reviews: [] });
      assert.strictEqual(insights.overallHealth, "EXCELLENT");
    });

    test("sets overallHealth to NEEDS_ATTENTION when >2 tasks blocked", () => {
      const tasks = [
        { status: "BLOCKED" },
        { status: "BLOCKED" },
        { status: "BLOCKED" },
      ];
      const insights = generateProjectInsights({ milestones: [], tasks, submissions: [], reviews: [] });
      assert.strictEqual(insights.overallHealth, "NEEDS_ATTENTION");
    });
  });

  describe("calculateTeamStats", () => {
    test("returns correct role counts and member task stats", () => {
      const members = [
        { studentId: 1, role: "LEADER" },
        { studentId: 2, role: "MEMBER" },
        { studentId: 3, role: "MEMBER" },
      ];
      const tasks = [
        { assignedTo: 1, status: "COMPLETED" },
        { assignedTo: 2, status: "TODO" },
        { assignedTo: 2, status: "COMPLETED" },
      ];
      const stats = calculateTeamStats(members, tasks);
      assert.strictEqual(stats.totalMembers, 3);
      assert.strictEqual(stats.roleCounts["LEADER"], 1);
      assert.strictEqual(stats.roleCounts["MEMBER"], 2);
      assert.strictEqual(stats.memberTaskStats[0].assignedTasksCount, 1);
      assert.strictEqual(stats.memberTaskStats[0].completedTasksCount, 1);
      assert.strictEqual(stats.memberTaskStats[1].assignedTasksCount, 2);
      assert.strictEqual(stats.memberTaskStats[1].completedTasksCount, 1);
    });

    test("returns empty stats for no members", () => {
      const stats = calculateTeamStats([], []);
      assert.strictEqual(stats.totalMembers, 0);
      assert.deepStrictEqual(stats.memberTaskStats, []);
    });
  });

  // ─── Validation Schemas ────────────────────────────────────────────────────

  describe("createProjectSchema", () => {
    test("accepts a valid project payload", () => {
      const { error } = createProjectSchema.validate({
        title: "Smart Placement System",
        description: "AI-driven placement portal",
        category: "Web Development",
        githubRepoUrl: "https://github.com/org/repo",
        teamMembers: [{ studentId: 101, role: "MEMBER" }],
      });
      assert.strictEqual(error, undefined);
    });

    test("rejects missing title", () => {
      const { error } = createProjectSchema.validate({ description: "test" });
      assert.ok(error);
    });

    test("rejects invalid GitHub URL", () => {
      const { error } = createProjectSchema.validate({
        title: "My Project",
        githubRepoUrl: "https://notgithub.com/user/repo",
      });
      assert.ok(error);
    });

    test("defaults tags to empty array and teamMembers to empty array", () => {
      const { value } = createProjectSchema.validate({ title: "Test Project" });
      assert.deepStrictEqual(value.tags, []);
      assert.deepStrictEqual(value.teamMembers, []);
    });
  });

  describe("updateProjectSchema", () => {
    test("accepts partial update with valid status", () => {
      const { error } = updateProjectSchema.validate({
        status: PROJECT_STATUS.COMPLETED,
      });
      assert.strictEqual(error, undefined);
    });

    test("rejects invalid status value", () => {
      const { error } = updateProjectSchema.validate({ status: "INVALID_STATUS" });
      assert.ok(error);
    });
  });

  describe("addMemberSchema", () => {
    test("accepts valid member data", () => {
      const { error } = addMemberSchema.validate({ studentId: 42, role: "MEMBER" });
      assert.strictEqual(error, undefined);
    });

    test("rejects missing studentId", () => {
      const { error } = addMemberSchema.validate({ role: "MEMBER" });
      assert.ok(error);
    });

    test("defaults role to MEMBER when not provided", () => {
      const { value } = addMemberSchema.validate({ studentId: 10 });
      assert.strictEqual(value.role, PROJECT_ROLE.MEMBER);
    });
  });

  describe("updateMemberRoleSchema", () => {
    test("accepts valid role", () => {
      const { error } = updateMemberRoleSchema.validate({ role: "LEADER" });
      assert.strictEqual(error, undefined);
    });

    test("rejects invalid role", () => {
      const { error } = updateMemberRoleSchema.validate({ role: "SUPERUSER" });
      assert.ok(error);
    });
  });

  describe("createMilestoneSchema", () => {
    test("accepts valid milestone payload", () => {
      const { error } = createMilestoneSchema.validate({
        title: "Frontend Prototype",
        description: "Complete UI mockups",
      });
      assert.strictEqual(error, undefined);
    });

    test("rejects missing title", () => {
      const { error } = createMilestoneSchema.validate({ description: "no title" });
      assert.ok(error);
    });
  });

  describe("updateMilestoneSchema", () => {
    test("accepts status update", () => {
      const { error } = updateMilestoneSchema.validate({ status: MILESTONE_STATUS.COMPLETED });
      assert.strictEqual(error, undefined);
    });

    test("rejects invalid milestone status", () => {
      const { error } = updateMilestoneSchema.validate({ status: "DONE" });
      assert.ok(error);
    });
  });

  describe("createTaskSchema", () => {
    test("accepts valid task payload", () => {
      const { error } = createTaskSchema.validate({
        title: "Setup PostgreSQL",
        priority: "HIGH",
        assignedTo: 42,
      });
      assert.strictEqual(error, undefined);
    });

    test("rejects missing title", () => {
      const { error } = createTaskSchema.validate({ priority: "LOW" });
      assert.ok(error);
    });

    test("defaults priority to MEDIUM", () => {
      const { value } = createTaskSchema.validate({ title: "My Task" });
      assert.strictEqual(value.priority, TASK_PRIORITY.MEDIUM);
    });
  });

  describe("updateTaskSchema", () => {
    test("accepts status update", () => {
      const { error } = updateTaskSchema.validate({ status: TASK_STATUS.IN_REVIEW });
      assert.strictEqual(error, undefined);
    });

    test("rejects invalid task status", () => {
      const { error } = updateTaskSchema.validate({ status: "DONE" });
      assert.ok(error);
    });
  });

  describe("submitProjectSchema", () => {
    test("accepts valid submission payload", () => {
      const { error } = submitProjectSchema.validate({
        repositoryUrl: "https://github.com/student/final-project",
        branchName: "main",
        submissionNotes: "Final project for review",
        demoUrl: "https://demo.example.com",
      });
      assert.strictEqual(error, undefined);
    });

    test("rejects missing repositoryUrl", () => {
      const { error } = submitProjectSchema.validate({ branchName: "main" });
      assert.ok(error);
    });

    test("rejects invalid GitHub URL as repositoryUrl", () => {
      const { error } = submitProjectSchema.validate({
        repositoryUrl: "https://bitbucket.org/user/repo",
      });
      assert.ok(error);
    });
  });

  describe("updateSubmissionSchema", () => {
    test("accepts partial update with valid status", () => {
      const { error } = updateSubmissionSchema.validate({
        status: SUBMISSION_STATUS.UNDER_REVIEW,
      });
      assert.strictEqual(error, undefined);
    });

    test("rejects invalid demoUrl", () => {
      const { error } = updateSubmissionSchema.validate({ demoUrl: "not-a-url" });
      assert.ok(error);
    });
  });

  describe("updateRepositorySchema", () => {
    test("accepts valid repository data", () => {
      const { error } = updateRepositorySchema.validate({
        repoUrl: "https://github.com/org/project-repo",
        branch: "develop",
        isPrivate: false,
      });
      assert.strictEqual(error, undefined);
    });

    test("rejects missing repoUrl", () => {
      const { error } = updateRepositorySchema.validate({ branch: "main" });
      assert.ok(error);
    });

    test("rejects non-GitHub repoUrl", () => {
      const { error } = updateRepositorySchema.validate({
        repoUrl: "https://gitlab.com/user/repo",
      });
      assert.ok(error);
    });
  });

  describe("createMentorReviewSchema", () => {
    test("accepts valid mentor review payload", () => {
      const { error } = createMentorReviewSchema.validate({
        feedback: "Great work on the architecture!",
        score: 90,
      });
      assert.strictEqual(error, undefined);
    });

    test("rejects missing feedback", () => {
      const { error } = createMentorReviewSchema.validate({ score: 80 });
      assert.ok(error);
    });

    test("rejects score out of range", () => {
      const { error } = createMentorReviewSchema.validate({
        feedback: "Nice work",
        score: 110,
      });
      assert.ok(error);
    });
  });

  describe("updateMentorReviewSchema", () => {
    test("accepts score update only", () => {
      const { error } = updateMentorReviewSchema.validate({ score: 75 });
      assert.strictEqual(error, undefined);
    });

    test("accepts feedback update only", () => {
      const { error } = updateMentorReviewSchema.validate({
        feedback: "Updated feedback after re-evaluation.",
      });
      assert.strictEqual(error, undefined);
    });
  });

  // ─── Constants Integrity ────────────────────────────────────────────────────

  describe("Constants", () => {
    test("PROJECT_STATUS contains expected values", () => {
      assert.ok(PROJECT_STATUS.IN_PROGRESS);
      assert.ok(PROJECT_STATUS.COMPLETED);
      assert.ok(PROJECT_STATUS.ARCHIVED);
    });

    test("ACTIVITY_TYPE includes all key types", () => {
      const required = [
        "PROJECT_CREATED",
        "MEMBER_ADDED",
        "MILESTONE_CREATED",
        "TASK_CREATED",
        "SUBMISSION_CREATED",
        "REVIEW_ADDED",
        "REPOSITORY_UPDATED",
      ];
      for (const key of required) {
        assert.ok(ACTIVITY_TYPE[key], `ACTIVITY_TYPE.${key} should be defined`);
      }
    });

    test("MESSAGES contains all required keys", () => {
      const required = [
        "PROJECT_CREATED",
        "PROJECT_NOT_FOUND",
        "MEMBER_ADDED",
        "MEMBER_REMOVED",
        "MILESTONE_CREATED",
        "TASK_CREATED",
        "SUBMISSION_SUCCESS",
        "FILE_UPLOADED",
        "REVIEW_ADDED",
        "REPOSITORY_UPDATED",
        "UNAUTHORIZED_ACCESS",
      ];
      for (const key of required) {
        assert.ok(MESSAGES[key], `MESSAGES.${key} should be defined`);
      }
    });
  });
});
