// createProjectsTables.js
import { pool } from "../../../config/db.js";

export const up = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    console.log("Starting Projects Backend Module migrations...");

    // 1. Projects Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        final_due_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log("✔ Created projects table");

    // 2. Project Milestones Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS project_milestones (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        milestone_number INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        due_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_project_milestone UNIQUE (project_id, milestone_number)
      );
    `);
    console.log("✔ Created project_milestones table");

    // 3. Project Submissions Table (for Final Capstone Project)
    await client.query(`
      CREATE TABLE IF NOT EXISTS project_submissions (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        github_url TEXT NOT NULL,
        deployed_url TEXT,
        report_url TEXT, -- Capstone PDF report URL
        submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        status VARCHAR(50) NOT NULL DEFAULT 'submitted', -- 'submitted', 'graded', etc.
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_student_project_submission UNIQUE (project_id, student_id)
      );
    `);
    console.log("✔ Created project_submissions table");

    // 4. Project Milestone Submissions Table (for Milestone-specific Submissions)
    await client.query(`
      CREATE TABLE IF NOT EXISTS project_milestone_submissions (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        milestone_id INTEGER NOT NULL REFERENCES project_milestones(id) ON DELETE CASCADE,
        student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        github_url TEXT NOT NULL,
        deployed_url TEXT,
        submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        status VARCHAR(50) NOT NULL DEFAULT 'submitted',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_student_milestone_submission UNIQUE (milestone_id, student_id)
      );
    `);
    console.log("✔ Created project_milestone_submissions table");

    // 5. Project Rubrics Table (for grading criteria definition)
    await client.query(`
      CREATE TABLE IF NOT EXISTS project_rubrics (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        criterion VARCHAR(255) NOT NULL,
        max_score NUMERIC(5,2) NOT NULL,
        description TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_project_rubric_criterion UNIQUE (project_id, criterion)
      );
    `);
    console.log("✔ Created project_rubrics table");

    // 6. Project Feedback Table (tied to Capstone Submissions)
    await client.query(`
      CREATE TABLE IF NOT EXISTS project_feedback (
        id SERIAL PRIMARY KEY,
        submission_id INTEGER NOT NULL REFERENCES project_submissions(id) ON DELETE CASCADE,
        criterion VARCHAR(255) NOT NULL,
        score NUMERIC(5,2) NOT NULL,
        max_score NUMERIC(5,2) NOT NULL,
        comment TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log("✔ Created project_feedback table");

    // 7. Student Projects Table (Mapping assigned students to projects)
    await client.query(`
      CREATE TABLE IF NOT EXISTS student_projects (
        id SERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        status VARCHAR(50) NOT NULL DEFAULT 'assigned', -- 'assigned', 'completed'
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_student_project_assignment UNIQUE (student_id, project_id)
      );
    `);
    console.log("✔ Created student_projects table");

    // Create Indexes
    await client.query(`CREATE INDEX IF NOT EXISTS idx_project_milestones_project ON project_milestones(project_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_project_submissions_project_student ON project_submissions(project_id, student_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_project_milestone_subs_milestone_student ON project_milestone_submissions(milestone_id, student_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_project_rubrics_project ON project_rubrics(project_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_project_feedback_submission ON project_feedback(submission_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_student_projects_student_project ON student_projects(student_id, project_id);`);
    console.log("✔ Created database indexes");

    await client.query("COMMIT");
    console.log("🎉 All migrations applied successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Migration failed:", err.message);
    throw err;
  } finally {
    client.release();
  }
};

export const down = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    console.log("Rolling back Projects Backend Module tables...");
    await client.query(`DROP TABLE IF EXISTS student_projects CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS project_feedback CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS project_rubrics CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS project_milestone_submissions CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS project_submissions CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS project_milestones CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS projects CASCADE;`);
    await client.query("COMMIT");
    console.log("✔ Rolled back all tables successfully.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Rollback failed:", err.message);
    throw err;
  } finally {
    client.release();
  }
};

// If run directly: `node src/database/migrations/createProjectsTables.js`
if (import.meta.url.startsWith("file:") && process.argv[1] && (process.argv[1].endsWith("createProjectsTables.js") || process.argv[1].endsWith("createProjectsTables"))) {
  up()
    .then(() => {
      console.log("Done");
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
