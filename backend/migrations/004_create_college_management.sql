-- Assumes these tables already exist (created by earlier interns):
--   users, recruitment_drives, student_drive_progress
 
-- TABLE: colleges
CREATE TABLE IF NOT EXISTS colleges (
  id               SERIAL PRIMARY KEY,
  name             VARCHAR(255) NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE colleges ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth_users(uuid_id);
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS profile_code VARCHAR(100);
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS established INTEGER;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS category VARCHAR(255);
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS contact_person VARCHAR(255);
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS designation VARCHAR(255);
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS contact_lead VARCHAR(255);
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS website VARCHAR(255);
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS learners_guided INTEGER DEFAULT 0;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS about TEXT;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS departments TEXT[];
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS student_strength INTEGER DEFAULT 0;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'pending';
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS suspension_reason TEXT;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;

DO $$ BEGIN
  ALTER TABLE colleges ADD CONSTRAINT colleges_status_check
    CHECK (status IN ('pending','approved','rejected','suspended'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

 
-- TABLE: college_stats
-- Aggregated performance data per college
CREATE TABLE IF NOT EXISTS college_stats (
  id                      SERIAL PRIMARY KEY,
  college_id              INTEGER NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  total_students_enrolled INTEGER NOT NULL DEFAULT 0,
  total_selected          INTEGER NOT NULL DEFAULT 0,
  active_drive_count      INTEGER NOT NULL DEFAULT 0,
  participation_rate      NUMERIC(5,2) DEFAULT 0.00,  -- % of students in active drives
  selection_rate          NUMERIC(5,2) DEFAULT 0.00,  -- % of enrolled who got selected
  performance_rank        INTEGER,
  last_updated            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(college_id)
);
 
-- INDEXES
CREATE INDEX idx_colleges_status     ON colleges(status);
CREATE INDEX idx_colleges_name       ON colleges(name);
CREATE INDEX idx_college_stats_rank  ON college_stats(performance_rank ASC NULLS LAST);
CREATE INDEX idx_colleges_dept       ON colleges USING GIN(departments);
