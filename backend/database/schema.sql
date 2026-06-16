<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
git revert --continue<<<<<<< HEAD
=======
-- base tables
>>>>>>> parent of cbdde3d (Fix backend schema and migration updates)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
=======
-- base tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    firebase_uid VARCHAR(128) UNIQUE,        -- ← ADD THIS for Firebase Auth link
>>>>>>> parent of bb45ed9 (Revert "chore: bootstrap backend and database setup")
=======
-- base tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    firebase_uid VARCHAR(128) UNIQUE,        -- ← ADD THIS for Firebase Auth link
>>>>>>> parent of 8b76a99 (Merge pull request #158 from Pragati-Uptoskills/temp/revert-150-on-develop)
=======
-- base tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    firebase_uid VARCHAR(128) UNIQUE,        -- ← ADD THIS for Firebase Auth link
>>>>>>> parent of 4f79d2f (Merge branch 'develop' into feature/admin-student-management-fe)
=======
-- base tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    firebase_uid VARCHAR(128) UNIQUE,        -- ← ADD THIS for Firebase Auth link
>>>>>>> parent of cd46b91 (Merge branch 'develop' into feature/admin-student-management-be)
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'student',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<< << << < HEAD << << << < HEAD = = = = = = =
-- If users table already exists, just add the column safely
ALTER TABLE users
ADD COLUMN IF NOT EXISTS firebase_uid VARCHAR(128) UNIQUE;

>> >> >> > parent of bb45ed9 (
    Revert "chore: bootstrap backend and database setup"
)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);

= = = = = = =
-- Ensure full_name exists if the table was already created
ALTER TABLE users
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);

>> >> >> > parent of cbdde3d ( Fix backend schema and migration updates )
=======
=======
>>>>>>> parent of 4f79d2f (Merge branch 'develop' into feature/admin-student-management-fe)
=======
>>>>>>> parent of cd46b91 (Merge branch 'develop' into feature/admin-student-management-be)
-- If users table already exists, just add the column safely
ALTER TABLE users ADD COLUMN IF NOT EXISTS firebase_uid VARCHAR(128) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
>>>>>>> parent of 8b76a99 (Merge pull request #158 from Pragati-Uptoskills/temp/revert-150-on-develop)

CREATE TABLE IF NOT EXISTS mentors (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users (id) ON DELETE CASCADE,
    specialization VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    mentor_id INT REFERENCES mentors (id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessments (
    id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses (id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    assessment_id INT REFERENCES assessments (id) ON DELETE CASCADE,
    student_id INT REFERENCES users (id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    mentor_id INT REFERENCES mentors (id) ON DELETE CASCADE,
    type VARCHAR(100),
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- dashboard related tables
CREATE TABLE IF NOT EXISTS recruitment_drives (
    id SERIAL PRIMARY KEY,
    mentor_id INT REFERENCES mentors (id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (
        status IN (
            'active',
            'completed',
            'upcoming'
        )
    ),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS live_sessions (
    id SERIAL PRIMARY KEY,
    mentor_id INT REFERENCES mentors (id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    session_type VARCHAR(50) DEFAULT 'webinar',
    scheduled_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_progress (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES users (id) ON DELETE CASCADE,
    drive_id INT REFERENCES recruitment_drives (id) ON DELETE CASCADE,
    readiness_score INT DEFAULT 0 CHECK (
        readiness_score >= 0
        AND readiness_score <= 100
    ),
    completion_pct INT DEFAULT 0 CHECK (
        completion_pct >= 0
        AND completion_pct <= 100
    ),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_recruitment_drives_mentor_id ON recruitment_drives (mentor_id);

CREATE INDEX IF NOT EXISTS idx_live_sessions_mentor_id_scheduled_at ON live_sessions (mentor_id, scheduled_at);

CREATE INDEX IF NOT EXISTS idx_student_progress_student_id ON student_progress (student_id);

CREATE INDEX IF NOT EXISTS idx_student_progress_drive_id ON student_progress (drive_id);

CREATE INDEX IF NOT EXISTS idx_submissions_assessment_id ON submissions (assessment_id);

CREATE INDEX IF NOT EXISTS idx_assessments_course_id ON assessments (course_id);

CREATE INDEX IF NOT EXISTS idx_courses_mentor_id ON courses (mentor_id);
=======
=======
>>>>>>> parent of 4f79d2f (Merge branch 'develop' into feature/admin-student-management-fe)
=======
>>>>>>> parent of cd46b91 (Merge branch 'develop' into feature/admin-student-management-be)
-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_recruitment_drives_mentor_id ON recruitment_drives(mentor_id);
CREATE INDEX IF NOT EXISTS idx_live_sessions_mentor_id_scheduled_at ON live_sessions(mentor_id, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_student_progress_student_id ON student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_drive_id ON student_progress(drive_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assessment_id ON submissions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessments_course_id ON assessments(course_id);
CREATE INDEX IF NOT EXISTS idx_courses_mentor_id ON courses(mentor_id);
>>>>>>> parent of 8b76a99 (Merge pull request #158 from Pragati-Uptoskills/temp/revert-150-on-develop)
