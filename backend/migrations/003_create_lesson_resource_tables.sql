BEGIN;

CREATE TABLE IF NOT EXISTS lessons (
  id                   SERIAL PRIMARY KEY,
  module_id            INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title                VARCHAR(255) NOT NULL,
  video_url            VARCHAR(500),
  hls_url              VARCHAR(500),
  thumbnail_url        VARCHAR(500),
  duration_sec         INTEGER,
  status               VARCHAR(50) NOT NULL DEFAULT 'draft'
                       CHECK (status IN ('draft', 'published', 'unpublished')),
  prerequisites        TEXT[],
  chapter_markers      JSONB,
  archived_video_urls  TEXT[],
  order_index          INTEGER NOT NULL DEFAULT 0,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resources (
  id          SERIAL PRIMARY KEY,
  lesson_id   INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  course_id   INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  file_url    VARCHAR(500) NOT NULL,
  type        VARCHAR(50) NOT NULL
              CHECK (type IN ('pdf', 'slide', 'link', 'code', 'video')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT resource_parent_check CHECK (
    lesson_id IS NOT NULL OR course_id IS NOT NULL
  )
);

CREATE INDEX IF NOT EXISTS idx_lessons_module_id
  ON lessons(module_id);

CREATE INDEX IF NOT EXISTS idx_lessons_prerequisites
  ON lessons USING GIN(prerequisites);

CREATE INDEX IF NOT EXISTS idx_lessons_status
  ON lessons(status);

COMMIT;