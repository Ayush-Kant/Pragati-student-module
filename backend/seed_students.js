import { pool } from './config/db.js';

const seedStudents = [
  {
    enrollment_no: '2023CS001',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@college.edu',
    phone: '9876543210',
    department: 'Computer Science',
    course: 'B.Tech',
    semester: 5,
    batch: '2023',
    cgpa: 8.65,
    placement_status: 'Eligible',
    address: '123 MG Road, Delhi',
    resume_status: 'Uploaded',
    linkedin: 'linkedin.com/in/rahulsharma',
    github: 'github.com/rahulsharma',
    placed_at: null,
    package: null,
    college: null,
    skills: ['React', 'Node.js', 'Python', 'SQL']
  },
  {
    enrollment_no: '2023IT014',
    name: 'Anjali Singh',
    email: 'anjali.singh@college.edu',
    phone: '9876500001',
    department: 'Information Technology',
    course: 'B.Tech',
    semester: 5,
    batch: '2023',
    cgpa: 9.12,
    placement_status: 'Placed',
    address: '45 Park Street, Mumbai',
    resume_status: 'Uploaded',
    linkedin: 'linkedin.com/in/anjalisingh',
    github: 'github.com/anjalisingh',
    placed_at: 'TCS',
    package: '7.5 LPA',
    college: null,
    skills: ['Java', 'Spring Boot', 'MySQL', 'Docker']
  },
  {
    enrollment_no: '2023ME022',
    name: 'Vikram Patel',
    email: 'vikram.patel@college.edu',
    phone: '9123456789',
    department: 'Mechanical Engineering',
    course: 'B.Tech',
    semester: 5,
    batch: '2023',
    cgpa: 7.80,
    placement_status: 'Not Eligible',
    address: '78 Ring Road, Ahmedabad',
    resume_status: 'Not Uploaded',
    linkedin: null,
    github: null,
    placed_at: null,
    package: null,
    college: null,
    skills: ['AutoCAD', 'SolidWorks', 'MATLAB']
  },
  {
    enrollment_no: '2022CS045',
    name: 'Priya Mehta',
    email: 'priya.mehta@college.edu',
    phone: '9988776655',
    department: 'Computer Science',
    course: 'B.Tech',
    semester: 7,
    batch: '2022',
    cgpa: 9.45,
    placement_status: 'Placed',
    address: '12 Sector 5, Noida',
    resume_status: 'Uploaded',
    linkedin: 'linkedin.com/in/priyamehta',
    github: 'github.com/priyamehta',
    placed_at: 'Google',
    package: '24 LPA',
    college: null,
    skills: ['Machine Learning', 'Python', 'TensorFlow', 'AWS']
  },
  {
    enrollment_no: '2022EC033',
    name: 'Arjun Verma',
    email: 'arjun.verma@college.edu',
    phone: '9111222333',
    department: 'Electronics',
    course: 'B.Tech',
    semester: 7,
    batch: '2022',
    cgpa: 8.20,
    placement_status: 'Eligible',
    address: '56 Civil Lines, Jaipur',
    resume_status: 'Uploaded',
    linkedin: 'linkedin.com/in/arjunverma',
    github: null,
    placed_at: null,
    package: null,
    college: null,
    skills: ['Embedded C', 'VLSI', 'Arduino', 'IoT']
  }
];

const seed = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const s of seedStudents) {
      // Check if student already exists (by email or enrollment_no)
      const existing = await client.query(
        'SELECT id FROM students WHERE email = $1 OR enrollment_no = $2',
        [s.email, s.enrollment_no]
      );

      if (existing.rows.length > 0) {
        console.log(`⚠️  Skipping duplicate: ${s.name} (${s.enrollment_no})`);
        continue;
      }

      const res = await client.query(
        `INSERT INTO students
          (enrollment_no, name, email, phone, department, course, semester, batch,
           cgpa, placement_status, address, resume_status, linkedin, github,
           placed_at, package, college)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
         RETURNING id`,
        [s.enrollment_no, s.name, s.email, s.phone, s.department, s.course,
         s.semester, s.batch, s.cgpa, s.placement_status, s.address,
         s.resume_status, s.linkedin, s.github, s.placed_at, s.package, s.college]
      );

      const studentId = res.rows[0].id;

      // Insert skills
      for (const skill of s.skills) {
        await client.query(
          'INSERT INTO student_skills (student_id, skill_name) VALUES ($1, $2)',
          [studentId, skill]
        );
      }

      console.log(`✅ Seeded: ${s.name} (ID: ${studentId})`);
    }

    await client.query('COMMIT');
    console.log('\n🌱 Seed completed!');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('❌ Seed error:', e.message);
  } finally {
    client.release();
    pool.end();
  }
};

seed();
