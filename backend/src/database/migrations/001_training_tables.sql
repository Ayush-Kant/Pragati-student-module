CREATE TABLE training_courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL,
    duration VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE course_modules (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    module_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_course
        FOREIGN KEY (course_id)
        REFERENCES training_courses(id)
        ON DELETE CASCADE
);
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    module_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url TEXT,
    duration VARCHAR(50),
    lesson_order INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_lessons_module
        FOREIGN KEY (module_id)
        REFERENCES course_modules(id)
        ON DELETE CASCADE
);


CREATE TABLE learning_resources (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    resource_type VARCHAR(50),
    file_url TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_resources_lesson
        FOREIGN KEY (lesson_id)
        REFERENCES lessons(id)
        ON DELETE CASCADE
);


CREATE TABLE student_course_progress (
    id SERIAL PRIMARY KEY,

    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,

    completed_lessons INTEGER DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,
    progress INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_student_course
        FOREIGN KEY (course_id)
        REFERENCES training_courses(id)
        ON DELETE CASCADE
);


CREATE TABLE lesson_progress (
    id SERIAL PRIMARY KEY,

    student_id INTEGER NOT NULL,
    lesson_id INTEGER NOT NULL,

    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_lesson_student
        FOREIGN KEY (lesson_id)
        REFERENCES lessons(id)
        ON DELETE CASCADE
);
CREATE INDEX idx_course_modules_course_id
ON course_modules(course_id);


CREATE INDEX idx_lessons_module_id
ON lessons(module_id);


CREATE INDEX idx_resources_lesson_id
ON learning_resources(lesson_id);


CREATE INDEX idx_student_course_progress_student
ON student_course_progress(student_id);


CREATE INDEX idx_student_course_progress_course
ON student_course_progress(course_id);


CREATE INDEX idx_lesson_progress_student
ON lesson_progress(student_id);


CREATE INDEX idx_lesson_progress_lesson
ON lesson_progress(lesson_id);