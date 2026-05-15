import {
  getActiveDrives,
  getPendingReviews,
  getUpcomingSessions,
  getTopStudents,
  getRecentNotifications
} from '../services/dashboard.service.js';

export const getDashboard = async (req, res) => {
  try {
    const mentorId = req.user.uid;

    const [
      activeDrives,
      pendingReviews,
      upcomingSessions,
      topStudents,
      recentNotifications
    ] = await Promise.all([
      getActiveDrives(mentorId),
      getPendingReviews(mentorId),
      getUpcomingSessions(mentorId),
      getTopStudents(mentorId),
      getRecentNotifications(mentorId)
    ]);

    res.status(200).json({
      activeDrives,
      pendingReviews,
      upcomingSessions,
      topStudents,
      recentNotifications
    });

  } catch (error) {
    console.error("Dashboard fetch error:", error);
    res.status(500).json({ error: 'Dashboard fetch failed' });
  }
};
