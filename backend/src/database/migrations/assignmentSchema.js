import { pool } from "../../../config/db.js";
import { seedAssignments } from "../seedAssignments.js";
import {
  assignmentSeedData,
  submissionSeedData,
  feedbackSeedData,
  gradeSeedData,
  deadlineSeedData,
} from "../seeders/assignmentSeedData.js";

export const initializeAssignmentModule = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS assignments (
      id SERIAL PRIMARY KEY,
      student_id INTEGER,
      title VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      description TEXT,
      due_date DATE NOT NULL,
      total_marks INTEGER NOT NULL CHECK (total_marks > 0),
      status VARCHAR(50) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Closed', 'Pending')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS assignment_submissions (
      id SERIAL PRIMARY KEY,
      assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL,
      content TEXT,
      file_url TEXT,
      status VARCHAR(50) NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Pending', 'Late')),
      submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (assignment_id, student_id)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS assignment_feedback (
      id SERIAL PRIMARY KEY,
      assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL,
      remarks TEXT NOT NULL,
      grade VARCHAR(10) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (assignment_id, student_id)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS assignment_grades (
      id SERIAL PRIMARY KEY,
      assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL,
      score NUMERIC(5,2) NOT NULL CHECK (score >= 0),
      remarks TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (assignment_id, student_id)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS assignment_deadlines (
      id SERIAL PRIMARY KEY,
      assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
      due_date DATE NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Closed', 'Pending')),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (assignment_id)
    );
  `);

  await seedAssignments();

  const assignmentCount = await pool.query("SELECT COUNT(*)::int AS count FROM assignments");
  if (assignmentCount.rows[0].count === 0) {
    return;
  }

  const submissionCount = await pool.query("SELECT COUNT(*)::int AS count FROM assignment_submissions");
  if (submissionCount.rows[0].count === 0 && submissionSeedData.length > 0) {
    const firstAssignment = assignmentSeedData[0];
    await pool.query(
      `INSERT INTO assignment_submissions (assignment_id, student_id, content, file_url, status) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
      [1, submissionSeedData[0].studentId, submissionSeedData[0].content || null, submissionSeedData[0].fileUrl || null, submissionSeedData[0].status || "Submitted"]
    );
  }

  const feedbackCount = await pool.query("SELECT COUNT(*)::int AS count FROM assignment_feedback");
  if (feedbackCount.rows[0].count === 0 && feedbackSeedData.length > 0) {
    await pool.query(
      `INSERT INTO assignment_feedback (assignment_id, student_id, remarks, grade) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
      [1, feedbackSeedData[0].studentId, feedbackSeedData[0].remarks, feedbackSeedData[0].grade]
    );
  }

  const deadlineCount = await pool.query("SELECT COUNT(*)::int AS count FROM assignment_deadlines");
  if (deadlineCount.rows[0].count === 0 && deadlineSeedData.length > 0) {
    await pool.query(
      `INSERT INTO assignment_deadlines (assignment_id, due_date, status) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
      [1, deadlineSeedData[0].dueDate, deadlineSeedData[0].status || "Open"]
    );
  }

  const gradeCount = await pool.query("SELECT COUNT(*)::int AS count FROM assignment_grades");
  if (gradeCount.rows[0].count === 0 && gradeSeedData.length > 0) {
    await pool.query(
      `INSERT INTO assignment_grades (assignment_id, student_id, score, remarks) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
      [1, gradeSeedData[0].studentId, gradeSeedData[0].score, gradeSeedData[0].remarks || null]
    );
  }
};

export default initializeAssignmentModule;
