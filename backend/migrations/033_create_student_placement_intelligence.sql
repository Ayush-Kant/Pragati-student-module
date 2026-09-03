-- Student placement intelligence foundation.
-- Adapted from student-team's placement module to the canonical PostgreSQL/Pool
-- architecture used by develop. No student-facing composite readiness score is
-- exposed by the API.

CREATE TABLE IF NOT EXISTS job_applications (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  job_title VARCHAR(255) NOT NULL,
  job_id VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'APPLIED',
  applied_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  history JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_job_applications_student_created
  ON job_applications(student_id, created_at DESC);

CREATE TABLE IF NOT EXISTS placement_interviews (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  application_id INTEGER REFERENCES job_applications(id) ON DELETE SET NULL,
  company_name VARCHAR(255) NOT NULL,
  job_title VARCHAR(255),
  date_time TIMESTAMPTZ NOT NULL,
  location VARCHAR(255) NOT NULL DEFAULT 'Online',
  type VARCHAR(50) NOT NULL DEFAULT 'TECHNICAL',
  status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
  feedback TEXT,
  score INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_placement_interviews_student_date
  ON placement_interviews(student_id, date_time);

CREATE TABLE IF NOT EXISTS placement_interview_rounds (
  id SERIAL PRIMARY KEY,
  interview_id INTEGER NOT NULL REFERENCES placement_interviews(id) ON DELETE CASCADE,
  round_name VARCHAR(255) NOT NULL,
  round_order INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  feedback TEXT,
  score INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skill_readiness (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  skill_name VARCHAR(255) NOT NULL,
  current_score INTEGER NOT NULL DEFAULT 0 CHECK (current_score BETWEEN 0 AND 100),
  target_score INTEGER NOT NULL DEFAULT 80 CHECK (target_score BETWEEN 0 AND 100),
  priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
  category VARCHAR(100) NOT NULL DEFAULT 'Technical',
  last_evaluated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_skill_readiness_student_skill
  ON skill_readiness(student_id, LOWER(skill_name));

CREATE TABLE IF NOT EXISTS career_recommendations (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
  reason TEXT NOT NULL,
  current_state VARCHAR(255),
  target_state VARCHAR(255),
  recommended_action TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_career_recommendations_student
  ON career_recommendations(student_id, created_at DESC);
