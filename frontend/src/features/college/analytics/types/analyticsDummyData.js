export const analyticsOverview = {
  totalStudents: 2450,
  totalPlaced: 1280,
  placementRate: "82%",
  averagePackage: "12 LPA"
};

export const placementTrend = [
  { month: "Jan", placed: 120 },
  { month: "Feb", placed: 160 },
  { month: "Mar", placed: 210 },
  { month: "Apr", placed: 250 }
];

export const companyAnalytics = [
  {
    company: "Google",
    offers: 25
  },
  {
    company: "Microsoft",
    offers: 18
  }
];

export const analyticsApiResponse = {
  success: true,
  data: {
    analyticsOverview,
    placementTrend,
    companyAnalytics
  }
};