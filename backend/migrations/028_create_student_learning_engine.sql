-- Student Learning Engine
--
-- Provides the student-facing course, module, lesson, resource and progress
-- model without replacing the existing college course-management tables.

CREATE TABLE IF NOT EXISTS training_courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL,
    duration VARCHAR(50),
    description TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'published'
        CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_modules (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES training_courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    module_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (course_id, module_order)
);

CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    module_id INTEGER NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url TEXT,
    duration VARCHAR(50),
    lesson_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (module_id, lesson_order)
);

CREATE TABLE IF NOT EXISTS learning_resources (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    resource_type VARCHAR(50),
    file_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_course_progress (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL REFERENCES training_courses(id) ON DELETE CASCADE,
    completed_lessons INTEGER NOT NULL DEFAULT 0,
    total_lessons INTEGER NOT NULL DEFAULT 0,
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (student_id, course_id)
);

CREATE TABLE IF NOT EXISTS lesson_progress (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (student_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_learning_resources_lesson_id ON learning_resources(lesson_id);
CREATE INDEX IF NOT EXISTS idx_student_course_progress_student ON student_course_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_course_progress_course ON student_course_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_student ON lesson_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson ON lesson_progress(lesson_id);

-- Keep updated_at accurate without creating a second generic trigger name.
CREATE OR REPLACE FUNCTION update_student_learning_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_training_courses_updated_at ON training_courses;
CREATE TRIGGER trg_training_courses_updated_at
    BEFORE UPDATE ON training_courses
    FOR EACH ROW EXECUTE FUNCTION update_student_learning_updated_at();

DROP TRIGGER IF EXISTS trg_course_modules_updated_at ON course_modules;
CREATE TRIGGER trg_course_modules_updated_at
    BEFORE UPDATE ON course_modules
    FOR EACH ROW EXECUTE FUNCTION update_student_learning_updated_at();

DROP TRIGGER IF EXISTS trg_lessons_updated_at ON lessons;
CREATE TRIGGER trg_lessons_updated_at
    BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_student_learning_updated_at();

DROP TRIGGER IF EXISTS trg_student_course_progress_updated_at ON student_course_progress;
CREATE TRIGGER trg_student_course_progress_updated_at
    BEFORE UPDATE ON student_course_progress
    FOR EACH ROW EXECUTE FUNCTION update_student_learning_updated_at();

-- Deterministic development courses. These are global published courses and
-- are visible to authenticated students through the student learning API.
INSERT INTO training_courses (title, category, level, duration, description, status)
SELECT seed.title, seed.category, seed.level, seed.duration, seed.description, 'published'
FROM (
    VALUES
      ('MERN Stack Foundations', 'Full Stack Development', 'Beginner', '8 weeks', 'Build a production-minded MERN foundation covering React, Node.js, Express and PostgreSQL-backed application patterns.', 'published'),
      ('Data Structures & Algorithms', 'Computer Science', 'Intermediate', '10 weeks', 'Practice core data structures, algorithmic thinking, complexity analysis and interview-style problem solving.', 'published'),
      ('Placement Readiness Bootcamp', 'Career Development', 'Beginner', '4 weeks', 'Prepare for technical interviews, resumes, communication rounds and structured placement workflows.', 'published')
) AS seed(title, category, level, duration, description, status)
WHERE NOT EXISTS (
    SELECT 1 FROM training_courses existing WHERE existing.title = seed.title
);

-- MERN modules and lessons
INSERT INTO course_modules (course_id, title, description, module_order)
SELECT c.id, seed.title, seed.description, seed.module_order
FROM training_courses c
CROSS JOIN (
    VALUES
      ('React Fundamentals', 'Components, props, state and effects.', 1),
      ('Node & Express APIs', 'Build authenticated REST APIs with validation and error handling.', 2),
      ('Database Integration', 'Connect application services to PostgreSQL and model data safely.', 3)
) AS seed(title, description, module_order)
WHERE c.title = 'MERN Stack Foundations'
  AND NOT EXISTS (
      SELECT 1 FROM course_modules m
      WHERE m.course_id = c.id AND m.module_order = seed.module_order
  );

INSERT INTO lessons (module_id, title, description, video_url, duration, lesson_order)
SELECT m.id, seed.title, seed.description, seed.video_url, seed.duration, seed.lesson_order
FROM course_modules m
JOIN training_courses c ON c.id = m.course_id
CROSS JOIN (
    VALUES
      ('React Fundamentals', 'Component Design', 'Learn reusable component boundaries and props.', 'https://www.youtube.com/watch?v=SqcY0GlETPk', '24 min', 1),
      ('React Fundamentals', 'State and Effects', 'Use state and effects without duplicating application logic.', 'https://www.youtube.com/watch?v=O6P86uwfdR0', '31 min', 2),
      ('Node & Express APIs', 'REST API Structure', 'Design routes, controllers and service boundaries.', 'https://www.youtube.com/watch?v=-MTSQjw5DrM', '28 min', 1),
      ('Node & Express APIs', 'Validation and Errors', 'Build predictable request validation and API error responses.', 'https://www.youtube.com/watch?v=9nvhH-Z8a1M', '22 min', 2),
      ('Database Integration', 'PostgreSQL Modeling', 'Choose keys, indexes and relationships for application data.', 'https://www.youtube.com/watch?v=qw--VYLpxG4', '29 min', 1),
      ('Database Integration', 'Transactions', 'Understand transactional writes and consistency boundaries.', 'https://www.youtube.com/watch?v=HXV3zeQKqGY', '19 min', 2)
) AS seed(module_title, title, description, video_url, duration, lesson_order)
WHERE c.title = 'MERN Stack Foundations'
  AND m.title = seed.module_title
  AND NOT EXISTS (
      SELECT 1 FROM lessons l
      WHERE l.module_id = m.id AND l.lesson_order = seed.lesson_order
  );

-- DSA modules and lessons
INSERT INTO course_modules (course_id, title, description, module_order)
SELECT c.id, seed.title, seed.description, seed.module_order
FROM training_courses c
CROSS JOIN (
    VALUES
      ('Arrays & Strings', 'Patterns for two pointers, sliding windows and prefix techniques.', 1),
      ('Trees & Graphs', 'Traversal, recursion, shortest paths and practical graph modeling.', 2),
      ('Dynamic Programming', 'Break complex problems into states and transitions.', 3)
) AS seed(title, description, module_order)
WHERE c.title = 'Data Structures & Algorithms'
  AND NOT EXISTS (
      SELECT 1 FROM course_modules m
      WHERE m.course_id = c.id AND m.module_order = seed.module_order
  );

INSERT INTO lessons (module_id, title, description, video_url, duration, lesson_order)
SELECT m.id, seed.title, seed.description, seed.video_url, seed.duration, seed.lesson_order
FROM course_modules m
JOIN training_courses c ON c.id = m.course_id
CROSS JOIN (
    VALUES
      ('Arrays & Strings', 'Two Pointer Patterns', 'Solve sorted-array and in-place transformation problems.', 'https://www.youtube.com/watch?v=On03HWe2tZM', '26 min', 1),
      ('Arrays & Strings', 'Sliding Window', 'Recognize and implement fixed and variable sliding windows.', 'https://www.youtube.com/watch?v=GcW4mgmgSbw', '30 min', 2),
      ('Trees & Graphs', 'Tree Traversals', 'Implement DFS and BFS traversal patterns.', 'https://www.youtube.com/watch?v=9RHO6jU--GU', '27 min', 1),
      ('Trees & Graphs', 'Graph Search', 'Use BFS and DFS to solve connectivity problems.', 'https://www.youtube.com/watch?v=PMMc4VsIacU', '25 min', 2),
      ('Dynamic Programming', 'DP Foundations', 'Identify states, transitions and base cases.', 'https://www.youtube.com/watch?v=oBt53YbR9Kk', '35 min', 1),
      ('Dynamic Programming', 'Interview DP Practice', 'Apply a repeatable framework to medium difficulty problems.', 'https://www.youtube.com/watch?v=Hdr64lKQ3e4', '32 min', 2)
) AS seed(module_title, title, description, video_url, duration, lesson_order)
WHERE c.title = 'Data Structures & Algorithms'
  AND m.title = seed.module_title
  AND NOT EXISTS (
      SELECT 1 FROM lessons l
      WHERE l.module_id = m.id AND l.lesson_order = seed.lesson_order
  );

-- Placement modules and lessons
INSERT INTO course_modules (course_id, title, description, module_order)
SELECT c.id, seed.title, seed.description, seed.module_order
FROM training_courses c
CROSS JOIN (
    VALUES
      ('Resume & Profile', 'Present projects, skills and achievements clearly.', 1),
      ('Technical Interviews', 'Structure coding and technical interview preparation.', 2),
      ('Communication Rounds', 'Improve behavioural answers and concise professional communication.', 3)
) AS seed(title, description, module_order)
WHERE c.title = 'Placement Readiness Bootcamp'
  AND NOT EXISTS (
      SELECT 1 FROM course_modules m
      WHERE m.course_id = c.id AND m.module_order = seed.module_order
  );

INSERT INTO lessons (module_id, title, description, video_url, duration, lesson_order)
SELECT m.id, seed.title, seed.description, seed.video_url, seed.duration, seed.lesson_order
FROM course_modules m
JOIN training_courses c ON c.id = m.course_id
CROSS JOIN (
    VALUES
      ('Resume & Profile', 'Resume Review Checklist', 'Use a practical checklist for impact-oriented resume content.', 'https://www.youtube.com/watch?v=Tt08KmFfIYQ', '20 min', 1),
      ('Resume & Profile', 'Project Storytelling', 'Explain technical projects using a concise problem-action-result structure.', 'https://www.youtube.com/watch?v=RzC0xYdP4uE', '18 min', 2),
      ('Technical Interviews', 'Coding Interview Strategy', 'Build a repeatable approach for solving unseen problems.', 'https://www.youtube.com/watch?v=We3YDTzNXEk', '24 min', 1),
      ('Technical Interviews', 'System Thinking', 'Communicate trade-offs and design decisions clearly.', 'https://www.youtube.com/watch?v=bUHFg8CZFws', '29 min', 2),
      ('Communication Rounds', 'Behavioural Answers', 'Frame answers with context, action and measurable outcomes.', 'https://www.youtube.com/watch?v=P2R2qY7L7UQ', '17 min', 1),
      ('Communication Rounds', 'Mock Interview Routine', 'Set up a focused weekly mock interview practice loop.', 'https://www.youtube.com/watch?v=HG68Ymazo18', '15 min', 2)
) AS seed(module_title, title, description, video_url, duration, lesson_order)
WHERE c.title = 'Placement Readiness Bootcamp'
  AND m.title = seed.module_title
  AND NOT EXISTS (
      SELECT 1 FROM lessons l
      WHERE l.module_id = m.id AND l.lesson_order = seed.lesson_order
  );

-- Seed zero-progress enrollment rows for the deterministic demo student when
-- migration 027 created it. Other students are enrolled lazily by the API.
INSERT INTO student_course_progress (student_id, course_id, completed_lessons, total_lessons, progress)
SELECT s.id, c.id, 0,
       (SELECT COUNT(*) FROM lessons l JOIN course_modules m ON m.id = l.module_id WHERE m.course_id = c.id),
       0
FROM students s
CROSS JOIN training_courses c
WHERE LOWER(s.email) = 'student@demo.edu'
  AND c.status = 'published'
  AND NOT EXISTS (
      SELECT 1 FROM student_course_progress p
      WHERE p.student_id = s.id AND p.course_id = c.id
  );
