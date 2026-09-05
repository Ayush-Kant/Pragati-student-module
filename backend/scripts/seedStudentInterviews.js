import "dotenv/config";
import { pool } from "../config/db.js";

const rows = [
  { title: "Technical Interview — Full Stack", type: "Technical", offset: 2, status: "scheduled", result: "PENDING", attendance: "pending", meeting: "https://meet.google.com/mock-pragati-technical", feedback: null },
  { title: "Behavioral Interview — Placement Round", type: "Behavioral", offset: 5, status: "invited", result: "PENDING", attendance: "pending", meeting: "https://meet.google.com/mock-pragati-behavioral", feedback: null },
  { title: "HR Interview — Culture & Values", type: "HR", offset: 7, status: "scheduled", result: "PENDING", attendance: "pending", meeting: "https://meet.google.com/mock-pragati-hr", feedback: null },
  { title: "Technical Interview — System Design", type: "Technical", offset: -8, status: "completed", result: "PASS", attendance: "present", meeting: "https://meet.google.com/mock-pragati-system-design", feedback: "Strong system-design fundamentals, clear trade-off discussion, and good communication." },
  { title: "Panel Interview — Final Review", type: "Panel", offset: -12, status: "completed", result: "FAIL", attendance: "present", meeting: "https://meet.google.com/mock-pragati-panel", feedback: "Good effort, but the candidate needs stronger depth in distributed systems and testing strategy." },
  { title: "Technical Interview — Missed Slot", type: "Technical", offset: -16, status: "completed", result: "PENDING", attendance: "absent", meeting: "https://meet.google.com/mock-pragati-missed", feedback: "Candidate did not attend the scheduled interview." },
];

const seed = async () => {
  const { rows: students } = await pool.query(`SELECT id, name, email FROM students ORDER BY id`);
  if (!students.length) throw new Error("No students were found. Register a student first, then rerun the seed.");

  for (const student of students) {
    for (const interview of rows) {
      await pool.query(
        `INSERT INTO interviews
          (application_id, student_id, scheduled_at, title, interviewer_id, meeting_link,
           interview_type, result, status, attendance, feedback)
         SELECT NULL, $1, NOW() + ($2 * INTERVAL '1 day'), $3, NULL, $4, $5, $6, $7, $8, $9
         WHERE NOT EXISTS (
           SELECT 1 FROM interviews WHERE student_id = $1 AND title = $3
         )`,
        [student.id, interview.offset, interview.title, interview.meeting, interview.type, interview.result, interview.status, interview.attendance, interview.feedback],
      );
    }
  }

  console.log(`Seeded/verified interview scenarios for ${students.length} student account(s).`);
};

try {
  await seed();
} catch (error) {
  console.error("[seedStudentInterviews] Failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
