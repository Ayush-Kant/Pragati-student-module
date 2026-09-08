import "dotenv/config";
import { pool } from "../config/db.js";

const TEST_DRIVE_TITLES = [
  "SM Demo Full-Stack Recruitment Drive",
  "SM Demo Completed Drive",
];

const seedCertificateEligibility = async () => {
  const drives = await pool.query(
    `SELECT id, title
       FROM recruitment_drives
      WHERE title = ANY($1::text[])
      ORDER BY id`,
    [TEST_DRIVE_TITLES],
  );

  if (!drives.rows.length) {
    console.warn(`⚠️ Certificate eligibility seed skipped: none of the demo drives were found.`);
    return;
  }

  // This is intentionally test/demo data. Every seeded student who is linked
  // to either standard demo drive can satisfy the certificate rules:
  // score >= 0, attendance >= 0, no required activities, and completed drive.
  const driveIds = drives.rows.map((row) => row.id);

  await pool.query(
    `UPDATE recruitment_drives
        SET status = 'completed',
            certificate_min_score = 0,
            certificate_min_attendance = 0
      WHERE id = ANY($1::int[])`,
    [driveIds],
  );

  if (
    await tableExists("activities") &&
    await columnExists("activities", "drive_id") &&
    await columnExists("activities", "is_required")
  ) {
    await pool.query(
      `UPDATE activities
          SET is_required = FALSE
        WHERE drive_id = ANY($1::int[])`,
      [driveIds],
    );
  }

  const students = await pool.query(
    `SELECT COUNT(*)::int AS count
       FROM users
      WHERE role = 'student'`,
  );

  console.log(
    `✅ Certificate test eligibility enabled for ${students.rows[0]?.count ?? 0} student account(s) across demo drives: ${drives.rows.map((row) => `${row.id} (${row.title})`).join(", ")}.`,
  );
};

const tableExists = async (tableName) => {
  const result = await pool.query(`SELECT to_regclass($1) AS table_name`, [`public.${tableName}`]);
  return Boolean(result.rows[0]?.table_name);
};

const columnExists = async (tableName, columnName) => {
  const result = await pool.query(
    `SELECT 1
       FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = $1
        AND column_name = $2
      LIMIT 1`,
    [tableName, columnName],
  );
  return result.rowCount > 0;
};

try {
  await seedCertificateEligibility();
} catch (error) {
  console.error(`❌ Certificate eligibility seed failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await pool.end();
}
