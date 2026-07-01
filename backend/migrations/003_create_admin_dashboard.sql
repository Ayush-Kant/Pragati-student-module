
CREATE TABLE IF NOT EXISTS companies (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS colleges (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recruitment_drives (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(255) NOT NULL,
  company_id INTEGER NOT NULL REFERENCES companies(id),
  mentor_id  INTEGER REFERENCES users(id),
  status     VARCHAR(50) NOT NULL DEFAULT 'active'
             CHECK (status IN ('active','closed','draft')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_drive_progress (
  id         SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES users(id),
  drive_id   INTEGER NOT NULL REFERENCES recruitment_drives(id),
  college_id INTEGER REFERENCES colleges(id),
  company_id INTEGER REFERENCES companies(id),
  stage      VARCHAR(50) NOT NULL DEFAULT 'applied'
             CHECK (stage IN ('applied','tested','trained','selected')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, drive_id)
);

CREATE TABLE admin_audit_log (
  id          SERIAL PRIMARY KEY,
  admin_id    INTEGER NOT NULL REFERENCES users(id),
  action      VARCHAR(100) NOT NULL,
  target_type VARCHAR(50) NOT NULL,
  target_id   INTEGER,
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sdp_stage
ON student_drive_progress(stage);

CREATE INDEX IF NOT EXISTS idx_sdp_college_id
ON student_drive_progress(college_id);

CREATE INDEX IF NOT EXISTS idx_sdp_company_id
ON student_drive_progress(company_id);

CREATE INDEX IF NOT EXISTS idx_sdp_drive_id
ON student_drive_progress(drive_id);

CREATE INDEX IF NOT EXISTS idx_audit_created
ON admin_audit_log(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_admin_id
ON admin_audit_log(admin_id);


