import {
  getDashboardOverview as getDashboardOverviewservices,
  getDashboardStats as getDashboardStatsservices,
  getDashboardActivities as getDashboardActivitiesservices,
  getPlacementAnalytics as getPlacementAnalyticsservices,
  getRevenueAnalytics as getRevenueAnalyticsservices,
  getAdmissionsAnalytics as getAdmissionsAnalyticsservices
} from "../services/college.dashboard.service.js";

export const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    // We pass userId to all services so they can filter by the specific college
    const [
      overview,
      stats,
      activities,
      placementAnalytics,
      revenueAnalytics,
      admissionsAnalytics
    ] = await Promise.all([
      getDashboardOverviewservices(userId),
      getDashboardStatsservices(userId),
      getDashboardActivitiesservices(userId),
      getPlacementAnalyticsservices(userId),
      getRevenueAnalyticsservices(userId),
      getAdmissionsAnalyticsservices(userId)
    ]);

    return res.status(200).json({
      success: true,
      data: {
        overview: overview.data,
        stats: stats.data,
        activities: activities.data,
        placementAnalytics: placementAnalytics.data,
        revenueAnalytics: revenueAnalytics.data,
        admissionsAnalytics: admissionsAnalytics.data,
      }
    });
  } catch (error) {
    next(error);
  }
};
