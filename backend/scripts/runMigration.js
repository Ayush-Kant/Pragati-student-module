/**
 * One-shot migration runner.
 * Usage: node scripts/runMigration.js <path-to-sql-file>
 * Example: node scripts/runMigration.js migrations/016_upgrade_companies_job_postings.sql
 */

import fs from "fs";
import path from "path";
import { pool } from "../config/db.js";

const [, , sqlFile] = process.argv;

if (!sqlFile) {
  console.error("Usage: node scripts/runMigration.js <path-to-sql-file>");
  process.exit(1);
}

const filePath = path.resolve(process.cwd(), sqlFile);

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

const sql = fs.readFileSync(filePath, "utf8");

const run = async () => {
  const client = await pool.connect();
  try {
    console.log(`Running migration: ${sqlFile}`);
    await client.query(sql);
    console.log("✅ Migration applied successfully.");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

run();
