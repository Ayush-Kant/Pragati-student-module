import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../migrations/013_create_placement_drives.sql");

async function applyMigration() {
  try {
    console.log("Applying 013_create_placement_drives.sql...");
    const sql = fs.readFileSync(filePath, "utf8");
    await pool.query(sql);
    console.log("✅ Placement drives database tables created and seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration error:", err);
    process.exit(1);
  }
}

applyMigration();
