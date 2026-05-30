-- Active: 1779373009630@@aws-1-ap-southeast-1.pooler.supabase.com@6543@postgres

CREATE TABLE IF NOT EXISTS company_stats (
    id SERIAL PRIMARY KEY,
    company_id INTEGER UNIQUE
    REFERENCES companies(id)
    ON DELETE CASCADE,
    offer_acceptance_rate NUMERIC(5,2) DEFAULT 0,
    interview_to_hire_rate NUMERIC(5,2) DEFAULT 0,
    avg_response_time INTEGER DEFAULT 0,
    total_jobs_posted INTEGER DEFAULT 0,
    total_hires INTEGER DEFAULT 0,
    engagement_score NUMERIC(5,2) DEFAULT 0
);

ALTER TABLE companies
ADD COLUMN IF NOT EXISTS industry VARCHAR(255),
ADD COLUMN IF NOT EXISTS size VARCHAR(100),
ADD COLUMN IF NOT EXISTS location VARCHAR(255),
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS suspension_reason TEXT,
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

ALTER TABLE companies
ADD COLUMN IF NOT EXISTS email VARCHAR(255);

CREATE TABLE IF NOT EXISTS audit_logs (

    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(100) NOT NULL,
    entity_id INTEGER NOT NULL,
    action VARCHAR(100) NOT NULL,
    performed_by INTEGER,
    reason TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE drives
ADD COLUMN IF NOT EXISTS company_id INTEGER
REFERENCES companies(id)
ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS title VARCHAR(255),
ADD COLUMN IF NOT EXISTS status VARCHAR(50),
ADD COLUMN IF NOT EXISTS location VARCHAR(255),
ADD COLUMN IF NOT EXISTS start_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS end_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

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
    avg_response_time,
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
SELECT * FROM companies;