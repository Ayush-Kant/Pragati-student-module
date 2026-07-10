// runMigration.js
import fs from "fs";
import { pool } from "./config/db.js";

const sql = fs.readFileSync(
  "./migrations/006_create_question_bank.sql",
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