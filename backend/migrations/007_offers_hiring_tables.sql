-- 007_offers_hiring_tables.sql
-- Dependency-ordered tables for the offers/hiring module


-- 1. COMPANIES V2 (independent table)
CREATE TABLE IF NOT EXISTS companies_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    legal_name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    cin VARCHAR(100) UNIQUE,
    gstin VARCHAR(100) UNIQUE,
    pan VARCHAR(100) UNIQUE,
    industry VARCHAR(100),
    sector VARCHAR(100),
    company_size VARCHAR(50) CHECK (
        company_size IN (
            'STARTUP',
            'SME',
            'MID_MARKET',
            'ENTERPRISE',
            'MNC'
        )
    ),
    verification_status VARCHAR(50) DEFAULT 'PENDING' CHECK (
        verification_status IN (
            'PENDING',
            'UNDER_REVIEW',
            'VERIFIED',
            'REJECTED',
            'SUSPENDED'
        )
    ),
    subscription_tier VARCHAR(50) DEFAULT 'FREE' CHECK (
        subscription_tier IN (
            'FREE',
            'BASIC',
            'PROFESSIONAL',
            'ENTERPRISE'
        )
    ),
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 2. CANDIDATES (independent table)
CREATE TABLE IF NOT EXISTS candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    college_id UUID,
    current_location VARCHAR(255),
    resume_url TEXT,
    graduation_year INTEGER,
    cgpa NUMERIC(4, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 3. RECRUITMENT DRIVES V2 (depends on companies_v2)
CREATE TABLE IF NOT EXISTS recruitment_drives_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    company_id UUID NOT NULL REFERENCES companies_v2 (id),
    drive_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'DRAFT' CHECK (
        status IN (
            'DRAFT',
            'PENDING_APPROVAL',
            'APPROVED',
            'ACTIVE',
            'COMPLETED',
            'CANCELLED'
        )
    ),
    ctc_details JSONB,
    total_positions INTEGER DEFAULT 0,
    filled_positions INTEGER DEFAULT 0,
    registration_start TIMESTAMPTZ,
    registration_end TIMESTAMPTZ,
    drive_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 4. OFFERS V2 (depends on recruitment_drives_v2, candidates)
CREATE TABLE IF NOT EXISTS offers_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    drive_id UUID NOT NULL REFERENCES recruitment_drives_v2 (id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES candidates (id) ON DELETE CASCADE,
    offer_letter_number VARCHAR(100) UNIQUE NOT NULL,
    gross_ctc NUMERIC(12, 2) NOT NULL,
    net_ctc NUMERIC(12, 2),
    fixed_component NUMERIC(12, 2),
    variable_component NUMERIC(12, 2),
    joining_date DATE,
    offer_document_url TEXT,
    offer_status VARCHAR(50) NOT NULL DEFAULT 'DRAFT' CHECK (
        offer_status IN (
            'DRAFT',
            'SENT',
            'ACCEPTED',
            'DECLINED',
            'REVOKED',
            'EXPIRED',
            'LAPSED'
        )
    ),
    candidate_response_at TIMESTAMPTZ,
    candidate_remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (drive_id, candidate_id)
);


-- 5. OFFER AMENDMENTS (depends on offers_v2)
CREATE TABLE IF NOT EXISTS offer_amendments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    offer_id UUID NOT NULL REFERENCES offers_v2 (id) ON DELETE CASCADE,
    amendment_type VARCHAR(100) NOT NULL,
    old_values JSONB NOT NULL,
    new_values JSONB NOT NULL,
    reason TEXT NOT NULL,
    candidate_acknowledgement BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 6. CANDIDATE DRIVE MAPPING (depends on candidates, recruitment_drives_v2)
CREATE TABLE IF NOT EXISTS candidate_drive_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    candidate_id UUID NOT NULL REFERENCES candidates (id),
    drive_id UUID NOT NULL REFERENCES recruitment_drives_v2 (id),
    current_stage VARCHAR(50) DEFAULT 'APPLIED' CHECK (
        current_stage IN (
            'APPLIED',
            'SCREENED',
            'TRAINED',
            'SHORTLISTED',
            'INTERVIEWED',
            'SELECTED',
            'REJECTED',
            'WITHDRAWN'
        )
    ),
    applied_at TIMESTAMPTZ,
    screened_at TIMESTAMPTZ,
    trained_at TIMESTAMPTZ,
    shortlisted_at TIMESTAMPTZ,
    interviewed_at TIMESTAMPTZ,
    selected_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    rejection_reason TEXT,
    UNIQUE (candidate_id, drive_id)
);


-- 7. INTERVIEWS V2 (depends on recruitment_drives_v2, candidates)
CREATE TABLE IF NOT EXISTS interviews_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    drive_id UUID NOT NULL REFERENCES recruitment_drives_v2 (id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES candidates (id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL,
    mode VARCHAR(50) CHECK (
        mode IN ('ONLINE', 'OFFLINE', 'HYBRID')
    ),
    scheduled_at TIMESTAMPTZ NOT NULL,
    interviewer_name VARCHAR(255),
    meeting_link TEXT,
    feedback TEXT,
    score NUMERIC(5, 2),
    status VARCHAR(50) DEFAULT 'SCHEDULED' CHECK (
        status IN (
            'SCHEDULED',
            'COMPLETED',
            'CANCELLED',
            'NO_SHOW'
        )
    ),
    result VARCHAR(50) CHECK (
        result IN ('PASS', 'FAIL', 'PENDING')
    ),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- Indexes
CREATE INDEX idx_candidates_email ON candidates (email);
CREATE INDEX idx_candidates_college ON candidates (college_id);
CREATE INDEX idx_interviews_v2_drive ON interviews_v2 (drive_id);
CREATE INDEX idx_interviews_v2_candidate ON interviews_v2 (candidate_id);
CREATE INDEX idx_interviews_v2_scheduled ON interviews_v2 (scheduled_at);
CREATE INDEX idx_offers_v2_drive ON offers_v2 (drive_id);
CREATE INDEX idx_offers_v2_candidate ON offers_v2 (candidate_id);
CREATE INDEX idx_offers_v2_status ON offers_v2 (offer_status);
CREATE INDEX idx_offers_joining_date ON offers_v2 (joining_date);
CREATE INDEX idx_offer_amendments_offer ON offer_amendments (offer_id);
CREATE INDEX idx_offer_amendments_created ON offer_amendments (created_at DESC);


