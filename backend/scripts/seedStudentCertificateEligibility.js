import "dotenv/config";
import { pool } from "../config/db.js";

const TEST_DRIVE_TITLE = "SM Demo Completed Drive";

const seedCertificateEligibility = async () => {
  const drive = await pool.query(
    `SELECT id
       FROM recruitment_drives
      WHERE title = $1
      ORDER BY id
      LIMIT 1`,
    [TEST_DRIVE_TITLE],
  );

  if (!drive.rows[0]) {
    console.warn(`⚠️ Certificate eligibility seed skipped: ${TEST_DRIVE_TITLE} was not found.`);
    return;
  }

  const driveId = drive.rows[0].id;

  // This is intentionally test/demo data. Every student can satisfy the
  // certificate rules for this completed drive without fabricated certificates:
  // score >= 0, attendance >= 0, no required activities, and completed drive.
  await pool.query(
    `UPDATE recruitment_drives
        SET status = 'completed',
            certificate_min_score = 0,
            certificate_min_attendance = 0
      WHERE id = $1`,
    [driveId],
  );

  if (
    await tableExists("activities") &&
    await columnExists("activities", "drive_id") &&
    await columnExists("activities", "is_required")
  ) {
    await pool.query(
      `UPDATE activities
          SET is_required = FALSE
        WHERE drive_id = $1`,
      [driveId],
    );
  }

  const students = await pool.query(
    `SELECT COUNT(*)::int AS count
       FROM users
      WHERE role = 'student'`,
  );

  console.log(`✅ Certificate test eligibility enabled for ${students.rows[0]?.count ?? 0} student account(s) on drive ${driveId}.`);
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
