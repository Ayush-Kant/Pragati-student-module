// src/features/college/dashboard/hooks/useDashboardData.js
import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';

export const useDashboardData = () => {
  // Setup data states matching component layout properties
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
      
      // MAPPED TO MATCH TEAM DUMMY DATA STRUCTURE EXACTLY (Fixes Issue #2)
      if (response && response.success && response.data) {
        setDashboardStats(response.data.stats);
        setActivities(response.data.activities);
        setPlacementData(response.data.placements);
        setRevenueData(response.data.revenue);
        setAdmissionsData(response.data.admissions);
        
        // ❌ REMOVED VERIFICATION CONSOLE LOGS (Fixes Issue #4)
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch automatically on component layout initialization
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Expose system states and actions directly to view components
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