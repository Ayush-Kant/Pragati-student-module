import { pool } from "../config/db.js";

async function seedData() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    console.log("Clearing existing data...");
    await client.query(`
      TRUNCATE TABLE 
        mentor_feedback,
        training_progress,
        trainings,
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
        dashboard_stats,
        dashboard_activities,
        dashboard_reports
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
    // 1. Mentor
    await client.query(`
      INSERT INTO auth_users (id, uuid_id, email, password_hash, role) VALUES 
      (1, 'uuid-mentor-1', 'mentor@example.com', '$2b$10$wEdbVskJ22j29f8f292jf2', 'mentor')
    `);
    // 2. Company Representative User
    await client.query(`
      INSERT INTO auth_users (id, uuid_id, email, password_hash, role) VALUES 
      (2, 'uuid-company-1', 'hr@google.com', '$2b$10$wEdbVskJ22j29f8f292jf2', 'company')
    `);
    // 3. Student User
    await client.query(`
      INSERT INTO auth_users (id, uuid_id, email, password_hash, role) VALUES 
      (3, 'uuid-student-1', 'student@example.com', '$2b$10$wEdbVskJ22j29f8f292jf2', 'student')
    `);

    console.log("Inserting users...");
    await client.query(`
      INSERT INTO users (id, full_name, auth_user_id, email, role) VALUES 
      (1, 'John Doe', 1, 'mentor@example.com', 'mentor')
    `);
    await client.query(`
      INSERT INTO users (id, full_name, auth_user_id, email, role) VALUES 
      (2, 'Google HR Officer', 2, 'hr@google.com', 'company')
    `);
    await client.query(`
      INSERT INTO users (id, full_name, auth_user_id, email, role) VALUES 
      (3, 'Alice Smith', 3, 'student@example.com', 'student')
    `);

    console.log("Inserting mentors...");
    await client.query(`
      INSERT INTO mentors (id, user_id, bio, expertise_tags, verified, status) VALUES 
      (1, 1, 'Frontend Development Expert', ARRAY['MERN', 'React', 'Node.js'], true, 'approved')
    `);

    console.log("Inserting companies...");
    await client.query(`
      INSERT INTO companies (id, user_id, name, email, status) VALUES 
      (1, 2, 'Google', 'hr@google.com', 'approved')
    `);

    console.log("Inserting students...");
    await client.query(`
      INSERT INTO students (id, full_name, email, phone) VALUES 
      (1, 'Alice Smith', 'student@example.com', '1234567890')
    `);

    console.log("Inserting recruitment drives...");
    await client.query(`
      INSERT INTO recruitment_drives (id, title, company_id, mentor_id, status) VALUES 
      (1, 'Summer Internship Drive 2026', 1, 1, 'active')
    `);

    console.log("Inserting trainings...");
    await client.query(`
      INSERT INTO trainings (training_id, company_id, title, description, duration, start_date, end_date, mentor_id, curriculum, status) VALUES 
      ('T101', 1, 'React Bootcamp', 'Complete React training covering fundamentals, hooks, and context API', 30, '2026-05-15 00:00:00', '2026-06-15 00:00:00', 1, '["React Basics", "Components & Props", "State & Lifecycle", "Hooks", "Context API"]'::jsonb, 'ACTIVE'),
      ('T102', 1, 'Node.js Advanced', 'Advanced backend course with Node.js and Express', 30, '2026-06-01 00:00:00', '2026-07-01 00:00:00', null, '["Event Loop", "Streams", "Express Routing", "Sequelize ORM"]'::jsonb, 'ACTIVE')
    `);

    console.log("Inserting training progress...");
    await client.query(`
      INSERT INTO training_progress (progress_id, training_id, candidate_id, attendance, assignment_score, engagement_score, performance_rating, readiness_score, completion_date, status) VALUES 
      ('TP101', 'T101', 1, 90, 85, 4.5, 4, 87, null, 'IN_PROGRESS')
    `);

    console.log("Inserting mentor feedback...");
    await client.query(`
      INSERT INTO mentor_feedback (feedback_id, training_id, mentor_id, candidate_id, feedback, rating) VALUES 
      ('MF101', 'T101', 1, 1, 'Good progress overall, candidate is grasping concepts well', 4)
    `);

    await client.query("COMMIT");
    console.log("Seed completed successfully!");
    console.log(`Test Mentor Auth User ID: 1`);
    console.log(`Test Mentor ID: 1`);
    console.log(`Test Company Representative User ID: 2`);
    console.log(`Test Company ID: 1`);
    console.log(`Test Student Candidate ID: 1`);
    console.log(`Test Training ID: T101, T102`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error seeding data:", error);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedData();
