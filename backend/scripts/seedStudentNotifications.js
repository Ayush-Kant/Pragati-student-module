import "dotenv/config";
import { pool } from "../config/db.js";

const rows = [
  ['grade_released', 'Assignment graded', 'Your REST API assignment scored 82/100.', '/student/assignments', false],
  ['session_scheduled', 'New live session scheduled', 'React Hooks Deep Dive is scheduled for the next learning block.', '/student/sessions', false],
  ['assignment_published', 'New assignment published', 'Build a REST API has been assigned to you.', '/student/assignments', false],
  ['shortlisted', 'You have been shortlisted', 'You are shortlisted for the next placement stage.', '/student/dashboard', true],
  ['interview_invited', 'Interview invitation', 'Your Full Stack technical interview has been scheduled.', '/student/interviews', false],
  ['interview_outcome', 'Interview outcome available', 'Your latest interview outcome is ready to review.', '/student/interviews', false],
  ['platform_announcement', 'Pragati platform update', 'New student-module capabilities are now available.', '/student/notifications', true],
  ['certificate_issued', 'Certificate issued', 'Your completion certificate is now available.', '/student/certificates', false],
  ['info', 'Information notification', 'This is a seeded informational notification for UI/state testing.', '/student/notifications', false],
  ['success', 'Success notification', 'Your course milestone was completed successfully.', '/student/dashboard', true],
  ['warning', 'Warning notification', 'Your profile is missing one recommended detail.', '/student/profile', false],
  ['alert', 'Action required notification', 'Please review your upcoming interview details.', '/student/interviews', false],
];

const seed = async () => {
  const { rows: students } = await pool.query(`
    SELECT s.id AS "studentId", s.name, s.email, s.user_id AS "userId"
    FROM students s
    WHERE s.user_id IS NOT NULL
    ORDER BY s.id
  `);
  if (!students.length) throw new Error("No linked student accounts were found. Register a student first, then rerun the seed.");

  for (const student of students) {
    for (const [type, title, message, linkUrl, isRead] of rows) {
      await pool.query(
        `INSERT INTO notifications (user_id, title, message, type, link_url, is_read)
         SELECT $1::integer, $2::text, $3::text, $4::text, $5::text, $6::boolean
         WHERE NOT EXISTS (
           SELECT 1 FROM notifications
           WHERE user_id = $1::integer
             AND type = $4::text
             AND title = $2::text
             AND message = $3::text
         )`,
        [student.userId, title, message, type, linkUrl, isRead],
      );
    }
  }

  console.log(`Seeded/verified ${rows.length} notification scenarios for ${students.length} student account(s).`);
};

try {
  await seed();
} catch (error) {
  console.error("[seedStudentNotifications] Failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
