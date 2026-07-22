// projectSeedData.js
import bcrypt from "bcrypt";
import { pool } from "../../config/db.js";

export const seed = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    console.log("Seeding Projects Backend Module data...");

    // 1. Ensure a test student user exists
    const studentEmail = "student@example.com";
    let studentId;

    const userCheck = await client.query("SELECT id FROM users WHERE email = $1", [studentEmail]);
    if (userCheck.rows.length > 0) {
      studentId = userCheck.rows[0].id;
      console.log(`Test student user already exists with ID: ${studentId}`);
    } else {
      // Create auth_user and user
      const passwordHash = await bcrypt.hash("Password123", 10);
      const uuid = "e10b11e2-2a54-41d6-947b-1cb8ff8a1768";
      
      const authUserResult = await client.query(
        `INSERT INTO auth_users (email, password_hash, role, uuid_id)
         VALUES ($1, $2, 'student', $3)
         ON CONFLICT (email) DO NOTHING
         RETURNING id`,
        [studentEmail, passwordHash, uuid]
      );

      let authUserId;
      if (authUserResult.rows.length > 0) {
        authUserId = authUserResult.rows[0].id;
      } else {
        const existingAuth = await client.query("SELECT id FROM auth_users WHERE email = $1", [studentEmail]);
        authUserId = existingAuth.rows[0].id;
      }

      const userResult = await client.query(
        `INSERT INTO users (auth_user_id, email, role, full_name, created_at, username)
         VALUES ($1, $2, 'student', 'Test Student', NOW(), 'teststudent')
         RETURNING id`,
        [authUserId, studentEmail]
      );
      studentId = userResult.rows[0].id;

      // Ensure they also have a record in students table
      await client.query(
        `INSERT INTO students (user_id, name, email, status, profile_verified, created_at)
         VALUES ($1, 'Test Student', $2, 'verified', true, NOW())
         ON CONFLICT (email) DO NOTHING`,
        [studentId, studentEmail]
      );

      console.log(`Created test student user with ID: ${studentId}`);
    }

    // 2. Insert Projects
    const projects = [
      {
        title: "E-Commerce Capstone",
        description: "Build a Full Stack E-Commerce Platform using MERN stack with proper payment gateways, search filters, and dashboard.",
        finalDueAt: "2028-06-01T23:59:00Z",
      },
      {
        title: "DevOps Pipeline Automation",
        description: "Set up a complete CI/CD pipeline using GitHub Actions, Docker, Kubernetes, and AWS S3.",
        finalDueAt: "2028-07-15T23:59:00Z",
      }
    ];

    const seededProjects = [];
    for (const p of projects) {
      const res = await client.query(
        `INSERT INTO projects (title, description, final_due_at)
         VALUES ($1, $2, $3)
         ON CONFLICT DO NOTHING
         RETURNING id, title`,
        [p.title, p.description, p.finalDueAt]
      );
      if (res.rows.length > 0) {
        seededProjects.push(res.rows[0]);
      } else {
        const existing = await client.query("SELECT id, title FROM projects WHERE title = $1", [p.title]);
        seededProjects.push(existing.rows[0]);
      }
    }
    console.log(`✔ Seeded/verified ${seededProjects.length} projects`);

    const ecommerceProjectId = seededProjects.find(p => p.title === "E-Commerce Capstone").id;
    const devopsProjectId = seededProjects.find(p => p.title === "DevOps Pipeline Automation").id;

    // 3. Insert Milestones
    const milestones = [
      {
        projectId: ecommerceProjectId,
        milestoneNumber: 1,
        title: "Database Schema Design",
        description: "Create the Entity-Relationship Diagram and write PostgreSQL DDL migrations.",
        dueAt: "2028-05-15T23:59:00Z"
      },
      {
        projectId: ecommerceProjectId,
        milestoneNumber: 2,
        title: "API Implementation",
        description: "Develop the backend Express.js server and connect database with REST endpoints.",
        dueAt: "2028-05-25T23:59:00Z"
      },
      {
        projectId: devopsProjectId,
        milestoneNumber: 1,
        title: "Dockerization",
        description: "Write Dockerfiles for the microservices and set up Docker Compose.",
        dueAt: "2028-06-15T23:59:00Z"
      }
    ];

    for (const m of milestones) {
      await client.query(
        `INSERT INTO project_milestones (project_id, milestone_number, title, description, due_at)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (project_id, milestone_number) DO NOTHING`,
        [m.projectId, m.milestoneNumber, m.title, m.description, m.dueAt]
      );
    }
    console.log("✔ Seeded project milestones");

    // 4. Insert Rubrics
    const rubrics = [
      { projectId: ecommerceProjectId, criterion: "Database Design", maxScore: 30, description: "Normalized tables, keys, and optimized indexes." },
      { projectId: ecommerceProjectId, criterion: "API Standards", maxScore: 40, description: "Correct HTTP statuses, clean routing, and error handling." },
      { projectId: ecommerceProjectId, criterion: "Code Quality", maxScore: 30, description: "Modular code, async/await, and proper comments." }
    ];

    for (const r of rubrics) {
      await client.query(
        `INSERT INTO project_rubrics (project_id, criterion, max_score, description)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (project_id, criterion) DO NOTHING`,
        [r.projectId, r.criterion, r.maxScore, r.description]
      );
    }
    console.log("✔ Seeded project rubric criteria");

    // 5. Assign student to E-Commerce Capstone
    await client.query(
      `INSERT INTO student_projects (student_id, project_id, assigned_at, status)
       VALUES ($1, $2, NOW(), 'assigned')
       ON CONFLICT (student_id, project_id) DO NOTHING`,
      [studentId, ecommerceProjectId]
    );
    console.log("✔ Assigned student to E-Commerce Capstone project");

    // 6. Insert Final Submission for Priya Patel (student ID = 2 if exists, or studentId from above)
    const finalSubmissionRes = await client.query(
      `INSERT INTO project_submissions (project_id, student_id, github_url, deployed_url, report_url, status)
       VALUES ($1, $2, 'https://github.com/teststudent/ecommerce-capstone', 'https://ecommerce-capstone.vercel.app', 'https://pragati-s3-bucket.s3.amazonaws.com/reports/capstone-report.pdf', 'submitted')
       ON CONFLICT (project_id, student_id) DO NOTHING
       RETURNING id`,
      [ecommerceProjectId, studentId]
    );

    if (finalSubmissionRes.rows.length > 0) {
      const submissionId = finalSubmissionRes.rows[0].id;
      // Seed Feedback
      const feedback = [
        { submissionId, criterion: "Database Design", score: 28, maxScore: 30, comment: "Excellent normalization and index usage." },
        { submissionId, criterion: "API Standards", score: 38, maxScore: 40, comment: "Clean API structure. Missing minor validation checks on one endpoint." },
        { submissionId, criterion: "Code Quality", score: 27, maxScore: 30, comment: "Very good structure and formatting." }
      ];

      for (const f of feedback) {
        await client.query(
          `INSERT INTO project_feedback (submission_id, criterion, score, max_score, comment)
           VALUES ($1, $2, $3, $4, $5)`,
          [f.submissionId, f.criterion, f.score, f.maxScore, f.comment]
        );
      }
      console.log("✔ Seeded project feedback for the final submission");
    }

    await client.query("COMMIT");
    console.log("🎉 Seeding completed successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Seeding failed:", err.message);
    throw err;
  } finally {
    client.release();
  }
};

// If run directly: `node src/seeders/projectSeedData.js`
if (import.meta.url.startsWith("file:") && process.argv[1] && (process.argv[1].endsWith("projectSeedData.js") || process.argv[1].endsWith("projectSeedData"))) {
  seed()
    .then(() => {
      console.log("Done");
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
