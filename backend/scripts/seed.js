import { pool } from '../config/db.js';

async function seedData() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    console.log('Clearing existing data...');
    // Clear in correct order due to foreign keys
    await client.query(`
      TRUNCATE TABLE student_progress, live_sessions, recruitment_drives, 
      notifications, submissions, assessments, courses, mentors, users RESTART IDENTITY CASCADE;
    `);

    console.log('Inserting users...');
    const usersResult = await client.query(`
      INSERT INTO users (full_name, email, role) VALUES 
      ('John Doe', 'john@example.com', 'mentor'),
      ('Jane Smith', 'jane@example.com', 'student'),
      ('Bob Wilson', 'bob@example.com', 'student')
      RETURNING id, role;
    `);
    
    const mentorUser = usersResult.rows.find(u => u.role === 'mentor');
    const students = usersResult.rows.filter(u => u.role === 'student');

    console.log('Inserting mentors...');
    const mentorResult = await client.query(`
      INSERT INTO mentors (user_id, specialization) VALUES 
      ($1, 'Frontend Development')
      RETURNING id;
    `, [mentorUser.id]);
    const mentorId = mentorResult.rows[0].id;

    console.log('Inserting courses and assessments...');
    const courseResult = await client.query(`
      INSERT INTO courses (mentor_id, title) VALUES 
      ($1, 'React Masterclass')
      RETURNING id;
    `, [mentorId]);
    const courseId = courseResult.rows[0].id;

    const assessmentResult = await client.query(`
      INSERT INTO assessments (course_id, title) VALUES 
      ($1, 'Final Project')
      RETURNING id;
    `, [courseId]);
    const assessmentId = assessmentResult.rows[0].id;

    console.log('Inserting submissions...');
    await client.query(`
      INSERT INTO submissions (assessment_id, student_id, status) VALUES 
      ($1, $2, 'submitted'),
      ($1, $3, 'pending')
    `, [assessmentId, students[0].id, assessmentId, students[1].id]);

    console.log('Inserting recruitment drives...');
    const driveResult = await client.query(`
      INSERT INTO recruitment_drives (mentor_id, title, status) VALUES 
      ($1, 'Summer Internship Drive 2026', 'active'),
      ($1, 'Winter Hiring', 'completed')
      RETURNING id;
    `, [mentorId]);
    const driveId = driveResult.rows[0].id;

    console.log('Inserting live sessions...');
    await client.query(`
      INSERT INTO live_sessions (mentor_id, title, session_type, scheduled_at) VALUES 
      ($1, 'Mock Interview Session', 'interview', NOW() + INTERVAL '1 day'),
      ($1, 'Resume Review', 'webinar', NOW() + INTERVAL '2 days')
    `, [mentorId]);

    console.log('Inserting student progress...');
    await client.query(`
      INSERT INTO student_progress (student_id, drive_id, readiness_score, completion_pct) VALUES 
      ($1, $2, 85, 90),
      ($3, $2, 72, 80)
    `, [students[0].id, driveId, students[1].id]);

    await client.query('COMMIT');
    console.log('Seed completed successfully!');
    console.log(`Test Mentor User ID (for Firebase/Auth mock): ${mentorUser.id}`);
    console.log(`Test Mentor ID (in mentors table): ${mentorId}`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding data:', error);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedData();
