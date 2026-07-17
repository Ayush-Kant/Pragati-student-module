import { pool } from '../../../config/db.js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_123456789');
const FROM = 'onboarding@resend.dev';

const sendGeneralEmail = async (to, subject, text) => {
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject,
      text: text,
      html: `<div style="font-family: sans-serif; padding: 20px; line-height: 1.6;">${text.replace(/\n/g, '<br/>')}</div>`
    });
    console.log(`[Notification Service] Email sent successfully to ${to}`);
  } catch (err) {
    console.error(`[Notification Service] Failed to send email to ${to}:`, err.message);
  }
};

const getGroupCandidates = async (companyId, recipientGroup) => {
  let stageFilter = '';
  if (recipientGroup === 'shortlisted') {
    stageFilter = "AND sdp.current_stage = 'shortlist'";
  } else if (recipientGroup === 'interview') {
    stageFilter = "AND sdp.current_stage = 'interviews'";
  } else if (recipientGroup === 'offer') {
    stageFilter = "AND sdp.current_stage = 'selection'";
  }

  const query = `
    SELECT 
      s.id AS "studentId",
      s.email AS "email",
      s.name AS "name",
      u.id AS "userId",
      u.auth_user_id AS "authUserId"
    FROM student_drive_progress sdp
    JOIN students s ON s.id = sdp.student_id
    JOIN users u ON u.email = s.email
    WHERE sdp.company_id = $1 ${stageFilter}
  `;
  const result = await pool.query(query, [companyId]);
  return result.rows;
};

export const listNotifications = async (intUserId) => {
  const query = `
    SELECT 
      id AS "notificationId",
      subject AS "title",
      message AS "message",
      recipient_group AS "recipientGroup",
      channels AS "channels",
      status AS "status",
      recipient_count AS "recipientCount",
      scheduled_at AS "scheduledAt",
      sent_at AS "sentAt",
      created_at AS "createdAt"
    FROM admin_notifications
    WHERE created_by = $1
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query, [intUserId]);
  return result.rows;
};

export const sendNotification = async (companyId, intUserId, payload) => {
  const { title, message, recipientGroup = 'all', channels = ['email'] } = payload;
  
  if (!title || !message) {
    throw new Error('Title and message are required');
  }

  const candidates = await getGroupCandidates(companyId, recipientGroup);
  const recipientCount = candidates.length;

  // 1. Save immediately to admin_notifications
  const insertQuery = `
    INSERT INTO admin_notifications (
      recipient_group, specific_user_id, channels, subject, message, status, recipient_count, sent_at, created_by
    )
    VALUES ($1, NULL, $2, $3, $4, 'sent', $5, NOW(), $6)
    RETURNING id
  `;
  const insertResult = await pool.query(insertQuery, [
    recipientGroup,
    channels,
    title,
    message,
    recipientCount,
    intUserId
  ]);
  const notificationId = insertResult.rows[0].id;

  // 2. Dispatch notifications to all candidates in parallel
  for (const c of candidates) {
    if (channels.includes('email') && c.email) {
      await sendGeneralEmail(c.email, title, message);
    }
    
    // Always insert into student notifications table so sent messages are reflected on the student portal
    if (c.userId) {
      await pool.query(
        `INSERT INTO notifications (student_auth_user_id, user_id, title, message, type)
         VALUES ($1, $2, $3, $4, 'info')`,
        [c.authUserId, c.userId, title, message]
      );
    }

    // Insert delivery log
    for (const ch of channels) {
      await pool.query(
        `INSERT INTO notification_deliveries (notification_id, user_id, channel, delivery_status, delivered_at)
         VALUES ($1, $2, $3, 'delivered', NOW())`,
        [notificationId, c.userId, ch]
      );
    }
  }

  return { success: true, message: 'Notification sent successfully', notificationId };
};

export const scheduleNotification = async (companyId, intUserId, payload) => {
  const { title, message, recipientGroup = 'all', channels = ['email'], scheduleTime } = payload;
  
  if (!title || !message || !scheduleTime) {
    throw new Error('Title, message, and scheduleTime are required');
  }

  const candidates = await getGroupCandidates(companyId, recipientGroup);
  const recipientCount = candidates.length;

  const insertQuery = `
    INSERT INTO admin_notifications (
      recipient_group, specific_user_id, channels, subject, message, status, recipient_count, scheduled_at, created_by
    )
    VALUES ($1, NULL, $2, $3, $4, 'scheduled', $5, $6, $7)
    RETURNING id
  `;
  const insertResult = await pool.query(insertQuery, [
    recipientGroup,
    channels,
    title,
    message,
    recipientCount,
    scheduleTime,
    intUserId
  ]);
  const notificationId = insertResult.rows[0].id;

  return { success: true, message: 'Notification scheduled successfully', notificationId };
};
