export const calculateProgress = (completed, total) => {
  if (!total) return 0;
  return Math.round((completed / total) * 100);
};

export const calculateAverageScore = (scores = []) => {
  if (!scores.length) return 0;

  const total = scores.reduce((sum, score) => sum + score, 0);
  return Math.round(total / scores.length);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const getPerformanceStatus = (score) => {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 50) return "Average";
  return "Needs Improvement";
};