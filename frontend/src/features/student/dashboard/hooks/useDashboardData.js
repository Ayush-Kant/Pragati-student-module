import { useState, useEffect, useCallback } from "react";
import { fetchStudentDashboard, fetchLeaderboard } from "../services/dashboardService";

export const useDashboardData = () => {
  const [data, setData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dashboardRes = await fetchStudentDashboard();
      setData(dashboardRes);
      
      if (dashboardRes?.activeDrive?.driveId) {
        const lbRes = await fetchLeaderboard(dashboardRes.activeDrive.driveId);
        setLeaderboard(lbRes);
      }
    } catch (err) {
      setError(err.message || "Unable to load your dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) loadData();
    return () => {
      isMounted = false;
    };
  }, [loadData]);

  return { data, leaderboard, loading, error, retry: loadData };
};