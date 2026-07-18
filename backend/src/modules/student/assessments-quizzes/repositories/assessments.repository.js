/**
 * assessments.repository.js
 *
 * Owns ALL database access for the student assessments-quizzes module.
 *
 * ─── Identity resolution ──────────────────────────────────────────────────────
 * The JWT payload contains `id = users.id` (set by auth.controller.js).
 * The table hierarchy is:
 *   auth_users(id) ← users(auth_user_id) → users.id (JWT id)
 *   students(user_id → users.id)          → students.id
 *   student_drive_progress(student_id → students.id)
 *   assessment_attempts(student_id → users.id)  ← uses users.id directly
 *
 * Queries that join student_drive_progress must resolve from users.id to
 * students.id first. All queries against assessment_attempts use users.id
 * directly (the FK references users(id)).
 *
 * ─── Safety guarantees ────────────────────────────────────────────────────────
 * - Every SQL query is fully parameterised — zero string interpolation.
 * - All mutations that require atomicity use explicit pg transactions.
 * - correct_option is never selected in student-facing queries.
 */

import { pool } from "../../../../../config/db.js";
import { ASSESSMENT_STATUS, ATTEMPT_STATUS } from "../constants/assessments.constants.js";

// ─── Assessment queries ───────────────────────────────────────────────────────

/**
 * Fetch all active assessments assigned to this student via their recruitment
 * drive membership.
 *
 * Join path (users.id → students.id → student_drive_progress.student_id):
 *   users(id=$1)
 *   → students(user_id)               resolve users.id to students.id
 *   → student_drive_progress(student_id, drive_id)
 *   → assessment_assignments(drive_id, assessment_id)
 *   → assessments(id, status='active')
 *
 * DISTINCT prevents duplicates when a student belongs to multiple drives
 * that share the same assessment.
 *
 * @param {number} userId  — req.user.id (users.id from JWT)
 * @returns {Promise<object[]>}
 */
export const getAssignedAssessments = async (userId) => {
  const query = `
    SELECT DISTINCT
           a.id, a.title, a.type, a.difficulty,
           a.time_limit_minutes, a.total_marks, a.status, a.created_at
    FROM   assessments a
    JOIN   assessment_assignments  aa  ON aa.assessment_id = a.id
    JOIN   student_drive_progress  sdp ON sdp.drive_id     = aa.drive_id
    JOIN   students                s   ON s.id             = sdp.student_id
    WHERE  s.user_id  = $1
      AND  a.status   = $2
    ORDER BY a.created_at DESC;
  `;
  const { rows } = await pool.query(query, [userId, ASSESSMENT_STATUS.ACTIVE]);
  return rows;
};

/**
 * Returns true when the authenticated user (users.id) is enrolled in a
 * recruitment drive that has this assessment assigned AND the assessment is
 * currently active.
 *
 * Used by authorization middleware to gate every per-assessment route.
 *
 * @param {number} userId       — req.user.id (users.id from JWT)
 * @param {number} assessmentId
 * @returns {Promise<boolean>}
 */
export const isAssessmentAssignedToStudent = async (userId, assessmentId) => {
  const query = `
    SELECT 1
    FROM   student_drive_progress  sdp
    JOIN   students                s   ON s.id             = sdp.student_id
    JOIN   assessment_assignments  aa  ON aa.drive_id      = sdp.drive_id
    JOIN   assessments             a   ON a.id             = aa.assessment_id
    WHERE  s.user_id       = $1
      AND  aa.assessment_id = $2
      AND  a.status         = $3
    LIMIT  1;
  `;
  const { rows } = await pool.query(query, [userId, assessmentId, ASSESSMENT_STATUS.ACTIVE]);
  return rows.length > 0;
};

/**
 * Fetch a single assessment row by primary key.
 * Returns null when not found.
 *
 * @param {number} assessmentId
 * @returns {Promise<object|null>}
 */
export const getAssessmentById = async (assessmentId) => {
  const query = `
    SELECT id, title, type, difficulty, time_limit_minutes,
           total_marks, status, created_at
    FROM   assessments
    WHERE  id = $1;
  `;
  const { rows } = await pool.query(query, [assessmentId]);
  return rows[0] ?? null;
};

// ─── Question queries ─────────────────────────────────────────────────────────

/**
 * Fetch all questions for an assessment in id order (stable display order).
 *
 * correct_option is intentionally excluded — it must never be sent to the
 * student before submission. assessment_id is excluded as it is redundant
 * to the client (the student already knows which assessment they are viewing).
 *
 * @param {number} assessmentId
 * @returns {Promise<object[]>}
 */
export const getAssessmentQuestions = async (assessmentId) => {
  const query = `
    SELECT id, type, question_text, options,
           problem_statement, language_support,
           sample_input, sample_output, marks
    FROM   assessment_questions
    WHERE  assessment_id = $1
    ORDER  BY id;
  `;
  const { rows } = await pool.query(query, [assessmentId]);
  return rows;
};

