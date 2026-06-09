-- TABLE: dashboard_stats
-- Stores aggregated metrics for quick access
CREATE TABLE IF NOT EXISTS dashboard_stats (
    id SERIAL PRIMARY KEY,
    total_students INTEGER DEFAULT 0,
    active_drives INTEGER DEFAULT 0,
    placements INTEGER DEFAULT 0,
    total_companies INTEGER DEFAULT 0,
    revenue NUMERIC(15, 2) DEFAULT 0.00,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: dashboard_activities
-- Logs recent system activities
CREATE TABLE IF NOT EXISTS dashboard_activities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'info', -- success, warning, error, info
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: dashboard_reports
-- Stores snapshot or configuration for various analytics reports
CREATE TABLE IF NOT EXISTS dashboard_reports (
    id SERIAL PRIMARY KEY,
    report_type VARCHAR(100) NOT NULL, -- placement, revenue, admission
    report_data JSONB NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES for optimization
CREATE INDEX IF NOT EXISTS idx_dashboard_activities_created_at ON dashboard_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dashboard_reports_type ON dashboard_reports(report_type);

-- Initial Seed for stats if not exists
INSERT INTO dashboard_stats (total_students, active_drives, placements, total_companies, revenue)
SELECT 0, 0, 0, 0, 0
WHERE NOT EXISTS (SELECT 1 FROM dashboard_stats);
