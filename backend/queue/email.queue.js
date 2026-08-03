import Bull from "bull";
import { Resend } from "resend";
import { pool } from "../config/db.js";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const getResendClient = () => {
  return new Resend(process.env.RESEND_API_KEY);
};

export const emailQueue = new Bull("email-notifications", REDIS_URL, {
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

emailQueue.process(async (job) => {
  const { userId, title, message, type } = job.data;

  const userResult = await pool.query(`SELECT email FROM users WHERE id = $1`, [
    userId,
  ]);

  if (!userResult.rows.length) {
    throw new Error(`User ${userId} not found`);
  }

  const email = userResult.rows[0].email;

  const client = getResendClient();
  await client.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: `[${type.toUpperCase()}] ${title}`,
    html: `<h2>${title}</h2><p>${message}</p>`,
  });
});

emailQueue.on("completed", (job) => {
  console.log(`Email job ${job.id} completed for user ${job.data.userId}`);
});

emailQueue.on("failed", (job, err) => {
  console.error(
    `Email job ${job.id} failed for user ${job.data.userId}:`,
    err.message,
  );
});
