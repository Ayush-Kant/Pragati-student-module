

--- FILE: backend/controllers/auth.controller.js ---
<<<<<<< (line 1):
import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const ALLOWED_ROLES = ['student', 'mentor', 'admin', 'college', 'company'];

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await pool.query(
      `SELECT id, email, role, password_hash
       FROM auth_users
       WHERE email = $1`,
      [email]
    );

    if (!result.rows.length) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and role are required",
      });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const existing = await pool.query(
      `SELECT id FROM auth_users WHERE email = $1`,
      [email]
    );

    if (existing.rows.length) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      `INSERT INTO auth_users (email, password_hash, role, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id, email, role`,
      [email, passwordHash, role]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
=======
import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

const ALLOWED_ROLES = ['student', 'mentor', 'admin', 'college', 'company'];

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await pool.query(
      `SELECT a.id AS auth_user_id, a.uuid_id, a.email, a.role, a.password_hash, u.id AS user_id, c.id AS company_id
       FROM auth_users a
       LEFT JOIN users u ON u.auth_user_id = a.id
       LEFT JOIN companies c ON c.user_id = u.id
       WHERE a.email = $1`,
      [email]
    );

    if (!result.rows.length) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.user_id,
        uid: user.user_id,
        userId: user.uuid_id,
        authUserId: user.auth_user_id,
        email: user.email,
        role: user.role,
        companyId: user.company_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token,
      userId: user.uuid_id,
      role: user.role,
      message: "Login successful",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password and role are required",
      });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const existing = await pool.query(
      `SELECT id FROM auth_users WHERE email = $1`,
      [email]
    );

    if (existing.rows.length) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const uuid = randomUUID();
    const client = await pool.connect();
    let authUserId;
    let userId;
    let companyId = null;
    try {
      await client.query("BEGIN");
      const user = await client.query(
        `INSERT INTO auth_users (email, password_hash, role, uuid_id)
         VALUES ($1, $2, $3, $4)
         RETURNING id` ,
        [email, passwordHash, role, uuid]
      );
      authUserId = user.rows[0].id;
      const userResult = await client.query(
        `INSERT INTO users (auth_user_id, email, role, created_at, phone, username)
         VALUES ($1, $2, $3, NOW(), $4, $5)
         RETURNING id`,
        [authUserId, email, role, null, email.split('@')[0]]
      );
      userId = userResult.rows[0].id;

      if (role === 'company') {
        const companyResult = await client.query(
          `INSERT INTO companies (user_id, name, email)
           VALUES ($1, $2, $3)
           RETURNING id`,
          [userId, email.split('@')[0] + ' Corporate', email]
        );
        companyId = companyResult.rows[0].id;
      }

      await client.query("COMMIT");
    }
    catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
    const token = jwt.sign(
      {
        id: userId,
        uid: userId,
        userId: uuid,
        authUserId: authUserId,
        email,
        role,
        companyId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      userId: uuid,
      token,
      message: "User registered successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};
// reload backend server
>>>>>>>


--- FILE: backend/database/schema.sql ---
<<<<<<< (line 50):
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
    name VARCHAR(100) NOT NULL,
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
('Mechanical Engineering', '{"Thermodynamics", "Fluid Mechanics", "Machine Design"}');
CREATE INDEX IF NOT EXISTS idx_student_social_links_student_id
    ON student_social_links(student_id);
=======
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
>>>>>>>


--- FILE: backend/migrations/005_create_company_management.sql ---
<<<<<<< (line 8):
=======
    name VARCHAR(255) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,

    industry VARCHAR(100),

    size VARCHAR(50),

    location VARCHAR(255),

    website VARCHAR(255),

    description TEXT,

    logo_url TEXT,

    default_work_mode VARCHAR(50) DEFAULT 'Hybrid',

    probation_period INTEGER DEFAULT 3,

    notice_period INTEGER DEFAULT 30,

    currency VARCHAR(10) DEFAULT 'INR',

    notifications JSONB DEFAULT '{"emailNotifications": true, "interviewReminders": true, "weeklyAnalyticsReport": false, "offerNotifications": true}',

    status VARCHAR(50) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected','suspended')),

    rejection_reason TEXT,

    suspension_reason TEXT,

    verified_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);
>>>>>>>


--- FILE: backend/migrations/005_create_student_management.sql ---
<<<<<<< (line 25):


=======
>>>>>>>
<<<<<<< (line 35):

=======
>>>>>>>
<<<<<<< (line 82):

SELECT * FROM students;


=======
SELECT * FROM students;
>>>>>>>


--- FILE: backend/migrations/007_offers_hiring_tables.sql ---
<<<<<<< (line 3):

=======
>>>>>>>
<<<<<<< (line 50):

=======
>>>>>>>
<<<<<<< (line 70):

=======
>>>>>>>
<<<<<<< (line 99):

=======
>>>>>>>
<<<<<<< (line 133):

=======
>>>>>>>
<<<<<<< (line 149):

=======
>>>>>>>
<<<<<<< (line 181):

=======
>>>>>>>
<<<<<<< (line 214):

=======
>>>>>>>
<<<<<<< (line 229):
CREATE INDEX idx_offer_amendments_created ON offer_amendments (created_at DESC);


=======
CREATE INDEX idx_offer_amendments_created ON offer_amendments (created_at DESC);
>>>>>>>


--- FILE: backend/migrations/009_create_reports_analytics_tables.sql ---
<<<<<<< (line 37):
    trend VARCHAR(20) CHECK (trend IN ('INCREASING', 'STABLE', 'DECREASING'))
=======
    trend VARCHAR(50) CHECK (trend IN ('INCREASING', 'STABLE', 'DECREASING'))
>>>>>>>


--- FILE: backend/migrations/Students.sql ---
<<<<<<< (line 1):
-- Adding additional columns to students table

ALTER TABLE students ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
ALTER TABLE students ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE students ADD COLUMN IF NOT EXISTS branch VARCHAR(100);
ALTER TABLE students ADD COLUMN IF NOT EXISTS graduation_year INT;
=======
-- Students.sql
-- Merges student schema expectations across modules

CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Safely append missing fields expected by other modules
ALTER TABLE students ADD COLUMN IF NOT EXISTS full_name VARCHAR(100);
ALTER TABLE students ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
ALTER TABLE students ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE students ADD COLUMN IF NOT EXISTS college VARCHAR(255);
ALTER TABLE students ADD COLUMN IF NOT EXISTS branch VARCHAR(100);
ALTER TABLE students ADD COLUMN IF NOT EXISTS graduation_year INT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS skills TEXT[];
>>>>>>>


--- FILE: backend/scripts/migrate.js ---
<<<<<<< (line 41):
    console.log("Dropping existing tables to start fresh...");
    await pool.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO public;
=======
    console.log("Dropping existing tables and types to start fresh...");

    // 1. Dynamically fetch and drop all tables in the public schema
    const { rows: tables } = await pool.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public';
>>>>>>>
<<<<<<< (line 58):
    const migrationsDir = path.join(__dirname, "../migrations");
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith(".sql"))
      .sort();

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      console.log(`Running migration: ${file}...`);
      const sql = fs.readFileSync(filePath, "utf8");
      await pool.query(sql);
      console.log(`Migration completed successfully: ${file}`);
