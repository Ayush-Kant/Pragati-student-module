-- SM-01: Student authentication sessions + Firebase identity + onboarding state.
-- Additive migration: existing authentication and student rows remain intact.

ALTER TABLE students
  ADD COLUMN IF NOT EXISTS firebase_uid VARCHAR(128),
  ADD COLUMN IF NOT EXISTS onboarding_step INTEGER NOT NULL DEFAULT 1
    CHECK (onboarding_step BETWEEN 1 AND 4);

CREATE UNIQUE INDEX IF NOT EXISTS idx_students_firebase_uid
  ON students(firebase_uid)
  WHERE firebase_uid IS NOT NULL;

CREATE TABLE IF NOT EXISTS student_sessions (
  id                  SERIAL PRIMARY KEY,
  student_id          INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  refresh_token_hash  CHAR(64) NOT NULL UNIQUE,
  expires_at          TIMESTAMPTZ NOT NULL,
  revoked_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at        TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_student_sessions_student
  ON student_sessions(student_id, expires_at DESC);

CREATE INDEX IF NOT EXISTS idx_student_sessions_active
  ON student_sessions(refresh_token_hash)
  WHERE revoked_at IS NULL;

-- Ensure a profile row exists for every existing student so onboarding can be resumed.
INSERT INTO student_profiles (student_id)
SELECT s.id
FROM students s
LEFT JOIN student_profiles p ON p.student_id = s.id
WHERE p.student_id IS NULL;
