import { useEffect, useState } from "react";

import {
  getDashboardStats,
  getFunnelData,
  getCollegeStats,
  getActivityFeed,
} from "../services/companyService";

const useCompanyDashboard = () => {
  const [stats, setStats] = useState({});

  const [funnelData, setFunnelData] =
    useState([]);

  const [collegeStats, setCollegeStats] =
    useState([]);

  const [activities, setActivities] =
    useState([]);

  const [loading, setLoading] = useState(true);

  /* Fetch All APIs Together */

  const fetchDashboardData = async () => {
    try {
      const [
        statsResponse,
        funnelResponse,
        collegeResponse,
        activityResponse,
      ] = await Promise.all([
        getDashboardStats(),
        getFunnelData(),
        getCollegeStats(),
        getActivityFeed(),
      ]);

      setStats(statsResponse);

      setFunnelData(funnelResponse);

      setCollegeStats(collegeResponse);

      setActivities(activityResponse);
    } catch (error) {
      console.error(
        "Dashboard API Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    /* Initial API Call */

    fetchDashboardData();

    /* Refetch Every 30 Seconds */

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    /* Cleanup */

    return () => clearInterval(interval);
  }, []);

  return {
    stats,
    funnelData,
    collegeStats,
    activities,
    loading,
  };
};

export default useCompanyDashboard;