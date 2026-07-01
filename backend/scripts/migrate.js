import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrationsFresh() {
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
  } catch (error) {
    console.error("Failed to drop tables:", error);
  }
}

try {
  await runMigrationsFresh();
} catch (e) {}

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

function splitSqlStatements(sql) {
  const statements = [];
  let current = "";
  let singleQuote = false;
  let doubleQuote = false;
  let lineComment = false;
  let blockComment = false;

  for (let i = 0; i < sql.length; i += 1) {
    const char = sql[i];
    const next = sql[i + 1];

    if (lineComment) {
      current += char;
      if (char === "\n") {
        lineComment = false;
      }
      continue;
    }

    if (blockComment) {
      current += char;
      if (char === "*" && next === "/") {
        current += next;
        i += 1;
        blockComment = false;
      }
      continue;
    }

    if (singleQuote) {
      current += char;
      if (char === "'" && next === "'") {
        current += next;
        i += 1;
      } else if (char === "'") {
        singleQuote = false;
      }
      continue;
    }

    if (doubleQuote) {
      current += char;
      if (char === '"' && next === '"') {
        current += next;
        i += 1;
      } else if (char === '"') {
        doubleQuote = false;
      }
      continue;
    }

    if (char === "-" && next === "-") {
      current += char + next;
      i += 1;
      lineComment = true;
      continue;
    }

    if (char === "/" && next === "*") {
      current += char + next;
      i += 1;
      blockComment = true;
      continue;
    }

    if (char === "'") {
      singleQuote = true;
      current += char;
      continue;
    }

    if (char === '"') {
      doubleQuote = true;
      current += char;
      continue;
    }

    if (char === ";") {
      const statement = current.trim();
      if (statement) {
        statements.push(statement);
      }
      current = "";
      continue;
    }

    current += char;
  }

  const tail = current.trim();
  if (tail) {
    statements.push(tail);
  }

  return statements;
}

async function runMigrations() {
  const client = await pool.connect();

  try {
    const migrationsDir = path.join(__dirname, "../migrations");

    await client.query("BEGIN");

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf8");
      const statements = splitSqlStatements(sql);

      console.log(`Running migration: ${file}`);

      for (const statement of statements) {
        await client.query(statement);
      }
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

try {
  await runMigrations();
  console.log("All migrations completed successfully.");
  process.exit(0);
} catch (error) {
  console.error("Migration failed:", error);
  process.exit(1);
}
