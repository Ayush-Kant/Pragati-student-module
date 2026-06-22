// runMigration.js
import fs from "fs";
import { pool } from "./config/db.js";

const sql = fs.readFileSync(
  "./migrations/005_create_recruitment_drives.sql",
  "utf8"
);

try {
  await pool.query(sql);
  console.log("✅ Migration applied successfully");
} catch (err) {
  console.error("❌ Migration failed:", err.message);
} finally {
  await pool.end();
}