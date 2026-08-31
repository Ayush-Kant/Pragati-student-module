import SkillReadiness from "../models/skillReadinessModel.js";
import { getApplications } from "./applicationService.js";
import { getInterviews } from "./interviewService.js";
import {
  calculateOverallReadiness,
  identifySkillGaps,
} from "../utils/readinessHelpers.js";

export const getSkillReadiness = async (studentId) => {
  const skills = await SkillReadiness.findAll({
    where: { studentId },
  });
  return skills.map((s) => (s.toJSON ? s.toJSON() : s));
};

export const getSkillGaps = async (studentId) => {
  const skills = await getSkillReadiness(studentId);
  return identifySkillGaps(skills);
};

export const getReadinessReport = async (studentId) => {
  const skills = await getSkillReadiness(studentId);
  const apps = await getApplications(studentId);
  const interviews = await getInterviews(studentId);

  const overallScore = calculateOverallReadiness(skills, apps, interviews);
  const gaps = identifySkillGaps(skills);

  let readinessLevel = "Needs Improvement";
  if (overallScore >= 85) readinessLevel = "Placement Ready";
  else if (overallScore >= 70) readinessLevel = "Good Progress";

  return {
    studentId,
    overallReadinessScore: overallScore,
    readinessLevel,
    evaluatedAt: new Date().toISOString(),
    totalSkillsTracked: skills.length,
    highPriorityGaps: gaps.filter((g) => g.priority === "HIGH").length,
    skills,
    skillGaps: gaps,
  };
};

export default {
  getSkillReadiness,
  getSkillGaps,
  getReadinessReport,
};