=======
    if (tables.length > 0) {
      const tableNames = tables.map((t) => `"${t.tablename}"`).join(", ");
      await pool.query(`DROP TABLE IF EXISTS ${tableNames} CASCADE;`);
      console.log(`✔ Dropped ${tables.length} existing tables.`);
>>>>>>>


--- FILE: backend/server.js ---
<<<<<<< (line 2):
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import mentorRoutes from "./routes/mentor.routes.js";
import adminDashboardRoutes from "./routes/admin.dashboard.routes.js";
import adminCollegeRoutes from "./routes/admin.college.routes.js";
import adminAssessmentRoutes from "./routes/admin.assessment.routes.js";
import contentRoutes from "./routes/content.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import collegeProfileRoutes from "./routes/collage.profile.routes.js";
import companyRoutes from "./routes/company.routes.js";
import adminDriveRoutes from "./routes/admin.drive.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import collegeDashboardRoutes from "./routes/college.dashboard.routes.js";
import collegeJobsRoutes from "./routes/college.jobs.routes.js";
import departmentRoutes from "./routes/college.department.routes.js";
import courseRoutes from "./routes/college.course.routes.js";
import departmentStatisticsRoutes from "./routes/college.departmentstatistics.routes.js";
import placementDriveRoutes from "./routes/placementDrives.routes.js";

dotenv.config();

const app = express();
app.use(errorMiddleware);
=======
import cors from "cors";
import dotenv from "dotenv";
>>>>>>>
<<<<<<< (line 64):
// Middleware
app.use(express.json());
import errorMiddleware from "./middleware/errorMiddleware.js";
=======
const app = express();
const PORT = process.env.PORT || 5000;
>>>>>>>
<<<<<<< (line 91):



app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.startsWith("http://localhost"))
        return callback(null, true);

      const clientUrl = process.env.CLIENT_URL;

      if (clientUrl && origin === clientUrl)
        return callback(null, true);

      return callback(
        new Error(`CORS policy: origin ${origin} not allowed`)
      );
    },
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRouter);

app.use("/api/v1/admin/dashboard", adminDashboardRoutes);
app.use("/api/v1/admin/colleges", adminCollegeRoutes);
app.use("/api/v1/admin/assessments", adminAssessmentRoutes);
app.use("/api/v1/company/jobs", collegeJobsRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/mentor", contentRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/v1/company/interviews", interviewRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/mentor", contentRoutes);
app.use("/api/v1/company/jobs", collegeJobsRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/company/interviews", interviewRoutes);
=======
// Routes
app.use("/api/auth", authRouter);
app.use("/api/student/dashboard", dashboardRoutes);
app.use("/api/v1/admin/dashboard", adminDashboardRoutes);
app.use("/api/v1/admin/colleges", adminCollegeRoutes);
app.use("/api/v1/admin/assessments", adminAssessmentRoutes);
>>>>>>>
<<<<<<< (line 147):
app.use("/api/student/notifications", notificationRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/college/profile", collegeProfileRoutes);
app.use("/api/college/dashboard", collegeDashboardRoutes);

app.use("/api/departments/statistics", departmentStatisticsRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/placement-drives", placementDriveRoutes);
// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running",
  });
});

=======

app.get("/", (req, res) => {
  res.json({
    message: "Backend is running",
  });
});
app.use(
  "/api/v1/company/assessments",
  companyAssessmentRoutes
);

app.use(errorMiddleware);
>>>>>>>
<<<<<<< (line 183):
      console.log(`✅ Server running on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  });
=======
      console.log(`✅ Server running on PORT : ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ PostgreSQL connection failed:", err.message);
  });
>>>>>>>


--- FILE: backend/src/modules/company/services/email.service.js ---
<<<<<<< (line 12):
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_123456789");
=======
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummykey123');
>>>>>>>


--- FILE: frontend/src/features/auth/LoginPage.jsx ---
<<<<<<< (line 18):
  const { login } = useAuth();
  const [profileData, setProfileData] = useState({})
