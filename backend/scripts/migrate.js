import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationFiles = [
  "001_create_users_mentors.sql",
  "002_create_content_tables.sql",
  "003_create_admin_dashboard.sql",
  "004_create_college_management.sql",
  "004_create_notifications.sql",
  "005_create_company_management.sql",
  "Students.sql",
];

async function runMigrations() {
  const client = await pool.connect();

  try {
    const migrationsDir = path.join(__dirname, "../migrations");

    await client.query("BEGIN");

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf8");

      console.log(`Running migration: ${file}`);
      await client.query(sql);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

runMigrations()
  .then(() => {
    console.log("All migrations completed successfully.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
