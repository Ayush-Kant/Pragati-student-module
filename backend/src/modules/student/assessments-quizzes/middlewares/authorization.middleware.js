/**
 * authorization.middleware.js
 *
 * Ensures the authenticated student is enrolled in a recruitment drive that
 * has the requested assessment assigned, AND that the assessment is currently
 * active, before any route handler executes.
 *
 * Identity resolution:
 *   JWT carries req.user.id = users.id (set by auth.controller.js)
 *   student_drive_progress.student_id = students.id (different table)
 *   The repository resolves users.id → students.id via JOIN students ON user_id.
 *
 * On success, attaches to req:
 *   req.studentId        — users.id (canonical identity for all module queries)
 *   req.assessmentId     — validated integer from :id param
 *   req.timeLimitMinutes — cached time limit (avoids extra DB call in validateTimer)
 *
 * Error responses use { error: "..." } — consistent with all module handlers.
 *   401 — no authenticated user on req.user
 *   403 — assessment not assigned to student's drive, or not active
 *   500 — unexpected repository error
 */

import * as AssessmentsRepository from "../repositories/assessments.repository.js";
import { HTTP_MESSAGES } from "../constants/assessments.constants.js";

const resolveUserId = (req) => req.user?.id ?? null;

export const ensureAssessmentAssigned = async (req, res, next) => {
  try {
    const userId = resolveUserId(req);

    if (!userId) {
      return res.status(401).json({ error: HTTP_MESSAGES.UNAUTHORIZED });
    }

    const assessmentId = Number(req.params.id);
    if (!Number.isInteger(assessmentId) || assessmentId <= 0) {
      // validateAssessmentId runs before this middleware — this guard protects
      // against misconfigured route chains.
      return res.status(400).json({ error: "Invalid assessment id." });
    }

    // Single query: verifies drive membership + active status simultaneously.
    // Internally joins users.id → students.id → student_drive_progress.
    const isAssigned = await AssessmentsRepository.isAssessmentAssignedToStudent(
      userId,
      assessmentId
    );

    if (!isAssigned) {
      // 403 for both "not assigned" and "not active" — prevents information
      // leakage about assessment existence to unauthorized students.
      return res.status(403).json({ error: HTTP_MESSAGES.FORBIDDEN });
    }

    // Fetch the full assessment row to cache time_limit_minutes for validateTimer.
    const assessment = await AssessmentsRepository.getAssessmentById(assessmentId);
    if (!assessment) {
      // Race window: assessment was active during isAssigned check but deleted.
      return res.status(403).json({ error: HTTP_MESSAGES.FORBIDDEN });
    }

    // Attach for downstream reuse — no middleware or handler re-parses params.
    req.studentId        = userId;           // users.id — consistent with assessment_attempts.student_id FK
    req.assessmentId     = assessmentId;
    req.timeLimitMinutes = assessment.time_limit_minutes;

    next();
  } catch (error) {
    console.error("ensureAssessmentAssigned error:", error);
    return res.status(500).json({ error: HTTP_MESSAGES.INTERNAL_ERROR });
  }
};
