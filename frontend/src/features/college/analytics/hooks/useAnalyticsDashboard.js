import { useState, useEffect, useCallback } from "react";
import * as analyticsService from "../services/analyticsService";
import {
  getDashboardAnalytics,
  getPlacementAnalytics,
  getCompanyAnalytics,
  getDepartmentAnalytics,
  getStudentAnalytics,
} from "../types/analyticsDummyData";

const USE_MOCK = true;

export const useAnalyticsDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [placementData, setPlacementData] = useState([]);
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
      } else {
        const [dash, place, comp, dept, stud] = await Promise.all([
          analyticsService.getDashboardAnalytics(),
          analyticsService.getPlacementAnalytics(),
          analyticsService.getCompanyAnalytics(),
          analyticsService.getDepartmentAnalytics(),
          analyticsService.getStudentAnalytics(),
        ]);
        setDashboardData(dash.data);
        setPlacementData(place.data);
        setCompanyData(comp.data);
        setDepartmentData(dept.data);
        setStudentData(stud.data);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    dashboardData,
    placementData,
    companyData,
    departmentData,
    studentData,
    loading,
    error,
    refresh: fetchAll,
  };
};
