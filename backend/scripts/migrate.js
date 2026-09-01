import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, "..", "migrations");

const migrationFiles = [
  "001_create_users_mentors.sql",
  "002_create_content_tables.sql",
  "004_create_college_management.sql",
  "005_create_company_tables.sql",
  "006_create_assessments.sql",
  "006_update_interviews_table.sql",
  "011_create_student_assessment_tables.sql",
  "012_assessment_attempt_constraints.sql",
  "022_create_projects_module.sql",
  "023_create_placement_module_tables.sql",
  "023_update_quiz_attempts.sql",
];

async function runMigrations() {
  console.log("🚀 Starting database migrations...\n");
  const client = await pool.connect();

  try {
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ Migration file missing: ${file}`);
        continue;
      }

      console.log(`📄 Executing migration: ${file}`);
      const sql = fs.readFileSync(filePath, "utf8");
      await client.query(sql);
      console.log(`✅ Completed: ${file}\n`);
    }

    console.log("🎉 All migrations executed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
