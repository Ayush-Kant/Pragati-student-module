CREATE TABLE IF NOT EXISTS report_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS generated_reports (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'completed',
    format VARCHAR(50) NOT NULL DEFAULT 'json',
    content JSONB DEFAULT '{}'::jsonb,
    created_by INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS report_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(100) NOT NULL,
    format VARCHAR(50) NOT NULL DEFAULT 'json',
    category_id INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_report_templates_category
        FOREIGN KEY (category_id) REFERENCES report_categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS report_exports (
    id SERIAL PRIMARY KEY,
    report_id INTEGER NOT NULL,
    format VARCHAR(50) NOT NULL DEFAULT 'pdf',
    status VARCHAR(50) NOT NULL DEFAULT 'completed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_report_exports_report
        FOREIGN KEY (report_id) REFERENCES generated_reports(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS report_history (
    id SERIAL PRIMARY KEY,
    report_id INTEGER NOT NULL,
    action VARCHAR(100) NOT NULL DEFAULT 'generated',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_report_history_report
        FOREIGN KEY (report_id) REFERENCES generated_reports(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_generated_reports_type ON generated_reports(type);
CREATE INDEX IF NOT EXISTS idx_generated_reports_status ON generated_reports(status);
CREATE INDEX IF NOT EXISTS idx_report_templates_type ON report_templates(type);
CREATE INDEX IF NOT EXISTS idx_report_templates_category_id ON report_templates(category_id);
CREATE INDEX IF NOT EXISTS idx_report_categories_slug ON report_categories(slug);
CREATE INDEX IF NOT EXISTS idx_report_exports_report_id ON report_exports(report_id);
CREATE INDEX IF NOT EXISTS idx_report_history_report_id ON report_history(report_id);
