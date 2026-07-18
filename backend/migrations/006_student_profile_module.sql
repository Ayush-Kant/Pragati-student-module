-- ─────────────────────────────────────────────────────────────────────────────
--  006_student_profile_module.sql
--  Student Profile Management — additional tables.
--
--  New tables in this migration:
--    • student_profiles   — extended profile fields (bio, avatar, address)
--    • academic_details   — degree, CGPA, semester, institution
--    • certifications     — named certifications with issuer & dates
--    • student_documents  — general document storage (not resume-specific)
--
--  Pre-existing tables (NOT modified):
--    • students            (Students.sql)
--    • student_skills      (schema.sql)
--    • student_resumes     (schema.sql)
--    • student_social_links (schema.sql)
--    • student_portfolios  (schema.sql)
--    • student_projects    (schema.sql)
-- ─────────────────────────────────────────────────────────────────────────────

-- ── STUDENT PROFILES ─────────────────────────────────────────────────────────
-- Extended profile data that supplements the core `students` table.
CREATE TABLE IF NOT EXISTS student_profiles (
    id                  SERIAL PRIMARY KEY,
    student_id          INT NOT NULL UNIQUE,
    avatar_url          TEXT,
    bio                 TEXT,
    address_line1       VARCHAR(255),
    address_line2       VARCHAR(255),
    city                VARCHAR(100),
    state               VARCHAR(100),
    country             VARCHAR(100) DEFAULT 'India',
    pincode             VARCHAR(20),
    alternate_phone     VARCHAR(20),
    alternate_email     VARCHAR(255),
    date_of_birth       DATE,
    gender              VARCHAR(30),
    profile_completeness INT DEFAULT 0 CHECK (profile_completeness BETWEEN 0 AND 100),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_student_profiles_student
        FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_student_profiles_student_id
    ON student_profiles(student_id);

-- ── ACADEMIC DETAILS ─────────────────────────────────────────────────────────
-- One-to-one academic record per student.
CREATE TABLE IF NOT EXISTS academic_details (
    id                  SERIAL PRIMARY KEY,
    student_id          INT NOT NULL UNIQUE,
    institution_name    VARCHAR(255),
    department          VARCHAR(150),
    course              VARCHAR(150),
    degree              VARCHAR(100),
    semester            SMALLINT CHECK (semester BETWEEN 1 AND 12),
    graduation_year     SMALLINT,
    cgpa                NUMERIC(4, 2) CHECK (cgpa >= 0.00 AND cgpa <= 10.00),
    enrollment_number   VARCHAR(100),
    admission_year      SMALLINT,
    academic_email      VARCHAR(255),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_academic_details_student
        FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_academic_details_student_id
    ON academic_details(student_id);

CREATE INDEX IF NOT EXISTS idx_academic_details_cgpa
    ON academic_details(cgpa);

-- ── CERTIFICATIONS ───────────────────────────────────────────────────────────
-- Named certifications; multiple per student.
CREATE TABLE IF NOT EXISTS certifications (
    id                  SERIAL PRIMARY KEY,
    student_id          INT NOT NULL,
    name                VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255),
    issue_date          DATE,
    expiry_date         DATE,
    credential_id       VARCHAR(200),
    credential_url      TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_certifications_student
        FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE,
    -- Prevent exact duplicates (same cert name from same org for same student)
    CONSTRAINT uq_student_certification UNIQUE (student_id, name, issuing_organization)
);

CREATE INDEX IF NOT EXISTS idx_certifications_student_id
    ON certifications(student_id);

-- ── STUDENT DOCUMENTS ────────────────────────────────────────────────────────
-- General document storage (marksheets, ID proofs, offer letters, etc.).
-- Resumes are still handled by the existing student_resumes table.
CREATE TABLE IF NOT EXISTS student_documents (
    id                  SERIAL PRIMARY KEY,
    student_id          INT NOT NULL,
    document_name       VARCHAR(255) NOT NULL,
    document_type       VARCHAR(100),          -- e.g. 'marksheet', 'id_proof', 'offer_letter'
    document_url        TEXT NOT NULL,
    file_name           VARCHAR(255),
    file_size           BIGINT,
    mime_type           VARCHAR(100),
    uploaded_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_student_documents_student
        FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_student_documents_student_id
    ON student_documents(student_id);

CREATE INDEX IF NOT EXISTS idx_student_documents_type
    ON student_documents(student_id, document_type);
