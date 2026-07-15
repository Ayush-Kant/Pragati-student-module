import { pool } from "../../config/db.js";

const createDeadlineTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS assignment_deadlines (
      id SERIAL PRIMARY KEY,
      assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
      due_date DATE NOT NULL,
      reminder_date DATE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_assignment_deadlines_assignment_id ON assignment_deadlines (assignment_id)
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_assignment_deadlines_unique ON assignment_deadlines (assignment_id)
  `);
};

export const getDeadlines = async (query = {}) => {
  const result = await pool.query(`
    SELECT id, assignment_id AS "assignmentId", due_date AS "dueDate", reminder_date AS "reminderDate", created_at AS "createdAt", updated_at AS "updatedAt"
    FROM assignment_deadlines
    WHERE ($1::text IS NULL OR assignment_id = $1::int)
    ORDER BY due_date ASC
  `, [query.assignmentId || null]);
  return result.rows;
};

export const updateDeadline = async (assignmentId, payload = {}) => {
  const result = await pool.query(`
    INSERT INTO assignment_deadlines (assignment_id, due_date, reminder_date)
    VALUES ($1, $2, $3)
    ON CONFLICT (assignment_id) DO UPDATE SET
      due_date = EXCLUDED.due_date,
      reminder_date = EXCLUDED.reminder_date,
      updated_at = NOW()
    RETURNING id, assignment_id AS "assignmentId", due_date AS "dueDate", reminder_date AS "reminderDate", created_at AS "createdAt", updated_at AS "updatedAt"
  `, [assignmentId, payload.dueDate || null, payload.reminderDate || null]);
  return result.rows[0];
};

const deadlineModel = { createDeadlineTable, getDeadlines, updateDeadline };
export default deadlineModel;
