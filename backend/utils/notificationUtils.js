const processNotifications = (notifications = []) => {
  if (!Array.isArray(notifications)) {
    return [];
  }

  return notifications.map((notification) => ({
    id: notification.id,
    title: notification.title,
    message: notification.message,
    read: notification.read || false,
    createdAt: notification.created_at,
  }));
};

const handleZeroTasks = (tasks = []) => {
  if (!tasks || tasks.length === 0) {
    return {
      totalTasks: 0,
      pendingTasks: [],
      message: "No pending tasks",
    };
  }

  return {
    totalTasks: tasks.length,
    pendingTasks: tasks,
  };
};

const sanitizeReadinessScore = (student = {}) => {
  const { overall_score, ...safeStudent } = student;
  return safeStudent;
};

const injectIsSelf = (leaderboard = [], studentId) => {
  return leaderboard.map((student) => ({
    ...student,
    isSelf: student.id === studentId,
  }));
};

const aggregateDashboardPayload = (payload = {}) => {
  return {
    success: true,
    data: payload,
  };
};

module.exports = {
  processNotifications,
  handleZeroTasks,
  sanitizeReadinessScore,
  injectIsSelf,
  aggregateDashboardPayload,
};