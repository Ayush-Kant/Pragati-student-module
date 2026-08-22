import { useState, useEffect, useCallback } from "react";
import * as analyticsService from "../services/analyticsService";

export const useAnalyticsReports = (
  reportType = "Overview",
  activeFilters = {},
) => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (activeFilters.batch && activeFilters.batch !== "All")
        params.batch = activeFilters.batch;
      if (activeFilters.department && activeFilters.department !== "All")
        params.department = activeFilters.department;
      if (activeFilters.company && activeFilters.company !== "All")
        params.company = activeFilters.company;
      if (activeFilters.dateRange?.start)
        params.startDate = activeFilters.dateRange.start;
      if (activeFilters.dateRange?.end)
        params.endDate = activeFilters.dateRange.end;

      let res;
      const type = reportType?.toLowerCase();
      if (type === "placements") {
        res = await analyticsService.getPlacementAnalytics(params);
      } else if (type === "companies") {
        res = await analyticsService.getCompanyAnalytics(params);
      } else if (type === "departments") {
        res = await analyticsService.getDepartmentAnalytics(params);
      } else if (type === "students") {
        res = await analyticsService.getStudentAnalytics(params);
      } else {
        res = await analyticsService.getDashboardAnalytics(params);
      }

      setReportData(res?.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch report data.");
    } finally {
      setLoading(false);
    }
  }, [
    reportType,
    activeFilters.department,
    activeFilters.company,
    activeFilters.batch,
    activeFilters.dateRange?.start,
    activeFilters.dateRange?.end,
  ]);

  const exportReport = useCallback(
    async (format = "PDF") => {
      try {
        setExporting(true);
        const mappedFormat = format.toLowerCase() === "excel" ? "excel" : "pdf";
        const rawReportType = reportType.toLowerCase();
        const mappedReportType =
          rawReportType === "overview" ? "dashboard" : rawReportType;

        const blob = await analyticsService.exportAnalytics(
          mappedFormat,
          mappedReportType,
        );
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${mappedReportType}_report_${Date.now()}.${mappedFormat === "pdf" ? "html" : "csv"}`,
        );
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
        return true;
      } catch (err) {
        setError(err.message || "File compilation stream fault.");
        console.error("File compilation stream fault.", err);
        return false;
      } finally {
        setExporting(false);
      }
    },
    [reportType],
  );

  const executeExport = useCallback(
    async (format = "PDF") => {
      return await exportReport(format);
    },
    [exportReport],
  );

  const printReportElement = useCallback((containerId) => {
    const content = document.getElementById(containerId);
    if (!content) {
      console.warn(`Analytics print target not found: ${containerId}`);
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      console.warn("Unable to open print window for analytics report");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Analytics Report</title>
          <style>body{font-family: system-ui, sans-serif; padding: 20px;}</style>
        </head>
        <body>${content.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  return {
    reportData,
    loading,
    error,
    exporting,
    executeExport,
    printReportElement,
    refreshReport: fetchReportData,
    exportReport,
  };
};
