CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================
-- Job Postings
-- =====================================

CREATE TABLE IF NOT EXISTS job_postings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    company_id UUID NOT NULL,

    role VARCHAR(255) NOT NULL,

    description TEXT,

    location VARCHAR(255),

    employment_type VARCHAR(50),

    package_lpa NUMERIC(10,2),

    batch VARCHAR(20),

    application_deadline DATE NOT NULL,

    status VARCHAR(20) DEFAULT 'OPEN'
        CHECK (status IN ('OPEN','CLOSED')),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_job_company
        FOREIGN KEY (company_id)
        REFERENCES companies(id)
        ON DELETE CASCADE
);

-- =====================================
-- Job Eligibility
-- =====================================

CREATE TABLE IF NOT EXISTS job_eligibility (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    job_posting_id UUID NOT NULL,

    min_cgpa NUMERIC(4,2),

    allowed_backlogs INTEGER DEFAULT 0,

    branches TEXT[],

    tenth_percentage NUMERIC(5,2),

    twelfth_percentage NUMERIC(5,2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_job_eligibility
        FOREIGN KEY (job_posting_id)
        REFERENCES job_postings(id)
        ON DELETE CASCADE
);

-- =====================================
-- Hiring Rounds
-- =====================================

CREATE TABLE IF NOT EXISTS hiring_rounds (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    job_posting_id UUID NOT NULL,

    round_number INTEGER NOT NULL,

    round_name VARCHAR(100) NOT NULL,

    round_type VARCHAR(100),

    scheduled_date DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_hiring_round
        FOREIGN KEY (job_posting_id)
        REFERENCES job_postings(id)
        ON DELETE CASCADE
);

-- =====================================
-- Indexes
-- =====================================

CREATE INDEX IF NOT EXISTS idx_job_company
ON job_postings(company_id);

CREATE INDEX IF NOT EXISTS idx_job_status
ON job_postings(status);

CREATE INDEX IF NOT EXISTS idx_job_deadline
ON job_postings(application_deadline);

CREATE INDEX IF NOT EXISTS idx_eligibility_job
ON job_eligibility(job_posting_id);

CREATE INDEX IF NOT EXISTS idx_round_job
ON hiring_rounds(job_posting_id);