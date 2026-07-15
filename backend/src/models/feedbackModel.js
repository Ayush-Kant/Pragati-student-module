import { pool } from "../../config/db.js";

const createFeedbackTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS assignment_feedback (
      id SERIAL PRIMARY KEY,
      assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
      remarks TEXT NOT NULL,
      grade VARCHAR(10) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_assignment_feedback_assignment_id ON assignment_feedback (assignment_id)
  `);
};

export const getFeedback = async (assignmentId) => {
  const result = await pool.query(`
    SELECT id, assignment_id AS "assignmentId", remarks, grade, created_at AS "createdAt"
    FROM assignment_feedback
    WHERE assignment_id = $1
    ORDER BY created_at DESC
  `, [assignmentId]);
  return result.rows;
};

export const addFeedback = async (assignmentId, payload = {}) => {
  const result = await pool.query(`
    INSERT INTO assignment_feedback (assignment_id, remarks, grade)
    VALUES ($1, $2, $3)
    RETURNING id, assignment_id AS "assignmentId", remarks, grade, created_at AS "createdAt"
  `, [assignmentId, payload.remarks || "", payload.grade || "A"]);
  return result.rows[0];
};

const feedbackModel = { createFeedbackTable, getFeedback, addFeedback };
export default feedbackModel;
