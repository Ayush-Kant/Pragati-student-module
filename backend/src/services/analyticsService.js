import CareerRecommendation from "../models/careerRecommendationModel.js";
import PlacementAnalytics from "../models/placementAnalyticsModel.js";
import { getApplications } from "./applicationService.js";
import { getInterviews } from "./interviewService.js";
import { getReadinessReport } from "./readinessService.js";
import {
  calculateConversionRates,
  calculateInterviewSuccessRate,
  generateMonthlyTrends,
  calculateReadinessProgression,
} from "../utils/analyticsHelpers.js";

export const getPlacementAnalytics = async (studentId) => {
  const applications = await getApplications(studentId);
  const interviews = await getInterviews(studentId);
  const readiness = await getReadinessReport(studentId);

  const conversion = calculateConversionRates(applications);
  const interviewSuccessRate = calculateInterviewSuccessRate(interviews);
  const monthlyTrends = generateMonthlyTrends(applications);
  const readinessProgression = calculateReadinessProgression();

  const shortlistedCount = applications.filter((a) =>
    ["SHORTLISTED", "ASSESSMENT", "TECHNICAL_INTERVIEW", "HR_INTERVIEW", "SELECTED"].includes(a.status)
  ).length;

  const selectedCount = applications.filter((a) => a.status === "SELECTED").length;

  return {
    studentId,
    totalApplications: applications.length,
    shortlistedCount,
    interviewCount: interviews.length,
    selectedCount,
    readinessScore: readiness.overallReadinessScore,
    conversionRates: conversion,
    interviewSuccessRate,
    monthlyTrends,
    readinessProgression,
    calculatedAt: new Date().toISOString(),
  };
};

export const getCareerRecommendations = async (studentId) => {
  try {
    if (CareerRecommendation.sequelize) {
      const recs = await CareerRecommendation.findAll({
        where: { studentId },
      });
      if (recs && recs.length > 0) {
        return recs.map((r) => (r.toJSON ? r.toJSON() : r));
      }
    }
  } catch (e) {
    // Fallback
  }

  const readiness = await getReadinessReport(studentId);
  const highPriorityGaps = readiness.skillGaps.filter((g) => g.priority === "HIGH");

  const recommendations = [];

  if (highPriorityGaps.length > 0) {
    highPriorityGaps.forEach((gap) => {
      recommendations.push({
        id: recommendations.length + 1,
        studentId,
        title: `Improve ${gap.skill} Mastery`,
        priority: "HIGH",
        reason: `Current score (${gap.currentScore}) is significantly lower than target (${gap.targetScore}).`,
        currentState: `${gap.currentScore} / 100`,
        targetState: `${gap.targetScore} / 100`,
        recommendedAction: `Complete 15 targeted practice modules in ${gap.skill} and take a mock evaluation.`,
      });
    });
  } else {
    recommendations.push({
      id: 1,
      studentId,
      title: "Maintain Technical Excellence",
      priority: "MEDIUM",
      reason: "Your skill scores meet target thresholds. Focus on interview simulation.",
      currentState: "Placement Ready",
      targetState: "Top 5% Performer",
      recommendedAction: "Schedule mock technical and HR interview rounds to polish communication.",
    });
  }

  recommendations.push({
    id: recommendations.length + 1,
    studentId,
    title: "Expand Job Application Target Volume",
    priority: "MEDIUM",
    reason: "Consistent application volume directly increases interview conversion opportunities.",
    currentState: "Active Applications",
    targetState: "10+ Active Pipeline Applications",
    recommendedAction: "Apply to recommended high-match corporate drives this week.",
  });

  return recommendations;
};

export default {
  getPlacementAnalytics,
  getCareerRecommendations,
};
