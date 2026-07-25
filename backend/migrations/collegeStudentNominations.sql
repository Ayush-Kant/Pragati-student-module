-- ============================================================
-- eligible_students VIEW is defined in student_module.sql
-- (which runs after the students table columns are fully set up).
-- This file only creates the nomination/shortlist tables.
-- ============================================================

-- ============================================================
-- Student Nominations Table
-- student_id references students(id) directly.
-- ============================================================
CREATE TABLE IF NOT EXISTS student_nominations (
  id             SERIAL PRIMARY KEY,
  student_id     INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  company_id     INTEGER NOT NULL,
  company_name   VARCHAR(100) NOT NULL,
  role           VARCHAR(100) NOT NULL,
  package        DECIMAL(10,2) NOT NULL DEFAULT 0,
  nominated_by   INTEGER,
  status         VARCHAR(20) NOT NULL DEFAULT 'Nominated'
                 CHECK (status IN ('Nominated','Shortlisted','Selected','Rejected','Withdrawn')),
  nomination_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  remarks        TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, company_id)
);

-- ============================================================
-- Shortlisted Students Table
-- ============================================================
CREATE TABLE IF NOT EXISTS shortlisted_students (
  id             SERIAL PRIMARY KEY,
  nomination_id  INTEGER NOT NULL REFERENCES student_nominations(id) ON DELETE CASCADE,
  student_id     INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  company_id     INTEGER NOT NULL,
  company_name   VARCHAR(100) NOT NULL,
  shortlist_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  round          VARCHAR(50) NOT NULL DEFAULT 'Initial',
  status         VARCHAR(20) NOT NULL DEFAULT 'Shortlisted'
                 CHECK (status IN ('Shortlisted','Selected','Rejected','On Hold')),
  remarks        TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Company Shortlists Table
-- ============================================================
CREATE TABLE IF NOT EXISTS company_shortlists (
  id               SERIAL PRIMARY KEY,
  company_id       INTEGER NOT NULL,
  company_name     VARCHAR(100) NOT NULL,
  total_nominations INTEGER NOT NULL DEFAULT 0,
  total_shortlisted INTEGER NOT NULL DEFAULT 0,
  total_selected    INTEGER NOT NULL DEFAULT 0,
  drive_date       DATE,
  status           VARCHAR(20) NOT NULL DEFAULT 'Active'
                   CHECK (status IN ('Active','Completed','Cancelled')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Nomination Statistics Table
-- ============================================================
CREATE TABLE IF NOT EXISTS nomination_statistics (
  id               SERIAL PRIMARY KEY,
  total_eligible   INTEGER NOT NULL DEFAULT 0,
  total_nominated  INTEGER NOT NULL DEFAULT 0,
  total_shortlisted INTEGER NOT NULL DEFAULT 0,
  total_selected   INTEGER NOT NULL DEFAULT 0,
  department       VARCHAR(100),
  batch            VARCHAR(10),
  calculated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_nominations_student  ON student_nominations(student_id);
CREATE INDEX IF NOT EXISTS idx_nominations_company  ON student_nominations(company_id);
CREATE INDEX IF NOT EXISTS idx_nominations_status   ON student_nominations(status);
CREATE INDEX IF NOT EXISTS idx_shortlisted_student  ON shortlisted_students(student_id);
CREATE INDEX IF NOT EXISTS idx_shortlisted_company  ON shortlisted_students(company_id);
