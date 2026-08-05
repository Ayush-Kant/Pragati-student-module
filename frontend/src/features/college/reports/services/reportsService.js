import api from "../../../../services/api";
import { downloadBlob } from "../utils/reportsHelpers";

/**
 * Maps raw backend report DB object to component-friendly properties.
 */
export const mapReport = (r) => {
  if (!r) return null;
  const content = typeof r.content === "string" ? JSON.parse(r.content || "{}") : (r.content || {});
  return {
    id: r.id,
    reportName: r.title || r.reportName || "Generated Report",
    title: r.title || r.reportName || "Generated Report",
    type: r.type ? (r.type.charAt(0).toUpperCase() + r.type.slice(1)) : "Placement",
    status: r.status ? (r.status.charAt(0).toUpperCase() + r.status.slice(1)) : "Completed",
    format: r.format || "json",
    generatedOn: r.createdAt ? r.createdAt.split("T")[0] : new Date().toISOString().split("T")[0],
    createdAt: r.createdAt,
    department: content.department || content.filtersApplied?.department || "CSE",
    company: content.company || content.filtersApplied?.company || "Google",
    batch: content.batch || content.filtersApplied?.batch || "2026",
    description: content.description || `Report compiled for ${r.type || "placement"} scope.`,
    generatedBy: content.generatedBy || "Placement Officer",
    downloadCount: r.downloadCount || 0,
    size: r.size || "1.2 MB",
    content
  };
};

export const getReports = async (params = {}) => {
  const { data } = await api.get("/reports", { params });
  if (data?.success && data?.data) {
    const rawReports = Array.isArray(data.data.reports) ? data.data.reports : [];
    const mapped = rawReports.map(mapReport);
    
    // Compute stats
    const totalReports = data.data.total || mapped.length;
    const todayStr = new Date().toISOString().split("T")[0];
    const generatedToday = mapped.filter((r) => r.generatedOn === todayStr).length;

    return {
      success: true,
      data: {
        reports: mapped,
        reportStatistics: {
          totalReports,
          generatedToday,
          downloadedReports: mapped.reduce((acc, r) => acc + (r.downloadCount || 0), 0)
        }
      }
    };
  }
  return data;
};

export const generateReport = async (reportData) => {
  const payload = {
    title: reportData.reportName || reportData.title,
    type: reportData.type || "placement",
    format: reportData.format || "json",
    content: {
      department: reportData.department,
      company: reportData.company,
      batch: reportData.batch,
      startDate: reportData.startDate,
      endDate: reportData.endDate,
      description: reportData.description,
      generatedBy: reportData.generatedBy || "Placement Officer",
      filtersApplied: {
        department: reportData.department,
        company: reportData.company,
        batch: reportData.batch
      }
    }
  };

  const { data } = await api.post("/reports/generate", payload);
  if (data?.success && data?.data) {
    return {
      success: true,
      data: mapReport(data.data)
    };
  }
  return data;
};

export const previewReport = async (id) => {
  const { data } = await api.get(`/reports/${id}/preview`);
  if (data?.success && data?.data) {
    const previewObj = data.data;
    return {
      success: true,
      data: {
        ...previewObj,
        title: previewObj.title || "Report Preview",
        type: previewObj.type || "Placement"
      }
    };
  }
  return data;
};

export const deleteReport = async (id) => {
  const { data } = await api.delete(`/reports/${id}`);
  return data;
};

export const exportPDF = async (id) => {
  const response = await api.get(`/reports/${id}/export/pdf`, {
    responseType: "blob"
  });
  downloadBlob(response.data, `report_${id}.pdf`, "application/pdf");
  return { success: true };
};

export const exportExcel = async (id) => {
  const response = await api.get(`/reports/${id}/export/excel`, {
    responseType: "blob"
  });
  downloadBlob(response.data, `report_${id}.csv`, "text/csv");
  return { success: true };
};

export const exportCSV = async (id) => {
  const response = await api.get(`/reports/${id}/export/csv`, {
    responseType: "blob"
  });
  downloadBlob(response.data, `report_${id}.csv`, "text/csv");
  return { success: true };
};

export const downloadReport = async (id) => {
  const response = await api.get(`/reports/${id}/download`, {
    responseType: "blob"
  });
  const contentType = response.headers["content-type"] || "application/octet-stream";
  const contentDisposition = response.headers["content-disposition"] || "";
  let filename = `report_${id}.pdf`;

  const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
  if (filenameMatch && filenameMatch[1]) {
    filename = filenameMatch[1];
  } else if (contentType.includes("csv")) {
    filename = `report_${id}.csv`;
  } else if (contentType.includes("json")) {
    filename = `report_${id}.json`;
  }

  downloadBlob(response.data, filename, contentType);
  return { success: true };
};

export default {
  getReports,
  generateReport,
  previewReport,
  deleteReport,
  exportPDF,
  exportExcel,
  exportCSV,
  downloadReport,
};
