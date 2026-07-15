import { pool } from '../config/db.js';

const seedData = async () => {
  console.log('🌱 Seeding nomination data...');
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Clear existing dummy data for fresh seeding
    await client.query('TRUNCATE TABLE eligible_students, student_nominations, shortlisted_students, company_shortlists, nomination_statistics RESTART IDENTITY CASCADE');

    console.log('Inserting eligible students...');
    await client.query(`
      INSERT INTO eligible_students
        (student_id, enrollment_no, name, email, department, course, semester, batch, cgpa, placement_status, skills)
      VALUES
        (1, '2023CS001', 'Rahul Sharma', 'rahul@college.edu', 'Computer Science', 'B.Tech', 5, '2023', 8.72, 'Eligible', ARRAY['React', 'Node.js', 'Python']),
        (2, '2023IT012', 'Anjali Singh', 'anjali@college.edu', 'Information Technology', 'B.Tech', 5, '2023', 9.12, 'Eligible', ARRAY['Java', 'Spring Boot', 'MySQL']),
        (3, '2022CS045', 'Priya Mehta', 'priya@college.edu', 'Computer Science', 'B.Tech', 7, '2022', 9.45, 'Eligible', ARRAY['ML', 'Python', 'TensorFlow']),
        (4, '2022EC033', 'Arjun Verma', 'arjun@college.edu', 'Electronics', 'B.Tech', 7, '2022', 8.20, 'Eligible', ARRAY['Embedded C', 'VLSI', 'Arduino']),
        (5, '2022IT018', 'Rohit Joshi', 'rohit@college.edu', 'Information Technology', 'B.Tech', 7, '2022', 7.55, 'Eligible', ARRAY['PHP', 'Laravel', 'MySQL'])
    `);

    console.log('Inserting company shortlists...');
    await client.query(`
      INSERT INTO company_shortlists
        (company_id, company_name, total_nominations, total_shortlisted, total_selected, drive_date, status)
      VALUES
        (1, 'TechCorp', 3, 2, 1, '2025-03-15', 'Active'),
        (2, 'Innovate Ltd', 2, 1, 0, '2025-03-20', 'Active'),
        (3, 'Global Solutions', 0, 0, 0, '2025-04-01', 'Active')
    `);

    console.log('Inserting student nominations...');
    await client.query(`
      INSERT INTO student_nominations
        (student_id, company_id, company_name, nominated_by, status, remarks)
      VALUES
        (1, 1, 'TechCorp', 101, 'Approved', 'Strong candidate'),
        (2, 1, 'TechCorp', 101, 'Approved', 'Good projects'),
        (3, 1, 'TechCorp', 102, 'Pending', 'Awaiting review'),
        (1, 2, 'Innovate Ltd', 101, 'Approved', 'Excellent skills'),
        (4, 2, 'Innovate Ltd', 103, 'Rejected', 'GPA too low')
    `);

    console.log('Inserting shortlisted students...');
    await client.query(`
      INSERT INTO shortlisted_students
        (nomination_id, student_id, company_id, company_name, round, status, remarks)
      VALUES
        (1, 1, 1, 'TechCorp', 'Technical Interview', 'Shortlisted', 'Cleared aptitude'),
        (2, 2, 1, 'TechCorp', 'HR Round', 'Selected', 'Offer extended'),
        (4, 1, 2, 'Innovate Ltd', 'Initial', 'Shortlisted', 'Resume shortlisted')
    `);

    console.log('Inserting nomination statistics...');
    await client.query(`
      INSERT INTO nomination_statistics
        (total_eligible, total_nominated, total_shortlisted, total_selected, department, batch)
      VALUES
        (5, 4, 2, 1, 'Computer Science', '2023'),
        (3, 2, 1, 0, 'Information Technology', '2023')
    `);

    await client.query('COMMIT');
    console.log('✅ Seeding completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
};

seedData();