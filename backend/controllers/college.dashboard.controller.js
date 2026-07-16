import {
  getDashboardOverview as getDashboardOverviewservices,
  getDashboardStats as getDashboardStatsservices,
  getDashboardActivities as getDashboardActivitiesservices,
  getPlacementAnalytics as getPlacementAnalyticsservices,
  getRevenueAnalytics as getRevenueAnalyticsservices,
  getAdmissionsAnalytics as getAdmissionsAnalyticsservices
} from "../services/college.dashboard.service.js";
import { resolveUserIntId } from "../utils/userResolver.js";

export const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const intUserId = await resolveUserIntId(userId);
    // We pass intUserId to all services so they can filter by the specific college
    const [
      overview,
      stats,
      activities,
      placementAnalytics,
      revenueAnalytics,
      admissionsAnalytics
    ] = await Promise.all([
      getDashboardOverviewservices(intUserId),
      getDashboardStatsservices(intUserId),
      getDashboardActivitiesservices(intUserId),
      getPlacementAnalyticsservices(intUserId),
      getRevenueAnalyticsservices(intUserId),
      getAdmissionsAnalyticsservices(intUserId)
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
