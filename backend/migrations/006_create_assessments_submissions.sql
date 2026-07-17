-- Assessments Table
CREATE TABLE IF NOT EXISTS assessments (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    course_id INTEGER NOT NULL,
    mentor_id INTEGER NOT NULL,
    due_at TIMESTAMP,
    max_score INTEGER NOT NULL DEFAULT 100,
    status VARCHAR(50) DEFAULT 'scheduled',
    tags TEXT[],
    config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assessments_course
ON assessments(course_id);

CREATE INDEX IF NOT EXISTS idx_assessments_mentor
ON assessments(mentor_id);


-- Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL,
    options JSONB,
    correct_json JSONB,
    marks INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_questions_assessment
ON questions(assessment_id);


-- Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL,
    answers JSONB,
    file_url TEXT,
    score INTEGER,
    max_score INTEGER,
    status VARCHAR(50) DEFAULT 'submitted',
    attempt_number INTEGER DEFAULT 1,
    plagiarism_flag BOOLEAN DEFAULT FALSE,
    plagiarism_score NUMERIC(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_submissions_assessment
ON submissions(assessment_id);

CREATE INDEX IF NOT EXISTS idx_submissions_student
ON submissions(student_id);


-- Assessment Rubrics Table
CREATE TABLE IF NOT EXISTS assessment_rubrics (
    id SERIAL PRIMARY KEY,
    submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    criterion VARCHAR(255) NOT NULL,
    score INTEGER NOT NULL,
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rubrics_submission
ON assessment_rubrics(submission_id);