

CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    industry VARCHAR(100),
    size VARCHAR(50),
    location VARCHAR(255),
    website VARCHAR(255),
    description TEXT,
    logo_url TEXT,
    default_work_mode VARCHAR(50) DEFAULT 'Hybrid',
    probation_period INTEGER DEFAULT 3,
    notice_period INTEGER DEFAULT 30,
    currency VARCHAR(10) DEFAULT 'INR',
    notifications JSONB DEFAULT '{"emailNotifications": true, "interviewReminders": true, "weeklyAnalyticsReport": false, "offerNotifications": true}',
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','suspended')),
    verification_status VARCHAR(50) DEFAULT 'pending',
    rejection_reason TEXT,
    suspension_reason TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
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

CREATE TABLE student_drive_progress (
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

CREATE INDEX idx_sdp_stage
ON student_drive_progress(stage);

CREATE INDEX idx_sdp_college_id
ON student_drive_progress(college_id);

CREATE INDEX idx_sdp_company_id
ON student_drive_progress(company_id);

CREATE INDEX idx_sdp_drive_id
ON student_drive_progress(drive_id);

CREATE INDEX idx_audit_created
ON admin_audit_log(created_at DESC);

CREATE INDEX idx_audit_admin_id
ON admin_audit_log(admin_id);


