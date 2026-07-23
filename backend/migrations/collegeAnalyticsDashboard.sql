-- ============================================================
-- College Module: Analytics & Statistics Tables
-- Location: backend/migrations/collegeAnalyticsDashboard.sql
-- ============================================================

-- ------------------------------------------------------------
-- Table: analytics_dashboard
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics_dashboard (
    id SERIAL PRIMARY KEY,
    college_id INTEGER NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    total_students INTEGER DEFAULT 0,
    total_placed INTEGER DEFAULT 0,
    placement_rate NUMERIC(5, 2) DEFAULT 0.00,
    average_package NUMERIC(8, 2) DEFAULT 0.00,
    top_recruiter VARCHAR(255),
    active_drives INTEGER DEFAULT 0,
    total_companies INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_analytics_dashboard_college UNIQUE (college_id)
);

CREATE INDEX IF NOT EXISTS idx_analytics_dashboard_college ON analytics_dashboard(college_id);

-- ------------------------------------------------------------
-- Table: placement_statistics
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS placement_statistics (
    id SERIAL PRIMARY KEY,
    college_id INTEGER NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    total_students INTEGER DEFAULT 0,
    total_placed INTEGER DEFAULT 0,
    placement_rate NUMERIC(5, 2) DEFAULT 0.00,
    average_package NUMERIC(8, 2) DEFAULT 0.00,
    highest_package NUMERIC(8, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_placement_stats_college_year UNIQUE (college_id, year)
);

CREATE INDEX IF NOT EXISTS idx_placement_stats_college ON placement_statistics(college_id);
CREATE INDEX IF NOT EXISTS idx_placement_stats_year ON placement_statistics(year);

-- ------------------------------------------------------------
-- Table: company_statistics
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS company_statistics (
    id SERIAL PRIMARY KEY,
    college_id INTEGER NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
    company_name VARCHAR(255) NOT NULL,
    total_hired INTEGER DEFAULT 0,
    average_package NUMERIC(8, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_company_stats_college_name UNIQUE (college_id, company_name)
);

CREATE INDEX IF NOT EXISTS idx_company_stats_college ON company_statistics(college_id);
CREATE INDEX IF NOT EXISTS idx_company_stats_company_id ON company_statistics(company_id);

-- ------------------------------------------------------------
-- Table: department_statistics (Extend existing table)
-- ------------------------------------------------------------
DO $$ 
BEGIN
    -- Check if table exists, otherwise it will be created by other migrations.
    -- If it exists, add our new columns.
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'department_statistics') THEN
        ALTER TABLE department_statistics ADD COLUMN IF NOT EXISTS college_id INTEGER REFERENCES colleges(id) ON DELETE CASCADE;
        ALTER TABLE department_statistics ADD COLUMN IF NOT EXISTS total_placed INTEGER DEFAULT 0;
        ALTER TABLE department_statistics ADD COLUMN IF NOT EXISTS placement_rate NUMERIC(5, 2) DEFAULT 0.00;
        ALTER TABLE department_statistics ADD COLUMN IF NOT EXISTS average_package NUMERIC(8, 2) DEFAULT 0.00;
    ELSE
        CREATE TABLE department_statistics (
            id SERIAL PRIMARY KEY,
            department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
            college_id INTEGER REFERENCES colleges(id) ON DELETE CASCADE,
            total_courses INTEGER NOT NULL DEFAULT 0,
            total_students INTEGER NOT NULL DEFAULT 0,
            total_faculty INTEGER NOT NULL DEFAULT 0,
            total_placed INTEGER DEFAULT 0,
            placement_rate NUMERIC(5, 2) DEFAULT 0.00,
            average_package NUMERIC(8, 2) DEFAULT 0.00,
            average_credits NUMERIC(4, 2) NOT NULL DEFAULT 0,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            CONSTRAINT uq_department_statistics_department UNIQUE (department_id)
        );
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_dept_stats_college_id ON department_statistics(college_id);

-- ------------------------------------------------------------
-- Table: monthly_reports
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS monthly_reports (
    id SERIAL PRIMARY KEY,
    college_id INTEGER NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    report_month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    total_students INTEGER DEFAULT 0,
    total_placed INTEGER DEFAULT 0,
    placement_rate NUMERIC(5, 2) DEFAULT 0.00,
    average_package NUMERIC(8, 2) DEFAULT 0.00,
    report_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_monthly_reports UNIQUE (college_id, report_month)
);

CREATE INDEX IF NOT EXISTS idx_monthly_reports_college ON monthly_reports(college_id);
CREATE INDEX IF NOT EXISTS idx_monthly_reports_month ON monthly_reports(report_month);

-- ------------------------------------------------------------
-- Table: yearly_reports
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS yearly_reports (
    id SERIAL PRIMARY KEY,
    college_id INTEGER NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    report_year INTEGER NOT NULL,
    total_students INTEGER DEFAULT 0,
    total_placed INTEGER DEFAULT 0,
    placement_rate NUMERIC(5, 2) DEFAULT 0.00,
    average_package NUMERIC(8, 2) DEFAULT 0.00,
    report_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_yearly_reports UNIQUE (college_id, report_year)
);

CREATE INDEX IF NOT EXISTS idx_yearly_reports_college ON yearly_reports(college_id);
CREATE INDEX IF NOT EXISTS idx_yearly_reports_year ON yearly_reports(report_year);
