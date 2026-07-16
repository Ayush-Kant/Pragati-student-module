-- ENUM: difficulty_level
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');

-- TABLE: question_bank
CREATE TABLE IF NOT EXISTS question_bank (
  id              SERIAL PRIMARY KEY,
  mentor_id       INTEGER NOT NULL REFERENCES mentors(id), -- Enforces authorization checks
  type            VARCHAR(50) NOT NULL CHECK (type IN ('mcq', 'multi_select', 'true_false', 'fill_blank', 'match_following')),
  difficulty      difficulty_level DEFAULT 'medium', -- Restricts input values safely
  body            TEXT NOT NULL,
  options_json    JSONB,
  correct_json    JSONB NOT NULL,
  time_limit_sec  INTEGER, -- Per-question timer
  is_deleted      BOOLEAN DEFAULT false, -- Soft delete
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: question_tags
CREATE TABLE IF NOT EXISTS question_tags (
  id              SERIAL PRIMARY KEY,
  question_id     INTEGER NOT NULL REFERENCES question_bank(id) ON DELETE CASCADE,
  tag_name        VARCHAR(100) NOT NULL
);

-- TABLE: assessment_question_bank (Junction for assessments & reusable questions)
CREATE TABLE IF NOT EXISTS assessment_question_bank (
  id              SERIAL PRIMARY KEY,
  assessment_id   INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_id     INTEGER NOT NULL REFERENCES question_bank(id) ON DELETE CASCADE,
  order_index     INTEGER DEFAULT 0,
  UNIQUE(assessment_id, question_id) -- Prevent duplicate questions
);

-- TABLE: quiz_attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id              SERIAL PRIMARY KEY,
  student_id      INTEGER NOT NULL REFERENCES users(id),
  assessment_id   INTEGER NOT NULL REFERENCES assessments(id),
  attempt_number  INTEGER NOT NULL,
  score           NUMERIC(6,2),
  responses_json  JSONB,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at    TIMESTAMPTZ,
  UNIQUE(student_id, assessment_id, attempt_number)
);

-- INDEXES
CREATE INDEX idx_question_bank_mentor_id ON question_bank(mentor_id);
CREATE INDEX idx_question_tags_name ON question_tags(tag_name);
CREATE INDEX idx_question_bank_type ON question_bank(type);
CREATE INDEX idx_quiz_attempts_student ON quiz_attempts(student_id, assessment_id);
