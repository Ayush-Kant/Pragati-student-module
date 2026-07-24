import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.POSTGRESQL_URI,
});

async function seedDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('Fetching or Seeding Companies...');
    await client.query(`
      INSERT INTO companies (id, name, created_at)
      VALUES 
        (101, 'Google', NOW()), 
        (102, 'Microsoft', NOW())
      ON CONFLICT (id) DO NOTHING
    `);

    console.log('Fetching or Seeding Recruitment Drives...');
    await client.query(`
      INSERT INTO recruitment_drives (id, title, company_id, status, created_at)
      VALUES 
        (201, 'Google Software Engineer Intern 2026', 101, 'active', NOW()),
        (202, 'Microsoft SDE Full-Time', 102, 'active', NOW())
      ON CONFLICT (id) DO NOTHING
    `);

    console.log('Seeding Users & Students...');
    const ids = [301, 302, 303, 304, 305];
    
    // We must insert into auth_users and users first because of foreign keys
    for (let i = 0; i < ids.length; i++) {
      const email = `student${ids[i]}@test.com`;
      
      const authRes = await client.query(`
        INSERT INTO auth_users (email, password_hash, role)
        VALUES ($1, 'hash', 'student')
        ON CONFLICT (email) DO NOTHING
        RETURNING id
      `, [email]);
      
      let authId = null;
      if (authRes.rows.length > 0) {
        authId = authRes.rows[0].id;
        
        await client.query(`
          INSERT INTO users (id, auth_user_id, email, role, created_at)
          VALUES ($1, $2, $3, 'student', NOW())
          ON CONFLICT (id) DO NOTHING
        `, [ids[i], authId, email]);
      }
    }

    await client.query(`
      INSERT INTO students (id, full_name, email, phone, gender, course, branch, college, cgpa, placement_status, skills, status)
      VALUES 
        (301, 'Aryan Sharma', 'student301@test.com', '9876543210', 'Male', 'B.Tech', 'Computer Science', 'IIT Bombay', 9.2, 'Placed', ARRAY['React', 'Node.js', 'Python'], 'verified'),
        (302, 'Sneha Patel', 'student302@test.com', '9876543211', 'Female', 'B.Tech', 'Information Technology', 'NIT Trichy', 8.8, 'Unplaced', ARRAY['Java', 'Spring Boot'], 'verified'),
        (303, 'Rohan Verma', 'student303@test.com', '9876543212', 'Male', 'M.Tech', 'Software Engineering', 'BITS Pilani', 7.9, 'Unplaced', ARRAY['C++', 'AWS', 'Docker'], 'verified'),
        (304, 'Priya Singh', 'student304@test.com', '9876543213', 'Female', 'B.Tech', 'Electronics', 'IIT Bombay', 8.5, 'Placed', ARRAY['Python', 'Machine Learning'], 'verified'),
        (305, 'Vikram Raj', 'student305@test.com', '9876543214', 'Male', 'B.Tech', 'Mechanical', 'NIT Trichy', 7.2, 'Unplaced', ARRAY['AutoCAD', 'C'], 'verified')
      ON CONFLICT DO NOTHING
    `);

    console.log('Seeding Student Progress...');
    await client.query(`
      INSERT INTO student_drive_progress (student_id, drive_id, stage, updated_at)
      VALUES 
        ($1, 201, 'tested', NOW()),
        ($2, 201, 'applied', NOW()),
        ($1, 202, 'selected', NOW()),
        ($3, 202, 'trained', NOW()),
        ($4, 201, 'selected', NOW())
      ON CONFLICT DO NOTHING
    `, [ids[0], ids[1], ids[2], ids[3]]);

    console.log('Seeding Disputes...');
    await client.query(`
      INSERT INTO disputes 
        (id, filed_by_id, filed_by_role, against_id, against_role, dispute_type, description, status, priority, created_at, updated_at)
      VALUES 
        (101, 301, 'student', 1, 'mentor', 'mentor', 'Mentor was not responding to queries for 2 weeks.', 'open', 'high', NOW(), NOW()),
        (102, 302, 'student', 101, 'company', 'fraud', 'Company charged extra fee without notice.', 'open', 'medium', NOW(), NOW()),
        (103, 1, 'admin', 1, 'mentor', 'drive', 'Mentor missed 3 scheduled sessions.', 'in_review', 'low', NOW(), NOW())
      ON CONFLICT DO NOTHING
    `);

    await client.query('COMMIT');
    console.log('✅ Successfully seeded database with rich dummy data for frontend testing!');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', err.message);
  } finally {
    client.release();
    pool.end();
  }
}

seedDatabase();
