-- Migration: 023_create_placement_module_tables.sql
-- Create student placement intelligence tables and unique application constraint

CREATE TABLE IF NOT EXISTS job_applications (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    job_id VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'APPLIED',
    applied_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    history JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_job_applications_student_company_title
ON job_applications(student_id, LOWER(company_name), LOWER(job_title))
WHERE status NOT IN ('WITHDRAWN', 'REJECTED');

CREATE TABLE IF NOT EXISTS placement_interviews (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    application_id INTEGER REFERENCES job_applications(id) ON DELETE SET NULL,
    company_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255),
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(255) DEFAULT 'Online',
    type VARCHAR(50) NOT NULL DEFAULT 'TECHNICAL',
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
    feedback TEXT,
    score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS placement_interview_rounds (
    id SERIAL PRIMARY KEY,
    interview_id INTEGER NOT NULL REFERENCES placement_interviews(id) ON DELETE CASCADE,
    round_name VARCHAR(255) NOT NULL,
    round_order INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    feedback TEXT,
    score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skill_readiness (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    skill_name VARCHAR(255) NOT NULL,
    current_score INTEGER NOT NULL DEFAULT 0,
    target_score INTEGER NOT NULL DEFAULT 80,
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    category VARCHAR(100) DEFAULT 'Technical',
    last_evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS career_recommendations (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    reason TEXT NOT NULL,
    current_state VARCHAR(255),
    target_state VARCHAR(255),
    recommended_action TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS placement_analytics (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    total_applications INTEGER NOT NULL DEFAULT 0,
    shortlisted_count INTEGER NOT NULL DEFAULT 0,
    interview_count INTEGER NOT NULL DEFAULT 0,
    selected_count INTEGER NOT NULL DEFAULT 0,
    readiness_score INTEGER NOT NULL DEFAULT 0,
    metrics_json JSONB,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
