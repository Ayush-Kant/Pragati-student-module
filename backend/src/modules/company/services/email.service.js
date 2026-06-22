/**
 * email.service.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Resend email integration for college management notifications.
 * Uses onboarding@resend.dev as the test sender (as per project spec).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "onboarding@resend.dev";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Generic send wrapper with structured error logging.
 * Never throws — email failures are non-fatal (logged and swallowed).
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("[email.service] Resend error:", error);
      return { success: false, error };
    }

    console.log(`[email.service] Email sent → ${to} | id: ${data.id}`);
    return { success: true, id: data.id };
  } catch (err) {
    console.error("[email.service] Unexpected error:", err.message);
    return { success: false, error: err.message };
  }
};

// ─── Email Templates ──────────────────────────────────────────────────────────

/**
 * Send an approval welcome email to the college.
 *
 * @param {string} to            - College contact email
 * @param {string} collegeName
 * @param {string} companyName
 */
export const sendApprovalEmail = async (to, collegeName, companyName) => {
  return sendEmail({
    to,
    subject: `🎉 Partnership Approved — ${companyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #10b981; margin-bottom: 8px;">Partnership Approved!</h2>
        <p style="color: #374151; font-size: 15px;">
          Dear <strong>${collegeName}</strong> Placement Team,
        </p>
        <p style="color: #374151; font-size: 15px;">
          We are pleased to inform you that <strong>${companyName}</strong> has approved your partnership request on the <strong>Pragati</strong> platform.
        </p>
        <p style="color: #374151; font-size: 15px;">
          You can now participate in recruitment drives, submit student profiles, and track placement outcomes through the platform.
        </p>
        <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; color: #065f46; font-weight: 600;">Next Steps</p>
          <ul style="color: #047857; margin: 8px 0 0; padding-left: 20px;">
            <li>Log in to the Pragati portal</li>
            <li>Complete your college profile</li>
            <li>Add your departments and student data</li>
            <li>Browse active recruitment drives</li>
          </ul>
        </div>
        <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">
          This is an automated notification from Pragati Platform.<br/>
          If you have questions, contact your ${companyName} relationship manager.
        </p>
      </div>
    `,
  });
};

/**
 * Send a rejection notice to the college.
 *
 * @param {string} to
 * @param {string} collegeName
 * @param {string} companyName
 * @param {string} reason
 */
export const sendRejectionEmail = async (to, collegeName, companyName, reason) => {
  return sendEmail({
    to,
    subject: `Partnership Request Update — ${companyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #ef4444; margin-bottom: 8px;">Partnership Request Update</h2>
        <p style="color: #374151; font-size: 15px;">
          Dear <strong>${collegeName}</strong> Placement Team,
        </p>
        <p style="color: #374151; font-size: 15px;">
          We regret to inform you that your partnership request with <strong>${companyName}</strong> on the Pragati platform has not been approved at this time.
        </p>
        ${reason ? `
        <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; color: #7f1d1d; font-weight: 600;">Reason</p>
          <p style="margin: 8px 0 0; color: #991b1b;">${reason}</p>
        </div>
        ` : ""}
        <p style="color: #374151; font-size: 15px;">
          You may reapply after addressing the concerns mentioned above, or reach out to ${companyName} directly for clarification.
        </p>
        <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">
          This is an automated notification from Pragati Platform.
        </p>
      </div>
    `,
  });
};

/**
 * Send a suspension notice to the college.
 *
 * @param {string} to
 * @param {string} collegeName
 * @param {string} companyName
 * @param {string} reason
 */
export const sendSuspensionEmail = async (to, collegeName, companyName, reason) => {
  return sendEmail({
    to,
    subject: `⚠️ Partnership Suspended — ${companyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #f59e0b; margin-bottom: 8px;">Partnership Suspended</h2>
        <p style="color: #374151; font-size: 15px;">
          Dear <strong>${collegeName}</strong> Placement Team,
        </p>
        <p style="color: #374151; font-size: 15px;">
          Your partnership with <strong>${companyName}</strong> on the Pragati platform has been temporarily <strong>suspended</strong>.
        </p>
        ${reason ? `
        <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; color: #78350f; font-weight: 600;">Reason for Suspension</p>
          <p style="margin: 8px 0 0; color: #92400e;">${reason}</p>
        </div>
        ` : ""}
        <p style="color: #374151; font-size: 15px;">
          During the suspension period, your college will not be able to participate in new recruitment drives. 
          Please take corrective action and contact ${companyName} to have the suspension reviewed.
        </p>
        <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">
          This is an automated notification from Pragati Platform.
        </p>
      </div>
    `,
  });
};

