CREATE TABLE IF NOT EXISTS assessments (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL
    CHECK(type IN ('MCQ', 'Coding')),
  difficulty VARCHAR(20) NOT NULL
    CHECK(difficulty IN ('Easy', 'Medium', 'Hard')),
  time_limit_minutes INTEGER NOT NULL,
  total_marks INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK(status IN ('draft', 'active', 'archived')),
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
    CHECK(type IN ('MCQ', 'Coding')),
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

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_assessments_type ON assessments(type);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);
CREATE INDEX IF NOT EXISTS idx_assessments_difficulty ON assessments(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_assessment ON assessment_questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_drive ON assessment_assignments(drive_id);
