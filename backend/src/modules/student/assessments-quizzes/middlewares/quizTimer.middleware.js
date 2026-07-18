/**
 * quizTimer.middleware.js
 *
 * Validates that the student's submission arrives within the assessment's
 * allowed time window.
 *
 * Dependency order (must run after both):
 *   ensureAssessmentAssigned  → sets req.assessmentId, req.timeLimitMinutes
 *   ensureAttemptStarted      → sets req.attempt.started_at
 *
 * This middleware is fully synchronous — zero additional DB round-trips.
 * The time limit and started_at are read from req values cached upstream.
 *
 * Error responses:
 *   500 — missing req values (chain misconfiguration)
 *   422 — elapsed time exceeds time_limit_minutes
 */

import { isTimeLimitExceeded } from "../helpers/assessments.helpers.js";
import { HTTP_MESSAGES } from "../constants/assessments.constants.js";

export const validateTimer = (req, res, next) => {
  // Hard assertions — both must have been set by earlier middleware.
  if (!req.assessmentId || req.timeLimitMinutes == null) {
    console.error(
      "validateTimer: req.assessmentId or req.timeLimitMinutes missing — " +
      "ensure ensureAssessmentAssigned runs before this middleware."
    );
    return res.status(500).json({ error: HTTP_MESSAGES.INTERNAL_ERROR });
  }

  const attempt = req.attempt;

  if (!attempt?.started_at) {
    console.error(
      "validateTimer: req.attempt.started_at missing — " +
      "ensure ensureAttemptStarted runs before validateTimer."
    );
    return res.status(500).json({ error: HTTP_MESSAGES.INTERNAL_ERROR });
  }

  if (isTimeLimitExceeded(attempt.started_at, req.timeLimitMinutes)) {
    return res.status(422).json({
      error: `Time limit of ${req.timeLimitMinutes} minute(s) has been exceeded. Submission rejected.`,
    });
  }

  next();
};
