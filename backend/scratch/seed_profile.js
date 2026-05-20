import { pool } from '../config/db.js';

async function seedMentorProfile() {
  try {
    console.log('Seeding mentor profile data...');
    
    // 1. Create auth_user
    const authUserResult = await pool.query(`
      INSERT INTO auth_users (email, password_hash, role)
      VALUES ('mentor@example.com', 'hashed_password', 'mentor')
      RETURNING id
    `);
    const authUserId = authUserResult.rows[0].id;

    // 2. Create user
    const userResult = await pool.query(`
      INSERT INTO users (full_name, auth_user_id, email, role)
      VALUES ('John Mentor', $1, 'mentor@example.com', 'mentor')
      RETURNING id
    `, [authUserId]);
    const userId = userResult.rows[0].id;

    // 3. Create mentor
    await pool.query(`
      INSERT INTO mentors (user_id, bio, expertise_tags, avatar_url, availability_json, verified)
      VALUES ($1, 'Experienced developer specializing in React and Node.js.', ARRAY['React', 'Node.js', 'PostgreSQL'], 'https://example.com/avatar.jpg', '{"monday": "9am-5pm"}', true)
    `, [userId]);

    // 4. Create a drive
    await pool.query(`
      INSERT INTO drives (mentor_id, title)
      SELECT id, 'Summer Internship 2026' FROM mentors WHERE user_id = $1
    `, [userId]);

    console.log('Seed completed successfully.');
    console.log(`Auth User ID: ${authUserId}`);
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    process.exit(0);
  }
}

seedMentorProfile();
