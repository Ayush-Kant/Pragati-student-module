-- Student assessment attempt and answer persistence.
-- This extends the canonical assessments/assessment_questions tables without
-- introducing a second assessment domain.

CREATE TABLE IF NOT EXISTS student_assessment_attempts (
  id SERIAL PRIMARY KEY,
  assessment_id INTEGER NOT NULL
    REFERENCES assessments(id)
    ON DELETE CASCADE,
  student_id INTEGER NOT NULL
    REFERENCES students(id)
    ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(20) NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('in_progress', 'submitted', 'auto_submitted', 'expired')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  submitted_at TIMESTAMPTZ,
  score NUMERIC(8,2),
  total_marks NUMERIC(8,2),
  percentage NUMERIC(5,2),
  passed BOOLEAN,
  tab_switch_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (assessment_id, student_id, attempt_number)
);

CREATE INDEX IF NOT EXISTS idx_student_assessment_attempts_student
  ON student_assessment_attempts(student_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_student_assessment_attempts_assessment
  ON student_assessment_attempts(assessment_id, student_id, status);

CREATE TABLE IF NOT EXISTS student_assessment_attempt_questions (
  id SERIAL PRIMARY KEY,
  attempt_id INTEGER NOT NULL
    REFERENCES student_assessment_attempts(id)
    ON DELETE CASCADE,
  question_id INTEGER NOT NULL
    REFERENCES assessment_questions(id)
    ON DELETE CASCADE,
  question_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (attempt_id, question_id),
  UNIQUE (attempt_id, question_order)
);

CREATE INDEX IF NOT EXISTS idx_student_assessment_attempt_questions_attempt
  ON student_assessment_attempt_questions(attempt_id, question_order);

CREATE TABLE IF NOT EXISTS student_assessment_answers (
  id SERIAL PRIMARY KEY,
  attempt_id INTEGER NOT NULL
    REFERENCES student_assessment_attempts(id)
    ON DELETE CASCADE,
  question_id INTEGER NOT NULL
    REFERENCES assessment_questions(id)
    ON DELETE CASCADE,
  answer JSONB,
  is_correct BOOLEAN,
  marks_awarded NUMERIC(8,2) NOT NULL DEFAULT 0,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (attempt_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_student_assessment_answers_attempt
  ON student_assessment_answers(attempt_id);

CREATE INDEX IF NOT EXISTS idx_student_assessment_answers_question
  ON student_assessment_answers(question_id);

-- Server-side timestamps are the source of truth for timers. The attempt's
-- expires_at value is derived once at start and never trusted from the client.
