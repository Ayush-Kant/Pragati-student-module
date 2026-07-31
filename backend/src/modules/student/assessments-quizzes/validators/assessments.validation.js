/**
 * assessments.validation.js
 *
 * Input validation for the student assessments-quizzes module using Joi.
 *
 * Rules enforced:
 *  ✓ assessmentId param — positive integer, required
 *  ✓ answers — required array, min 1 item, max 500 items
 *  ✓ question_id — positive integer, required per answer
 *  ✓ selected_option — integer in [1, 10] for MCQ answers (optional)
 *  ✓ answer_text — string ≤ 20 000 chars for Coding answers (optional)
 *  ✓ at least one of selected_option or answer_text per answer (MCQ or Coding)
 *  ✓ no duplicate question_id values in the same submission
 *  ✓ no unexpected top-level keys (allowUnknown: false)
 *  ✓ no silent type coercion (convert: false)
 */

import Joi from "joi";
import { VALIDATION } from "../constants/assessments.constants.js";

const {
  MAX_ANSWERS,
  MAX_ANSWER_TEXT_LEN,
  MCQ_OPTION_MIN,
  MCQ_OPTION_MAX,
} = VALIDATION;

// ─── Schemas ──────────────────────────────────────────────────────────────────

/**
 * Schema for a single answer item within the submission payload.
 *
 * The .or() rule enforces that at least one of the two answer fields is present,
 * making an answer object with only question_id invalid.
 */
const answerItemSchema = Joi.object({
  question_id: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base":    "question_id must be a number.",
      "number.integer": "question_id must be an integer.",
      "number.min":     "question_id must be a positive integer.",
      "any.required":   "question_id is required.",
    }),

  selected_option: Joi.number()
    .integer()
    .min(MCQ_OPTION_MIN)
    .max(MCQ_OPTION_MAX)
    .optional()
    .messages({
      "number.base":    "selected_option must be a number.",
      "number.integer": "selected_option must be an integer.",
      "number.min":     `selected_option must be between ${MCQ_OPTION_MIN} and ${MCQ_OPTION_MAX}.`,
      "number.max":     `selected_option must be between ${MCQ_OPTION_MIN} and ${MCQ_OPTION_MAX}.`,
    }),

  answer_text: Joi.string()
    .max(MAX_ANSWER_TEXT_LEN)
    .optional()
    .messages({
      "string.base": "answer_text must be a string.",
      "string.max":  `answer_text must not exceed ${MAX_ANSWER_TEXT_LEN} characters.`,
    }),
})
  .or("selected_option", "answer_text")
  .messages({
    "object.missing":
      "Each answer must include either selected_option (MCQ) or answer_text (Coding).",
  });

/**
 * Schema for the full submission body.
 * min(1) prevents empty submissions that would silently produce a score of 0.
 */
const submissionSchema = Joi.object({
  answers: Joi.array()
    .items(answerItemSchema)
    .min(1)
    .max(MAX_ANSWERS)
    .required()
    .messages({
      "array.base":     "answers must be an array.",
      "array.min":      "answers must contain at least one answer.",
      "array.max":      `answers must not exceed ${MAX_ANSWERS} items.`,
      "any.required":   "answers is required.",
    }),
});

// ─── Middleware ───────────────────────────────────────────────────────────────

/**
 * Validate the :id route parameter as a positive integer.
 * Applied to every per-assessment route so param validation is centralised.
 */
export const validateAssessmentId = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "assessmentId must be a positive integer." });
  }
  next();
};

/**
 * Validate the submission body against the Joi schema.
 *
 * On success, req.body is replaced with the validated + type-confirmed object.
 * On failure, returns 400 with the first validation error message.
 *
 * After Joi validation passes, a Set-based duplicate question_id check runs
 * because Joi lacks a built-in array-uniqueness rule.
 */
export const validateAssessmentSubmission = (req, res, next) => {
  const { error, value } = submissionSchema.validate(req.body, {
    abortEarly:   true,   // return the first error only — consistent UX
    allowUnknown: false,  // reject unexpected top-level keys
    convert:      false,  // no silent coercion: "1" ≠ 1
  });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Duplicate question_id detection (Joi has no built-in uniqueness constraint).
  const seenIds = new Set();
  for (const answer of value.answers) {
    const qid = answer.question_id;
    if (seenIds.has(qid)) {
      return res.status(400).json({
        error: `Duplicate question_id ${qid}. Each question may only be answered once.`,
      });
    }
    seenIds.add(qid);
  }

  // Replace raw body with the validated, type-safe object.
  req.body = value;
  next();
};

export default validateAssessmentSubmission;
