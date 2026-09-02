CREATE TABLE IF NOT EXISTS assessments (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL
    CHECK(type IN ('Technical', 'Behavioural', 'Aptitude', 'Design', 'MCQ', 'Coding', 'mcq', 'coding')),
  difficulty VARCHAR(20) NOT NULL
    CHECK(difficulty IN ('Easy', 'Medium', 'Hard', 'easy', 'medium', 'hard')),
  time_limit_minutes INTEGER NOT NULL,
  total_marks INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK(status IN ('draft', 'active', 'archived')),
  -- Retained for compatibility with the older minimal assessment contract.
  -- The canonical lifecycle uses `status` as the source of truth.
  archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_by INTEGER REFERENCES users(id),
  published_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessment_questions (
  id SERIAL PRIMARY KEY,
  assessment_id INTEGER NOT NULL
    REFERENCES assessments(id)
    ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL
    CHECK(type IN ('Technical', 'Behavioural', 'Aptitude', 'Design', 'MCQ', 'Coding', 'mcq', 'coding')),
  question_text TEXT,
  options JSONB,
  correct_option INTEGER,
  problem_statement TEXT,
  language_support TEXT[],
  sample_input TEXT,
  sample_output TEXT,
  hidden_test_cases JSONB,
  marks INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessment_assignments (
  id SERIAL PRIMARY KEY,
  assessment_id INTEGER NOT NULL
    REFERENCES assessments(id)
    ON DELETE CASCADE,
  drive_id INTEGER NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW()
);

-- The older minimal migration existed partly to attach the recruitment-drive
-- assessment reference. Keep that relationship here, after both tables exist.
DO $$ BEGIN
  ALTER TABLE recruitment_drives
    ADD CONSTRAINT recruitment_drives_assigned_test_fk
    FOREIGN KEY (assigned_test_id) REFERENCES assessments(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Compatibility seed data from the legacy minimal migration. Values are
-- normalized to the canonical schema while preserving the original records.
INSERT INTO assessments (title, type, difficulty, time_limit_minutes, total_marks)
VALUES
  ('MERN Stack Screening Test', 'MCQ', 'Medium', 45, 100),
  ('DSA Coding Round', 'Coding', 'Hard', 60, 100)
ON CONFLICT DO NOTHING;

-- Dummy course data retained from the legacy migration so assign-course has a
-- usable success-path record on a fresh database.
INSERT INTO courses (title, description, mentor_id)
SELECT 'MERN Full Stack Development', 'Covers MongoDB, Express, React, Node end to end.', m.id
FROM mentors m
LIMIT 1
ON CONFLICT DO NOTHING;

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_assessments_type ON assessments(type);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);
CREATE INDEX IF NOT EXISTS idx_assessments_difficulty ON assessments(difficulty);
CREATE INDEX IF NOT EXISTS idx_assessments_archived ON assessments(archived);
CREATE INDEX IF NOT EXISTS idx_questions_assessment ON assessment_questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_drive ON assessment_assignments(drive_id);
