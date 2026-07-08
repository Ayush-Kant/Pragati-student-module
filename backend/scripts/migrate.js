import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "../config/db.js";

import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDir = path.join(__dirname, "../migrations");

// Hardcoded execution order based on your dependencies
const migrationFiles = [
  "001_create_users_mentors.sql", // 001
  "005_create_company_management.sql", // 002
  "004_create_college_management.sql", // 003
  "005_create_student_management.sql", // 004
  "005_create_recruitment_drives.sql", // 005
  "005_create_company_tables.sql", // 006
  "002_create_content_tables.sql", // 007
  "003_create_admin_dashboard.sql", // 008
  "004_create_notifications.sql", // 009
  // "006_create_assessments_minimal.sql", // 010
  "006_create_assessments.sql", // 011
  "006_create_college_profiles.sql", // 012
  "006_create_dashboard_support.sql", // 013
  // "006_create_reports_analytics_tables.sql", // 014
  "006_create_training_coordination.sql", // 015
  // "006_update_interviews_table.sql", // 016
  "007_create_dashboard_tables.sql", // 017
  "007_offers_hiring_tables.sql", // 018
  "008_create_notifications.sql", // 019
  "010_create_disputes.sql", // 020
  "Students.sql", // 021
  "011_create_live_sessions_module.sql", // 022
];

async function runMigrationsFresh() {
  try {
    console.log("Dropping existing tables and types to start fresh...");

    // 1. Dynamically fetch and drop all tables in the public schema
    const { rows: tables } = await pool.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public';
    `);

    if (tables.length > 0) {
      const tableNames = tables.map((t) => `"${t.tablename}"`).join(", ");
      await pool.query(`DROP TABLE IF EXISTS ${tableNames} CASCADE;`);
      console.log(`✔ Dropped ${tables.length} existing tables.`);
    }

    // 2. Dynamically fetch and drop all custom types (like ENUMs) in the public schema
    const { rows: types } = await pool.query(`
      SELECT t.typname
      FROM pg_type t
      JOIN pg_namespace n ON t.typnamespace = n.oid
      WHERE n.nspname = 'public'
        AND t.typtype = 'e'; -- 'e' stands for enum
    `);

    if (types.length > 0) {
      const typeNames = types.map((t) => `"${t.typname}"`).join(", ");
      await pool.query(`DROP TYPE IF EXISTS ${typeNames} CASCADE;`);
      console.log(`✔ Dropped ${types.length} existing custom types.`);
    }

    console.log("Database clean slate ready.");
  } catch (error) {
    console.error("❌ Failed to drop existing database objects:", error);
    throw error; // Halt execution if we can't get a clean slate
  }
}

function splitSqlStatements(sql) {
  const statements = [];
  let current = "";

  let singleQuote = false;
  let doubleQuote = false;
  let lineComment = false;
  let blockComment = false;
  let dollarQuote = false;

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const next = sql[i + 1];

    if (lineComment) {
      current += char;
      if (char === "\n") lineComment = false;
      continue;
    }

    if (blockComment) {
      current += char;
      if (char === "*" && next === "/") {
        current += next;
        i++;
        blockComment = false;
      }
      continue;
    }

    if (dollarQuote) {
      current += char;
      if (char === "$" && next === "$") {
        current += next;
        i++;
        dollarQuote = false;
      }
      continue;
    }

    if (singleQuote) {
      current += char;
      if (char === "'" && next === "'") {
        current += next;
        i++;
      } else if (char === "'") {
        singleQuote = false;
      }
      continue;
    }

    if (doubleQuote) {
      current += char;
      if (char === '"' && next === '"') {
        current += next;
        i++;
      } else if (char === '"') {
        doubleQuote = false;
      }
      continue;
    }

    if (char === "$" && next === "$") {
      dollarQuote = true;
      current += "$$";
      i++;
      continue;
    }

    if (char === "-" && next === "-") {
      lineComment = true;
      current += "--";
      i++;
      continue;
    }

    if (char === "/" && next === "*") {
      blockComment = true;
      current += "/*";
      i++;
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
    await client.query("BEGIN");

    console.log("\n==============================");
    console.log("Running SQL migrations in strict order...");
    console.log("==============================\n");

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);

      // Check if file exists before trying to read it
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      console.log(`▶ Running: ${file}`);

      const sql = fs.readFileSync(filePath, "utf8");
      const statements = splitSqlStatements(sql);

      for (const statement of statements) {
        try {
          await client.query(statement);
        } catch (statementError) {
          console.error(`\n❌ Error executing a statement in file: ${file}`);
          console.error(`SQL Snippet: \n${statement.substring(0, 150)}...\n`);
          throw statementError; // Send to main catch block
        }
      }

      console.log(`✔ Completed: ${file}\n`);
    }

    await client.query("COMMIT");

    console.log("==============================");
    console.log("✅ All migrations completed successfully.");
    console.log("==============================");
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("\n❌ Migration failed! Transaction rolled back.");
    console.error(error);

    throw error;
  } finally {
    client.release();
  }
}

// Execute Sequence
(async () => {
  try {
    await runMigrationsFresh();
    await runMigrations();
    process.exit(0);
  } catch (error) {
    console.error("\n💥 Fatal error during migration process.");
    process.exit(1);
  }
})();
