/**
 * assessments.controller.js
 *
 * Thin orchestration layer only — HTTP request in, DTO-shaped response out.
 *
 * Responsibilities:
 *   ✓ Read validated req values set by middleware
 *   ✓ Call the service
 *   ✓ Map results through DTOs
 *   ✓ Return correct HTTP status codes
 *
 * Explicitly NOT done here:
 *   ✗ No SQL
 *   ✗ No business logic
 *   ✗ No DTO construction in the service
 *   ✗ No error.message forwarded to clients (internal details never leaked)
 *   ✗ No fallback chain for req.user fields (req.user.userId / req.user.sub)
 *
 * Security:
 *   req.user.id  — the sole canonical JWT field (set by authMiddleware from the
 *                  verified token payload). If absent the token is malformed.
 *   req.studentId / req.assessmentId — set by ensureAssessmentAssigned; the
 *                  controller reads these rather than re-parsing params.
 */

import StudentAssessmentService from "../services/assessments.service.js";
import { toAssessmentListItemDTO, toAssessmentDetailDTO } from "../dto/quiz.dto.js";
import { toAttemptStartDTO, toSubmitResponseDTO }         from "../dto/attempt.dto.js";
import { toResultDTO }                                    from "../dto/review.dto.js";
import { ERROR_CODES, HTTP_MESSAGES }                     from "../constants/assessments.constants.js";

// ─── Response helpers ─────────────────────────────────────────────────────────

const INTERNAL_ERROR = { error: HTTP_MESSAGES.INTERNAL_ERROR };

/**
 * Map a typed business error code to the appropriate HTTP response.
 * Controllers never read error.message to avoid leaking service internals.
 */
const handleBusinessError = (res, error) => {
  switch (error.code) {
    case ERROR_CODES.ASSESSMENT_NOT_FOUND:
      return res.status(404).json({ error: HTTP_MESSAGES.ASSESSMENT_NOT_FOUND });
    case ERROR_CODES.ASSESSMENT_NOT_ACTIVE:
      return res.status(409).json({ error: HTTP_MESSAGES.ASSESSMENT_NOT_ACTIVE });
    case ERROR_CODES.ATTEMPT_NOT_FOUND:
      return res.status(404).json({ error: HTTP_MESSAGES.ATTEMPT_NOT_FOUND });
    default:
      return null; // caller must emit a 500
  }
};

// ─── Controller handlers ──────────────────────────────────────────────────────

/**
 * GET /
 * List all active assessments assigned to the authenticated student's drive.
 */
export const getAssessments = async (req, res) => {
  try {
    // req.user.id — the only canonical JWT identifier. No fallback chain.
    const studentId = req.user.id;
    if (!studentId) {
      return res.status(401).json({ error: HTTP_MESSAGES.UNAUTHORIZED });
    }

    const rows = await StudentAssessmentService.getAssignedAssessments(studentId);
    return res.status(200).json(rows.map(toAssessmentListItemDTO));
  } catch (error) {
    console.error("getAssessments error:", error);
    return res.status(500).json(INTERNAL_ERROR);
  }
};

/**
 * GET /:id
 * Fetch full details of a single assessment (questions included, correct_option excluded).
 * req.assessmentId is already validated and drive-checked by ensureAssessmentAssigned.
 */
export const getAssessment = async (req, res) => {
  try {
    const data = await StudentAssessmentService.getAssessmentDetails(req.assessmentId);
    if (!data) {
      return res.status(404).json({ error: HTTP_MESSAGES.ASSESSMENT_NOT_FOUND });
    }
    return res.status(200).json(toAssessmentDetailDTO(data));
  } catch (error) {
    console.error("getAssessment error:", error);
    return res.status(500).json(INTERNAL_ERROR);
  }
};

/**
 * POST /:id/start
 * Start (or resume) a STARTED attempt for the authenticated student.
 * Returns 409 if the assessment is no longer active.
 */
export const startAssessment = async (req, res) => {
  try {
    const data = await StudentAssessmentService.startAttempt(req.studentId, req.assessmentId);
    return res.status(201).json(toAttemptStartDTO(data));
  } catch (error) {
    console.error("startAssessment error:", error);
    const businessResponse = handleBusinessError(res, error);
    if (businessResponse) return businessResponse;
    return res.status(500).json(INTERNAL_ERROR);
  }
};

/**
 * POST /:id/submit
 * Submit answers for the active attempt.
 * Middleware chain: validateAssessmentId → ensureAssessmentAssigned →
 *                  ensureAttemptStarted → validateTimer → validateAssessmentSubmission
 * Returns 404 if no STARTED attempt exists (defense-in-depth, middleware should catch first).
 */
export const submitAssessment = async (req, res) => {
  try {
    const data = await StudentAssessmentService.submitAttempt(
      req.studentId,
      req.assessmentId,
      req.body.answers
    );
    return res.status(200).json(toSubmitResponseDTO(data));
  } catch (error) {
    console.error("submitAssessment error:", error);
    const businessResponse = handleBusinessError(res, error);
    if (businessResponse) return businessResponse;
    return res.status(500).json(INTERNAL_ERROR);
  }
};

/**
 * GET /:id/result
 * Fetch the graded result for a submitted attempt.
 * Returns 404 when no submitted attempt exists (not started or still in progress).
 */
export const getResult = async (req, res) => {
  try {
    const data = await StudentAssessmentService.getResult(req.studentId, req.assessmentId);
    if (!data) {
      return res.status(404).json({ error: HTTP_MESSAGES.RESULT_NOT_FOUND });
    }
    return res.status(200).json(toResultDTO(data));
  } catch (error) {
    console.error("getResult error:", error);
    return res.status(500).json(INTERNAL_ERROR);
  }
};
