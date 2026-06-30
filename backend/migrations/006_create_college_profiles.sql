-- TABLE: college_profiles
CREATE TABLE IF NOT EXISTS college_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    college_name VARCHAR(255) NOT NULL,
    college_code VARCHAR(100) UNIQUE,
    address TEXT,
    website VARCHAR(255),
    contact_number VARCHAR(20),
    established_year INTEGER,
    accreditation VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_college_profiles_user_id ON college_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_college_profiles_college_name ON college_profiles(college_name);
