import { pool } from "../../config/db.js";

export const getGrades = async (studentId) => {
  const result = await pool.query(
    `
    SELECT
      id,
      assignment_id AS "assignmentId",
      student_id AS "studentId",
      score,
      remarks,
      created_at AS "createdAt"
    FROM assignment_grades
    WHERE student_id = $1
    ORDER BY created_at DESC
    `,
    [studentId]
  );

  return result.rows;
};

export const updateGrades = async (assignmentId, studentId, payload) => {
  const result = await pool.query(
    `
    INSERT INTO assignment_grades (assignment_id, student_id, score, remarks)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (assignment_id, student_id)
    DO UPDATE SET
      score = EXCLUDED.score,
      remarks = EXCLUDED.remarks,
      created_at = NOW()
    RETURNING
      id,
      assignment_id AS "assignmentId",
      student_id AS "studentId",
      score,
      remarks,
      created_at AS "createdAt"
    `,
    [assignmentId, studentId, payload.score, payload.remarks || null]
  );

  return result.rows[0];
};

export default {
  getGrades,
  updateGrades,
};
