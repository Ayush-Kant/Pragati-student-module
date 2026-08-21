import { SKILL_PRIORITY } from "../constants/placementConstants.js";

export const calculateOverallReadiness = (skillReadinessList = [], applications = [], interviews = []) => {
  if (skillReadinessList.length === 0) {
    return 65;
  }

  const totalCurrentScore = skillReadinessList.reduce(
    (acc, skill) => acc + (skill.currentScore || 0),
    0
  );
  const totalTargetScore = skillReadinessList.reduce(
    (acc, skill) => acc + (skill.targetScore || 80),
    0
  );

  let skillRatio = totalTargetScore > 0 ? totalCurrentScore / totalTargetScore : 0.7;
  let rawScore = Math.round(skillRatio * 100);

  const completedInterviews = interviews.filter((i) => i.status === "COMPLETED").length;
  const totalApps = applications.length;

  const appBonus = Math.min(10, totalApps * 0.5);
  const interviewBonus = Math.min(10, completedInterviews * 2);

  const finalScore = Math.min(100, Math.max(0, Math.round(rawScore * 0.8 + appBonus + interviewBonus)));
  return finalScore;
};

export const identifySkillGaps = (skillReadinessList = []) => {
  return skillReadinessList
    .map((item) => {
      const current = item.currentScore || 0;
      const target = item.targetScore || 80;
      const gap = Math.max(0, target - current);
      let priority = item.priority;

      if (!priority) {
        if (gap >= 25) priority = SKILL_PRIORITY.HIGH;
        else if (gap >= 10) priority = SKILL_PRIORITY.MEDIUM;
        else priority = SKILL_PRIORITY.LOW;
      }

      return {
        id: item.id,
        skill: item.skillName || item.skill,
        currentScore: current,
        targetScore: target,
        gap,
        priority,
        category: item.category || "Technical",
      };
    })
    .sort((a, b) => b.gap - a.gap);
};

export const determineSkillPriority = (currentScore, targetScore) => {
  const gap = (targetScore || 80) - (currentScore || 0);
  if (gap >= 25) return SKILL_PRIORITY.HIGH;
  if (gap >= 10) return SKILL_PRIORITY.MEDIUM;
  return SKILL_PRIORITY.LOW;
};

export default {
  calculateOverallReadiness,
  identifySkillGaps,
  determineSkillPriority,
};
