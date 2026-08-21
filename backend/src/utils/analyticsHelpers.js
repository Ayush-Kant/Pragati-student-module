export const calculateConversionRates = (applications = []) => {
  const total = applications.length;
  if (total === 0) {
    return {
      shortlistedRate: 0,
      interviewConversionRate: 0,
      selectionConversionRate: 0,
      rejectionRate: 0,
    };
  }

  const shortlisted = applications.filter((a) =>
    ["SHORTLISTED", "ASSESSMENT", "TECHNICAL_INTERVIEW", "HR_INTERVIEW", "SELECTED"].includes(a.status)
  ).length;

  const inInterview = applications.filter((a) =>
    ["TECHNICAL_INTERVIEW", "HR_INTERVIEW", "SELECTED"].includes(a.status)
  ).length;

  const selected = applications.filter((a) => a.status === "SELECTED").length;
  const rejected = applications.filter((a) => a.status === "REJECTED").length;

  return {
    shortlistedRate: Math.round((shortlisted / total) * 100),
    interviewConversionRate: Math.round((inInterview / total) * 100),
    selectionConversionRate: Math.round((selected / total) * 100),
    rejectionRate: Math.round((rejected / total) * 100),
  };
};

export const calculateInterviewSuccessRate = (interviews = []) => {
  const total = interviews.length;
  if (total === 0) return 0;

  const completed = interviews.filter((i) => i.status === "COMPLETED").length;
  return Math.round((completed / total) * 100);
};

export const generateMonthlyTrends = (applications = []) => {
  const monthlyCounts = {};

  applications.forEach((app) => {
    const date = new Date(app.appliedDate || app.createdAt || Date.now());
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!monthlyCounts[monthKey]) {
      monthlyCounts[monthKey] = { total: 0, shortlisted: 0, selected: 0 };
    }
    monthlyCounts[monthKey].total += 1;
    if (["SHORTLISTED", "ASSESSMENT", "TECHNICAL_INTERVIEW", "HR_INTERVIEW", "SELECTED"].includes(app.status)) {
      monthlyCounts[monthKey].shortlisted += 1;
    }
    if (app.status === "SELECTED") {
      monthlyCounts[monthKey].selected += 1;
    }
  });

  return Object.keys(monthlyCounts)
    .sort()
    .map((month) => ({
      month,
      ...monthlyCounts[month],
    }));
};

export const calculateReadinessProgression = (history = []) => {
  if (!history || history.length === 0) {
    return [
      { month: "Month 1", score: 55 },
      { month: "Month 2", score: 68 },
      { month: "Month 3", score: 75 },
      { month: "Month 4", score: 82 },
    ];
  }
  return history;
};

export default {
  calculateConversionRates,
  calculateInterviewSuccessRate,
  generateMonthlyTrends,
  calculateReadinessProgression,
};
