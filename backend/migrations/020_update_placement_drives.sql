-- Add new columns to placement_drives
ALTER TABLE placement_drives ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE placement_drives ADD COLUMN IF NOT EXISTS hiring_process TEXT;

-- Add unique constraint for round upsert logic
ALTER TABLE interview_rounds DROP CONSTRAINT IF EXISTS unique_drive_round_order;
ALTER TABLE interview_rounds ADD CONSTRAINT unique_drive_round_order UNIQUE (drive_id, round_order);
