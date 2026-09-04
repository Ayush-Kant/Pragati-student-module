BEGIN;

-- SM-07 reads assessments.description, but older develop databases did not
-- have this additive field. Keep existing assessment rows/data intact.
ALTER TABLE assessments
  ADD COLUMN IF NOT EXISTS description TEXT;

COMMIT;
