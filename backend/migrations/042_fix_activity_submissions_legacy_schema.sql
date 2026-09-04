BEGIN;

-- Existing develop databases may already have an older activity_submissions
-- table used by the placement/activity APIs. Migration 039 only created the
-- modern shape when the table was absent, so those older tables can be missing
-- the columns required by the student-assessment submission lifecycle.
-- Keep this migration non-destructive: never drop or rewrite existing rows.

ALTER TABLE activity_submissions
  ADD COLUMN IF NOT EXISTS student_id INTEGER,
  ADD COLUMN IF NOT EXISTS assessment_id INTEGER,
  ADD COLUMN IF NOT EXISTS attempt_id INTEGER,
  ADD COLUMN IF NOT EXISTS activity_type VARCHAR(50) DEFAULT 'assessment',
  ADD COLUMN IF NOT EXISTS score NUMERIC(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_marks NUMERIC(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS percentage NUMERIC(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'submitted',
  ADD COLUMN IF NOT EXISTS time_taken_seconds INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tab_switch_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Legacy placement/activity schemas may require drive_id and activity_title.
-- Assessment submissions do not have those legacy concepts, so relax only the
-- NOT NULL requirement when those optional legacy columns exist. This preserves
-- all existing values and allows the canonical assessment writer to coexist with
-- the older activity APIs.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'activity_submissions'
      AND column_name = 'drive_id'
  ) THEN
    ALTER TABLE activity_submissions ALTER COLUMN drive_id DROP NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'activity_submissions'
      AND column_name = 'activity_title'
  ) THEN
    ALTER TABLE activity_submissions ALTER COLUMN activity_title DROP NOT NULL;
  END IF;
END $$;

-- The assessment submission service uses ON CONFLICT (attempt_id). A regular
-- UNIQUE constraint is intentional here: PostgreSQL permits multiple NULLs,
-- so historical legacy rows can remain unlinked while every new assessment
-- attempt gets exactly one activity submission.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'activity_submissions'::regclass
      AND conname = 'uq_activity_submissions_attempt_id'
  ) THEN
    ALTER TABLE activity_submissions
      ADD CONSTRAINT uq_activity_submissions_attempt_id UNIQUE (attempt_id);
  END IF;
END $$;

-- Only add the FK when it does not already exist. Existing legacy rows have
-- NULL attempt_id after the additive column creation, so this does not disturb
-- historical activity submissions.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'activity_submissions'::regclass
      AND conname = 'fk_activity_submissions_attempt_id'
  ) THEN
    ALTER TABLE activity_submissions
      ADD CONSTRAINT fk_activity_submissions_attempt_id
      FOREIGN KEY (attempt_id)
      REFERENCES student_assessment_attempts(id)
      ON DELETE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_sm07_activity_submissions_attempt
  ON activity_submissions(attempt_id);

COMMIT;
