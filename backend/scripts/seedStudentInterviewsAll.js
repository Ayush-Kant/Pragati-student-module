import "dotenv/config";
import { pool } from "../config/db.js";

const rows = [
  ["Technical Interview — Full Stack", "Technical", 2, "scheduled", "PENDING", "pending", "https://meet.google.com/mock-pragati-technical", null],
  ["Behavioral Interview — Placement Round", "Behavioral", 5, "invited", "PENDING", "pending", "https://meet.google.com/mock-pragati-behavioral", null],
  ["HR Interview — Culture & Values", "HR", 7, "scheduled", "PENDING", "pending", "https://meet.google.com/mock-pragati-hr", null],
  ["Technical Interview — System Design", "Technical", -8, "completed", "PASS", "present", "https://meet.google.com/mock-pragati-system-design", "Strong system-design fundamentals, clear trade-off discussion, and good communication."],
  ["Panel Interview — Final Review", "Panel", -12, "completed", "FAIL", "present", "https://meet.google.com/mock-pragati-panel", "Good effort, but the candidate needs stronger depth in distributed systems and testing strategy."],
  ["Technical Interview — Missed Slot", "Technical", -16, "completed", "PENDING", "absent", "https://meet.google.com/mock-pragati-missed", "Candidate did not attend the scheduled interview."],
];

const seed = async () => {
  const { rows: students } = await pool.query(`SELECT id, name, email FROM students ORDER BY id`);
  if (!students.length) throw new Error("No students were found. Register a student first, then rerun the seed.");

  for (const student of students) {
    for (const [title, type, offset, status, result, attendance, meetingLink, feedback] of rows) {
      await pool.query(
        `INSERT INTO interviews
          (application_id, student_id, scheduled_at, title, interviewer_id, meeting_link,
           interview_type, result, status, attendance, feedback)
         SELECT NULL, $1, NOW() + ($2 * INTERVAL '1 day'), $3, NULL, $4, $5, $6, $7, $8, $9
         WHERE NOT EXISTS (
           SELECT 1 FROM interviews WHERE student_id = $1 AND title = $3
         )`,
        [student.id, offset, title, meetingLink, type, result, status, attendance, feedback],
      );
    }
  }

  console.log(`Seeded/verified interview scenarios for ${students.length} student account(s).`);
};

try {
  await seed();
} catch (error) {
  console.error("[seedStudentInterviewsAll] Failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
