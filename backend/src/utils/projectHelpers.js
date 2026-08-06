/**
 * Helper to calculate overall project progress percentage based on tasks and milestones.
 * @param {Array} milestones 
 * @param {Array} tasks 
 * @returns {number} Progress percentage (0-100)
 */
export const calculateProjectProgress = (milestones = [], tasks = []) => {
  if (milestones.length === 0 && tasks.length === 0) {
    return 0;
  }

  let milestoneWeight = 0.4;
  let taskWeight = 0.6;

  if (milestones.length === 0) {
    milestoneWeight = 0;
    taskWeight = 1.0;
  } else if (tasks.length === 0) {
    milestoneWeight = 1.0;
    taskWeight = 0;
  }

  const completedMilestones = milestones.filter(
    (m) => m.status === "COMPLETED"
  ).length;
  const milestoneScore = milestones.length > 0 ? (completedMilestones / milestones.length) * 100 : 0;

  const completedTasks = tasks.filter(
    (t) => t.status === "COMPLETED"
  ).length;
  const taskScore = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  const overallProgress = Math.round(
    milestoneScore * milestoneWeight + taskScore * taskWeight
  );

  return Math.min(100, Math.max(0, overallProgress));
};

/**
 * Validates a GitHub repository URL string.
 * @param {string} url 
 * @returns {boolean}
 */
export const isValidGitHubUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  const githubRegex = /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(\/)?$/;
  return githubRegex.test(url.trim());
};

/**
 * Generates structured analytical insights for a project.
 * @param {Object} projectData 
 * @returns {Object}
 */
export const generateProjectInsights = (projectData) => {
  const { milestones = [], tasks = [], submissions = [], reviews = [] } = projectData;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const pendingTasks = tasks.filter((t) => t.status === "TODO").length;
  const blockedTasks = tasks.filter((t) => t.status === "BLOCKED").length;

  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter((m) => m.status === "COMPLETED").length;

  const latestReview = reviews.length > 0 ? reviews[reviews.length - 1] : null;

  return {
    completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    taskBreakdown: {
      total: totalTasks,
      completed: completedTasks,
      inProgress: inProgressTasks,
      pending: pendingTasks,
      blocked: blockedTasks,
    },
    milestoneBreakdown: {
      total: totalMilestones,
      completed: completedMilestones,
      pending: totalMilestones - completedMilestones,
    },
    submissionCount: submissions.length,
    latestEvaluationScore: latestReview ? latestReview.score : null,
    overallHealth: blockedTasks > 2 ? "NEEDS_ATTENTION" : completedTasks / (totalTasks || 1) >= 0.75 ? "EXCELLENT" : "ON_TRACK",
  };
};

export class ApiError extends Error {
  constructor(statusCode = 400, message = "Error") {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}
