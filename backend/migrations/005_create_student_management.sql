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


-- INDEXES
CREATE INDEX idx_students_status       ON students(status);
CREATE INDEX idx_students_college      ON students(college_id);
CREATE INDEX idx_students_name         ON students(name);
CREATE INDEX idx_students_skills       ON students USING GIN(skills);

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

SELECT * FROM students;
