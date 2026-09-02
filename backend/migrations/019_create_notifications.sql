-- 019_create_notifications.sql
-- Reconcile the newer user-scoped notification API with the legacy
-- student_auth_user_id notification table created earlier in the migration chain.
-- This migration is intentionally additive and safe to run after 004_create_notifications.sql.

-- Keep a reusable notification type definition for newer consumers. The existing
-- notifications.type column may remain VARCHAR on legacy databases; PostgreSQL
-- accepts the same string values without forcing a destructive type conversion.
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
    CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'alert');
  END IF;
END $$;

-- If notifications does not exist for any reason, create the reconciled shape.
CREATE TABLE IF NOT EXISTS notifications (
  id                    SERIAL PRIMARY KEY,
  student_auth_user_id  BIGINT REFERENCES auth_users(id) ON DELETE CASCADE,
  user_id               INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title                 VARCHAR(255) NOT NULL,
  message               TEXT NOT NULL,
  type                  VARCHAR(50) NOT NULL DEFAULT 'info',
  link_url              VARCHAR(255),
  is_read               BOOLEAN DEFAULT false,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- The earlier migration creates notifications with student_auth_user_id as NOT NULL.
-- The newer notification service writes against users.id, so the legacy owner must
-- be nullable to allow user-scoped notifications to be inserted independently.
ALTER TABLE notifications
  ALTER COLUMN student_auth_user_id DROP NOT NULL;

-- Add the newer ownership/link columns when the legacy table already exists.
ALTER TABLE notifications
  ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE notifications
  ADD COLUMN IF NOT EXISTS link_url VARCHAR(255);

-- Backfill the newer user_id whenever a legacy notification can be resolved through
-- users.auth_user_id. This keeps historical notification rows addressable by both APIs.
UPDATE notifications n
SET user_id = u.id
FROM users u
WHERE n.user_id IS NULL
  AND n.student_auth_user_id IS NOT NULL
  AND u.auth_user_id = n.student_auth_user_id;

-- Indexes used by the current notification service and legacy student notification API.
CREATE INDEX IF NOT EXISTS idx_notifications_user_id
  ON notifications(user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_is_read
  ON notifications(user_id, is_read);

CREATE INDEX IF NOT EXISTS idx_notifications_student_auth_user_id
  ON notifications(student_auth_user_id);
