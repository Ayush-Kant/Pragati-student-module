// company.email.service.js

import { Resend } from 'resend';

// Lazy client — instantiated on first send so a missing key doesn't crash the server at startup
let _resend = null;
const getClient = () => {
    if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY || 're_dummykey123');
    return _resend;
};

const FROM = 'onboarding@resend.dev';

const sendApprovalEmail = async (to, companyName) => {
    await getClient().emails.send({
        from:    FROM,
        to,
        subject: 'Your registration has been approved — Pragati',
        html: `
      <h2>Welcome to Pragati, ${companyName}!</h2>
      <p>Your company registration has been <strong>approved</strong>.</p>
      <p>You can now access your dashboard, post recruitment drives, and connect with top student talent.</p>
      <p>Log in to get started and complete your company profile.</p>
      <br/>
      <p>— The Pragati Team</p>
    `,
    });
};

const sendRejectionEmail = async (to, companyName, reason) => {
    await getClient().emails.send({
        from:    FROM,
        to,
        subject: 'Registration update — Pragati',
        html: `
      <h2>Dear ${companyName},</h2>
      <p>After review, we were unable to approve your company registration at this time.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>Please address the above and resubmit your application, or contact our support team if you have questions.</p>
      <br/>
      <p>— The Pragati Team</p>
    `,
    });
};

const sendSuspensionEmail = async (to, companyName, reason) => {
    await getClient().emails.send({
        from:    FROM,
        to,
        subject: 'Account suspended — Pragati',
        html: `
      <h2>Dear ${companyName},</h2>
      <p>Your company account on <strong>Pragati</strong> has been suspended.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>If you believe this is an error or wish to appeal, please contact our support team.</p>
      <br/>
      <p>— The Pragati Team</p>
    `,
    });
};

const sendReinstatementEmail = async (to, companyName) => {
    await getClient().emails.send({
        from:    FROM,
        to,
        subject: 'Account reinstated — Pragati',
        html: `
      <h2>Dear ${companyName},</h2>
      <p>Your company account on <strong>Pragati</strong> has been <strong>reinstated</strong>.</p>
      <p>You now have full access to the platform again. Please ensure your account complies with our policies going forward.</p>
      <p>Log in to resume your activity.</p>
      <br/>
      <p>— The Pragati Team</p>
    `,
    });
};

const sendDriveInviteEmail = async (to, companyName, driveName, deadline) => {
    await getClient().emails.send({
        from:    FROM,
        to,
        subject: `You're invited to join ${driveName} — Pragati`,
        html: `
      <h2>Dear ${companyName},</h2>
      <p>You have been invited to participate in the recruitment drive: <strong>${driveName}</strong>.</p>
      <p><strong>Application Deadline:</strong> ${deadline}</p>
      <p>Log in to your dashboard to review the drive details and confirm your participation.</p>
      <br/>
      <p>— The Pragati Team</p>
    `,
    });
};

// TODO: Wire this up to a cron job (node-cron or job queue) — not request-triggered.
const sendWeeklyReportEmail = async (to, companyName, stats, rank) => {
    await getClient().emails.send({
        from:    FROM,
        to,
        subject: 'Your weekly performance summary — Pragati',
        html: `
      <h2>Weekly Report — ${companyName}</h2>
      <p>Here's your performance snapshot for this week:</p>
      <ul>
        <li><strong>Ranking:</strong> #${rank}</li>
        <li><strong>Engagement Score:</strong> ${stats.engagementScore}</li>
        <li><strong>Total Hires:</strong> ${stats.totalHires}</li>
        <li><strong>Offer Acceptance Rate:</strong> ${stats.offerAcceptanceRate}%</li>
        <li><strong>Interview-to-Hire Rate:</strong> ${stats.interviewToHireRate}%</li>
      </ul>
      <p>Log in to your dashboard for the full breakdown.</p>
      <br/>
      <p>— The Pragati Team</p>
    `,
    });
};

export {
    sendApprovalEmail,
    sendRejectionEmail,
    sendSuspensionEmail,
    sendReinstatementEmail,
    sendDriveInviteEmail,
    sendWeeklyReportEmail,
};
