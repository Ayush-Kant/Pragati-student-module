import { pool } from '../../../config/db.js';
import { sendInterviewScheduledEmail, sendInterviewResultEmail } from '../../../src/modules/company/services/email.service.js';

export const listInterviews = async (companyId) => {
  const query = `
    SELECT 
      i.id AS "id",
      i.id AS "interviewId",
      i.application_id AS "applicationId",
      i.scheduled_at AS "scheduledAt",
      i.interview_type AS "round",
      i.interviewer_id AS "interviewerId",
      i.meeting_link AS "meetingLink",
      i.result AS "result",
      i.attendance AS "attendance",
      i.feedback AS "feedback",
      s.name AS "candidateName",
      s.email AS "email",
      s.phone AS "phone",
      s.college AS "college",
      rd.job_title AS "jobTitle",
      u.full_name AS "interviewerName"
    FROM interviews i
    JOIN student_drive_progress sdp ON sdp.id = i.application_id
    JOIN students s ON s.id = sdp.student_id
    JOIN recruitment_drives rd ON rd.id = sdp.drive_id
    LEFT JOIN users u ON u.id = i.interviewer_id
    WHERE sdp.company_id = $1
    ORDER BY i.scheduled_at DESC
  `;
  const result = await pool.query(query, [companyId]);
  return result.rows;
};

export const getInterviewById = async (interviewId, companyId) => {
  const query = `
    SELECT 
      i.id AS "id",
      i.id AS "interviewId",
      i.application_id AS "applicationId",
      i.scheduled_at AS "scheduledAt",
      i.interview_type AS "round",
      i.interviewer_id AS "interviewerId",
      i.meeting_link AS "meetingLink",
      i.result AS "result",
      i.attendance AS "attendance",
      i.feedback AS "feedback",
      s.name AS "candidateName",
      s.email AS "email",
      s.phone AS "phone",
      s.college AS "college",
      rd.job_title AS "jobTitle",
      u.full_name AS "interviewerName"
    FROM interviews i
    JOIN student_drive_progress sdp ON sdp.id = i.application_id
    JOIN students s ON s.id = sdp.student_id
    JOIN recruitment_drives rd ON rd.id = sdp.drive_id
    LEFT JOIN users u ON u.id = i.interviewer_id
    WHERE i.id = $1 AND sdp.company_id = $2
  `;
  const result = await pool.query(query, [interviewId, companyId]);
  return result.rows[0] || null;
};

export const scheduleInterview = async (companyId, { candidateId, round, date, time, interviewerId, meetingLink, notes }) => {
  // Validate candidateId exists for this company
  const validCheck = await pool.query(
    `SELECT id FROM student_drive_progress WHERE id = $1 AND company_id = $2`,
    [candidateId, companyId]
  );
  if (validCheck.rows.length === 0) {
    throw new Error('Invalid candidate association');
  }

  const generatedMeetLink = meetingLink || `https://meet.google.com/mock-meet-${Math.random().toString(36).substring(2, 7)}-${Math.random().toString(36).substring(2, 7)}`;
  const scheduledTime = time ? `${date}T${time}` : date;

  const result = await pool.query(
    `
    INSERT INTO interviews
    (
        application_id,
        scheduled_at,
        interview_type,
        interviewer_id,
        meeting_link,
        status,
        result
    )
    VALUES ($1, $2, $3, $4, $5, 'scheduled', 'PENDING')
    RETURNING *
    `,
    [
      candidateId,
      scheduledTime,
      round,
      interviewerId || null,
      generatedMeetLink
    ]
  );

  const interview = result.rows[0];

  // Try to update student_drive_progress stage to 'interviews'
  await pool.query(
    `UPDATE student_drive_progress SET current_stage = 'interviews', stage = 'Interview' WHERE id = $1`,
    [candidateId]
  );

  // Send email notification
  try {
    const candidateDetails = await pool.query(
      `
      SELECT u.email, u.full_name
      FROM student_drive_progress sdp
      JOIN students s ON s.id = sdp.student_id
      JOIN users u ON u.id = s.user_id
      WHERE sdp.id = $1
      `,
      [candidateId]
    );

    if (candidateDetails.rows.length > 0) {
      const { email, full_name } = candidateDetails.rows[0];
      await sendInterviewScheduledEmail(
        email,
        full_name,
        round,
        scheduledTime,
        generatedMeetLink
      );
    }
  } catch (emailErr) {
    console.error("[companyInterview.service] Failed to send email:", emailErr.message);
  }

  return interview;
};

export const submitFeedback = async (interviewId, companyId, feedback) => {
  const result = await pool.query(
    `
    UPDATE interviews i
    SET feedback = $3
    FROM student_drive_progress sdp
    WHERE i.id = $1 AND sdp.id = i.application_id AND sdp.company_id = $2
    RETURNING i.*
    `,
    [interviewId, companyId, feedback]
  );
  return result.rows[0] || null;
};

export const updateResult = async (interviewId, companyId, resultStatus, attendanceStatus) => {
  let status = 'completed';
  let attendance = attendanceStatus || 'present';

  if (attendance === 'absent') {
    status = 'no_show';
  }

  const result = await pool.query(
    `
    UPDATE interviews i
    SET result = $3,
        status = $4,
        attendance = $5
    FROM student_drive_progress sdp
    WHERE i.id = $1 AND sdp.id = i.application_id AND sdp.company_id = $2
    RETURNING i.*
    `,
    [interviewId, companyId, resultStatus, status, attendance]
  );

  const interview = result.rows[0];

  if (interview) {
    // Notify candidate
    try {
      const candidateDetails = await pool.query(
        `
        SELECT u.email, u.full_name
        FROM student_drive_progress sdp
        JOIN students s ON s.id = sdp.student_id
        JOIN users u ON u.id = s.user_id
        WHERE sdp.id = $1
        `,
        [interview.application_id]
      );

      if (candidateDetails.rows.length > 0) {
        const { email, full_name } = candidateDetails.rows[0];
        await sendInterviewResultEmail(
          email,
          full_name,
          interview.interview_type,
          resultStatus
        );
      }
    } catch (emailErr) {
      console.error("[companyInterview.service] Failed to send email:", emailErr.message);
    }
  }

  return interview;
};
