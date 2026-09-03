-- Student notification delivery preferences and browser push subscriptions.
-- Keeps the existing notifications table intact while adding the per-event
-- channel controls and device-level Web Push registration required by SM-12.

CREATE TABLE IF NOT EXISTS notification_preferences (
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  notification_type VARCHAR(64) NOT NULL,
  in_app BOOLEAN NOT NULL DEFAULT TRUE,
  email BOOLEAN NOT NULL DEFAULT FALSE,
  push BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (student_id, notification_type)
);

CREATE INDEX IF NOT EXISTS idx_notification_preferences_student
  ON notification_preferences(student_id);

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user
  ON push_subscriptions(user_id);

CREATE TABLE IF NOT EXISTS notification_digest_log (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  digest_date DATE NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, digest_date)
);

CREATE INDEX IF NOT EXISTS idx_notification_digest_log_sent
  ON notification_digest_log(sent_at);
