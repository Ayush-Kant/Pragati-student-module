BEGIN;

ALTER TABLE live_sessions
  ADD COLUMN IF NOT EXISTS room_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS meeting_url TEXT;

CREATE INDEX IF NOT EXISTS idx_live_sessions_room_name ON live_sessions(room_name);

ALTER TABLE session_participants
  ADD COLUMN IF NOT EXISTS join_token_issued_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS duration_seconds INTEGER;

ALTER TABLE session_attendance
  ADD COLUMN IF NOT EXISTS join_timestamp TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS leave_timestamp TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS duration_seconds INTEGER;

COMMIT;
