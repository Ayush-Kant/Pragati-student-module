import "dotenv/config";
import { pool } from "../config/db.js";

const DEMO_EMAIL = "student@demo.edu";

const seed = async () => {
  const studentResult = await pool.query(
    `SELECT id, name FROM students WHERE LOWER(email) = LOWER($1) LIMIT 1`,
    [DEMO_EMAIL],
  );

  if (!studentResult.rows[0]) {
    throw new Error(`Student ${DEMO_EMAIL} was not found. Run the normal migrations first.`);
  }

  const student = studentResult.rows[0];
  const rows = [
    {
      title: "Technical Interview — Full Stack",
      type: "Technical",
      at: "2026-09-10T11:00:00+05:30",
      meeting: "https://meet.google.com/mock-pragati-technical",
      status: "scheduled",
    },
    {
      title: "Behavioral Interview — Placement Round",
      type: "Behavioral",
      at: "2026-09-12T15:30:00+05:30",
      meeting: "https://meet.google.com/mock-pragati-behavioral",
      status: "invited",
    },
    {
      title: "Completed Interview — Sample Result",
      type: "Technical",
      at: "2026-08-28T12:00:00+05:30",
      meeting: "https://meet.google.com/mock-pragati-completed",
      status: "completed",
    },
  ];

  for (const interview of rows) {
    await pool.query(
      `INSERT INTO interviews
        (application_id, student_id, scheduled_at, title, interviewer_id, meeting_link, interview_type, result, status, attendance, feedback)
       SELECT
         $1::integer,
         $2::integer,
         $3::timestamptz,
         $4::varchar(255),
         NULL::integer,
         $5::varchar(500),
         $6::varchar(100),
         CASE WHEN $7::varchar = 'completed' THEN 'PASS' ELSE 'PENDING' END,
         $7::varchar,
         CASE WHEN $7::varchar = 'completed' THEN 'present' ELSE 'pending' END,
         CASE WHEN $7::varchar = 'completed'
              THEN 'Great communication and solid full-stack fundamentals.'
              ELSE NULL END
       WHERE NOT EXISTS (
         SELECT 1
         FROM interviews
         WHERE student_id = $2::integer
           AND title = $4::varchar(255)
           AND scheduled_at = $3::timestamptz
       )`,
      [
        null,
        student.id,
        interview.at,
        interview.title,
        interview.meeting,
        interview.type,
        interview.status,
      ],
    );
  }

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS count FROM interviews WHERE student_id = $1::integer`,
    [student.id],
  );

  console.log(
    `Seeded/verified interviews for ${student.name} (${DEMO_EMAIL}). Total: ${countResult.rows[0].count}`,
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
