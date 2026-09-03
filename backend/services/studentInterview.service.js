import { pool } from '../config/db.js';
import { resolveStudentId } from '../utils/studentProfileIdentity.js';

const getStudentInterviews = async (user) => {
  const studentId = await resolveStudentId(user);
  const result = await pool.query(
    `SELECT
       i.id,
       i.application_id AS "applicationId",
       i.student_id AS "studentId",
       i.drive_id AS "driveId",
       i.scheduled_at AS "scheduledAt",
       i.title,
       i.interview_type AS "interviewType",
       i.interviewer_id AS "interviewerId",
       i.meeting_link AS "meetingLink",
       i.result,
       i.status,
       i.attendance,
       i.feedback,
       rd.title AS "driveTitle",
       c.name AS "companyName"
     FROM interviews i
     LEFT JOIN recruitment_drives rd ON rd.id = i.drive_id
     LEFT JOIN companies c ON c.id = rd.company_id
     WHERE i.student_id = $1
     ORDER BY i.scheduled_at ASC NULLS LAST, i.id DESC`,
    [studentId],
  );
  return result.rows.map((row) => ({
    ...row,
    canJoin: row.scheduledAt
      ? Date.now() >= new Date(row.scheduledAt).getTime() - 15 * 60 * 1000 && Date.now() <= new Date(row.scheduledAt).getTime() + 2 * 60 * 60 * 1000
      : false,
  }));
};

const getInterview = async (user, interviewId) => {
  const studentId = await resolveStudentId(user);
  const result = await pool.query(
    `SELECT i.*,
            rd.title AS "driveTitle",
            c.name AS "companyName"
     FROM interviews i
     LEFT JOIN recruitment_drives rd ON rd.id = i.drive_id
     LEFT JOIN companies c ON c.id = rd.company_id
     WHERE i.id = $1 AND i.student_id = $2
     LIMIT 1`,
    [interviewId, studentId],
  );
  if (!result.rows[0]) {
    const error = new Error('Interview not found');
    error.statusCode = 404;
    throw error;
  }
  return result.rows[0];
};

const confirmInterview = async (user, interviewId) => {
  await getInterview(user, interviewId);
  const result = await pool.query(
    `UPDATE interviews
     SET status = CASE WHEN status IN ('scheduled','invited') THEN 'confirmed' ELSE status END,
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, status`,
    [interviewId],
  );
  return result.rows[0];
};

const joinInterview = async (user, interviewId) => {
  const interview = await getInterview(user, interviewId);
  if (!interview.scheduled_at) {
    const error = new Error('Interview schedule is not available');
    error.statusCode = 400;
    throw error;
  }
  const start = new Date(interview.scheduled_at).getTime();
  const now = Date.now();
  if (now < start - 15 * 60 * 1000) {
    const error = new Error('Interview join window opens 15 minutes before the scheduled time');
    error.statusCode = 400;
    throw error;
  }
  if (now > start + 2 * 60 * 60 * 1000) {
    const error = new Error('Interview join window has closed');
    error.statusCode = 400;
    throw error;
  }
  if (!interview.meeting_link) {
    const error = new Error('Interview meeting link is not available');
    error.statusCode = 409;
    throw error;
  }
  return { meetingLink: interview.meeting_link, interviewId: interview.id };
};

export const listInterviews = (user) => getStudentInterviews(user);
export { getInterview, confirmInterview, joinInterview };

export default { listInterviews, getInterview, confirmInterview, joinInterview };
