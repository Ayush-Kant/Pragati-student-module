-- 006_create_assessments_minimal.sql
-- Minimal assessments table so recruitment_drives.assigned_test_id can have a
-- real FK target. Fields based on PRD section 8.3 (Assessment & Evaluation
-- Control). This is intentionally minimal — the full Assessment module
-- (MCQ/coding editors, questions, publish workflow) is owned by a separate
-- team/issue and will likely extend this table later.

CREATE TABLE IF NOT EXISTS assessments (
  id            SERIAL PRIMARY KEY,
  title         VARCHAR(255) NOT NULL,
  type          VARCHAR(20) NOT NULL DEFAULT 'mcq' CHECK (type IN ('mcq', 'coding')),
  difficulty    VARCHAR(20) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  time_limit_minutes INTEGER,
  total_marks   INTEGER,
  archived      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Now that assessments exists, add the FK that the original spec asked for.
DO $$ BEGIN
  ALTER TABLE recruitment_drives
    ADD CONSTRAINT recruitment_drives_assigned_test_fk
    FOREIGN KEY (assigned_test_id) REFERENCES assessments(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Dummy data so assign-test can be tested end to end.
INSERT INTO assessments (title, type, difficulty, time_limit_minutes, total_marks)
VALUES
  ('MERN Stack Screening Test', 'MCQ', 'Medium', 45, 100),
  ('DSA Coding Round', 'Coding', 'Hard', 60, 100)
ON CONFLICT DO NOTHING;

-- Dummy course data so assign-course's success path can also be tested
-- (courses table existed already but had 0 rows).
INSERT INTO courses (title, description, mentor_id)
SELECT 'MERN Full Stack Development', 'Covers MongoDB, Express, React, Node end to end.', m.id
FROM mentors m
LIMIT 1
ON CONFLICT DO NOTHING;