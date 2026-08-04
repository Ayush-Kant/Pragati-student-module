import { useState, useEffect, useCallback } from 'react';
import { getProjectAnalytics } from '../services/projectService';

export const useProjectAnalytics = (projectId) => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProjectAnalytics(projectId);
      setAnalytics(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch project analytics.');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    isLoading,
    error,
    refetch: fetchAnalytics,
  };
};
