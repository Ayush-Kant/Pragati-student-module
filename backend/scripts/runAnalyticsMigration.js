/**
 * Location: backend/scripts/runAnalyticsMigration.js
 *
 * Standalone script to run ONLY the collegeAnalyticsDashboard.sql migration.
 * Usage: node scripts/runAnalyticsMigration.js
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const run = async () => {
  const filePath = path.join(
    __dirname,
    "../migrations/collegeAnalyticsDashboard.sql",
  );

  if (!fs.existsSync(filePath)) {
    console.error("❌ Migration file not found:", filePath);
    process.exit(1);
  }

  const sql = fs.readFileSync(filePath, "utf8");

  // Split on semicolons but respect $$ dollar-quoted blocks
  const statements = [];
  let current = "";
  let dollarQuote = false;

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const next = sql[i + 1];

    if (char === "$" && next === "$") {
      dollarQuote = !dollarQuote;
      current += "$$";
      i++;
      continue;
    }

    if (char === ";" && !dollarQuote) {
      const trimmed = current.trim();
      if (trimmed) statements.push(trimmed);
      current = "";
      continue;
    }

    current += char;
  }

  const tail = current.trim();
  if (tail) statements.push(tail);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    console.log("🔄 Running collegeAnalyticsDashboard migration...\n");

    for (const statement of statements) {
      try {
        await client.query(statement);
      } catch (err) {
        console.error("❌ Error in statement:");
        console.error(statement.substring(0, 120) + "...\n");
        throw err;
      }
    }

    await client.query("COMMIT");
    console.log("✅ collegeAnalyticsDashboard migration applied successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Migration failed:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
};

run();
