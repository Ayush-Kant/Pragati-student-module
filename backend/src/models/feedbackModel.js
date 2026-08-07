import { pool } from "../../config/db.js";

export const getFeedback = async (assignmentId, studentId) => {
  const result = await pool.query(
    `
    SELECT
      id,
      assignment_id AS "assignmentId",
      student_id AS "studentId",
      remarks,
      grade,
      created_at AS "createdAt"
    FROM assignment_feedback
    WHERE assignment_id = $1 AND student_id = $2
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [assignmentId, studentId]
  );

  return result.rows[0];
};

export const addFeedback = async (assignmentId, studentId, payload) => {
  const result = await pool.query(
    `
    INSERT INTO assignment_feedback (assignment_id, student_id, remarks, grade)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (assignment_id, student_id)
    DO UPDATE SET
      remarks = EXCLUDED.remarks,
      grade = EXCLUDED.grade,
      created_at = NOW()
    RETURNING
      id,
      assignment_id AS "assignmentId",
      student_id AS "studentId",
      remarks,
      grade,
      created_at AS "createdAt"
    `,
    [assignmentId, studentId, payload.remarks, payload.grade]
  );

  return result.rows[0];
};

export default {
  getFeedback,
  addFeedback,
};