/**
 * Fetch grading-relevant fields for a set of questions belonging to a specific
 * assessment. The assessment_id filter prevents cross-assessment question-ID
 * forgery — a student cannot submit question IDs from a different assessment.
 *
 * Returns a Map keyed by question.id for O(1) lookup during grading.
 *
 * @param {number[]} questionIds
 * @param {number}   assessmentId  — scopes the lookup to this assessment only
 * @returns {Promise<Map<number, object>>}
 */
export const getQuestionsForGrading = async (questionIds, assessmentId) => {
  if (!questionIds.length) return new Map();
  const query = `
    SELECT id, type, correct_option, marks
    FROM   assessment_questions
    WHERE  id            = ANY($1::integer[])
      AND  assessment_id = $2;
  `;
  const { rows } = await pool.query(query, [questionIds, assessmentId]);
  return new Map(rows.map((q) => [q.id, q]));
};

// ─── Attempt queries ──────────────────────────────────────────────────────────

/**
 * Fetch the most-recent STARTED attempt for a student+assessment pair.
 * Returns started_at so validateTimer can compute elapsed time without a
 * second DB round-trip.
 * Returns null when not found.
 *
 * assessment_attempts.student_id references users(id) directly.
 *
 * @param {number} userId       — req.user.id (users.id from JWT)
 * @param {number} assessmentId
 * @returns {Promise<object|null>}
 */
export const getActiveAttempt = async (userId, assessmentId) => {
  const query = `
    SELECT id, status, started_at
    FROM   assessment_attempts
    WHERE  student_id    = $1
      AND  assessment_id = $2
      AND  status        = $3
    ORDER  BY started_at DESC
    LIMIT  1;
  `;
  const { rows } = await pool.query(query, [userId, assessmentId, ATTEMPT_STATUS.STARTED]);
  return rows[0] ?? null;
};

/**
 * Create a new attempt using INSERT … ON CONFLICT DO NOTHING to prevent a
 * race condition where two simultaneous /start requests both pass the
 * "no existing attempt" check and insert duplicate STARTED rows.
 *
 * Requires the unique partial index:
 *   CREATE UNIQUE INDEX ON assessment_attempts(student_id, assessment_id)
 *     WHERE status = 'started';
 * (see migration 012_assessment_attempt_constraints.sql)
 *
 * If a conflict occurs, the existing STARTED row is returned via SELECT.
 *
 * @param {number} userId       — req.user.id (users.id)
 * @param {number} assessmentId
 * @returns {Promise<object>}
 */
