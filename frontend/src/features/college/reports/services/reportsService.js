import { reports as initialReports, reportStatistics as initialStats } from "../types/reportsDummyData";
import { getReportMockDetails, generateCSVContent, generateExcelXMLContent, downloadBlob } from "../utils/reportsHelpers";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getStoredReports = () => {
  const data = localStorage.getItem("uptoskills_reports");
  if (!data) {
    localStorage.setItem("uptoskills_reports", JSON.stringify(initialReports));
    return initialReports;
  }
  return JSON.parse(data);
};

const getStoredStats = () => {
  const data = localStorage.getItem("uptoskills_report_stats");
  if (!data) {
    localStorage.setItem("uptoskills_report_stats", JSON.stringify(initialStats));
    return initialStats;
  }
  return JSON.parse(data);
};

const saveReports = (reports) => {
  localStorage.setItem("uptoskills_reports", JSON.stringify(reports));
};

const saveStats = (stats) => {
  localStorage.setItem("uptoskills_report_stats", JSON.stringify(stats));
};

export const getReports = async () => {
  await delay(600); // Simulate API latency
  const reportsList = getStoredReports();
  const statistics = getStoredStats();
  return {
    success: true,
    data: {
      reports: reportsList,
      reportStatistics: statistics
    }
  };
};

export const generateReport = async (reportData) => {
  await delay(1200); // Simulate processing latency for generation
  const reportsList = getStoredReports();
  const statistics = getStoredStats();

  const sizeKb = Math.floor(Math.random() * 3500) + 450;
  const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

  const newReport = {
    id: reportsList.length > 0 ? Math.max(...reportsList.map(r => r.id)) + 1 : 1,
    reportName: reportData.reportName,
    type: reportData.type,
    generatedOn: new Date().toISOString().split("T")[0],
    status: "Generated",
    department: reportData.department,
    company: reportData.company,
    batch: reportData.batch,
    downloadCount: 0,
    size: sizeStr,
    generatedBy: reportData.generatedBy || "Placement Portal Admin",
    description: reportData.description || `Report details compiled for ${reportData.type} matching department ${reportData.department}, batch ${reportData.batch}, and company ${reportData.company}.`
  };

  const updatedReports = [newReport, ...reportsList];
  saveReports(updatedReports);

  const updatedStats = {
    ...statistics,
    totalReports: statistics.totalReports + 1,
    generatedToday: statistics.generatedToday + 1
  };
  saveStats(updatedStats);

  return {
    success: true,
    data: newReport
  };
};

export const previewReport = async (id) => {
  await delay(450);
  const reportsList = getStoredReports();
  const report = reportsList.find(r => r.id === Number(id));
  
  if (!report) {
    throw new Error(`Report with ID ${id} not found.`);
  }

  const previewDetails = getReportMockDetails(report);
  return {
    success: true,
    data: previewDetails
  };
};

export const deleteReport = async (id) => {
  await delay(500);
  const reportsList = getStoredReports();
  const reportExists = reportsList.some(r => r.id === Number(id));
  
  if (!reportExists) {
    throw new Error(`Report with ID ${id} not found.`);
  }

  const updatedReports = reportsList.filter(r => r.id !== Number(id));
  saveReports(updatedReports);

  const statistics = getStoredStats();
  const updatedStats = {
    ...statistics,
    totalReports: Math.max(0, statistics.totalReports - 1)
  };
  saveStats(updatedStats);

  return {
    success: true,
    data: { id }
  };
};

export const exportPDF = async (id) => {
  await delay(800);
  const reportsList = getStoredReports();
  const report = reportsList.find(r => r.id === Number(id));
  if (!report) throw new Error("Report not found");

  // Format printable stylesheet setup triggers
  const stats = getStoredStats();
  saveStats({
    ...stats,
    downloadedReports: stats.downloadedReports + 1
  });

  return {
    success: true,
    data: { url: `mock_pdf_stream_id_${id}.pdf`, report }
  };
};

export const exportExcel = async (id) => {
  await delay(700);
  const reportsList = getStoredReports();
  const report = reportsList.find(r => r.id === Number(id));
  if (!report) throw new Error("Report not found");

  // Build spreadsheet XML mock file
  const xmlContent = generateExcelXMLContent([report]);
  const safeName = report.reportName.replace(/\s+/g, "_").toLowerCase();
  downloadBlob(xmlContent, `${safeName}.xls`, "application/vnd.ms-excel");

  // Increment download counter
  const updatedReports = reportsList.map(r => r.id === Number(id) ? { ...r, downloadCount: r.downloadCount + 1 } : r);
  saveReports(updatedReports);
  const stats = getStoredStats();
  saveStats({ ...stats, downloadedReports: stats.downloadedReports + 1 });

  return { success: true };
};

export const exportCSV = async (id) => {
  await delay(500);
  const reportsList = getStoredReports();
  const report = reportsList.find(r => r.id === Number(id));
  if (!report) throw new Error("Report not found");

  // Build CSV content
  const csvContent = generateCSVContent([report]);
  const safeName = report.reportName.replace(/\s+/g, "_").toLowerCase();
  downloadBlob(csvContent, `${safeName}.csv`, "text/csv");

  // Increment download counter
  const updatedReports = reportsList.map(r => r.id === Number(id) ? { ...r, downloadCount: r.downloadCount + 1 } : r);
  saveReports(updatedReports);
  const stats = getStoredStats();
  saveStats({ ...stats, downloadedReports: stats.downloadedReports + 1 });

  return { success: true };
};

export const downloadReport = async (id) => {
  // Triggers default download (we fall back to CSV format for simplicity)
  return await exportCSV(id);
};
