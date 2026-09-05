import "dotenv/config";
import { pool } from "../config/db.js";

const DEMO_EMAIL = "student@demo.edu";

const seed = async () => {
  const studentResult = await pool.query(
    `SELECT id, name FROM students WHERE LOWER(email) = LOWER($1) LIMIT 1`,
    [DEMO_EMAIL],
  );

  if (!studentResult.rows[0]) {
    throw new Error(`Student ${DEMO_EMAIL} was not found. Register a student first, then rerun the seed.`);
  }

  const student = studentResult.rows[0];
  const rows = [
    {
      title: "Technical Interview — Full Stack",
      type: "Technical",
      at: "2026-09-10T11:00:00+05:30",
      meeting: "https://meet.google.com/mock-pragati-technical",
      status: "scheduled",
      result: "PENDING",
      attendance: "pending",
      feedback: null,
    },
    {
      title: "Behavioral Interview — Placement Round",
      type: "Behavioral",
      at: "2026-09-12T15:30:00+05:30",
      meeting: "https://meet.google.com/mock-pragati-behavioral",
      status: "invited",
      result: "PENDING",
      attendance: "pending",
      feedback: null,
    },
    {
      title: "HR Interview — Culture & Values",
      type: "HR",
      at: "2026-09-14T12:30:00+05:30",
      meeting: "https://meet.google.com/mock-pragati-hr",
      status: "scheduled",
      result: "PENDING",
      attendance: "pending",
      feedback: null,
    },
    {
      title: "Technical Interview — System Design",
      type: "Technical",
      at: "2026-08-28T12:00:00+05:30",
      meeting: "https://meet.google.com/mock-pragati-system-design",
      status: "completed",
      result: "PASS",
      attendance: "present",
      feedback: "Strong system-design fundamentals, clear trade-off discussion, and good communication.",
    },
    {
      title: "Panel Interview — Final Review",
      type: "Panel",
      at: "2026-08-25T15:00:00+05:30",
      meeting: "https://meet.google.com/mock-pragati-panel",
      status: "completed",
      result: "FAIL",
      attendance: "present",
      feedback: "Good effort, but the candidate needs stronger depth in distributed systems and testing strategy.",
    },
    {
      title: "Technical Interview — Missed Slot",
      type: "Technical",
      at: "2026-08-22T10:00:00+05:30",
      meeting: "https://meet.google.com/mock-pragati-missed",
      status: "completed",
      result: "PENDING",
      attendance: "absent",
      feedback: "Candidate did not attend the scheduled interview.",
    },
  ];

  for (const interview of rows) {
    await pool.query(
      `INSERT INTO interviews
        (application_id, student_id, scheduled_at, title, interviewer_id, meeting_link,
         interview_type, result, status, attendance, feedback)
       SELECT
         NULL::integer,
         $1::integer,
         $2::timestamptz,
         $3::varchar(255),
         NULL::integer,
         $4::varchar(500),
         $5::varchar(100),
         $6::varchar(50),
         $7::varchar(50),
         $8::varchar(50),
         $9::text
       WHERE NOT EXISTS (
         SELECT 1
         FROM interviews
         WHERE student_id = $1::integer
           AND title = $3::varchar(255)
           AND scheduled_at = $2::timestamptz
       )`,
      [
        student.id,
        interview.at,
        interview.title,
        interview.meeting,
        interview.type,
        interview.result,
        interview.status,
        interview.attendance,
        interview.feedback,
      ],
    );
  }

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS count FROM interviews WHERE student_id = $1::integer`,
    [student.id],
  );

  const coverageResult = await pool.query(
    `SELECT
       COUNT(*) FILTER (WHERE result = 'PASS')::int AS pass_count,
       COUNT(*) FILTER (WHERE result = 'FAIL')::int AS fail_count,
       COUNT(*) FILTER (WHERE result = 'PENDING')::int AS pending_count,
       COUNT(*) FILTER (WHERE attendance = 'present')::int AS present_count,
       COUNT(*) FILTER (WHERE attendance = 'absent')::int AS absent_count,
       COUNT(*) FILTER (WHERE attendance = 'pending')::int AS pending_attendance_count
     FROM interviews
     WHERE student_id = $1::integer`,
    [student.id],
  );

  console.log(
    `Seeded/verified interviews for ${student.name} (${DEMO_EMAIL}). Total: ${countResult.rows[0].count}. ` +
      `Results PASS=${coverageResult.rows[0].pass_count}, FAIL=${coverageResult.rows[0].fail_count}, PENDING=${coverageResult.rows[0].pending_count}; ` +
      `Attendance present=${coverageResult.rows[0].present_count}, absent=${coverageResult.rows[0].absent_count}, pending=${coverageResult.rows[0].pending_attendance_count}.`,
  );
};

try {
  await seed();
} catch (error) {
  console.error("[seedStudentInterviews] Failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
