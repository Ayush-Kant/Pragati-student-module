-- Complete Student Module Schema
-- Run this in your PostgreSQL database

-- Students Table
ALTER TABLE students ADD COLUMN IF NOT EXISTS enrollment_no VARCHAR(50) UNIQUE;
ALTER TABLE students ADD COLUMN IF NOT EXISTS department VARCHAR(100);
ALTER TABLE students ADD COLUMN IF NOT EXISTS course VARCHAR(100);
ALTER TABLE students ADD COLUMN IF NOT EXISTS semester INTEGER;
ALTER TABLE students ADD COLUMN IF NOT EXISTS batch VARCHAR(10);
ALTER TABLE students ADD COLUMN IF NOT EXISTS cgpa DECIMAL(4, 2);
ALTER TABLE students ADD COLUMN IF NOT EXISTS placement_status VARCHAR(50) DEFAULT 'Not Eligible';
ALTER TABLE students ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS resume_status VARCHAR(50) DEFAULT 'Not Uploaded';
ALTER TABLE students ADD COLUMN IF NOT EXISTS linkedin VARCHAR(255);
ALTER TABLE students ADD COLUMN IF NOT EXISTS github VARCHAR(255);
ALTER TABLE students ADD COLUMN IF NOT EXISTS placed_at VARCHAR(100);
ALTER TABLE students ADD COLUMN IF NOT EXISTS package VARCHAR(50);
ALTER TABLE students ADD COLUMN IF NOT EXISTS college VARCHAR(255);
ALTER TABLE students ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Student Skills Table
CREATE TABLE IF NOT EXISTS student_skills (
    id          SERIAL PRIMARY KEY,
    student_id  INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    skill_name  VARCHAR(100) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student Academic Details Table
CREATE TABLE IF NOT EXISTS student_academic_details (
    id                  SERIAL PRIMARY KEY,
    student_id          INTEGER UNIQUE NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    tenth_percentage    DECIMAL(5, 2),
    twelfth_percentage  DECIMAL(5, 2),
    backlogs            INTEGER DEFAULT 0,
    active_backlogs     INTEGER DEFAULT 0,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student Documents Table
CREATE TABLE IF NOT EXISTS student_documents (
    id              SERIAL PRIMARY KEY,
    student_id      INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    document_type   VARCHAR(100),
    document_url    TEXT,
    uploaded_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_students_enrollment_no  ON students(enrollment_no);
CREATE INDEX IF NOT EXISTS idx_students_email          ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_department     ON students(department);
CREATE INDEX IF NOT EXISTS idx_students_batch          ON students(batch);
CREATE INDEX IF NOT EXISTS idx_students_college        ON students(college);
CREATE INDEX IF NOT EXISTS idx_students_placement      ON students(placement_status);
CREATE INDEX IF NOT EXISTS idx_student_skills_sid      ON student_skills(student_id);
CREATE INDEX IF NOT EXISTS idx_student_academic_sid    ON student_academic_details(student_id);
