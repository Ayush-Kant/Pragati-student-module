import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create transporter from env
const getTransporter = () => {
  const host = process.env.SMTP_HOST || "smtp.ethereal.email";
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // If credentials are not provided, we can fallback to a test account or log
  if (!user || !pass) {
    console.warn(
      "⚠️ SMTP credentials not found in .env. Using mock JSON transporter.",
    );
    return nodemailer.createTransport({
      jsonTransport: true,
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
};

export const sendCertificateEmail = async ({
  toEmail,
  studentName,
  driveName,
  certificateUrl,
  verifyUrl,
  pdfPath,
}) => {
  try {
    const transporter = getTransporter();

    // Construct LinkedIn share link
    // Format: https://www.linkedin.com/sharing/share-offsite/?url=<URL>
    const encodedVerifyUrl = encodeURIComponent(verifyUrl);
    const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedVerifyUrl}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #2b6cb0; text-align: center;">Congratulations, ${studentName}!</h2>
        <p>We are pleased to inform you that you have successfully completed the recruitment drive <strong>${driveName}</strong> on the Pragati Placement Portal.</p>
        <p>Your official Certificate of Completion is attached to this email.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background-color: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Verify Certificate</a>
        </div>
        <p>You can also share your achievement directly on LinkedIn to showcase it to your network:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${linkedinShareUrl}" target="_blank" style="background-color: #0077b5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Share on LinkedIn</a>
        </div>
        <p style="color: #718096; font-size: 12px; margin-top: 40px; text-align: center;">This is an automated email from the Pragati Placement Portal.</p>
      </div>
    `;

    const mailOptions = {
      from:
        process.env.SMTP_FROM ||
        `"Pragati Placement Portal" <no-reply@pragati.com>`,
      to: toEmail,
      subject: `Certificate of Completion - ${driveName}`,
      html: htmlContent,
    };

    if (pdfPath) {
      mailOptions.attachments = [
        {
          filename: `Certificate_${studentName.replace(/\s+/g, "_")}.pdf`,
          path: pdfPath,
        },
      ];
    }

    const info = await transporter.sendMail(mailOptions);
    console.log("📨 Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Failed to send certificate email:", error);
    throw error;
  }
};
