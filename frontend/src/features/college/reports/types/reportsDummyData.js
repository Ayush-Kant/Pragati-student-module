export const reports = [
  {
    id: 1,
    reportName: "Placement Report 2026",
    type: "Placement",
    generatedOn: "2026-10-12",
    status: "Generated",
    department: "CSE",
    company: "Google",
    batch: "2026",
    downloadCount: 15,
    size: "1.2 MB",
    generatedBy: "Dr. A. K. Sharma",
    description: "Annual placement performance summary for the batch of 2026, including average packages and tier-1 selections."
  },
  {
    id: 2,
    reportName: "Department Report",
    type: "Department",
    generatedOn: "2026-10-15",
    status: "Completed",
    department: "ECE",
    company: "All Companies",
    batch: "2025",
    downloadCount: 8,
    size: "850 KB",
    generatedBy: "Prof. Priya Nair",
    description: "Academic and placement breakdown for the Electronics & Communication Engineering department."
  },
  {
    id: 3,
    reportName: "Student Performance Analytics",
    type: "Student",
    generatedOn: "2026-10-18",
    status: "Generated",
    department: "CSE",
    company: "Microsoft",
    batch: "2026",
    downloadCount: 22,
    size: "2.4 MB",
    generatedBy: "System Auto-Gen",
    description: "Detailed analytics of student test scores, coding round performance, and interview conversion ratios."
  },
  {
    id: 4,
    reportName: "Google Placement Drive Summary",
    type: "Drive",
    generatedOn: "2026-10-20",
    status: "Completed",
    department: "CSE",
    company: "Google",
    batch: "2026",
    downloadCount: 30,
    size: "1.8 MB",
    generatedBy: "Dr. A. K. Sharma",
    description: "Comprehensive summary of Google's on-campus drive, selected students list, and compensation details."
  },
  {
    id: 5,
    reportName: "Company Recruitment Analytics",
    type: "Company",
    generatedOn: "2026-10-21",
    status: "Generated",
    department: "All Departments",
    company: "TCS",
    batch: "2025",
    downloadCount: 4,
    size: "3.1 MB",
    generatedBy: "Placement Office",
    description: "Recruitment metrics, hiring trends, and feedback analysis for Tata Consultancy Services."
  },
  {
    id: 6,
    reportName: "Mechanical Department Report 2025",
    type: "Department",
    generatedOn: "2026-10-22",
    status: "Completed",
    department: "ME",
    company: "All Companies",
    batch: "2025",
    downloadCount: 2,
    size: "720 KB",
    generatedBy: "Prof. Rajesh Kumar",
    description: "Core hiring statistics, manufacturing sector partners, and internship achievements."
  },
  {
    id: 7,
    reportName: "Vantage Analytics Report Q3",
    type: "Analytics",
    generatedOn: "2026-10-24",
    status: "Completed",
    department: "All Departments",
    company: "All Companies",
    batch: "2026",
    downloadCount: 12,
    size: "4.5 MB",
    generatedBy: "System Auto-Gen",
    description: "Quarterly review of overall placement statistics, drive activity, and training assessment indicators."
  },
  {
    id: 8,
    reportName: "Microsoft Drive Selected List",
    type: "Drive",
    generatedOn: "2026-10-25",
    status: "Generated",
    department: "CSE",
    company: "Microsoft",
    batch: "2026",
    downloadCount: 19,
    size: "1.1 MB",
    generatedBy: "Placement Office",
    description: "Shortlisted candidates and package breakdowns for Microsoft India recruitment drive."
  }
];

export const reportStatistics = {
  totalReports: 45,
  generatedToday: 6,
  downloadedReports: 120
};

export const reportsApiResponse = {
  success: true,
  data: {
    reports,
    reportStatistics
  }
};
