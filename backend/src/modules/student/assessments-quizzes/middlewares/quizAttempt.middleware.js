/**
 * quizAttempt.middleware.js
 *
 * Ensures a STARTED attempt exists for the student before a submission is
 * allowed. Must run AFTER ensureAssessmentAssigned — relies on req.studentId
 * and req.assessmentId being set.
 *
 * On success, attaches:
 *   req.attempt — { id, status, started_at } — consumed by validateTimer
 *
 * Error responses:
 *   409 — no STARTED attempt (student must call /start first)
 *   500 — misconfigured middleware chain or unexpected repository error
 */

import * as AssessmentsRepository from "../repositories/assessments.repository.js";
import { ATTEMPT_STATUS, HTTP_MESSAGES } from "../constants/assessments.constants.js";

export const ensureAttemptStarted = async (req, res, next) => {
  try {
    // Hard assertion: both values must have been set by ensureAssessmentAssigned.
    // If absent the middleware chain is misconfigured — fail loudly with 500.
    if (!req.studentId || !req.assessmentId) {
      console.error(
        "ensureAttemptStarted: req.studentId or req.assessmentId missing — " +
        "ensure ensureAssessmentAssigned runs before this middleware."
      );
      return res.status(500).json({ error: HTTP_MESSAGES.INTERNAL_ERROR });
    }

    const attempt = await AssessmentsRepository.getActiveAttempt(
      req.studentId,
      req.assessmentId
    );

    if (!attempt || attempt.status !== ATTEMPT_STATUS.STARTED) {
      return res.status(409).json({
        error: "No active attempt found. Please start the assessment first.",
      });
    }

    // Attach for use by validateTimer (needs attempt.started_at).
    req.attempt = attempt;
    next();
  } catch (error) {
    console.error("ensureAttemptStarted error:", error);
    return res.status(500).json({ error: HTTP_MESSAGES.INTERNAL_ERROR });
  }
};
