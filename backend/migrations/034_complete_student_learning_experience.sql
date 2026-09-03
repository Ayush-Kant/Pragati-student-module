-- Student Learning Experience completion layer (SM-04)
-- Extends the existing develop learning schema without replacing it.

ALTER TABLE course_modules
  ADD COLUMN IF NOT EXISTS prerequisite_module_id INTEGER REFERENCES course_modules(id) ON DELETE SET NULL;

ALTER TABLE lessons
  ADD COLUMN IF NOT EXISTS transcript_url TEXT,
  ADD COLUMN IF NOT EXISTS chapter_markers JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE lesson_progress
  ADD COLUMN IF NOT EXISTS watched_seconds INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_seconds INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS progress_pct INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMPTZ;

ALTER TABLE learning_resources
  ADD COLUMN IF NOT EXISTS mime_type VARCHAR(120),
  ADD COLUMN IF NOT EXISTS file_size_bytes BIGINT,
  ADD COLUMN IF NOT EXISTS storage_key TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_lesson_progress_watched_seconds'
  ) THEN
    ALTER TABLE lesson_progress
      ADD CONSTRAINT chk_lesson_progress_watched_seconds
      CHECK (watched_seconds >= 0 AND total_seconds >= 0 AND watched_seconds <= total_seconds);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_lesson_progress_pct'
  ) THEN
    ALTER TABLE lesson_progress
      ADD CONSTRAINT chk_lesson_progress_pct
      CHECK (progress_pct BETWEEN 0 AND 100);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_course_modules_prerequisite ON course_modules(prerequisite_module_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_student_updated ON lesson_progress(student_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS student_notes (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  timestamp_seconds INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_student_note_timestamp CHECK (timestamp_seconds IS NULL OR timestamp_seconds >= 0)
);

CREATE INDEX IF NOT EXISTS idx_student_notes_student_lesson ON student_notes(student_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_student_notes_updated ON student_notes(student_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS resource_downloads (
  id BIGSERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  resource_id INTEGER NOT NULL REFERENCES learning_resources(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resource_downloads_student ON resource_downloads(student_id, downloaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_resource_downloads_resource ON resource_downloads(resource_id, downloaded_at DESC);

DROP TRIGGER IF EXISTS trg_student_notes_updated_at ON student_notes;
CREATE TRIGGER trg_student_notes_updated_at
  BEFORE UPDATE ON student_notes
  FOR EACH ROW EXECUTE FUNCTION update_student_learning_updated_at();

-- Populate richer learning metadata for the deterministic demo content.
UPDATE lessons
SET chapter_markers = CASE
  WHEN title = 'Component Design' THEN '[{"timestamp":0,"label":"Reusable component boundaries"},{"timestamp":600,"label":"Props and composition"}]'::jsonb
  WHEN title = 'State and Effects' THEN '[{"timestamp":0,"label":"State fundamentals"},{"timestamp":780,"label":"Effect dependencies"}]'::jsonb
  WHEN title = 'REST API Structure' THEN '[{"timestamp":0,"label":"Routes and controllers"},{"timestamp":840,"label":"Service boundaries"}]'::jsonb
  WHEN title = 'Validation and Errors' THEN '[{"timestamp":0,"label":"Input validation"},{"timestamp":660,"label":"Consistent error responses"}]'::jsonb
  WHEN title = 'PostgreSQL Modeling' THEN '[{"timestamp":0,"label":"Keys and relationships"},{"timestamp":900,"label":"Indexes"}]'::jsonb
  WHEN title = 'Transactions' THEN '[{"timestamp":0,"label":"Transaction boundaries"},{"timestamp":540,"label":"Rollback and consistency"}]'::jsonb
  ELSE chapter_markers
END
WHERE chapter_markers = '[]'::jsonb;

-- Make the learning path sequential while preserving the existing courses.
UPDATE course_modules current_module
SET prerequisite_module_id = previous_module.id
FROM course_modules previous_module
WHERE current_module.course_id = previous_module.course_id
  AND current_module.module_order = previous_module.module_order + 1
  AND current_module.prerequisite_module_id IS NULL;
