-- Student account identity integrity
--
-- students.user_id is the canonical relationship to the authenticated users
-- table. Backfill safe legacy rows by matching the stable email identity and
-- enforce one student profile per user.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

UPDATE students s
SET user_id = u.id,
    updated_at = COALESCE(s.updated_at, NOW())
FROM users u
WHERE s.user_id IS NULL
  AND LOWER(s.email) = LOWER(u.email);

CREATE UNIQUE INDEX IF NOT EXISTS uq_students_user_id
  ON students(user_id)
  WHERE user_id IS NOT NULL;

-- Deterministic development student account for a fresh local database.
-- Credentials: student@demo.edu / Student@123
DO $$
DECLARE
  demo_auth_user_id INTEGER;
  demo_user_id INTEGER;
  demo_student_id INTEGER;
BEGIN
  SELECT au.id
  INTO demo_auth_user_id
  FROM auth_users au
  WHERE LOWER(au.email) = 'student@demo.edu'
  LIMIT 1;

  IF demo_auth_user_id IS NULL THEN
    INSERT INTO auth_users (email, password_hash, role, uuid_id)
    VALUES (
      'student@demo.edu',
      crypt('Student@123', gen_salt('bf')),
      'student',
      gen_random_uuid()
    )
    RETURNING id INTO demo_auth_user_id;
  ELSE
    UPDATE auth_users
    SET role = 'student',
        password_hash = crypt('Student@123', gen_salt('bf'))
    WHERE id = demo_auth_user_id;
  END IF;

  SELECT u.id
  INTO demo_user_id
  FROM users u
  WHERE u.auth_user_id = demo_auth_user_id
  LIMIT 1;

  IF demo_user_id IS NULL THEN
    INSERT INTO users (auth_user_id, email, role, created_at, phone, username)
    VALUES (
      demo_auth_user_id,
      'student@demo.edu',
      'student',
      NOW(),
      NULL,
      'student'
    )
    RETURNING id INTO demo_user_id;
  ELSE
    UPDATE users
    SET email = 'student@demo.edu',
        role = 'student',
        username = COALESCE(username, 'student')
    WHERE id = demo_user_id;
  END IF;

  SELECT s.id
  INTO demo_student_id
  FROM students s
  WHERE LOWER(s.email) = 'rahul@test.com'
    AND (s.user_id IS NULL OR s.user_id = demo_user_id)
  LIMIT 1;

  IF demo_student_id IS NULL THEN
    SELECT s.id
    INTO demo_student_id
    FROM students s
    WHERE LOWER(s.email) = 'student@demo.edu'
      AND (s.user_id IS NULL OR s.user_id = demo_user_id)
    LIMIT 1;
  END IF;

  IF demo_student_id IS NULL THEN
    INSERT INTO students (user_id, name, email, status)
    VALUES (demo_user_id, 'Demo Student', 'student@demo.edu', 'pending');
  ELSE
    UPDATE students
    SET user_id = demo_user_id,
        email = CASE
          WHEN LOWER(email) = 'rahul@test.com' THEN 'student@demo.edu'
          ELSE email
        END,
        updated_at = NOW()
    WHERE id = demo_student_id;
  END IF;
END $$;
