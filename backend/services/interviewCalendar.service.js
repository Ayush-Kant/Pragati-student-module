import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const FROM = 'onboarding@resend.dev';

const escapeIcs = (value) => String(value || '')
  .replace(/\\/g, '\\\\')
  .replace(/;/g, '\\;')
  .replace(/,/g, '\\,')
  .replace(/\r?\n/g, '\\n');

const formatIcsDate = (value) => new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

export const buildInterviewIcs = ({ id, title, scheduledAt, meetingLink, durationMinutes = 60 }) => {
  const start = new Date(scheduledAt);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Pragati//Student Interviews//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:pragati-interview-${id}@pragati`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${escapeIcs(title || 'Pragati Interview')}`,
    `DESCRIPTION:${escapeIcs(`Pragati interview${meetingLink ? `\\nJoin: ${meetingLink}` : ''}`)}`,
    meetingLink ? `URL:${meetingLink}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n');
};

export const sendInterviewCalendarInvite = async ({ to, candidateName, title, scheduledAt, meetingLink, interviewId }) => {
  if (!process.env.RESEND_API_KEY) return { success: false, skipped: true, reason: 'RESEND_API_KEY is not configured' };
  const resend = new Resend(process.env.RESEND_API_KEY);
  const ics = buildInterviewIcs({ id: interviewId, title, scheduledAt, meetingLink });
  try {
    const result = await resend.emails.send({
      from: FROM,
      to,
      subject: `Calendar invite — ${title || 'Pragati Interview'}`,
      html: `<p>Hi ${candidateName || 'Student'},</p><p>Your interview is scheduled for <strong>${new Date(scheduledAt).toLocaleString()}</strong>.</p>${meetingLink ? `<p><a href="${meetingLink}">Join interview</a></p>` : ''}<p>The calendar invite is attached.</p>`,
      attachments: [{ filename: 'pragati-interview.ics', content: Buffer.from(ics).toString('base64') }],
    });
    if (result.error) return { success: false, error: result.error };
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('[interviewCalendar] Failed to send calendar invite:', error.message);
    return { success: false, error: error.message };
  }
};
