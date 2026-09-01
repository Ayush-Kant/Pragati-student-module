import CareerRecommendation from "../models/careerRecommendationModel.js";
import PlacementAnalytics from "../models/placementAnalyticsModel.js";
import sequelize from "../../config/sequelize.js";
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
  const readinessProgression = calculateReadinessProgression(readiness.history || []);

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
  const recs = await CareerRecommendation.findAll({
    where: { studentId },
  });
  if (recs && recs.length > 0) {
    return recs.map((r) => (r.toJSON ? r.toJSON() : r));
  }

  const readiness = await getReadinessReport(studentId);
  const highPriorityGaps = readiness.skillGaps.filter((g) => g.priority === "HIGH");

  const generated = [];

  if (highPriorityGaps.length > 0) {
    highPriorityGaps.forEach((gap) => {
      generated.push({
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
    generated.push({
      studentId,
      title: "Maintain Technical Excellence",
      priority: "MEDIUM",
      reason: "Your skill scores meet target thresholds. Focus on interview simulation.",
      currentState: "Placement Ready",
      targetState: "Top 5% Performer",
      recommendedAction: "Schedule mock technical and HR interview rounds to polish communication.",
    });
  }

  generated.push({
    studentId,
    title: "Expand Job Application Target Volume",
    priority: "MEDIUM",
    reason: "Consistent application volume directly increases interview conversion opportunities.",
    currentState: "Active Applications",
    targetState: "10+ Active Pipeline Applications",
    recommendedAction: "Apply to recommended high-match corporate drives this week.",
  });

  return await sequelize.transaction(async (transaction) => {
    const existingCheck = await CareerRecommendation.findAll({
      where: { studentId },
      transaction,
      lock: transaction.LOCK ? transaction.LOCK.UPDATE : undefined,
    });

    if (existingCheck && existingCheck.length > 0) {
      return existingCheck.map((r) => (r.toJSON ? r.toJSON() : r));
    }

    const createdRecs = await CareerRecommendation.bulkCreate(generated, { transaction });
    return createdRecs.map((r) => (r.toJSON ? r.toJSON() : r));
  });
};

export default {
  getPlacementAnalytics,
  getCareerRecommendations,
};
