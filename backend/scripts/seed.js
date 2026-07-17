import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

async function seedData() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    console.log("Clearing existing data...");
    await client.query(`
      TRUNCATE TABLE 
        admin_audit_log,
        student_drive_progress, 
        recruitment_drives, 
        colleges, 
        companies, 
        modules, 
        courses, 
        mentors, 
        users, 
        auth_users,
        students,
        trainings,
        training_progress,
        mentor_feedback,
        dashboard_stats,
        dashboard_activities,
        dashboard_reports,
        live_sessions,
        session_attendance,
        session_participants,
        session_recordings,
        session_schedules
      RESTART IDENTITY CASCADE;
    `);

    console.log("Inserting dashboard stats...");
    await client.query(`
      INSERT INTO dashboard_stats (total_students, active_drives, placements, total_companies, revenue)
      VALUES (1250, 18, 423, 42, 850000.00)
    `);

    console.log("Inserting dashboard activities...");
    await client.query(`
      INSERT INTO dashboard_activities (title, description, status)
      VALUES ('New Student Registered', 'Rahul Sharma completed registration', 'success')
    `);

    console.log("Inserting dashboard reports...");
    await client.query(`
      INSERT INTO dashboard_reports (report_type, report_data) VALUES 
      ('placement', '{"monthly": [10, 20, 30, 40], "categories": ["IT", "Non-IT"]}'),
      ('revenue', '{"monthly": [50000, 60000, 70000], "growth": "15%"}'),
      ('admission', '{"total": 1250, "new": 150, "dropped": 5}')
    `);

    console.log("Inserting auth_users...");
    const passwordHash = await bcrypt.hash("Password123", 10);
    const authUserResult = await client.query(`
      INSERT INTO auth_users (id, email, password_hash, role) VALUES 
      (1, 'mentor@example.com', $1, 'mentor'),
      (2, 'company@gmail.com', $1, 'company')
      RETURNING id, email, role;
    `, [passwordHash]);
    const authUser = authUserResult.rows[0];

    console.log("Inserting users...");
    const userResult = await client.query(`
      INSERT INTO users (id, full_name, auth_user_id, email, role) VALUES 
      (1, 'John Doe', 1, 'mentor@example.com', 'mentor'),
      (2, 'Company Admin', 2, 'company@gmail.com', 'company')
      RETURNING id, full_name, role;
    `);
    const user = userResult.rows[0];

    console.log("Inserting mentors...");
    const mentorResult = await client.query(`
      INSERT INTO mentors (id, user_id, bio, expertise_tags, verified, status) VALUES 
      (1, 1, 'Frontend Development Expert', ARRAY['MERN', 'React', 'Node.js'], true, 'approved')
      RETURNING id;
    `);
    const mentor = mentorResult.rows[0];

    console.log("Inserting companies...");
    const companyResult = await client.query(`
      INSERT INTO companies (id, user_id, name, email) VALUES 
      (1, null, 'Google', 'google@example.com'),
      (2, 2, 'Company Corporate', 'company@gmail.com')
      RETURNING id;
    `);
    const company = companyResult.rows[0];

    console.log("Inserting recruitment drives...");
    const driveResult = await client.query(`
      INSERT INTO recruitment_drives (id, title, company_id, mentor_id, status) VALUES 
      (1, 'Summer Internship Drive 2026', 1, 1, 'active'),
      (2, 'Tech Trainee Hiring 2026', 2, 1, 'active')
      RETURNING id, title;
    `);
    const drive = driveResult.rows[0];

    console.log("Inserting mock students...");
    await client.query(`
      INSERT INTO students (id, name, email, phone, gpa, skills, enrollment_year, status, profile_verified, college, resume_url, graduation_year) VALUES
      (1, 'Rahul Sharma', 'rahul@test.com', '+91 98765 43210', 8.5, ARRAY['MERN', 'Node.js'], 2023, 'verified', true, 'IIT Bombay', 'rahul_patil_resume.pdf', 2026),
      (2, 'Priya Patel', 'priya@test.com', '+91 98765 43211', 9.1, ARRAY['Python', 'AI'], 2022, 'verified', true, 'IIT Delhi', 'priya_sharma_resume.pdf', 2026),
      (3, 'Arjun Kumar', 'arjun@test.com', '+91 98765 43212', 7.8, ARRAY['Java', 'Spring Boot'], 2023, 'verified', true, 'BITS Pilani', 'amit_kumar_resume.pdf', 2026);
    `);

    console.log("Inserting student drive progress...");
    await client.query(`
      INSERT INTO student_drive_progress (id, student_id, drive_id, current_stage, stage, company_id, assessment_score, training_completion, notes, interview_feedback) VALUES
      (1, 1, 2, 'shortlist', 'Shortlisted', 2, 92.00, 90.00, 'Strong technical skills with excellent problem-solving abilities. Demonstrated good communication and teamwork during the interview. Highly recommended for the next round.', 'Excellent performance in technical round.'),
      (2, 2, 2, 'screening', 'Assessment', 2, 88.00, 50.00, 'Awaiting assessment completion. Initial aptitude scores look promising.', 'Pending screening results.'),
      (3, 3, 2, 'interviews', 'Interview', 2, 85.00, 0.00, 'Interview scheduled for next week. Candidate shows good leadership potential.', 'Scheduled for final HR round.');
    `);

    console.log("Inserting training programs...");
    await client.query(`
      INSERT INTO trainings (training_id, company_id, title, description, duration, start_date, end_date, mentor_id, status) VALUES 
      ('t1', 1, 'Full Stack Web Development', 'Deep dive into React, Node.js and PostgreSQL', 12, NOW() - INTERVAL '1 month', NOW() + INTERVAL '2 months', 1, 'ACTIVE'),
      ('t2', 1, 'Cloud Architecture & DevOps', 'AWS, Docker, Kubernetes and CI/CD pipelines', 8, NOW() - INTERVAL '2 months', NOW() - INTERVAL '1 week', 1, 'COMPLETED'),
      ('t3', 2, 'Full Stack Web Development', 'Deep dive into React, Node.js and PostgreSQL', 12, NOW() - INTERVAL '1 month', NOW() + INTERVAL '2 months', 1, 'ACTIVE'),
      ('t4', 2, 'Cloud Architecture & DevOps', 'AWS, Docker, Kubernetes and CI/CD pipelines', 8, NOW() - INTERVAL '2 months', NOW() - INTERVAL '1 week', 1, 'COMPLETED');
    `);

    console.log("Inserting training progress...");
    await client.query(`
      INSERT INTO training_progress (progress_id, training_id, candidate_id, attendance, assignment_score, engagement_score, performance_rating, status) VALUES 
      ('tp1', 't1', 1, 90, 85, 8.2, 4, 'IN_PROGRESS'),
      ('tp2', 't1', 2, 95, 92, 9.0, 5, 'IN_PROGRESS'),
      ('tp3', 't2', 3, 100, 78, 7.5, 3, 'COMPLETED'),
      ('tp4', 't3', 1, 90, 85, 8.2, 4, 'IN_PROGRESS'),
      ('tp5', 't3', 2, 95, 92, 9.0, 5, 'IN_PROGRESS'),
      ('tp6', 't4', 3, 100, 78, 7.5, 3, 'COMPLETED');
    `);

    console.log("Resetting primary key sequences...");
    await client.query(`
      SELECT setval('auth_users_id_seq', COALESCE((SELECT MAX(id) FROM auth_users), 1));
      SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1));
      SELECT setval('mentors_id_seq', COALESCE((SELECT MAX(id) FROM mentors), 1));
      SELECT setval('companies_id_seq', COALESCE((SELECT MAX(id) FROM companies), 1));
      SELECT setval('recruitment_drives_id_seq', COALESCE((SELECT MAX(id) FROM recruitment_drives), 1));
      SELECT setval('students_id_seq', COALESCE((SELECT MAX(id) FROM students), 1));
      SELECT setval('student_drive_progress_id_seq', COALESCE((SELECT MAX(id) FROM student_drive_progress), 1));
    `);

    await client.query("COMMIT");
    console.log("Seed completed successfully!");
    console.log(`Test Mentor Auth User ID: ${authUser.id}`);
    console.log(`Test Mentor User ID: ${user.id}`);
    console.log(`Test Mentor ID: ${mentor.id}`);
    console.log(`Test Drive ID: ${drive.id}`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error seeding data:", error);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedData();
