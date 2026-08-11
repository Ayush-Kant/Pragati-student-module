import { useState, useEffect, useCallback } from "react";
import { projectService } from "../services/projectService";

export const useProjectAnalytics = (projectId) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getProjectAnalytics(projectId);
      setAnalytics(data);
    } catch (err) {
      setError(err.message || "Failed to fetch project analytics.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  };
};
