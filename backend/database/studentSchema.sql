
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE students
    ADD COLUMN IF NOT EXISTS enrollment_no VARCHAR(50) UNIQUE,
    ADD COLUMN IF NOT EXISTS name VARCHAR(150),
    ADD COLUMN IF NOT EXISTS email VARCHAR(150) UNIQUE,
    ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
    ADD COLUMN IF NOT EXISTS department VARCHAR(100),
    ADD COLUMN IF NOT EXISTS course VARCHAR(100),
    ADD COLUMN IF NOT EXISTS semester INT,
    ADD COLUMN IF NOT EXISTS cgpa NUMERIC(4,2),
    ADD COLUMN IF NOT EXISTS placement_status VARCHAR(50);

CREATE INDEX IF NOT EXISTS idx_students_enrollment_no ON students(enrollment_no);
CREATE INDEX IF NOT EXISTS idx_students_department ON students(department);
CREATE INDEX IF NOT EXISTS idx_students_placement_status ON students(placement_status);

CREATE TABLE IF NOT EXISTS student_academic_details (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL UNIQUE,
    tenth_board VARCHAR(100),
    tenth_percentage NUMERIC(5,2),
    tenth_year INT,
    twelfth_board VARCHAR(100),
    twelfth_percentage NUMERIC(5,2),
    twelfth_year INT,
    diploma_board VARCHAR(100),
    diploma_percentage NUMERIC(5,2),
    diploma_year INT,
    current_backlogs INT DEFAULT 0,
    history_backlogs INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_academic_student
        FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_student_academic_student_id ON student_academic_details(student_id);

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

CREATE INDEX IF NOT EXISTS idx_student_skills_student_id ON student_skills(student_id);

CREATE TABLE IF NOT EXISTS student_documents (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    document_url TEXT NOT NULL,
    file_name VARCHAR(255),
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_documents_student
        FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_student_documents_student_id ON student_documents(student_id);
