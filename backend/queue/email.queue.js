import Bull from "bull";
import { Resend } from "resend";
import { pool } from "../config/db.js";

// Redis is optional for local/student development. Do not create a Bull
// connection unless REDIS_URL is explicitly configured; this prevents Bull
// from repeatedly reconnecting to a missing local Redis instance and adding
// event listeners on every retry.
const REDIS_URL = String(process.env.REDIS_URL || "").trim();

let redisAvailable = Boolean(REDIS_URL);

export const isEmailQueueAvailable = () => redisAvailable;

const getResendClient = () => new Resend(process.env.RESEND_API_KEY);

const createDisabledQueue = () => ({
  add: async () => null,
  process: () => undefined,
  on: () => undefined,
  close: async () => undefined,
});

export const emailQueue = REDIS_URL
  ? new Bull("email-notifications", REDIS_URL, {
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    })
  : createDisabledQueue();

if (REDIS_URL) {
  emailQueue.process(async (job) => {
    const { userId, title, message, type } = job.data;

    const userResult = await pool.query(`SELECT email FROM users WHERE id = $1`, [userId]);
    if (!userResult.rows.length) throw new Error(`User ${userId} not found`);

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
    console.error(`Email job ${job.id} failed for user ${job.data.userId}:`, err.message);
  });

  emailQueue.on("error", (err) => {
    if (err?.code === "ECONNREFUSED") {
      redisAvailable = false;
      console.warn("⚠️ Redis is unavailable. Email notifications are disabled; database notifications remain enabled.");
    } else {
      console.error("Email queue error:", err?.message || err);
    }
  });

  emailQueue.on("ready", () => {
    redisAvailable = true;
  });
}
