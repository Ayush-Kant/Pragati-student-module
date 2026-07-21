import { useState, useEffect, useCallback } from 'react';
import { getPerformanceSummary } from '../services/dashboardService';
import { validatePerformance } from '../validations/dashboardValidation';

export const usePerformance = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPerformanceData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getPerformanceSummary();
      if (response.success) {
        // Validate GPA, rank, and score objects
        validatePerformance(response.data);
        setData(response.data);
      } else {
        throw new Error('Failed to retrieve student performance summary.');
      }
    } catch (err) {
      console.error('[usePerformance error]', err);
      setError(err.message || 'An unexpected error occurred while fetching performance data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPerformanceData();
  }, [fetchPerformanceData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchPerformanceData
  };
};
