import { pool } from "../../config/db.js";

const createAssignmentsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS assignments (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      subject VARCHAR(100) NOT NULL,
      description TEXT,
      due_date DATE NOT NULL,
      total_marks INTEGER NOT NULL DEFAULT 100,
      status VARCHAR(50) NOT NULL DEFAULT 'Open',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_assignments_status_due_date ON assignments (status, due_date)
  `);
};

export const getAllAssignments = async (query = {}) => {
  const conditions = [];
  const values = [];

  if (query.status) {
    values.push(query.status);
    conditions.push(`status = $${values.length}`);
  }

  if (query.subject) {
    values.push(query.subject);
    conditions.push(`subject ILIKE $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const result = await pool.query(`
    SELECT id, title, subject, description, due_date AS "dueDate", total_marks AS "totalMarks", status, created_at AS "createdAt", updated_at AS "updatedAt"
    FROM assignments
    ${whereClause}
    ORDER BY due_date ASC
  `, values);

  return result.rows;
};

export const getAssignmentById = async (id) => {
  const result = await pool.query(`
    SELECT id, title, subject, description, due_date AS "dueDate", total_marks AS "totalMarks", status, created_at AS "createdAt", updated_at AS "updatedAt"
    FROM assignments
    WHERE id = $1
  `, [id]);

  return result.rows[0] || null;
};

export const seedAssignments = async () => {
  const existing = await pool.query("SELECT COUNT(*)::int AS count FROM assignments");
  if (existing.rows[0].count > 0) return;

  await pool.query(`
    INSERT INTO assignments (title, subject, description, due_date, total_marks, status)
    VALUES
      ('React Dashboard Project', 'Frontend Development', 'Build a responsive dashboard UI using React.', '2026-08-20', 100, 'Open'),
      ('Node.js REST API', 'Backend Development', 'Create a RESTful API with authentication.', '2026-08-25', 100, 'Open')
  `);
};

const assignmentModel = { createAssignmentsTable, getAllAssignments, getAssignmentById, seedAssignments };
export default assignmentModel;
