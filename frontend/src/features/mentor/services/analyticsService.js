export async function getAnalyticsData(filters = {}) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  console.log("Analytics Filters:", filters);

  return {
    kpis: {
      submissionRate: 92,
      avgScore: 78,
      avgReviewTime: "4.2h",
      lateRate: 4,
      passRate: 88,
    },

    velocity: [72, 48, 90, 80, 96, 108, 92],

    insights: [
      {
        title: "Architecture Weakness",
        description:
          "Architecture received the lowest average score across all submissions this week.",
        color: "red",
      },
      {
        title: "Testing Variance",
        description:
          "Testing module shows the highest variation between teams.",
        color: "purple",
      },
      {
        title: "Recommendation",
        description:
          "Consider scheduling a supplementary workshop focused on MVC architecture.",
        color: "teal",
      },
    ],

    teams: [
      {
        team: "Team Alpha",
        overall: 94,
        architecture: 88,
        codeQuality: 98,
        status: "Passed",
      },
      {
        team: "Team Beta",
        overall: 76,
        architecture: 60,
        codeQuality: 82,
        status: "Reviewed",
      },
      {
        team: "Team Gamma",
        overall: 54,
        architecture: 40,
        codeQuality: 65,
        status: "Failed",
      },
    ],
  };
}