import { pool } from "../../config/db.js";

const createGradeTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS assignment_grades (
      id SERIAL PRIMARY KEY,
      assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL,
      marks INTEGER NOT NULL DEFAULT 0,
      grade VARCHAR(10) NOT NULL DEFAULT 'N/A',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_assignment_grades_assignment_id ON assignment_grades (assignment_id)
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_assignment_grades_unique ON assignment_grades (assignment_id, student_id)
  `);
};

export const getGrades = async (query = {}, user = {}) => {
  const assignmentId = query.assignmentId || null;
  const studentId = user?.role === "student" ? user.id : (query.studentId || null);
  const result = await pool.query(`
    SELECT id, assignment_id AS "assignmentId", student_id AS "studentId", marks, grade, created_at AS "createdAt", updated_at AS "updatedAt"
    FROM assignment_grades
    WHERE ($1::int IS NULL OR assignment_id = $1::int)
      AND ($2::int IS NULL OR student_id = $2::int)
    ORDER BY updated_at DESC
  `, [assignmentId, studentId]);
  return result.rows;
};

export const updateGrades = async (assignmentId, payload = {}, user = {}) => {
  if (!payload.studentId) {
    const error = new Error("studentId is required");
    error.status = 400;
    throw error;
  }

  const result = await pool.query(`
    INSERT INTO assignment_grades (assignment_id, student_id, marks, grade)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (assignment_id, student_id) DO UPDATE SET
      marks = EXCLUDED.marks,
      grade = EXCLUDED.grade,
      updated_at = NOW()
    RETURNING id, assignment_id AS "assignmentId", student_id AS "studentId", marks, grade, created_at AS "createdAt", updated_at AS "updatedAt"
  `, [assignmentId, payload.studentId, payload.marks || 0, payload.grade || "N/A"]);
  return result.rows[0];
};

const gradeModel = { createGradeTable, getGrades, updateGrades };
export default gradeModel;
