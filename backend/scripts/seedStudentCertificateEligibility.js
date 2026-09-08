import "dotenv/config";
import { pool } from "../config/db.js";

const TEST_DRIVE_TITLES = [
  "SM Demo Full-Stack Recruitment Drive",
  "SM Demo Completed Drive",
];

const CERTIFICATE_QA_SESSION_COUNT = 5;

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
  const result = await pool.query(
    `SELECT to_regclass($1) AS table_name`,
    [`public.${tableName}`],
  );
  return Boolean(result.rows[0]?.table_name);
};

const seedStudentDriveProgress = async (driveIds) => {
  if (!(await tableExists("student_drive_progress"))) return;

  const columns = await getTableColumns("student_drive_progress");
  if (!columns.has("student_id") || !columns.has("drive_id")) return;

  const insertColumns = ["student_id", "drive_id"];
  const insertValues = ["s.id", "d.id"];
  const updateAssignments = [];

  if (columns.has("current_stage")) {
    insertColumns.push("current_stage");
    insertValues.push("'selection'");
    updateAssignments.push("current_stage = EXCLUDED.current_stage");
  }
  if (columns.has("stage")) {
    insertColumns.push("stage");
    insertValues.push("'selected'");
    updateAssignments.push("stage = EXCLUDED.stage");
  }
  if (columns.has("assessment_score")) {
    insertColumns.push("assessment_score");
    insertValues.push("100");
    updateAssignments.push("assessment_score = EXCLUDED.assessment_score");
  }
  if (columns.has("training_completion")) {
    insertColumns.push("training_completion");
    insertValues.push("100");
    updateAssignments.push("training_completion = EXCLUDED.training_completion");
  }
  if (columns.has("sessions_attended")) {
    insertColumns.push("sessions_attended");
    insertValues.push(String(CERTIFICATE_QA_SESSION_COUNT));
    updateAssignments.push("sessions_attended = EXCLUDED.sessions_attended");
  }
  if (columns.has("stage_updated_at")) {
    insertColumns.push("stage_updated_at");
    insertValues.push("NOW()");
    updateAssignments.push("stage_updated_at = EXCLUDED.stage_updated_at");
  }

  const updateClause = updateAssignments.length
    ? updateAssignments.join(",\n       ")
    : "drive_id = EXCLUDED.drive_id";

  await pool.query(
    `INSERT INTO student_drive_progress (${insertColumns.join(", ")})
     SELECT ${insertValues.join(", ")}
       FROM students s
       CROSS JOIN recruitment_drives d
      WHERE d.id = ANY($1::int[])
     ON CONFLICT (student_id, drive_id) DO UPDATE SET
       ${updateClause}`,
    [driveIds],
  );
};

const seedAuthoritativeTrainingScores = async () => {
  if (!(await tableExists("student_progress"))) return;

  const columns = await getTableColumns("student_progress");
  if (!columns.has("readiness_score")) return;

  const identityColumn = columns.has("user_id")
    ? "user_id"
    : columns.has("student_id")
      ? "student_id"
      : null;

  if (!identityColumn) return;

  const studentIds = await pool.query(
    `SELECT id, user_id
       FROM students
      WHERE user_id IS NOT NULL`,
  );

  if (!studentIds.rows.length) return;

  if (identityColumn === "user_id") {
    await pool.query(
      `UPDATE student_progress p
          SET readiness_score = 100${columns.has("updated_at") ? ", updated_at = NOW()" : ""}
        WHERE p.user_id = ANY($1::int[])`,
      [studentIds.rows.map((row) => Number(row.user_id))],
    );
  } else {
    const ids = new Set();
    for (const row of studentIds.rows) {
      ids.add(Number(row.id));
      ids.add(Number(row.user_id));
    }

    await pool.query(
      `UPDATE student_progress p
          SET readiness_score = 100${columns.has("updated_at") ? ", updated_at = NOW()" : ""}
        WHERE p.student_id = ANY($1::int[])`,
      [Array.from(ids)],
    );
  }
};

