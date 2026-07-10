CREATE TABLE IF NOT EXISTS hiring_metrics (
    id UUID PRIMARY KEY,
    company_id UUID REFERENCES companies_v2 (id),
    drive_id UUID REFERENCES recruitment_drives_v2 (id),
    metric_date DATE,
    total_applications INTEGER DEFAULT 0,
    total_shortlisted INTEGER DEFAULT 0,
    total_interviewed INTEGER DEFAULT 0,
    total_offered INTEGER DEFAULT 0,
    total_hired INTEGER DEFAULT 0,
    offer_acceptance_rate NUMERIC(5, 2),
    avg_time_to_hire_days NUMERIC(6, 2)
);

CREATE TABLE IF NOT EXISTS college_performance_metrics (
    id UUID PRIMARY KEY,
    college_id UUID,
    company_id UUID REFERENCES companies_v2 (id),
    metric_period VARCHAR(20),
    total_candidates_registered INTEGER DEFAULT 0,
    total_screened INTEGER DEFAULT 0,
    passed_screening INTEGER DEFAULT 0,
    total_interviewed INTEGER DEFAULT 0,
    passed_interview INTEGER DEFAULT 0,
    total_offered INTEGER DEFAULT 0,
    total_accepted INTEGER DEFAULT 0,
    placement_rate NUMERIC(5, 2),
    avg_package_lpa NUMERIC(8, 2)
);

CREATE TABLE IF NOT EXISTS skill_demand_metrics (
    skill_name VARCHAR(100),
    category VARCHAR(100),
    demand_count INTEGER DEFAULT 0,
    supply_count INTEGER DEFAULT 0,
    gap_index NUMERIC(6, 2),
    trend VARCHAR(50) CHECK (trend IN ('INCREASING','STABLE','DECREASING'))
);

CREATE TABLE IF NOT EXISTS analytics_cache (
    cache_key VARCHAR(255) PRIMARY KEY,
    entity_type VARCHAR(100),
    entity_id UUID,
    cached_data JSONB,
    computed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    is_stale BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_hiring_metrics_company ON hiring_metrics (company_id);

CREATE INDEX IF NOT EXISTS idx_hiring_metrics_drive ON hiring_metrics (drive_id);

CREATE INDEX IF NOT EXISTS idx_college_metrics_company ON college_performance_metrics (company_id);

CREATE INDEX IF NOT EXISTS idx_skill_metrics_skill ON skill_demand_metrics (skill_name);