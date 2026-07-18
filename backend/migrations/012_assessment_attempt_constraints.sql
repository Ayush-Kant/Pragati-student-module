-- =============================================================================
-- 012_assessment_attempt_constraints.sql
--
-- Additive-only migration — never drops data.
-- Adds the constraints and columns required for the student assessments module
-- to function correctly in production.
--
-- Applies:
--   1. grading_status column on assessment_submissions (required by UNNEST bulk INSERT)
--   2. score column type correction: INTEGER → NUMERIC(8,2) for decimal marks
--   3. unique partial index on assessment_attempts(student_id, assessment_id)
--      WHERE status = 'started'  — required for INSERT ON CONFLICT race-safety
--   4. composite index on assessment_attempts(student_id, assessment_id, status)
--      — used by getActiveAttempt and getAttempt on every submit request
--   5. composite index on student_drive_progress(student_id, drive_id)
--      — already exists as UNIQUE constraint, documented here for clarity
--   6. index on assessment_assignments(drive_id, assessment_id)
--      — join column used in every authorization check
-- =============================================================================

-- ─── 1. Add grading_status column to assessment_submissions ──────────────────
--
-- This column was assumed to exist by the repository's UNNEST bulk INSERT but
-- was never created in migration 011. Without this column every submission will
-- fail with: column "grading_status" of relation "assessment_submissions" does
-- not exist.
--
-- Values: 'graded' | 'pending_review' | 'not_attempted'

ALTER TABLE assessment_submissions
  ADD COLUMN IF NOT EXISTS grading_status VARCHAR(30) NOT NULL DEFAULT 'graded'
    CHECK (grading_status IN ('graded', 'pending_review', 'not_attempted'));

-- ─── 2. score column — allow decimal marks ───────────────────────────────────
--
-- Migration 011 defines score as INTEGER DEFAULT 0 but marks per question are
-- NUMERIC (from assessment_questions.marks INTEGER, however SUM can still
-- produce an integer). Changing to NUMERIC(8,2) is safe and forward-compatible.

ALTER TABLE assessment_attempts
  ALTER COLUMN score TYPE NUMERIC(8,2)
    USING score::NUMERIC(8,2);

-- ─── 3. Unique partial index — race-safety for INSERT ON CONFLICT ─────────────
--
-- The repository createAttempt() uses:
--   INSERT … ON CONFLICT (student_id, assessment_id) WHERE status = 'started' DO NOTHING
-- This ON CONFLICT clause requires a matching unique partial index.
-- Without it the ON CONFLICT clause is silently ignored, allowing duplicate
-- STARTED rows under concurrent /start requests.

CREATE UNIQUE INDEX IF NOT EXISTS idx_attempts_unique_started
  ON assessment_attempts(student_id, assessment_id)
  WHERE status = 'started';

-- ─── 4. Composite index — getActiveAttempt / getAttempt ──────────────────────
--
-- Both methods filter: student_id = $1 AND assessment_id = $2 AND status = $3
-- A composite index covering all three columns eliminates a full table scan
-- on every /submit request.

CREATE INDEX IF NOT EXISTS idx_attempts_student_assessment_status
  ON assessment_attempts(student_id, assessment_id, status);

-- ─── 5. Index on assessment_assignments join column ──────────────────────────
--
-- The authorization query joins assessment_assignments on drive_id AND
-- assessment_id. A composite index speeds every authorization middleware call.

CREATE INDEX IF NOT EXISTS idx_assignment_drive_assessment
  ON assessment_assignments(drive_id, assessment_id);

-- ─── 6. Index on students(user_id) ───────────────────────────────────────────
--
-- The authorization query resolves users.id → students.id via:
--   JOIN students s ON s.user_id = $1
-- Without an index this is a sequential scan on the students table for every
-- request.

CREATE INDEX IF NOT EXISTS idx_students_user_id
  ON students(user_id);
