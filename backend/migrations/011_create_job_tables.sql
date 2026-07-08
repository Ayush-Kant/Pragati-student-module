-- =====================================
-- Companies Table
-- =====================================

CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    address TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================
-- Job Postings Table
-- =====================================

CREATE TABLE IF NOT EXISTS job_postings (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    job_type VARCHAR(100),
    location VARCHAR(255),
    salary_min INTEGER,
    salary_max INTEGER,
    experience_required VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_job_postings_company
        FOREIGN KEY (company_id)
        REFERENCES companies(id)
        ON DELETE CASCADE
);

-- =====================================
-- Job Eligibility Table
-- =====================================

CREATE TABLE IF NOT EXISTS job_eligibility (
    id SERIAL PRIMARY KEY,
    job_id INTEGER,
    qualification VARCHAR(255),
    min_percentage INTEGER,
    max_backlogs INTEGER DEFAULT 0,
    allowed_batch_year INTEGER,
    gender_preference VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_job_eligibility_job
        FOREIGN KEY (job_id)
        REFERENCES job_postings(id)
        ON DELETE CASCADE
);

-- =====================================
-- Indexes
-- =====================================

CREATE INDEX IF NOT EXISTS idx_company_email
ON companies(email);

CREATE INDEX IF NOT EXISTS idx_job_postings_company_id
ON job_postings(company_id);

CREATE INDEX IF NOT EXISTS idx_job_postings_status
ON job_postings(status);

CREATE INDEX IF NOT EXISTS idx_job_eligibility_job_id
ON job_eligibility(job_id);

CREATE INDEX IF NOT EXISTS idx_job_eligibility_batch_year
ON job_eligibility(allowed_batch_year);