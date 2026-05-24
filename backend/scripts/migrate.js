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
        students,
        admin_audit_log
      CASCADE;
    `);
    console.log("Existing tables dropped successfully.");

    const migrationsDir = path.join(__dirname, "../migrations");
    const migrationFiles = [
      "001_create_users_mentors.sql",
      "003_create_admin_dashboard.sql",
      "002_create_content_tables.sql",
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
