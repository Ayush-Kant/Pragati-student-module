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
 * Unlimited assessments (time_limit_minutes IS NULL / 0 / undefined) skip
 * timer validation entirely — only a positive finite numeric limit is enforced.
 *
 * Error responses use { success, message, errorCode } — consistent with all
 * module middleware.
 *   500 — missing req.assessmentId (chain misconfiguration)
 *   500 — timed assessment missing req.attempt.started_at (chain misconfiguration)
 *   422 — elapsed time exceeds time_limit_minutes
 */

import { isTimeLimitExceeded } from "../helpers/assessments.helpers.js";
import { HTTP_MESSAGES, ERROR_CODES } from "../constants/assessments.constants.js";

export const validateTimer = (req, res, next) => {
  // Hard assertion: assessmentId must have been set by ensureAssessmentAssigned.
  if (!req.assessmentId) {
    console.error(
      "validateTimer: req.assessmentId missing — " +
      "ensure ensureAssessmentAssigned runs before this middleware."
    );
    return res.status(500).json({
      success:   false,
      message:   HTTP_MESSAGES.INTERNAL_ERROR,
      errorCode: ERROR_CODES.INTERNAL_ERROR,
    });
  }

  // Unlimited assessment: NULL / undefined / non-positive time limit → skip timer.
  // Coerce to Number so a DB string "0" is also treated as unlimited.
  const limit = Number(req.timeLimitMinutes);
  if (req.timeLimitMinutes == null || !Number.isFinite(limit) || limit <= 0) {
    return next();
  }

  const attempt = req.attempt;

  if (!attempt?.started_at) {
    console.error(
      "validateTimer: req.attempt.started_at missing — " +
      "ensure ensureAttemptStarted runs before validateTimer."
    );
    return res.status(500).json({
      success:   false,
      message:   HTTP_MESSAGES.INTERNAL_ERROR,
      errorCode: ERROR_CODES.INTERNAL_ERROR,
    });
  }

  if (isTimeLimitExceeded(attempt.started_at, limit)) {
    return res.status(422).json({
      success:   false,
      message:   `Time limit of ${limit} minute(s) has been exceeded. Submission rejected.`,
      errorCode: ERROR_CODES.TIME_LIMIT_EXCEEDED,
    });
  }

  next();
};