=======
  const { login, isAuthenticated, userRole } = useAuth();

  useEffect(() => {
    if (isAuthenticated && userRole) {
      navigate(`/${userRole}/dashboard`);
    }
  }, [isAuthenticated, userRole, navigate]);
>>>>>>>


--- FILE: frontend/src/features/college/layouts/CollegeLayout.jsx ---
<<<<<<< (line 1):
import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import CollegeNavbar from "../navbar/components/Navbar";
import CollegeSidebar from "../components/CollegeSidebar";
import MobileSidebar from "../dashboard/components/layout/MobileSidebar";
import CollegeFooter from "../components/CollegeFooter";

const CollegeLayout = () => {
  // Sidebar Toggle
  const [openSidebar, setOpenSidebar] = useState(false);

  // Dark Mode
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-slate-900 text-white"
          : "bg-slate-100 text-black"
      }`}
    >
      {/* Navbar */}
      <CollegeNavbar
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <CollegeSidebar
            openSidebar={openSidebar}
            setOpenSidebar={setOpenSidebar}
            darkMode={darkMode}
          />
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
          darkMode={darkMode}
        />

        {/* Main Section */}
        <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
          {/* Page Content */}
          <main className="flex-1 pt-20 p-6">
            <Outlet
              context={{
                darkMode,
              }}
            />
          </main>

          {/* Footer */}
          <CollegeFooter darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
};

export default CollegeLayout;
=======
export const CollegeLayout = ({ children }) => {
  return (
    <div>
        <h1>College Dashboard</h1>
        <div style={{ display: "flex" }}>
            <div style={{ width: "200px", background: "#e2e8f0", padding: "20px" }}>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    <li style={{ marginBottom: "10px" }}>
                        <a href="/college/dashboard">Dashboard</a>
                    </li>
                    <li style={{ marginBottom: "10px" }}>
                        <a href="/college/students">Students</a>
                    </li>
                    <li style={{ marginBottom: "10px" }}>
                        <a href="/college/certificates">Certificates</a>
                    </li>
                </ul>
            </div>
            <main style={{ padding: "20px", width: "100%", background: "#f1f5f9", minHeight: "100vh" }}>
                {children}
            </main>
        </div>
    </div>
  );
}
>>>>>>>


--- FILE: frontend/src/features/college/profile/components/view-profile/ProfileBanner.jsx ---
<<<<<<< (line 1):
import { Edit2, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfileBanner({ profile }) {

  const navigate = useNavigate();

  if (!profile) return null;

  const initials = profile.name
    ?.split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'NA';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
      <div className="flex flex-col md:flex-row gap-8 items-start">

        {/* Left: Logo */}
        <div className="shrink-0 flex justify-center w-full md:w-auto">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-50 border-4 border-white shadow-lg">
            {profile.logoUrl ? (
              <img src={profile.logoUrl} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-orange-50 text-orange-600 font-extrabold text-4xl">
                {initials}
              </div>
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div className="grow flex flex-col justify-between w-full">
          <div>
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-1.5">
                  <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                  {profile.verified && (
                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-[11px] font-bold border border-green-100 uppercase tracking-wide">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      Verified Profile
                    </span>
                  )}
                </div>
                {/* <p className="text-sm font-semibold text-gray-600 mb-3">{profile.tagline}</p>
                <p className="text-sm text-gray-500 max-w-3xl leading-relaxed">{profile.description}</p> */}
              </div>

              <button onClick={()=>navigate('/college/update-profile')} className="shrink-0 inline-flex items-center justify-center gap-2 bg-[#ff7a00] hover:bg-[#e66e00] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm">
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-6 border-t border-gray-100">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Profile Code</p>
              <p className="text-sm font-bold text-gray-900">{profile.profile_code}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Established</p>
              <p className="text-sm font-bold text-gray-900">{profile.established}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Category</p>
              <p className="text-sm font-bold text-gray-900">{profile.category}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Partners</p>
              <p className="text-sm font-bold text-gray-900">-</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
=======
import React from 'react';

export default function ProfileBanner() {
  return <div>ProfileBanner</div>;
>>>>>>>


--- FILE: frontend/src/features/college/profile/components/view-profile/ProfileDetails.jsx ---
<<<<<<< (line 1):
import {
  MapPin,
  Globe,
  Mail,
  Phone,
  User,
  Building2,
  Award,
  Users,
  Info,
  ExternalLink
} from 'lucide-react';
import { FaFacebook, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import ProfileCard from './ProfileCard';

export default function ProfileDetails({ profile }) {
  if (!profile) return null;

  const {
    address = "N/A",
    website = "",
    email = "",
    phone = "",
    contact_lead = "N/A",
    collegeType = "N/A",
    accreditation = "N/A",
    learners_guided = "N/A",
    aboutCollege = "",
    contact_person = "N/A",
    socialLinks = {}
  } = profile;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

      {/* LEFT COLUMN: Organization Details */}
      <div className="lg:col-span-8 lg:order-2 flex flex-col gap-6">
        <ProfileCard title="Organization Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

            {/* Left Detail Sub-column */}
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Address
                </label>
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <span className="text-sm font-semibold text-gray-700 leading-relaxed">
                    {address}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Website
                </label>
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                  {website ? (
                    <a
                      href={`https://${website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-[#f26a1b] hover:underline flex items-center gap-1.5 transition-colors"
                    >
                      {website}
                      <ExternalLink className="w-3 h-3 text-[#f26a1b]/70" />
                    </a>
                  ) : (
                    <span className="text-sm font-semibold text-gray-700">N/A</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Email
                </label>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  {email ? (
                    <a
                      href={`mailto:${email}`}
                      className="text-sm font-semibold text-[#f26a1b] hover:underline transition-colors"
                    >
                      {email}
                    </a>
                  ) : (
                    <span className="text-sm font-semibold text-gray-700">N/A</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Phone
                </label>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  {phone ? (
                    <a
                      href={`tel:${phone}`}
                      className="text-sm font-semibold text-gray-700 hover:text-[#f26a1b] transition-colors"
                    >
                      {phone}
                    </a>
                  ) : (
                    <span className="text-sm font-semibold text-gray-700">N/A</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Detail Sub-column */}
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Contact Lead
                </label>
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-sm font-semibold text-gray-700">
                    {contact_lead}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Organization Type
                </label>
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-sm font-semibold text-gray-700">
                    {collegeType}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Recognition
                </label>
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-sm font-semibold text-gray-700">
                    {accreditation}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Learners Guided
                </label>
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-sm font-semibold text-gray-700">
                    {learners_guided}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  About Uptoskills
                </label>
                <div className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <span className="text-sm font-semibold text-gray-700 leading-relaxed">
                    {aboutCollege}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </ProfileCard>
      </div>

      {/* RIGHT COLUMN: Contact Person & Social Links */}
      <div className="lg:col-span-4 lg:order-1 flex flex-col gap-6">

        {/* Contact Person Card */}
        <ProfileCard title="Contact Person">
          <div className="flex flex-col items-center text-center p-2">

            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl border-2 border-emerald-100 shadow-sm mb-3 shrink-0 select-none">
              {contact_person ? contact_person.split(' ').map(n => n[0]).join('') : 'CP'}
            </div>

            <h4 className="text-base font-bold text-gray-800">
              {contact_person || "N/A"}
            </h4>

            <p className="text-xs font-semibold text-gray-400 mt-0.5 mb-5 block">
              {"N/A"}
            </p>

            <div className="w-full h-px bg-gray-100 mb-5"></div>

            <div className="w-full text-left space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="text-sm font-semibold text-[#f26a1b] hover:underline break-all transition-colors"
                  >
                    {email}
                  </a>
                ) : (
                  <span className="text-sm font-semibold text-gray-700">N/A</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                {phone ? (
                  <a
                    href={`tel:${phone}`}
                    className="text-sm font-semibold text-gray-700 hover:text-[#f26a1b] transition-colors"
                  >
                    {phone}
                  </a>
                ) : (
                  <span className="text-sm font-semibold text-gray-700">N/A</span>
                )}
              </div>
            </div>

          </div>
        </ProfileCard>

        {/* Social Links Card */}
        <ProfileCard title="Social Links">
          <div className="space-y-4">

            {/* Facebook */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaFacebook className="w-4.5 h-4.5 text-[#1877F2]" />
                <span className="text-sm font-bold text-gray-500">Facebook</span>
              </div>
              {socialLinks.facebook ? (
                <a
                  href={`https://${socialLinks.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#f26a1b] hover:underline"
                >
                  {socialLinks.facebook}
                </a>
              ) : (
                <span className="text-sm font-semibold text-gray-700">N/A</span>
              )}
            </div>

            {/* LinkedIn */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaLinkedin className="w-4.5 h-4.5 text-[#0A66C2]" />
                <span className="text-sm font-bold text-gray-500">LinkedIn</span>
              </div>
              {socialLinks.linkedin ? (
                <a
                  href={`https://${socialLinks.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#f26a1b] hover:underline"
                >
                  {socialLinks.linkedin}
                </a>
              ) : (
                <span className="text-sm font-semibold text-gray-700">N/A</span>
              )}
            </div>

            {/* Twitter */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaTwitter className="w-4.5 h-4.5 text-[#1DA1F2]" />
                <span className="text-sm font-bold text-gray-500">Twitter</span>
              </div>
              {socialLinks.twitter ? (
                <a
                  href={`https://${socialLinks.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#f26a1b] hover:underline"
                >
                  {socialLinks.twitter}
                </a>
              ) : (
                <span className="text-sm font-semibold text-gray-700">N/A</span>
              )}
            </div>

            {/* Instagram */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaInstagram className="w-4.5 h-4.5 text-[#E1306C]" />
                <span className="text-sm font-bold text-gray-500">Instagram</span>
              </div>
              {socialLinks.instagram ? (
                <a
                  href={`https://${socialLinks.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#f26a1b] hover:underline"
                >
                  {socialLinks.instagram}
                </a>
              ) : (
                <span className="text-sm font-semibold text-gray-700">N/A</span>
              )}
            </div>

          </div>
        </ProfileCard>

      </div>

    </div>
  );
=======
import React from 'react';

export default function ProfileDetails() {
  return <div>ProfileDetails</div>;
>>>>>>>


--- FILE: frontend/src/features/college/profile/pages/CollegeProfilePage.jsx ---
<<<<<<< (line 1):
import { useEffect, useState } from 'react';
import ProfileBanner from '../components/view-profile/ProfileBanner';
import ProfileDetails from '../components/view-profile/ProfileDetails';
import { profileDummyData } from '../types/profileDummyData';
import { getProfile } from '../../services/collegeService';

export default function CollegeProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);


  const fetchProfile = async () => {
   try {
      const result = await getProfile();
      setProfile(result.data);
    } catch (err) {
      console.error('Login error:', err);
    }
    setLoading(false);
   };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ff7a00] mx-auto mb-3" />
          <p className="text-gray-500 text-sm font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-xl border border-red-200">
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">College Profile</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Dashboard &rsaquo; Profile
        </p>
      </div>

      <ProfileBanner profile={profile} />
      <ProfileDetails profile={profile} />
    </div>
  );
=======
import React from 'react';

export default function CollegeProfilePage() {
  return <div>College Profile Page</div>;
>>>>>>>


--- FILE: frontend/src/features/college/routes/AppRoutes.jsx ---
<<<<<<< (line 2):

import CollegeLayout from "../layouts/CollegeLayout";

import DashboardPage from "../dashboard/pages/DashboardPage";
import CollegeProfilePage from "../profile/pages/CollegeProfilePage";
import OrganizationProfile from "../profile/pages/AddCollegeProfile";
import StudentDatabasePage from "../students/pages/StudentDatabasePage";
import CompanyJobPostingsPage from "../company-job-postings/pages/CompanyJobPostingsPage";
import PlacementDrivesPage from "../placement-drives/pages/PlacementDrivesPage";

const collegeRoute = (
  <>
    {/* Public Route */}
    <Route
      path="add-profile"
      element={<OrganizationProfile />}
    />

    {/* College Layout */}
    <Route
      path="college"
      element={<CollegeLayout />}
    >
      <Route
        index
        element={<Navigate to="dashboard" replace />}
      />

      {/* Dashboard */}
      <Route
        path="dashboard"
        element={<DashboardPage />}
      />

      {/* Profile */}
      <Route
        path="profile"
        element={<CollegeProfilePage />}
      />

      <Route
        path="update-profile"
        element={<OrganizationProfile />}
      />

      {/* Students */}
      <Route
        path="student"
        element={<StudentDatabasePage />}
      />

      {/* Companies */}
      <Route
        path="companies"
        element={<CompanyJobPostingsPage />}
      />

      {/* Placement Drives */}
      <Route
        path="drives"
        element={<PlacementDrivesPage />}
      />
=======
import PrivateRoute from "../../../routes/PrivateRoute";
import RoleRoute from "../../../routes/RoleRoute";
import { CollegeLayout } from "../layouts/CollegeLayout";
import Dashboard from "../pages/Dashboard";  // 

const collegeRoute = (
  <Route element={<PrivateRoute />}>
    <Route element={<RoleRoute allowedRoles={['college']} />}>
      <Route path="college" element={<CollegeLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
>>>>>>>


--- FILE: frontend/src/features/company/navbar/components/Navbar.jsx ---
<<<<<<< (line 3):
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GlobalSearch } from "./GlobalSearch";

import { FiBell, FiSettings, FiSearch } from "react-icons/fi";
=======
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { GlobalSearch } from "./GlobalSearch";

import { FiBell, FiSettings, FiSearch, FiMenu } from "react-icons/fi";
>>>>>>>
<<<<<<< (line 497):
const Navbar = () => {
  const navigate = useNavigate();
=======
const Navbar = ({ openSidebar, setOpenSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/dashboard")) return "Dashboard";
    if (path.includes("/drives")) return "Recruitment Drives";
    if (path.includes("/candidates")) return "Candidate Management";
    if (path.includes("/assessments")) return "Assessments";
    if (path.includes("/interviews")) return "Interviews";
    if (path.includes("/training")) return "Training Management";
    if (path.includes("/messages")) return "Messages";
    if (path.includes("/offers")) return "Offers";
    if (path.includes("/reports")) return "Reports & Analytics";
    if (path.includes("/settings")) return "Settings";
    return "Company Portal";
  };
>>>>>>>
<<<<<<< (line 588):
=======
          <button
            onClick={() => setOpenSidebar && setOpenSidebar(!openSidebar)}
            className="md:hidden text-gray-600 hover:text-gray-900 mr-2 p-1 hover:bg-gray-100 rounded-lg transition"
            title="Toggle Sidebar"
          >
            <FiMenu size={20} />
          </button>
>>>>>>>
<<<<<<< (line 604):
          <div className="search-box">
            <FiSearch size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
=======
          <div className="navbar-search-container">
            <FiSearch size={16} className="navbar-search-icon" />
            <input
              type="text"
              className="navbar-search-input"
              placeholder="Search candidates, drives, assessments..."
>>>>>>>
<<<<<<< (line 677):
            onClick={() => navigate("/settings")}
=======
            onClick={() => navigate("/company/settings")}
>>>>>>>


--- FILE: frontend/src/features/company/navbar/styles/navbar.css ---
<<<<<<< (line 1):
.navbar {
  height: 68px;

  background: #ffffff;

  border-bottom: 1px solid #e5e7eb;

  position: fixed;

  top: 0;
  left: 0;
  right: 0;

  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 24px;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 10px;

  width: 240px;
}

.navbar-logo {
  width: 36px;
  height: 36px;

  background: #2563eb;

  border-radius: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;

  font-weight: 700;
  font-size: 16px;
}

.navbar-left h2 {
  font-size: 24px;
  color: #111827;
}

.navbar-center {
  flex: 1;

  display: flex;
  justify-content: center;
}

.search-box {
  width: 420px;
  height: 40px;

  border: 1px solid #d1d5db;

  border-radius: 10px;

  background: white;

  display: flex;
  align-items: center;

  padding: 0 14px;

  gap: 10px;

  position: relative;
}

.search-icon {
  color: #64748b;
}

.search-box input {
  border: none;
  outline: none;

  width: 100%;

  font-size: 14px;
}

.navbar-right {
  width: 240px;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  gap: 14px;
}

.nav-icon {
  width: 38px;
  height: 38px;

  border-radius: 10px;

  background: #f1f5f9;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
}

.profile-circle {
  width: 38px;
  height: 38px;

  border-radius: 50%;

  background: #2563eb;

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 600;
}

@media screen and (max-width: 1023px) {
  .navbar {
    gap: 12px;
  }

  .navbar-left,
  .navbar-right {
    width: auto;
    flex-shrink: 0;
  }

  .navbar-center {
    min-width: 0;
  }

  .navbar .search-box {
    width: min(420px, 100%);
  }
}

@media screen and (max-width: 768px) {
  .navbar-center input {
    display: none;
  }

  .navbar-left h2 {
    display: none;
  }
}

@media screen and (max-width: 480px) {
  .navbar-notification-dropdown {
    position: fixed !important;
    top: 76px !important;
    right: 12px !important;
    left: 12px !important;
    width: auto !important;
=======
/* Navbar Styling */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 40;
}

/* Left Section */
.navbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.navbar-logo {
  height: 36px;
  width: 36px;
  border-radius: 8px;
  background-color: #3b82f6; /* blue */
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
}

.navbar-left h2 {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

/* Center Section (Search Box) */
.navbar-center {
  flex: 1;
  max-width: 420px;
  margin: 0 24px;
}

.navbar-search-container {
  position: relative;
  width: 100%;
}

.navbar-search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
  z-index: 10;
}

.navbar-search-input {
  width: 100%;
  padding: 10px 14px 10px 44px;
  font-size: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background-color: #f9fafb;
  color: #1f2937;
  outline: none;
  transition: all 0.2s ease-in-out;
}

.navbar-search-input:focus {
  background-color: #ffffff;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

/* Right Section */
.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-icon {
  height: 40px;
  width: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #f3f4f6;
}

.nav-icon:hover {
  background-color: #e5e7eb;
  color: #111827;
}

.nav-icon .badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 700;
  border-radius: 9999px;
  height: 18px;
  min-width: 18px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 12px;
  transition: background-color 0.2s ease;
}

.profile-trigger:hover {
  background-color: #f3f4f6;
}

.profile-avatar {
  height: 38px;
  width: 38px;
  border-radius: 50%;
  background-color: #0d9488;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 15px;
  border: 2px solid #ffffff;
  box-shadow: 0 0 0 2px #0d9488;
}

/* Responsive Modal custom overlays */
.responsive-modal-overlay {
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
}

.responsive-modal-panel {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Shift layout left on desktop to make room for fixed sidebar */
@media (min-width: 768px) {
  .navbar {
    padding-left: 24px;
>>>>>>>


--- FILE: frontend/src/features/company/routes/CompanyRoute.jsx ---
<<<<<<< (line 17):
    <Route element={<PrivateRoute />} >
        < Route element={<RoleRoute allowedRoles={['company']} />} >
            <Route path="/company/*" element={<CompanyLayout />} />
            <Route path="/company/add" element={<CompanyLayout />} />
        </Route>
=======
  <Route element={<PrivateRoute />}>
    <Route element={<RoleRoute allowedRoles={["company"]} />}>
      <Route path="company" element={<CompanyLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CompanyDashboard />} />
        <Route path="drives" element={<RecruitmentDrives />} />
        <Route path="candidates" element={<CandidateManagement />} />
        <Route path="assessments" element={<Assessments />} />
        <Route path="interviews" element={<InterviewPage />} />
        <Route path="training" element={<TrainingManagement />} />
        <Route path="messages" element={<CompanyMessages />} />
        <Route path="offers" element={<Offers />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<CompanySettings />} />
      </Route>
>>>>>>>


--- FILE: frontend/src/features/company/sidebar/components/sidebarData.js ---
<<<<<<< (line 17):
    path: "/",
=======
    path: "/company/dashboard",
>>>>>>>
<<<<<<< (line 27):
    path: "/drives",
=======
    path: "/company/drives",
>>>>>>>
<<<<<<< (line 37):
    path: "/candidates",
=======
    path: "/company/candidates",
>>>>>>>
<<<<<<< (line 47):
    path: "/assessments",
=======
    path: "/company/assessments",
>>>>>>>
<<<<<<< (line 57):
    path: "/interviews",
=======
    path: "/company/interviews",
>>>>>>>
<<<<<<< (line 67):
    path: "/training",
=======
    path: "/company/training",
>>>>>>>
<<<<<<< (line 77):
    path: "/messages",
=======
    path: "/company/messages",
>>>>>>>
<<<<<<< (line 87):
    path: "/offers",
=======
    path: "/company/offers",
>>>>>>>
<<<<<<< (line 97):
    path: "/reports",
=======
    path: "/company/reports",
>>>>>>>
<<<<<<< (line 107):
    path: "/settings",
=======
    path: "/company/settings",
>>>>>>>


--- FILE: frontend/src/features/student/components/profile/ProjectCard.jsx ---
<<<<<<< (line 1):
const ProjectCard = ({ project, onEdit, onDelete }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {project.title}
          </h3>

          <p className="text-sm text-gray-600 mt-2">
            {project.description}
          </p>

          <div className="flex gap-2 mt-3 flex-wrap">
            {project.skills?.map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(project)}
            className="px-3 py-1 text-sm bg-yellow-100 rounded"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(project.id)}
            className="px-3 py-1 text-sm bg-red-100 rounded"
          >
            Delete
          </button>
        </div>
      </div>
=======
import PropTypes from "prop-types";

const ProjectCard = ({ project = {}, onEdit, onDelete }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">

      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {project?.title || "Untitled Project"}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            {project?.description || "No description available"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {project?.technologies?.length > 0 ? (
          project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-xs bg-gray-100 rounded-full text-gray-600"
            >
              {tech}
            </span>
          ))
        ) : (
          <span className="text-xs text-gray-400">
            No technologies added
          </span>
        )}
      </div>

      <div className="flex gap-3">
        <button onClick={() => onEdit?.(project)}>Edit</button>
        <button onClick={() => onDelete?.(project)}>Delete</button>
      </div>

>>>>>>>


--- FILE: frontend/src/features/student/pages/profile/ProfilePage.jsx ---
<<<<<<< (line 8):
// ── VALIDATION LOGIC ──
const validateSocialLinks = (links) => {
  const errors = {};
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;

  if (links.github && !urlRegex.test(links.github)) {
    errors.github = "Please enter a valid GitHub URL (e.g., https://github.com/username)";
  }
  if (links.linkedin && !urlRegex.test(links.linkedin)) {
    errors.linkedin = "Please enter a valid LinkedIn profile link";
  }
  if (links.website && !urlRegex.test(links.website)) {
    errors.website = "Please enter a valid website portfolio domain URL";
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};

const ValidationAlert = ({ message }) => {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-500 text-xs font-semibold px-3 py-2 rounded-xl mt-1.5">
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{message}</span>
    </div>
  );
};

// ── MOCK SYSTEM CONSTANTS ──
const DUMMY_PROFILE = {
  name: "Vaishnavi Chaudhari",
  phone: "9876543210",
  city: "Pune",
  department: "Computer Engineering",
  cgpa: 8.7,
  skills: ["React", "Node.js", "Python", "SQL", "Git"],
  email: "vaishnavi@college.edu",
  rollNo: "2021CE047",
  batch: "2021–2025",
  status: "eligible",
  resumeUrl: null,
  // Sourced portfolio links from profile data directly (Fixes Comment #4)
  portfolioLinks: {
    github: "https://github.com/mounikag",
    linkedin: "https://linkedin.com/in/mounikag",
    website: "https://mounikaportfolio.com"
  }
};

// Restored skill icon mappings for consistency (Fixes Comment #3)
const SKILL_ICONS = {
  "React":    { bg: "bg-blue-50",   text: "text-blue-600",   icon: "⚛️" },
  "Node.js":  { bg: "bg-green-50",  text: "text-green-600",  icon: "🟢" },
  "Python":   { bg: "bg-yellow-50", text: "text-yellow-600", icon: "🐍" },
  "SQL":      { bg: "bg-gray-100",  text: "text-gray-700",   icon: "𗄞" },
  "Git":      { bg: "bg-red-50",    text: "text-red-600",    icon: "🔀" },
  "default":  { bg: "bg-gray-50",   text: "text-gray-600",   icon: "💡" },
=======
import { profileDummyData } from "../../../college/profile/types/profileDummyData";
import { validateSocialLinks } from "../../../college/profile/components/validation/profileValidation";

const SKILL_ICONS = {
  React: { bg: "bg-blue-50", icon: "⚛️" },
  "Node.js": { bg: "bg-green-50", icon: "🟢" },
  Python: { bg: "bg-yellow-50", icon: "🐍" },
  SQL: { bg: "bg-gray-100", icon: "🗄️" },
  Git: { bg: "bg-red-50", icon: "🔀" },
  default: { bg: "bg-gray-50", icon: "💡" },
>>>>>>>
<<<<<<< (line 84):
    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{label}</span>
    <span className="text-sm font-semibold text-gray-800">{value || <span className="text-gray-300 italic font-normal">Not provided</span>}</span>
=======
    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
      {label}
    </span>

    <span className="text-sm font-semibold text-gray-800">
      {value || (
        <span className="text-gray-300 italic font-normal">
          Not provided
        </span>
      )}
    </span>
>>>>>>>
<<<<<<< (line 137):
    // Perform links validation during save as well (Fixes Comment #2)
    const currentLinks = updatedData.portfolioLinks || profile.portfolioLinks;
    const validation = validateSocialLinks(currentLinks);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return; // Stop save if links are invalid
    }

    setProfile((prev) => ({ ...prev, ...updatedData }));
=======

    const validation = validateSocialLinks(updatedData);

    if (!validation.isValid) {

      setValidationError(validation.message);

      return;
    }


    setProfile((prev) => ({
      ...prev,
      ...updatedData,
    }));


>>>>>>>
<<<<<<< (line 178):
  const handleAddProject = () => {
    const newProject = {
      id: Date.now(),
      title: `E-Commerce Portfolio System (Project #${projects.length + 1})`,
      description: "Developed integrated middleware service layers, customized styled form blocks, and managed continuous clean tracking state elements.",
      liveLink: "#",
      codeLink: "#",
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const handleDeleteProject = (id) => {
    setProjects((prev) => prev.filter((proj) => proj.id !== id));
  };

  const initials = profile.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
=======

  const initials = profile?.name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0,2)
    .toUpperCase();
>>>>>>>
<<<<<<< (line 211):
        {/* Header Block */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-sm text-gray-400 mt-1">{isEditing ? "Update your details below" : "View and manage your profile"}</p>
          </div>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="text-green-600">Edit Profile</span>
            </button>
          )}
        </div>

        {showSuccess && (
          <div className="mb-5 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-3 rounded-xl">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Profile updated successfully!
          </div>
        )}

        {/* Hero Card Layout */}
        <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm px-4 sm:px-8 py-5 sm:py-7 mb-5 overflow-hidden">
          <div className="absolute right-0 top-0 w-48 h-full overflow-hidden pointer-events-none">
            <div className="absolute -right-10 top-4 w-40 h-40 rounded-full bg-orange-100 opacity-40" />
            <div className="absolute right-4 bottom-0 w-32 h-32 rounded-full bg-green-100 opacity-30" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6 relative z-10">
            <div className="relative shrink-0 mx-auto sm:mx-0">
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-2xl font-bold text-orange-400 border-4 border-white shadow">{initials}</div>
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
            </div>
            <div className="text-center sm:text-left w-full">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-tight">{profile.name}</h2>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-3">
                <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">{profile.rollNo}</span>
                <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">{profile.department}</span>
                <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">Batch {profile.batch}</span>
              </div>
            </div>
=======
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6">


        {validationError && (

          <ValidationAlert
            message={validationError}
            onClose={() => setValidationError(null)}
          />

        )}



        {showSuccess && (

          <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">

            Profile updated successfully!

          </div>

        )}




        <div className="flex justify-between mb-6">


          <div>

            <h1 className="text-3xl font-bold text-gray-900">
              My Profile
            </h1>


            <p className="text-sm text-gray-400">

              {isEditing
                ? "Update your details below"
                : "View and manage your profile"}

            </p>

>>>>>>>
<<<<<<< (line 324):
        {/* Information Views */}
=======



        <div className="bg-white rounded-2xl border p-6 mb-5">


          <div className="flex items-center gap-5">


            <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-xl font-bold">

              {initials}

            </div>



            <div>


              <h2 className="text-xl font-bold">

                {profile.name}

              </h2>


              <p className="text-sm text-gray-500">

                {profile.department}

              </p>


            </div>


          </div>


        </div>




>>>>>>>
<<<<<<< (line 376):
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-base font-bold text-gray-800">Personal Information</h3>
              <div className="w-8 h-0.5 bg-orange-400 mb-5" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <InfoField label="Email" value={profile.email} />
                <InfoField label="Phone" value={profile.phone} />
                <InfoField label="City" value={profile.city} />
                <InfoField label="Department" value={profile.department} />
                <InfoField label="Batch" value={profile.batch} />
                <InfoField label="CGPA" value={profile.cgpa} />
=======



            <div className="lg:col-span-2 bg-white rounded-2xl border p-6">


              <h3 className="font-bold mb-5">

                Personal Information

              </h3>



              <div className="grid sm:grid-cols-2 gap-5">


                <InfoField
                  label="Email"
                  value={profile.email}
                />


                <InfoField
                  label="Phone"
                  value={profile.phone}
                />


                <InfoField
                  label="City"
                  value={profile.city}
                />


                <InfoField
                  label="Department"
                  value={profile.department}
                />

>>>>>>>
<<<<<<< (line 434):
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-base font-bold text-gray-800">Skills</h3>
              <div className="w-8 h-0.5 bg-orange-400 mb-5" />
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => {
                  const config = SKILL_ICONS[skill] || SKILL_ICONS["default"];
                  return (
                    <div key={skill} className={`flex items-center gap-1.5 rounded-xl px-3 py-2 border border-gray-100 ${config.bg}`}>
                      <span className="text-sm">{config.icon}</span>
                      <span className={`text-xs font-semibold ${config.text}`}>{skill}</span>
                    </div>
                  );
                })}
=======




            <div className="bg-white rounded-2xl border p-6">


              <h3 className="font-bold mb-5">

                Skills

              </h3>


              <div className="grid gap-3">


                {profile.skills?.map((skill)=>(


                  <div

                    key={skill}

                    className={`p-3 rounded-xl ${

                      SKILL_ICONS[skill]?.bg ||

                      SKILL_ICONS.default.bg

                    }`}

                  >

                    {SKILL_ICONS[skill]?.icon ||
                    SKILL_ICONS.default.icon}

                    {" "}

                    {skill}


                  </div>


                ))}


>>>>>>>
<<<<<<< (line 553):
        {/* ── PORTFOLIO & PROJECTS PANEL UI ── */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-5 space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-800 mb-3">🌐 Portfolio Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">GitHub Profile</label>
                <input 
                  type="url" 
                  value={profile.portfolioLinks.github} 
                  onChange={(e) => handleLinkChange("github", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 bg-gray-50/50 font-semibold text-gray-700 ${validationErrors.github ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-green-500'}`}
                />
                <ValidationAlert message={validationErrors.github} />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">LinkedIn Profile</label>
                <input 
                  type="url" 
                  value={profile.portfolioLinks.linkedin} 
                  onChange={(e) => handleLinkChange("linkedin", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 bg-gray-50/50 font-semibold text-gray-700 ${validationErrors.linkedin ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-green-500'}`}
                />
                <ValidationAlert message={validationErrors.linkedin} />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Personal Website</label>
                <input 
                  type="url" 
                  value={profile.portfolioLinks.website} 
                  onChange={(e) => handleLinkChange("website", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 bg-gray-50/50 font-semibold text-gray-700 ${validationErrors.website ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-green-500'}`}
                />
                <ValidationAlert message={validationErrors.website} />
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-gray-800">📁 Projects Management</h3>
              <button onClick={handleAddProject} className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm">
                ➕ Add Project
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50 relative group">
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDeleteProject(project.id)} className="text-gray-400 hover:text-red-600 text-xs bg-white border border-gray-200 p-1.5 rounded-lg shadow-sm">
                      🗑️
                    </button>
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm">{project.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-5">
            <ProfileEditForm profile={profile} onSave={handleSave} onCancel={() => setIsEditing(false)} />
=======




        {isEditing && (

          <div className="bg-white rounded-2xl border p-6">


            <ProfileEditForm

              profile={profile}

              onSave={handleSave}

              onCancel={() => setIsEditing(false)}

            />


>>>>>>>
<<<<<<< (line 656):
=======


>>>>>>>
