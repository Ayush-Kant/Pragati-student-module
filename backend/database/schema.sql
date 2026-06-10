-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- TABLE 1: auth_users (login credentials)
CREATE TABLE IF NOT EXISTS auth_users (
  id                  SERIAL PRIMARY KEY,
  uuid_id             UUID DEFAULT gen_random_uuid() UNIQUE,
  email               VARCHAR(255) UNIQUE NOT NULL,
  password_hash       VARCHAR(255) NOT NULL,
  role                VARCHAR(20) NOT NULL
                      CHECK (role IN ('mentor','student','company','admin','college')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE 2: users
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  full_name     VARCHAR(255),
  auth_user_id  BIGINT UNIQUE NOT NULL
                REFERENCES auth_users(id)
                ON DELETE CASCADE,
  email         VARCHAR(255) UNIQUE NOT NULL,
  role          VARCHAR(50) NOT NULL,
  username      VARCHAR(255),
  phone         VARCHAR(20),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE 3: mentors
CREATE TABLE IF NOT EXISTS mentors (
  id                SERIAL PRIMARY KEY,
  user_id           INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio               TEXT,
  expertise_tags    TEXT[],
  avatar_url        VARCHAR(500),
  availability_json JSONB,
  verified          BOOLEAN NOT NULL DEFAULT false,
  status            VARCHAR(50) NOT NULL DEFAULT 'pending'
);

-- TABLE 4: college_profiles
CREATE TABLE IF NOT EXISTS college_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    college_name VARCHAR(255) NOT NULL,
    college_code VARCHAR(100) UNIQUE,
    address TEXT,
    website VARCHAR(255),
    contact_number VARCHAR(20),
    established_year INTEGER,
    accreditation VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
<<<<<<< HEAD
);

-- TABLE 5: companies
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    industry VARCHAR(100),
    size VARCHAR(50),
    location VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected','suspended')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 6: recruitment_drives
CREATE TABLE IF NOT EXISTS recruitment_drives (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(255) NOT NULL,
  company_id INTEGER REFERENCES companies(id),
  mentor_id  INTEGER REFERENCES users(id),
  status     VARCHAR(50) NOT NULL DEFAULT 'active'
             CHECK (status IN ('active','closed','draft','completed','upcoming')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE 7: courses
CREATE TABLE IF NOT EXISTS courses (
  id           SERIAL PRIMARY KEY,
  mentor_id    INTEGER NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  drive_id     INTEGER REFERENCES recruitment_drives(id) ON DELETE SET NULL,
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  skill_tags   TEXT[],
  status       VARCHAR(50) NOT NULL DEFAULT 'draft'
               CHECK (status IN ('draft', 'published', 'archived')),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
=======
);

-- TABLE 5: companies
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    industry VARCHAR(100),
    size VARCHAR(50),
    location VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected','suspended')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 6: recruitment_drives
CREATE TABLE IF NOT EXISTS recruitment_drives (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(255) NOT NULL,
  company_id INTEGER REFERENCES companies(id),
  mentor_id  INTEGER REFERENCES users(id),
  status     VARCHAR(50) NOT NULL DEFAULT 'active'
             CHECK (status IN ('active','closed','draft','completed','upcoming')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE 7: courses
CREATE TABLE IF NOT EXISTS courses (
  id           SERIAL PRIMARY KEY,
  mentor_id    INTEGER NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  drive_id     INTEGER REFERENCES recruitment_drives(id) ON DELETE SET NULL,
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  skill_tags   TEXT[],
  status       VARCHAR(50) NOT NULL DEFAULT 'draft'
               CHECK (status IN ('draft', 'published', 'archived')),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 8: dashboard_stats
CREATE TABLE IF NOT EXISTS dashboard_stats (
    id SERIAL PRIMARY KEY,
    total_students INTEGER DEFAULT 0,
    active_drives INTEGER DEFAULT 0,
    placements INTEGER DEFAULT 0,
    total_companies INTEGER DEFAULT 0,
    revenue NUMERIC(15, 2) DEFAULT 0.00,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 9: dashboard_activities
CREATE TABLE IF NOT EXISTS dashboard_activities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'info',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 10: dashboard_reports
CREATE TABLE IF NOT EXISTS dashboard_reports (
    id SERIAL PRIMARY KEY,
    report_type VARCHAR(100) NOT NULL,
    report_data JSONB NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW()
>>>>>>> 58a8a53a33b49bd9f036a85f4634dd94794f37b4
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth_users(email);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_college_profiles_user_id ON college_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);
CREATE INDEX IF NOT EXISTS idx_mentors_expertise ON mentors USING GIN(expertise_tags);
<<<<<<< HEAD
=======
CREATE INDEX IF NOT EXISTS idx_dashboard_activities_created_at ON dashboard_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dashboard_reports_type ON dashboard_reports(report_type);
>>>>>>> 58a8a53a33b49bd9f036a85f4634dd94794f37b4