export const createAttempt = async (userId, assessmentId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const insertResult = await client.query(
      `
      INSERT INTO assessment_attempts (student_id, assessment_id, started_at, status)
      VALUES ($1, $2, NOW(), $3)
      ON CONFLICT (student_id, assessment_id)
        WHERE status = 'started'
      DO NOTHING
      RETURNING id, student_id, assessment_id, started_at, status;
      `,
      [userId, assessmentId, ATTEMPT_STATUS.STARTED]
    );

    if (insertResult.rows.length > 0) {
      await client.query("COMMIT");
      return insertResult.rows[0];
    }

    // Conflict: a STARTED row already exists — return it.
    const selectResult = await client.query(
      `
      SELECT id, student_id, assessment_id, started_at, status
      FROM   assessment_attempts
      WHERE  student_id    = $1
        AND  assessment_id = $2
        AND  status        = $3
      ORDER  BY started_at DESC
      LIMIT  1;
      `,
      [userId, assessmentId, ATTEMPT_STATUS.STARTED]
    );

    await client.query("COMMIT");
    return selectResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Fetch the most-recent STARTED attempt id for use during submission.
 * Restricted to STARTED — prevents double-submission of already-submitted
 * attempts (defense-in-depth alongside the middleware check).
 * Returns null when not found.
 *
 * @param {number} userId       — req.user.id (users.id)
 * @param {number} assessmentId
 * @returns {Promise<object|null>}
 */
export const getAttempt = async (userId, assessmentId) => {
  const query = `
    SELECT id
    FROM   assessment_attempts
    WHERE  student_id    = $1
      AND  assessment_id = $2
      AND  status        = $3
    ORDER  BY started_at DESC
    LIMIT  1;
  `;
  const { rows } = await pool.query(query, [userId, assessmentId, ATTEMPT_STATUS.STARTED]);
  return rows[0] ?? null;
};

// ─── Submission ───────────────────────────────────────────────────────────────

/**
 * Persist a full set of pre-scored answers inside a single ACID transaction.
 *
 * Steps (all atomic):
 *  1. Bulk INSERT answers via UNNEST — one DB round-trip regardless of count.
 *  2. calculateScore — SUM marks_obtained, UPDATE attempt.score.
 *  3. UPDATE attempt status → SUBMITTED with WHERE status = 'started' guard.
 *     If 0 rows updated → attempt was already submitted → throw.
 *
 * The grading_status column is required in assessment_submissions.
 * See migration 012_assessment_attempt_constraints.sql.
 *
 * @param {number} attemptId
 * @param {Array<{
 *   question_id:     number,
 *   selected_option: number|null,
 *   answer_text:     string|null,
 *   isCorrect:       boolean,
 *   marksObtained:   number,
 *   gradingStatus:   string,
 * }>} scoredAnswers
 * @returns {Promise<void>}
 */
export const submitAnswers = async (attemptId, scoredAnswers) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    if (scoredAnswers.length > 0) {
      const questionIds     = scoredAnswers.map((a) => a.question_id);
      const selectedOptions = scoredAnswers.map((a) => a.selected_option ?? null);
      const answerTexts     = scoredAnswers.map((a) => a.answer_text    ?? null);
      const isCorrects      = scoredAnswers.map((a) => a.isCorrect);
      const marksObtained   = scoredAnswers.map((a) => a.marksObtained);
      const gradingStatuses = scoredAnswers.map((a) => a.gradingStatus);

      // One INSERT for all answers.
      // selected_option is cast ::integer[] — JS null becomes SQL NULL correctly
      // in node-postgres when an explicit type annotation is present.
      await client.query(
        `
        INSERT INTO assessment_submissions
          (attempt_id, question_id, selected_option, answer_text,
           is_correct, marks_obtained, grading_status)
        SELECT $1,
               UNNEST($2::integer[]),
               UNNEST($3::integer[]),
               UNNEST($4::text[]),
               UNNEST($5::boolean[]),
               UNNEST($6::numeric[]),
               UNNEST($7::text[]);
        `,
        [attemptId, questionIds, selectedOptions, answerTexts,
         isCorrects, marksObtained, gradingStatuses]
      );
    }

    // Sum and persist the score inside the same transaction.
    await calculateScore(attemptId, client);

    // Transition status — the WHERE status = 'started' guard prevents a second
    // concurrent submission from succeeding even if middleware was bypassed.
    const update = await client.query(
      `
      UPDATE assessment_attempts
      SET    submitted_at = NOW(),
             status       = $2,
             updated_at   = NOW()
      WHERE  id     = $1
        AND  status = $3
      RETURNING id;
      `,
      [attemptId, ATTEMPT_STATUS.SUBMITTED, ATTEMPT_STATUS.STARTED]
    );

    if (update.rows.length === 0) {
      throw new Error(
        "Attempt is no longer in STARTED state — possible duplicate submission."
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// ─── Score calculation ────────────────────────────────────────────────────────

/**
 * SUM marks_obtained for all submissions of an attempt and persist the result.
 * Accepts an optional pg.PoolClient so it can participate in a larger transaction.
 *
 * RETURNING guard ensures the UPDATE actually matched a row — throws if not.
 *
 * @param {number} attemptId
 * @param {object} [client=pool]
 * @returns {Promise<number>}
 */
export const calculateScore = async (attemptId, client = pool) => {
  const { rows } = await client.query(
    `
    SELECT COALESCE(SUM(marks_obtained), 0) AS score
    FROM   assessment_submissions
    WHERE  attempt_id = $1;
    `,
    [attemptId]
  );

  const score = Number(rows[0].score ?? 0);

  const update = await client.query(
    `
    UPDATE assessment_attempts
    SET    score = $1
    WHERE  id    = $2
    RETURNING id;
    `,
    [score, attemptId]
  );

  if (update.rows.length === 0) {
    throw new Error(
      `calculateScore: attempt ${attemptId} not found — score update skipped.`
    );
  }

  return score;
};

// ─── Result queries ───────────────────────────────────────────────────────────

/**
 * Fetch the most-recent SUBMITTED attempt for a student+assessment pair.
 *
 * Restricted to SUBMITTED — prevents returning an in-progress null-score row.
 * Returns null when no submitted attempt exists.
 *
 * @param {number} userId       — req.user.id (users.id)
 * @param {number} assessmentId
 * @returns {Promise<object|null>}
 */
export const getResult = async (userId, assessmentId) => {
  const query = `
    SELECT id, student_id, assessment_id,
           started_at, submitted_at, score, status
    FROM   assessment_attempts
    WHERE  student_id    = $1
      AND  assessment_id = $2
      AND  status        = $3
    ORDER  BY submitted_at DESC
    LIMIT  1;
  `;
  const { rows } = await pool.query(query, [userId, assessmentId, ATTEMPT_STATUS.SUBMITTED]);
  return rows[0] ?? null;
};
