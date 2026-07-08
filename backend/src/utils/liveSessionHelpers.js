export const formatSessionResponse = (session) => {
  if (!session) return null;
  return {
    ...session,
    formattedScheduledAt: session.scheduledAt
      ? new Date(session.scheduledAt).toLocaleString()
      : null,
  };
};

export const calculateDurationInMinutes = (durationStr) => {
  if (!durationStr) return 0;
  const lowercase = durationStr.toLowerCase();
  if (lowercase.includes("hour")) {
    const hours = parseFloat(lowercase);
    return Math.round(hours * 60);
  }
  if (lowercase.includes("minute")) {
    return parseInt(lowercase, 10) || 0;
  }
  return parseInt(durationStr, 10) || 0;
};

export default {
  formatSessionResponse,
  calculateDurationInMinutes,
};
