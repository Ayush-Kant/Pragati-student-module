-- Assumes these tables already exist (created by earlier interns):
--   users, colleges, recruitment_drives
-- TABLE: students
CREATE TABLE IF NOT EXISTS students (
id                SERIAL PRIMARY KEY,
user_id           INTEGER REFERENCES users(id),
college_id        INTEGER REFERENCES colleges(id),
name              VARCHAR(255) NOT NULL,
email             VARCHAR(255) UNIQUE NOT NULL,
phone             VARCHAR(20),
gpa               NUMERIC(4,2) DEFAULT 0.00,
skills            TEXT[],              -- e.g. ['MERN','Python','Node.js']
enrollment_year   INTEGER,
status            VARCHAR(50) NOT NULL DEFAULT 'pending'
CHECK (status IN ('pending','verified','blocked')),
profile_verified  BOOLEAN NOT NULL DEFAULT FALSE,
block_reason      TEXT,
verified_at       TIMESTAMPTZ,
created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- TABLE: student_drive_progress
-- Tracks each student's pipeline state within a specific drive
CREATE TABLE IF NOT EXISTS student_drive_progress (
id                      SERIAL PRIMARY KEY,
student_id              INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
drive_id                INTEGER NOT NULL REFERENCES recruitment_drives(id) ON DELETE CASCADE,
current_stage           VARCHAR(50) NOT NULL DEFAULT 'applied'
CHECK (current_stage IN ('applied','tested','training','shortlisted','interviews','selected')),
assessment_score        INTEGER DEFAULT 0,
assignments_submitted   INTEGER DEFAULT 0,
assignments_total       INTEGER DEFAULT 0,
mentor_feedback         TEXT,
updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
UNIQUE(student_id, drive_id)
);


-- INDEXES
CREATE INDEX idx_students_status       ON students(status);
CREATE INDEX idx_students_college      ON students(college_id);
CREATE INDEX idx_students_name         ON students(name);
CREATE INDEX idx_students_skills       ON students USING GIN(skills);
CREATE INDEX idx_sdp_student           ON student_drive_progress(student_id);
CREATE INDEX idx_sdp_drive             ON student_drive_progress(drive_id);


