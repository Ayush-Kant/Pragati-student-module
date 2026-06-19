-- 005_create_recruitment_drives.sql (corrected)
-- Drops the existing empty/incompatible tables first, then creates the correct ones.
-- Safe because both tables currently have 0 rows (confirmed before running this).

ALTER TABLE users ADD COLUMN IF NOT EXISTS firebase_uid VARCHAR(128) UNIQUE;

-- TABLE: recruitment_drives
CREATE TABLE recruitment_drives (
  id                   SERIAL PRIMARY KEY,
  company_id           INTEGER NOT NULL REFERENCES companies(id),
  title                VARCHAR(255) NOT NULL,
  status               VARCHAR(50) NOT NULL DEFAULT 'active'
                       CHECK (status IN ('active', 'completed', 'frozen')),
  current_stage        VARCHAR(50) NOT NULL DEFAULT 'application'
                       CHECK (current_stage IN (
                         'application', 'screening', 'training',
                         'shortlist', 'interviews', 'selection'
                       )),
  min_gpa              NUMERIC(3,1),
  required_skills      TEXT[],
  max_openings         INTEGER NOT NULL,
  application_deadline TIMESTAMPTZ,
  assigned_test_id INTEGER REFERENCES assessments(id),
  assigned_course_id   INTEGER REFERENCES courses(id),
  frozen               BOOLEAN NOT NULL DEFAULT FALSE,
  frozen_at            TIMESTAMPTZ,
  frozen_by            INTEGER REFERENCES users(id),
  created_by           INTEGER REFERENCES users(id),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: student_drive_progress
CREATE TABLE student_drive_progress (
  id                   SERIAL PRIMARY KEY,
  student_id           INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  drive_id             INTEGER NOT NULL REFERENCES recruitment_drives(id) ON DELETE CASCADE,
  current_stage        VARCHAR(50) NOT NULL DEFAULT 'application'
                       CHECK (current_stage IN (
                         'application', 'screening', 'training',
                         'shortlist', 'interviews', 'selection'
                       )),
  assessment_score     NUMERIC(5,2),
  training_completion  NUMERIC(5,2) DEFAULT 0.00,
  stage_updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, drive_id)
);

-- INDEXES
CREATE INDEX idx_drives_status        ON recruitment_drives(status);
CREATE INDEX idx_drives_company       ON recruitment_drives(company_id);
CREATE INDEX idx_drives_stage         ON recruitment_drives(current_stage);
CREATE INDEX idx_sdp_drive            ON student_drive_progress(drive_id);
CREATE INDEX idx_sdp_student          ON student_drive_progress(student_id);
CREATE INDEX idx_sdp_stage            ON student_drive_progress(current_stage);