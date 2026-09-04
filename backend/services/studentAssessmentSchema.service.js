import { pool } from "../config/db.js";

/**
 * Keeps the canonical SM-07 assessment schema compatible with older local
 * databases that were created before `assessments.description` was introduced.
 * The operation is additive and safe to run on every backend start.
 */
export const ensureStudentAssessmentSchema = async () => {
  await pool.query(`
    ALTER TABLE assessments
      ADD COLUMN IF NOT EXISTS description TEXT;
  `);
};

export default ensureStudentAssessmentSchema;
