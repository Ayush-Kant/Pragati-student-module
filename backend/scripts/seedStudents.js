import { pool } from "../config/db.js";

const studentSeedData = [
  {
    enrollment_no: "2023CS001",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "9876543210",
    department: "Computer Science",
    course: "B.Tech",
    semester: 5,
    cgpa: 8.72,
    placement_status: "Eligible"
  },
  {
    enrollment_no: "2023IT012",
    name: "Anjali Singh",
    email: "anjali.singh@example.com",
    phone: "9123456780",
    department: "Information Technology",
    course: "B.Tech",
    semester: 5,
    cgpa: 9.12,
    placement_status: "Placed"
  },
  {
    enrollment_no: "2023EC005",
    name: "Vikram Patel",
    email: "vikram.patel@example.com",
    phone: "9871234560",
    department: "Electronics",
    course: "B.Tech",
    semester: 5,
    cgpa: 7.85,
    placement_status: "Eligible"
  }
];

const academicSeedData = [
  {
    student_id: 1, // Will map properly later
    tenth_board: "CBSE",
    tenth_percentage: 92.5,
    tenth_year: 2019,
    twelfth_board: "CBSE",
    twelfth_percentage: 89.0,
    twelfth_year: 2021,
    current_backlogs: 0,
    history_backlogs: 0
  },
  {
    student_id: 2,
    tenth_board: "ICSE",
    tenth_percentage: 95.0,
    tenth_year: 2019,
    twelfth_board: "ISC",
    twelfth_percentage: 93.5,
    twelfth_year: 2021,
    current_backlogs: 0,
    history_backlogs: 0
  }
];

const skillSeedData = [
  {
    student_id: 1,
    skill_name: "React.js",
    skill_level: "Intermediate",
    category: "Frontend"
  },
  {
    student_id: 1,
    skill_name: "Node.js",
    skill_level: "Beginner",
    category: "Backend"
  },
  {
    student_id: 2,
    skill_name: "Python",
    skill_level: "Advanced",
    category: "Programming"
  }
];

async function seedDatabase() {
  console.log("🌱 Starting seed process...");
  try {
    // Insert Students
    for (const student of studentSeedData) {
      const { enrollment_no, name, email, phone, department, course, semester, cgpa, placement_status } = student;
      const res = await pool.query(`
        INSERT INTO students (enrollment_no, name, email, phone, department, course, semester, cgpa, placement_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (enrollment_no) DO NOTHING
        RETURNING id;
      `, [enrollment_no, name, email, phone, department, course, semester, cgpa, placement_status]);
      
      // Assume mapping ID logic here if we wanted to dynamically map it to skills/academic
      // But for simplicity of seed script, we just run inserts that might fail on unique constraints gracefully
    }
    console.log("✅ Students seeded");

    // We can fetch the real IDs based on enrollment_no to seed related data
    const getStudentId = async (enrollment) => {
        const res = await pool.query('SELECT id FROM students WHERE enrollment_no = $1', [enrollment]);
        return res.rows.length > 0 ? res.rows[0].id : null;
    }

    const id1 = await getStudentId("2023CS001");
    const id2 = await getStudentId("2023IT012");

    if (id1) {
        await pool.query(`
            INSERT INTO student_academic_details (student_id, tenth_board, tenth_percentage, tenth_year, twelfth_board, twelfth_percentage, twelfth_year)
            VALUES ($1, 'CBSE', 92.5, 2019, 'CBSE', 89.0, 2021)
            ON CONFLICT (student_id) DO NOTHING;
        `, [id1]);

        await pool.query(`
            INSERT INTO student_skills (student_id, skill_name, skill_level, category)
            VALUES ($1, 'React.js', 'Intermediate', 'Frontend')
            ON CONFLICT (student_id, skill_name) DO NOTHING;
        `, [id1]);
    }

    if (id2) {
        await pool.query(`
            INSERT INTO student_academic_details (student_id, tenth_board, tenth_percentage, tenth_year, twelfth_board, twelfth_percentage, twelfth_year)
            VALUES ($1, 'ICSE', 95.0, 2019, 'ISC', 93.5, 2021)
            ON CONFLICT (student_id) DO NOTHING;
        `, [id2]);

        await pool.query(`
            INSERT INTO student_skills (student_id, skill_name, skill_level, category)
            VALUES ($1, 'Python', 'Advanced', 'Programming')
            ON CONFLICT (student_id, skill_name) DO NOTHING;
        `, [id2]);
    }

    console.log("✅ Academic and Skills seeded");

  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    pool.end();
  }
}

seedDatabase();
