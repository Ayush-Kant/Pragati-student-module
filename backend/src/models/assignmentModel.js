import { pool } from "../../config/db.js";

export const getAllAssignments = async (studentId) => {
  const result = await pool.query(
    `
    SELECT
      id,
      title,
      subject,
      due_date AS "dueDate",
      total_marks AS "totalMarks",
      status,
      created_at AS "createdAt"
    FROM assignments
    WHERE student_id IS NULL OR student_id = $1
    ORDER BY due_date ASC
    `,
    [studentId]
  );

  return result.rows;
};

export const getAssignmentById = async (id, studentId) => {
  const result = await pool.query(
    `
    SELECT
      id,
      title,
      subject,
      description,
      due_date AS "dueDate",
      total_marks AS "totalMarks",
      status,
      created_at AS "createdAt"
    FROM assignments
    WHERE id = $1 AND (student_id IS NULL OR student_id = $2)
    `,
    [id, studentId]
  );

  return result.rows[0];
};

export const createAssignment = async (payload) => {
  const result = await pool.query(
    `
    INSERT INTO assignments (title, subject, description, due_date, total_marks, status, student_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, title, subject, description, due_date AS "dueDate", total_marks AS "totalMarks", status, student_id AS "studentId", created_at AS "createdAt"
    `,
    [payload.title, payload.subject, payload.description || null, payload.dueDate, payload.totalMarks, payload.status || "Open", payload.studentId || null]
  );

  return result.rows[0];
};

export default {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
};
