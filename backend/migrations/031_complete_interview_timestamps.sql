-- Complete the shared interviews table with audit timestamps used by
-- the existing admin/mentor interview service and student-facing mutations.

ALTER TABLE interviews
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_interviews_updated_at
  ON interviews(updated_at DESC);
