export const analyticsOverview = {
  totalStudents: 2450,
  totalPlaced: 1280,
  placementRate: "82%",
  averagePackage: "12 LPA",
  topRecruiter: "Google",
  activeDrives: 15,
  totalCompanies: 45,
};

export const placementTrend = [
  { month: "Jan", placed: 120 },
  { month: "Feb", placed: 160 },
  { month: "Mar", placed: 210 },
  { month: "Apr", placed: 250 },
  { month: "May", placed: 180 },
  { month: "Jun", placed: 220 },
];

export const companyAnalytics = [
  { company: "Google", offers: 45 },
  { company: "Microsoft", offers: 35 },
  { company: "TCS", offers: 250 },
  { company: "Infosys", offers: 180 },
  { company: "TechCorp", offers: 80 },
  { company: "Innovate Ltd", offers: 60 },
];

export const departmentAnalytics = [
  { dept: "CSE", rate: 87.5, students: 240, placed: 210 },
  { dept: "IT", rate: 83.3, students: 180, placed: 150 },
  { dept: "ECE", rate: 75.0, students: 120, placed: 90 },
  { dept: "ME", rate: 50.0, students: 100, placed: 50 },
];

export const placementByYear = [
  { year: "2021", totalStudents: 2000, placed: 950, rate: 70.0, avgPkg: 6.5, maxPkg: 18.0 },
  { year: "2022", totalStudents: 2100, placed: 1050, rate: 72.5, avgPkg: 7.2, maxPkg: 22.0 },
  { year: "2023", totalStudents: 2200, placed: 1100, rate: 75.0, avgPkg: 8.0, maxPkg: 28.0 },
  { year: "2024", totalStudents: 2300, placed: 1180, rate: 78.2, avgPkg: 9.5, maxPkg: 32.0 },
  { year: "2025", totalStudents: 2400, placed: 1250, rate: 80.5, avgPkg: 11.2, maxPkg: 40.0 },
  { year: "2026", totalStudents: 2450, placed: 1280, rate: 82.0, avgPkg: 12.0, maxPkg: 45.0 },
];

export const packageDistribution = [
  { range: "3-6 LPA", count: 480 },
  { range: "6-10 LPA", count: 350 },
  { range: "10-15 LPA", count: 220 },
  { range: "15-25 LPA", count: 150 },
  { range: "25+ LPA", count: 80 },
];

export const monthlyHiring = [
  { month: "Jan", hired: 150, avgPkg: 8.5 },
  { month: "Feb", hired: 175, avgPkg: 9.0 },
  { month: "Mar", hired: 200, avgPkg: 9.5 },
  { month: "Apr", hired: 225, avgPkg: 10.0 },
  { month: "May", hired: 190, avgPkg: 10.5 },
  { month: "Jun", hired: 210, avgPkg: 11.0 },
];

export const studentPerformance = [
  { range: "9-10 CGPA", placed: 120, unplaced: 15 },
  { range: "8-9 CGPA", placed: 280, unplaced: 45 },
  { range: "7-8 CGPA", placed: 350, unplaced: 120 },
  { range: "<7 CGPA", placed: 180, unplaced: 200 },
];

export const getDashboardAnalytics = () => analyticsOverview;
export const getPlacementAnalytics = () => placementByYear;
export const getCompanyAnalytics = () => companyAnalytics;
export const getDepartmentAnalytics = () => departmentAnalytics;
export const getStudentAnalytics = () => ({
  statusCounts: [
    { status: "Placed", count: 1280 },
    { status: "Eligible", count: 800 },
    { status: "Unplaced", count: 370 },
  ],
  cgpaRanges: {
    range_9_10: 320,
    range_8_9: 680,
    range_7_8: 890,
    range_below_7: 560,
  },
});

export const analyticsApiResponse = {
  success: true,
  data: {
    analyticsOverview,
    placementTrend,
    companyAnalytics,
  },
};
