import { pool } from "../config/db.js";
import { sendInterviewScheduledEmail, sendInterviewResultEmail } from "../src/modules/company/services/email.service.js";
import notificationService from "./notification.service.js";
import { sendInterviewCalendarInvite } from "./interviewCalendar.service.js";

const getInterviews = async () => {
  const result = await pool.query(`
    SELECT i.*,
           sdp.drive_id AS "driveId",
           rd.title AS "driveTitle",
           c.name AS "companyName"
    FROM interviews i
    LEFT JOIN student_drive_progress sdp ON sdp.id = i.application_id
    LEFT JOIN recruitment_drives rd ON rd.id = sdp.drive_id
    LEFT JOIN companies c ON c.id = rd.company_id
    ORDER BY i.scheduled_at DESC NULLS LAST, i.id DESC
  `);
  return result.rows;
};

const getInterviewById = async (id) => {
  const result = await pool.query(`
    SELECT i.*,
           sdp.drive_id AS "driveId",
           rd.title AS "driveTitle",
           c.name AS "companyName"
    FROM interviews i
    LEFT JOIN student_drive_progress sdp ON sdp.id = i.application_id
    LEFT JOIN recruitment_drives rd ON rd.id = sdp.drive_id
    LEFT JOIN companies c ON c.id = rd.company_id
    WHERE i.id = $1`, [id]);
  return result.rows[0];
};

const createInterview = async ({ applicationId, scheduledAt, interviewType, interviewerId, studentId }) => {
  const meetingLink = `https://meet.google.com/mock-pragati-${Math.random().toString(36).slice(2, 7)}-${Math.random().toString(36).slice(2, 7)}`;
  let interviewStudentId = studentId ? Number(studentId) : null;

  if (applicationId) {
    const relation = await pool.query(`SELECT student_id AS "studentId" FROM student_drive_progress WHERE id = $1 LIMIT 1`, [applicationId]);
    interviewStudentId = relation.rows[0]?.studentId ?? interviewStudentId;
  }

  if (!interviewStudentId) {
    const error = new Error("A valid student/drive-progress relationship is required to schedule an interview");
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query(
    `INSERT INTO interviews
      (application_id, student_id, drive_id, scheduled_at, title, interviewer_id, meeting_link, interview_type, status)
     VALUES ($1, $2, (SELECT drive_id FROM student_drive_progress WHERE id = $1), $3, $4, $5, $6, $7, 'scheduled')
     RETURNING *`,
    [applicationId || null, interviewStudentId, scheduledAt, interviewType || 'Interview', interviewerId || null, meetingLink, interviewType || 'Technical'],
  );

  const interview = result.rows[0];
  const candidateDetails = await pool.query(`SELECT email, name AS full_name FROM students WHERE id = $1`, [interviewStudentId]);
  const candidate = candidateDetails.rows[0];

  if (candidate) {
    try {
      await sendInterviewScheduledEmail(candidate.email, candidate.full_name, interviewType || 'Interview', scheduledAt, meetingLink);
    } catch (emailErr) {
      console.error("[interview.service] Failed to send email:", emailErr.message);
    }

    try {
      await sendInterviewCalendarInvite({
        to: candidate.email,
        candidateName: candidate.full_name,
        title: interview.title,
        scheduledAt,
        meetingLink,
        interviewId: interview.id,
      });
    } catch (calendarError) {
      console.error("[interview.service] Failed to send calendar invite:", calendarError.message);
    }
  }

  try {
    await notificationService.sendNotificationToStudents({
      studentIds: [interviewStudentId],
      title: 'Interview invitation',
      message: `${interviewType || 'Interview'} has been scheduled for ${new Date(scheduledAt).toLocaleString()}.`,
      type: notificationService.NOTIFICATION_TYPES.INTERVIEW_INVITED,
      linkUrl: '/student/interviews',
    });
  } catch (notificationError) {
    console.error('[interview.service] Failed to dispatch student notification:', notificationError.message);
  }

  return interview;
};

const submitFeedback = async (id, feedback) => {
  const result = await pool.query(`UPDATE interviews SET feedback = $2, updated_at = NOW() WHERE id = $1 RETURNING *`, [id, feedback]);
  return result.rows[0];
};

const updateResult = async (id, resultStatus, attendanceStatus) => {
  const attendance = attendanceStatus || 'present';
  const status = attendance === 'absent' ? 'no_show' : 'completed';
  const result = await pool.query(`UPDATE interviews SET result = $2, status = $3, attendance = $4, updated_at = NOW() WHERE id = $1 RETURNING *`, [id, resultStatus, status, attendance]);
  const interview = result.rows[0];

  if (interview) {
    try {
      const candidateDetails = await pool.query(`SELECT email, name AS full_name FROM students WHERE id = $1`, [interview.student_id]);
      if (candidateDetails.rows.length > 0) {
        const { email, full_name } = candidateDetails.rows[0];
        await sendInterviewResultEmail(email, full_name, interview.title, resultStatus);
      }
    } catch (emailErr) {
      console.error("[interview.service] Failed to send email:", emailErr.message);
    }

    try {
      await notificationService.sendNotificationToStudents({
        studentIds: [interview.student_id],
        title: 'Interview outcome available',
        message: `Your ${interview.title || 'interview'} outcome is ${resultStatus}.`,
        type: notificationService.NOTIFICATION_TYPES.INTERVIEW_OUTCOME,
        linkUrl: '/student/interviews',
      });
    } catch (notificationError) {
      console.error('[interview.service] Failed to dispatch outcome notification:', notificationError.message);
    }
  }

  return interview;
};

export { getInterviews, getInterviewById, createInterview, submitFeedback, updateResult };
