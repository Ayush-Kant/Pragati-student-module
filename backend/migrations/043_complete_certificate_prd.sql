BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- SM-13 certificate completion layer. This migration is intentionally additive:
-- existing certificate identifiers, URLs and rows remain valid.
ALTER TABLE recruitment_drives
  ADD COLUMN IF NOT EXISTS certificate_min_score NUMERIC(5,2) NOT NULL DEFAULT 70,
  ADD COLUMN IF NOT EXISTS certificate_min_attendance NUMERIC(5,2) NOT NULL DEFAULT 60,
  ADD COLUMN IF NOT EXISTS skill_domain VARCHAR(255);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'recruitment_drives'::regclass
      AND conname = 'chk_recruitment_drives_certificate_min_score'
  ) THEN
    ALTER TABLE recruitment_drives
      ADD CONSTRAINT chk_recruitment_drives_certificate_min_score
      CHECK (certificate_min_score BETWEEN 0 AND 100);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'recruitment_drives'::regclass
      AND conname = 'chk_recruitment_drives_certificate_min_attendance'
  ) THEN
    ALTER TABLE recruitment_drives
      ADD CONSTRAINT chk_recruitment_drives_certificate_min_attendance
      CHECK (certificate_min_attendance BETWEEN 0 AND 100);
  END IF;
END $$;

ALTER TABLE live_sessions
  ADD COLUMN IF NOT EXISTS drive_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_live_sessions_drive_id_certificate
  ON live_sessions(drive_id);

-- Existing student_progress stores the composite score under readiness_score.
-- Add the PRD field name as a generated compatibility column for certificate
-- evaluation. Existing writers continue to write readiness_score unchanged.
ALTER TABLE student_progress
  ADD COLUMN IF NOT EXISTS overall_score NUMERIC(5,2)
  GENERATED ALWAYS AS (COALESCE(readiness_score, 0)) STORED,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE certificates
  ALTER COLUMN certificate_url TYPE TEXT,
  ADD COLUMN IF NOT EXISTS verification_code VARCHAR(32),
  ADD COLUMN IF NOT EXISTS storage_key TEXT,
  ADD COLUMN IF NOT EXISTS storage_provider VARCHAR(30) NOT NULL DEFAULT 'local',
  ADD COLUMN IF NOT EXISTS student_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS college_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS drive_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS company_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS skill_domain VARCHAR(255);

CREATE UNIQUE INDEX IF NOT EXISTS uq_certificates_verification_code
  ON certificates(verification_code)
  WHERE verification_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_certificates_storage_key
  ON certificates(storage_key);

-- Backfill immutable certificate display snapshots from the related records.
-- Use correlated scalar subqueries so the outer certificate row can be referenced
-- safely in every lookup branch on PostgreSQL.
UPDATE certificates c
SET student_name = COALESCE(
      c.student_name,
      (SELECT u.full_name FROM users u WHERE u.id = c.student_id LIMIT 1),
      (SELECT s.full_name FROM students s WHERE s.user_id = c.student_id LIMIT 1),
      (SELECT s.name FROM students s WHERE s.user_id = c.student_id LIMIT 1)
    ),
    college_name = COALESCE(
      c.college_name,
      (
        SELECT co.name
        FROM colleges co
        JOIN students s ON s.college_id = co.id
        WHERE s.user_id = c.student_id
        LIMIT 1
      ),
      (SELECT s.college FROM students s WHERE s.user_id = c.student_id LIMIT 1)
    ),
    drive_name = COALESCE(
      c.drive_name,
      (SELECT d.title FROM recruitment_drives d WHERE d.id = c.drive_id LIMIT 1)
    ),
    company_name = COALESCE(
      c.company_name,
      (
        SELECT comp.name
        FROM companies comp
        JOIN recruitment_drives d ON d.company_id = comp.id
        WHERE d.id = c.drive_id
        LIMIT 1
      )
    ),
    skill_domain = COALESCE(
      c.skill_domain,
      (SELECT d.skill_domain FROM recruitment_drives d WHERE d.id = c.drive_id LIMIT 1),
      (
        SELECT d.job_title
        FROM recruitment_drives d
        WHERE d.id = c.drive_id
          AND NULLIF(d.job_title, '') IS NOT NULL
        LIMIT 1
      )
    )
WHERE c.student_id IS NOT NULL
  AND c.drive_id IS NOT NULL;

DO $$
DECLARE
  rec RECORD;
  candidate TEXT;
BEGIN
  FOR rec IN
    SELECT id, issued_at
    FROM certificates
    WHERE verification_code IS NULL
    ORDER BY id
  LOOP
    LOOP
      candidate := 'PRAG-' ||
                   TO_CHAR(COALESCE(rec.issued_at, NOW()), 'YYYY') || '-' ||
                   UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 4)) || '-' ||
                   LPAD((FLOOR(RANDOM() * 10000))::INTEGER::TEXT, 4, '0');
      EXIT WHEN NOT EXISTS (
        SELECT 1 FROM certificates WHERE verification_code = candidate
      );
    END LOOP;

    UPDATE certificates
    SET verification_code = candidate
    WHERE id = rec.id;
  END LOOP;
END $$;

UPDATE certificates
SET storage_key = CASE
    WHEN storage_key IS NULL AND certificate_url IS NOT NULL
      THEN REGEXP_REPLACE(certificate_url, '^/+', '')
    ELSE storage_key
  END
WHERE storage_key IS NULL;

INSERT INTO session_attendance (student_id, session_id, attended)
SELECT s.user_id, ls.id, FALSE
FROM student_drive_progress sdp
JOIN students s ON s.id = sdp.student_id
JOIN live_sessions ls ON ls.drive_id = sdp.drive_id
WHERE s.user_id IS NOT NULL
ON CONFLICT (student_id, session_id) DO NOTHING;

CREATE OR REPLACE FUNCTION seed_certificate_attendance_for_session()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.drive_id IS NOT NULL THEN
    INSERT INTO session_attendance (student_id, session_id, attended)
    SELECT s.user_id, NEW.id, FALSE
    FROM student_drive_progress sdp
    JOIN students s ON s.id = sdp.student_id
    WHERE sdp.drive_id = NEW.drive_id
      AND s.user_id IS NOT NULL
    ON CONFLICT (student_id, session_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION seed_certificate_attendance_for_student_drive()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO session_attendance (student_id, session_id, attended)
  SELECT s.user_id, ls.id, FALSE
  FROM students s
  JOIN live_sessions ls ON ls.drive_id = NEW.drive_id
  WHERE s.id = NEW.student_id
    AND s.user_id IS NOT NULL
  ON CONFLICT (student_id, session_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_seed_certificate_attendance_for_session ON live_sessions;
CREATE TRIGGER trg_seed_certificate_attendance_for_session
AFTER INSERT ON live_sessions
FOR EACH ROW
EXECUTE FUNCTION seed_certificate_attendance_for_session();

DROP TRIGGER IF EXISTS trg_seed_certificate_attendance_for_student_drive ON student_drive_progress;
CREATE TRIGGER trg_seed_certificate_attendance_for_student_drive
AFTER INSERT ON student_drive_progress
FOR EACH ROW
EXECUTE FUNCTION seed_certificate_attendance_for_student_drive();

COMMIT;
