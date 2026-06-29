-- studentSchema.sql

CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    enrollment_no VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20),
    department VARCHAR(100),
    course VARCHAR(100),
    semester INT,
    cgpa NUMERIC(4,2),
    placement_status VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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
