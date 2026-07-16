import { useEffect, useState } from "react";
import { getAnalyticsData } from "../services/analyticsService";
export default function useAnalytics(filters) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);

       const data = await getAnalyticsData(filters);

        setAnalytics(data);
      } catch (err) {
        console.error("Failed to load analytics:", err);
        setError("Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [filters]);

  return {
    analytics,
    loading,
    error,
  };
}