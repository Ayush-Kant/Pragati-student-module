// verifyProjects.js
import assert from "node:assert/strict";
import { validateGithubURL, validateDeployedURL, validateReport } from "./validators/submissionValidator.js";
import { authenticateJWT } from "./middleware/authenticateJWT.js";
import { authorizeStudent } from "./middleware/authorizeStudent.js";
import * as milestoneService from "./services/milestoneService.js";
import * as submissionService from "./services/submissionService.js";
import * as projectService from "./services/projectService.js";
import * as feedbackService from "./services/feedbackService.js";
import { pool } from "../config/db.js";

const runTests = async () => {
  console.log("🧪 Starting Projects Backend Module Verification Tests...");

  // ─────────────────────────────────────────────────────────────────────────
  // 1. VALIDATOR TESTS
  // ─────────────────────────────────────────────────────────────────────────
  console.log("\n1. Testing Validators...");

  // GitHub URL
  assert.equal(validateGithubURL("https://github.com/user/repo"), true, "Valid GitHub URL should pass");
  assert.equal(validateGithubURL("https://github.com/user/repo/sub"), true, "GitHub URL with sub-path should pass");
  assert.equal(validateGithubURL("http://github.com/user/repo"), false, "HTTP GitHub URL should fail");
  assert.equal(validateGithubURL("https://gitlab.com/user/repo"), false, "Non-GitHub URL should fail");
  assert.equal(validateGithubURL(""), false, "Empty URL should fail");
  console.log("  ✔ GitHub URL validations passed!");

  // Deployed URL
  assert.equal(validateDeployedURL("https://my-app.vercel.app"), true, "Valid HTTPS URL should pass");
  assert.equal(validateDeployedURL("http://my-app.com"), false, "HTTP deployed URL should fail");
  assert.equal(validateDeployedURL("https://sub.domain.co.uk/path?q=1"), true, "Complex HTTPS URL should pass");
  assert.equal(validateDeployedURL(""), true, "Empty deployed URL is optional — should pass");
  console.log("  ✔ Deployed URL validations passed!");

  // PDF Report
  const validFile = { mimetype: "application/pdf", size: 10 * 1024 * 1024 };
  const oversizedFile = { mimetype: "application/pdf", size: 25 * 1024 * 1024 };
  const wrongTypeFile = { mimetype: "image/png", size: 5 * 1024 * 1024 };

  assert.equal(validateReport(validFile), null, "Valid PDF should not return error");
  assert.ok(validateReport(oversizedFile)?.includes("size"), "Oversized file should fail size validation");
  assert.ok(validateReport(wrongTypeFile)?.includes("PDF"), "Wrong MIME type should fail PDF check");
  assert.ok(validateReport(null)?.includes("required"), "Missing file should fail with 'required' message");
  console.log("  ✔ PDF Report validations passed!");

  // ─────────────────────────────────────────────────────────────────────────
  // 2. MIDDLEWARE TESTS
  // ─────────────────────────────────────────────────────────────────────────
  console.log("\n2. Testing Middlewares...");

  const mockRes = {
    status(code) {
      return { json: (data) => ({ code, data }) };
    }
  };

  // authorizeStudent — allow student
  let nextCalled = false;
  authorizeStudent({ user: { role: "student" } }, {}, () => { nextCalled = true; });
  assert.equal(nextCalled, true, "authorizeStudent should call next for students");

  // authorizeStudent — reject non-student
  const rejected = authorizeStudent({ user: { role: "mentor" } }, mockRes, () => {});
  assert.equal(rejected.code, 403, "authorizeStudent should respond 403 for non-students");
  assert.equal(rejected.data.success, false, "authorizeStudent rejection should have success: false");

  // authenticateJWT — missing token
  const noToken = authenticateJWT({ headers: {} }, mockRes, () => {});
  assert.equal(noToken.code, 401, "authenticateJWT should respond 401 when no token");
  assert.equal(noToken.data.success, false, "authenticateJWT response should have success: false");

  console.log("  ✔ Middleware tests passed!");

  // ─────────────────────────────────────────────────────────────────────────
  // 3. SERVICE + DATABASE TESTS
  // ─────────────────────────────────────────────────────────────────────────
  console.log("\n3. Testing Service Layer & Database...");

  // Resolve seeded IDs
  const studentRes = await pool.query("SELECT id FROM users WHERE email = 'student@example.com'");
  const projectRes = await pool.query("SELECT id FROM projects WHERE title = 'E-Commerce Capstone'");
  const milestoneRes = await pool.query(
    "SELECT id FROM project_milestones WHERE title = 'Database Schema Design'"
  );

  if (!studentRes.rows.length || !projectRes.rows.length || !milestoneRes.rows.length) {
    throw new Error("Seeded test data missing. Run: node src/runProjectsSetup.js first.");
  }

  const studentId = studentRes.rows[0].id;
  const projectId = projectRes.rows[0].id;
  const milestoneId = milestoneRes.rows[0].id;

  console.log(`  → studentId=${studentId}, projectId=${projectId}, milestoneId=${milestoneId}`);

  // 3a. projectService.getProjectDetails
  const details = await projectService.getProjectDetails(projectId, studentId);
  assert.ok(details, "getProjectDetails should return data");
  assert.equal(details.title, "E-Commerce Capstone", "Project title should match");
  console.log("  ✔ projectService.getProjectDetails works!");

  // 3b. projectService error on invalid ID
  await assert.rejects(
    () => projectService.getProjectDetails(999999, studentId),
    /not found/i,
    "Should throw 404 for unknown projectId"
  );
  console.log("  ✔ projectService 'not found' error handling works!");

  // 3c. milestoneService.getMilestones
  const milestones = await milestoneService.getMilestones(projectId);
  assert.ok(Array.isArray(milestones) && milestones.length > 0, "getMilestones should return array");
  console.log("  ✔ milestoneService.getMilestones works!");

  // 3d. milestone submission — clean any prior submission first
  await pool.query(
    "DELETE FROM project_milestone_submissions WHERE milestone_id = $1 AND student_id = $2",
    [milestoneId, studentId]
  );

  const sub = await milestoneService.submitMilestone(
    projectId,
    milestoneId,
    studentId,
    "https://github.com/student/ecommerce-capstone",
    "https://ecommerce-capstone.vercel.app"
  );
  assert.ok(sub, "Milestone submission should return a record");
  assert.equal(sub.status, "submitted", "Milestone status should be 'submitted'");
  console.log("  ✔ milestoneService.submitMilestone (first submission) works!");

  // 3e. Duplicate milestone submission check
  await assert.rejects(
    () =>
      milestoneService.submitMilestone(
        projectId,
        milestoneId,
        studentId,
        "https://github.com/student/ecommerce-capstone-new",
        "https://ecommerce-capstone-new.vercel.app"
      ),
    /already been submitted/,
    "Second milestone submission should be rejected"
  );
  console.log("  ✔ milestoneService.submitMilestone duplicate prevention works!");

  // 3f. Final project submission — clean any prior submission first
  await pool.query(
    "DELETE FROM project_feedback WHERE submission_id IN (SELECT id FROM project_submissions WHERE project_id = $1 AND student_id = $2)",
    [projectId, studentId]
  );
  await pool.query(
    "DELETE FROM project_submissions WHERE project_id = $1 AND student_id = $2",
    [projectId, studentId]
  );

  const finalSub = await submissionService.submitFinalProject(
    projectId,
    studentId,
    "https://github.com/student/ecommerce-capstone",
    "https://ecommerce-capstone.vercel.app",
    "https://pragati-s3-bucket.s3.amazonaws.com/reports/capstone-report.pdf"
  );
  assert.ok(finalSub, "Final submission should return a record");
  assert.equal(finalSub.status, "submitted", "Final submission status should be 'submitted'");
  console.log("  ✔ submissionService.submitFinalProject (first submission) works!");

  // 3g. Duplicate final submission check
  await assert.rejects(
    () =>
      submissionService.submitFinalProject(
        projectId,
        studentId,
        "https://github.com/student/ecommerce-capstone-new",
        "https://ecommerce-capstone-new.vercel.app",
        "https://pragati-s3-bucket.s3.amazonaws.com/reports/capstone-report-2.pdf"
      ),
    /already been submitted/,
    "Second final submission should be rejected"
  );
  console.log("  ✔ submissionService.submitFinalProject duplicate prevention works!");

  // 3h. Feedback — insert a feedback record for the new submission, then retrieve
  await pool.query(
    `INSERT INTO project_feedback (submission_id, criterion, score, max_score, comment)
     VALUES ($1, 'Code Quality', 28, 30, 'Excellent project structure.')`,
    [finalSub.id]
  );

  const feedbackReport = await feedbackService.getFeedback(projectId, studentId);
  assert.ok(feedbackReport, "getFeedback should return a report");
  assert.ok(feedbackReport.feedback.length > 0, "Feedback array should not be empty");
  assert.equal(feedbackReport.totalScore, 28, "Total score should be 28");
  assert.equal(feedbackReport.maxScore, 30, "Max score should be 30");
  console.log("  ✔ feedbackService.getFeedback works!");

  // 3i. feedbackService error when no submission
  await assert.rejects(
    () => feedbackService.getFeedback(999999, studentId),
    /not found/i,
    "feedbackService should throw 404 for unknown project"
  );
  console.log("  ✔ feedbackService 'not found' error handling works!");

  // ─────────────────────────────────────────────────────────────────────────
  console.log("\n🎉 ALL TESTS PASSED — 10/10 Projects Backend Module Verified!\n");
};

runTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("\n❌ Test failed:", err.message);
    process.exit(1);
  });
