-- 017_add_hiring_pipeline_fields.sql
-- Adds hiring pipeline fields to recruitment_drives, courses, projects, and student_drive_progress

-- recruitment_drives: readiness threshold (required_skills already exists from 005)
ALTER TABLE recruitment_drives ADD COLUMN IF NOT EXISTS minimum_readiness_score NUMERIC(5,2) DEFAULT 70.00;

-- GIN index on required_skills (safe to re-run)
CREATE INDEX IF NOT EXISTS idx_drives_required_skills ON recruitment_drives USING GIN(required_skills);

-- courses: hiring relevant flag
ALTER TABLE courses ADD COLUMN IF NOT EXISTS hiring_relevant BOOLEAN DEFAULT FALSE;

-- projects: create table if not exists, then add hiring_relevant
CREATE TABLE IF NOT EXISTS projects (
  id          SERIAL PRIMARY KEY,
  mentor_id   INTEGER NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  drive_id    INTEGER REFERENCES recruitment_drives(id) ON DELETE SET NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS hiring_relevant BOOLEAN DEFAULT FALSE;

-- student_drive_progress: mentor recommendation + shortlist flag
ALTER TABLE student_drive_progress ADD COLUMN IF NOT EXISTS mentor_recommendation TEXT;
ALTER TABLE student_drive_progress ADD COLUMN IF NOT EXISTS is_shortlisted BOOLEAN DEFAULT FALSE;
