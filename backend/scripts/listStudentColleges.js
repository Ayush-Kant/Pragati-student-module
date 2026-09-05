import "dotenv/config";
import { pool } from "../config/db.js";

try {
  const { rows } = await pool.query(`
    SELECT id, name, category, location, status
    FROM colleges
    WHERE LOWER(COALESCE(status, 'approved')) NOT IN ('rejected', 'blocked', 'inactive')
    ORDER BY id;
  `);

  console.log("Valid student registration college IDs:");
  console.table(rows);
  if (!rows.length) console.log("No valid colleges found. Run the student demo seed first.");
} catch (error) {
  console.error("[listStudentColleges] Failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
