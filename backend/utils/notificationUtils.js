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

const handleExpiredToken = (error) => {
  if (
    error &&
    (error.name === "TokenExpiredError" ||
      error.message?.includes("jwt expired"))
  ) {
    return {
      success: false,
      status: 401,
      message: "JWT token expired",
    };
  }

  return null;
};

const handleZeroTasks = (tasks = []) => {
  if (!tasks || tasks.length === 0) {
    return {
      count: 0,
      tasks: [],
      message: "No pending tasks",
    };
  }

  return {
    count: tasks.length,
    tasks,
  };
};

module.exports = {
  processNotifications,
  handleExpiredToken,
  handleZeroTasks,
};