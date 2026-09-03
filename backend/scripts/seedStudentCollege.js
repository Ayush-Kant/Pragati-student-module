import "dotenv/config";
import { pool } from "../config/db.js";

const DEMO_COLLEGE_NAME = "Pragati Demo College";

const seed = async () => {
  const existing = await pool.query(
    `SELECT id, name, status
     FROM colleges
     WHERE LOWER(name) = LOWER($1)
     LIMIT 1`,
    [DEMO_COLLEGE_NAME],
  );

  if (existing.rows[0]) {
    const college = existing.rows[0];
    console.log(
      `Student registration test college already exists: ${college.name} (ID ${college.id}, status ${college.status}).`,
    );
    return college;
  }

  const result = await pool.query(
    `INSERT INTO colleges (name, category, location, status, about)
     VALUES ($1, 'Engineering', 'India', 'approved', $2)
     RETURNING id, name, status`,
    [
      DEMO_COLLEGE_NAME,
      "Local development/test college for the Pragati student registration flow.",
    ],
  );

  const college = result.rows[0];
  console.log(
    `Created student registration test college: ${college.name} (ID ${college.id}, status ${college.status}).`,
  );
  console.log("Use this College ID only for local development/testing.");
  return college;
};

try {
  await seed();
} catch (error) {
  console.error("[seedStudentCollege] Failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
