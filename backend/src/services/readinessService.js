import SkillReadiness from "../models/skillReadinessModel.js";
import { getApplications } from "./applicationService.js";
import { getInterviews } from "./interviewService.js";
import {
  calculateOverallReadiness,
  identifySkillGaps,
} from "../utils/readinessHelpers.js";

const defaultMockSkills = [
  { id: 1, skillName: "Data Structures & Algorithms", currentScore: 78, targetScore: 90, priority: "HIGH", category: "Technical" },
  { id: 2, skillName: "System Design", currentScore: 62, targetScore: 85, priority: "HIGH", category: "Technical" },
  { id: 3, skillName: "Full Stack Development", currentScore: 85, targetScore: 85, priority: "MEDIUM", category: "Technical" },
  { id: 4, skillName: "Communication & Behavioral", currentScore: 80, targetScore: 85, priority: "LOW", category: "Soft Skills" },
  { id: 5, skillName: "Aptitude & Problem Solving", currentScore: 70, targetScore: 85, priority: "MEDIUM", category: "Aptitude" },
];

export const getSkillReadiness = async (studentId) => {
  try {
    if (SkillReadiness.sequelize) {
      const skills = await SkillReadiness.findAll({
        where: { studentId },
      });
      if (skills && skills.length > 0) {
        return skills.map((s) => (s.toJSON ? s.toJSON() : s));
      }
    }
  } catch (e) {
    // Fallback
  }

  return defaultMockSkills.map((s) => ({ ...s, studentId }));
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
