-- 011_create_live_sessions_module.sql
-- Create live_sessions table if it doesn't exist, and add new fields if it does.
CREATE TABLE IF NOT EXISTS live_sessions (
    id SERIAL PRIMARY KEY,
    mentor_id INT REFERENCES mentors(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    session_type VARCHAR(50) DEFAULT 'webinar',
    scheduled_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE live_sessions ADD COLUMN IF NOT EXISTS trainer VARCHAR(255);
ALTER TABLE live_sessions ADD COLUMN IF NOT EXISTS date VARCHAR(50);
ALTER TABLE live_sessions ADD COLUMN IF NOT EXISTS time VARCHAR(50);
ALTER TABLE live_sessions ADD COLUMN IF NOT EXISTS duration VARCHAR(50);
ALTER TABLE live_sessions ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Upcoming';

-- Create session_attendance table
CREATE TABLE IF NOT EXISTS session_attendance (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id INT NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
    attended BOOLEAN DEFAULT false,
    attended_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'Absent',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (student_id, session_id)
);

ALTER TABLE session_attendance ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Absent';

-- Create session_participants table
CREATE TABLE IF NOT EXISTS session_participants (
    id SERIAL PRIMARY KEY,
    session_id INT NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
    student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    left_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (session_id, student_id)
);

-- Create session_recordings table
CREATE TABLE IF NOT EXISTS session_recordings (
    id SERIAL PRIMARY KEY,
    session_id INT REFERENCES live_sessions(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    recording_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create session_schedules table
CREATE TABLE IF NOT EXISTS session_schedules (
    id SERIAL PRIMARY KEY,
    session_id INT REFERENCES live_sessions(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    trainer VARCHAR(255) NOT NULL,
    date VARCHAR(50) NOT NULL,
    time VARCHAR(50) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Scheduled',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_session_participants_session ON session_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_session_participants_student ON session_participants(student_id);
CREATE INDEX IF NOT EXISTS idx_session_recordings_session ON session_recordings(session_id);
CREATE INDEX IF NOT EXISTS idx_session_schedules_session ON session_schedules(session_id);
