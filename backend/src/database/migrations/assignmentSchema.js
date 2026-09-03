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
    submission_type VARCHAR(20) NOT NULL DEFAULT 'both',
    starter_file_url TEXT,
    grace_days INTEGER NOT NULL DEFAULT 0,
    penalty_per_day NUMERIC(5,2) NOT NULL DEFAULT 0,
    allow_resubmission BOOLEAN NOT NULL DEFAULT TRUE,
    max_resubmissions INTEGER NOT NULL DEFAULT 3,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  ALTER TABLE assignments
    ADD COLUMN IF NOT EXISTS submission_type VARCHAR(20) NOT NULL DEFAULT 'both',
    ADD COLUMN IF NOT EXISTS starter_file_url TEXT,
    ADD COLUMN IF NOT EXISTS grace_days INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS penalty_per_day NUMERIC(5,2) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS allow_resubmission BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS max_resubmissions INTEGER NOT NULL DEFAULT 3;
  CREATE TABLE IF NOT EXISTS assignment_submissions (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL,
    content TEXT,
    file_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT '${SUBMISSION_STATUS.SUBMITTED}' CHECK (status IN ('${SUBMISSION_STATUS.SUBMITTED}', '${SUBMISSION_STATUS.PENDING}', '${SUBMISSION_STATUS.LATE}')),
    submitted_file_name TEXT,
    submitted_file_type TEXT,
    late_days INTEGER NOT NULL DEFAULT 0,
    late_penalty NUMERIC(6,2) NOT NULL DEFAULT 0,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  ALTER TABLE assignment_submissions
    ADD COLUMN IF NOT EXISTS submitted_file_name TEXT,
    ADD COLUMN IF NOT EXISTS submitted_file_type TEXT,
    ADD COLUMN IF NOT EXISTS late_days INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS late_penalty NUMERIC(6,2) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS attempt_number INTEGER NOT NULL DEFAULT 1;
  CREATE TABLE IF NOT EXISTS assignment_feedback (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL,
    remarks TEXT NOT NULL,
    grade VARCHAR(10) NOT NULL,
    inline_comments JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (assignment_id, student_id)
  );
  ALTER TABLE assignment_feedback ADD COLUMN IF NOT EXISTS inline_comments JSONB;
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
  CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment_student_submitted_at ON assignment_submissions(assignment_id, student_id, submitted_at DESC);
  CREATE INDEX IF NOT EXISTS idx_assignment_feedback_assignment_id ON assignment_feedback(assignment_id);
  CREATE INDEX IF NOT EXISTS idx_assignment_grades_student_id ON assignment_grades(student_id);
`;

const seedDevelopmentAssignments = async () => {
  if (process.env.NODE_ENV === 'production') return;
  await pool.query(`
    INSERT INTO assignments (student_id, title, subject, description, due_date, total_marks, status, submission_type, grace_days, penalty_per_day, allow_resubmission, max_resubmissions)
    SELECT seed.student_id, seed.title, seed.subject, seed.description, seed.due_date::date, seed.total_marks, seed.status, seed.submission_type, seed.grace_days, seed.penalty_per_day, seed.allow_resubmission, seed.max_resubmissions
    FROM (VALUES
      (NULL::integer,'React Component Architecture','Frontend Engineering','Build a small React feature demonstrating reusable components, props, state management, and clean component boundaries.',CURRENT_DATE + 7,100,'${ASSIGNMENT_STATUS.OPEN}','both',0,10,TRUE,3),
      (NULL::integer,'PostgreSQL Query Optimization','Database Systems','Write and optimize SQL queries for a student dashboard. Explain the indexes and query choices used.',CURRENT_DATE + 14,100,'${ASSIGNMENT_STATUS.OPEN}','text',2,10,TRUE,3),
      (NULL::integer,'REST API Design Exercise','Backend Engineering','Design a REST API for assignment management with validation, authentication, authorization, and consistent error responses.',CURRENT_DATE + 2,50,'${ASSIGNMENT_STATUS.PENDING}','file',0,10,TRUE,2),
      (NULL::integer,'JavaScript Fundamentals Review','JavaScript','Complete a short review covering closures, promises, array transformations, asynchronous control flow, and error handling.',CURRENT_DATE - 2,50,'${ASSIGNMENT_STATUS.OPEN}','both',2,10,TRUE,3),
      (NULL::integer,'Placement Readiness Reflection','Career Development','Write a brief reflection on your current strengths, technical gaps, interview goals, and next steps.',CURRENT_DATE + 21,25,'${ASSIGNMENT_STATUS.CLOSED}','text',0,0,FALSE,0)
    ) AS seed(student_id,title,subject,description,due_date,total_marks,status,submission_type,grace_days,penalty_per_day,allow_resubmission,max_resubmissions)
    WHERE NOT EXISTS (SELECT 1 FROM assignments existing WHERE existing.title = seed.title AND existing.student_id IS NULL);
  `);
};

export const createAssignmentTables = async () => { await pool.query(createAssignmentTablesQuery); };
export const initializeAssignmentModule = async () => { await createAssignmentTables(); await seedDevelopmentAssignments(); };
export default initializeAssignmentModule;
