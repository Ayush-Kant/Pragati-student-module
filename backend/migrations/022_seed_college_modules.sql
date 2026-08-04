-- ============================================================
-- Migration 022: Seed college module data
-- Provides dummy data for all college-related modules so they
-- work out-of-the-box after running scripts/migrate.js.
-- Idempotent — safe to run multiple times.
-- ============================================================

-- Extension for password hashing (idempotent)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  _auth_user_id   INT;
  _user_id        INT;
  _college_id     INT;
  _student1_id    INT;
  _student2_id    INT;
  _student3_id    INT;
  _company_id     INT;
  _job_id         INT;
  _drive1_id      INT;
  _drive2_id      INT;
  _nom1_id        INT;
  _nom2_id        INT;
  _nom3_id        INT;
BEGIN

  -- ==================================================================
  -- 1. BASE ENTITIES (auth_users → users → colleges)
  -- ==================================================================
  SELECT id INTO _auth_user_id FROM auth_users WHERE email = 'college@demo.edu';
  IF _auth_user_id IS NULL THEN
    INSERT INTO auth_users (email, password_hash, role, uuid_id)
      VALUES ('college@demo.edu', crypt('college123', gen_salt('bf')), 'college', gen_random_uuid())
      RETURNING id INTO _auth_user_id;
  END IF;

  SELECT id INTO _user_id FROM users WHERE auth_user_id = _auth_user_id;
  IF _user_id IS NULL THEN
    INSERT INTO users (full_name, auth_user_id, email, role)
      VALUES ('Demo College Admin', _auth_user_id, 'college@demo.edu', 'college')
      RETURNING id INTO _user_id;
  END IF;

  SELECT id INTO _college_id FROM colleges WHERE user_id = _auth_user_id;
  IF _college_id IS NULL THEN
    INSERT INTO colleges (name, user_id, email, departments, status, phone, website, location, established, category, student_strength)
      VALUES (
        'Pragati Institute of Technology',
        _auth_user_id,
        'college@demo.edu',
        ARRAY['Computer Science', 'Information Technology', 'Electronics', 'Mechanical'],
        'approved',
        '+91-9876543210',
        'https://pragati.edu',
        'Bangalore, Karnataka',
        2005,
        'Engineering',
        1200
      )
      RETURNING id INTO _college_id;
  END IF;

  -- ==================================================================
  -- 2. COLLEGE PROFILE
  -- ==================================================================
  IF NOT EXISTS (SELECT 1 FROM college_profiles WHERE user_id = _user_id) THEN
    INSERT INTO college_profiles (user_id, college_name, college_code, address, website, contact_number, established_year, accreditation)
      VALUES (_user_id, 'Pragati Institute of Technology', 'PIT001', 'Electronic City, Bangalore', 'https://pragati.edu', '+91-9876543210', 2005, 'NAAC A+');
  END IF;

  -- ==================================================================
  -- 3. COLLEGE STATS
  -- ==================================================================
  IF NOT EXISTS (SELECT 1 FROM college_stats WHERE college_id = _college_id) THEN
    INSERT INTO college_stats (college_id, total_students_enrolled, total_selected, active_drive_count, participation_rate, selection_rate, performance_rank)
      VALUES (_college_id, 1200, 850, 5, 78.50, 70.83, 15);
  END IF;

  -- ==================================================================
  -- 4. STUDENT SUPPLEMENTARY DATA
  --    (students already seeded by 005; enrich with skills, academics, docs)
  -- ==================================================================
  SELECT id INTO _student1_id FROM students WHERE email = 'rahul@test.com';
  SELECT id INTO _student2_id FROM students WHERE email = 'priya@test.com';
  SELECT id INTO _student3_id FROM students WHERE email = 'arjun@test.com';

  -- Update students with college_id and additional fields
  IF _student1_id IS NOT NULL THEN
    UPDATE students SET college_id = _college_id, department = 'Computer Science', course = 'B.Tech', semester = 5, batch = '2023', cgpa = 8.50, placement_status = 'Eligible' WHERE id = _student1_id;
  END IF;
  IF _student2_id IS NOT NULL THEN
    UPDATE students SET college_id = _college_id, department = 'Computer Science', course = 'B.Tech', semester = 7, batch = '2022', cgpa = 9.10, placement_status = 'Eligible' WHERE id = _student2_id;
  END IF;
  IF _student3_id IS NOT NULL THEN
    UPDATE students SET college_id = _college_id, department = 'Information Technology', course = 'B.Tech', semester = 5, batch = '2023', cgpa = 7.80, placement_status = 'Eligible' WHERE id = _student3_id;
  END IF;

  -- Student skills
  IF _student1_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_skills WHERE student_id = _student1_id) THEN
    INSERT INTO student_skills (student_id, skill_name) VALUES
      (_student1_id, 'React'), (_student1_id, 'Node.js'), (_student1_id, 'MongoDB'), (_student1_id, 'Python');
  END IF;
  IF _student2_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_skills WHERE student_id = _student2_id) THEN
    INSERT INTO student_skills (student_id, skill_name) VALUES
      (_student2_id, 'Python'), (_student2_id, 'Machine Learning'), (_student2_id, 'TensorFlow'), (_student2_id, 'SQL');
  END IF;
  IF _student3_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_skills WHERE student_id = _student3_id) THEN
    INSERT INTO student_skills (student_id, skill_name) VALUES
      (_student3_id, 'Java'), (_student3_id, 'Spring Boot'), (_student3_id, 'Microservices'), (_student3_id, 'AWS');
  END IF;

  -- Student academic details
  IF _student1_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_academic_details WHERE student_id = _student1_id) THEN
    INSERT INTO student_academic_details (student_id, tenth_percentage, twelfth_percentage, backlogs, active_backlogs)
      VALUES (_student1_id, 88.50, 82.00, 0, 0);
  END IF;
  IF _student2_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_academic_details WHERE student_id = _student2_id) THEN
    INSERT INTO student_academic_details (student_id, tenth_percentage, twelfth_percentage, backlogs, active_backlogs)
      VALUES (_student2_id, 92.00, 89.50, 0, 0);
  END IF;
  IF _student3_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_academic_details WHERE student_id = _student3_id) THEN
    INSERT INTO student_academic_details (student_id, tenth_percentage, twelfth_percentage, backlogs, active_backlogs)
      VALUES (_student3_id, 78.00, 75.50, 2, 1);
  END IF;

  -- Student documents
  IF _student1_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_documents WHERE student_id = _student1_id) THEN
    INSERT INTO student_documents (student_id, document_type, document_url) VALUES
      (_student1_id, 'Resume', '/uploads/resumes/rahul_resume.pdf'),
      (_student1_id, 'Transcript', '/uploads/transcripts/rahul_transcript.pdf');
  END IF;

  -- ==================================================================
  -- 5. COMPANY + JOB POSTINGS
  -- ==================================================================
  SELECT id INTO _company_id FROM companies WHERE email = 'hr@techcorp.com';
  IF _company_id IS NULL THEN
    INSERT INTO companies (name, email, industry, size, location, website, status, verification_status)
      VALUES ('TechCorp India', 'hr@techcorp.com', 'Information Technology', '1000-5000', 'Bangalore', 'https://techcorp.com', 'approved', 'verified')
      RETURNING id INTO _company_id;
  END IF;

  -- Job postings
  IF NOT EXISTS (SELECT 1 FROM job_postings WHERE company_id = _company_id) THEN
    INSERT INTO job_postings (company_id, title, description, job_type, location, salary_min, salary_max, experience_required, status)
      VALUES (_company_id, 'Software Engineer', 'Full-stack development role with React and Node.js', 'Full-time', 'Bangalore', 1200000, 1800000, '0-2 years', 'active')
      RETURNING id INTO _job_id;

    INSERT INTO job_eligibility (job_id, qualification, min_percentage, max_backlogs, allowed_batch_year)
      VALUES (_job_id, 'B.Tech CSE/IT', 70, 0, 2024);
  END IF;

  -- ==================================================================
  -- 6. DRIVE NOMINEES, NOMINATIONS & SHORTLISTS (020 tables)
  --    Uses placement_drives seeded by 013 + students
  -- ==================================================================
  SELECT id INTO _drive1_id FROM placement_drives WHERE company = 'Google' LIMIT 1;
  SELECT id INTO _drive2_id FROM placement_drives WHERE company = 'Microsoft' LIMIT 1;

  -- Drive nominees
  IF _drive1_id IS NOT NULL AND _student1_id IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM drive_nominees WHERE drive_id = _drive1_id AND student_id = _student1_id) THEN
    INSERT INTO drive_nominees (drive_id, student_id, status, approved_by)
      VALUES (_drive1_id, _student1_id, 'Approved', _user_id);
  END IF;
  IF _drive1_id IS NOT NULL AND _student2_id IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM drive_nominees WHERE drive_id = _drive1_id AND student_id = _student2_id) THEN
    INSERT INTO drive_nominees (drive_id, student_id, status, approved_by)
      VALUES (_drive1_id, _student2_id, 'Approved', _user_id);
  END IF;

  -- Drive nominations
  IF _drive1_id IS NOT NULL AND _student1_id IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM drive_nominations WHERE drive_id = _drive1_id AND student_id = _student1_id) THEN
    INSERT INTO drive_nominations (drive_id, student_id, nominated_by, status)
      VALUES (_drive1_id, _student1_id, _user_id, 'Nominated')
      RETURNING id INTO _nom1_id;
  END IF;
  IF _drive1_id IS NOT NULL AND _student2_id IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM drive_nominations WHERE drive_id = _drive1_id AND student_id = _student2_id) THEN
    INSERT INTO drive_nominations (drive_id, student_id, nominated_by, status)
      VALUES (_drive1_id, _student2_id, _user_id, 'Nominated')
      RETURNING id INTO _nom2_id;
  END IF;

  -- Drive shortlists
  IF _drive1_id IS NOT NULL AND _nom1_id IS NOT NULL AND _student1_id IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM drive_shortlists WHERE drive_id = _drive1_id AND student_id = _student1_id) THEN
    INSERT INTO drive_shortlists (drive_id, nomination_id, student_id, shortlisted_by, round, status)
      VALUES (_drive1_id, _nom1_id, _student1_id, _user_id, 'Technical Interview', 'Shortlisted');
  END IF;

  -- Update drive statistics
  IF _drive1_id IS NOT NULL THEN
    UPDATE drive_statistics SET total_applied = (
      SELECT COUNT(*) FROM drive_nominations WHERE drive_id = _drive1_id AND status != 'Withdrawn'
    ) WHERE drive_id = _drive1_id;
  END IF;

  -- ==================================================================
  -- 7. GENERATED REPORTS (for Reports module)
  -- ==================================================================
  IF NOT EXISTS (SELECT 1 FROM generated_reports WHERE title = 'Placement Summary 2025-26') THEN
    INSERT INTO generated_reports (title, type, status, format, content, created_by)
      VALUES (
        'Placement Summary 2025-26',
        'placement',
        'completed',
        'json',
        '{"totalStudents": 1200, "totalPlaced": 850, "placementRate": 70.83, "averagePackage": 8.5, "topRecruiters": ["TechCorp", "Google", "Microsoft"]}',
        'college@demo.edu'
      );
  END IF;

END $$;
