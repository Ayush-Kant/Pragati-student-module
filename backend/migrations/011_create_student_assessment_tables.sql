-- ===========================================
-- Table: assessment_attempts
-- Stores each student's assessment attempt
-- ===========================================

CREATE TABLE IF NOT EXISTS assessment_attempts (
    id SERIAL PRIMARY KEY,

    student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    assessment_id INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,

    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    submitted_at TIMESTAMPTZ,

    score INTEGER DEFAULT 0,

    status VARCHAR(20) NOT NULL DEFAULT 'started'
      CHECK (status IN ('started', 'submitted')),

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- Table: assessment_submissions
-- Stores answers submitted by students
-- ===========================================

CREATE TABLE IF NOT EXISTS assessment_submissions (
    id SERIAL PRIMARY KEY,

    attempt_id INTEGER NOT NULL REFERENCES assessment_attempts(id) ON DELETE CASCADE,

    question_id INTEGER NOT NULL REFERENCES assessment_questions(id) ON DELETE CASCADE,

    selected_option TEXT,

    answer_text TEXT,

    is_correct BOOLEAN DEFAULT FALSE,

    marks_obtained INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_attempts_student ON assessment_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_attempts_assessment ON assessment_attempts(assessment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_attempt ON assessment_submissions(attempt_id);
CREATE INDEX IF NOT EXISTS idx_submissions_question ON assessment_submissions(question_id);