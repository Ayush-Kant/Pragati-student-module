BEGIN;

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

CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment_student ON assignment_submissions(assignment_id, student_id);

COMMIT;
