import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  try {
    console.log("Dropping existing tables to start fresh...");
    await pool.query(`
      DROP TABLE IF EXISTS 
        student_progress, 
        student_drive_progress, 
        live_sessions, 
        recruitment_drives, 
        notifications, 
        submissions, 
        assessments, 
        modules, 
        courses, 
        mentors, 
        drives, 
        "Company", 
        "User", 
        companies, 
        colleges, 
        users, 
        auth_users, 
        college_stats,
        company_stats,
        college_profiles,
<<<<<<< HEAD
=======
        dashboard_stats,
        dashboard_activities,
        dashboard_reports,
>>>>>>> 58a8a53a33b49bd9f036a85f4634dd94794f37b4
        students,
        admin_audit_log
      CASCADE;
    `);
    console.log("Existing tables dropped successfully.");

    const migrationsDir = path.join(__dirname, "../migrations");
    const migrationFiles = [
      "001_create_users_mentors.sql",
      "004_create_college_management.sql",
      "005_create_company_management.sql",
      "003_create_admin_dashboard.sql",
      "002_create_content_tables.sql",
<<<<<<< HEAD
      "006_create_college_profiles.sql",
=======
      "007_create_dashboard_tables.sql",
>>>>>>> 58a8a53a33b49bd9f036a85f4634dd94794f37b4
      "Students.sql",
    ];

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      console.log(`Running migration: ${file}...`);
      const sql = fs.readFileSync(filePath, "utf8");
      await pool.query(sql);
      console.log(`Migration completed successfully: ${file}`);
    }

    console.log("All migrations completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigrations();
