-- TABLE: coding_test_cases
CREATE TABLE IF NOT EXISTS coding_test_cases (
  id              SERIAL PRIMARY KEY,
  challenge_id    INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  input           TEXT NOT NULL,
  expected_output TEXT NOT NULL,
  is_hidden       BOOLEAN DEFAULT true,
  weight_pct      NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  time_limit_ms   INTEGER DEFAULT 2000,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: coding_languages (Lookup table for allowed languages per challenge)
CREATE TABLE IF NOT EXISTS coding_languages (
  id              SERIAL PRIMARY KEY,
  challenge_id    INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  language_id     INTEGER NOT NULL,
  language_name   VARCHAR(50) NOT NULL
);

-- TABLE: challenge_submissions (Tracks Judge0 execution and partial scoring)
CREATE TABLE IF NOT EXISTS challenge_submissions (
  id                SERIAL PRIMARY KEY,
  student_id        INTEGER NOT NULL REFERENCES users(id),
  challenge_id      INTEGER NOT NULL REFERENCES assessments(id),
  language_id       INTEGER NOT NULL,
  source_code       TEXT NOT NULL,
  total_score       NUMERIC(6,2) DEFAULT 0.00,
  execution_time_ms INTEGER,
  judge0_verdict    VARCHAR(100),
  passed_test_cases INTEGER DEFAULT 0,
  total_test_cases  INTEGER DEFAULT 0,
  submitted_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_coding_test_cases_challenge_id ON coding_test_cases(challenge_id);
CREATE INDEX idx_challenge_submissions_student_challenge ON challenge_submissions(student_id, challenge_id);
