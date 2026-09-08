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

  // This is intentionally test/demo data. Every seeded student is linked to
  // every standard demo drive and can satisfy the certificate rules:
  // score >= 0, attendance >= 0, no required activities, completed drive.
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

  // The student eligibility endpoint evaluates drives already associated with
  // the authenticated student. Ensure every seeded student is associated with
  // each demo drive so the UI can actually discover the eligible drive.
  const progressColumns = await getTableColumns("student_drive_progress");
  const requiredProgressColumns = ["student_id", "drive_id"];

  if (requiredProgressColumns.every((column) => progressColumns.has(column))) {
    const optionalAssignments = [];
    if (progressColumns.has("current_stage")) optionalAssignments.push("current_stage");
    if (progressColumns.has("stage")) optionalAssignments.push("stage");
    if (progressColumns.has("assessment_score")) optionalAssignments.push("assessment_score");
    if (progressColumns.has("training_completion")) optionalAssignments.push("training_completion");

    const insertColumns = ["student_id", "drive_id", ...optionalAssignments];
    const insertValues = ["s.id", "d.id", ...optionalAssignments.map((column) => {
      if (column === "current_stage") return "'selection'";
      if (column === "stage") return "'selected'";
      if (column === "assessment_score") return "100";
      if (column === "training_completion") return "100";
      return "NULL";
    })];

    await pool.query(
      `INSERT INTO student_drive_progress (${insertColumns.join(", ")})
       SELECT ${insertValues.join(", ")}
         FROM students s
         CROSS JOIN recruitment_drives d
        WHERE d.id = ANY($1::int[])
       ON CONFLICT (student_id, drive_id) DO UPDATE SET
         ${optionalAssignments.length
           ? optionalAssignments.map((column) => `${column} = EXCLUDED.${column}`).join(",\n         ")
           : "drive_id = EXCLUDED.drive_id"},
         stage_updated_at = CASE
           WHEN EXISTS (
             SELECT 1
             FROM information_schema.columns
             WHERE table_schema = 'public'
               AND table_name = 'student_drive_progress'
               AND column_name = 'stage_updated_at'
           ) THEN student_drive_progress.stage_updated_at
           ELSE student_drive_progress.created_at
         END`,
      [driveIds],
    ).catch(async (error) => {
      // Keep the seed robust across compatible legacy schemas. The minimal
      // association is enough for the eligibility endpoint to discover the drive.
      if (error.code !== "42703") throw error;
      await pool.query(
        `INSERT INTO student_drive_progress (student_id, drive_id)
         SELECT s.id, d.id
           FROM students s
           CROSS JOIN recruitment_drives d
          WHERE d.id = ANY($1::int[])
         ON CONFLICT (student_id, drive_id) DO NOTHING`,
        [driveIds],
      );
    });
  }

  const students = await pool.query(
    `SELECT COUNT(*)::int AS count
       FROM students`,
  );

  console.log(
    `✅ Certificate test eligibility enabled for ${students.rows[0]?.count ?? 0} seeded student(s) across demo drives: ${drives.rows.map((row) => `${row.id} (${row.title})`).join(", ")}.`,
  );
};

const getTableColumns = async (tableName) => {
  const result = await pool.query(
    `SELECT column_name
       FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = $1`,
    [tableName],
  );
  return new Set(result.rows.map((row) => row.column_name));
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
