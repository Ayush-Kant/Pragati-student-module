import studentDashboardService from "../services/studentDashboard.service.js";

const getDashboard = async (req, res, next) => {
  try {
    const dashboard = await studentDashboardService.getDashboard(req.user);
    res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};

const getLeaderboard = async (req, res, next) => {
  try {
    const dashboard = await studentDashboardService.getDashboard(req.user);
    res.status(200).json({
      success: true,
      leaderboard: dashboard.leaderboard,
    });
  } catch (error) {
    next(error);
  }
};

const getNotifications = async (req, res, next) => {
  try {
    const dashboard = await studentDashboardService.getDashboard(req.user);
    res.status(200).json({
      success: true,
      notifications: dashboard.notifications,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getDashboard,
  getLeaderboard,
  getNotifications,
};
