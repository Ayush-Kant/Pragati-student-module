CREATE TABLE IF NOT EXISTS live_sessions (
  id SERIAL PRIMARY KEY,
  mentor_id INT REFERENCES mentors(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  session_type VARCHAR(50) DEFAULT 'webinar',
  scheduled_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_progress (
  id SERIAL PRIMARY KEY,
  student_id INT REFERENCES users(id) ON DELETE CASCADE,
  drive_id INT REFERENCES recruitment_drives(id) ON DELETE CASCADE,
  readiness_score INT DEFAULT 0 CHECK (readiness_score >= 0 AND readiness_score <= 100),
  completion_pct INT DEFAULT 0 CHECK (completion_pct >= 0 AND completion_pct <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (student_id, drive_id)
);

CREATE TABLE IF NOT EXISTS drive_enrollments (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  drive_id INT NOT NULL REFERENCES recruitment_drives(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (student_id, drive_id)
);

CREATE TABLE IF NOT EXISTS activity_submissions (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  drive_id INT REFERENCES recruitment_drives(id) ON DELETE SET NULL,
  activity_title VARCHAR(255) NOT NULL,
  activity_type VARCHAR(50) NOT NULL DEFAULT 'assignment' CHECK (activity_type IN ('assignment', 'project', 'quiz', 'task')),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'graded', 'approved', 'rejected')),
  score INT CHECK (score >= 0),
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS session_attendance (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id INT NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
  attended BOOLEAN DEFAULT false,
  attended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (student_id, session_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_student_progress_student_drive ON student_progress(student_id, drive_id);
CREATE INDEX IF NOT EXISTS idx_drive_enrollments_student_id ON drive_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_drive_enrollments_drive_id ON drive_enrollments(drive_id);
CREATE INDEX IF NOT EXISTS idx_activity_submissions_student_id ON activity_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_activity_submissions_drive_id ON activity_submissions(drive_id);
CREATE INDEX IF NOT EXISTS idx_activity_submissions_status ON activity_submissions(status);
CREATE INDEX IF NOT EXISTS idx_activity_submissions_status_created_at ON activity_submissions(status, created_at);
CREATE INDEX IF NOT EXISTS idx_session_attendance_student_id ON session_attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_session_attendance_session_id ON session_attendance(session_id);
CREATE INDEX IF NOT EXISTS idx_session_attendance_attended ON session_attendance(attended);
CREATE INDEX IF NOT EXISTS idx_notifications_student_auth_user_id ON notifications(student_auth_user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_live_sessions_mentor_id_scheduled_at ON live_sessions(mentor_id, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_live_sessions_scheduled_at ON live_sessions(scheduled_at);
