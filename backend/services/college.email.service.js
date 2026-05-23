// college.email.service.js

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Use this sender for all emails during development and testing:
// onboarding@resend.dev

const sendApprovalEmail = async (collegeEmail, collegeName) => {
    await resend.emails.send({
        from:    'onboarding@resend.dev',
        to:      collegeEmail,
        subject: 'Your College Registration Has Been Approved — Pragati',
        html: `
      <h2>Congratulations, ${collegeName}!</h2>
      <p>Your institution has been approved on the <strong>Pragati</strong> platform.</p>
      <p>You can now participate in recruitment drives and connect your students with top companies.</p>
      <p>Log in to your dashboard to get started.</p>
      <br/>
      <p>— The Pragati Team</p>
    `,
    });
};

const sendRejectionEmail = async (collegeEmail, collegeName, reason) => {
    await resend.emails.send({
        from:    'onboarding@resend.dev',
        to:      collegeEmail,
        subject: 'Update on Your College Registration — Pragati',
        html: `
      <h2>Dear ${collegeName},</h2>
      <p>After review, we were unable to approve your registration at this time.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>Please address the above and resubmit your application.</p>
      <br/>
      <p>— The Pragati Team</p>
    `,
    });
};

const sendSuspensionEmail = async (collegeEmail, collegeName, reason) => {
    await resend.emails.send({
        from:    'onboarding@resend.dev',
        to:      collegeEmail,
        subject: 'Important: Your Account Has Been Suspended — Pragati',
        html: `
      <h2>Dear ${collegeName},</h2>
      <p>Your institution's account on <strong>Pragati</strong> has been suspended.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>Please contact support to resolve this matter.</p>
      <br/>
      <p>— The Pragati Team</p>
    `,
    });
};

export { sendApprovalEmail, sendRejectionEmail, sendSuspensionEmail };