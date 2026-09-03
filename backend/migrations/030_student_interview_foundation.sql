-- Student interview foundation reconciliation.
-- The historical interview migrations created the table in several stages but
-- never added the student/drive/title columns required by the current
-- student-facing interview API. This migration completes that schema additively.

ALTER TABLE interviews
  ADD COLUMN IF NOT EXISTS student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS drive_id INTEGER REFERENCES recruitment_drives(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS title VARCHAR(255);

-- Recover student/drive ownership for legacy interview rows whose
-- application_id points at student_drive_progress.
UPDATE interviews i
SET student_id = sdp.student_id,
    drive_id = sdp.drive_id
FROM student_drive_progress sdp
WHERE i.application_id = sdp.id
  AND (i.student_id IS NULL OR i.drive_id IS NULL);

-- Existing interview rows may not have a title. Keep the UI/API contract stable.
UPDATE interviews
SET title = COALESCE(NULLIF(title, ''), COALESCE(interview_type, 'Interview'))
WHERE title IS NULL OR title = '';

CREATE INDEX IF NOT EXISTS idx_interviews_student_id
  ON interviews(student_id, scheduled_at);

CREATE INDEX IF NOT EXISTS idx_interviews_drive_id
  ON interviews(drive_id, scheduled_at);
