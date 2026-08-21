import { getApplications } from "./applicationService.js";
import { getInterviews } from "./interviewService.js";
import { getReadinessReport, getSkillReadiness } from "./readinessService.js";
import { getPlacementAnalytics, getCareerRecommendations } from "./analyticsService.js";

export const getPlacementDashboard = async (studentId) => {
  const [applications, interviews, readiness, analytics, recommendations, skills] =
    await Promise.all([
      getApplications(studentId),
      getInterviews(studentId),
      getReadinessReport(studentId),
      getPlacementAnalytics(studentId),
      getCareerRecommendations(studentId),
      getSkillReadiness(studentId),
    ]);

  const shortlistedCount = applications.filter((a) =>
    ["SHORTLISTED", "ASSESSMENT", "TECHNICAL_INTERVIEW", "HR_INTERVIEW", "SELECTED"].includes(a.status)
  ).length;

  const selectedCount = applications.filter((a) => a.status === "SELECTED").length;

  return {
    studentId,
    readinessScore: readiness.overallReadinessScore,
    applicationsCount: applications.length,
    shortlistedCount,
    interviewsCount: interviews.length,
    selectedCount,
    overallReadiness: readiness,
    applicationStatistics: {
      total: applications.length,
      shortlisted: shortlistedCount,
      selected: selectedCount,
      rejected: applications.filter((a) => a.status === "REJECTED").length,
      withdrawn: applications.filter((a) => a.status === "WITHDRAWN").length,
    },
    interviewStatistics: {
      total: interviews.length,
      scheduled: interviews.filter((i) => i.status === "SCHEDULED").length,
      completed: interviews.filter((i) => i.status === "COMPLETED").length,
      cancelled: interviews.filter((i) => i.status === "CANCELLED").length,
    },
    selectionStatistics: {
      selectedCount,
      conversionRate: analytics.conversionRates.selectionConversionRate,
    },
    skillReadiness: skills,
    careerRecommendations: recommendations,
    placementAnalytics: analytics,
  };
};

export default {
  getPlacementDashboard,
};
