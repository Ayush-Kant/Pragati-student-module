import "dotenv/config";
import { pool } from "../config/db.js";

const PREFERRED_EMAIL = "student@demo.edu";

const seed = async () => {
  const result = await pool.query(
    `SELECT u.id AS "userId", s.id AS "studentId", s.name, s.email
     FROM users u
     JOIN students s ON s.user_id = u.id
     ORDER BY CASE WHEN LOWER(s.email) = LOWER($1::text) THEN 0 ELSE 1 END, s.id
     LIMIT 1`,
    [PREFERRED_EMAIL],
  );

  if (!result.rows[0]) throw new Error("No student with a linked user account was found. Register a student first.");
  const { userId, studentId, name, email } = result.rows[0];

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
      [userId, title, message, type, linkUrl, isRead],
    );
  }

  const summary = await pool.query(
    `SELECT type, COUNT(*)::int AS count, COUNT(*) FILTER (WHERE is_read = false)::int AS unread
     FROM notifications
     WHERE user_id = $1::integer
     GROUP BY type
     ORDER BY type`,
    [userId],
  );

  console.log(`Seeded/verified notification scenarios for ${name} (${email}), user ${userId}, student ${studentId}.`);
  console.table(summary.rows);
};

try {
  await seed();
} catch (error) {
  console.error("[seedStudentNotifications] Failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
