-- ============================================================
-- Migration 021: Fix data redundancy in placement drives
-- - Add UNIQUE on drive_eligibility.drive_id to prevent
--   duplicate rows on every update (ON CONFLICT (drive_id))
-- - Add UNIQUE on interview_rounds (drive_id, round_order)
--   so the UPSERT in updatePlacementDrive works correctly
-- ============================================================

-- 1. Remove duplicate drive_eligibility rows (keep the latest per drive_id)
DELETE FROM drive_eligibility a
USING drive_eligibility b
WHERE a.id < b.id
  AND a.drive_id = b.drive_id;

-- 2. Add unique constraint on drive_id for eligibility upsert
ALTER TABLE drive_eligibility
ADD CONSTRAINT uq_drive_eligibility_drive
UNIQUE (drive_id);

-- 3. Remove any duplicate round_order entries before adding constraint
DELETE FROM interview_rounds a
USING interview_rounds b
WHERE a.id < b.id
  AND a.drive_id = b.drive_id
  AND a.round_order = b.round_order;

-- 4. Add unique constraint for rounds upsert
ALTER TABLE interview_rounds
ADD CONSTRAINT uq_interview_rounds_drive_order
UNIQUE (drive_id, round_order);
