CREATE TABLE IF NOT EXISTS live_sessions (
  id SERIAL PRIMARY KEY,
  mentor_id INTEGER,
  title VARCHAR(255) NOT NULL,
  session_type VARCHAR(50) NOT NULL DEFAULT 'webinar',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  trainer VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(50) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Upcoming',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT live_sessions_session_type_chk CHECK (session_type IN ('webinar', 'interactive', 'qa')),
  CONSTRAINT live_sessions_status_chk CHECK (status IN ('Upcoming', 'Scheduled', 'Live', 'Completed'))
);

CREATE TABLE IF NOT EXISTS session_attendance (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL,
  attended BOOLEAN NOT NULL DEFAULT FALSE,
  attended_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) NOT NULL DEFAULT 'Absent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT session_attendance_status_chk CHECK (status IN ('Present', 'Absent', 'Late', 'Excused')),
  UNIQUE(session_id, student_id)
);

CREATE TABLE IF NOT EXISTS session_participants (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE,
  left_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, student_id)
);

CREATE TABLE IF NOT EXISTS session_recordings (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  duration VARCHAR(50),
  recording_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS session_schedules (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES live_sessions(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  trainer VARCHAR(255),
  date DATE,
  time VARCHAR(50),
  duration VARCHAR(50),
  status VARCHAR(50) DEFAULT 'Scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT session_schedules_status_chk CHECK (status IN ('Scheduled', 'Upcoming', 'Live', 'Completed'))
);

CREATE INDEX IF NOT EXISTS idx_live_sessions_status_scheduled_at ON live_sessions (status, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_session_attendance_session_id ON session_attendance (session_id);
CREATE INDEX IF NOT EXISTS idx_session_attendance_student_id ON session_attendance (student_id);
CREATE INDEX IF NOT EXISTS idx_session_participants_session_id ON session_participants (session_id);
CREATE INDEX IF NOT EXISTS idx_session_recordings_session_id ON session_recordings (session_id);
CREATE INDEX IF NOT EXISTS idx_session_schedules_status_date ON session_schedules (status, date);
