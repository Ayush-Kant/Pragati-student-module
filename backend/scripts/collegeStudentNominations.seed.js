import { pool } from '../config/db.js'

const seedData = async () => {
  console.log('🌱 Seeding nomination data...')
  try {
    // Seed eligible students
    await pool.query(`
      INSERT INTO eligible_students
        (student_id, enrollment_no, name, email, department, course, semester, batch, cgpa, placement_status, skills)
      VALUES
        (1, '2023CS001', 'Rahul Sharma', 'rahul@college.edu', 'Computer Science', 'B.Tech', 5, '2023', 8.72, 'Eligible', ARRAY['React', 'Node.js', 'Python']),
        (2, '2023IT012', 'Anjali Singh', 'anjali@college.edu', 'Information Technology', 'B.Tech', 5, '2023', 9.12, 'Eligible', ARRAY['Java', 'Spring Boot', 'MySQL']),
        (3, '2022CS045', 'Priya Mehta', 'priya@college.edu', 'Computer Science', 'B.Tech', 7, '2022', 9.45, 'Eligible', ARRAY['ML', 'Python', 'TensorFlow']),
        (4, '2022EC033', 'Arjun Verma', 'arjun@college.edu', 'Electronics', 'B.Tech', 7, '2022', 8.20, 'Eligible', ARRAY['Embedded C', 'VLSI', 'Arduino']),
        (5, '2022IT018', 'Rohit Joshi', 'rohit@college.edu', 'Information Technology', 'B.Tech', 7, '2022', 7.55, 'Eligible', ARRAY['PHP', 'Laravel', 'MySQL'])
      ON CONFLICT DO NOTHING
    `)

    await pool.query(`
      INSERT INTO company_shortlists
        (company_id, company_name, total_nominations, drive_date, status)
      VALUES
        (1, 'TCS', 0, '2025-03-15', 'Active'),
        (2, 'Infosys', 0, '2025-03-20', 'Active'),
        (3, 'Google', 0, '2025-04-01', 'Active')
      ON CONFLICT DO NOTHING
    `)

    console.log('✅ Seeding completed successfully')
  } catch (err) {
    console.error('❌ Seeding failed:', err.message)
    process.exit(1)
  }

  process.exit(0)
}

seedData()