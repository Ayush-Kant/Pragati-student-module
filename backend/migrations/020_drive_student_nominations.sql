-- ============================================================
-- Drive-scoped nomination tables
-- All student_id columns reference students(id) directly
-- because eligible_students is now a view, not a table.
-- ============================================================

-- 1. Drive Nominees — students registered/awaiting approval for a drive
CREATE TABLE IF NOT EXISTS drive_nominees (
  id             SERIAL PRIMARY KEY,
  drive_id       INTEGER NOT NULL REFERENCES placement_drives(id) ON DELETE CASCADE,
  student_id     INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  status         VARCHAR(30) NOT NULL DEFAULT 'Registered'
                 CHECK (status IN ('Registered','Approved','Rejected')),
  approved_by    INTEGER,
  registered_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (drive_id, student_id)
);

-- 2. Drive Nominations — college-nominated students for a specific drive
CREATE TABLE IF NOT EXISTS drive_nominations (
  id             SERIAL PRIMARY KEY,
  drive_id       INTEGER NOT NULL REFERENCES placement_drives(id) ON DELETE CASCADE,
  student_id     INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  nominated_by   INTEGER,
  status         VARCHAR(30) NOT NULL DEFAULT 'Nominated'
                 CHECK (status IN ('Nominated','Shortlisted','Selected','Rejected','Withdrawn')),
  remarks        TEXT,
  nominated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (drive_id, student_id)
);

-- 3. Drive Shortlists — shortlisted students after nomination review
CREATE TABLE IF NOT EXISTS drive_shortlists (
  id             SERIAL PRIMARY KEY,
  drive_id       INTEGER NOT NULL REFERENCES placement_drives(id) ON DELETE CASCADE,
  nomination_id  INTEGER NOT NULL REFERENCES drive_nominations(id) ON DELETE CASCADE,
  student_id     INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  shortlisted_by INTEGER,
  round          VARCHAR(50) NOT NULL DEFAULT 'Initial',
  status         VARCHAR(30) NOT NULL DEFAULT 'Shortlisted'
                 CHECK (status IN ('Shortlisted','Selected','Rejected','On Hold')),
  remarks        TEXT,
  shortlisted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (drive_id, student_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_drive_nominees_drive     ON drive_nominees(drive_id);
CREATE INDEX IF NOT EXISTS idx_drive_nominees_student   ON drive_nominees(student_id);
CREATE INDEX IF NOT EXISTS idx_drive_nominations_drive  ON drive_nominations(drive_id);
CREATE INDEX IF NOT EXISTS idx_drive_nominations_student ON drive_nominations(student_id);
CREATE INDEX IF NOT EXISTS idx_drive_nominations_status  ON drive_nominations(status);
CREATE INDEX IF NOT EXISTS idx_drive_shortlists_drive    ON drive_shortlists(drive_id);
CREATE INDEX IF NOT EXISTS idx_drive_shortlists_student  ON drive_shortlists(student_id);
