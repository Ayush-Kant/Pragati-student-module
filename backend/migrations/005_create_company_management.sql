-- Migration 005: Company Management Module
-- Extends the minimal 'companies' table created in 003 and adds company_stats.

-- ─────────────────────────────────────────────────────────────
-- ALTER: companies (add missing columns for full management)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS user_id          INTEGER REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS email            VARCHAR(255) UNIQUE,
  ADD COLUMN IF NOT EXISTS industry         VARCHAR(100),
  ADD COLUMN IF NOT EXISTS size             VARCHAR(50),   -- e.g. '1-50', '51-200', '201-500', '500+'
  ADD COLUMN IF NOT EXISTS location         VARCHAR(255),
  ADD COLUMN IF NOT EXISTS status           VARCHAR(50) NOT NULL DEFAULT 'pending'
                                            CHECK (status IN ('pending','approved','rejected','suspended')),
  ADD COLUMN IF NOT EXISTS rejection_reason  TEXT,
  ADD COLUMN IF NOT EXISTS suspension_reason TEXT,
  ADD COLUMN IF NOT EXISTS verified_at      TIMESTAMPTZ;

-- ─────────────────────────────────────────────────────────────
-- TABLE: company_stats
-- Aggregated performance metrics per company
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS company_stats (
  id                        SERIAL PRIMARY KEY,
  company_id                INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  offer_acceptance_rate     NUMERIC(5,2)  DEFAULT 0.00,  -- %
  interview_to_hire_rate    NUMERIC(5,2)  DEFAULT 0.00,  -- %
  avg_response_time_days    NUMERIC(6,2)  DEFAULT 0.00,  -- days
  total_jobs_posted         INTEGER       NOT NULL DEFAULT 0,
  total_hires               INTEGER       NOT NULL DEFAULT 0,
  engagement_score          NUMERIC(6,2)  DEFAULT 0.00,
  last_updated              TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE(company_id)
);

-- ─────────────────────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_companies_status
  ON companies(status);

CREATE INDEX IF NOT EXISTS idx_companies_name
  ON companies(name);

CREATE INDEX IF NOT EXISTS idx_companies_industry
  ON companies(industry);

CREATE INDEX IF NOT EXISTS idx_company_stats_engagement
  ON company_stats(engagement_score DESC);

INSERT INTO companies
(
    name,
    email,
    industry,
    size,
    location,
    status
)
VALUES
(
    'TechNova Solutions',
    'hr@technova.com',
    'Software',
    '500-1000',
    'Hyderabad',
    'pending'
),
(
    'DataSphere Pvt Ltd',
    'careers@datasphere.com',
    'Data Analytics',
    '100-500',
    'Bangalore',
    'approved'
);

INSERT INTO company_stats
(
    company_id,
    offer_acceptance_rate,
    interview_to_hire_rate,
    avg_response_time_days,
    total_jobs_posted,
    total_hires,
    engagement_score
)
VALUES
(
    1,
    78.5,
    35.0,
    24,
    12,
    8,
    82.5
),
(
    2,
    91.2,
    48.5,
    12,
    30,
    20,
    95.8
);

INSERT INTO drives
(
    mentor_id,
    company_id,
    title,
    status,
    location,
    start_date,
    end_date
)
VALUES
(
    1,
    2,
    'Software Engineer Hiring Drive',
    'active',
    'Bangalore',
    NOW(),
    NOW() + INTERVAL '30 days'
);
