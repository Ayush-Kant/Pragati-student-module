-- ── COURSES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
  id           SERIAL PRIMARY KEY,
  mentor_id    INTEGER NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  drive_id     INTEGER REFERENCES recruitment_drives(id) ON DELETE SET NULL,
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  skill_tags   TEXT[],
  status       VARCHAR(50) NOT NULL DEFAULT 'draft'
               CHECK (status IN ('draft', 'published', 'archived')),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── MODULES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS modules (
  id           SERIAL PRIMARY KEY,
  course_id    INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title        VARCHAR(255) NOT NULL,
  order_index  INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── INDEXES ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_courses_mentor_id
  ON courses(mentor_id);

CREATE INDEX IF NOT EXISTS idx_courses_skill_tags
  ON courses USING GIN(skill_tags);

CREATE INDEX IF NOT EXISTS idx_modules_course_id
  ON modules(course_id);

-- Add deferred circular references after both tables are created
ALTER TABLE recruitment_drives
  ADD CONSTRAINT fk_recruitment_drives_assigned_course
  FOREIGN KEY (assigned_course_id) REFERENCES courses(id)
  ON DELETE SET NULL;