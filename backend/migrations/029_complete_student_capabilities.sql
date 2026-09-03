-- Additive completion layer for the remaining student-facing PRD capabilities.

ALTER TABLE live_sessions
  ADD COLUMN IF NOT EXISTS meeting_url TEXT,
  ADD COLUMN IF NOT EXISTS drive_id INTEGER;

CREATE INDEX IF NOT EXISTS idx_live_sessions_drive_id ON live_sessions(drive_id);

CREATE TABLE IF NOT EXISTS student_projects (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  objectives JSONB NOT NULL DEFAULT '[]'::jsonb,
  requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
  deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
  tech_stack JSONB NOT NULL DEFAULT '[]'::jsonb,
  resources JSONB NOT NULL DEFAULT '[]'::jsonb,
  evaluation_criteria JSONB NOT NULL DEFAULT '[]'::jsonb,
  deadline TIMESTAMPTZ NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR(50) NOT NULL DEFAULT 'NOT_STARTED',
  mentor_name VARCHAR(255),
  batch_name VARCHAR(255),
  duration_weeks INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_milestones (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES student_projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  deadline TIMESTAMPTZ NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  milestone_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, milestone_order)
);

CREATE TABLE IF NOT EXISTS project_submissions (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES student_projects(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  github_url VARCHAR(500) NOT NULL,
  deployment_url VARCHAR(500),
  description TEXT,
  documentation TEXT,
  report_url VARCHAR(500),
  additional_comments TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED',
  feedback TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, version)
);

CREATE TABLE IF NOT EXISTS project_evaluations (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES student_projects(id) ON DELETE CASCADE,
  score NUMERIC(6,2),
  status VARCHAR(50) NOT NULL DEFAULT 'EVALUATED',
  criteria JSONB NOT NULL DEFAULT '[]'::jsonb,
  strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
  improvements JSONB NOT NULL DEFAULT '[]'::jsonb,
  feedback TEXT,
  evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id)
);

CREATE INDEX IF NOT EXISTS idx_student_projects_student ON student_projects(student_id, deadline);
CREATE INDEX IF NOT EXISTS idx_project_milestones_project ON project_milestones(project_id, milestone_order);
CREATE INDEX IF NOT EXISTS idx_project_submissions_project ON project_submissions(project_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_submissions_student ON project_submissions(student_id, submitted_at DESC);

CREATE TABLE IF NOT EXISTS student_notification_preferences (
  student_id INTEGER PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
  in_app BOOLEAN NOT NULL DEFAULT TRUE,
  email BOOLEAN NOT NULL DEFAULT TRUE,
  push BOOLEAN NOT NULL DEFAULT TRUE,
  assignment_reminders BOOLEAN NOT NULL DEFAULT TRUE,
  assessment_reminders BOOLEAN NOT NULL DEFAULT TRUE,
  interview_updates BOOLEAN NOT NULL DEFAULT TRUE,
  session_reminders BOOLEAN NOT NULL DEFAULT TRUE,
  weekly_digest BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO student_projects (student_id, title, description, deadline, mentor_name, batch_name, duration_weeks, objectives, requirements, deliverables, tech_stack, resources, evaluation_criteria)
SELECT s.id,
       'Student Portfolio Platform',
       'Build a polished portfolio and project showcase that demonstrates full-stack engineering skills.',
       NOW() + INTERVAL '21 days',
       'Training Mentor',
       'Current Student Batch',
       6,
       '["Build responsive portfolio pages", "Showcase technical projects", "Publish a production deployment"]'::jsonb,
       '["React", "API integration", "Responsive UI", "Automated tests"]'::jsonb,
       '["GitHub repository", "Live deployment", "Project report PDF"]'::jsonb,
       '["React", "Node.js", "PostgreSQL", "Tailwind CSS"]'::jsonb,
       '[{"label":"React Documentation","url":"https://react.dev"}]'::jsonb,
       '[{"id":"functionality","criterion":"Functionality & completeness","maxScore":30,"weight":30},{"id":"quality","criterion":"Code quality & architecture","maxScore":30,"weight":30},{"id":"ux","criterion":"UI/UX & responsiveness","maxScore":20,"weight":20},{"id":"documentation","criterion":"Documentation & deployment","maxScore":20,"weight":20}]'::jsonb
FROM students s
WHERE LOWER(s.email) = 'student@demo.edu'
  AND NOT EXISTS (SELECT 1 FROM student_projects p WHERE p.student_id = s.id AND p.title = 'Student Portfolio Platform');

INSERT INTO project_milestones (project_id, title, description, deadline, status, progress, milestone_order)
SELECT p.id, seed.title, seed.description, NOW() + seed.offset_days * INTERVAL '1 day', 'PENDING', 0, seed.milestone_order
FROM student_projects p
CROSS JOIN (
  VALUES
    ('Planning & Setup','Define scope, repository and architecture.',7,1),
    ('Core Implementation','Build the core product experience and API integration.',14,2),
    ('Testing & Deployment','Complete testing, documentation and live deployment.',21,3)
) seed(title, description, offset_days, milestone_order)
WHERE p.title = 'Student Portfolio Platform'
  AND NOT EXISTS (SELECT 1 FROM project_milestones m WHERE m.project_id = p.id AND m.milestone_order = seed.milestone_order);

-- Make the legacy coding round a real student challenge on fresh databases.
UPDATE assessments
SET status = 'active', published_at = COALESCE(published_at, NOW())
WHERE title = 'DSA Coding Round';

INSERT INTO assessment_questions
  (assessment_id, type, problem_statement, language_support, sample_input, sample_output, hidden_test_cases, marks)
SELECT a.id, 'Coding',
       'Given an integer array, return the maximum sum of any contiguous subarray.',
       ARRAY['javascript','python','java','cpp'],
       '[−2,1,−3,4,−1,2,1,−5,4]',
       '6',
       '[{"input":"[5,4,-1,7,8]","output":"23"},{"input":"[-1,-2,-3]","output":"-1"}]'::jsonb,
       100
FROM assessments a
WHERE a.title = 'DSA Coding Round'
  AND NOT EXISTS (
    SELECT 1 FROM assessment_questions q WHERE q.assessment_id = a.id AND q.type IN ('Coding','coding')
  );

INSERT INTO coding_test_cases (challenge_id, input, expected_output, is_hidden, weight_pct)
SELECT a.id, seed.input, seed.expected_output, seed.is_hidden, seed.weight_pct
FROM assessments a
CROSS JOIN (
  VALUES
    ('[-2,1,-3,4,-1,2,1,-5,4]','6',false,25.0),
    ('[5,4,-1,7,8]','23',false,25.0),
    ('[-1,-2,-3]','-1',true,25.0),
    ('[1]','1',true,25.0)
) seed(input, expected_output, is_hidden, weight_pct)
WHERE a.title = 'DSA Coding Round'
  AND NOT EXISTS (
    SELECT 1 FROM coding_test_cases t WHERE t.challenge_id = a.id AND t.input = seed.input
  );

INSERT INTO coding_languages (challenge_id, language_id, language_name)
SELECT a.id, seed.language_id, seed.language_name
FROM assessments a
CROSS JOIN (
  VALUES
    (63,'javascript'),
    (71,'python'),
    (62,'java'),
    (54,'cpp')
) seed(language_id, language_name)
WHERE a.title = 'DSA Coding Round'
  AND NOT EXISTS (
    SELECT 1 FROM coding_languages l WHERE l.challenge_id = a.id AND l.language_id = seed.language_id
  );
