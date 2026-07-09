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
ALTER TABLE student_drive_progress ADD COLUMN IF NOT EXISTS current_stage VARCHAR(50) NOT NULL DEFAULT 'applied';
ALTER TABLE student_drive_progress ADD COLUMN IF NOT EXISTS assessment_score INTEGER DEFAULT 0;
ALTER TABLE student_drive_progress ADD COLUMN IF NOT EXISTS assignments_submitted INTEGER DEFAULT 0;
ALTER TABLE student_drive_progress ADD COLUMN IF NOT EXISTS assignments_total INTEGER DEFAULT 0;
ALTER TABLE student_drive_progress ADD COLUMN IF NOT EXISTS mentor_feedback TEXT;

DO $$ BEGIN
  ALTER TABLE student_drive_progress ADD CONSTRAINT student_drive_progress_stage_check_2
    CHECK (current_stage IN ('applied','tested','training','shortlisted','interviews','selected'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- INDEXES
CREATE INDEX IF NOT EXISTS idx_students_status       ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_college      ON students(college_id);
CREATE INDEX IF NOT EXISTS idx_students_name         ON students(name);
CREATE INDEX IF NOT EXISTS idx_students_skills       ON students USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_sdp_student           ON student_drive_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_sdp_drive             ON student_drive_progress(drive_id);


INSERT INTO students (
    name,
    email,
    gpa,
    skills,
    enrollment_year
)
VALUES (
    'Rahul Sharma',
    'rahul@test.com',
    8.5,
    ARRAY['MERN','Node.js'],
    2023
);

INSERT INTO students (
    name,
    email,
    gpa,
    skills,
    enrollment_year,
    status
)
VALUES
(
    'Priya Patel',
    'priya@test.com',
    9.1,
    ARRAY['Python','AI'],
    2022,
    'verified'
),
(
    'Arjun Kumar',
    'arjun@test.com',
    7.8,
    ARRAY['Java','Spring Boot'],
    2023,
    'blocked'
);
