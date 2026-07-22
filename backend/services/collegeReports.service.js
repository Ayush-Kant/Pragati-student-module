/**
 * Location: backend/services/collegeReports.service.js
 */
import * as collegeReportsModel from "../models/collegeReports.model.js";
import { convertToCSV, convertToHTMLReport } from "../utils/exportHelper.js";

/**
 * Gets monthly report snapshots.
 */
export const getMonthlyReport = async (collegeId, query = {}) => {
  const data = await collegeReportsModel.getMonthlyReport(collegeId, query);
  return {
    success: true,
    data,
  };
};

/**
 * Gets yearly report snapshots.
 */
export const getYearlyReport = async (collegeId, query = {}) => {
  const data = await collegeReportsModel.getYearlyReport(collegeId, query);
  return {
    success: true,
    data,
  };
};

/**
 * Generates and processes exports for Excel/PDF formats.
 */
export const exportAnalytics = async (collegeId, format, reportType = "dashboard", query = {}) => {
  const data = await collegeReportsModel.exportAnalyticsReport(collegeId, reportType, query);
  
  const isExcel = format.toLowerCase() === "excel";
  const filename = `${reportType}_report_${Date.now()}.${isExcel ? "csv" : "html"}`;
  const contentType = isExcel ? "text/csv" : "text/html";

  let content = "";
  
  if (isExcel) {
    let headers = [];
    let labels = [];
    
    if (reportType === "placements") {
      headers = ["year", "total_students", "total_placed", "placement_rate", "average_package", "highest_package"];
      labels = ["Year", "Total Students", "Total Placed", "Placement Rate (%)", "Average Package (LPA)", "Highest Package (LPA)"];
    } else if (reportType === "companies") {
      headers = ["company_name", "total_hired", "average_package"];
      labels = ["Company Name", "Total Students Placed", "Average Salary Package (LPA)"];
    } else if (reportType === "departments") {
      headers = ["department_name", "department_code", "total_students", "total_placed", "placement_rate", "average_package"];
      labels = ["Department Name", "Code", "Total Students", "Placed Students", "Placement Rate (%)", "Average Salary Package (LPA)"];
    } else if (reportType === "students") {
      headers = ["enrollment_no", "name", "email", "department", "course", "cgpa", "placement_status", "placed_at", "package"];
      labels = ["Enrollment Number", "Student Name", "Email ID", "Department", "Course", "CGPA", "Status", "Placed At Company", "Salary Package"];
    } else {
      headers = ["total_students", "total_placed", "placement_rate", "average_package", "top_recruiter", "active_drives", "total_companies"];
      labels = ["Total Students", "Total Placed", "Placement Rate (%)", "Average Package (LPA)", "Top Recruiter", "Active Drives", "Total Companies Visited"];
    }
    
    content = convertToCSV(data, headers, labels);
  } else {
    // PDF Report HTML conversion
    let headers = [];
    let labels = [];
    let title = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Analytics Report`;
    
    if (reportType === "placements") {
      headers = ["year", "total_students", "total_placed", "placement_rate", "average_package", "highest_package"];
      labels = ["Year", "Total Students", "Total Placed", "Placement Rate (%)", "Average Package (LPA)", "Highest Package (LPA)"];
    } else if (reportType === "companies") {
      headers = ["company_name", "total_hired", "average_package"];
      labels = ["Company Name", "Total Students Placed", "Average Salary Package (LPA)"];
    } else if (reportType === "departments") {
      headers = ["department_name", "department_code", "total_students", "total_placed", "placement_rate", "average_package"];
      labels = ["Department Name", "Code", "Total Students", "Placed Students", "Placement Rate (%)", "Average Salary Package (LPA)"];
    } else if (reportType === "students") {
      headers = ["enrollment_no", "name", "email", "department", "course", "cgpa", "placement_status", "placed_at", "package"];
      labels = ["Enrollment Number", "Student Name", "Email ID", "Department", "Course", "CGPA", "Status", "Placed At Company", "Salary Package"];
    } else {
      headers = ["total_students", "total_placed", "placement_rate", "average_package", "top_recruiter", "active_drives", "total_companies"];
      labels = ["Total Students", "Total Placed", "Placement Rate (%)", "Average Package (LPA)", "Top Recruiter", "Active Drives", "Total Companies Visited"];
    }
    
    content = convertToHTMLReport(data, title, headers, labels);
  }

  return {
    content,
    contentType,
    filename,
  };
};

export default {
  getMonthlyReport,
  getYearlyReport,
  exportAnalytics,
};
