-- Student placement intelligence foundation.
-- Adapted from student-team's placement module to the canonical PostgreSQL/Pool
-- architecture used by develop. No student-facing composite readiness score is
-- exposed by the API.

CREATE TABLE IF NOT EXISTS job_applications (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  job_title VARCHAR(255) NOT NULL,
  job_id VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'APPLIED',
  applied_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  history JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_job_applications_student_created
  ON job_applications(student_id, created_at DESC);

CREATE TABLE IF NOT EXISTS placement_interviews (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  application_id INTEGER REFERENCES job_applications(id) ON DELETE SET NULL,
  company_name VARCHAR(255) NOT NULL,
  job_title VARCHAR(255),
  date_time TIMESTAMPTZ NOT NULL,
  location VARCHAR(255) NOT NULL DEFAULT 'Online',
  type VARCHAR(50) NOT NULL DEFAULT 'TECHNICAL',
  status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
  feedback TEXT,
  score INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_placement_interviews_student_date
  ON placement_interviews(student_id, date_time);

CREATE TABLE IF NOT EXISTS placement_interview_rounds (
  id SERIAL PRIMARY KEY,
  interview_id INTEGER NOT NULL REFERENCES placement_interviews(id) ON DELETE CASCADE,
  round_name VARCHAR(255) NOT NULL,
  round_order INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  feedback TEXT,
  score INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skill_readiness (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  skill_name VARCHAR(255) NOT NULL,
  current_score INTEGER NOT NULL DEFAULT 0 CHECK (current_score BETWEEN 0 AND 100),
  target_score INTEGER NOT NULL DEFAULT 80 CHECK (target_score BETWEEN 0 AND 100),
  priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
  category VARCHAR(100) NOT NULL DEFAULT 'Technical',
  last_evaluated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_skill_readiness_student_skill
  ON skill_readiness(student_id, LOWER(skill_name));

CREATE TABLE IF NOT EXISTS career_recommendations (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
  reason TEXT NOT NULL,
  current_state VARCHAR(255),
  target_state VARCHAR(255),
  recommended_action TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_career_recommendations_student
  ON career_recommendations(student_id, created_at DESC);

-- Development fixtures for the existing demo student. These are deliberately
-- idempotent and are not exposed as a synthetic readiness score.
INSERT INTO job_applications (student_id, company_name, job_title, job_id, status, applied_date, notes, history)
SELECT s.id, seed.company_name, seed.job_title, seed.job_id, seed.status, NOW() - seed.days_ago * INTERVAL '1 day', seed.notes,
       jsonb_build_array(jsonb_build_object('status', seed.status, 'changedAt', (NOW() - seed.days_ago * INTERVAL '1 day')::text, 'note', seed.notes))
FROM students s
CROSS JOIN (
  VALUES
    ('TechCorp', 'Junior Full Stack Developer', 'TC-MERN-01', 'SHORTLISTED', 8, 'Strong React and Node fundamentals.'),
    ('InnovateX', 'Backend Engineer Intern', 'IX-BE-07', 'APPLIED', 3, 'Application tracked from company portal.')
) seed(company_name, job_title, job_id, status, days_ago, notes)
WHERE LOWER(s.email) = 'student@demo.edu'
  AND NOT EXISTS (
    SELECT 1 FROM job_applications a
    WHERE a.student_id = s.id AND a.company_name = seed.company_name AND a.job_title = seed.job_title
  );

INSERT INTO placement_interviews (student_id, application_id, company_name, job_title, date_time, location, type, status)
SELECT s.id, a.id, a.company_name, a.job_title, NOW() + INTERVAL '3 days', 'Online', 'TECHNICAL', 'SCHEDULED'
FROM students s
JOIN job_applications a ON a.student_id = s.id AND a.company_name = 'TechCorp'
WHERE LOWER(s.email) = 'student@demo.edu'
  AND NOT EXISTS (
    SELECT 1 FROM placement_interviews i WHERE i.student_id = s.id AND i.application_id = a.id
  );

INSERT INTO skill_readiness (student_id, skill_name, current_score, target_score, priority, category)
SELECT s.id, seed.skill_name, seed.current_score, seed.target_score, seed.priority, seed.category
FROM students s
CROSS JOIN (
  VALUES
    ('React',72,85,'HIGH','Frontend'),
    ('Node.js',78,85,'MEDIUM','Backend'),
    ('Data Structures',61,85,'HIGH','Computer Science'),
    ('SQL',69,80,'MEDIUM','Database'),
    ('Communication',76,85,'MEDIUM','Professional')
) seed(skill_name, current_score, target_score, priority, category)
WHERE LOWER(s.email) = 'student@demo.edu'
  AND NOT EXISTS (
    SELECT 1 FROM skill_readiness r WHERE r.student_id = s.id AND LOWER(r.skill_name) = LOWER(seed.skill_name)
  );

INSERT INTO career_recommendations (student_id, title, priority, reason, current_state, target_state, recommended_action)
SELECT s.id, seed.title, seed.priority, seed.reason, seed.current_state, seed.target_state, seed.recommended_action
FROM students s
CROSS JOIN (
  VALUES
    ('Strengthen DSA fundamentals','HIGH','Your tracked DSA readiness is below the target needed for technical screening rounds.','61/100','85/100','Complete two DSA practice sessions each week and review failed problems.'),
    ('Improve React depth','HIGH','React is a strong foundation area but still has a meaningful target gap.','72/100','85/100','Finish the React course modules and build one component-focused project.'),
    ('Keep interview readiness active','MEDIUM','You have a scheduled technical interview, so targeted practice should continue.','Interview scheduled','Interview-ready','Review project architecture and rehearse concise technical explanations.')
) seed(title, priority, reason, current_state, target_state, recommended_action)
WHERE LOWER(s.email) = 'student@demo.edu'
  AND NOT EXISTS (
    SELECT 1 FROM career_recommendations r WHERE r.student_id = s.id AND r.title = seed.title
  );
