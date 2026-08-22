-- Migration: 023_update_quiz_attempts.sql
-- Purpose: Ensure quiz_attempts table contains `started_at`, make submission timestamp nullable
-- and ensure `status` default is compatible with 'in_progress'.
-- This migration is written defensively and will only change columns that exist.

BEGIN;

-- Add started_at column if it does not exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_attempts' AND column_name = 'started_at'
  ) THEN
    ALTER TABLE quiz_attempts
      ADD COLUMN started_at TIMESTAMPTZ;
  END IF;
END$$;

-- Make submitted_at (or completed_at) nullable if present
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_attempts' AND column_name = 'submitted_at'
  ) THEN
    ALTER TABLE quiz_attempts ALTER COLUMN submitted_at DROP NOT NULL;
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_attempts' AND column_name = 'completed_at'
  ) THEN
    ALTER TABLE quiz_attempts ALTER COLUMN completed_at DROP NOT NULL;
  END IF;
END$$;

-- Ensure status column default is set to 'in_progress' if status column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_attempts' AND column_name = 'status'
  ) THEN
    ALTER TABLE quiz_attempts ALTER COLUMN status SET DEFAULT 'in_progress';
  END IF;
END$$;

COMMIT;

-- Down migration: revert changes where reasonable
BEGIN;

DO $$
BEGIN
  -- Remove started_at if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_attempts' AND column_name = 'started_at'
  ) THEN
    ALTER TABLE quiz_attempts DROP COLUMN started_at;
  END IF;
END$$;

DO $$
BEGIN
  -- Revert submitted_at/completed_at to NOT NULL (best-effort)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_attempts' AND column_name = 'submitted_at'
  ) THEN
    ALTER TABLE quiz_attempts ALTER COLUMN submitted_at SET NOT NULL;
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_attempts' AND column_name = 'completed_at'
  ) THEN
    ALTER TABLE quiz_attempts ALTER COLUMN completed_at SET NOT NULL;
  END IF;
END$$;

DO $$
BEGIN
  -- Remove default on status column if present
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_attempts' AND column_name = 'status'
  ) THEN
    ALTER TABLE quiz_attempts ALTER COLUMN status DROP DEFAULT;
  END IF;
END$$;

COMMIT;
