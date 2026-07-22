import { useState, useEffect, useCallback } from 'react';
import { reportsService } from '../services/reportsService';

export const useCompanyReports = () => {
  const [kpis, setKpis] = useState(null);
  const [funnelData, setFunnelData] = useState([]);
  const [trendsData, setTrendsData] = useState(null);
  const [collegeData, setCollegeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReportsData = useCallback(async () => {
    try {
      setLoading(true);
      const [kpisRes, funnelRes, trendsRes, collegeRes] = await Promise.all([
        reportsService.getKPIs(),
        reportsService.getFunnel(),
        reportsService.getTrends(),
        reportsService.getCollegePerformance()
      ]);

      setKpis(kpisRes);
      setFunnelData(funnelRes);
      setTrendsData(trendsRes);
      setCollegeData(collegeRes);
      setError(null);
    } catch (err) {
      setError('Failed to fetch reports and analytics data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReportsData();
  }, [fetchReportsData]);

  const exportReport = useCallback(async () => {
    try {
      await reportsService.exportPerformanceReport();
    } catch (err) {
      console.error('Failed to export CSV performance report:', err);
    }
  }, []);

  return {
    kpis,
    funnelData,
    trendsData,
    collegeData,
    loading,
    error,
    exportReport,
    refetch: fetchReportsData
  };
};
