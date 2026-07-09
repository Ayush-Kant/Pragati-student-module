CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================
-- Companies Table
-- =====================================

CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE companies ADD COLUMN IF NOT EXISTS website VARCHAR(255);
ALTER TABLE companies ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'pending';

-- =====================================
-- Company Team Members Table
-- =====================================

CREATE TABLE IF NOT EXISTS company_team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    company_id INTEGER NOT NULL,
    user_id UUID,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
);

-- =====================================
-- Indexes
-- =====================================

CREATE INDEX IF NOT EXISTS idx_company_name ON companies (name);

CREATE INDEX IF NOT EXISTS idx_company_team_company_id ON company_team_members (company_id);

CREATE INDEX IF NOT EXISTS idx_company_team_email ON company_team_members (email);

CREATE INDEX IF NOT EXISTS idx_company_team_role ON company_team_members (role);