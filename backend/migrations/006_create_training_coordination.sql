-- ============================================================
-- TRAININGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS trainings (
  training_id VARCHAR(255) PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration INT NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  mentor_id INTEGER REFERENCES mentors(id) ON DELETE SET NULL,
  curriculum JSONB,
  status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'PAUSED', 'CANCELLED')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_training_company ON trainings(company_id);
CREATE INDEX IF NOT EXISTS idx_training_status ON trainings(status);
CREATE INDEX IF NOT EXISTS idx_training_mentor ON trainings(mentor_id);

-- ============================================================
-- TRAINING_PROGRESS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS training_progress (
  progress_id VARCHAR(255) PRIMARY KEY,
  training_id VARCHAR(255) NOT NULL REFERENCES trainings(training_id) ON DELETE CASCADE,
  candidate_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  attendance INT DEFAULT 0,
  assignment_score INT,
  engagement_score DOUBLE PRECISION DEFAULT 0.0,
  performance_rating INT,
  readiness_score INT DEFAULT 0,
  completion_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'ENROLLED' CHECK (status IN ('ENROLLED', 'IN_PROGRESS', 'COMPLETED', 'DROPPED')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_progress_training ON training_progress(training_id);
CREATE INDEX IF NOT EXISTS idx_progress_candidate ON training_progress(candidate_id);
CREATE INDEX IF NOT EXISTS idx_progress_status ON training_progress(status);

-- ============================================================
-- MENTOR_FEEDBACK TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS mentor_feedback (
  feedback_id VARCHAR(255) PRIMARY KEY,
  training_id VARCHAR(255) NOT NULL REFERENCES trainings(training_id) ON DELETE CASCADE,
  mentor_id INTEGER NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  candidate_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  feedback TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_training ON mentor_feedback(training_id);
