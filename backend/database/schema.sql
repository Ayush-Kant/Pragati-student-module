CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'student',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);

CREATE TABLE IF NOT EXISTS mentors (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    specialization VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    mentor_id INT REFERENCES mentors(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_modules (
    id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (course_id, order_index)
);

CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    module_id INT NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    duration_minutes INT DEFAULT 0 CHECK (duration_minutes >= 0),
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (module_id, order_index)
);

CREATE TABLE IF NOT EXISTS lesson_resources (
    id SERIAL PRIMARY KEY,
    lesson_id INT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    resource_type VARCHAR(50) NOT NULL DEFAULT 'video' CHECK (resource_type IN ('video', 'article', 'document', 'quiz', 'link', 'file', 'other')),
    url TEXT,
    file_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (url IS NOT NULL OR file_path IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS lesson_progress (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    progress_pct INT NOT NULL DEFAULT 0 CHECK (progress_pct >= 0 AND progress_pct <= 100),
    completed BOOLEAN NOT NULL DEFAULT false,
    last_viewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (student_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS student_notes (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lesson_bookmarks (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    bookmark_time_seconds INT DEFAULT 0 CHECK (bookmark_time_seconds >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (student_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_order_index ON course_modules(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order_index ON lessons(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lesson_resources_lesson_id ON lesson_resources(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_student_id ON lesson_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_student_notes_student_id ON student_notes(student_id);
CREATE INDEX IF NOT EXISTS idx_student_notes_lesson_id ON student_notes(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_bookmarks_student_id ON lesson_bookmarks(student_id);
CREATE INDEX IF NOT EXISTS idx_lesson_bookmarks_lesson_id ON lesson_bookmarks(lesson_id);

CREATE TABLE IF NOT EXISTS assessments (
    id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    assessment_id INT REFERENCES assessments(id) ON DELETE CASCADE,
    student_id INT REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    student_auth_user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recruitment_drives (
    id SERIAL PRIMARY KEY,
    mentor_id INT REFERENCES mentors(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'upcoming')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS live_sessions (
    id SERIAL PRIMARY KEY,
    mentor_id INT REFERENCES mentors(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    session_type VARCHAR(50) DEFAULT 'webinar',
    scheduled_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_progress (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES users(id) ON DELETE CASCADE,
    drive_id INT REFERENCES recruitment_drives(id) ON DELETE CASCADE,
    readiness_score INT DEFAULT 0 CHECK (readiness_score >= 0 AND readiness_score <= 100),
    completion_pct INT DEFAULT 0 CHECK (completion_pct >= 0 AND completion_pct <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (student_id, drive_id)
);

CREATE TABLE IF NOT EXISTS drive_enrollments (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    drive_id INT NOT NULL REFERENCES recruitment_drives(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (student_id, drive_id)
);

CREATE TABLE IF NOT EXISTS activity_submissions (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    drive_id INT REFERENCES recruitment_drives(id) ON DELETE SET NULL,
    activity_title VARCHAR(255) NOT NULL,
    activity_type VARCHAR(50) NOT NULL DEFAULT 'assignment' CHECK (activity_type IN ('assignment', 'project', 'quiz', 'task')),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'graded', 'approved', 'rejected')),
    score INT CHECK (score >= 0),
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS session_attendance (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id INT NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
    attended BOOLEAN DEFAULT false,
    attended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (student_id, session_id)
);

CREATE INDEX IF NOT EXISTS idx_recruitment_drives_mentor_id ON recruitment_drives(mentor_id);
CREATE INDEX IF NOT EXISTS idx_recruitment_drives_status ON recruitment_drives(status);
CREATE INDEX IF NOT EXISTS idx_notifications_student_auth_user_id ON notifications(student_auth_user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

DO $$
BEGIN
    IF to_regclass('public.live_sessions') IS NOT NULL THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_live_sessions_mentor_id_scheduled_at ON live_sessions(mentor_id, scheduled_at)';
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_live_sessions_scheduled_at ON live_sessions(scheduled_at)';
    END IF;
END $$;

DO $$
BEGIN
    IF to_regclass('public.student_progress') IS NOT NULL THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_student_progress_student_id ON student_progress(student_id)';
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_student_progress_drive_id ON student_progress(drive_id)';
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_student_progress_student_drive ON student_progress(student_id, drive_id)';
    END IF;
END $$;

DO $$
BEGIN
    IF to_regclass('public.drive_enrollments') IS NOT NULL THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_drive_enrollments_student_id ON drive_enrollments(student_id)';
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_drive_enrollments_drive_id ON drive_enrollments(drive_id)';
    END IF;
END $$;

DO $$
BEGIN
    IF to_regclass('public.activity_submissions') IS NOT NULL THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_activity_submissions_student_id ON activity_submissions(student_id)';
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_activity_submissions_drive_id ON activity_submissions(drive_id)';
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_activity_submissions_status ON activity_submissions(status)';
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_activity_submissions_status_created_at ON activity_submissions(status, created_at)';
    END IF;
END $$;

DO $$
BEGIN
    IF to_regclass('public.session_attendance') IS NOT NULL THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_session_attendance_student_id ON session_attendance(student_id)';
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_session_attendance_session_id ON session_attendance(session_id)';
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_session_attendance_attended ON session_attendance(attended)';
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_submissions_assessment_id ON submissions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessments_course_id ON assessments(course_id);
CREATE INDEX IF NOT EXISTS idx_courses_mentor_id ON courses(mentor_id);