const seedCertificateAttendance = async (driveIds) => {
  if (!(await tableExists("live_sessions")) || !(await tableExists("session_attendance"))) return;

  const liveSessionColumns = await getTableColumns("live_sessions");
  const attendanceColumns = await getTableColumns("session_attendance");

  if (!liveSessionColumns.has("drive_id")) return;
  if (
    !attendanceColumns.has("session_id") ||
    !attendanceColumns.has("student_id") ||
    !attendanceColumns.has("attended")
  ) return;

  const students = await pool.query(
    `SELECT id AS student_id, user_id
       FROM students
      WHERE user_id IS NOT NULL`,
  );

  if (!students.rows.length) return;

  for (const driveId of driveIds) {
    for (let sessionNumber = 1; sessionNumber <= CERTIFICATE_QA_SESSION_COUNT; sessionNumber += 1) {
      const title = `SM-13 Certificate QA Attendance Drive ${driveId} Session ${sessionNumber}`;
      let session = await pool.query(
        `SELECT id
           FROM live_sessions
          WHERE title = $1
          LIMIT 1`,
        [title],
      );

      let sessionId = session.rows[0]?.id;
      if (!sessionId) {
        const scheduledAt = new Date(Date.now() - sessionNumber * 24 * 60 * 60 * 1000);
        const columns = [
          "title",
          "trainer",
          "date",
          "time",
          "duration",
          "status",
          "session_type",
          "scheduled_at",
          "drive_id",
        ];
        const values = [
          title,
          "Pragati Certificate QA Mentor",
          scheduledAt.toISOString().slice(0, 10),
          "10:00",
          "60 minutes",
          "Completed",
          "webinar",
          scheduledAt.toISOString(),
          driveId,
        ];

        if (liveSessionColumns.has("room_name")) {
          columns.push("room_name");
          values.push(`certificate-qa-${driveId}-${sessionNumber}`);
        }
        if (liveSessionColumns.has("meeting_url")) {
          columns.push("meeting_url");
          values.push("https://www.youtube.com/watch?v=Ke90Tje7VS0");
        }

        session = await pool.query(
          `INSERT INTO live_sessions (${columns.join(", ")})
           VALUES (${columns.map((_, index) => `$${index + 1}`).join(", ")})
           RETURNING id`,
          values,
        );
        sessionId = session.rows[0]?.id;
      }

      if (!sessionId) continue;

      for (const student of students.rows) {
        const joinAt = new Date(Date.now() - 2 * 60 * 60 * 1000);
        const leaveAt = new Date(Date.now() - 60 * 60 * 1000);
        const columns = ["session_id", "student_id", "attended"];
        const values = [Number(sessionId), Number(student.user_id), true];
        const updates = ["attended = TRUE"];

        if (attendanceColumns.has("attended_at")) {
          columns.push("attended_at");
          values.push(leaveAt.toISOString());
          updates.push("attended_at = EXCLUDED.attended_at");
        }
        if (attendanceColumns.has("status")) {
          columns.push("status");
          values.push("Present");
          updates.push("status = EXCLUDED.status");
        }
        if (attendanceColumns.has("join_timestamp")) {
          columns.push("join_timestamp");
          values.push(joinAt.toISOString());
          updates.push("join_timestamp = EXCLUDED.join_timestamp");
        }
        if (attendanceColumns.has("leave_timestamp")) {
          columns.push("leave_timestamp");
          values.push(leaveAt.toISOString());
          updates.push("leave_timestamp = EXCLUDED.leave_timestamp");
        }
        if (attendanceColumns.has("duration_seconds")) {
          columns.push("duration_seconds");
          values.push(3600);
          updates.push("duration_seconds = EXCLUDED.duration_seconds");
        }
        if (attendanceColumns.has("updated_at")) {
          columns.push("updated_at");
          values.push(new Date().toISOString());
          updates.push("updated_at = EXCLUDED.updated_at");
        }

        await pool.query(
          `INSERT INTO session_attendance (${columns.join(", ")})
           VALUES (${columns.map((_, index) => `$${index + 1}`).join(", ")})
           ON CONFLICT (session_id, student_id) DO UPDATE SET
             ${updates.join(",\n             ")}`,
          values,
        );
      }
    }
  }
};

const seedCertificateEligibility = async () => {
  const drives = await pool.query(
    `SELECT id, title, certificate_min_score, certificate_min_attendance
       FROM recruitment_drives
      WHERE title = ANY($1::text[])
      ORDER BY id`,
    [TEST_DRIVE_TITLES],
  );

  if (!drives.rows.length) {
    console.warn("⚠️ Certificate QA seed skipped: demo drives were not found.");
    return;
  }

  const driveIds = drives.rows.map((row) => Number(row.id));

  // Preserve the PRD eligibility rules and the drive's configured thresholds.
  // Only the drive completion state and underlying student performance data are seeded.
  await pool.query(
    `UPDATE recruitment_drives
        SET status = 'completed'
      WHERE id = ANY($1::int[])`,
    [driveIds],
  );

  await seedStudentDriveProgress(driveIds);
  await seedAuthoritativeTrainingScores();
  await seedCertificateAttendance(driveIds);

  const requiredActivityColumns = await getTableColumns("activities");
  let requiredActivityCount = null;
  if (
    requiredActivityColumns.has("drive_id") &&
    requiredActivityColumns.has("is_required")
  ) {
    const result = await pool.query(
      `SELECT COUNT(*)::int AS count
         FROM activities
        WHERE drive_id = ANY($1::int[])
          AND is_required = TRUE`,
      [driveIds],
    );
    requiredActivityCount = Number(result.rows[0]?.count || 0);
  }

  const students = await pool.query(
    `SELECT COUNT(*)::int AS count
       FROM students`,
  );

  const scoreSummary = drives.rows
    .map((drive) => `${drive.title}: threshold ${drive.certificate_min_score ?? 70}%`)
    .join("; ");
  const attendanceSummary = drives.rows
    .map((drive) => `${drive.title}: threshold ${drive.certificate_min_attendance ?? 60}%`)
    .join("; ");

  console.log(
    `✅ Certificate QA seed prepared for ${students.rows[0]?.count ?? 0} seeded student(s): ${scoreSummary}; ${attendanceSummary}; ${CERTIFICATE_QA_SESSION_COUNT} completed attended sessions per demo drive; mandatory activity configuration unchanged${requiredActivityCount === null ? "" : ` (${requiredActivityCount} mandatory activity/activities detected)`}.`,
  );
};

try {
  await seedCertificateEligibility();
} catch (error) {
  console.error(`❌ Certificate eligibility seed failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await pool.end();
}
