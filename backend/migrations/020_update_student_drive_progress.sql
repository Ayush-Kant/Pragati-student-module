-- 020_update_student_drive_progress.sql
-- Add candidate management fields (notes, feedback) to student_drive_progress if not present

ALTER TABLE student_drive_progress ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE student_drive_progress ADD COLUMN IF NOT EXISTS interview_feedback TEXT;