/**
 * Send a drive invitation email to the college.
 *
 * @param {string} to
 * @param {string} collegeName
 * @param {string} companyName
 * @param {string} driveTitle
 * @param {string} deadline
 */
export const sendDriveInviteEmail = async (to, collegeName, companyName, driveTitle, deadline) => {
  return sendEmail({
    to,
    subject: `📢 New Recruitment Drive — ${driveTitle} | ${companyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #6366f1; margin-bottom: 8px;">New Recruitment Drive Invitation</h2>
        <p style="color: #374151; font-size: 15px;">
          Dear <strong>${collegeName}</strong> Placement Team,
        </p>
        <p style="color: #374151; font-size: 15px;">
          <strong>${companyName}</strong> has launched a new recruitment drive and your college has been invited to participate.
        </p>
        <div style="background: #eef2ff; border-left: 4px solid #6366f1; padding: 16px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; color: #3730a3; font-weight: 600;">Drive Details</p>
          <p style="margin: 8px 0 0; color: #4338ca;"><strong>Title:</strong> ${driveTitle}</p>
          ${deadline ? `<p style="margin: 4px 0 0; color: #4338ca;"><strong>Registration Deadline:</strong> ${deadline}</p>` : ""}
        </div>
        <p style="color: #374151; font-size: 15px;">
          Please log in to the Pragati portal to register your eligible students for this drive.
        </p>
        <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">
          This is an automated notification from Pragati Platform.
        </p>
      </div>
    `,
  });
};

/**
 * Send an interview scheduled notification to the candidate.
 *
 * @param {string} to
 * @param {string} candidateName
 * @param {string} round
 * @param {string} date
 * @param {string} meetingLink
 */
export const sendInterviewScheduledEmail = async (to, candidateName, round, date, meetingLink) => {
  return sendEmail({
    to,
    subject: `🗓️ Interview Scheduled — ${round} Round`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #6366f1; margin-bottom: 8px;">Interview Scheduled</h2>
        <p style="color: #374151; font-size: 15px;">
          Dear <strong>${candidateName}</strong>,
        </p>
        <p style="color: #374151; font-size: 15px;">
          An interview has been scheduled for you. Here are the details:
        </p>
        <div style="background: #eef2ff; border-left: 4px solid #6366f1; padding: 16px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; color: #3730a3; font-weight: 600;">Interview Details</p>
          <p style="margin: 8px 0 0; color: #4338ca;"><strong>Round:</strong> ${round}</p>
          <p style="margin: 4px 0 0; color: #4338ca;"><strong>Date & Time:</strong> ${date}</p>
          <p style="margin: 4px 0 0; color: #4338ca;"><strong>Meeting Link:</strong> <a href="${meetingLink}" target="_blank">${meetingLink}</a></p>
        </div>
        <p style="color: #374151; font-size: 15px;">
          Please join the meeting link on time. If you have any questions or conflicts, please contact your placement officer.
        </p>
        <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">
          This is an automated notification from Pragati Platform.
        </p>
      </div>
    `,
  });
};

/**
 * Send an interview result notification to the candidate.
 *
 * @param {string} to
 * @param {string} candidateName
 * @param {string} round
 * @param {string} result
 */
export const sendInterviewResultEmail = async (to, candidateName, round, result) => {
  const isPass = result.toUpperCase() === 'PASS';
  const color = isPass ? '#10b981' : '#ef4444';
  const bannerBackground = isPass ? '#f0fdf4' : '#fef2f2';
  const bannerText = isPass ? '#065f46' : '#7f1d1d';
  
  return sendEmail({
    to,
    subject: `📢 Interview Result Update — ${round} Round`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: ${color}; margin-bottom: 8px;">Interview Result Update</h2>
        <p style="color: #374151; font-size: 15px;">
          Dear <strong>${candidateName}</strong>,
        </p>
        <p style="color: #374151; font-size: 15px;">
          Your interview result for the <strong>${round}</strong> round has been updated.
        </p>
        <div style="background: ${bannerBackground}; border-left: 4px solid ${color}; padding: 16px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; color: ${bannerText}; font-weight: 600;">Result: ${result.toUpperCase()}</p>
        </div>
        <p style="color: #374151; font-size: 15px;">
          ${isPass 
            ? "Congratulations! You have cleared this round. We will contact you shortly regarding the next steps." 
            : "Thank you for participating. Unfortunately, you did not clear this round. We wish you the best of luck for future opportunities."
          }
        </p>
        <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">
          This is an automated notification from Pragati Platform.
        </p>
      </div>
    `,
  });
};
