BEGIN;

-- SM-06 supports multiple submission attempts. The original student/assignment
-- uniqueness constraint allowed only one row, which conflicts with resubmission
-- and attempt_number support.
ALTER TABLE assignment_submissions
  DROP CONSTRAINT IF EXISTS assignment_submissions_assignment_id_student_id_key;

CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment_student_submitted_at
  ON assignment_submissions (assignment_id, student_id, submitted_at DESC);

COMMIT;
