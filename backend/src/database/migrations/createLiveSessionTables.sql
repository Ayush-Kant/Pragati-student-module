-- Create live session related tables if they do not already exist
-- Check existing tables first in PostgreSQL before running this migration.

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

ALTER TABLE live_sessions
ADD COLUMN IF NOT EXISTS mentor_id INTEGER,
ADD COLUMN IF NOT EXISTS session_type VARCHAR(50) NOT NULL DEFAULT 'webinar',
ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS date DATE,
ADD COLUMN IF NOT EXISTS time VARCHAR(50),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'live_sessions'
          AND column_name = 'session_date'
    ) THEN
        UPDATE live_sessions
        SET date = COALESCE(date, session_date),
            time = COALESCE(time, session_time),
            session_type = COALESCE(session_type, 'webinar')
        WHERE id IS NOT NULL;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS session_attendance (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    attended BOOLEAN NOT NULL DEFAULT FALSE,
    attended_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL DEFAULT 'Absent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT session_attendance_status_chk CHECK (status IN ('Present', 'Absent', 'Late', 'Excused')),
    CONSTRAINT fk_session_attendance_session FOREIGN KEY (session_id) REFERENCES live_sessions(id) ON DELETE CASCADE,
    UNIQUE(session_id, student_id)
);

CREATE TABLE IF NOT EXISTS session_participants (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE,
    left_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_session_participants_session FOREIGN KEY (session_id) REFERENCES live_sessions(id) ON DELETE CASCADE,
    UNIQUE(session_id, student_id)
);

CREATE TABLE IF NOT EXISTS session_recordings (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    duration VARCHAR(50),
    recording_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_session_recordings_session FOREIGN KEY (session_id) REFERENCES live_sessions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS session_schedules (
    id SERIAL PRIMARY KEY,
    session_id INTEGER,
    title VARCHAR(255) NOT NULL,
    trainer VARCHAR(255),
    date DATE,
    time VARCHAR(50),
    duration VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT session_schedules_status_chk CHECK (status IN ('Scheduled', 'Upcoming', 'Live', 'Completed')),
    CONSTRAINT fk_session_schedules_session FOREIGN KEY (session_id) REFERENCES live_sessions(id) ON DELETE SET NULL
);

ALTER TABLE session_schedules
ADD COLUMN IF NOT EXISTS title VARCHAR(255),
ADD COLUMN IF NOT EXISTS trainer VARCHAR(255),
ADD COLUMN IF NOT EXISTS date DATE,
ADD COLUMN IF NOT EXISTS time VARCHAR(50),
ADD COLUMN IF NOT EXISTS duration VARCHAR(50),
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Scheduled',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_live_sessions_status_scheduled_at ON live_sessions (status, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_session_attendance_session_id ON session_attendance (session_id);
CREATE INDEX IF NOT EXISTS idx_session_attendance_student_id ON session_attendance (student_id);
CREATE INDEX IF NOT EXISTS idx_session_participants_session_id ON session_participants (session_id);
CREATE INDEX IF NOT EXISTS idx_session_recordings_session_id ON session_recordings (session_id);
CREATE INDEX IF NOT EXISTS idx_session_schedules_status_date ON session_schedules (status, date);
