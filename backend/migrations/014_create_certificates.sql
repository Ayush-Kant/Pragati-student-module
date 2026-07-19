CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,

    student_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    drive_id INTEGER
        REFERENCES recruitment_drives(id)
        ON DELETE SET NULL,

    certificate_url VARCHAR(255) NOT NULL,

    verify_uuid UUID NOT NULL
        DEFAULT gen_random_uuid()
        UNIQUE,

    score NUMERIC(5,2),

    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    revoked BOOLEAN DEFAULT FALSE,

    revoked_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(student_id, drive_id)
);

CREATE INDEX idx_certificates_verify_uuid
ON certificates(verify_uuid);

CREATE INDEX idx_certificates_student_id
ON certificates(student_id);
