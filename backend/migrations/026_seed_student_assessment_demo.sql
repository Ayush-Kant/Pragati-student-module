-- Development-safe seed for the student assessment flow.
-- The canonical assessment tables are created by 006_create_assessments.sql.
-- This migration publishes the existing seeded screening assessment and adds
-- deterministic MCQ content so a fresh local database has a usable student flow.

UPDATE assessments
SET status = 'active',
    archived = FALSE,
    published_at = COALESCE(published_at, NOW()),
    updated_at = NOW()
WHERE title = 'MERN Stack Screening Test'
  AND type = 'MCQ';

INSERT INTO assessment_questions (
  assessment_id,
  type,
  question_text,
  options,
  correct_option,
  marks
)
SELECT
  a.id,
  'MCQ',
  seed.question_text,
  seed.options::jsonb,
  seed.correct_option,
  seed.marks
FROM assessments a
CROSS JOIN (
  VALUES
    (
      'Which React hook is used to perform side effects in a functional component?',
      '["useState","useEffect","useMemo","useRef"]',
      1,
      20
    ),
    (
      'Which keyword declares a block-scoped variable in JavaScript?',
      '["var","let","function","global"]',
      1,
      20
    ),
    (
      'What is the primary purpose of Array.prototype.map()?',
      '["Mutate the source array only","Create a new array from transformed elements","Remove the first element","Sort an array in place"]',
      1,
      20
    ),
    (
      'Which HTTP method is conventionally used to create a new resource?',
      '["GET","POST","PUT","DELETE"]',
      1,
      20
    ),
    (
      'Which statement about React props is correct?',
      '["Props are read-only inputs passed from a parent","Props can only contain strings","Props automatically mutate child state","Props are stored globally by React"]',
      0,
      20
    )
) AS seed(question_text, options, correct_option, marks)
WHERE a.title = 'MERN Stack Screening Test'
  AND a.type = 'MCQ'
  AND NOT EXISTS (
    SELECT 1
    FROM assessment_questions aq
    WHERE aq.assessment_id = a.id
      AND aq.question_text = seed.question_text
  );
