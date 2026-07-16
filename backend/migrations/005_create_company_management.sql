-- ============================================================
-- COMPANIES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,

    user_id INTEGER REFERENCES users(id),

    name VARCHAR(255) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,

    industry VARCHAR(100),

    size VARCHAR(50),

    location VARCHAR(255),

    website VARCHAR(255),

    description TEXT,

    logo_url TEXT,

    default_work_mode VARCHAR(50) DEFAULT 'Hybrid',

    probation_period INTEGER DEFAULT 3,

    notice_period INTEGER DEFAULT 30,

    currency VARCHAR(10) DEFAULT 'INR',

    notifications JSONB DEFAULT '{"emailNotifications": true, "interviewReminders": true, "weeklyAnalyticsReport": false, "offerNotifications": true}',

    status VARCHAR(50) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected','suspended')),

    rejection_reason TEXT,

    suspension_reason TEXT,

    verified_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE companies ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);
ALTER TABLE companies ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE companies ADD COLUMN IF NOT EXISTS industry VARCHAR(100);
ALTER TABLE companies ADD COLUMN IF NOT EXISTS size VARCHAR(50);
ALTER TABLE companies ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE companies ADD COLUMN IF NOT EXISTS website VARCHAR(255);
ALTER TABLE companies ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS default_work_mode VARCHAR(50) DEFAULT 'Hybrid';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS probation_period INTEGER DEFAULT 3;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS notice_period INTEGER DEFAULT 30;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'INR';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS notifications JSONB DEFAULT '{"emailNotifications": true, "interviewReminders": true, "weeklyAnalyticsReport": false, "offerNotifications": true}';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'pending';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS suspension_reason TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
DO $$ BEGIN
  ALTER TABLE companies
    ADD CONSTRAINT companies_status_check
    CHECK (status IN ('pending','approved','rejected','suspended'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
-- ============================================================
-- COMPANY STATS TABLE
-- ============================================================


CREATE TABLE IF NOT EXISTS company_stats (
    id SERIAL PRIMARY KEY,


    company_id INTEGER NOT NULL
    REFERENCES companies(id)
    ON DELETE CASCADE,


    offer_acceptance_rate NUMERIC(5,2) DEFAULT 0.00,


    interview_to_hire_rate NUMERIC(5,2) DEFAULT 0.00,


    avg_response_time_days NUMERIC(6,2) DEFAULT 0.00,


    total_jobs_posted INTEGER DEFAULT 0,


    total_hires INTEGER DEFAULT 0,


    engagement_score NUMERIC(6,2) DEFAULT 0.00,


    last_updated TIMESTAMPTZ DEFAULT NOW(),


    UNIQUE(company_id)
);


-- ============================================================
-- INDEXES
-- ============================================================


CREATE INDEX IF NOT EXISTS idx_companies_status
ON companies(status);


CREATE INDEX IF NOT EXISTS idx_companies_name
ON companies(name);


CREATE INDEX IF NOT EXISTS idx_companies_industry
ON companies(industry);


CREATE INDEX IF NOT EXISTS idx_company_stats_engagement
ON company_stats(engagement_score DESC);


-- ============================================================
-- SAMPLE DATA
-- ============================================================


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
    'Software Development',
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
