import { pool } from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

const email = "mentor@test.com";

const client = await pool.connect();
try {
  // 1. Get user id
  const userRes = await client.query(
    `SELECT users.id FROM users WHERE users.email = $1`, [email]
  );
  if (!userRes.rows.length) {
    console.error("❌ User not found. Register via POST /api/auth/register first.");
    process.exit(1);
  }
  const userId = userRes.rows[0].id;

  // 2. Insert mentor row if not exists
  const mentorRes = await client.query(
    `INSERT INTO mentors (user_id, bio, expertise_tags, verified, status)
     VALUES ($1, 'Test mentor', ARRAY['React','Node.js'], true, 'active')
     ON CONFLICT DO NOTHING
     RETURNING id`,
    [userId]
  );
  const mentorId = mentorRes.rows[0]?.id
    ?? (await client.query(`SELECT id FROM mentors WHERE user_id = $1`, [userId])).rows[0].id;

  // 3. Insert a drive owned by this mentor if not exists
  const driveRes = await client.query(
    `INSERT INTO recruitment_drives (mentor_id, title, status)
     VALUES ($1, 'Test Drive 2025', 'active')
     RETURNING id`,
    [mentorId]
  );
  const driveId = driveRes.rows[0].id;

  // 4. Insert a course owned by this mentor if not exists
  const courseRes = await client.query(
    `INSERT INTO courses (mentor_id, drive_id, title, status)
     VALUES ($1, $2, 'Test Course', 'draft')
     RETURNING id`,
    [mentorId, driveId]
  );
  const courseId = courseRes.rows[0].id;

  // 5. Insert a project owned by this mentor
  const projectRes = await client.query(
    `INSERT INTO projects (mentor_id, drive_id, title)
     VALUES ($1, $2, 'Test Project')
     RETURNING id`,
    [mentorId, driveId]
  );
  const projectId = projectRes.rows[0].id;

  console.log("✅ Seed complete. Use these IDs in Postman:");
  console.log(`   Course  ID : ${courseId}`);
  console.log(`   Project ID : ${projectId}`);
  console.log(`   Drive   ID : ${driveId}`);
  console.log(`   Mentor  ID : ${mentorId}`);
} catch (err) {
  console.error("❌ Seed failed:", err.message);
} finally {
  client.release();
  await pool.end();
}
