// src/features/college/dashboard/hooks/useDashboardData.js
import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';

export const useDashboardData = () => {
  // Setup data states matching responsibilities
  const [dashboardStats, setDashboardStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [placementData, setPlacementData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [admissionsData, setAdmissionsData] = useState([]);
  
  // Loading & Error states handling
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Core Data Fetching and Refetch Logic
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await dashboardService.getDashboardSummary();
      if (response.success && response.data) {
        setDashboardStats(response.data.dashboardStats);
        setActivities(response.data.activities);
        setPlacementData(response.data.placementData);
        setRevenueData(response.data.revenueData);
        setAdmissionsData(response.data.admissionsData);

        // Verification Log prints details dynamically to your F12 Console
        console.log("🔥 RISHABH'S METRICS VERIFICATION:", {
          dashboardStats: response.data.dashboardStats,
          activities: response.data.activities,
          placementData: response.data.placementData,
          revenueData: response.data.revenueData,
          admissionsData: response.data.admissionsData,
        });
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch automatically on mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Expose states to components
  return {
    dashboardStats,
    activities,
    placementData,
    revenueData,
    admissionsData,
    isLoading,
    error,
    refetch: fetchDashboardData
  };
};