-- Complete Student Module Schema
-- Run this in your PostgreSQL database

-- Students Table
CREATE TABLE IF NOT EXISTS students (
    id                  SERIAL PRIMARY KEY,
    enrollment_no       VARCHAR(50) UNIQUE NOT NULL,
    name                VARCHAR(100) NOT NULL,
    email               VARCHAR(255) UNIQUE NOT NULL,
    phone               VARCHAR(20),
    department          VARCHAR(100),
    course              VARCHAR(100),
    semester            INTEGER,
    batch               VARCHAR(10),
    cgpa                DECIMAL(4, 2),
    placement_status    VARCHAR(50) DEFAULT 'Not Eligible',
    address             TEXT,
    resume_status       VARCHAR(50) DEFAULT 'Not Uploaded',
    linkedin            VARCHAR(255),
    github              VARCHAR(255),
    placed_at           VARCHAR(100),
    package             VARCHAR(50),
    college             VARCHAR(255),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
