import { useState, useEffect, useCallback } from "react";
import * as analyticsService from "../services/analyticsService";
import {
  getDashboardAnalytics,
  getPlacementAnalytics,
  getCompanyAnalytics,
  getDepartmentAnalytics,
  getStudentAnalytics,
} from "../types/analyticsDummyData";

const USE_MOCK = false;

export const useAnalyticsDashboard = (filters = {}) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [placementData, setPlacementData] = useState([]);
  const [placementTrendsData, setPlacementTrendsData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 500));
        setDashboardData(getDashboardAnalytics());
        setPlacementData(getPlacementAnalytics());
        setCompanyData(getCompanyAnalytics());
        setDepartmentData(getDepartmentAnalytics());
        setStudentData(getStudentAnalytics());
        setPlacementTrendsData([]);
      } else {
        const params = {};
        if (filters.batch && filters.batch !== "All") params.batch = filters.batch;
        if (filters.department && filters.department !== "All") params.department = filters.department;
        if (filters.company && filters.company !== "All") params.company = filters.company;
        if (filters.dateRange?.start) params.startDate = filters.dateRange.start;
        if (filters.dateRange?.end) params.endDate = filters.dateRange.end;

        const [dash, place, placeTrends, comp, dept, stud] = await Promise.all([
          analyticsService.getDashboardAnalytics(params),
          analyticsService.getPlacementAnalytics(params),
          analyticsService.getPlacementTrends(params),
          analyticsService.getCompanyReport(params),
          analyticsService.getDepartmentReport(params),
          analyticsService.getStudentReport(params),
        ]);
        setDashboardData(dash.data);
        setPlacementData(place.data);
        setPlacementTrendsData(placeTrends.data);
        setCompanyData(comp.data);
        setDepartmentData(dept.data);
        setStudentData(stud.data);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    dashboardData,
    placementData,
    placementTrendsData,
    companyData,
    departmentData,
    studentData,
    loading,
    error,
    refresh: fetchAll,
  };
};
