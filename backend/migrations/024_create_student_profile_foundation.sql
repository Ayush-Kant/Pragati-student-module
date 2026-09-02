-- Student Profile Foundation
--
-- Extends the canonical develop student schema. This migration is intended
-- to run after student_module.sql on a fresh database.

ALTER TABLE students
  ADD COLUMN IF NOT EXISTS profile_image TEXT;

CREATE TABLE IF NOT EXISTS student_profiles (
  student_id           INTEGER PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
  bio                  TEXT,
  gender               VARCHAR(30),
  date_of_birth        DATE,
  avatar_url           TEXT,
  address_line1        VARCHAR(255),
  address_line2        VARCHAR(255),
  city                 VARCHAR(100),
  state                VARCHAR(100),
  country              VARCHAR(100) DEFAULT 'India',
  pincode              VARCHAR(10),
  alternate_phone      VARCHAR(20),
  alternate_email      VARCHAR(255),
  profile_completeness INTEGER NOT NULL DEFAULT 0 CHECK (profile_completeness BETWEEN 0 AND 100),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_profiles_city
  ON student_profiles(city);

ALTER TABLE student_academic_details
  ADD COLUMN IF NOT EXISTS institution_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS department VARCHAR(150),
  ADD COLUMN IF NOT EXISTS course VARCHAR(150),
  ADD COLUMN IF NOT EXISTS degree VARCHAR(100),
  ADD COLUMN IF NOT EXISTS semester INTEGER,
  ADD COLUMN IF NOT EXISTS graduation_year INTEGER,
  ADD COLUMN IF NOT EXISTS cgpa DECIMAL(4,2),
  ADD COLUMN IF NOT EXISTS enrollment_number VARCHAR(100),
  ADD COLUMN IF NOT EXISTS admission_year INTEGER,
  ADD COLUMN IF NOT EXISTS academic_email VARCHAR(255);

ALTER TABLE student_skills
  ADD COLUMN IF NOT EXISTS skill_level VARCHAR(30),
  ADD COLUMN IF NOT EXISTS category VARCHAR(100),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_student_skills_student_category
  ON student_skills(student_id, category);

ALTER TABLE student_documents
  ADD COLUMN IF NOT EXISTS document_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS file_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS file_size BIGINT,
  ADD COLUMN IF NOT EXISTS mime_type VARCHAR(150),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE TABLE IF NOT EXISTS student_resumes (
  id          SERIAL PRIMARY KEY,
  student_id  INTEGER NOT NULL UNIQUE REFERENCES students(id) ON DELETE CASCADE,
  resume_url  TEXT NOT NULL,
  file_name   VARCHAR(255),
  file_size   BIGINT,
  mime_type   VARCHAR(150),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_certifications (
  id                   SERIAL PRIMARY KEY,
  student_id           INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  name                 VARCHAR(255) NOT NULL,
  issuing_organization VARCHAR(255),
  issue_date           DATE,
  expiry_date          DATE,
  credential_id        VARCHAR(255),
  credential_url       TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_certifications_student
  ON student_certifications(student_id, issue_date DESC);

CREATE TABLE IF NOT EXISTS student_social_links (
  id            SERIAL PRIMARY KEY,
  student_id    INTEGER NOT NULL UNIQUE REFERENCES students(id) ON DELETE CASCADE,
  linkedin_url  TEXT,
  github_url    TEXT,
  portfolio_url TEXT,
  twitter_url   TEXT,
  website_url   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_documents_student
  ON student_documents(student_id, uploaded_at DESC);

CREATE INDEX IF NOT EXISTS idx_student_resumes_student
  ON student_resumes(student_id);
