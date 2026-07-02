import { useEffect, useState } from "react";
import { getAnalyticsData } from "../services/analyticsService";

export default function useAnalytics() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    async function loadAnalytics() {
      const data = await getAnalyticsData();
      setAnalytics(data);
    }

    loadAnalytics();
  }, []);

  return analytics;
}