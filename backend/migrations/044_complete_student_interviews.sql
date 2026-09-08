-- Complete the student interview lifecycle contract without replacing the
-- existing integer-based interviews architecture.
ALTER TABLE interviews
  ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS outcome_published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS offer_letter_url TEXT;

UPDATE interviews
SET outcome_published_at = COALESCE(outcome_published_at, updated_at, created_at, NOW())
WHERE outcome_published_at IS NULL
  AND LOWER(COALESCE(status, '')) IN ('completed', 'no_show')
  AND result IS NOT NULL
  AND UPPER(result) <> 'PENDING';

CREATE INDEX IF NOT EXISTS idx_interviews_outcome_published_at
  ON interviews(outcome_published_at DESC);
