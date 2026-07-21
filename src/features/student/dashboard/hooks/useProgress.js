import { useState, useEffect, useCallback } from 'react';
import { getLearningProgress } from '../services/dashboardService';
import { validateProgress } from '../validations/dashboardValidation';

export const useProgress = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProgressData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getLearningProgress();
      if (response.success) {
        // Validate progress & attendance schemas
        validateProgress(response.data);
        setData(response.data);
      } else {
        throw new Error('Failed to retrieve learning progress data.');
      }
    } catch (err) {
      console.error('[useProgress error]', err);
      setError(err.message || 'An unexpected error occurred while fetching progress data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgressData();
  }, [fetchProgressData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchProgressData
  };
};
