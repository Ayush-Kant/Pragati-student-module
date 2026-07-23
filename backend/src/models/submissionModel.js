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
  const fields = [];
  const values = [assignmentId, studentId];
  let index = 3;

  if (payload.content !== undefined) {
    fields.push(`content = $${index++}`);
    values.push(payload.content ?? null);
  }

  if (payload.fileUrl !== undefined) {
    fields.push(`file_url = $${index++}`);
    values.push(payload.fileUrl ?? null);
  }

  if (payload.status !== undefined) {
    fields.push(`status = $${index++}`);
    values.push(payload.status ?? "Submitted");
  }

  if (fields.length === 0) {
    return null;
  }

  const result = await pool.query(
    `
    UPDATE assignment_submissions
    SET ${fields.join(", ")}, submitted_at = NOW()
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
    values
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
