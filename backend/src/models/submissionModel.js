import { pool } from "../../config/db.js";

const createSubmissionTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS assignment_submissions (
      id SERIAL PRIMARY KEY,
      assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL,
      file_url TEXT,
      content TEXT,
      status VARCHAR(50) NOT NULL DEFAULT 'Submitted',
      submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment_id ON assignment_submissions (assignment_id)
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_assignment_submissions_unique ON assignment_submissions (assignment_id, student_id)
  `);
};

export const submitAssignment = async (studentId, assignmentId, payload = {}) => {
  const result = await pool.query(`
    INSERT INTO assignment_submissions (assignment_id, student_id, file_url, content, status)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (assignment_id, student_id) DO UPDATE SET
      file_url = EXCLUDED.file_url,
      content = EXCLUDED.content,
      status = EXCLUDED.status,
      updated_at = NOW()
    RETURNING id, assignment_id AS "assignmentId", student_id AS "studentId", file_url AS "fileUrl", content, status, submitted_at AS "submittedAt", updated_at AS "updatedAt"
  `, [assignmentId, studentId, payload.fileUrl || null, payload.content || null, payload.status || "Submitted"]);
  return result.rows[0];
};

export const updateSubmission = async (studentId, assignmentId, payload = {}) => {
  const result = await pool.query(`
    UPDATE assignment_submissions
    SET file_url = COALESCE($3, file_url), content = COALESCE($4, content), status = COALESCE($5, status), updated_at = NOW()
    WHERE assignment_id = $1 AND student_id = $2
    RETURNING id, assignment_id AS "assignmentId", student_id AS "studentId", file_url AS "fileUrl", content, status, submitted_at AS "submittedAt", updated_at AS "updatedAt"
  `, [assignmentId, studentId, payload.fileUrl || null, payload.content || null, payload.status || null]);
  return result.rows[0] || null;
};

export const getSubmissionHistory = async (studentId, assignmentId) => {
  const result = await pool.query(`
    SELECT id, assignment_id AS "assignmentId", student_id AS "studentId", file_url AS "fileUrl", content, status, submitted_at AS "submittedAt", updated_at AS "updatedAt"
    FROM assignment_submissions
    WHERE assignment_id = $1 AND student_id = $2
    ORDER BY submitted_at DESC
  `, [assignmentId, studentId]);
  return result.rows;
};

const submissionModel = { createSubmissionTable, submitAssignment, updateSubmission, getSubmissionHistory };
export default submissionModel;
