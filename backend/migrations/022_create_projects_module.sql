-- 022_create_projects_module.sql
-- PostgreSQL Migration for Projects Backend Module

CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    activity_type VARCHAR(50) NOT NULL DEFAULT 'PROJECT',
    points INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_projects (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    repository_url VARCHAR(500),
    deployment_url VARCHAR(500),
    report_url VARCHAR(500),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    total_score NUMERIC(5,2),
    feedback TEXT,
    rubric_scores JSONB,
    deadline TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_milestones (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES student_projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    deadline TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    weightage NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_submissions (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES student_projects(id) ON DELETE CASCADE,
    milestone_id INTEGER REFERENCES project_milestones(id) ON DELETE SET NULL,
    student_id INTEGER NOT NULL,
    github_url VARCHAR(500) NOT NULL,
    deployment_url VARCHAR(500),
    progress_notes VARCHAR(1000),
    report_url VARCHAR(500),
    submission_type VARCHAR(50) NOT NULL DEFAULT 'MILESTONE',
    status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED',
    feedback TEXT,
    rubric_scores JSONB,
    submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for optimal querying performance
CREATE INDEX IF NOT EXISTS idx_student_projects_student_id ON student_projects(student_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_activity_submissions_project_id ON activity_submissions(project_id);
CREATE INDEX IF NOT EXISTS idx_activity_submissions_student_id ON activity_submissions(student_id);
