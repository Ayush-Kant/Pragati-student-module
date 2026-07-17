-- 021_update_interviews_table.sql
-- Add missing fields (application_id, scheduled_at, interview_type) to interviews table

ALTER TABLE interviews ADD COLUMN IF NOT EXISTS application_id INTEGER REFERENCES student_drive_progress(id) ON DELETE CASCADE;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS interview_type VARCHAR(100);
