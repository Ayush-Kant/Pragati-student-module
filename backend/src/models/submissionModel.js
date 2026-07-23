import { pool } from "../../config/db.js";

export const submitAssignment = async (assignmentId, studentId, payload) => {
  const result = await pool.query(
    `
    INSERT INTO assignment_submissions (
      assignment_id,
      student_id,
      content,
      file_url,
      status,
      submitted_at
    )
    VALUES ($1, $2, $3, $4, $5, NOW())
    ON CONFLICT (assignment_id, student_id)
    DO UPDATE SET
      content = EXCLUDED.content,
      file_url = EXCLUDED.file_url,
      status = EXCLUDED.status,
      submitted_at = NOW()
    RETURNING
      id,
      assignment_id AS "assignmentId",
      student_id AS "studentId",
      content,
      file_url AS "fileUrl",
      status,
      submitted_at AS "submittedAt"
    `,
    [assignmentId, studentId, payload.content || null, payload.fileUrl || null, payload.status || "Submitted"]
  );

  return result.rows[0];
};

export const updateSubmission = async (assignmentId, studentId, payload) => {
  const result = await pool.query(
    `
    UPDATE assignment_submissions
    SET content = COALESCE($3, content),
        file_url = COALESCE($4, file_url),
        status = COALESCE($5, status),
        submitted_at = NOW()
    WHERE assignment_id = $1 AND student_id = $2
    RETURNING
      id,
      assignment_id AS "assignmentId",
      student_id AS "studentId",
      content,
      file_url AS "fileUrl",
      status,
      submitted_at AS "submittedAt"
    `,
    [assignmentId, studentId, payload.content || null, payload.fileUrl || null, payload.status || null]
  );

  return result.rows[0];
};

export const getSubmissionHistory = async (assignmentId, studentId) => {
  const result = await pool.query(
    `
    SELECT
      id,
      assignment_id AS "assignmentId",
      student_id AS "studentId",
      content,
      file_url AS "fileUrl",
      status,
      submitted_at AS "submittedAt"
    FROM assignment_submissions
    WHERE assignment_id = $1 AND student_id = $2
    ORDER BY submitted_at DESC
    `,
    [assignmentId, studentId]
  );

  return result.rows;
};

export default {
  submitAssignment,
  updateSubmission,
  getSubmissionHistory,
};
