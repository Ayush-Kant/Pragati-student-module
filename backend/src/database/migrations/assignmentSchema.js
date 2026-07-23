import { pool } from "../../../config/db.js";
import { assignmentSeedData, submissionSeedData, feedbackSeedData, gradeSeedData, deadlineSeedData } from "../seeders/assignmentSeedData.js";

const createAssignmentTablesQuery = `
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

  CREATE TABLE IF NOT EXISTS assignment_feedback (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL,
    remarks TEXT NOT NULL,
    grade VARCHAR(10) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (assignment_id, student_id)
  );

  CREATE TABLE IF NOT EXISTS assignment_grades (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL,
    score NUMERIC(5,2) NOT NULL CHECK (score >= 0),
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (assignment_id, student_id)
  );

  CREATE TABLE IF NOT EXISTS assignment_deadlines (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    due_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Closed', 'Pending')),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (assignment_id)
  );

  CREATE INDEX IF NOT EXISTS idx_assignments_student_id ON assignments(student_id);
  CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON assignments(due_date);
  CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment_id ON assignment_submissions(assignment_id);
  CREATE INDEX IF NOT EXISTS idx_assignment_submissions_student_id ON assignment_submissions(student_id);
  CREATE INDEX IF NOT EXISTS idx_assignment_feedback_assignment_id ON assignment_feedback(assignment_id);
  CREATE INDEX IF NOT EXISTS idx_assignment_grades_student_id ON assignment_grades(student_id);
  CREATE INDEX IF NOT EXISTS idx_assignment_deadlines_due_date ON assignment_deadlines(due_date);
`;

export const createAssignmentTables = async () => {
  await pool.query(createAssignmentTablesQuery);
};

export const seedAssignmentData = async () => {
  const assignmentCount = await pool.query("SELECT COUNT(*)::int AS count FROM assignments");
  if (assignmentCount.rows[0].count > 0) {
    return;
  }

  await pool.query(
    `
      INSERT INTO assignments (title, subject, description, due_date, total_marks, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT DO NOTHING
    `,
    [
      assignmentSeedData[0].title,
      assignmentSeedData[0].subject,
      assignmentSeedData[0].description,
      assignmentSeedData[0].dueDate,
      assignmentSeedData[0].totalMarks,
      assignmentSeedData[0].status,
    ]
  );

  const firstAssignmentResult = await pool.query(
    `SELECT id FROM assignments ORDER BY id ASC LIMIT 1`
  );
  const firstAssignment = firstAssignmentResult.rows[0]?.id;

  if (!firstAssignment) {
    return;
  }

  if (submissionSeedData.length > 0) {
    await pool.query(
      `INSERT INTO assignment_submissions (assignment_id, student_id, content, file_url, status, submitted_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (assignment_id, student_id) DO NOTHING`,
      [
        firstAssignment,
        submissionSeedData[0].studentId,
        submissionSeedData[0].content,
        submissionSeedData[0].fileUrl,
        submissionSeedData[0].status,
      ]
    );
  }

  if (feedbackSeedData.length > 0) {
    await pool.query(
      `INSERT INTO assignment_feedback (assignment_id, student_id, remarks, grade)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (assignment_id, student_id) DO NOTHING`,
      [firstAssignment, feedbackSeedData[0].studentId, feedbackSeedData[0].remarks, feedbackSeedData[0].grade]
    );
  }

  if (gradeSeedData.length > 0) {
    await pool.query(
      `INSERT INTO assignment_grades (assignment_id, student_id, score, remarks)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (assignment_id, student_id) DO NOTHING`,
      [firstAssignment, gradeSeedData[0].studentId, gradeSeedData[0].score, gradeSeedData[0].remarks]
    );
  }

  if (deadlineSeedData.length > 0) {
    await pool.query(
      `INSERT INTO assignment_deadlines (assignment_id, due_date, status)
       VALUES ($1, $2, $3)
       ON CONFLICT (assignment_id) DO NOTHING`,
      [firstAssignment, deadlineSeedData[0].dueDate, deadlineSeedData[0].status]
    );
  }
};

export const initializeAssignmentModule = async () => {
  await createAssignmentTables();
  await seedAssignmentData();
};

export default initializeAssignmentModule;
