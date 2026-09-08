BEGIN;

-- SM-07 uses the canonical students.id throughout the assessment service.
-- Some existing develop/local databases contain the older activity_submissions
-- table where student_id references users.id instead. This compatibility trigger
-- translates the canonical students.id to students.user_id only for that legacy
-- schema. Fresh databases created by 039 keep the canonical students.id FK and
-- therefore pass through unchanged.

CREATE OR REPLACE FUNCTION sm07_activity_submission_student_identity()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  referenced_table TEXT;
  mapped_user_id INTEGER;
BEGIN
  SELECT parent.relname
    INTO referenced_table
  FROM pg_constraint c
  JOIN pg_class child
    ON child.oid = c.conrelid
  JOIN pg_attribute local_column
    ON local_column.attrelid = c.conrelid
   AND local_column.attnum = ANY(c.conkey)
  JOIN pg_class parent
    ON parent.oid = c.confrelid
  JOIN pg_namespace parent_schema
    ON parent_schema.oid = parent.relnamespace
  WHERE child.oid = 'public.activity_submissions'::regclass
    AND c.contype = 'f'
    AND local_column.attname = 'student_id'
    AND parent_schema.nspname = 'public'
  LIMIT 1;

  IF referenced_table = 'users' THEN
    SELECT s.user_id
      INTO mapped_user_id
    FROM students s
    WHERE s.id = NEW.student_id
    LIMIT 1;

    IF mapped_user_id IS NULL THEN
      RAISE EXCEPTION 'Cannot map student profile id % to a users.id for activity submission', NEW.student_id
        USING ERRCODE = '23503';
    END IF;

    NEW.student_id := mapped_user_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sm07_activity_submission_student_identity
  ON activity_submissions;

CREATE TRIGGER trg_sm07_activity_submission_student_identity
BEFORE INSERT ON activity_submissions
FOR EACH ROW
EXECUTE FUNCTION sm07_activity_submission_student_identity();

COMMIT;
