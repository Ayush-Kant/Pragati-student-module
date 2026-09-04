BEGIN;

-- SM-08: complete the canonical coding-challenge lifecycle without creating
-- a second assessment domain.
ALTER TABLE assessments
  ADD COLUMN IF NOT EXISTS start_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS memory_limit_mb INTEGER NOT NULL DEFAULT 256;

ALTER TABLE challenge_submissions
  ADD COLUMN IF NOT EXISTS submission_type VARCHAR(20) NOT NULL DEFAULT 'final',
  ADD COLUMN IF NOT EXISTS is_final BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS solve_time_seconds INTEGER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'challenge_submissions'::regclass
      AND conname = 'chk_challenge_submission_type'
  ) THEN
    ALTER TABLE challenge_submissions
      ADD CONSTRAINT chk_challenge_submission_type
      CHECK (submission_type IN ('run', 'final'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_challenge_submissions_student_challenge_time
  ON challenge_submissions(student_id, challenge_id, submitted_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS ux_challenge_one_final_submission
  ON challenge_submissions(student_id, challenge_id)
  WHERE is_final = TRUE AND submission_type = 'final';

-- SM-09: milestone check-ins are first-class submissions, while the existing
-- project_submissions table remains the final-submission history.
CREATE TABLE IF NOT EXISTS project_milestone_submissions (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES student_projects(id) ON DELETE CASCADE,
  milestone_id INTEGER NOT NULL REFERENCES project_milestones(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  github_url VARCHAR(500) NOT NULL,
  deployed_url VARCHAR(500),
  progress_notes TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED',
  feedback TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, milestone_id)
);

CREATE INDEX IF NOT EXISTS idx_project_milestone_submissions_project
  ON project_milestone_submissions(project_id, milestone_id);

CREATE INDEX IF NOT EXISTS idx_project_milestone_submissions_student
  ON project_milestone_submissions(student_id, submitted_at DESC);

-- Keep the existing final-submission schema additive but expose an explicit
-- report MIME/size contract to application code when available.
ALTER TABLE project_submissions
  ADD COLUMN IF NOT EXISTS report_mime_type VARCHAR(100),
  ADD COLUMN IF NOT EXISTS report_size_bytes INTEGER;

COMMIT;
