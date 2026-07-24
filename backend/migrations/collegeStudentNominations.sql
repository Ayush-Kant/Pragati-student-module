-- Eligible Students Table
CREATE TABLE IF NOT EXISTS eligible_students (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  enrollment_no VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  course VARCHAR(50) NOT NULL,
  semester INTEGER NOT NULL,
  batch VARCHAR(10) NOT NULL,
  cgpa DECIMAL(4,2) NOT NULL CHECK (cgpa >= 0 AND cgpa <= 10),
  placement_status VARCHAR(20) DEFAULT 'Eligible',
  skills TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student Nominations Table
CREATE TABLE IF NOT EXISTS student_nominations (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES eligible_students(id) ON DELETE CASCADE,
  company_id INTEGER NOT NULL,
  company_name VARCHAR(100) NOT NULL,

  role VARCHAR(100) NOT NULL,
  package DECIMAL(6,2) NOT NULL,

  nominated_by INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'Pending',
  nomination_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, company_id)
);
-- Shortlisted Students Table
CREATE TABLE IF NOT EXISTS shortlisted_students (
  id SERIAL PRIMARY KEY,
  nomination_id INTEGER NOT NULL REFERENCES student_nominations(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES eligible_students(id) ON DELETE CASCADE,
  company_id INTEGER NOT NULL,
  company_name VARCHAR(100) NOT NULL,
  shortlist_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  round VARCHAR(50) DEFAULT 'Initial',
  status VARCHAR(20) DEFAULT 'Shortlisted' CHECK (status IN ('Shortlisted', 'Selected', 'Rejected', 'On Hold')),
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Company Shortlists Table
CREATE TABLE IF NOT EXISTS company_shortlists (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL,
  company_name VARCHAR(100) NOT NULL,
  total_nominations INTEGER DEFAULT 0,
  total_shortlisted INTEGER DEFAULT 0,
  total_selected INTEGER DEFAULT 0,
  drive_date DATE,
  status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Completed', 'Cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nomination Statistics Table
CREATE TABLE IF NOT EXISTS nomination_statistics (
  id SERIAL PRIMARY KEY,
  total_eligible INTEGER DEFAULT 0,
  total_nominated INTEGER DEFAULT 0,
  total_shortlisted INTEGER DEFAULT 0,
  total_selected INTEGER DEFAULT 0,
  department VARCHAR(100),
  batch VARCHAR(10),
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_nominations_student ON student_nominations(student_id);
CREATE INDEX IF NOT EXISTS idx_nominations_company ON student_nominations(company_id);
CREATE INDEX IF NOT EXISTS idx_nominations_status ON student_nominations(status);
CREATE INDEX IF NOT EXISTS idx_shortlisted_student ON shortlisted_students(student_id);
CREATE INDEX IF NOT EXISTS idx_shortlisted_company ON shortlisted_students(company_id);
CREATE INDEX IF NOT EXISTS idx_eligible_department ON eligible_students(department);
CREATE INDEX IF NOT EXISTS idx_eligible_cgpa ON eligible_students(cgpa);