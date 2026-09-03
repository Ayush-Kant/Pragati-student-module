BEGIN;

-- SM-07 extends the canonical assessment domain already used by develop.
-- No second quiz domain is introduced.

ALTER TABLE assessments
  ADD COLUMN IF NOT EXISTS max_attempts INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS available_from TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS due_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS review_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS review_available_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS shuffle_questions BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS shuffle_options BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS passing_percentage NUMERIC(5,2) NOT NULL DEFAULT 40;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'assessments'::regclass
      AND conname = 'chk_assessments_max_attempts'
  ) THEN
    ALTER TABLE assessments
      ADD CONSTRAINT chk_assessments_max_attempts CHECK (max_attempts >= 1);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'assessments'::regclass
      AND conname = 'chk_assessments_passing_percentage'
  ) THEN
    ALTER TABLE assessments
      ADD CONSTRAINT chk_assessments_passing_percentage CHECK (passing_percentage BETWEEN 0 AND 100);
  END IF;
END $$;

-- The legacy question type constraint predates SM-07. Replace only the type
-- constraint so existing Technical/Behavioural/Aptitude/Design/MCQ/Coding data
-- remains valid while adding the four required student assessment types.
DO $$
DECLARE
  constraint_row RECORD;
BEGIN
  FOR constraint_row IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'assessment_questions'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%type%'
  LOOP
    EXECUTE format('ALTER TABLE assessment_questions DROP CONSTRAINT IF EXISTS %I', constraint_row.conname);
  END LOOP;
END $$;

ALTER TABLE assessment_questions
  ADD COLUMN IF NOT EXISTS correct_answer JSONB,
  ADD COLUMN IF NOT EXISTS explanation TEXT,
  ADD COLUMN IF NOT EXISTS is_required BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE assessment_questions
  ADD CONSTRAINT chk_assessment_question_type_sm07
  CHECK (UPPER(type) IN (
    'TECHNICAL', 'BEHAVIOURAL', 'APTITUDE', 'DESIGN', 'MCQ', 'CODING',
    'TRUE_FALSE', 'TRUE/FALSE', 'TRUEFALSE',
    'FILL_BLANK', 'FILL-IN-THE-BLANK', 'FILL IN THE BLANK', 'FIB',
    'MATCH', 'MATCH-THE-FOLLOWING', 'MATCH THE FOLLOWING'
  ));

ALTER TABLE student_assessment_attempt_questions
  ADD COLUMN IF NOT EXISTS option_order JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE TABLE IF NOT EXISTS activity_submissions (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  assessment_id INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  attempt_id INTEGER NOT NULL REFERENCES student_assessment_attempts(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL DEFAULT 'assessment',
  score NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_marks NUMERIC(10,2) NOT NULL DEFAULT 0,
  percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'submitted',
  time_taken_seconds INTEGER NOT NULL DEFAULT 0,
  tab_switch_count INTEGER NOT NULL DEFAULT 0,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (attempt_id)
);

-- A few older developer databases may already contain a relation named
-- activity_submissions or student_assessment_attempts with a reduced schema.
-- Keep SM-07 resilient to that case before creating the covering indexes.
ALTER TABLE activity_submissions
  ADD COLUMN IF NOT EXISTS assessment_id INTEGER;

ALTER TABLE activity_submissions
  ADD COLUMN IF NOT EXISTS student_id INTEGER;

ALTER TABLE student_assessment_attempts
  ADD COLUMN IF NOT EXISTS assessment_id INTEGER;

ALTER TABLE student_assessment_attempts
  ADD COLUMN IF NOT EXISTS student_id INTEGER;

CREATE INDEX IF NOT EXISTS idx_sm07_activity_submissions_student_assessment
  ON activity_submissions(student_id, assessment_id, submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_sm07_activity_submissions_student
  ON activity_submissions(student_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_sm07_assessment_attempts_student_assessment
  ON student_assessment_attempts(student_id, assessment_id, attempt_number DESC);

CREATE INDEX IF NOT EXISTS idx_sm07_assessment_attempt_questions_order
  ON student_assessment_attempt_questions(attempt_id, question_order);

-- Normalize the existing demo assessment into a fully testable SM-07 fixture.
UPDATE assessments
SET max_attempts = 2,
    review_enabled = TRUE,
    review_available_at = NULL,
    shuffle_questions = TRUE,
    shuffle_options = TRUE,
    passing_percentage = 40
WHERE title = 'MERN Stack Screening Test'
  AND type = 'MCQ';

-- A compact deterministic fixture exercising all four SM-07 question types.
INSERT INTO assessments (
  title, type, difficulty, time_limit_minutes, total_marks, status,
  max_attempts, review_enabled, shuffle_questions, shuffle_options,
  passing_percentage, published_at
)
SELECT
  'SM-07 Assessment Types Demo', 'MCQ', 'Medium', 20, 40, 'active',
  2, TRUE, TRUE, TRUE, 40, NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM assessments WHERE title = 'SM-07 Assessment Types Demo'
);

INSERT INTO assessment_questions (
  assessment_id, type, question_text, options, correct_option,
  correct_answer, explanation, marks
)
SELECT a.id, seed.type, seed.question_text, seed.options::jsonb,
       seed.correct_option, seed.correct_answer::jsonb, seed.explanation, 10
FROM assessments a
CROSS JOIN (
  VALUES
    ('MCQ', 'Which HTTP method is conventionally used to create a resource?',
      '["GET","POST","PUT","DELETE"]', 1, '1',
      'POST is conventionally used to create a new resource.'),
    ('TRUE_FALSE', 'React components can receive read-only inputs called props.',
      '["True","False"]', NULL, 'true',
      'Props are inputs supplied by a parent and should be treated as read-only by the child.'),
    ('FILL_BLANK', 'The JavaScript method commonly used to create a new array by transforming every element is ____.',
      NULL, NULL, '["map"]',
      'Array.prototype.map returns a new array containing transformed elements.'),
    ('MATCH', 'Match each layer to its responsibility.',
      '{"left":["Route","Controller","Service","Model"],"right":["SQL/data access","HTTP transport","Business logic","Request orchestration"]}', NULL,
      '{"Route":"Request orchestration","Controller":"HTTP transport","Service":"Business logic","Model":"SQL/data access"}',
      'Routes map requests, controllers handle HTTP concerns, services contain business logic, and models handle persistence.')
) seed(type, question_text, options, correct_option, correct_answer, explanation)
WHERE a.title = 'SM-07 Assessment Types Demo'
  AND NOT EXISTS (
    SELECT 1 FROM assessment_questions q
    WHERE q.assessment_id = a.id AND q.question_text = seed.question_text
  );

COMMIT;
