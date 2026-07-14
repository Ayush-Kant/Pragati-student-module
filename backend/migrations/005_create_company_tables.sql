CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================
-- Companies v2 Table
-- =====================================

CREATE TABLE IF NOT EXISTS companies_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    industry VARCHAR(100),
    size VARCHAR(50),
    description TEXT,
    logo_url TEXT,
    verification_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================
-- Company Team Members Table
-- =====================================

CREATE TABLE IF NOT EXISTS company_team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    user_id UUID,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES companies_v2 (id) ON DELETE CASCADE
);

-- =====================================
-- Indexes
-- =====================================

CREATE INDEX IF NOT EXISTS idx_company_name ON companies (name);
CREATE INDEX IF NOT EXISTS idx_company_team_company_id ON company_team_members (company_id);
CREATE INDEX IF NOT EXISTS idx_company_team_email ON company_team_members (email);
CREATE INDEX IF NOT EXISTS idx_company_team_role ON company_team_members (role);