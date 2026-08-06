
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
      assert.strictEqual(isValidGitHubUrl(null), false);
      assert.strictEqual(isValidGitHubUrl(""), false);
    });

    test("calculateProjectProgress handles milestone-only and task-only progress", () => {
      const milestonesOnly = [{ status: "COMPLETED" }, { status: "COMPLETED" }];
      assert.strictEqual(calculateProjectProgress(milestonesOnly, []), 100);

      const tasksOnly = [{ status: "COMPLETED" }, { status: "TODO" }];
      assert.strictEqual(calculateProjectProgress([], tasksOnly), 50);
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
    });
  });
});
