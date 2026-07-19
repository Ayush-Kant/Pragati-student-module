-- ============================================================
-- Seed data: Departments & Courses module
-- Location: backend/migrations/college_departments_courses_seed.sql
--
-- Run this AFTER college_departments_courses_schema.sql has been
-- applied. Safe to run once; running it twice will fail on the
-- UNIQUE constraints (code/course_code) rather than duplicating rows.
-- ============================================================

-- Departments
INSERT INTO departments (name, code, hod) VALUES
  ('Computer Science Engineering', 'CSE', 'Dr. Rajesh Kumar'),
  ('Information Technology', 'IT', 'Dr. Anil Sharma');

-- Courses (looked up by department code via subquery, so we don't
-- need to hardcode department ids)
INSERT INTO college_courses (course_name, course_code, semester, credits, department_id)
VALUES
  ('Data Structures', 'CS201', 3, 4, (SELECT id FROM departments WHERE code = 'CSE')),
  ('Database Management Systems', 'CS301', 5, 4, (SELECT id FROM departments WHERE code = 'CSE'));

-- Department-course mapping (owning department relationship)
INSERT INTO department_courses (department_id, course_id, is_elective)
SELECT d.id, c.id, FALSE
FROM departments d
JOIN college_courses c ON c.department_id = d.id
ON CONFLICT (department_id, course_id) DO NOTHING;

-- Department statistics: derive total_courses/average_credits from
-- the courses table, then set sample totals for students/faculty
-- (not derivable from courses alone).
INSERT INTO department_statistics (department_id, total_courses, total_students, total_faculty, average_credits)
SELECT
  d.id,
  COUNT(c.id)::int,
  CASE WHEN d.code = 'CSE' THEN 240 WHEN d.code = 'IT' THEN 180 ELSE 0 END,
  CASE WHEN d.code = 'CSE' THEN 18 WHEN d.code = 'IT' THEN 14 ELSE 0 END,
  COALESCE(AVG(c.credits), 0)::numeric(4,2)
FROM departments d
LEFT JOIN college_courses c ON c.department_id = d.id AND c.is_active = TRUE
GROUP BY d.id, d.code
ON CONFLICT (department_id) DO UPDATE SET
  total_courses   = EXCLUDED.total_courses,
  total_students  = EXCLUDED.total_students,
  total_faculty   = EXCLUDED.total_faculty,
  average_credits = EXCLUDED.average_credits,
  updated_at      = NOW();