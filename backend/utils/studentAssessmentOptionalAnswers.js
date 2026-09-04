import { pool } from "../config/db.js";

let ensurePromise = null;

/**
 * Student assessments are intentionally answer-optional: students may submit
 * an attempt with any number of unanswered questions. Keep older developer
 * databases compatible with the SM-07 is_required column, which was initially
 * introduced with a TRUE default.
 */
export const ensureOptionalAssessmentQuestions = async () => {
  if (!ensurePromise) {
    ensurePromise = (async () => {
      await pool.query(`
        ALTER TABLE assessment_questions
          ADD COLUMN IF NOT EXISTS is_required BOOLEAN NOT NULL DEFAULT FALSE;
      `);
      await pool.query(`
        ALTER TABLE assessment_questions
          ALTER COLUMN is_required SET DEFAULT FALSE;
      `);
      await pool.query(`
        UPDATE assessment_questions
        SET is_required = FALSE
        WHERE is_required IS DISTINCT FROM FALSE;
      `);
    })().catch((error) => {
      ensurePromise = null;
      throw error;
    });
  }

  await ensurePromise;
};
