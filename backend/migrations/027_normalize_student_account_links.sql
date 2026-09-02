-- Student account identity integrity
--
-- students.user_id is the canonical relationship to the authenticated users
-- table. Backfill safe legacy rows by matching the stable email identity and
-- enforce one student profile per user.

UPDATE students s
SET user_id = u.id,
    updated_at = COALESCE(s.updated_at, NOW())
FROM users u
WHERE s.user_id IS NULL
  AND LOWER(s.email) = LOWER(u.email);

CREATE UNIQUE INDEX IF NOT EXISTS uq_students_user_id
  ON students(user_id)
  WHERE user_id IS NOT NULL;
