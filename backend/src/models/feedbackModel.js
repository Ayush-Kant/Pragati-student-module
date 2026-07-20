import { pool } from "../../config/db.js";
import { resolveAssignmentStudentId } from "../utils/assignmentHelpers.js";

const createFeedbackTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS assignment_feedback (
      id SERIAL PRIMARY KEY,
      assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL,
      submission_id INTEGER,
      remarks TEXT NOT NULL,
      grade VARCHAR(10) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_assignment_feedback_assignment_id ON assignment_feedback (assignment_id)
  `);
};

export const getFeedback = async (assignmentId, user = {}) => {
  const resolvedStudentId = await resolveAssignmentStudentId(user, null);
  const studentId = user?.role === "student" ? resolvedStudentId : null;
  const result = await pool.query(`
    SELECT id, assignment_id AS "assignmentId", student_id AS "studentId", submission_id AS "submissionId", remarks, grade, created_at AS "createdAt"
    FROM assignment_feedback
    WHERE assignment_id = $1${studentId ? " AND student_id = $2" : ""}
    ORDER BY created_at DESC
  `, studentId ? [assignmentId, studentId] : [assignmentId]);
  return result.rows;
};

export const addFeedback = async (assignmentId, payload = {}, user = {}) => {
  const studentId = await resolveAssignmentStudentId(user, payload.studentId ?? null);
  const submissionId = payload.submissionId ?? null;
  const result = await pool.query(`
    INSERT INTO assignment_feedback (assignment_id, student_id, submission_id, remarks, grade)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, assignment_id AS "assignmentId", student_id AS "studentId", submission_id AS "submissionId", remarks, grade, created_at AS "createdAt"
  `, [assignmentId, studentId, submissionId, payload.remarks || "", payload.grade || "A"]);
  return result.rows[0];
};

const feedbackModel = { createFeedbackTable, getFeedback, addFeedback };
export default feedbackModel;
