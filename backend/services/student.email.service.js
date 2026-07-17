const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
const sendPasswordResetEmail = async (studentEmail, studentName, resetLink) => {
await resend.emails.send({
from: 'onboarding@resend.dev',
to: studentEmail,
subject: 'Reset Your Password — Pragati',
html: `<h2>Hello, ${studentName}!</h2> <p>A password reset was requested for your Pragati account.</p> <p>Click the link below to reset your password. This link expires in 1 hour.</p> <a href="${resetLink}" style="background:#00B4D8;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;"> Reset Password </a> <p>If you did not request this, please ignore this email.</p> <br/> <p>— The Pragati Team</p>`
});
};


const sendUnblockEmail = async (studentEmail, studentName) => {
await resend.emails.send({
from: 'onboarding@resend.dev',
to: studentEmail,
subject: 'Your Account Has Been Reinstated — Pragati',
html: `<h2>Hello, ${studentName}!</h2> <p>Your account on the <strong>Pragati</strong> platform has been reinstated.</p> <p>You can now log in and continue participating in recruitment drives.</p> <br/> <p>— The Pragati Team</p>`
});
};


export default { sendPasswordResetEmail, sendUnblockEmail };