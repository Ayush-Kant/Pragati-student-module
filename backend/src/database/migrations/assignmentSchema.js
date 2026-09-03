import { pool } from '../../../config/db.js';
import { ASSIGNMENT_STATUS, SUBMISSION_STATUS } from '../../constants/assignmentConstants.js';

const createAssignmentTablesQuery = `
  CREATE TABLE IF NOT EXISTS assignments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    total_marks INTEGER NOT NULL CHECK (total_marks > 0),
    status VARCHAR(50) NOT NULL DEFAULT '${ASSIGNMENT_STATUS.OPEN}' CHECK (status IN ('${ASSIGNMENT_STATUS.OPEN}', '${ASSIGNMENT_STATUS.CLOSED}', '${ASSIGNMENT_STATUS.PENDING}')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS assignment_submissions (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL,
    content TEXT,
    file_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT '${SUBMISSION_STATUS.SUBMITTED}' CHECK (status IN ('${SUBMISSION_STATUS.SUBMITTED}', '${SUBMISSION_STATUS.PENDING}', '${SUBMISSION_STATUS.LATE}')),
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

  CREATE INDEX IF NOT EXISTS idx_assignments_student_id ON assignments(student_id);
  CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON assignments(due_date);
  CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment_id ON assignment_submissions(assignment_id);
  CREATE INDEX IF NOT EXISTS idx_assignment_submissions_student_id ON assignment_submissions(student_id);
  CREATE INDEX IF NOT EXISTS idx_assignment_feedback_assignment_id ON assignment_feedback(assignment_id);
  CREATE INDEX IF NOT EXISTS idx_assignment_grades_student_id ON assignment_grades(student_id);
`;

const seedDevelopmentAssignments = async () => {
  if (process.env.NODE_ENV === 'production') return;

  await pool.query(`
    INSERT INTO assignments (student_id, title, subject, description, due_date, total_marks, status)
    SELECT seed.student_id, seed.title, seed.subject, seed.description,
           seed.due_date::date, seed.total_marks, seed.status
    FROM (
      VALUES
        (NULL::integer, 'React Component Architecture', 'Frontend Engineering', 'Build a small React feature demonstrating reusable components, props, state management, and clean component boundaries.', CURRENT_DATE + 7, 100, '${ASSIGNMENT_STATUS.OPEN}'),
        (NULL::integer, 'PostgreSQL Query Optimization', 'Database Systems', 'Write and optimize SQL queries for a student dashboard. Explain the indexes and query choices used.', CURRENT_DATE + 14, 100, '${ASSIGNMENT_STATUS.OPEN}'),
        (NULL::integer, 'REST API Design Exercise', 'Backend Engineering', 'Design a REST API for assignment management with validation, authentication, authorization, and consistent error responses.', CURRENT_DATE + 2, 50, '${ASSIGNMENT_STATUS.PENDING}'),
        (NULL::integer, 'JavaScript Fundamentals Review', 'JavaScript', 'Complete a short review covering closures, promises, array transformations, asynchronous control flow, and error handling.', CURRENT_DATE - 2, 50, '${ASSIGNMENT_STATUS.OPEN}'),
        (NULL::integer, 'Placement Readiness Reflection', 'Career Development', 'Write a brief reflection on your current strengths, technical gaps, interview goals, and next steps.', CURRENT_DATE + 21, 25, '${ASSIGNMENT_STATUS.CLOSED}')
    ) AS seed(student_id, title, subject, description, due_date, total_marks, status)
    WHERE NOT EXISTS (
      SELECT 1
      FROM assignments existing
      WHERE existing.title = seed.title
        AND existing.student_id IS NULL
    );
  `);
};

export const createAssignmentTables = async () => {
  await pool.query(createAssignmentTablesQuery);
};

export const initializeAssignmentModule = async () => {
  await createAssignmentTables();
  await seedDevelopmentAssignments();
};

export default initializeAssignmentModule;
