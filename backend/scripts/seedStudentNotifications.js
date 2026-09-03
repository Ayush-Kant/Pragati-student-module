import "dotenv/config";
import { pool } from "../config/db.js";

const DEMO_EMAIL = "student@demo.edu";

const seed = async () => {
  const result = await pool.query(
    `SELECT u.id AS "userId", s.id AS "studentId", s.name
     FROM users u JOIN students s ON s.user_id = u.id
     WHERE LOWER(s.email) = LOWER($1) LIMIT 1`,
    [DEMO_EMAIL],
  );

  if (!result.rows[0]) throw new Error(`Student ${DEMO_EMAIL} was not found.`);
  const { userId, studentId, name } = result.rows[0];

  const rows = [
    ['grade_released', 'Assignment graded', 'Your REST API assignment scored 82/100.', '/student/assignments'],
    ['session_scheduled', 'New live session scheduled', 'React Hooks Deep Dive is scheduled for the next learning block.', '/student/sessions'],
    ['assignment_published', 'New assignment published', 'Build a REST API has been assigned to you.', '/student/assignments'],
    ['shortlisted', 'You have been shortlisted', 'You are shortlisted for the next placement stage.', '/student/dashboard'],
    ['interview_invited', 'Interview invitation', 'Your Full Stack technical interview has been scheduled.', '/student/interviews'],
    ['interview_outcome', 'Interview outcome available', 'Your latest interview outcome is ready to review.', '/student/interviews'],
    ['platform_announcement', 'Pragati platform update', 'New student-module capabilities are now available.', '/student/notifications'],
    ['certificate_issued', 'Certificate issued', 'Your completion certificate is now available.', '/student/certificates'],
  ];

  for (const [type, title, message, linkUrl] of rows) {
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type, link_url, is_read)
       SELECT $1, $2, $3, $4, $5, false
       WHERE NOT EXISTS (
         SELECT 1 FROM notifications WHERE user_id = $1 AND type = $4 AND title = $2 AND message = $3
       )`,
      [userId, title, message, type, linkUrl],
    );
  }

  console.log(`Seeded/verified notification scenarios for ${name} (${DEMO_EMAIL}), user ${userId}, student ${studentId}.`);
};

try {
  await seed();
} catch (error) {
  console.error("[seedStudentNotifications] Failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
