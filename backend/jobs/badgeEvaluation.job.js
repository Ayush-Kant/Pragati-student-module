import { evaluateAndAwardBadges } from "../services/badge.service.js";

export const triggerBadgeEvaluation = async (userId) => {
  console.log(`[Job] Running badge evaluation for user ID: ${userId}`);
  try {
    const newlyAwarded = await evaluateAndAwardBadges(userId);
    if (newlyAwarded.length > 0) {
      console.log(
        `[Job] Awarded ${newlyAwarded.length} new badge(s) to user ${userId}:`,
        newlyAwarded.map((b) => b.name),
      );
    } else {
      console.log(`[Job] No new badges earned for user ${userId}`);
    }
    return newlyAwarded;
  } catch (error) {
    console.error(`[Job] Failed badge evaluation for user ${userId}:`, error);
    throw error;
  }
};
