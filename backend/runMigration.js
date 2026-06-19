// runMigration.js
// One-time script to run the recruitment drive migration directly from terminal.
// Usage: node runMigration.js

import { pool } from "./config/db.js"; // 👈 CHECK THIS PATH matches your real db.js location
import fs from "fs";

const filePath = "./migrations/005_create_recruitment_drives.sql"; // 👈 CHECK THIS PATH too

const run = async () => {
  try {
    const sql = fs.readFileSync(filePath, "utf-8");
    console.log("Running migration...");
    await pool.query(sql);
    console.log("✅ Migration applied successfully. Tables created.");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
  } finally {
    await pool.end();
  }
};

run()