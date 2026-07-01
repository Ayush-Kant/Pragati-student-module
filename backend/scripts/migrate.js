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
        trainings,
        training_progress,
        mentor_feedback, 
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
        dashboard_stats,
        dashboard_activities,
        dashboard_reports,
        students,
        admin_audit_log,
        company_team_members,
        offers_v2,
        offer_amendments,
        candidate_drive_mapping,
        interviews_v2,
        recruitment_drives_v2,
        candidates,
        companies_v2,
        hiring_metrics,
        college_performance_metrics,
        skill_demand_metrics,
        analytics_cache
      CASCADE;
    `);
    console.log("Existing tables dropped successfully.");

    const migrationsDir = path.join(__dirname, "../migrations");
    const migrationFiles = [
      "001_create_users_mentors.sql",
      "004_create_college_management.sql",
      "005_create_company_management.sql",
      "005_create_company_tables.sql",
      "005_create_student_management.sql",
      "005_create_recruitment_drives.sql",
      "002_create_content_tables.sql",
      "003_create_admin_dashboard.sql",
      "004_create_notifications.sql",
       "006_create_college_profiles.sql",
       "006_create_training_coordination.sql",
       "007_offers_hiring_tables.sql",
       "006_create_reports_analytics_tables.sql",
       "006_update_interviews_table.sql",
       "007_create_dashboard_tables.sql",
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
