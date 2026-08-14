import { pool } from "../../config/db.js";

export const getDeadlines = async (studentId) => {
  const result = await pool.query(
    `
    SELECT
      id,
      assignment_id AS "assignmentId",
      due_date AS "dueDate",
      status,
      updated_at AS "updatedAt"
    FROM assignment_deadlines
    WHERE assignment_id IN (
      SELECT id FROM assignments WHERE student_id IS NULL OR student_id = $1
    )
    ORDER BY due_date ASC
    `,
    [studentId]
  );

  return result.rows;
};

export const updateDeadline = async (assignmentId, payload) => {
  const result = await pool.query(
    `
    INSERT INTO assignment_deadlines (assignment_id, due_date, status)
    VALUES ($1, $2, $3)
    ON CONFLICT (assignment_id)
    DO UPDATE SET
      due_date = EXCLUDED.due_date,
      status = EXCLUDED.status,
      updated_at = NOW()
    RETURNING
      id,
      assignment_id AS "assignmentId",
      due_date AS "dueDate",
      status,
      updated_at AS "updatedAt"
    `,
    [assignmentId, payload.dueDate, payload.status || "Open"]
  );

  return result.rows[0];
};

export default {
  getDeadlines,
  updateDeadline,
};
