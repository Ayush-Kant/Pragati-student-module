-- 005_create_recruitment_drives.sql
-- Non-destructive: creates tables if missing, adds columns if the table
-- already exists in an older/incomplete shape. Never drops data.

-- TABLE: recruitment_drives
CREATE TABLE IF NOT EXISTS recruitment_drives (
  id                   SERIAL PRIMARY KEY,
  company_id           INTEGER NOT NULL REFERENCES companies(id),
  title                VARCHAR(255) NOT NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE recruitment_drives ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'active';
ALTER TABLE recruitment_drives ADD COLUMN IF NOT EXISTS current_stage VARCHAR(50) NOT NULL DEFAULT 'application';
ALTER TABLE recruitment_drives ADD COLUMN IF NOT EXISTS min_gpa NUMERIC(3,1);
ALTER TABLE recruitment_drives ADD COLUMN IF NOT EXISTS required_skills TEXT[];
ALTER TABLE recruitment_drives ADD COLUMN IF NOT EXISTS max_openings INTEGER NOT NULL DEFAULT 1;
ALTER TABLE recruitment_drives ADD COLUMN IF NOT EXISTS application_deadline TIMESTAMPTZ;
-- NOTE: assigned_test_id intentionally has no FK to assessments(id) — that table
-- does not exist yet on develop as of this PR. Add the FK constraint once the
-- assessments module lands: ALTER TABLE recruitment_drives ADD CONSTRAINT
-- recruitment_drives_assigned_test_fk FOREIGN KEY (assigned_test_id) REFERENCES assessments(id);
ALTER TABLE recruitment_drives ADD COLUMN IF NOT EXISTS assigned_test_id INTEGER;
ALTER TABLE recruitment_drives ADD COLUMN IF NOT EXISTS assigned_course_id INTEGER;
ALTER TABLE recruitment_drives ADD COLUMN IF NOT EXISTS mentor_id INTEGER REFERENCES users(id);
ALTER TABLE recruitment_drives ADD COLUMN IF NOT EXISTS frozen BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE recruitment_drives ADD COLUMN IF NOT EXISTS frozen_at TIMESTAMPTZ;
ALTER TABLE recruitment_drives ADD COLUMN IF NOT EXISTS frozen_by INTEGER REFERENCES users(id);
ALTER TABLE recruitment_drives ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id);
ALTER TABLE recruitment_drives ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Re-apply CHECK constraints safely (skip if they already exist)
DO $$ BEGIN
  ALTER TABLE recruitment_drives ADD CONSTRAINT recruitment_drives_status_check
    CHECK (status IN ('active', 'completed', 'frozen'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE recruitment_drives ADD CONSTRAINT recruitment_drives_stage_check
    CHECK (current_stage IN ('application', 'screening', 'training', 'shortlist', 'interviews', 'selection'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- TABLE: student_drive_progress
CREATE TABLE IF NOT EXISTS student_drive_progress (
  id                   SERIAL PRIMARY KEY,
  student_id           INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  drive_id             INTEGER NOT NULL REFERENCES recruitment_drives(id) ON DELETE CASCADE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE student_drive_progress ADD COLUMN IF NOT EXISTS current_stage VARCHAR(50) NOT NULL DEFAULT 'application';
ALTER TABLE student_drive_progress ADD COLUMN IF NOT EXISTS stage VARCHAR(50) NOT NULL DEFAULT 'applied';
ALTER TABLE student_drive_progress ADD COLUMN IF NOT EXISTS college_id INTEGER REFERENCES colleges(id) ON DELETE SET NULL;
ALTER TABLE student_drive_progress ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL;
ALTER TABLE student_drive_progress ADD COLUMN IF NOT EXISTS assessment_score NUMERIC(5,2);
ALTER TABLE student_drive_progress ADD COLUMN IF NOT EXISTS training_completion NUMERIC(5,2) DEFAULT 0.00;
ALTER TABLE student_drive_progress ADD COLUMN IF NOT EXISTS stage_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

DO $$ BEGIN
  ALTER TABLE student_drive_progress ADD CONSTRAINT student_drive_progress_stage_check
    CHECK (current_stage IN ('application', 'screening', 'training', 'shortlist', 'interviews', 'selection'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE student_drive_progress ADD CONSTRAINT student_drive_progress_unique
    UNIQUE (student_id, drive_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- INDEXES (safe to re-run)
CREATE INDEX IF NOT EXISTS idx_drives_status ON recruitment_drives(status);
CREATE INDEX IF NOT EXISTS idx_drives_company ON recruitment_drives(company_id);
CREATE INDEX IF NOT EXISTS idx_drives_stage ON recruitment_drives(current_stage);
CREATE INDEX IF NOT EXISTS idx_sdp_drive ON student_drive_progress(drive_id);
CREATE INDEX IF NOT EXISTS idx_sdp_student ON student_drive_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_sdp_stage ON student_drive_progress(current_stage);