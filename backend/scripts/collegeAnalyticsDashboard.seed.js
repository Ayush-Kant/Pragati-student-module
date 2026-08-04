/**
 * Location: backend/scripts/collegeAnalyticsDashboard.seed.js
 */
import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

const seedAnalytics = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    console.log("🌱 Starting College Analytics Dashboard Seeding...");

    // 1. Ensure a college auth user and user exists
    const collegeEmail = "college@example.com";
    let authUserResult = await client.query(
      "SELECT id FROM auth_users WHERE email = $1",
      [collegeEmail],
    );
    let authUserId;

    if (authUserResult.rows.length === 0) {
      const passwordHash = await bcrypt.hash("Password123", 10);
      const insertAuth = await client.query(
        "INSERT INTO auth_users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id",
        [collegeEmail, passwordHash, "college"],
      );
      authUserId = insertAuth.rows[0].id;
      console.log(`✅ Created auth user with ID: ${authUserId}`);
    } else {
      authUserId = authUserResult.rows[0].id;
    }

    // Ensure user profile exists
    let userResult = await client.query(
      "SELECT id FROM users WHERE auth_user_id = $1",
      [authUserId],
    );
    let userId;
    if (userResult.rows.length === 0) {
      const insertUser = await client.query(
        "INSERT INTO users (full_name, auth_user_id, email, role) VALUES ($1, $2, $3, $4) RETURNING id",
        ["Pragati College Administrator", authUserId, collegeEmail, "college"],
      );
      userId = insertUser.rows[0].id;
      console.log(`✅ Created user profile with ID: ${userId}`);
    } else {
      userId = userResult.rows[0].id;
    }

    // Ensure college exists
    let collegeResult = await client.query(
      "SELECT id FROM colleges WHERE user_id = $1",
      [userId],
    );
    let collegeId;
    if (collegeResult.rows.length === 0) {
      const insertCollege = await client.query(
        `INSERT INTO colleges (name, user_id, email, departments, status) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [
          "Pragati Institute of Technology",
          userId,
          collegeEmail,
          [
            "Computer Science",
            "Information Technology",
            "Electronics",
            "Mechanical Engineering",
          ],
          "approved",
        ],
      );
      collegeId = insertCollege.rows[0].id;
      console.log(`✅ Created college profile with ID: ${collegeId}`);
    } else {
      collegeId = collegeResult.rows[0].id;
    }

    // Get all college IDs to ensure every college profile is seeded
    const allCollegesRes = await client.query("SELECT id FROM colleges");
    const targetCollegeIds = Array.from(
      new Set([collegeId, ...allCollegesRes.rows.map((r) => r.id)])
    );

    for (const cId of targetCollegeIds) {
      // 2. Clear existing analytics data for this college
      console.log("Clearing existing analytics tables for college ID:", cId);
      await client.query(
        "DELETE FROM analytics_dashboard WHERE college_id = $1",
        [cId]
      );
      await client.query(
        "DELETE FROM placement_statistics WHERE college_id = $1",
        [cId]
      );
      await client.query(
        "DELETE FROM company_statistics WHERE college_id = $1",
        [cId]
      );
      await client.query(
        "DELETE FROM monthly_reports WHERE college_id = $1",
        [cId]
      );
      await client.query(
        "DELETE FROM yearly_reports WHERE college_id = $1",
        [cId]
      );

      // 3. Seed analytics_dashboard
      console.log(`Inserting analytics_dashboard for college ID ${cId}...`);
      await client.query(
        `INSERT INTO analytics_dashboard 
          (college_id, total_students, total_placed, placement_rate, average_package, top_recruiter, active_drives, total_companies)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (college_id) DO UPDATE SET
           total_students = EXCLUDED.total_students,
           total_placed = EXCLUDED.total_placed,
           placement_rate = EXCLUDED.placement_rate,
           average_package = EXCLUDED.average_package,
           top_recruiter = EXCLUDED.top_recruiter,
           active_drives = EXCLUDED.active_drives,
           total_companies = EXCLUDED.total_companies`,
        [cId, 2450, 1280, 82.0, 12.0, "Google", 15, 45]
      );

      // 4. Seed placement_statistics (trends)
      console.log(`Inserting placement_statistics for college ID ${cId}...`);
      const placementTrends = [
        { year: 2021, total: 2000, placed: 950, rate: 70.0, avg: 6.5, max: 18.0 },
        { year: 2022, total: 2100, placed: 1050, rate: 72.5, avg: 7.2, max: 22.0 },
        { year: 2023, total: 2200, placed: 1100, rate: 75.0, avg: 8.0, max: 28.0 },
        { year: 2024, total: 2300, placed: 1180, rate: 78.2, avg: 9.5, max: 32.0 },
        { year: 2025, total: 2400, placed: 1250, rate: 80.5, avg: 11.2, max: 40.0 },
        { year: 2026, total: 2450, placed: 1280, rate: 82.0, avg: 12.0, max: 45.0 },
      ];
      for (const trend of placementTrends) {
        await client.query(
          `INSERT INTO placement_statistics (college_id, year, total_students, total_placed, placement_rate, average_package, highest_package)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (college_id, year) DO UPDATE SET
             total_students = EXCLUDED.total_students,
             total_placed = EXCLUDED.total_placed,
             placement_rate = EXCLUDED.placement_rate,
             average_package = EXCLUDED.average_package,
             highest_package = EXCLUDED.highest_package`,
          [
            cId,
            trend.year,
            trend.total,
            trend.placed,
            trend.rate,
            trend.avg,
            trend.max,
          ]
        );
      }

      // 5. Seed company_statistics
      console.log(`Inserting company_statistics for college ID ${cId}...`);
      const companyStats = [
        { name: "Google", hired: 45, avgPackage: 24.5 },
        { name: "Microsoft", hired: 35, avgPackage: 22.0 },
        { name: "TCS", hired: 250, avgPackage: 4.5 },
        { name: "Infosys", hired: 180, avgPackage: 4.2 },
        { name: "TechCorp", hired: 80, avgPackage: 8.5 },
        { name: "Innovate Ltd", hired: 60, avgPackage: 7.2 },
      ];
      for (const stat of companyStats) {
        const compRes = await client.query(
          "SELECT id FROM companies WHERE name = $1",
          [stat.name]
        );
        const compId = compRes.rows[0]?.id || null;

        await client.query(
          `INSERT INTO company_statistics (college_id, company_id, company_name, total_hired, average_package)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (college_id, company_name) DO UPDATE SET
             total_hired = EXCLUDED.total_hired,
             average_package = EXCLUDED.average_package`,
          [cId, compId, stat.name, stat.hired, stat.avgPackage]
        );
      }

      // 6. Seed department_statistics
      console.log(`Inserting department_statistics for college ID ${cId}...`);
      const deptRes = await client.query("SELECT id, name FROM departments");
      for (const dept of deptRes.rows) {
        let totalStuds = 100;
        let totalPlac = 60;
        let avgPack = 6.0;

        if (dept.name.includes("Computer Science")) {
          totalStuds = 240;
          totalPlac = 210;
          avgPack = 14.5;
        } else if (dept.name.includes("Information Technology")) {
          totalStuds = 180;
          totalPlac = 150;
          avgPack = 11.2;
        } else if (dept.name.includes("Electronics")) {
          totalStuds = 120;
          totalPlac = 90;
          avgPack = 8.5;
        } else if (dept.name.includes("Mechanical")) {
          totalStuds = 100;
          totalPlac = 50;
          avgPack = 6.2;
        }

        await client.query(
          `INSERT INTO department_statistics 
            (department_id, college_id, total_courses, total_students, total_faculty, total_placed, placement_rate, average_package, average_credits)
           VALUES ($1, $2, 4, $3, 15, $4, $5, $6, 4.0)
           ON CONFLICT (department_id) DO UPDATE SET
             college_id = EXCLUDED.college_id,
             total_students = EXCLUDED.total_students,
             total_placed = EXCLUDED.total_placed,
             placement_rate = EXCLUDED.placement_rate,
             average_package = EXCLUDED.average_package`,
          [
            dept.id,
            cId,
            totalStuds,
            totalPlac,
            (totalPlac / totalStuds) * 100,
            avgPack,
          ]
        );
      }

      // 7. Seed monthly_reports
      console.log(`Inserting monthly_reports for college ID ${cId}...`);
      const months = [
        "2026-01",
        "2026-02",
        "2026-03",
        "2026-04",
        "2026-05",
        "2026-06",
      ];
      for (let i = 0; i < months.length; i++) {
        const placed = 150 + i * 25;
        const rate = 65 + i * 2.5;
        const avg = 8.5 + i * 0.5;

        const reportData = {
          monthlyPlacements: placed,
          averagePackage: avg,
          companiesVisited: 5 + i * 2,
          topRecruiterThisMonth: i % 2 === 0 ? "Google" : "Microsoft",
        };

        await client.query(
          `INSERT INTO monthly_reports (college_id, report_month, total_students, total_placed, placement_rate, average_package, report_data)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (college_id, report_month) DO UPDATE SET
             total_students = EXCLUDED.total_students,
             total_placed = EXCLUDED.total_placed,
             placement_rate = EXCLUDED.placement_rate,
             average_package = EXCLUDED.average_package,
             report_data = EXCLUDED.report_data`,
          [
            cId,
            months[i],
            500,
            placed,
            rate,
            avg,
            JSON.stringify(reportData),
          ]
        );
      }

      // 8. Seed yearly_reports
      console.log(`Inserting yearly_reports for college ID ${cId}...`);
      const years = [2024, 2025, 2026];
      for (let i = 0; i < years.length; i++) {
        const placed = 1000 + i * 100;
        const rate = 75 + i * 3.5;
        const avg = 9.0 + i * 1.5;

        const reportData = {
          totalOffers: placed + 150,
          highestPackage: 30 + i * 5,
          totalCompanies: 35 + i * 5,
        };

        await client.query(
          `INSERT INTO yearly_reports (college_id, report_year, total_students, total_placed, placement_rate, average_package, report_data)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (college_id, report_year) DO UPDATE SET
             total_students = EXCLUDED.total_students,
             total_placed = EXCLUDED.total_placed,
             placement_rate = EXCLUDED.placement_rate,
             average_package = EXCLUDED.average_package,
             report_data = EXCLUDED.report_data`,
          [
            cId,
            years[i],
            1500,
            placed,
            rate,
            avg,
            JSON.stringify(reportData),
          ]
        );
      }

      // Update students table for this collegeId
      console.log(`Updating students for college ID ${cId}...`);
      await client.query(
        `UPDATE students 
         SET college_id = $1, college = $2
         WHERE college_id IS NULL OR college_id = $1`,
        [cId, "Pragati Institute of Technology"]
      );
    }

    // Insert extra mock students for dynamic fallback verification
    const extraStudents = [
      {
        id: 10,
        enrollment_no: "2026CS101",
        name: "Anish Gupta",
        email: "anish@test.com",
        phone: "+91 9999900001",
        department: "Computer Science Engineering",
        course: "B.Tech",
        semester: 7,
        batch: "2026",
        cgpa: 8.9,
        placement_status: "Placed",
        placed_at: "Google",
        package: "24 LPA",
      },
      {
        id: 11,
        enrollment_no: "2026CS102",
        name: "Kunal Shah",
        email: "kunal@test.com",
        phone: "+91 9999900002",
        department: "Computer Science Engineering",
        course: "B.Tech",
        semester: 7,
        batch: "2026",
        cgpa: 9.1,
        placement_status: "Placed",
        placed_at: "Microsoft",
        package: "22 LPA",
      },
      {
        id: 12,
        enrollment_no: "2026IT101",
        name: "Riya Sen",
        email: "riya@test.com",
        phone: "+91 9999900003",
        department: "Information Technology",
        course: "B.Tech",
        semester: 7,
        batch: "2026",
        cgpa: 7.8,
        placement_status: "Placed",
        placed_at: "TCS",
        package: "4.5 LPA",
      },
      {
        id: 13,
        enrollment_no: "2026EC101",
        name: "Divya Roy",
        email: "divya@test.com",
        phone: "+91 9999900004",
        department: "Electronics",
        course: "B.Tech",
        semester: 7,
        batch: "2026",
        cgpa: 8.2,
        placement_status: "Placed",
        placed_at: "TechCorp",
        package: "8.5 LPA",
      },
      {
        id: 14,
        enrollment_no: "2026ME101",
        name: "Harsh Vardhan",
        email: "harsh@test.com",
        phone: "+91 9999900005",
        department: "Mechanical Engineering",
        course: "B.Tech",
        semester: 7,
        batch: "2026",
        cgpa: 7.1,
        placement_status: "Eligible",
        placed_at: null,
        package: null,
      },
    ];

    for (const est of extraStudents) {
      await client.query(
        `INSERT INTO students 
          (id, enrollment_no, name, email, phone, department, course, semester, batch, cgpa, placement_status, placed_at, package, college_id, college, status, profile_verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'verified', true)
         ON CONFLICT (id) DO UPDATE SET
           college_id = EXCLUDED.college_id,
           placement_status = EXCLUDED.placement_status,
           placed_at = EXCLUDED.placed_at,
           package = EXCLUDED.package`,
        [
          est.id,
          est.enrollment_no,
          est.name,
          est.email,
          est.phone,
          est.department,
          est.course,
          est.semester,
          est.batch,
          est.cgpa,
          est.placement_status,
          est.placed_at,
          est.package,
          collegeId,
          "Pragati Institute of Technology",
        ],
      );
    }

    console.log("Resetting students ID sequence...");
    await client.query(
      "SELECT setval('students_id_seq', COALESCE((SELECT MAX(id) FROM students), 1))",
    );

    await client.query("COMMIT");
    console.log(
      "🎉 College Analytics Dashboard database seeding completed successfully!",
    );
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Seeding failed:", err.message);
  } finally {
    client.release();
    pool.end();
  }
};

seedAnalytics();
