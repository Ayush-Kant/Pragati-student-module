import { useState, useEffect, useCallback } from "react";
import * as service from "../services/reportsService";

export const useReports = () => {
  const [reports, setReports] = useState([]);
  const [statistics, setStatistics] = useState({
    totalReports: 0,
    generatedToday: 0,
    downloadedReports: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await service.getReports();
      if (response.success) {
        setReports(response.data.reports);
        setStatistics(response.data.reportStatistics);
      } else {
        setError("Failed to fetch reports from server.");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createReport = async (formData) => {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await service.generateReport(formData);
      if (response.success) {
        // Refresh local items
        await fetchReports();
        return { success: true, report: response.data };
      } else {
        throw new Error("Unable to create report.");
      }
    } catch (err) {
      setError(err.message || "Failed to generate report.");
      return { success: false, error: err.message };
    } finally {
      setIsGenerating(false);
    }
  };

  const removeReport = async (id) => {
    setError(null);
    try {
      const response = await service.deleteReport(id);
      if (response.success) {
        await fetchReports();
        return { success: true };
      } else {
        throw new Error("Unable to delete report.");
      }
    } catch (err) {
      setError(err.message || "Failed to delete report.");
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    statistics,
    isLoading,
    isGenerating,
    error,
    fetchReports,
    createReport,
    removeReport
  };
};

export default useReports;
