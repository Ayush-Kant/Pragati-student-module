-- Student profile schema for PostgreSQL
-- Assumes the existing students table already exists.
CREATE TABLE IF NOT EXISTS student_resumes (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL UNIQUE,
    resume_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_resumes_student
        FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_student_resumes_student_id
    ON student_resumes(student_id);

CREATE TABLE IF NOT EXISTS student_portfolios (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL UNIQUE,
    headline VARCHAR(150),
    bio TEXT,
    website_url TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_portfolios_student
        FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_student_portfolios_student_id
    ON student_portfolios(student_id);

CREATE TABLE IF NOT EXISTS student_projects (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    project_title VARCHAR(150) NOT NULL,
    project_description TEXT,
    project_url TEXT,
    github_url TEXT,
    technologies TEXT[] DEFAULT '{}',
    start_date DATE,
    end_date DATE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_projects_student
        FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_student_projects_student_id
    ON student_projects(student_id);

CREATE INDEX IF NOT EXISTS idx_student_projects_featured
    ON student_projects(student_id, is_featured);

CREATE TABLE IF NOT EXISTS student_skills (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    skill_name VARCHAR(120) NOT NULL,
    skill_level VARCHAR(50),
    category VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_skills_student
        FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE,
    CONSTRAINT uq_student_skill UNIQUE (student_id, skill_name)
);

CREATE INDEX IF NOT EXISTS idx_student_skills_student_id
    ON student_skills(student_id);

CREATE TABLE IF NOT EXISTS student_social_links (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL UNIQUE,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    twitter_url TEXT,
    website_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_social_links_student
        FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_recruitment_drives_mentor_id ON recruitment_drives(mentor_id);
CREATE INDEX IF NOT EXISTS idx_live_sessions_mentor_id_scheduled_at ON live_sessions(mentor_id, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_student_progress_student_id ON student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_drive_id ON student_progress(drive_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assessment_id ON submissions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessments_course_id ON assessments(course_id);
CREATE INDEX IF NOT EXISTS idx_courses_mentor_id ON courses(mentor_id);

-- Departments Management Schema
CREATE TABLE IF NOT EXISTS departments (
    dept_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    courses TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on department name for query optimization
CREATE INDEX IF NOT EXISTS idx_departments_name ON departments(name);

-- Insert dummy department records
INSERT INTO departments (name, courses) VALUES 
('Computer Science', '{"DSA", "DBMS", "OS"}'),
('Information Technology', '{"CN", "Web Dev", "Software Engineering"}'),
('Electronics and Communication', '{"Signals", "Microprocessors", "Communication Systems"}'),
('Mechanical Engineering', '{"Thermodynamics", "Fluid Mechanics", "Machine Design"}')
ON CONFLICT (name) DO NOTHING;
CREATE INDEX IF NOT EXISTS idx_student_social_links_student_id
    ON student_social_links(student_id);
