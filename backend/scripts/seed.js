import { pool } from "../config/db.js";

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
        students
      RESTART IDENTITY CASCADE;
    `);

    console.log("Inserting auth_users...");
    const authUserResult = await client.query(`
      INSERT INTO auth_users (id, email, password_hash, role) VALUES 
      (1, 'mentor@example.com', '$2b$10$wEdbVskJ22j29f8f292jf2', 'mentor')
      RETURNING id, email, role;
    `);
    const authUser = authUserResult.rows[0];

    console.log("Inserting users...");
    const userResult = await client.query(`
      INSERT INTO users (id, full_name, auth_user_id, email, role) VALUES 
      (1, 'John Doe', 1, 'mentor@example.com', 'mentor')
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
      INSERT INTO companies (id, name) VALUES 
      (1, 'Google')
      RETURNING id;
    `);
    const company = companyResult.rows[0];

    console.log("Inserting recruitment drives...");
    const driveResult = await client.query(`
      INSERT INTO recruitment_drives (id, title, company_id, mentor_id, status) VALUES 
      (1, 'Summer Internship Drive 2026', 1, 1, 'active')
      RETURNING id, title;
    `);
    const drive = driveResult.rows[0];

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
