export const validatePerformanceData = (data) => {
  return data && typeof data === "object";
};

export const validateProgress = (progress) => {
  return progress >= 0 && progress <= 100;
};

export const validateStatistics = (statistics) => {
  return Array.isArray(statistics);
};

export const validateActivities = (activities) => {
  return Array.isArray(activities);
};