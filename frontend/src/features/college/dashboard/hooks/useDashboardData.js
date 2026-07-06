import { useState, useEffect } from 'react';
import { fetchDashboardData } from '../services/dashboardService';
import toast from 'react-hot-toast';

export default function useDashboardData() {
  const [dashboardStats, setDashboardStats] = useState([]);
  const [dashboardOverview, setDashboardOverview] = useState(null);
  const [dashboardActivities, setDashboardActivities] = useState([]);
  const [placementAnalytics, setPlacementAnalytics] = useState(null);
  const [revenueAnalytics, setRevenueAnalytics] = useState(null);
  const [admissionsAnalytics, setAdmissionsAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const res = await fetchDashboardData();
        if (res.success) {
          setDashboardStats(res.data.stats || []);
          setDashboardOverview(res.data.overview || null);
          setDashboardActivities(res.data.activities || []);
          setPlacementAnalytics(res.data.placementAnalytics || null);
          setRevenueAnalytics(res.data.revenueAnalytics || null);
          setAdmissionsAnalytics(res.data.admissionsAnalytics || null);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return { 
    dashboardStats, 
    dashboardOverview, 
    dashboardActivities,
    placementAnalytics,
    revenueAnalytics,
    admissionsAnalytics,
    isLoading 
  };
}