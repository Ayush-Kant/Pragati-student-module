// services/company.email.service.js

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html,
    });

    console.log("Email sent:", response);
  } catch (error) {
    console.error(
      "Email sending failed:",
      error.message
    );
  }
};

const sendApprovalEmail = async (
  companyEmail,
  companyName
) => {
  await sendEmail(
    companyEmail,
    "Your registration has been approved",
    `
      <h2>Welcome, ${companyName}!</h2>

      <p>Your company registration has been approved on <strong>Pragati</strong>.</p>

      <p>You can now:</p>

      <ul>
        <li>Create recruitment drives</li>
        <li>Manage applicants</li>
        <li>Connect with colleges</li>
      </ul>

      <p>Please log in to your dashboard to continue.</p>

      <br/>

      <p>— Pragati Team</p>
    `
  );
};


const sendRejectionEmail = async (
  companyEmail,
  companyName,
  reason
) => {
  await sendEmail(
    companyEmail,
    "Registration update",
    `
      <h2>Hello ${companyName},</h2>

      <p>We were unable to approve your registration at this time.</p>

      <p><strong>Reason:</strong> ${reason}</p>

      <p>
        Please review the issue and reapply.
      </p>

      <p>
        For help, contact support.
      </p>

      <br/>

      <p>— Pragati Team</p>
    `
  );
};


const sendSuspensionEmail = async (
  companyEmail,
  companyName,
  reason
) => {
  await sendEmail(
    companyEmail,
    "Account suspended",
    `
      <h2>Hello ${companyName},</h2>

      <p>
        Your company account has been suspended.
      </p>

      <p><strong>Reason:</strong> ${reason}</p>

      <p>
        If you believe this is a mistake,
        please contact support or submit an appeal.
      </p>

      <br/>

      <p>— Pragati Team</p>
    `
  );
};

const sendReinstatementEmail = async (
  companyEmail,
  companyName
) => {
  await sendEmail(
    companyEmail,
    "Account reinstated",
    `
      <h2>Hello ${companyName},</h2>

      <p>
        Your company account has been reinstated.
      </p>

      <p>
        You may now continue using Pragati normally.
      </p>

      <br/>

      <p>— Pragati Team</p>
    `
  );
};

const sendDriveInviteEmail = async (
  companyEmail,
  companyName,
  driveName,
  deadline
) => {
  await sendEmail(
    companyEmail,
    `You're invited to join ${driveName}`,
    `
      <h2>Hello ${companyName},</h2>

      <p>
        You have been invited to participate in:
      </p>

      <p>
        <strong>${driveName}</strong>
      </p>

      <p>
        Application Deadline: ${deadline}
      </p>

      <br/>

      <p>— Pragati Team</p>
    `
  );
};

const sendWeeklyReportEmail = async (
  companyEmail,
  companyName,
  statsHtml
) => {
  await sendEmail(
    companyEmail,
    "Your weekly performance summary",
    `
      <h2>Hello ${companyName},</h2>

      <p>
        Here is your weekly performance report:
      </p>

      ${statsHtml}

      <br/>

      <p>— Pragati Team</p>
    `
  );
};

export {
  sendEmail,
  sendApprovalEmail,
  sendRejectionEmail,
  sendSuspensionEmail,
  sendReinstatementEmail,
  sendDriveInviteEmail,
  sendWeeklyReportEmail,
};