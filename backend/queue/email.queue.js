import Queue from "bull";
import dotenv from "dotenv";

dotenv.config();

// Create the email queue
// We use the REDIS_URL if available in the environment, otherwise default to local redis
const emailQueue = new Queue("email_notifications", process.env.REDIS_URL || "redis://127.0.0.1:6379");

export const queueEmailNotification = async (jobData) => {
  try {
    // Add job to the queue
    await emailQueue.add(jobData, {
      attempts: 3,
      backoff: 5000, // Retry after 5 seconds
      removeOnComplete: true
    });
    console.log(`[Queue] Added email job for ${jobData.userIds.length} users`);
  } catch (error) {
    console.error("[Queue] Error adding email job:", error);
  }
};

export default emailQueue;
