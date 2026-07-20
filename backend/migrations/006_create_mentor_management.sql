-- Assumes these tables already exist (created by earlier interns):
--   users, recruitment_drives, courses

-- Ensure auth_users has uuid_id column (required by auth.controller.js but missing in 001)
ALTER TABLE auth_users ADD COLUMN IF NOT EXISTS uuid_id UUID UNIQUE DEFAULT gen_random_uuid();

-- Ensure users table has phone and username columns (required by auth.controller.js but missing in 001)
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(255);

-- Alter/Create TABLE: mentors
CREATE TABLE IF NOT EXISTS mentors (
    id                    SERIAL PRIMARY KEY,
    user_id               INTEGER REFERENCES users(id),
    name                  VARCHAR(255) NOT NULL,
    email                 VARCHAR(255) UNIQUE NOT NULL,
    phone                 VARCHAR(20),
    bio                   TEXT,
    expertise             TEXT[],           -- e.g. ['MERN','React','Node.js']
    rating                NUMERIC(3,1) DEFAULT NULL,
    total_reviews         INTEGER NOT NULL DEFAULT 0,
    completion_rate       NUMERIC(5,2) DEFAULT 0.00,
    avg_assignment_score  NUMERIC(5,2) DEFAULT 0.00,
    is_active             BOOLEAN NOT NULL DEFAULT TRUE,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all columns from the 006 spec exist in mentors (in case table was already created by 001)
ALTER TABLE mentors ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE mentors ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;
ALTER TABLE mentors ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE mentors ADD COLUMN IF NOT EXISTS expertise TEXT[];
ALTER TABLE mentors ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1) DEFAULT NULL;
ALTER TABLE mentors ADD COLUMN IF NOT EXISTS total_reviews INTEGER NOT NULL DEFAULT 0;
ALTER TABLE mentors ADD COLUMN IF NOT EXISTS completion_rate NUMERIC(5,2) DEFAULT 0.00;
ALTER TABLE mentors ADD COLUMN IF NOT EXISTS avg_assignment_score NUMERIC(5,2) DEFAULT 0.00;
ALTER TABLE mentors ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE mentors ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- TABLE: mentor_batch_assignments
-- Tracks which mentor is assigned to which course/batch within a drive
CREATE TABLE IF NOT EXISTS mentor_batch_assignments (
    id          SERIAL PRIMARY KEY,
    mentor_id   INTEGER NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    drive_id    INTEGER NOT NULL REFERENCES recruitment_drives(id) ON DELETE CASCADE,
    course_id   INTEGER NOT NULL,
    batch_id    VARCHAR(100) NOT NULL,
    title       VARCHAR(255),
    status      VARCHAR(50) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'completed', 'replaced')),
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: mentor_feedback
-- Student ratings and comments submitted after training
CREATE TABLE IF NOT EXISTS mentor_feedback (
    id           SERIAL PRIMARY KEY,
    mentor_id    INTEGER NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    student_id   INTEGER NOT NULL,
    rating       INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment      TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_mentors_is_active      ON mentors(is_active);
CREATE INDEX IF NOT EXISTS idx_mentors_expertise      ON mentors USING GIN(expertise);
CREATE INDEX IF NOT EXISTS idx_mentors_rating         ON mentors(rating DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_mba_mentor             ON mentor_batch_assignments(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mba_drive              ON recruitment_drives(id);
CREATE INDEX IF NOT EXISTS idx_mba_status             ON mentor_batch_assignments(status);
CREATE INDEX IF NOT EXISTS idx_mentor_feedback_mentor ON mentor_feedback(mentor_id);