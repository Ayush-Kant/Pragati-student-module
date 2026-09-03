BEGIN;

-- Assignment tables were previously initialized only by the runtime schema module.
-- This migration must be self-contained because the fresh migration runner rebuilds
-- the database from SQL migrations alone.
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

ALTER TABLE assignments
  ADD COLUMN IF NOT EXISTS submission_type VARCHAR(20) NOT NULL DEFAULT 'both',
  ADD COLUMN IF NOT EXISTS starter_file_url TEXT,
  ADD COLUMN IF NOT EXISTS grace_days INTEGER NOT NULL DEFAULT 0 CHECK (grace_days >= 0),
  ADD COLUMN IF NOT EXISTS penalty_per_day NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (penalty_per_day >= 0),
  ADD COLUMN IF NOT EXISTS allow_resubmission BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS max_resubmissions INTEGER NOT NULL DEFAULT 3 CHECK (max_resubmissions >= 0);

ALTER TABLE assignment_submissions
  ADD COLUMN IF NOT EXISTS submitted_file_name TEXT,
  ADD COLUMN IF NOT EXISTS submitted_file_type TEXT,
  ADD COLUMN IF NOT EXISTS late_days INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS late_penalty NUMERIC(6,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS attempt_number INTEGER NOT NULL DEFAULT 1;

ALTER TABLE assignment_feedback
  ADD COLUMN IF NOT EXISTS inline_comments JSONB;

CREATE INDEX IF NOT EXISTS idx_assignments_student_id ON assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment_id ON assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_student_id ON assignment_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment_student ON assignment_submissions(assignment_id, student_id);
CREATE INDEX IF NOT EXISTS idx_assignment_feedback_assignment_id ON assignment_feedback(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_grades_student_id ON assignment_grades(student_id);

COMMIT;
