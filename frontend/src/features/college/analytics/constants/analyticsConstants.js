export const API_ENDPOINTS = {
  DASHBOARD: "/analytics/dashboard",
  OVERVIEW: "/analytics/overview",
  PLACEMENTS: "/analytics/placements",
  PLACEMENT_TRENDS: "/analytics/placement-trends",
  COMPANIES: "/analytics/companies",
  COMPANY_REPORT: "/analytics/company-report",
  DEPARTMENTS: "/analytics/departments",
  DEPARTMENT_REPORT: "/analytics/department-report",
  STUDENTS: "/analytics/students",
  STUDENT_REPORT: "/analytics/student-report",
  EXPORT_PDF: "/analytics/export/pdf",
  EXPORT_EXCEL: "/analytics/export/excel",
};

export const REPORT_TYPES = [
  { value: "dashboard", label: "Dashboard Overview" },
  { value: "placements", label: "Placement Analytics" },
  { value: "companies", label: "Company Analytics" },
  { value: "departments", label: "Department Analytics" },
  { value: "students", label: "Student Analytics" },
];

export const EXPORT_FORMATS = {
  PDF: "pdf",
  EXCEL: "excel",
};

export const CHART_COLORS = {
  primary: "#2563eb",
  secondary: "#06B6D4",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  purple: "#8B5CF6",
  palette: ["#2563eb", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6"],
};

export const BATCH_OPTIONS = ["2024", "2025", "2026", "2027"];

export const DEPARTMENT_OPTIONS = [
  "All",
  "Computer Science Engineering",
  "Information Technology",
  "Electronics",
  "Mechanical Engineering",
];

export const COMPANY_OPTIONS = [
  "All",
  "Google",
  "Microsoft",
  "TCS",
  "Infosys",
  "TechCorp",
  "Innovate Ltd",
];
